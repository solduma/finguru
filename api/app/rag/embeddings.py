"""Embedding backends, selected by config.

Default is local `fastembed` (ONNX, no torch) because the current Ollama Cloud
tier does not serve the embeddings endpoint. The interface distinguishes
documents from queries because some models (the e5 family) require asymmetric
"passage:" / "query:" prefixes for good retrieval.
"""
from __future__ import annotations

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


@lru_cache
def get_embedder() -> Embedder:
    s = get_settings()
    if s.embedding_backend == "ollama":
        return OllamaEmbedder(s.ollama_base_url, s.ollama_api_key, s.ollama_embedding_model)
    return LocalEmbedder(s.local_embedding_model)
