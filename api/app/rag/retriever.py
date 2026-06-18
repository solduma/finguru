"""Query the vector index for lesson passages relevant to a question."""
from __future__ import annotations

from dataclasses import dataclass

from ..config import get_settings
from .embeddings import get_embedder
from .store import get_collection


@dataclass
class Retrieved:
    text: str
    lesson_slug: str
    lesson_title: str
    kind: str
    section: str
    score: float  # cosine similarity (1 = identical)


def retrieve(query: str, top_k: int | None = None) -> list[Retrieved]:
    s = get_settings()
    k = top_k or s.rag_top_k
    embedder = get_embedder()
    qvec = embedder.embed([query])[0]

    collection = get_collection()
    res = collection.query(query_embeddings=[qvec], n_results=k)

    out: list[Retrieved] = []
    docs = res.get("documents", [[]])[0]
    metas = res.get("metadatas", [[]])[0]
    dists = res.get("distances", [[]])[0]
    for doc, meta, dist in zip(docs, metas, dists):
        out.append(
            Retrieved(
                text=doc,
                lesson_slug=meta.get("lesson_slug", ""),
                lesson_title=meta.get("lesson_title", ""),
                kind=meta.get("kind", ""),
                section=meta.get("section", ""),
                score=1.0 - float(dist),  # cosine distance -> similarity
            )
        )
    return out


if __name__ == "__main__":
    import sys

    q = " ".join(sys.argv[1:]) or "What does an overbought RSI actually mean?"
    print(f"Query: {q}\n")
    for r in retrieve(q):
        print(f"[{r.score:.3f}] {r.lesson_title} › {r.section}  ({r.lesson_slug})")
        print(f"        {r.text[:140].replace(chr(10), ' ')}…\n")
