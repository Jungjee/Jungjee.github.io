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

The metrics-band numbers (Publications / Citations / h-index / i10-index) refresh themselves via **GitHub Actions**, not a Claude routine: `.github/workflows/metrics-refresh.yml` (daily at 16:07 UTC ≈ 9:07am PT, plus `workflow_dispatch` with a `dry_run` input) runs `.github/scripts/update_metrics.py`, which reads Citations/h-index/i10 from Google Scholar and Publications from the CV's `Publications (... N publications ...)` heading via `pdftotext`, rewrites the four tiles in `site/index.html`, and pushes to `master` (auto-deploys). Runs are idempotent — no change means no commit.

Three non-obvious things about it:
- **Google Scholar blocks datacenter IPs, and a runner has one IP for the whole job.** So retrying *inside* a run is useless — a 403 on the first request means a 403 on every retry (run 30567292201 burned 6m38s proving this). Retrying only helps *across* runs, which get fresh IPs; hence the **daily** schedule rather than weekly. `SOURCES` (direct → AllOrigins → codetabs) is walked twice per run only to ride out a momentary proxy blip; the proxies are flaky (frequent 500/522) and `r.jina.ai` / `corsproxy.io` don't work at all.
- **A blocked run is a skip, not a failure.** `update_metrics.py` exits **2** when every source refuses, which the workflow swallows, versus exit **1** for a real problem (parse failure, guard violation). Otherwise you'd get mail most days for something that fixes itself. So that silence can't hide a permanent break, a block **on a Monday** fails the run — one email a week, no state file. (A committed heartbeat file was rejected: it would need a commit-message skip token to avoid a daily no-op Cloudflare deploy, and Cloudflare documents only branch-level build control, no such token.)
- **Guards before writing:** each value must be a positive int, must not decrease, and must not more than double week-over-week; a violation exits 1 without touching the file, so a CAPTCHA page can never blank the band.

Don't bother swapping Scholar for OpenAlex or Semantic Scholar — both fragment this author (OpenAlex reports 2,141 citations / h=21 against Scholar's 5,044 / h=31). Scholar has no API.

The earlier approach — a scheduled **Claude cloud routine** (`trig_01DFJwjGbjTQ3iFHXsQHnfGN`) — read everything correctly but **could not ship**: `git push origin HEAD:master` returned HTTP 403 on `git-receive-pack` from the sandbox git proxy while `fetch` worked, i.e. the routine environment has read-only GitHub access (confirmed not a GitHub-side block: `master` has no branch protection and no rulesets). That routine is superseded — disable it at `https://claude.ai/code/routines` so it stops firing.

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
