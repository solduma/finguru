"""POST /chat — streams the RAG tutor's answer over SSE.

Flow: retrieve lesson context + assemble the prompt (LangGraph), emit a
`citation` event listing the lessons drawn on, then stream `token` events from
Ollama Cloud, and finally `done`. Errors surface as an `error` event.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

import httpx
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ..agent.graph import prepare, stream_answer
from ..schemas import ChatRequest
from ..sse import sse_event

router = APIRouter()


async def _stream(req: ChatRequest) -> AsyncIterator[str]:
    history = [{"role": m.role, "content": m.content} for m in req.history]
    try:
        prepared = prepare(req.message, history)
    except Exception as e:  # retrieval/index failure shouldn't 500 the stream
        yield sse_event("error", {"message": f"Retrieval failed: {e}"})
        yield sse_event("done", {})
        return

    # Tell the client which lessons ground this answer (citation chips).
    yield sse_event("citations", {"items": prepared.citations})

    try:
        async for delta in stream_answer(prepared):
            yield sse_event("token", {"text": delta})
    except httpx.HTTPStatusError as e:
        detail = (
            "Upstream model auth failed (check OLLAMA_API_KEY)."
            if e.response.status_code == 401
            else f"Upstream error {e.response.status_code}."
        )
        yield sse_event("error", {"message": detail})
    except httpx.HTTPError as e:
        yield sse_event("error", {"message": f"Connection error: {e}"})
    finally:
        yield sse_event("done", {})


@router.post("/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    return StreamingResponse(
        _stream(req),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
