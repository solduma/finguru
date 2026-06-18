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

# Only passages at least this similar are treated as real grounding. The local
# bge-small model has a high similarity floor (~0.4 even for unrelated text), so
# 0.5 cleanly separates genuine topic matches from noise. Retune if the
# embedding backend changes.
_MIN_SCORE = 0.5


class TutorState(TypedDict, total=False):
    question: str
    history: list[dict]
    retrieved: list  # list[Retrieved]
    messages: list[dict]  # final messages sent to the model


def _retrieve_node(state: TutorState) -> TutorState:
    hits = retrieve(state["question"])
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

    messages = [{"role": "system", "content": TUTOR_SYSTEM_PROMPT}]
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


def prepare(question: str, history: list[dict] | None = None) -> Prepared:
    """Run the (fast, non-LLM) part of the graph: retrieve + assemble prompt."""
    state: TutorState = _GRAPH.invoke(
        {"question": question, "history": history or []}
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
