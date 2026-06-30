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

# Dev ports. Deliberately distinct from the PRODUCTION ports (48000/48080) used
# by start-prod.sh, which a launchd job (com.finguru.app) keeps alive with
# KeepAlive. If dev reused those ports, every time we freed them the supervisor
# would instantly relaunch prod and re-bind them, and dev would lose the race
# with EADDRINUSE. Using separate ports lets dev and prod run side by side.
# Override via env if needed.
API_PORT="${API_PORT:-49000}"
WEB_PORT="${WEB_PORT:-49080}"

# Patterns to reap stray DEV servers from a previous run (e.g. an orphaned
# next-server reparented to PID 1 that a port check might momentarily miss).
# These are scoped to the dev PORTS so they can never match the production
# servers (start-prod.sh on 48000/48080) — killing those would bounce prod and
# trigger a launchd restart that races us for the ports.
API_PATTERN="uvicorn app.main:app.*--port ${API_PORT}"
WEB_PATTERN="next (dev|start).*--port ${WEB_PORT}"

log() { printf '\033[36m[run]\033[0m %s\n' "$*"; }

# PIDs that are *listening* on a TCP port. We must restrict to LISTEN sockets:
# a plain `lsof -ti tcp:PORT` also matches sockets where PORT is the *remote*
# end (e.g. VS Code's outbound connections to some host:48080), which would
# both make the port look perpetually busy and risk killing unrelated apps.
port_listeners() {
  lsof -ti "tcp:$1" -sTCP:LISTEN 2>/dev/null || true
}

# Kill whatever is listening on a TCP port (if anything).
kill_port() {
  local port="$1"
  local pids
  pids="$(port_listeners "$port")"
  if [ -n "$pids" ]; then
    log "terminating process(es) on port ${port}: ${pids}"
    # shellcheck disable=SC2086
    kill $pids 2>/dev/null || true
    sleep 1
    pids="$(port_listeners "$port")"
    if [ -n "$pids" ]; then
      log "force-killing on port ${port}: ${pids}"
      # shellcheck disable=SC2086
      kill -9 $pids 2>/dev/null || true
    fi
  fi
}

# Block until a TCP port has no listener, or bail after a timeout. Killing a
# process is asynchronous — the socket can linger for a beat after the PID is
# gone — so we poll instead of assuming the port is free immediately.
wait_port_free() {
  local port="$1"
  local tries=0
  while [ -n "$(port_listeners "$port")" ]; do
    if [ "$tries" -ge 10 ]; then
      log "port ${port} still busy after waiting; killing again"
      kill_port "$port"
      tries=0
    fi
    sleep 0.3
    tries=$((tries + 1))
  done
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
wait_port_free "$API_PORT"
log "starting API on :${API_PORT} (uvicorn)…"
(
  cd "$API_DIR"
  exec uv run uvicorn app.main:app --reload --host 0.0.0.0 --port "$API_PORT"
) &
API_PID=$!

# --- Web ---
# Point the Next.js /api/* proxy at the API port we just chose, so they can't
# desync if the ports are overridden.
export API_PROXY_TARGET="${API_PROXY_TARGET:-http://localhost:${API_PORT}}"
# Write dev's build to its own dir (see next.config.mjs) so `next dev` never
# clobbers the production .next that start-prod.sh's `next start` is serving.
export NEXT_DIST_DIR="${NEXT_DIST_DIR:-.next-dev}"
wait_port_free "$WEB_PORT"
log "starting web on :${WEB_PORT} (next dev)…  proxy /api -> ${API_PROXY_TARGET}"
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
