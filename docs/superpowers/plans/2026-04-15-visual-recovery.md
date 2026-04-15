# Visual Design Recovery Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the site from "rendered markdown" into a polished, visually distinctive academic personal site with real graphic design.

**Architecture:** Rewrite every component's styling in-place. Add a design system layer in globals.css, introduce a hero section with visual weight, use cards/borders/subtle backgrounds to create visual hierarchy, add a decorative timeline, style section headings with accent borders, and polish all interactive elements. No structural changes to data or routing — purely visual.

**Tech Stack:** Tailwind CSS v4 (configured via `@theme inline` in globals.css), Next.js 16

**What's wrong now:** Every component is unstyled text with `space-y` and `text-sm`/`text-lg`. No backgrounds, no borders, no cards, no visual containers, no decorative elements, no hover states beyond underline, no visual rhythm. It looks like a markdown file rendered in a browser.

---

## File Map

| File | What changes |
|---|---|
| `src/app/globals.css` | Expanded theme tokens, smooth scrolling, selection color, refined link transitions, subtle gradient/bg classes |
| `src/app/layout.tsx` | Wider max-width (780px), subtle page background gradient |
| `src/components/Header.tsx` | Sticky header with backdrop blur, bottom border, pill-style social icons with hover lift, active nav indicator |
| `src/components/Footer.tsx` | Richer footer with link columns and muted background band |
| `src/app/page.tsx` | Hero section with large name/title, accent line, role badge; restructured with visual sections |
| `src/components/ExperienceTimeline.tsx` | Left-border decorative timeline with dots, cards per entry |
| `src/app/academic/page.tsx` | Section cards with borders, styled resource grid |
| `src/components/PublicationList.tsx` | Numbered cards with hover, venue badges |
| `src/components/MentoringSection.tsx` | Cards with avatar placeholder, animated expand, status badges |
| `src/app/not-found.tsx` | Centered with large 404 number, decorative element |

---

## Chunk 1: Design System & Layout Shell

### Task 1: Expand the design system in globals.css

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Rewrite globals.css with full design system**

Replace `src/app/globals.css` with:

