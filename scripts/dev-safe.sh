#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"

if pgrep -f "$ROOT_DIR/node_modules/.bin/next dev" >/dev/null || pgrep -f "$ROOT_DIR/node_modules/.bin/velite --watch" >/dev/null; then
  echo "dev server already running for this project."
  echo "run 'bun run dev:clean' first, then start again."
  exit 1
fi

exec "$ROOT_DIR/node_modules/.bin/concurrently" -k -n VELITE,NEXT -c green,cyan "velite --watch" "next dev"
