"""Build the vector index from the MDX lessons (all configured locales).

Usage:
    uv run python -m app.rag.ingest            # incremental: skips chunks already indexed
    INGEST_RESET=1 uv run python -m app.rag.ingest   # force a clean rebuild

Incremental + RESUMABLE. Each chunk has a deterministic id (`{locale}:{slug}#{i}`)
and is written to Chroma as soon as it is embedded, so a crash or a rate-limit
abort never loses completed work — rerunning skips what's already indexed and
continues. This matters for the rate-limited Gemini backend (a full rebuild is
3000+ requests against a per-minute free-tier cap; without resume, every 429
would re-spend quota from zero). Pass INGEST_RESET=1 to wipe first, which you
MUST do when the embedding dimensionality changes (e.g. switching models).

Each chunk is tagged with its locale; if a locale's tree is missing a lesson,
that lesson simply isn't indexed for that locale (the website falls back to
English for display, but retrieval stays locale-accurate).
"""
from __future__ import annotations

import os
import time

from ..config import get_settings
from .chunk import chunk_dir
from .embeddings import DailyQuotaExceeded, get_embedder
from .store import get_collection, reset_collection


def _chunk_id(c) -> str:
    return f"{c.locale}:{c.lesson_slug}#{c.chunk_index}"


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

    model_name = {
        "gemini": s.gemini_embedding_model,
        "ollama": s.ollama_embedding_model,
    }.get(s.embedding_backend, s.local_embedding_model)

    # A clean rebuild (INGEST_RESET=1) is REQUIRED when the vector dimensionality
    # changes — an old collection of a different dim can't accept new vectors.
    # Guard the common foot-gun: when a multi-day rate-limited ingest is partway
    # done, a stray INGEST_RESET=1 would throw away all completed work (and the
    # quota it cost). Refuse unless FORCE_RESET=1 confirms intent.
    if os.getenv("INGEST_RESET") == "1":
        partial = get_collection().count()
        if partial and os.getenv("FORCE_RESET") != "1":
            print(
                f"[ingest] REFUSING to reset: {partial} chunks already indexed. "
                "Rerun WITHOUT INGEST_RESET to resume, or set FORCE_RESET=1 to "
                "wipe and start over."
            )
            return partial
        print("[ingest] INGEST_RESET=1 — wiping collection for a clean rebuild.")
        collection = reset_collection()
    else:
        collection = get_collection()

    # Resume: skip chunks already present so a prior aborted run isn't redone.
    existing = set(collection.get(include=[]).get("ids", []))
    todo = [c for c in all_chunks if _chunk_id(c) not in existing]
    skipped = len(all_chunks) - len(todo)
    print(
        f"[ingest] {len(all_chunks)} chunks total; {skipped} already indexed, "
        f"{len(todo)} to embed with backend='{s.embedding_backend}' "
        f"model='{model_name}'…"
    )
    if not todo:
        print(f"[ingest] nothing to do — '{s.chroma_collection}' is up to date.")
        return len(all_chunks)

    embedder = get_embedder()
    # Gemini's free tier rate-limits per minute, so keep batches small and pace
    # them under the cap (the embedder also retries on 429 as a safety net).
    # Local/Ollama backends ignore the pause. One-time offline cost.
    is_gemini = s.embedding_backend == "gemini"
    batch = 20 if is_gemini else 32
    pause = 20.0 if is_gemini else 0.0  # ~20 items / 20s ≈ 60/min (free-tier safe)

    done = 0
    for i in range(0, len(todo), batch):
        group = todo[i : i + batch]
        try:
            vectors = embedder.embed_documents([c.text for c in group])
        except DailyQuotaExceeded as e:
            # Free-tier daily cap hit. Completed batches are already in Chroma, so
            # stop cleanly — the next run resumes from here. Not an error exit.
            remaining = len(todo) - done
            print(f"\n[ingest] {e}")
            print(
                f"[ingest] stopped: {done} embedded this run, {remaining} left. "
                f"Rerun (no INGEST_RESET) after the quota resets to continue."
            )
            return done
        # Write THIS batch immediately so completed work survives a later abort.
        collection.add(
            ids=[_chunk_id(c) for c in group],
            embeddings=vectors,
            documents=[c.text for c in group],
            metadatas=[
                {
                    "lesson_slug": c.lesson_slug,
                    "lesson_title": c.lesson_title,
                    "kind": c.kind,
                    "section": c.section,
                    "locale": c.locale,
                }
                for c in group
            ],
        )
        done += len(group)
        print(f"[ingest] embedded + indexed {done}/{len(todo)}", flush=True)
        if pause and i + batch < len(todo):
            time.sleep(pause)

    print(f"[ingest] indexed {done} new chunks into '{s.chroma_collection}'. Done.")
    return len(all_chunks)


if __name__ == "__main__":
    ingest()