```css
@import "tailwindcss";

@theme inline {
  --color-primary: #0f172a;
  --color-secondary: #64748b;
  --color-accent: #2563eb;
  --color-accent-light: #dbeafe;
  --color-surface: #f8fafc;
  --color-border: #e2e8f0;
  --color-border-light: #f1f5f9;
  --font-sans: "Inter", ui-sans-serif, system-ui, -apple-system, sans-serif;
  --font-mono: ui-monospace, SFMono-Regular, Menlo, monospace;
}

html {
  scroll-behavior: smooth;
}

body {
  color: var(--color-primary);
  line-height: 1.7;
  background: linear-gradient(180deg, var(--color-surface) 0%, #ffffff 300px);
  min-height: 100vh;
}

::selection {
  background-color: var(--color-accent-light);
  color: var(--color-primary);
}

a {
  color: var(--color-accent);
  text-decoration: none;
  transition: color 0.15s ease;
}

a:hover {
  color: #1d4ed8;
}

/* Section heading with accent left border */
.section-heading {
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: var(--color-secondary);
  padding-left: 0.75rem;
  border-left: 3px solid var(--color-accent);
  margin-bottom: 1.25rem;
}

/* Card base */
.card {
  background: white;
  border: 1px solid var(--color-border);
  border-radius: 0.75rem;
  padding: 1.25rem;
  transition: box-shadow 0.2s ease, border-color 0.2s ease;
}

.card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--color-accent-light);
}

/* Badge */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.125rem 0.5rem;
  border-radius: 9999px;
  background: var(--color-accent-light);
  color: var(--color-accent);
}

.badge-muted {
  background: var(--color-border-light);
  color: var(--color-secondary);
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/app/globals.css
git commit -m "style: expand design system with cards, badges, gradients, and visual tokens

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 2: Update layout shell

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Widen content area and refine body wrapper**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Jee-weon Jung",
    template: "%s | Jee-weon Jung",
  },
  description:
    "Senior Research Scientist at Apple. Speech processing, audio anti-spoofing, and speaker recognition.",
  openGraph: {
    title: "Jee-weon Jung",
    description:
      "Senior Research Scientist at Apple. Speech processing, audio anti-spoofing, and speaker recognition.",
    url: "https://jungjee.com",
    siteName: "Jee-weon Jung",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased font-sans">
        <Header />
        <div className="mx-auto max-w-[780px] px-6 pt-6 pb-12">
          <main>{children}</main>
        </div>
        <Footer />
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/layout.tsx
git commit -m "style: widen content, move header/footer outside content wrapper

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 3: Redesign Header with sticky blur and polished icons

**Files:**
- Modify: `src/components/Header.tsx`

- [ ] **Step 1: Rewrite Header.tsx**

Replace `src/components/Header.tsx` with:

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const socialLinks = [
  {
    name: "Google Scholar",
    url: "https://scholar.google.com/citations?user=A5OcLdAAAAAJ",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/Jungjee",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jee-weon-jung-6b125bba/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "ResearchGate",
    url: "https://www.researchgate.net/profile/Jee-Weon-Jung-2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
        <path d="M19.586 0c-1.326 0-2.652.488-3.66 1.464-1.008.976-1.513 2.252-1.513 3.528v2.336H5.41c-2.98 0-5.41 2.43-5.41 5.41v5.852C0 21.57 2.43 24 5.41 24h5.852c2.98 0 5.41-2.43 5.41-5.41V9.328h2.336c1.276 0 2.552-.504 3.528-1.513C23.512 6.807 24 5.481 24 4.155V4.1c0-1.326-.488-2.652-1.464-3.66C21.56.434 20.573 0 19.586 0zM15.166 18.59c0 2.164-1.74 3.904-3.904 3.904H5.41c-2.164 0-3.904-1.74-3.904-3.904V12.738c0-2.164 1.74-3.904 3.904-3.904h5.852c2.164 0 3.904 1.74 3.904 3.904v5.852zm7.328-14.434c0 1.05-.41 2.097-1.233 2.92-.823.823-1.87 1.233-2.92 1.233h-2.336V5.992c0-1.05.41-2.097 1.233-2.92.823-.823 1.87-1.233 2.92-1.233h.055c1.05 0 2.042.41 2.864 1.233.41.41.823.976 1.068 1.595.245.619.349 1.233.349 1.49z" />
      </svg>
    ),
  },
  {
    name: "Email",
    url: "mailto:jeeweonj@ieee.org",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-white/80 border-b border-border">
      <div className="mx-auto max-w-[780px] px-6 py-4 flex items-center justify-between">
        <Link
          href="/"
          className="text-lg font-mono font-bold tracking-tight text-primary hover:text-accent transition-colors no-underline"
        >
          Jee-weon Jung
        </Link>
        <div className="flex items-center gap-5">
          <nav className="flex items-center gap-1">
            {[
              { name: "Home", href: "/" },
              { name: "Academic", href: "/academic" },
            ].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors no-underline ${
                  pathname === link.href
                    ? "bg-accent-light text-accent"
                    : "text-secondary hover:text-primary hover:bg-surface"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
          <div className="h-5 w-px bg-border" />
          <div className="flex items-center gap-1">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-surface transition-all no-underline"
                aria-label={link.name}
              >
                {link.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/Header.tsx
git commit -m "style: sticky glassmorphic header with active nav pills and icon hover states

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 4: Redesign Footer

**Files:**
- Modify: `src/components/Footer.tsx`

- [ ] **Step 1: Rewrite Footer**

Replace `src/components/Footer.tsx` with:

```tsx
export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-[780px] px-6 py-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <p className="font-mono font-semibold text-sm text-primary">Jee-weon Jung</p>
          <p className="text-xs text-secondary mt-1">Senior Research Scientist at Apple</p>
        </div>
        <div className="flex items-center gap-4 text-xs text-secondary">
          <a href="mailto:jeeweonj@ieee.org" className="hover:text-primary transition-colors">jeeweonj@ieee.org</a>
          <span className="text-border">|</span>
          <a href="https://scholar.google.com/citations?user=A5OcLdAAAAAJ" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">Google Scholar</a>
          <span className="text-border">|</span>
          <a href="https://github.com/Jungjee" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "style: footer with background band, role tagline, and contact links

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Chunk 2: Home Page Visual Overhaul

