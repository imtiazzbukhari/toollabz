#!/usr/bin/env bash
# Example production release (run on the VPS from repo root after `git pull`).
# Ensures `output: "standalone"` always ships with `.next/static` copied and validated
# before the app is restarted — prevents unstyled HTML if a step is skipped.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"
export NODE_ENV=production
npm ci
npm run build
# If using PM2 (adjust app name / ecosystem file):
# pm2 restart toollabz --update-env || pm2 start deploy/pm2.standalone.example.cjs
