"""POST /chat — streams the tutor's answer over SSE.

Flow: retrieve lesson context (RAG, then web fallback) + assemble the prompt,
emit a `citations` event, stream `token` events as the answer is generated, then
emit a `suggestions` event (up to 3 follow-up chips), and finally `done`. Errors
surface as an `error` event.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

import httpx
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ..agent.graph import prepare, stream_answer, suggest_followups
from ..schemas import ChatRequest
from ..sse import sse_event

router = APIRouter()


async def _stream(req: ChatRequest) -> AsyncIterator[str]:
    history = [{"role": m.role, "content": m.content} for m in req.history]
    page = req.page.model_dump() if req.page else None
    try:
        prepared = await prepare(
            req.message, history, locale=req.locale, page=page
        )
    except Exception as e:  # retrieval/index failure shouldn't 500 the stream
        yield sse_event("error", {"message": f"Retrieval failed: {e}"})
        yield sse_event("done", {})
        return

    # Citation chips (lessons or web sources) grounding this answer.
    yield sse_event("citations", {"items": prepared.citations})

    answer_parts: list[str] = []
    try:
        async for delta in stream_answer(prepared):
            answer_parts.append(delta)
            yield sse_event("token", {"text": delta})
    except httpx.HTTPStatusError as e:
        detail = (
            "Upstream model auth failed (check OLLAMA_API_KEY)."
            if e.response.status_code == 401
            else f"Upstream error {e.response.status_code}."
        )
        yield sse_event("error", {"message": detail})
        yield sse_event("done", {})
        return
    except httpx.HTTPError as e:
        yield sse_event("error", {"message": f"Connection error: {e}"})
        yield sse_event("done", {})
        return

    # After the answer, propose up to 3 follow-up questions as chips.
    answer = "".join(answer_parts)
    try:
        chips = await suggest_followups(req.message, answer, locale=req.locale)
    except Exception:
        chips = []
    yield sse_event("suggestions", {"items": chips})
    yield sse_event("done", {})


@router.post("/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    return StreamingResponse(
        _stream(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
