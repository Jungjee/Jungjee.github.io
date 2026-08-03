# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this repo is

The personal academic website of Jee-weon Jung (jungjee.com). It contains **two independent site systems** — do not confuse them:

1. **Legacy Jekyll site** (repo root: `index.md`, `_config.yml`, `_layouts/`, `_sass/`, `contact.md`, `resource.md`, `mentoring.md`, `css/`, `archive/`). This is the *old* site. It still builds via GitHub Pages and remains reachable at `jungjee.github.io`. It is the rollback target — leave it working.
2. **New static site** (`site/`). A single self-contained page that is what `jungjee.com` actually serves today via Cloudflare Pages. **This is the site to edit for anything user-facing on jungjee.com.**

The redesign work lives on the `redesign-v2` branch (not `master`). `mockups/` holds the three original design explorations (`v1-signal`, `v2-journal`, `v3-plaintext`); `v2-journal` is the chosen direction and `site/index.html` is its productionized build. Treat `site/index.html` as canonical — the `mockups/` files are historical and may be stale.

## The production file: `site/index.html`

One hand-authored, fully self-contained HTML file: all CSS is in a single `<style>` block, all JS in inline `<script>`s, no build step, no external requests (fonts are system stacks, favicon is an inline SVG data-URI). `site/` also bundles `jeeweon.png`, `CV_Jee-weon_Jung.pdf`, and `CNAME`.

Architecture worth knowing before editing:

- **Everything is token-driven.** Colors are CSS custom properties on `:root`. Never hardcode a color — add/route through a token so both themes stay correct.
- **Dual theme = two visual worlds.** Light = paper `#faf8f3` + oxblood `#8a2b1e` ("Journal"); dark/night = near-black `#0a0d11` + signal-green `#37e0b0` (borrowed from the rejected V1 "Signal"). Tokens are redefined in three places that must stay in sync: `@media (prefers-color-scheme: dark)`, `:root[data-theme="dark"]`, and `:root[data-theme="light"]`.
- **Theme is chosen by local time of day.** A synchronous script in `<head>` sets `data-theme` before first paint (day 07:00–18:59 → light, else dark) to avoid a flash. The nav toggle overrides and persists the choice in `sessionStorage` (so a fresh visit always follows the clock; a manual flip sticks only for that tab session). Change the day window in that head script.
- **Layout** is a single-page anchor site: masthead + nav, hero (`.lead`, id `#top` — drop-cap paragraph + "At a glance" aside + CTA buttons), then numbered sections §01 Experience/Education, §02 Honors, §03 Selected Publications, §04 Mentoring, §05 Resources, §06 Contact (ids `#exp #awards #pubs #mentoring #resources #contact`).
- **Two navigation mechanisms — keep both in sync when sections change.** The top `.topnav` and a fixed right-edge `.sidenav` (tick marks that reveal labels on hover). A `min-width:1080px` query shows the side navigator; below that it is hidden and `.topnav` becomes `position:sticky`. An IntersectionObserver scroll-spy (rootMargin `-45% 0px -50% 0px`) toggles `.active` on the side-nav link for whichever section sits in the viewport's middle band. So a section's link exists in **three** places — top nav, side nav, and its `id`/`§ NN` label — update all of them (and renumber `§ NN`) when adding/removing a section.
- **Responsive** via `max-width` breakpoints (1080 side-nav↔sticky-top, then 820 / 760 / 640); grids collapse to single column and the top nav wraps. There is no horizontal-overflow guard by design — verify changes don't introduce overflow (see below).
- **Content conventions:** mentoring papers use full author lists with `<b>Jee-weon Jung</b>` bolded; the Selected Publications list uses `<em>J. Jung</em>` + a venue line and is ordered thematically (anti-spoofing/deepfake → speaker recognition → speech foundation models), AASIST first.

## Deploying (this is non-obvious — read before deploying)

