"""Chroma vector store wrapper.

We bring our own embeddings (see embeddings.py) and hand Chroma raw vectors, so
the embedding backend stays swappable without touching the store.
"""
from __future__ import annotations

from functools import lru_cache

import chromadb

from ..config import get_settings


@lru_cache
def get_collection() -> "chromadb.api.models.Collection.Collection":
    s = get_settings()
    s.chroma_path.mkdir(parents=True, exist_ok=True)
    client = chromadb.PersistentClient(path=str(s.chroma_path))
    # cosine space suits normalized text embeddings.
    return client.get_or_create_collection(
        name=s.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )
