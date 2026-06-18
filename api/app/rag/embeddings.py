"""Embedding backends, selected by config.

Default is local `fastembed` (ONNX, no torch) because the current Ollama Cloud
tier does not serve the embeddings endpoint. The interface is intentionally
tiny (`embed(texts) -> list[vector]`) so swapping to Ollama later is one class.
"""
from __future__ import annotations

from collections.abc import Sequence
from functools import lru_cache

import httpx

from ..config import get_settings


class Embedder:
    """Common interface. Subclasses implement `embed`."""

    dim: int

    def embed(self, texts: Sequence[str]) -> list[list[float]]:  # pragma: no cover
        raise NotImplementedError


class LocalEmbedder(Embedder):
    """fastembed (ONNX). Model downloaded once and cached on disk."""

    def __init__(self, model_name: str) -> None:
        from fastembed import TextEmbedding

        self._model = TextEmbedding(model_name=model_name)
        # Probe the dimensionality once.
        self.dim = len(next(iter(self._model.embed(["dimension probe"]))))

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
        return [v.tolist() for v in self._model.embed(list(texts))]


class OllamaEmbedder(Embedder):
    """Ollama Cloud /api/embed. Only works if the account's tier enables it."""

    def __init__(self, base_url: str, api_key: str, model: str) -> None:
        self.base_url = base_url.rstrip("/")
        self.api_key = api_key
        self.model = model
        self.dim = len(self.embed(["dimension probe"])[0])

    def embed(self, texts: Sequence[str]) -> list[list[float]]:
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
