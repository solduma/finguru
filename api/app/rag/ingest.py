"""Build the vector index from the MDX lessons.

Usage:
    uv run python -m app.rag.ingest

Idempotent: it rebuilds the collection from scratch each run so edited or newly
added lessons are always reflected.
"""
from __future__ import annotations

from ..config import get_settings
from .chunk import chunk_dir
from .embeddings import get_embedder
from .store import get_collection


def ingest() -> int:
    s = get_settings()
    content_dir = s.content_path
    print(f"[ingest] reading lessons from {content_dir}")
    chunks = chunk_dir(content_dir)
    if not chunks:
        print("[ingest] no lessons found — nothing to index.")
        return 0

    print(f"[ingest] {len(chunks)} chunks; embedding with backend='{s.embedding_backend}'…")
    embedder = get_embedder()
    vectors = embedder.embed([c.text for c in chunks])

    collection = get_collection()
    # Clear any prior contents so the index matches the current content exactly.
    existing = collection.get()
    if existing["ids"]:
        collection.delete(ids=existing["ids"])

    collection.add(
        ids=[f"{c.lesson_slug}#{c.chunk_index}" for c in chunks],
        embeddings=vectors,
        documents=[c.text for c in chunks],
        metadatas=[
            {
                "lesson_slug": c.lesson_slug,
                "lesson_title": c.lesson_title,
                "kind": c.kind,
                "section": c.section,
            }
            for c in chunks
        ],
    )
    print(f"[ingest] indexed {len(chunks)} chunks into '{s.chroma_collection}'. Done.")
    return len(chunks)


if __name__ == "__main__":
    ingest()
