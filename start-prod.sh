#!/usr/bin/env bash
#
# start-prod.sh — run FinGuru in PRODUCTION mode (no dev servers).
#
# Differences from run.sh:
#   - web: `next build` once, then `next start` (stable, low-memory) — not `next dev`.
#   - api: uvicorn WITHOUT --reload.
#   - meant to be launched by a supervisor (launchd) so it survives crashes and
#     reboots; it stays in the foreground and stops both children on signal.
#
# Usage:
#   ./start-prod.sh                 # build (if needed) + start both
#   SKIP_BUILD=1 ./start-prod.sh    # skip the web build (already built)
#   API_PORT=48000 WEB_PORT=48080 ./start-prod.sh

set -euo pipefail

# launchd starts us with a bare PATH that lacks Homebrew (node/npm) and the
# Python framework (uv). Prepend both so the tools resolve regardless of who
# launches the script.
export PATH="/opt/homebrew/bin:/Library/Frameworks/Python.framework/Versions/3.11/bin:/usr/bin:/bin:/usr/sbin:/sbin:${PATH:-}"

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT/api"
WEB_DIR="$ROOT/web"

API_PORT="${API_PORT:-48000}"
WEB_PORT="${WEB_PORT:-48080}"

API_PATTERN="uvicorn app.main:app"
WEB_PATTERN="next start"

LAUNCHD_LABEL="com.finguru.app"

log() { printf '\033[36m[prod]\033[0m %s\n' "$*"; }

# --- Guard against the manual-run vs launchd collision ---------------------
# This machine runs prod under a launchd job (com.finguru.app, KeepAlive=true).
# If you run ./start-prod.sh BY HAND while that job is alive, the manual run's
# kill_pattern/kill_port below tears down launchd's children; KeepAlive then
# instantly relaunches launchd's own copy, which runs `next build` — and a build
# WIPES .next at its start, colliding with whichever `next build`/`next start`
# the other instance is mid-way through. The visible symptom is the build dying
# with "SyntaxError: Unexpected end of JSON input" (a half-written manifest).
#
# To make `./start-prod.sh` safe to type, detect that case and DELEGATE to a
# single clean supervised restart instead of fighting. When launchd itself
# spawns this script, `launchctl print` reports pid = our own $$, so we only
# bail when the reported pid belongs to a DIFFERENT live process.
if [ "${FORCE_MANUAL:-0}" != "1" ] && command -v launchctl >/dev/null 2>&1; then
  managed_pid="$(launchctl print "gui/$(id -u)/${LAUNCHD_LABEL}" 2>/dev/null \
    | awk '/^[[:space:]]*pid = [0-9]+/ { print $3; exit }')"
  if [ -n "${managed_pid:-}" ] && [ "$managed_pid" != "$$" ] \
     && kill -0 "$managed_pid" 2>/dev/null; then
    log "launchd job '${LAUNCHD_LABEL}' is already supervising prod (pid ${managed_pid})."
    log "Delegating to a single clean restart to avoid a concurrent-build collision…"
    if launchctl kickstart -k "gui/$(id -u)/${LAUNCHD_LABEL}"; then
      log "kickstarted '${LAUNCHD_LABEL}' — it will rebuild and restart. Tail logs:"
      log "  tail -f ${ROOT}/deploy/logs/finguru.{out,err}.log"
      exit 0
    fi
    log "kickstart failed; continuing with a manual start (set FORCE_MANUAL=1 to skip this guard)."
  fi
fi

kill_port() {
  local port="$1" pids
  pids="$(lsof -ti "tcp:${port}" 2>/dev/null || true)"
  if [ -n "$pids" ]; then
    log "terminating process(es) on port ${port}: ${pids}"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 1
    pids="$(lsof -ti "tcp:${port}" 2>/dev/null || true)"
    # shellcheck disable=SC2086
    [ -n "$pids" ] && kill -9 $pids 2>/dev/null || true
  fi
}

kill_pattern() {
  local pat="$1" pids
  pids="$(pgrep -f "$pat" 2>/dev/null || true)"
  if [ -n "$pids" ]; then
    log "terminating existing '${pat}': ${pids}"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 1
    pids="$(pgrep -f "$pat" 2>/dev/null || true)"
    # shellcheck disable=SC2086
    [ -n "$pids" ] && kill -9 $pids 2>/dev/null || true
  fi
}

_cleaned=0
cleanup() {
  [ "$_cleaned" = "1" ] && return
  _cleaned=1
  log "shutting down…"
  [ -n "${API_PID:-}" ] && kill "$API_PID" 2>/dev/null || true
  [ -n "${WEB_PID:-}" ] && kill "$WEB_PID" 2>/dev/null || true
  kill_port "$API_PORT"
  kill_port "$WEB_PORT"
  wait 2>/dev/null || true
  log "stopped."
}
trap cleanup INT TERM EXIT

log "checking for pre-existing instances…"
kill_pattern "$API_PATTERN"
kill_pattern "$WEB_PATTERN"
kill_pattern "next dev"
kill_port "$API_PORT"
kill_port "$WEB_PORT"

# --- Build the web app for production ---
# Next.js bakes rewrites() destinations into .next/routes-manifest.json at BUILD
# time, not at `next start`. So API_PROXY_TARGET must be exported BEFORE the
# build or the manifest keeps the default http://localhost:8000 (nothing listens
# there in prod → every /api/* proxy call ECONNREFUSEDs → 500). See issue #14.
export API_PROXY_TARGET="${API_PROXY_TARGET:-http://localhost:${API_PORT}}"

# Always rebuild so `next start` serves the latest code. Set SKIP_BUILD=1 to
# reuse an existing .next build (e.g. for near-instant supervisor restarts).
if [ "${SKIP_BUILD:-0}" = "1" ]; then
  log "SKIP_BUILD=1 — using existing .next build"
else
  log "building web (npm run build)…"
  ( cd "$WEB_DIR" && npm run build )
fi

# --- API (production: no --reload) ---
log "starting API on :${API_PORT} (uvicorn, no reload)…"
(
  cd "$API_DIR"
  exec uv run uvicorn app.main:app --host 0.0.0.0 --port "$API_PORT"
) &
API_PID=$!

# --- Web (production: next start) ---
# API_PROXY_TARGET was exported before the build (above) so it's baked into the
# manifest; it's already in the environment here for `next start` too.
log "starting web on :${WEB_PORT} (next start)…  proxy /api -> ${API_PROXY_TARGET}"
(
  cd "$WEB_DIR"
  exec npm run start -- --port "$WEB_PORT"
) &
WEB_PID=$!

log "API  pid=${API_PID}  ->  http://localhost:${API_PORT}/health"
log "web  pid=${WEB_PID}  ->  http://localhost:${WEB_PORT}"

# Stay foreground; if either child dies, exit non-zero so the supervisor
# (launchd KeepAlive) restarts the whole script.
while kill -0 "$API_PID" 2>/dev/null && kill -0 "$WEB_PID" 2>/dev/null; do
  sleep 2
done
log "a process exited — stopping the other so the supervisor can restart cleanly."
exit 1
