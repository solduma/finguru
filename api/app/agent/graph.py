"""The RAG tutor.

Pipeline per turn:
  1. retrieve lesson passages (locale-filtered) from Chroma
  2. if nothing relevant, fall back to a web search
  3. assemble a prompt that also includes the page the user is currently reading
  4. stream the answer
A separate quick call (`suggest_followups`) proposes up to 3 follow-up questions.

Persona: short, conversational, plain text + emoji (NO markdown), no
self-introduction, ends by nudging a follow-up. The goal is a back-and-forth
chat, not a lecture.
"""
from __future__ import annotations

import json
from collections.abc import AsyncIterator
from dataclasses import dataclass, field

from ..ollama_client import OllamaClient
from ..rag.retriever import Retrieved, retrieve
from .websearch import web_search

TUTOR_SYSTEM_PROMPT = (
    "You are FinGuru, a friendly technical-analysis tutor talking with a learner.\n\n"
    "How you talk:\n"
    "- Have a CONVERSATION, not a lecture. Keep replies SHORT — usually 2-5 sentences. "
    "Answer the actual question, then stop.\n"
    "- Do NOT introduce yourself or say things like 'Great question'. Just answer.\n"
    "- Write like a chat message. Light markdown is fine and will render — short "
    "**bold** for emphasis or a few `-` bullets when listing helps — but don't over-format "
    "or use headings; a plain sentence is usually best. A few emoji are welcome to keep it "
    "warm (e.g. 📈, 💡, ⚠️), used sparingly.\n"
    "- Define a term in one short clause the first time it comes up. Use a tiny concrete "
    "example only if it helps.\n"
    "- Don't dump everything you know. Give the core idea, then INVITE a follow-up — end "
    "with a short question or an offer to go deeper (e.g. 'Want the formula?').\n\n"
    "Grounding:\n"
    "- Prefer the provided lesson context. If it's thin, use the web results provided. "
    "If you used the web, you can mention it casually.\n"
    "- If you genuinely don't know, say so briefly and ask a clarifying question.\n\n"
    "Boundaries: you teach concepts and history. No financial advice, price predictions, "
    "or buy/sell calls — if asked, gently steer back to the concept and risk management."
)

_LANGUAGE_INSTRUCTION = {
    "en": "Reply in English.",
    "ko": (
        "한국어로, 대화하듯 짧고 친근하게 답하세요. 전문 용어는 처음 나올 때 한글과 영어를 "
        "함께 적으세요(예: 상대강도지수(RSI)). 마크다운 없이 일반 텍스트와 이모지로만 답하고, "
        "한 번에 너무 많이 설명하지 말고 자연스럽게 다음 질문을 유도하세요."
    ),
}

# Grounding threshold for e5-large (query:/passage: prefixes): real matches
# ~0.83-0.90, off-topic ~0.81. Below this we web-search.
_MIN_SCORE = 0.82


def _retrieve(question: str, locale: str) -> list[Retrieved]:
    hits = retrieve(question, locale=locale)
    return [h for h in hits if h.score >= _MIN_SCORE]


def _page_block(page: dict | None) -> str:
    """Context for the lesson the user is currently viewing (if any)."""
    if not page:
        return ""
    title = (page.get("title") or "").strip()
    text = (page.get("text") or "").strip()
    if not title and not text:
        return ""
    # Cap to keep the prompt lean.
    text = text[:4000]
    return (
        "The learner is currently reading this page, so prefer it when relevant:\n"
        f"[Page: {title}]\n{text}\n---\n"
    )


@dataclass
class Prepared:
    messages: list[dict]
    citations: list[dict] = field(default_factory=list)
    used_web: bool = False


async def prepare(
    question: str,
    history: list[dict] | None = None,
    locale: str = "en",
    page: dict | None = None,
) -> Prepared:
    """Retrieve (RAG, then web fallback) and assemble the prompt."""
    hits = _retrieve(question, locale)
    citations: list[dict] = []
    used_web = False

    if hits:
        context = "\n\n---\n\n".join(
            f"[Lesson: {h.lesson_title} › {h.section}]\n{h.text}" for h in hits
        )
        context_block = f"Relevant study-guide excerpts:\n\n{context}\n---\n"
        seen: dict[str, dict] = {}
        for h in hits:
            if h.lesson_slug not in seen:
                seen[h.lesson_slug] = {
                    "title": h.lesson_title,
                    "slug": h.lesson_slug,
                    "kind": h.kind,
                    "section": h.section,
                }
        citations = list(seen.values())
    else:
        # No lesson matched — try the web.
        results = await web_search(question)
        used_web = bool(results)
        if results:
            context = "\n\n".join(
                f"[{r.title}] ({r.url})\n{r.snippet}" for r in results if r.snippet
            )
            context_block = (
                "Nothing matched in the study guide, so here are web results to "
                f"answer from:\n\n{context}\n---\n"
            )
            citations = [
                {"title": r.title, "url": r.url, "kind": "web"} for r in results[:3]
            ]
        else:
            context_block = (
                "Nothing was found in the study guide or the web for this. Say so "
                "briefly and ask a clarifying question.\n"
            )

    lang = _LANGUAGE_INSTRUCTION.get(locale, _LANGUAGE_INSTRUCTION["en"])
    system = f"{TUTOR_SYSTEM_PROMPT}\n\n{lang}"

    messages = [{"role": "system", "content": system}]
    for turn in history or []:
        messages.append(turn)
    user_content = f"{_page_block(page)}{context_block}\nQuestion: {question}"
    messages.append({"role": "user", "content": user_content})

    return Prepared(messages=messages, citations=citations, used_web=used_web)


async def stream_answer(prepared: Prepared) -> AsyncIterator[str]:
    client = OllamaClient()
    async for delta in client.stream_chat(prepared.messages):
        yield delta


_SUGGEST_PROMPT = (
    "Based on the conversation so far, propose up to 3 SHORT natural follow-up "
    "questions the learner might ask next. Each under ~8 words, phrased as the "
    "learner would type them. Return ONLY a JSON array of strings, e.g. "
    '["What is divergence?","How do I set the period?"]. If no good follow-up '
    "fits, return []. Use the same language as the conversation."
)


async def suggest_followups(
    question: str, answer: str, locale: str = "en"
) -> list[str]:
    """Quick second call: up to 3 follow-up questions as chips. Best-effort."""
    if not answer.strip():
        return []
    client = OllamaClient()
    convo = (
        f"Learner asked: {question}\n\nTutor answered: {answer}\n\n{_SUGGEST_PROMPT}"
    )
    try:
        raw = await client.chat(
            [
                {"role": "system", "content": "You output only a JSON array of strings."},
                {"role": "user", "content": convo},
            ]
        )
    except Exception:
        return []
    # Pull the first JSON array out of the response.
    start, end = raw.find("["), raw.rfind("]")
    if start == -1 or end == -1 or end < start:
        return []
    try:
        items = json.loads(raw[start : end + 1])
    except Exception:
        return []
    out = [str(s).strip() for s in items if isinstance(s, str) and s.strip()]
    return out[:3]
