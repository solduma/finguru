# FinGuru

A thorough, beginner-friendly study guide to **technical analysis** — taught
through the masters who built it and the tools they left behind — paired with a
**RAG-grounded chat tutor** that answers from the very same lessons.

## Architecture

```
finguru/
├── docker-compose.yml      # web + api, one command up
├── .env                    # secrets + model config (gitignored)
├── .env.example            # template
│
├── web/                    # Next.js (App Router) + MDX + Tailwind v4
│   ├── app/                # home, /path, /gurus/[slug], /indicators/[slug]
│   ├── components/         # ChatWidget (SSE), LessonLayout, Mdx
│   ├── lib/content.ts      # MDX loader (single source of truth for content + RAG)
│   └── content/            # the lessons:  gurus/*.mdx  indicators/*.mdx
│
└── api/                    # FastAPI + LangGraph
    ├── app/main.py         # /health, /chat (SSE)
    ├── app/ollama_client.py# Ollama Cloud chat (native + streaming)
    ├── app/routes/chat.py  # streaming tutor endpoint
    ├── app/agent/          # LangGraph graph (Phase 3)
    └── app/rag/            # ingest + retriever over Chroma (Phase 2)
```

**Content is the single source of truth.** The MDX files humans read are the
same files the RAG pipeline ingests, so the tutor never drifts from the guide.

**Models.** Chat runs on Ollama Cloud (default `qwen3.5:cloud`, swappable via
`OLLAMA_CHAT_MODEL`). Embeddings run locally by default (`fastembed`,
`EMBEDDING_BACKEND=local`) because the current Ollama Cloud tier does not expose
the embeddings endpoint — swap to `ollama` later with one env change.

## Run it (Docker)

```bash
cp .env.example .env          # then paste your real OLLAMA_API_KEY
docker compose up --build
```

- Web: http://localhost:3000
- API: http://localhost:8000/health

## Run it (local, no Docker)

```bash
# Terminal 1 — API
cd api && uv sync && uv run uvicorn app.main:app --reload --port 8000

# Terminal 2 — Web
cd web && npm install && npm run dev
```

The web dev server proxies `/api/*` to the API (`next.config.mjs` rewrite), so
the browser talks to a single origin.

## Build status

- **Phase 0 — scaffold + infra:** ✅ web builds, API streams real tutor replies.
- **Phase 1 pilot — Dow + RSI:** in progress.
- Phases 2–4 (RAG ingest, LangGraph agent, full content) follow.

## Adding a lesson

Drop an `.mdx` file in `web/content/gurus/` or `web/content/indicators/` with
the frontmatter shown in existing lessons (`title, slug, kind, level, order,
summary`). It appears on the site automatically and is picked up by the next
`ingest` run.