Cloudflare Pages project: **`jungjee`** (account `41eba909656c2056cbc8a20d29026061`), canonical `jungjee-github-io.pages.dev`, custom domains `jungjee.com` + `www.jungjee.com`.

The project is **git-connected with production branch = `master`, but every *git* build of `master` FAILS** (master is the Jekyll source, which Pages can't build). So the site is published by **direct upload with wrangler**, and the branch flag must match the production branch (`master`) or it lands as a preview and the custom domain shows "Deployment Not Found":

```bash
# Publish to production (jungjee.com):
npx wrangler pages deploy site --project-name=jungjee --branch=master --commit-dirty=true

# Publish a preview only (*.pages.dev, does NOT touch jungjee.com):
npx wrangler pages deploy site --project-name=jungjee --branch=preview --commit-dirty=true
```

**Push-to-deploy IS enabled** (as of 2026-07-26). The project is git-connected (production branch `master`); pushing to `master` triggers a Cloudflare build that publishes `site/`. Getting there required setting, in the Pages dashboard → Build configuration: **Framework preset = None**, **Build command = empty**, **Build output directory = `site`**. The project had been auto-detected as **Jekyll**, whose `jekyll build` command runs on every push and fails (a non-ASCII char in the `jekyll-theme-primer` Sass), which produced empty/failed deployments. **Never re-add a build command or re-select the Jekyll preset** — it will break deploys again. Normal way to ship now: edit `site/index.html`, `git push origin HEAD:master`. The `wrangler pages deploy` above still works as a manual fallback.

The metrics-band numbers (Publications / Citations / h-index / i10-index) refresh themselves from a **launchd timer on Jee-weon's Mac** — `scripts/refresh-metrics-local.sh`, run daily at 09:17 local by `~/Library/LaunchAgents/com.jungjee.metrics-refresh.plist` via the stable launcher `~/.jungjee-metrics/run.sh`. It reads Citations/h-index/i10 from Google Scholar and Publications from the CV's `Publications (... N publications ...)` heading via `pdftotext`, rewrites the four tiles in `site/index.html`, and pushes to `master` (auto-deploys). Verified end-to-end 2026-08-03. Log: `~/Library/Logs/jungjee-metrics.log`. Manual run: `launchctl kickstart -p gui/$(id -u)/com.jungjee.metrics-refresh`. Remove: `launchctl bootout gui/$(id -u)/com.jungjee.metrics-refresh`.

**Why local and not CI — this is the whole story, don't redo the experiment.** Google Scholar refuses datacenter IP ranges. The GitHub Actions version (`.github/workflows/metrics-refresh.yml`) is now only a backup: of the four scheduled runs after it went daily, **all four were blocked**, and since a blocked run exits 0 they showed **green while doing nothing** — which is how the site sat at 5,044 for three days while Scholar read 5,096. A residential IP has succeeded on every attempt. Retrying inside one CI run cannot help either: a runner holds one outbound IP for the whole job (run 30567292201 burned 6m38s proving that).

Four things worth knowing before touching any of it:
- **The timer works on its own throwaway clone** (`~/.jungjee-metrics/repo`, hard-reset to `origin/master` each run), never the iCloud working copy. Two reasons, both found the hard way: launchd agents get **no TCC access to `~/Library/Mobile Documents`**, so pointing the job at the iCloud checkout fails with `Operation not permitted` (exit 126) — silently, at 9am, forever; and a background job committing inside an iCloud-synced tree invites sync conflicts. The launcher lives outside git too, because the job hard-resets the repo and bash reads a script incrementally as it runs.
- **`update_metrics.py` exit codes:** 0 = parsed, **2 = every source refused** (a skip, not a problem), 1 = real failure. Guards before writing: each value must be a positive int, must not decrease, and must not more than double — a violation exits 1 without touching the file, so a CAPTCHA page can never blank the band.
- **Failures are surfaced, skips are silent.** The local script raises a macOS notification on a real failure (missing clone, guard violation, push failure); being offline or refused just logs. The Actions run writes `SKIPPED` / `UPDATED` into its run summary — **a green check there does not mean the numbers moved.**
- **A Claude cloud routine cannot do this job**, though not for the reason you'd guess: it *reads* Scholar fine (its WebFetch egresses through Anthropic infrastructure, not a blocked range), but it cannot **ship** — `git push` returns HTTP 403 on `git-receive-pack` from the sandbox git proxy while `fetch` works, and the routine's own "add repo with push access" attempt also failed, suggesting read-only is a property of that sandbox. Not a GitHub-side block: `master` has no branch protection and no rulesets. The superseded routine is `trig_01DFJwjGbjTQ3iFHXsQHnfGN` — disable it at `https://claude.ai/code/routines` so it stops firing.

Don't bother swapping Scholar for OpenAlex or Semantic Scholar — both fragment this author (OpenAlex reports 2,141 citations / h=21 against Scholar's 5,096 / h=32). Scholar has no API.

