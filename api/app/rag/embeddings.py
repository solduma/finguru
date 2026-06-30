"""Embedding backends, selected by config.

Backends:
- `local`  — fastembed (ONNX, no torch). Fully offline, no API cost, but the
  model loads into RAM (slow cold start, larger container image).
- `gemini` — Google Generative Language embeddings API. Keeps the runtime tiny
  (just an HTTP call), which is why the serverless deploy uses it.
- `ollama` — Ollama Cloud /api/embed (only if the account tier enables it).

The interface distinguishes documents from queries because retrieval models need
asymmetric handling: e5 uses text prefixes ("passage:"/"query:"), while Gemini
uses a `taskType` field (RETRIEVAL_DOCUMENT / RETRIEVAL_QUERY). Both map onto the
same `embed_documents` / `embed_query` split below.
"""
from __future__ import annotations

import math
import time
from collections.abc import Sequence
from functools import lru_cache

import httpx

from ..config import get_settings


class Embedder:
    """Common interface. Subclasses implement `_embed_raw`."""

    dim: int
    # e5 models need these prefixes; set per-model in __init__.
    query_prefix: str = ""
    doc_prefix: str = ""

    def _embed_raw(self, texts: Sequence[str]) -> list[list[float]]:  # pragma: no cover
        raise NotImplementedError

    def embed_documents(self, texts: Sequence[str]) -> list[list[float]]:
        return self._embed_raw([f"{self.doc_prefix}{t}" for t in texts])

    def embed_query(self, text: str) -> list[float]:
        return self._embed_raw([f"{self.query_prefix}{text}"])[0]

    # Backwards-compatible generic embed (treats input as documents).
    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        return self.embed_documents(texts)


class DailyQuotaExceeded(RuntimeError):
    """Raised when a provider's per-DAY quota (not the transient per-minute rate)
    is exhausted, so retrying today is futile. Ingest catches this to stop
    cleanly; resumable state means the next run continues where it left off."""


def _is_daily_quota(resp: "httpx.Response") -> bool:
    """True if a 429 is a per-DAY quota violation (vs. the per-minute rate)."""
    try:
        for d in resp.json().get("error", {}).get("details", []):
            for v in d.get("violations", []):
                if "PerDay" in (v.get("quotaId") or ""):
                    return True
    except Exception:
        pass
    return False


def _prefixes_for(model_name: str) -> tuple[str, str]:
    """(query_prefix, doc_prefix) for the model, if it needs asymmetric prefixes."""
    name = model_name.lower()
    if "e5" in name:
        return "query: ", "passage: "
    return "", ""


class LocalEmbedder(Embedder):
    """fastembed (ONNX). Model downloaded once and cached on disk."""

    def __init__(self, model_name: str) -> None:
        from fastembed import TextEmbedding

        self.query_prefix, self.doc_prefix = _prefixes_for(model_name)
        self._model = TextEmbedding(model_name=model_name)
        self.dim = len(next(iter(self._model.embed(["dimension probe"]))))

    def _embed_raw(self, texts: Sequence[str]) -> list[list[float]]:
        return [v.tolist() for v in self._model.embed(list(texts))]


