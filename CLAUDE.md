# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Personal academic website for Jee-weon Jung (jungjee.com). Being rebuilt from a Jekyll site to Next.js 15 (App Router) + Tailwind CSS, deployed on Cloudflare Pages.

Design spec: `docs/superpowers/specs/2026-04-15-website-rebuild-design.md`

## Development Commands

```bash
# Install dependencies
npm install

# Local development server (http://localhost:3000)
npm run dev

# Build static export (outputs to out/)
npm run build
```

## Architecture

- **Framework**: Next.js 15 with App Router, TypeScript, static export (`output: 'export'`)
- **Styling**: Tailwind CSS — light/minimal palette, sans-serif typography, ~680px max content width
- **Hosting**: Cloudflare Pages, auto-deploys from GitHub on push to master
- **Domain**: jungjee.com / www.jungjee.com

## Site Structure

Two pages only:
- `/` (Home) — bio paragraph + experience timeline
- `/academic` — selected publications, mentoring (expandable entries), resources

Shared header across both pages: name (left), "Academic" nav link, social icon row (Scholar, GitHub, LinkedIn, ResearchGate, email).

## Data

- `src/data/publications.json` — 5-10 selected papers only (full list maintained in CV PDF)
- `src/data/mentoring.json` — student entries with topics and publication outcomes
- `public/CV_Jee-weon_Jung.pdf` — linked from academic page, not rendered

To add a publication or mentee: edit the corresponding JSON file, no component changes needed.

## Deployment

Cloudflare Pages connected to GitHub repo. Build command: `npm run build`, output directory: `out/`.
