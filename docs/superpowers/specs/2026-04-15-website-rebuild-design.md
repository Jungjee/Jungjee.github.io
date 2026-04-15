# Website Rebuild Design Spec

Personal academic website for Jee-weon Jung (jungjee.com). Replacing the current Jekyll/GitHub Pages site with a custom-built Next.js site deployed on Cloudflare Pages.

## Stack

- **Framework:** Next.js 15 (App Router), TypeScript
- **Styling:** Tailwind CSS
- **Output:** Static export (`output: 'export'`) — no server, just HTML/CSS/JS
- **Hosting:** Cloudflare Pages, auto-deploy from GitHub on push
- **Domain:** jungjee.com / www.jungjee.com

## Site Structure

Two pages:

- `/` — Home (bio, experience)
- `/academic` — Selected publications, mentoring, resources

## Project Layout

```
src/
├── app/
│   ├── layout.tsx            # Root layout: header, font, metadata
│   ├── page.tsx              # Home page
│   └── academic/
│       └── page.tsx          # Academic page
├── components/
│   ├── Header.tsx            # Name + nav + social icons
│   ├── ExperienceTimeline.tsx
│   ├── PublicationList.tsx   # Renders selected pubs from JSON
│   └── MentoringSection.tsx  # Expandable ongoing/previous entries
└── data/
    ├── publications.json     # 5-10 selected papers only
    └── mentoring.json        # Student entries with outcomes
public/
└── CV_Jee-weon_Jung.pdf
```

## Removed from current site (intentional)

- **Contact page** — absorbed into the header's social icon row (Scholar, GitHub, LinkedIn, ResearchGate, email)
- **Full publication list** — maintained in CV PDF only
- **bits-logo.png** — not used in new design

## Home Page (`/`)

Top to bottom:

1. **Header** (shared) — "Jee-weon Jung" left-aligned (clicking name navigates to `/`), "Academic" nav link, social icon row (Google Scholar, GitHub, LinkedIn, ResearchGate, email)
2. **Bio** — short paragraph: role at Apple, research focus (speech processing, anti-spoofing, speaker recognition)
3. **Experience timeline** — vertical list: Apple (2024-present), CMU (2023-2024), Naver (2020-2023)
4. **Education** — PhD in CSE, University of Seoul (2017-2021); BS in CSE + BBA, University of Seoul (2013-2017)
5. **Selected honors** — DCASE 2024 1st place, DCASE 2023 1st place, DIHARD 2021 3rd place
6. **Footer** — minimal

## Academic Page (`/academic`)

Top to bottom:

1. **Header** (shared)
2. **Selected Publications** — 5-10 impactful papers from `publications.json`. Format: authors (user's name bolded), title (italic), venue, year. Link to CV PDF for full list.
3. **Mentoring** — brief intro text ("I'm always excited to mentor new individuals..."), then "Ongoing" and "Previous" subsections. Each entry: student name (linked), date range, topic. Expandable to show publication outcomes. Data from `mentoring.json`.
4. **Resources** — challenge/workshop organizations (SASV, VoxSRC, ASVspoof) and datasets (HuggingFace/Zenodo links). Hardcoded since rarely updated.

## Styling

- **Palette:** white/off-white background, near-black text (#111), muted secondary (#555), soft blue accent for links (#2563eb)
- **Typography:** sans-serif (Inter or system stack), optional monospace for header name. Line height 1.6-1.7, max content width ~680px.
- **Responsive:** single column at all sizes, header stacks vertically on mobile. No hamburger menu.
- **Interactions:** link hover effects, smooth expand/collapse on mentoring entries. No animations or scroll effects.

## Data Management

- Selected publications and mentoring entries stored as JSON files in `src/data/`
- Full publication list is NOT on the site — maintained in the CV PDF only
- To add a publication: edit `publications.json`
- To add a mentee: edit `mentoring.json`

### publications.json schema

```json
[
  {
    "authors": "J. Jung, H. Heo, H. Tak, ...",
    "title": "AASIST: Audio anti-spoofing using integrated spectro-temporal graph attention networks",
    "venue": "ICASSP",
    "year": 2022,
    "url": "https://..."
  }
]
```

### mentoring.json schema

```json
[
  {
    "name": "Siddhant Arora",
    "url": "https://scholar.google.com/...",
    "startYear": 2024,
    "endYear": null,
    "status": "ongoing",
    "topic": "Spoken language understanding, Spoken dialogue systems",
    "outcomes": [
      "Siddhant Arora, ..., **Jee-weon Jung**, ..., in Proc. Interspeech, 2025."
    ]
  }
]
```

## Technical Notes

- **Node version:** 20+, npm
- **SEO:** Each page gets a `<title>` and `<meta description>`. Open Graph tags for sharing.
- **404 page:** Custom 404 page with link back to home
- **Accessibility:** Semantic HTML (`<nav>`, `<main>`, `<article>`), `aria-expanded` on mentoring toggles, keyboard-navigable expand/collapse
- **No images** in initial build (no profile photo, no logos). `public/` reserved for CV PDF only.

## Deployment

- Cloudflare Pages connected to the GitHub repo
- Build command: `npm run build`
- Output directory: `out/`
- Auto-deploys on push to master
- Custom domain: jungjee.com configured via Cloudflare DNS
