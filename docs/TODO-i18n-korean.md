# Korean (ko) i18n — IMPLEMENTED

> **Status: done (2026-06-19).** Korean is a fully supported locale across the
> site and the chat tutor. This file is kept as a record of what was built and
> how to extend it.

## What shipped

**Frontend (web/):**
- Locale routing under `app/[locale]/` with `en` (default) and `ko`. The bare
  `/` redirects to `/en`; a `<LocaleSwitcher>` in the nav swaps locale while
  preserving the current path.
- UI chrome strings live in `lib/i18n.ts` (`STRINGS[locale]`) — nav, home,
  learning path, indexes, `LessonLayout`, `ChatWidget`, not-found, plus
  level/kind labels.
- The content loader (`lib/content.ts`) is locale-aware: Korean lessons load
  from `content/ko/`, with **English fallback** + a visible "not translated yet"
  notice if a given `ko` file is missing.

**Content:**
- All 32 lessons translated to Korean under `web/content/ko/{gurus,indicators}/`,
  preserving frontmatter structure, `<Callout>`/`<LineChart>`/`<CandleChart>`
  JSX and numeric props, with chart captions/labels translated.
- English remains the source of truth; new English lessons appear under `/ko`
  via fallback until translated.

**Backend / tutor (api/):**
- Embeddings use `intfloat/multilingual-e5-large` (1024-dim) with the required
  `query:` / `passage:` prefixes (see `rag/embeddings.py`).
- Ingest indexes every locale's tree (`LOCALES=en,ko`), tagging each chunk with
  `locale` metadata. Retrieval is **locale-filtered** so citations and quoted
  passages match the reader's language.
- `/chat` accepts a `locale`; the tutor answers in that language (Korean prompt
  instruction in `agent/graph.py`).

## How to extend / maintain

- **Add a locale:** add it to `LOCALES` (en + ...) in `lib/i18n.ts` with a
  `STRINGS` entry, add `LOCALES`/`content_path_for` support is already generic
  in the API (`LOCALES` env), translate `content/<loc>/`, and re-run ingest.
- **Re-translate or fix a lesson:** edit the file under `content/ko/`, then
  `cd api && uv run python -m app.rag.ingest` to refresh the index.
- **Ingest note:** e5-large batch embedding of ~870 chunks is slow on CPU
  (~20 min) — a one-time offline cost. Single-query latency at chat time is
  ~40 ms, which is fine. Ingest prints batch progress.

## Known follow-ups (optional)

- The Korean translations are machine-generated (reviewed structurally, not
  line-by-line by a native finance editor). A human polish pass is advisable
  before treating the Korean lessons as authoritative.
- `_MIN_SCORE` (grounding threshold) is tuned to 0.82 for e5-large; revisit if
  the embedding model changes.
