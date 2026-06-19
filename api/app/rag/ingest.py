"""Build the vector index from the MDX lessons (all configured locales).

Usage:
    uv run python -m app.rag.ingest

Idempotent: it rebuilds the collection from scratch each run so edited or newly
added lessons are always reflected. Each chunk is tagged with its locale; if a
locale's tree is missing a lesson, that lesson simply isn't indexed for that
locale (the website falls back to English for display, but retrieval stays
locale-accurate).
"""
from __future__ import annotations

from ..config import get_settings
from .chunk import chunk_dir
from .embeddings import get_embedder
from .store import reset_collection


def ingest() -> int:
    s = get_settings()

    all_chunks = []
    for locale in s.locale_list:
        content_dir = s.content_path_for(locale)
        if not content_dir.exists():
            print(f"[ingest] locale '{locale}': {content_dir} missing — skipping.")
            continue
        chunks = chunk_dir(content_dir, locale=locale)
        print(f"[ingest] locale '{locale}': {len(chunks)} chunks from {content_dir}")
        all_chunks.extend(chunks)

    if not all_chunks:
        print("[ingest] no lessons found — nothing to index.")
        return 0

    print(
        f"[ingest] {len(all_chunks)} chunks total; embedding with "
        f"backend='{s.embedding_backend}' model='{s.local_embedding_model}'…"
    )
    embedder = get_embedder()
    texts = [c.text for c in all_chunks]
    vectors: list[list[float]] = []
    batch = 32
    for i in range(0, len(texts), batch):
        vectors.extend(embedder.embed_documents(texts[i : i + batch]))
        print(f"[ingest] embedded {min(i + batch, len(texts))}/{len(texts)}", flush=True)

    # Recreate the collection so a change in embedding dimensionality (e.g.
    # switching to the 1024-dim multilingual model) can't collide with an old one.
    collection = reset_collection()

    collection.add(
        ids=[f"{c.locale}:{c.lesson_slug}#{c.chunk_index}" for c in all_chunks],
        embeddings=vectors,
        documents=[c.text for c in all_chunks],
        metadatas=[
            {
                "lesson_slug": c.lesson_slug,
                "lesson_title": c.lesson_title,
                "kind": c.kind,
                "section": c.section,
                "locale": c.locale,
            }
            for c in all_chunks
        ],
    )
    print(f"[ingest] indexed {len(all_chunks)} chunks into '{s.chroma_collection}'. Done.")
    return len(all_chunks)


if __name__ == "__main__":
    ingest()