Custom-domain / DNS changes are done in the Cloudflare dashboard (this wrangler version has no `pages domain` command): `https://dash.cloudflare.com/41eba909656c2056cbc8a20d29026061/pages/view/jungjee/domains`. **Rollback:** remove the custom domain there, or re-point DNS to `jungjee.github.io` (the legacy Jekyll site is untouched on `master`).

## Verifying a change locally (no dev server; it's a static file)

Open `site/index.html` directly, or render it headless. Note two macOS quirks:

- **`open site/index.html`** works, but for scripted screenshots use Chrome headless:
  `"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless --window-size=1280,900 --screenshot=out.png "file://$PWD/site/index.html"`
- **macOS clamps Chrome's CLI window to ~500px CSS width**, so you cannot screenshot a true 375px phone via `--window-size`. To confirm responsiveness, inject a probe that reports `document.documentElement.scrollWidth` vs `clientWidth` (overflow check) rather than trusting a cropped narrow screenshot.
- To preview **night mode** without waiting for evening, set `data-theme="dark"` on `<html>` in a temp copy, or change the machine clock.

## Repo gotchas

- **Apple sandbox network proxy (bites `git push`):** an Apple Claude Code security proxy in `~/.claude/apple/` intercepts outbound traffic and blocks anything not on an allowlist — it reinstalled itself on 2026-07-28 and broke `git push` with `CONNECT tunnel failed, response 403`. Fix is to append hostnames to `~/.claude/apple/dangerous_allowed_domains.csv` (or the dashboard at `http://localhost:6755`); `github.com`, `api.github.com`, `codeload.github.com`, `results-receiver.actions.githubusercontent.com`, `objects.githubusercontent.com`, `jungjee.com` and the proxy hosts used by the metrics script are already added. Symptom to recognize: a `403`/`http=000` on a host that plainly works in a browser.
- **npm registry:** Apple's internal registry (`npm.apple.com`) was configured and broke `npx wrangler` off-VPN. Both the global `~/.npmrc` and this repo's `.npmrc` now point at the public registry (`registry=https://registry.npmjs.org/`) — keep the repo one.
- **Commit signing:** the global gitconfig previously forced Apple `ac-sign` (x509) signing, which failed every commit; it has been removed, so `git commit` works normally now. (If it ever resurfaces elsewhere: `git commit --no-gpg-sign`.)
- **Git identity / GitHub auth:** this personal Mac was de-Appled — git identity is `Jee-weon Jung <jeeweonj@ieee.org>`, `gh` is logged into public `github.com` (account `Jungjee`) only. Remote is `https://github.com/Jungjee/Jungjee.github.io`.
- **Commit style (user preference):** commit after each logical unit; `<type>: <summary>` first line with a detailed body naming files/keys; end the body with `Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>`; add a sequential lightweight tag (`vN-...`) after each commit for easy rollback.
- Untracked build artifacts from a prior Next.js experiment may be present (`.next/`, `out/`, `node_modules/`, `next-env.d.ts`, `ref-karpathy-style.css`) — ignore; they are not part of either live site.