### Task 5: Redesign home page with hero and visual sections

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Rewrite page.tsx with hero and styled sections**

Replace `src/app/page.tsx` with:

```tsx
import ExperienceTimeline from "@/components/ExperienceTimeline";

const honors = [
  { title: "DCASE 2024 Challenge Task 6", result: "1st place", topic: "Automated Audio Captioning" },
  { title: "DCASE 2023 Challenge Task 6-a", result: "1st place", topic: "Automated Audio Captioning" },
  { title: "Third DIHARD Challenge", result: "3rd place", topic: "Speaker Diarisation" },
];

export default function Home() {
  return (
    <div className="space-y-16">
      {/* Hero section */}
      <section className="pt-10 pb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-accent to-blue-400 flex items-center justify-center text-white font-bold text-lg">
            JJ
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Jee-weon Jung</h1>
            <p className="text-secondary text-sm">Senior Research Scientist at Apple</p>
          </div>
        </div>
        <div className="h-px bg-gradient-to-r from-accent via-accent-light to-transparent my-6" />
        <p className="text-base leading-relaxed text-secondary max-w-prose">
          I&apos;m dedicated to advancing speech processing and machine learning.
          My expertise lies in <span className="text-primary font-medium">audio anti-spoofing</span> and{" "}
          <span className="text-primary font-medium">speaker recognition</span>, areas
          vital for the security and reliability of speech technologies.
          With a PhD from University of Seoul, experience at Naver and Carnegie Mellon,
          I&apos;ve published over 90 papers and won first-place in international challenges.
        </p>
      </section>

      {/* Experience & Education */}
      <ExperienceTimeline />

      {/* Honors */}
      <section>
        <h2 className="section-heading">Honors &amp; Awards</h2>
        <div className="grid gap-3">
          {honors.map((h) => (
            <div key={h.title} className="card flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">{h.title}</p>
                <p className="text-xs text-secondary mt-0.5">{h.topic}</p>
              </div>
              <span className={`badge ${h.result === "1st place" ? "" : "badge-muted"} whitespace-nowrap`}>
                {h.result}
              </span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/page.tsx
git commit -m "style: hero section with avatar, gradient divider, and honor cards with badges

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 6: Redesign ExperienceTimeline with decorative left border

**Files:**
- Modify: `src/components/ExperienceTimeline.tsx`

- [ ] **Step 1: Rewrite ExperienceTimeline**

Replace `src/components/ExperienceTimeline.tsx` with:

```tsx
interface TimelineEntry {
  title: string;
  organization: string;
  period: string;
  current?: boolean;
}

const experience: TimelineEntry[] = [
  { title: "Senior Research Scientist", organization: "Apple", period: "2024 – present", current: true },
  { title: "Postdoctoral Research Associate", organization: "Carnegie Mellon University", period: "2023 – 2024" },
  { title: "Research Scientist", organization: "Naver Clova", period: "2020 – 2023" },
];

const education: TimelineEntry[] = [
  { title: "PhD, Computer Science and Engineering", organization: "University of Seoul", period: "2017 – 2021" },
  { title: "BS, Computer Science and Engineering & BBA", organization: "University of Seoul", period: "2013 – 2017" },
];

