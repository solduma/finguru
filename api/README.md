# finguru API

FastAPI + LangGraph service that powers the RAG-grounded chat tutor.

## Quick start (local, without Docker)

```bash
cd api
uv sync
# from repo root, .env is loaded automatically
uv run uvicorn app.main:app --reload --port 8000
```

- `GET /health` — liveness + resolved config (no secrets).
- `POST /chat` — Server-Sent Events stream of the tutor's answer.

## Ingest content into the vector store

```bash
uv run python -m app.rag.ingest
```

Walks the MDX lessons in `CONTENT_DIR`, chunks them, embeds with the configured
backend (local `fastembed` by default), and writes to Chroma at `CHROMA_DIR`.

See the repo root `README.md` for the full architecture.
