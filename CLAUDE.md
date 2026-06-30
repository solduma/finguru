# finguru — working agreement

## Git / GitHub workflow (REQUIRED for every unit of work)

Follow this exact sequence. Do **not** ask whether to commit/push/PR — just do it.

1. **Create a GitHub issue** describing the work (`gh issue create`).
2. **Create a feature branch** off `main` (e.g. `feat/<slug>` or `feat/<issue#>-<slug>`).
3. **Commit every job done** — commit at each meaningful, working checkpoint (not one giant commit at the end). Reference the issue in commits.
4. **When all tasks for the issue are done, open a PR** (`gh pr create`) targeting `main`, linking the issue (`Closes #N`).
5. **Merge to main** (`gh pr merge`).
6. **Close the issue** (auto-closes via `Closes #N`, else `gh issue close`).
7. **Delete the local and remote feature branch.**

Commit messages end with the Co-Authored-By trailer; PR bodies end with the Generated-with line (per harness rules).

## Project shape

- `web/` — Next.js (App Router) + MDX lessons + Tailwind. Bilingual EN/KO (`web/lib/i18n.ts`, routes under `web/app/[locale]/`).
- `api/` — Python FastAPI + LangGraph; RAG chat tutor (Ollama Cloud). `uv` for deps.
- Dev: `./run.sh` (api :49000, web :49080). Prod: launchd `com.finguru.app` (:48000/:48080).
- Site is password-gated (middleware; `AUTH_SECRET`/`SITE_PASSWORD` in `web/.env.local`).

## Secrets in `.env` (repo root, gitignored)

Market-data keys available for the practical-modules work:
- `DART_API_KEY` — OpenDART (Korea corporate disclosures / fundamentals).
- `KIS_APP_KEY`, `KIS_APP_SECRET`, `KIS_ACCOUNT_NO` — 한국투자증권 (KIS) API (KR prices/quotes).
- `KRX_API` — Korea Exchange data.

Never commit secrets; load via `api/app/config.py` pydantic settings.

## Active initiative

Practical/실전 modules at the end of strategy learning paths — see
`docs/practical-modules-2026-07.md` (plan) and the `practical-modules` memory.
