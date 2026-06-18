# TODO: Korean (ko) i18n support — NOT YET IMPLEMENTED

> **Status: planned, not started.** This is a tracking marker, requested
> 2026-06-19. Do not implement until prioritized.

The site (Next.js App Router) and the chat tutor need Korean-language support.

## Scope when implemented

**Frontend (web/):**
- Add locale routing (e.g. `next-intl` or App Router `[locale]` segments):
  `/` (English, default) and `/ko`.
- Translate UI chrome: nav (`app/layout.tsx`), home (`app/page.tsx`), learning
  path, index pages, `LessonLayout`, `ChatWidget` strings, `not-found`.
- Decide lesson-content strategy: the 32 MDX lessons in `web/content/` are the
  hard part. Options:
  1. Parallel localized content tree (`web/content/ko/gurus/*.mdx`, …) — cleanest.
  2. Per-file translated frontmatter + body, selected by locale.
  Chart **captions** (inside `<LineChart>`/`<CandleChart>` props) also need
  translation; chart data stays as-is.

**Backend / tutor (api/):**
- The tutor should answer in Korean when asked in Korean. Two parts:
  - System prompt: instruct the model to respond in the user's language (or pass
    an explicit `locale` from the frontend).
  - RAG: either translate Korean queries before embedding, index Korean lesson
    text in a parallel collection, or use a multilingual embedding model
    (current `bge-small-en-v1.5` is English-centric — would likely need
    `bge-m3` or similar for Korean retrieval quality).

## Notes
- `qwen3.5:cloud` handles Korean generation well; the main effort is content
  translation + multilingual retrieval, not the chat model.
- Keep English as the source of truth; treat Korean as a translation layer so
  new lessons don't have to be authored twice from scratch.
