"""Chroma vector store wrapper.

We bring our own embeddings (see embeddings.py) and hand Chroma raw vectors, so
the embedding backend stays swappable without touching the store.
"""
from __future__ import annotations

from functools import lru_cache

import chromadb

from ..config import get_settings


@lru_cache
def _client() -> "chromadb.api.ClientAPI":
    s = get_settings()
    s.chroma_path.mkdir(parents=True, exist_ok=True)
    return chromadb.PersistentClient(path=str(s.chroma_path))


@lru_cache
def get_collection() -> "chromadb.api.models.Collection.Collection":
    s = get_settings()
    # cosine space suits normalized text embeddings.
    return _client().get_or_create_collection(
        name=s.chroma_collection,
        metadata={"hnsw:space": "cosine"},
    )


def reset_collection() -> "chromadb.api.models.Collection.Collection":
    """Drop and recreate the collection. Used by ingest so a change in the
    embedding model's dimensionality can't collide with an old collection."""
    s = get_settings()
    client = _client()
    try:
        client.delete_collection(s.chroma_collection)
    except Exception:
        pass  # didn't exist yet
    get_collection.cache_clear()
    return get_collection()
