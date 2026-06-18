"""Thin async client for Ollama Cloud's native chat API.

Kept dependency-light (httpx only) so it works the same inside the LangGraph
node and in standalone smoke tests. Streaming yields plain text deltas.
"""
from __future__ import annotations

import json
from collections.abc import AsyncIterator

import httpx

from .config import get_settings


class OllamaClient:
    def __init__(
        self,
        base_url: str | None = None,
        api_key: str | None = None,
        model: str | None = None,
    ) -> None:
        s = get_settings()
        self.base_url = (base_url or s.ollama_base_url).rstrip("/")
        self.api_key = api_key or s.ollama_api_key
        self.model = model or s.ollama_chat_model

    @property
    def _headers(self) -> dict[str, str]:
        # IMPORTANT: the full key (including the part after the ".") is required.
        return {
            "Authorization": f"Bearer {self.api_key}",
            "Content-Type": "application/json",
        }

    async def chat(self, messages: list[dict[str, str]]) -> str:
        """Non-streaming chat. Returns the assistant message content."""
        payload = {"model": self.model, "messages": messages, "stream": False}
        async with httpx.AsyncClient(timeout=120) as client:
            r = await client.post(
                f"{self.base_url}/api/chat", headers=self._headers, json=payload
            )
            r.raise_for_status()
            return r.json()["message"]["content"]

    async def stream_chat(
        self, messages: list[dict[str, str]]
    ) -> AsyncIterator[str]:
        """Stream chat. Yields content deltas as they arrive."""
        payload = {"model": self.model, "messages": messages, "stream": True}
        async with httpx.AsyncClient(timeout=None) as client:
            async with client.stream(
                "POST",
                f"{self.base_url}/api/chat",
                headers=self._headers,
                json=payload,
            ) as r:
                r.raise_for_status()
                async for line in r.aiter_lines():
                    if not line.strip():
                        continue
                    try:
                        obj = json.loads(line)
                    except json.JSONDecodeError:
                        continue
                    delta = (obj.get("message") or {}).get("content")
                    if delta:
                        yield delta
                    if obj.get("done"):
                        break
