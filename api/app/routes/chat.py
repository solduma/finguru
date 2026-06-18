"""POST /chat — streams the tutor's answer over SSE.

Phase 0: streams a direct Ollama Cloud response with a TA-tutor persona (proves
key + streaming end-to-end). Phase 3 swaps the body for the LangGraph agent,
which first retrieves lesson context and emits `citation` events. The SSE
contract (token / citation / done / error events) stays the same.
"""
from __future__ import annotations

from collections.abc import AsyncIterator

import httpx
from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from ..ollama_client import OllamaClient
from ..schemas import ChatRequest
from ..sse import sse_event

router = APIRouter()

TUTOR_SYSTEM_PROMPT = (
    "You are FinGuru, a patient technical-analysis tutor for beginners. "
    "Explain concepts plainly, define jargon the first time you use it, and "
    "prefer concrete examples. You teach analysis methods and history; you do "
    "NOT give financial advice, price predictions, or buy/sell recommendations. "
    "If asked for those, gently redirect to the underlying concept and risk "
    "management. Keep answers focused and well-structured."
)


def _build_messages(req: ChatRequest) -> list[dict[str, str]]:
    messages = [{"role": "system", "content": TUTOR_SYSTEM_PROMPT}]
    for turn in req.history:
        messages.append({"role": turn.role, "content": turn.content})
    messages.append({"role": "user", "content": req.message})
    return messages


async def _stream(req: ChatRequest) -> AsyncIterator[str]:
    client = OllamaClient()
    messages = _build_messages(req)
    try:
        async for delta in client.stream_chat(messages):
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
