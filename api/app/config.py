"""Central configuration, loaded from environment / .env.

Everything that might change between environments (models, keys, paths) lives
here so the rest of the code never reads os.environ directly.
"""
from __future__ import annotations

from functools import lru_cache
from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

# Repo root is two levels up from this file: api/app/config.py -> repo root.
_REPO_ROOT = Path(__file__).resolve().parents[2]


class Settings(BaseSettings):
    # Load the repo-root .env; ignore unknown keys so a shared .env is fine.
    model_config = SettingsConfigDict(
        env_file=(_REPO_ROOT / ".env", _REPO_ROOT / ".env.local"),
        env_file_encoding="utf-8",
        extra="ignore",
    )

    # ---- Ollama Cloud (chat) ----
    ollama_base_url: str = "https://ollama.com"
    ollama_api_key: str = ""
    ollama_chat_model: str = "qwen3.5:cloud"
    # Disable model "thinking" blocks by default (snappier streamed replies).
    ollama_think: bool = False

    # ---- Web search fallback (used when RAG finds nothing) ----
    # Tavily first (if key set), else DuckDuckGo (no key).
    tavily_api_key: str = ""
    web_search_max_results: int = 4

    # ---- Embeddings ----
    embedding_backend: str = "local"  # "local" | "gemini" | "ollama"
    # Multilingual model with strong Korean retrieval quality. e5 models REQUIRE
    # "query:"/"passage:" prefixes (added in embeddings.py). 1024-dim. Batch
    # ingest is slow on CPU but a one-time offline cost; single-query latency at
    # chat time is ~40ms, which is fine.
    local_embedding_model: str = "intfloat/multilingual-e5-large"
    ollama_embedding_model: str = "embeddinggemma"
    # Gemini embeddings (used by the serverless deploy: no model in-process, so
    # the container stays small and cold starts are fast). Multilingual incl.
    # Korean. Free tier is ample for low traffic. 768-dim. Asymmetric retrieval
    # is handled via taskType in embeddings.py, not text prefixes.
    gemini_api_key: str = ""
    gemini_embedding_model: str = "gemini-embedding-001"

    # ---- RAG / Chroma ----
    chroma_dir: str = "./chroma_db"
    chroma_collection: str = "finguru_lessons"
    rag_top_k: int = 5

    # ---- Content / i18n ----
    # Locales whose lesson trees get ingested. "en" = content/, others = content/<loc>/.
    locales: str = "en,ko"

    # ---- Content ----
    content_dir: str = "../web/content"

    # ---- Server ----
    api_host: str = "0.0.0.0"
    api_port: int = 8000
    cors_origins: str = "http://localhost:3000"

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def locale_list(self) -> list[str]:
        return [l.strip() for l in self.locales.split(",") if l.strip()]

    @property
    def content_path(self) -> Path:
        p = Path(self.content_dir)
        return p if p.is_absolute() else (_REPO_ROOT / "api" / p).resolve()

    def content_path_for(self, locale: str) -> Path:
        """English lives at content/; other locales at content/<locale>/."""
        base = self.content_path
        return base if locale == "en" else base / locale

    @property
    def chroma_path(self) -> Path:
        p = Path(self.chroma_dir)
        return p if p.is_absolute() else (_REPO_ROOT / "api" / p).resolve()


@lru_cache
def get_settings() -> Settings:
    return Settings()
