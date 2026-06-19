"""The RAG tutor as a LangGraph state machine.

    retrieve  ->  generate (streaming)

`retrieve` pulls relevant lesson passages from Chroma and packs them into a
context block plus a citation list. `generate` is intentionally a thin async
generator over the Ollama Cloud chat stream so the FastAPI route can forward
tokens as Server-Sent Events. The citations are computed up front and surfaced
to the route via `prepare()`, which the route emits before streaming tokens.
"""
from __future__ import annotations

from collections.abc import AsyncIterator
from dataclasses import dataclass, field
from typing import TypedDict

from langgraph.graph import END, START, StateGraph

from ..ollama_client import OllamaClient
from ..rag.retriever import Retrieved, retrieve

TUTOR_SYSTEM_PROMPT = (
    "You are FinGuru, a patient technical-analysis tutor for beginners. You teach "
    "from a specific study guide; lesson excerpts are provided as context.\n\n"
    "Rules:\n"
    "- Ground your answer in the provided lesson context. Prefer it over outside "
    "knowledge. If the context doesn't cover the question, say so plainly and give "
    "a careful general explanation, noting it's outside the guide.\n"
    "- Explain plainly, define jargon on first use, and use concrete examples.\n"
    "- You teach concepts and history. You do NOT give financial advice, price "
    "predictions, or buy/sell recommendations. If asked, redirect to the underlying "
    "concept and to risk management.\n"
    "- When you draw on a lesson, mention it by name (e.g., \"the RSI lesson\").\n"
    "- Keep answers focused and well-structured."
)

# Per-locale instruction appended to the system prompt so the tutor replies in
# the reader's language regardless of the language of the retrieved context.
_LANGUAGE_INSTRUCTION = {
    "en": "Respond in English.",
    "ko": (
        "한국어로 답하세요. 전문 용어는 처음 나올 때 한글 용어와 영어 원어를 함께 "
        "표기하세요(예: 상대강도지수(RSI)). 초보자도 이해할 수 있도록 친절하고 명확하게 "
        "설명하세요."
    ),
}

# Only passages at least this similar are treated as real grounding. Tuned for
# intfloat/multilingual-e5-large (with query:/passage: prefixes), whose cosine
# scores sit in a high, compressed band: genuine matches ~0.83-0.90, off-topic
# ~0.81. 0.82 separates them. Retune if the embedding backend changes.
_MIN_SCORE = 0.82


class TutorState(TypedDict, total=False):
    question: str
    history: list[dict]
    locale: str
    retrieved: list  # list[Retrieved]
    messages: list[dict]  # final messages sent to the model


def _retrieve_node(state: TutorState) -> TutorState:
    hits = retrieve(state["question"], locale=state.get("locale", "en"))
    hits = [h for h in hits if h.score >= _MIN_SCORE]
    return {"retrieved": hits}


def _build_messages(state: TutorState) -> TutorState:
    hits: list[Retrieved] = state.get("retrieved", [])
    if hits:
        context = "\n\n---\n\n".join(
            f"[Lesson: {h.lesson_title} › {h.section}]\n{h.text}" for h in hits
        )
        context_block = (
            "Here are the most relevant excerpts from the study guide:\n\n"
            f"{context}\n\n---\n"
        )
    else:
        context_block = (
            "No closely matching lesson was found in the study guide for this "
            "question. Answer carefully from general technical-analysis knowledge "
            "and say it isn't drawn from a specific lesson.\n"
        )

    locale = state.get("locale", "en")
    lang = _LANGUAGE_INSTRUCTION.get(locale, _LANGUAGE_INSTRUCTION["en"])
    system = f"{TUTOR_SYSTEM_PROMPT}\n\n{lang}"

    messages = [{"role": "system", "content": system}]
    for turn in state.get("history", []):
        messages.append(turn)
    messages.append(
        {"role": "user", "content": f"{context_block}\nQuestion: {state['question']}"}
    )
    return {"messages": messages}


def build_graph():
    g = StateGraph(TutorState)
    g.add_node("retrieve", _retrieve_node)
    g.add_node("build", _build_messages)
    g.add_edge(START, "retrieve")
    g.add_edge("retrieve", "build")
    g.add_edge("build", END)
    return g.compile()


_GRAPH = build_graph()


@dataclass
class Prepared:
    messages: list[dict]
    citations: list[dict] = field(default_factory=list)


def prepare(
    question: str, history: list[dict] | None = None, locale: str = "en"
) -> Prepared:
    """Run the (fast, non-LLM) part of the graph: retrieve + assemble prompt."""
    state: TutorState = _GRAPH.invoke(
        {"question": question, "history": history or [], "locale": locale}
    )
    hits: list[Retrieved] = state.get("retrieved", [])
    # De-duplicate citations by lesson, keeping the best-scoring section.
    seen: dict[str, dict] = {}
    for h in hits:
        if h.lesson_slug not in seen:
            seen[h.lesson_slug] = {
                "title": h.lesson_title,
                "slug": h.lesson_slug,
                "kind": h.kind,
                "section": h.section,
            }
    return Prepared(messages=state["messages"], citations=list(seen.values()))


async def stream_answer(prepared: Prepared) -> AsyncIterator[str]:
    client = OllamaClient()
    async for delta in client.stream_chat(prepared.messages):
        yield delta
