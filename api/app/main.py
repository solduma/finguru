"""FastAPI entrypoint for the finguru tutor API."""
from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from .config import get_settings
from .routes import chat, market_data

settings = get_settings()

app = FastAPI(title="finguru API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origin_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(chat.router)
app.include_router(market_data.router)


@app.get("/health")
def health() -> dict:
    """Liveness + resolved config, with secrets redacted."""
    return {
        "status": "ok",
        "chat_model": settings.ollama_chat_model,
        "embedding_backend": settings.embedding_backend,
        "ollama_api_key_set": bool(settings.ollama_api_key),
        "content_dir": str(settings.content_path),
        "chroma_dir": str(settings.chroma_path),
    }
