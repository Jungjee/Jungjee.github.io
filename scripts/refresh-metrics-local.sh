#!/bin/bash
# Refresh the jungjee.com metrics band and push. Run by launchd daily; also
# safe to run by hand at any time.
#
# Why this runs locally instead of in CI: Google Scholar blocks datacenter IPs,
# so the GitHub Actions copy of this job is refused on nearly every run (0 of 4
# scheduled runs reached Scholar, 2026-07-31..08-02). A residential IP gets
# through every time.
#
# Why it works on its own clone (JJ_METRICS_REPO, default
# ~/.jungjee-metrics/repo) rather than the iCloud working copy:
#   1. launchd agents get no TCC access to ~/Library/Mobile Documents, so a
#      script or repo in iCloud Drive fails with "Operation not permitted"
#      (exit 126) — silently, at 9am, forever.
#   2. A background job committing inside an iCloud-synced tree invites sync
#      conflicts with whatever you have open.
# The clone is disposable: it hard-resets to origin/master on every run.
#
# Idempotent — no change means no commit — and update_metrics.py refuses to
# write a value that is non-positive, decreasing, or more than double current.

set -uo pipefail

REPO="${JJ_METRICS_REPO:-$HOME/.jungjee-metrics/repo}"
# launchd gives a minimal PATH: git is in /usr/bin, pdftotext in Homebrew.
export PATH="/opt/homebrew/bin:/usr/bin:/bin:/usr/sbin:/sbin"

log() { echo "[$(date -u +%Y-%m-%dT%H:%M:%SZ)] $*"; }

cd "$REPO" || { log "FATAL: $REPO not found — see scripts/README-metrics-timer.md"; exit 1; }

if ! git fetch -q origin master 2>/dev/null; then
  log "SKIP: cannot reach origin (offline?)."
  exit 0
fi

# The clone holds nothing worth preserving: every value is re-derived each run.
git reset -q --hard origin/master || { log "ERROR: reset failed."; exit 1; }

OUT=$(python3 .github/scripts/update_metrics.py 2>&1)
CODE=$?
log "$OUT"

case "$CODE" in
  0) ;;                                     # parsed fine
  2) log "SKIP: Scholar refused this machine too (unusual — check network)."; exit 0 ;;
  *) log "ERROR: update_metrics.py exited $CODE — leaving the file alone."; exit 1 ;;
esac

if [ -z "$(git status --porcelain site/index.html)" ]; then
  log "No change; nothing to push."
  exit 0
fi

SUMMARY=$(printf '%s\n' "$OUT" | sed -n 's/^result: //p')
git -c user.name='Jee-weon Jung' -c user.email='jeeweonj@ieee.org' \
    commit -q site/index.html \
    -m "chore: metrics refresh" \
    -m "${SUMMARY:-updated metrics band}" \
    -m "Automated by scripts/refresh-metrics-local.sh (launchd)."

if git push -q origin HEAD:master; then
  log "PUSHED: $SUMMARY"
else
  log "ERROR: push failed; next run will re-derive and retry."
  exit 1
fi
