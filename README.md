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

## Internationalization

The site and tutor are bilingual: **English** (`/en`, default) and **Korean**
(`/ko`). Routes live under `web/app/[locale]/`; UI strings are in
`web/lib/i18n.ts`; all 32 lessons are translated under `web/content/ko/` (with
English fallback if a translation is missing). The chat tutor retrieves from the
reader's locale and answers in their language (multilingual `e5-large`
embeddings with locale-filtered retrieval). See
[`docs/TODO-i18n-korean.md`](docs/TODO-i18n-korean.md) for how to add a locale.

## Build status

All phases are complete:

- **Phase 0 — scaffold + infra:** ✅ web + API + docker-compose.
- **Phase 1 — content:** ✅ 31 deep-researched, fact-checked lessons (17 gurus,
  14 indicators/concepts).
- **Phase 2 — RAG ingestion:** ✅ 422 chunks indexed in Chroma.
- **Phase 3 — LangGraph tutor:** ✅ grounded streaming answers with lesson
  citations and a no-financial-advice guardrail.
- **Phase 4 — frontend:** ✅ lesson pages with TOC + prev/next, learning path,
  guru/indicator indexes, streaming chat widget with citation chips.

## The curriculum

The lessons are sequenced beginner → pro via the `order` field (see `/path`).

**Gurus:** Charles Dow · Jesse Livermore · Richard Wyckoff · Ralph Elliott ·
W.D. Gann · William Jiler · J. Welles Wilder · Martin Pring · John Bollinger ·
Steve Nison · Thomas DeMark · Stan Weinstein · William O'Neil · Larry Williams ·
Linda Raschke · Alan Farley · Mark Minervini · Michael Huddleston (ICT).

**Indicators & concepts:** Moving Averages · MACD · RSI · Stochastics ·
Bollinger Bands · ADX/ATR · Ichimoku · Fibonacci · Elliott Wave (applied) ·
Candlestick Patterns · Volume/OBV · Support, Resistance & Patterns · Risk
Management · Trading Psychology.

## Adding or editing a lesson

1. Drop an `.mdx` file in `web/content/gurus/` or `web/content/indicators/`,
   copying the frontmatter from an existing lesson
   (`title, slug, kind, level, order, summary`; gurus also use `era` /
   `contribution`; optional `prereqs`).
2. For highlighted boxes use only `<Callout type="key|note|warning">…</Callout>`.
3. In prose, write comparisons as inline code (`` `<20` ``, `` `%b > 1` ``) —
   a bare `<` before a digit/operator is parsed as JSX and breaks the MDX build.
4. The page appears automatically. To make the tutor aware of it, re-run ingest:
   `cd api && uv run python -m app.rag.ingest`.
