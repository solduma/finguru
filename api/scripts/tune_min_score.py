"""Probe the live index to recalibrate agent.graph._MIN_SCORE after an
embedding-backend/model change (e.g. switching to Gemini).

Different embedding models produce different cosine-score distributions, so the
grounding threshold that decides "use the lesson vs. web-fallback" must be
retuned per model. This runs known ON-topic and OFF-topic questions (EN + KO)
through the real retriever and prints the score spread, then suggests a
threshold sitting between the two clusters.

    cd api && uv run python -m scripts.tune_min_score
"""
from __future__ import annotations

from app.rag.retriever import retrieve

# Questions the guide clearly covers (should score HIGH) vs. clearly off-topic
# ones the guide does not (should score LOW → web-fallback territory).
ON_TOPIC = [
    ("en", "What does an overbought RSI actually mean?"),
    ("en", "How do Bollinger Bands signal volatility?"),
    ("en", "What is the efficient frontier in portfolio theory?"),
    ("en", "Explain George Soros's theory of reflexivity."),
    ("ko", "상대강도지수(RSI)가 과매수라는 건 무슨 뜻인가요?"),
    ("ko", "볼린저 밴드는 변동성을 어떻게 나타내나요?"),
]
OFF_TOPIC = [
    ("en", "What's a good recipe for sourdough bread?"),
    ("en", "Who won the 2022 FIFA World Cup?"),
    ("en", "How do I change a flat tire on my car?"),
    ("ko", "김치찌개 맛있게 끓이는 법 알려줘"),
]


def _top(locale: str, q: str) -> float:
    hits = retrieve(q, locale=locale)
    return hits[0].score if hits else float("nan")


def main() -> None:
    print("=== ON-TOPIC (want HIGH top-1 score) ===")
    on = []
    for loc, q in ON_TOPIC:
        s = _top(loc, q)
        on.append(s)
        print(f"  [{loc}] {s:.4f}  {q}")
    print("\n=== OFF-TOPIC (want LOW top-1 score) ===")
    off = []
    for loc, q in OFF_TOPIC:
        s = _top(loc, q)
        off.append(s)
        print(f"  [{loc}] {s:.4f}  {q}")

    lo_on, hi_off = min(on), max(off)
    print("\n=== summary ===")
    print(f"  min ON-topic  : {lo_on:.4f}")
    print(f"  max OFF-topic : {hi_off:.4f}")
    if lo_on > hi_off:
        suggested = round((lo_on + hi_off) / 2, 2)
        print(f"  clean separation — suggested _MIN_SCORE ≈ {suggested}")
    else:
        print("  ⚠ clusters overlap; pick a value that keeps most ON-topic and "
              "rejects most OFF-topic, accepting some error.")


if __name__ == "__main__":
    main()
