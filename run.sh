#!/usr/bin/env bash
#
# run.sh — start the FinGuru API (FastAPI/uvicorn) and web (Next.js) together.
#
# It first terminates any pre-existing instances (matched both by the process
# command and by whoever is holding the ports), then launches fresh ones.
# Ctrl-C stops both.
#
# Usage:
#   ./run.sh            # start both
#   API_PORT=8001 WEB_PORT=3001 ./run.sh   # override ports

set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
API_DIR="$ROOT/api"
WEB_DIR="$ROOT/web"

API_PORT="${API_PORT:-8000}"
WEB_PORT="${WEB_PORT:-3000}"

API_PATTERN="uvicorn app.main:app"
WEB_PATTERN="next dev"

log() { printf '\033[36m[run]\033[0m %s\n' "$*"; }

# Kill whatever is listening on a TCP port (if anything).
kill_port() {
  local port="$1"
  local pids
  pids="$(lsof -ti "tcp:${port}" 2>/dev/null || true)"
  if [ -n "$pids" ]; then
    log "terminating process(es) on port ${port}: ${pids}"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 1
    pids="$(lsof -ti "tcp:${port}" 2>/dev/null || true)"
    if [ -n "$pids" ]; then
      log "force-killing on port ${port}: ${pids}"
      # shellcheck disable=SC2086
      kill -9 $pids 2>/dev/null || true
    fi
  fi
}

# Kill processes whose command line matches a pattern (catches strays not bound
# to the port, e.g. a crashed/zombie dev server).
kill_pattern() {
  local pat="$1"
  local pids
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
  # Reap children bound to the ports too.
  kill_port "$API_PORT"
  kill_port "$WEB_PORT"
  wait 2>/dev/null || true
  log "stopped."
}
trap cleanup INT TERM EXIT

log "checking for pre-existing instances…"
kill_pattern "$API_PATTERN"
kill_pattern "$WEB_PATTERN"
kill_port "$API_PORT"
kill_port "$WEB_PORT"

# --- API ---
log "starting API on :${API_PORT} (uvicorn)…"
(
  cd "$API_DIR"
  exec uv run uvicorn app.main:app --reload --host 0.0.0.0 --port "$API_PORT"
) &
API_PID=$!

# --- Web ---
log "starting web on :${WEB_PORT} (next dev)…"
(
  cd "$WEB_DIR"
  exec npm run dev -- --port "$WEB_PORT"
) &
WEB_PID=$!

log "API  pid=${API_PID}  ->  http://localhost:${API_PORT}/health"
log "web  pid=${WEB_PID}  ->  http://localhost:${WEB_PORT}"
log "press Ctrl-C to stop both."

# Wait until either process exits, then let the trap stop the other. Polled so
# it works on bash 3.2 (macOS default), which lacks `wait -n`.
while kill -0 "$API_PID" 2>/dev/null && kill -0 "$WEB_PID" 2>/dev/null; do
  sleep 1
done
log "one process exited; cleaning up the other."