class OllamaEmbedder(Embedder):
    """Ollama Cloud /api/embed. Only works if the account's tier enables it."""

    def __init__(self, base_url: str, api_key: str, model: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.query_prefix, self.doc_prefix = _prefixes_for(model)
        self.dim = len(self._embed_raw(["dimension probe"])[0])

    def _embed_raw(self, texts: Sequence[str]) -> list[list[float]]:
        headers = {"Authorization": f"Bearer {self.api_key}"}
        with httpx.Client(timeout=120) as client:
            r = client.post(
                f"{self.base_url}/api/embed",
                headers=headers,
                json={"model": self.model, "input": list(texts)},
            )
            r.raise_for_status()
            return r.json()["embeddings"]


class GeminiEmbedder(Embedder):
    """Google Generative Language embeddings API.

    No model in-process, so the container stays small and cold starts are fast —
    the reason the serverless deploy uses this. Asymmetric retrieval is expressed
    via `taskType` (RETRIEVAL_DOCUMENT for lessons, RETRIEVAL_QUERY for the user's
    question) rather than text prefixes, so the e5-style prefixes stay empty.

    Vectors are L2-normalized so cosine distance in Chroma behaves like the e5
    setup (Gemini returns unnormalized vectors).
    """

    # gemini-embedding-001 defaults to 3072 dims; we request 768 via Matryoshka
    # (MRL) truncation to keep vectors small. Truncated vectors are NOT unit-norm,
    # so re-normalization (below) is REQUIRED per Google's guidance.
    output_dim: int = 768
    # Free tier rate-limits aggressively; enough retries (capped at 60s each) to
    # ride out a per-minute window so bulk ingest self-throttles instead of dying.
    _max_retries: int = 8

    def __init__(self, api_key: str, model: str) -> None:
        if not api_key:
            raise RuntimeError(
                "GEMINI_API_KEY is empty but EMBEDDING_BACKEND=gemini. "
                "Set GEMINI_API_KEY in the environment."
            )
        self.api_key = api_key
        # Accept both "gemini-embedding-001" and "models/gemini-embedding-001".
        self.model = model if model.startswith("models/") else f"models/{model}"
        self.base_url = "https://generativelanguage.googleapis.com/v1beta"
        # e5-style prefixes are unused; Gemini distinguishes via task_type instead.
        self._doc_task = "RETRIEVAL_DOCUMENT"
        self._query_task = "RETRIEVAL_QUERY"
        self.dim = len(self._embed_task(["dimension probe"], self._doc_task)[0])

    @staticmethod
    def _normalize(vec: list[float]) -> list[float]:
        norm = math.sqrt(sum(x * x for x in vec))
        return [x / norm for x in vec] if norm else vec

    def _embed_task(self, texts: Sequence[str], task_type: str) -> list[list[float]]:
        # batchEmbedContents embeds many texts in one round-trip. The API key goes
        # in a header (NOT the query string) so it never leaks into request URLs,
        # error messages, or access logs.
        url = f"{self.base_url}/{self.model}:batchEmbedContents"
        requests = [
            {
                "model": self.model,
                "content": {"parts": [{"text": t}]},
                "taskType": task_type,
                "outputDimensionality": self.output_dim,
            }
            for t in texts
        ]
        payload = {"requests": requests}
        headers = {"x-goog-api-key": self.api_key}
        # The free tier has two 429s. The PER-MINUTE one is a sliding window: a
        # single request recovers within ~60s, but impatient sub-minute retries
        # keep it saturated, so we wait a full ~65s (or Retry-After) to let it
        # drain. The PER-DAY one (quotaId contains "PerDay") cannot recover today
        # — retrying is pointless, so we fail fast with a clear message. A query
        # at chat time can hit the per-minute limit too, not just bulk ingest.
        with httpx.Client(timeout=120) as client:
            for attempt in range(self._max_retries):
                r = client.post(url, headers=headers, json=payload)
                if r.status_code == 429:
                    if _is_daily_quota(r):
                        raise DailyQuotaExceeded(
                            "Gemini free-tier DAILY embed quota (1000 req/day) is "
                            "exhausted. Rerun after it resets (~midnight US "
                            "Pacific); the ingest resumes where it stopped."
                        )
                    if attempt < self._max_retries - 1:
                        wait = float(r.headers.get("Retry-After") or 0) or 65.0
                        time.sleep(wait)
                        continue
                r.raise_for_status()
                return [self._normalize(e["values"]) for e in r.json()["embeddings"]]
        # Exhausted retries on 429.
        r.raise_for_status()
        return []

    def embed_documents(self, texts: Sequence[str]) -> list[list[float]]:
        return self._embed_task(texts, self._doc_task)

    def embed_query(self, text: str) -> list[float]:
        return self._embed_task([text], self._query_task)[0]

    # The base `_embed_raw` is unused for this backend (we override the public
    # methods so each carries the right task_type), but keep the contract honest.
    def _embed_raw(self, texts: Sequence[str]) -> list[list[float]]:
        return self._embed_task(texts, self._doc_task)


@lru_cache
def get_embedder() -> Embedder:
    s = get_settings()
    if s.embedding_backend == "gemini":
        return GeminiEmbedder(s.gemini_api_key, s.gemini_embedding_model)
    if s.embedding_backend == "ollama":
        return OllamaEmbedder(s.ollama_base_url, s.ollama_api_key, s.ollama_embedding_model)
    return LocalEmbedder(s.local_embedding_model)
