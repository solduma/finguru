"""Request/response models shared across the API."""
from __future__ import annotations

from pydantic import BaseModel, Field


class ChatMessage(BaseModel):
    role: str = Field(description="'user' or 'assistant'")
    content: str


class ChatRequest(BaseModel):
    message: str = Field(description="The user's latest question")
    history: list[ChatMessage] = Field(
        default_factory=list, description="Prior turns, oldest first"
    )
    locale: str = Field(
        default="en", description="UI locale, e.g. 'en' or 'ko'; sets reply language + retrieval locale"
    )


class Citation(BaseModel):
    title: str
    slug: str
    kind: str  # "guru" | "indicator"
    section: str | None = None