function Timeline({ items }: { items: TimelineEntry[] }) {
  return (
    <div className="relative ml-3">
      {/* Vertical line */}
      <div className="absolute left-0 top-2 bottom-2 w-px bg-border" />
      <ul className="space-y-0">
        {items.map((entry) => (
          <li key={entry.period} className="relative pl-6 pb-6 last:pb-0">
            {/* Dot */}
            <div
              className={`absolute left-0 top-2 w-2 h-2 rounded-full -translate-x-[3.5px] ${
                entry.current
                  ? "bg-accent ring-4 ring-accent-light"
                  : "bg-border"
              }`}
            />
            <div className="card">
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
                <div>
                  <span className="font-medium text-sm">{entry.title}</span>
                  <span className="text-secondary text-sm"> · {entry.organization}</span>
                </div>
                <span className="text-xs text-secondary whitespace-nowrap font-mono">{entry.period}</span>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function ExperienceTimeline() {
  return (
    <div className="space-y-12">
      <section>
        <h2 className="section-heading">Experience</h2>
        <Timeline items={experience} />
      </section>
      <section>
        <h2 className="section-heading">Education</h2>
        <Timeline items={education} />
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Verify build and visual check**

```bash
npm run build
```

- [ ] **Step 3: Commit**

```bash
git add src/components/ExperienceTimeline.tsx
git commit -m "style: decorative timeline with dots, vertical line, and cards per entry

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

---

## Chunk 3: Academic Page Visual Overhaul

### Task 7: Redesign PublicationList with numbered cards

**Files:**
- Modify: `src/components/PublicationList.tsx`

- [ ] **Step 1: Rewrite PublicationList**

Replace `src/components/PublicationList.tsx` with:

```tsx
import publications from "@/data/publications.json";

interface Publication {
  authors: string;
  title: string;
  venue: string;
  year: number;
  url: string | null;
}

function highlightAuthor(authors: string): React.ReactNode {
  const parts = authors.split(/(J\. Jung)/);
  return parts.map((part, i) =>
    part === "J. Jung" ? (
      <strong key={i} className="text-primary">{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function PublicationList() {
  return (
    <section>
      <h2 className="section-heading">Selected Publications</h2>
      <p className="text-sm text-secondary mb-5">
        Full publication list available in my{" "}
        <a
          href="/CV_Jee-weon_Jung.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1"
        >
          CV
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-3 h-3">
            <path d="M8.75 2.75a.75.75 0 0 0-1.5 0v5.69L5.03 6.22a.75.75 0 0 0-1.06 1.06l3.5 3.5a.75.75 0 0 0 1.06 0l3.5-3.5a.75.75 0 0 0-1.06-1.06L8.75 8.44V2.75Z" />
            <path d="M3.5 9.75a.75.75 0 0 0-1.5 0v1.5A2.75 2.75 0 0 0 4.75 14h6.5A2.75 2.75 0 0 0 14 11.25v-1.5a.75.75 0 0 0-1.5 0v1.5c0 .69-.56 1.25-1.25 1.25h-6.5c-.69 0-1.25-.56-1.25-1.25v-1.5Z" />
          </svg>
        </a>
      </p>
      <div className="space-y-3">
        {(publications as Publication[]).map((pub, index) => (
          <div key={pub.title} className="card group flex gap-4">
            <div className="flex-shrink-0 w-8 h-8 rounded-lg bg-surface flex items-center justify-center text-xs font-mono font-semibold text-secondary group-hover:bg-accent-light group-hover:text-accent transition-colors">
              {index + 1}
            </div>
            <div className="min-w-0">
              <p className="text-sm leading-relaxed">
                {highlightAuthor(pub.authors)},{" "}
                <em className="text-primary">&ldquo;{pub.title}&rdquo;</em>
              </p>
              <div className="flex items-center gap-2 mt-1.5">
                <span className="badge-muted badge">{pub.venue}</span>
                <span className="text-xs text-secondary font-mono">{pub.year}</span>
                {pub.url && (
                  <a href={pub.url} target="_blank" rel="noopener noreferrer" className="text-xs">
                    View paper &rarr;
                  </a>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PublicationList.tsx
git commit -m "style: publication cards with numbered index, venue badges, and hover states

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 8: Redesign MentoringSection with cards and status badges

**Files:**
- Modify: `src/components/MentoringSection.tsx`

- [ ] **Step 1: Rewrite MentoringSection**

Replace `src/components/MentoringSection.tsx` with:

```tsx
"use client";

import { useState } from "react";
import mentoring from "@/data/mentoring.json";

interface Mentee {
  name: string;
  url: string;
  startYear: number;
  endYear: number | null;
  status: "ongoing" | "previous";
  topic: string;
  outcomes: string[];
}

function MenteeEntry({ mentee }: { mentee: Mentee }) {
  const [isOpen, setIsOpen] = useState(false);
  const period = mentee.endYear
    ? `${mentee.startYear} – ${mentee.endYear}`
    : `${mentee.startYear} – present`;

  return (
    <div className="card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left flex items-start justify-between gap-4"
        aria-expanded={isOpen}
      >
        <div className="flex items-start gap-3">
          {/* Avatar placeholder */}
          <div className="w-9 h-9 rounded-full bg-surface flex items-center justify-center text-xs font-semibold text-secondary flex-shrink-0 mt-0.5">
            {mentee.name.split(" ").map(n => n[0]).join("")}
          </div>
          <div>
            <a
              href={mentee.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-medium hover:text-accent transition-colors"
              onClick={(e) => e.stopPropagation()}
            >
              {mentee.name}
            </a>
            <p className="text-xs text-secondary mt-0.5">{mentee.topic}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className="text-xs text-secondary font-mono">{period}</span>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className={`w-4 h-4 text-secondary transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
          >
            <path fillRule="evenodd" d="M4.22 6.22a.75.75 0 0 1 1.06 0L8 8.94l2.72-2.72a.75.75 0 1 1 1.06 1.06l-3.25 3.25a.75.75 0 0 1-1.06 0L4.22 7.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
          </svg>
        </div>
      </button>
      <div
        className={`overflow-hidden transition-all duration-200 ${
          isOpen ? "max-h-[500px] opacity-100 mt-3 pt-3 border-t border-border-light" : "max-h-0 opacity-0"
        }`}
      >
        {mentee.outcomes.length > 0 && (
          <div className="pl-12">
            <p className="text-xs font-medium text-secondary uppercase tracking-wide mb-2">Publications</p>
            <ul className="space-y-2">
              {mentee.outcomes.map((outcome, i) => (
                <li key={i} className="text-xs text-secondary leading-relaxed pl-3 border-l-2 border-border-light">
                  {outcome}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default function MentoringSection() {
  const ongoing = (mentoring as Mentee[]).filter((m) => m.status === "ongoing");
  const previous = (mentoring as Mentee[]).filter((m) => m.status === "previous");

  return (
    <section>
      <h2 className="section-heading">Mentoring</h2>
      <p className="text-sm text-secondary mb-6">
        I&apos;m always excited to mentor new individuals. Feel free to{" "}
        <a href="mailto:jeeweonj@ieee.org">reach out</a> if you&apos;re interested
        in exploring a collaboration!
      </p>

      <div className="space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold">Ongoing</h3>
            <span className="badge">{ongoing.length}</span>
          </div>
          <div className="space-y-3">
            {ongoing.map((mentee) => (
              <MenteeEntry key={mentee.name} mentee={mentee} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center gap-2 mb-3">
            <h3 className="text-sm font-semibold">Previous</h3>
            <span className="badge badge-muted">{previous.length}</span>
          </div>
          <div className="space-y-3">
            {previous.map((mentee) => (
              <MenteeEntry key={mentee.name} mentee={mentee} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MentoringSection.tsx
git commit -m "style: mentoring cards with initials avatar, chevron animation, and count badges

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 9: Redesign academic page resources with grid cards

**Files:**
- Modify: `src/app/academic/page.tsx`

- [ ] **Step 1: Rewrite academic page**

Replace `src/app/academic/page.tsx` with:

```tsx
import type { Metadata } from "next";
import PublicationList from "@/components/PublicationList";
import MentoringSection from "@/components/MentoringSection";

export const metadata: Metadata = {
  title: "Academic",
  description:
    "Selected publications, mentoring, and research resources by Jee-weon Jung.",
};

const challenges = [
  { name: "SASV 2022", url: "https://sasv-challenge.github.io/", type: "Challenge" },
  { name: "VoxSRC 2022", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2022.html", type: "Challenge" },
  { name: "VoxSRC 2022", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2022.html", type: "Workshop" },
  { name: "VoxSRC 2023", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2023.html", type: "Challenge" },
  { name: "VoxSRC 2023", url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2023.html", type: "Workshop" },
  { name: "ASVspoof 5", url: "https://www.asvspoof.org/workshop2024", type: "Workshop" },
];

type Dataset =
  | { name: string; url: string; host: string }
  | { name: string; urls: { url: string; host: string }[] };

const datasets: Dataset[] = [
  { name: "TITW", url: "https://huggingface.co/datasets/jungjee/titw", host: "HuggingFace" },
  { name: "SpoofCeleb", url: "https://huggingface.co/datasets/jungjee/spoofceleb", host: "HuggingFace" },
  {
    name: "ASVspoof 5",
    urls: [
      { url: "https://huggingface.co/datasets/jungjee/asvspoof5", host: "HuggingFace" },
      { url: "https://zenodo.org/records/14498691", host: "Zenodo" },
    ],
  },
];

export default function AcademicPage() {
  return (
    <div className="space-y-16">
      <PublicationList />
      <MentoringSection />

      <section>
        <h2 className="section-heading">Resources</h2>

        <div className="space-y-8">
          <div>
            <h3 className="text-sm font-semibold mb-3">Challenge &amp; Workshop Organizations</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {challenges.map((c) => (
                <a
                  key={c.url}
                  href={c.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="card flex items-center justify-between gap-2 no-underline group"
                >
                  <span className="text-sm font-medium text-primary group-hover:text-accent transition-colors">{c.name}</span>
                  <span className="badge badge-muted text-[0.65rem]">{c.type}</span>
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Datasets</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {datasets.map((d) => (
                <div key={d.name} className="card">
                  <p className="text-sm font-medium mb-1.5">{d.name}</p>
                  <div className="flex items-center gap-2">
                    {"urls" in d
                      ? d.urls.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="badge text-[0.65rem]"
                          >
                            {link.host} &rarr;
                          </a>
                        ))
                      : (
                          <a
                            href={d.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="badge text-[0.65rem]"
                          >
                            {d.host} &rarr;
                          </a>
                        )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/academic/page.tsx
git commit -m "style: academic page with grid resource cards and typed badges

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```

### Task 10: Polish 404 page

**Files:**
- Modify: `src/app/not-found.tsx`

- [ ] **Step 1: Rewrite 404 page**

Replace `src/app/not-found.tsx` with:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-24 text-center">
      <p className="text-7xl font-mono font-bold text-border mb-4">404</p>
      <h2 className="text-xl font-semibold mb-2">Page not found</h2>
      <p className="text-secondary text-sm mb-8">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link
        href="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-accent text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors no-underline"
      >
        &larr; Back to home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Final full build**

```bash
npm run build
```

Expected: Clean build with all 3 routes.

- [ ] **Step 3: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "style: polished 404 with large number and CTA button

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
```
