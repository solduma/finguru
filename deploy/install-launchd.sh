#!/usr/bin/env bash
#
# install-launchd.sh — install/reinstall the FinGuru LaunchAgent so the app
# starts at login and restarts on crash.
#
# Usage:
#   ./deploy/install-launchd.sh            # install + start
#   ./deploy/install-launchd.sh uninstall  # stop + remove
#
set -euo pipefail

REPO="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
LABEL="com.finguru.app"
SRC="$REPO/deploy/$LABEL.plist"
DEST="$HOME/Library/LaunchAgents/$LABEL.plist"
GUI="gui/$(id -u)"

if [ "${1:-}" = "uninstall" ]; then
  echo "Stopping and removing $LABEL…"
  launchctl bootout "$GUI/$LABEL" 2>/dev/null || launchctl unload "$DEST" 2>/dev/null || true
  rm -f "$DEST"
  echo "Removed. (The repo plist template is left in place.)"
  exit 0
fi

mkdir -p "$HOME/Library/LaunchAgents" "$REPO/deploy/logs"

# Substitute the real repo path into the template.
sed "s#__REPO__#$REPO#g" "$SRC" > "$DEST"
echo "Wrote $DEST"

# Reload cleanly (bootout first in case it's already loaded).
launchctl bootout "$GUI/$LABEL" 2>/dev/null || true
launchctl bootstrap "$GUI" "$DEST"
launchctl enable "$GUI/$LABEL"
launchctl kickstart -k "$GUI/$LABEL"

echo
echo "Installed and started '$LABEL'."
echo "  status : launchctl print $GUI/$LABEL | grep -E 'state|pid'"
echo "  logs   : tail -f $REPO/deploy/logs/finguru.{out,err}.log"
echo "  stop   : ./deploy/install-launchd.sh uninstall"
echo
echo "First start runs 'next build' (~1 min); later restarts reuse it and are"
echo "near-instant. After pulling new code, rebuild with:"
echo "  FORCE_BUILD=1 launchctl kickstart -k $GUI/$LABEL   # or just re-run install"
