# Website Rebuild Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild jungjee.com as a Next.js 15 + Tailwind CSS static site with two pages (Home, Academic), deployed on Cloudflare Pages.

**Architecture:** Next.js App Router with static export. Two routes (`/` and `/academic`) share a Header component. Publication and mentoring data live in JSON files, rendered by dedicated components. Tailwind handles all styling with a minimal, karpathy.ai-inspired aesthetic.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, Node 20+, npm

**Spec:** `docs/superpowers/specs/2026-04-15-website-rebuild-design.md`

---

## File Map

| File | Responsibility |
|---|---|
| `next.config.ts` | Static export config (`output: 'export'`) |
| `tailwind.config.ts` | Theme colors, font, max-width |
| `src/app/layout.tsx` | Root layout: font loading, `<html>`/`<body>`, Header, Footer, metadata |
| `src/app/page.tsx` | Home page: bio, experience, education, honors |
| `src/app/academic/page.tsx` | Academic page: publications, mentoring, resources |
| `src/app/not-found.tsx` | Custom 404 page |
| `src/components/Header.tsx` | Shared header: name link, nav, social icons |
| `src/components/Footer.tsx` | Minimal footer |
| `src/components/ExperienceTimeline.tsx` | Experience + education vertical list |
| `src/components/PublicationList.tsx` | Renders selected publications from JSON |
| `src/components/MentoringSection.tsx` | Expandable ongoing/previous mentoring entries |
| `src/data/publications.json` | 5 selected papers |
| `src/data/mentoring.json` | Student entries with outcomes |
| `public/CV_Jee-weon_Jung.pdf` | CV file (copied from repo root) |

---

## Chunk 1: Project Scaffolding & Configuration

### Task 1: Initialize Next.js project

**Files:**
- Create: `package.json`, `next.config.ts`, `tsconfig.json`, `tailwind.config.ts`, `src/app/globals.css`, `.gitignore` (update)

- [ ] **Step 1: Create Next.js app with Tailwind**

Run from the repo root. This will scaffold into the current directory. Remove old Jekyll files first to avoid conflicts.

```bash
# Back up existing content (for reference during migration)
mkdir -p /tmp/jungjee-backup
cp index.md contact.md resource.md mentoring.md /tmp/jungjee-backup/

# Remove old Jekyll files (keep .git, CLAUDE.md, docs, CV PDF, CNAME)
rm -f _config.yml Gemfile Gemfile.lock index.md contact.md resource.md mentoring.md README.md LICENSE bits-logo.png
rm -rf _layouts _sass _site css archive .jekyll-cache .sass-cache

# Note: archive/ directory is intentionally removed (contains old PDF, not needed in new site)

# Initialize Next.js (interactive prompts — answer Yes to TypeScript, Tailwind, App Router, src/ directory; No to Turbopack; use default import alias)
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*"
```

Note: If `create-next-app` refuses because the directory is non-empty, use a temp directory and move files:
```bash
npx create-next-app@latest /tmp/jungjee-next --typescript --tailwind --eslint --app --src-dir --no-turbopack --import-alias "@/*"
cp -r /tmp/jungjee-next/* /tmp/jungjee-next/.* . 2>/dev/null; rm -rf /tmp/jungjee-next
```

- [ ] **Step 2: Configure static export**

Edit `next.config.ts`:

```ts
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: { unoptimized: true },
};

export default nextConfig;
```

- [ ] **Step 3: Configure Tailwind theme**

Edit `tailwind.config.ts` to set up the design system:

```ts
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#111111",
        secondary: "#555555",
        accent: "#2563eb",
      },
      maxWidth: {
        content: "680px",
      },
      fontFamily: {
        sans: [
          "Inter",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
    },
  },
  plugins: [],
};

export default config;
```

- [ ] **Step 4: Set up global CSS**

Replace `src/app/globals.css` with:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply text-primary leading-relaxed;
  }

  a {
    @apply text-accent hover:underline;
  }
}
```

- [ ] **Step 5: Update .gitignore**

Ensure `.gitignore` includes:

```
node_modules/
.next/
out/
.DS_Store
```

- [ ] **Step 6: Copy CV to public/**

```bash
cp CV_Jee-weon_Jung.pdf public/
```

- [ ] **Step 7: Verify project builds**

```bash
npm run build
```

Expected: Build succeeds, `out/` directory created with static files.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat: scaffold Next.js project with Tailwind CSS

Replace Jekyll setup with Next.js 15 App Router + Tailwind.
Static export configured for Cloudflare Pages deployment."
```

---

## Chunk 2: Shared Components (Header + Footer + Layout)

### Task 2: Create Header component

**Files:**
- Create: `src/components/Header.tsx`

- [ ] **Step 1: Create Header with name, nav, and social icons**

Create `src/components/Header.tsx`:

```tsx
import Link from "next/link";

const socialLinks = [
  {
    name: "Google Scholar",
    url: "https://scholar.google.com/citations?user=A5OcLdAAAAAJ",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 24a7 7 0 1 1 0-14 7 7 0 0 1 0 14zm0-24L0 9.5l4.838 3.94A8 8 0 0 1 12 9a8 8 0 0 1 7.162 4.44L24 9.5z" />
      </svg>
    ),
  },
  {
    name: "GitHub",
    url: "https://github.com/Jungjee",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    url: "https://www.linkedin.com/in/jee-weon-jung-6b125bba/",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  {
    name: "ResearchGate",
    url: "https://www.researchgate.net/profile/Jee-Weon-Jung-2",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
        <path d="M19.586 0c-1.326 0-2.652.488-3.66 1.464-1.008.976-1.513 2.252-1.513 3.528v2.336H5.41c-2.98 0-5.41 2.43-5.41 5.41v5.852C0 21.57 2.43 24 5.41 24h5.852c2.98 0 5.41-2.43 5.41-5.41V9.328h2.336c1.276 0 2.552-.504 3.528-1.513C23.512 6.807 24 5.481 24 4.155V4.1c0-1.326-.488-2.652-1.464-3.66C21.56.434 20.573 0 19.586 0zM15.166 18.59c0 2.164-1.74 3.904-3.904 3.904H5.41c-2.164 0-3.904-1.74-3.904-3.904V12.738c0-2.164 1.74-3.904 3.904-3.904h5.852c2.164 0 3.904 1.74 3.904 3.904v5.852zm7.328-14.434c0 1.05-.41 2.097-1.233 2.92-.823.823-1.87 1.233-2.92 1.233h-2.336V5.992c0-1.05.41-2.097 1.233-2.92.823-.823 1.87-1.233 2.92-1.233h.055c1.05 0 2.042.41 2.864 1.233.41.41.823.976 1.068 1.595.245.619.349 1.233.349 1.49z" />
      </svg>
    ),
  },
  {
    name: "Email",
    url: "mailto:jeeweonj@ieee.org",
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
];

export default function Header() {
  return (
    <header className="py-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <Link href="/" className="text-2xl font-mono font-bold text-primary no-underline hover:no-underline">
            Jee-weon Jung
          </Link>
        </div>
        <div className="flex items-center gap-6">
          <nav>
            <Link href="/academic" className="text-secondary hover:text-primary no-underline hover:no-underline">
              Academic
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target={link.url.startsWith("mailto:") ? undefined : "_blank"}
                rel={link.url.startsWith("mailto:") ? undefined : "noopener noreferrer"}
                className="text-secondary hover:text-primary transition-colors no-underline"
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

- [ ] **Step 2: Commit**

```bash
git add src/components/Header.tsx
git commit -m "feat: add Header component with nav and social icons"
```

### Task 3: Create Footer component

**Files:**
- Create: `src/components/Footer.tsx`

- [ ] **Step 1: Create minimal Footer**

Create `src/components/Footer.tsx`:

```tsx
export default function Footer() {
  return (
    <footer className="py-8 mt-16 border-t border-gray-200">
      <p className="text-sm text-secondary">
        Jee-weon Jung
      </p>
    </footer>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/Footer.tsx
git commit -m "feat: add Footer component"
```

### Task 4: Set up root layout

**Files:**
- Modify: `src/app/layout.tsx`

- [ ] **Step 1: Replace default layout with site layout**

Replace `src/app/layout.tsx` with:

```tsx
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
});

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
      <body className={`${inter.className} bg-white antialiased`}>
        <div className="mx-auto max-w-content px-6">
          <Header />
          <main>{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
```

- [ ] **Step 2: Verify build**

```bash
npm run build
```

Expected: Build succeeds.

- [ ] **Step 3: Commit**

```bash
git add src/app/layout.tsx
git commit -m "feat: set up root layout with Header, Footer, and metadata"
```

---

## Chunk 3: Home Page

### Task 5: Create ExperienceTimeline component

**Files:**
- Create: `src/components/ExperienceTimeline.tsx`

- [ ] **Step 1: Create ExperienceTimeline component**

Create `src/components/ExperienceTimeline.tsx`:

```tsx
interface TimelineEntry {
  title: string;
  organization: string;
  period: string;
}

const experience: TimelineEntry[] = [
  {
    title: "Senior Research Scientist",
    organization: "Apple",
    period: "2024 – present",
  },
  {
    title: "Postdoctoral Research Associate",
    organization: "Carnegie Mellon University",
    period: "2023 – 2024",
  },
  {
    title: "Research Scientist",
    organization: "Naver Clova",
    period: "2020 – 2023",
  },
];

const education: TimelineEntry[] = [
  {
    title: "PhD, Computer Science and Engineering",
    organization: "University of Seoul",
    period: "2017 – 2021",
  },
  {
    title: "BS, Computer Science and Engineering & BBA",
    organization: "University of Seoul",
    period: "2013 – 2017",
  },
];

export default function ExperienceTimeline() {
  return (
    <div className="space-y-10">
      <section>
        <h2 className="text-lg font-semibold mb-4">Experience</h2>
        <ul className="space-y-3">
          {experience.map((entry) => (
            <li key={entry.period} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <div>
                <span className="font-medium">{entry.title}</span>
                <span className="text-secondary"> · {entry.organization}</span>
              </div>
              <span className="text-sm text-secondary whitespace-nowrap">{entry.period}</span>
            </li>
          ))}
        </ul>
      </section>
      <section>
        <h2 className="text-lg font-semibold mb-4">Education</h2>
        <ul className="space-y-3">
          {education.map((entry) => (
            <li key={entry.period} className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-1">
              <div>
                <span className="font-medium">{entry.title}</span>
                <span className="text-secondary"> · {entry.organization}</span>
              </div>
              <span className="text-sm text-secondary whitespace-nowrap">{entry.period}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/ExperienceTimeline.tsx
git commit -m "feat: add ExperienceTimeline component with experience and education"
```

### Task 6: Build home page

**Files:**
- Modify: `src/app/page.tsx`

- [ ] **Step 1: Replace default page with home content**

Replace `src/app/page.tsx` with:

```tsx
import ExperienceTimeline from "@/components/ExperienceTimeline";

const honors = [
  "Ranked 1st place at the DCASE 2024 Challenge Task 6 (automated audio captioning)",
  "Ranked 1st place at the DCASE 2023 Challenge Task 6-a (automated audio captioning)",
  "Ranked 3rd place at the Third DIHARD Speech Diarisation Challenge (track 1 core)",
];

export default function Home() {
  return (
    <article className="space-y-12 py-8">
      <section>
        <p className="text-base leading-relaxed">
          Welcome! I&apos;m Jee-weon Jung, a Senior Research Scientist at Apple,
          dedicated to advancing speech processing and machine learning. My
          expertise lies in audio anti-spoofing and speaker recognition, areas
          that are vital for the security and reliability of speech technologies.
          With a PhD from University of Seoul, research scientist experience at
          Naver Corporation, and postdoc experience at Carnegie Mellon
          University, I&apos;ve had the privilege of working on cutting-edge
          research projects. My work has been honored with first-place awards in
          international challenges, and I&apos;ve published over 90 papers in
          leading academic journals and conferences.
        </p>
      </section>

      <ExperienceTimeline />

      <section>
        <h2 className="text-lg font-semibold mb-4">Selected Honors</h2>
        <ul className="space-y-2">
          {honors.map((honor) => (
            <li key={honor} className="text-secondary">
              {honor}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
```

- [ ] **Step 2: Start dev server and verify home page**

```bash
npm run dev
```

Open `http://localhost:3000` in a browser. Verify:
- Header shows "Jee-weon Jung" with "Academic" link and social icons
- Bio paragraph renders
- Experience and Education sections show correctly
- Selected Honors list renders
- Footer shows at bottom
- Layout is centered with ~680px max width

- [ ] **Step 3: Commit**

```bash
git add src/app/page.tsx
git commit -m "feat: build home page with bio, experience, education, and honors"
```

---

## Chunk 4: Data Files & Academic Page Components

### Task 7: Create publication and mentoring data files

**Files:**
- Create: `src/data/publications.json`
- Create: `src/data/mentoring.json`

- [ ] **Step 1: Create publications.json**

Create `src/data/publications.json` with the 5 selected papers from the current site:

```json
[
  {
    "authors": "J. Jung, H. Heo, H. Tak, H. Shim, J. S. Chung, B. Lee, H. Yu, and N. Evans",
    "title": "AASIST: Audio anti-spoofing using integrated spectro-temporal graph attention networks",
    "venue": "Proc. ICASSP",
    "year": 2022,
    "url": null
  },
  {
    "authors": "J. Jung, H. Heo, J. Kim, H. Shim, and H. Yu",
    "title": "RawNet: Advanced end-to-end deep neural network using raw waveforms for text-independent speaker verification",
    "venue": "Proc. INTERSPEECH",
    "year": 2019,
    "url": null
  },
  {
    "authors": "J. Jung, H. Tak, H. Shim, H. Heo, B. Lee, S. Chung, H. Yu, N. Evans, and T. Kinnunen",
    "title": "SASV 2022: The First Spoofing-Aware Speaker Verification Challenge",
    "venue": "Proc. INTERSPEECH",
    "year": 2022,
    "url": null
  },
  {
    "authors": "J. Jung, H. Heo, H. Shim, and H. Yu",
    "title": "Knowledge Distillation in Acoustic Scene Classification",
    "venue": "IEEE Access",
    "year": 2020,
    "url": null
  },
  {
    "authors": "J. Jung, H. Heo, H. Yu, and J. S. Chung",
    "title": "Graph Attention Networks for Speaker Verification",
    "venue": "Proc. ICASSP",
    "year": 2021,
    "url": null
  }
]
```

- [ ] **Step 2: Create mentoring.json**

Create `src/data/mentoring.json`:

```json
[
  {
    "name": "Siddhant Arora",
    "url": "https://scholar.google.com/citations?hl=ko&authuser=1&user=VGfczTIAAAAJ",
    "startYear": 2024,
    "endYear": null,
    "status": "ongoing",
    "topic": "Spoken language understanding, Spoken dialogue systems",
    "outcomes": [
      "Siddhant Arora, Jinchuan Tian, Hayato Futami, Jee-weon Jung, Jiatong Shi, Yosuke Kashiwagi, Emiri Tsunoo, Shinji Watanabe, \"A Chain-of-Thought Reasoning Approach to E2E Spoken Dialogue Systems with an Open-Source Toolkit,\" in Proc. Interspeech, 2025.",
      "Siddhant Arora, Ankita Pasad, Chung-Ming Chien, Jionghao Han, Roshan Sharma, Jee-weon Jung, Hira Dhamyal, William Chen, Suwon Shon, Hung-yi Lee, Karen Livescu, Shinji Watanabe, \"On the Evaluation of Speech Foundation Models for Spoken Language Understanding,\" in Proc. ACL Findings, 2024.",
      "Siddhant Arora, Hayato Futami, Jee-weon Jung, Yifan Peng, Roshan Sharma, Yosuke Kashiwagi, Emiru Tsunoo, Shinji Watanabe, \"UniverSLU: Universal Spoken Language Understanding for Diverse Classification and Sequence Generation Tasks with a Single Network,\" in Proc. NAACL, 2024."
    ]
  },
  {
    "name": "Alex Gichamba",
    "url": "https://scholar.google.com/citations?hl=ko&authuser=1&user=DlPd0kwAAAAJ",
    "startYear": 2024,
    "endYear": null,
    "status": "ongoing",
    "topic": "Spoofing-robust automatic speaker verification",
    "outcomes": []
  },
  {
    "name": "Masao Someki",
    "url": "https://masao-someki.github.io",
    "startYear": 2025,
    "endYear": null,
    "status": "ongoing",
    "topic": "Dynamic pruning of LLMs",
    "outcomes": [
      "Masao Someki, Shikhar Bharadwaj, Atharva Anand Joshi, Chyi-Jiunn Lin, Jinchuan Tian, Jee-weon Jung, Markus Muller, Nathan Susanj, Jing Liu, Shinji Watanabe, \"Context-Driven Dynamic Pruning for Large Multi-Modal Foundation Model,\" in Proc. Interspeech, 2025."
    ]
  },
  {
    "name": "KiHyun Nam",
    "url": "https://devkihyun.github.io/about/",
    "startYear": 2023,
    "endYear": 2025,
    "status": "previous",
    "topic": "Robust automatic speaker verification",
    "outcomes": [
      "KiHyun Nam, Jungwoo Heo, Jee-weon Jung, Gangin Park, Chaeyoung Jung, Ha-Jin Yu, Joon Son Chung, \"SEED: Speaker Embedding Enhancement Diffusion Model,\" in Proc. Interspeech, 2025.",
      "Kihyun Nam, Hee-Soo Heo, Jee-weon Jung, Joon Son Chung, \"Disentangled Representation Learning for Environment-agnostic Speaker Recognition,\" in Proc. Interspeech, 2024.",
      "Kihyun Nam, Youkyum Kim, Jaesung Huh, Hee Soo Heo, Jee-weon Jung, Joon Son Chung, \"Disentangled representation learning for multilingual speaker recognition,\" in Proc. Interspeech, 2023."
    ]
  },
  {
    "name": "Sung Hwan Mun",
    "url": "https://scholar.google.com/citations?hl=en&authuser=1&user=9l5RkZoAAAAJ",
    "startYear": 2022,
    "endYear": 2023,
    "status": "previous",
    "topic": "Automatic speaker verification models, spoofing-robust automatic speaker verification",
    "outcomes": [
      "Sung Hwan Mun, Hye-jin Shim, Hemlata Tak, Xin Wang, Xuechen Liu, Md Sahidullah, Myeonghun Jeong, Min Hyun Han, Massimiliano Todisco, Kong Aik Lee, Junichi Yamagishi, Nicholas Evans, Tomi Kinnunen, Nam Soo Kim, and Jee-weon Jung, \"Towards single integrated spoofing-aware speaker verification embeddings,\" in Proc. Interspeech, 2023.",
      "Sung Hwan Mun, Jee-weon Jung, Min Hyun Han, Nam Soo Kim, \"Frequency and Multi-Scale Selective Kernel Attention for Speaker Verification,\" in Proc. SLT, 2022."
    ]
  }
]
```

- [ ] **Step 3: Commit**

```bash
git add src/data/publications.json src/data/mentoring.json
git commit -m "feat: add publication and mentoring data files"
```

### Task 8: Create PublicationList component

**Files:**
- Create: `src/components/PublicationList.tsx`

- [ ] **Step 1: Create PublicationList component**

Create `src/components/PublicationList.tsx`:

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
      <strong key={i}>{part}</strong>
    ) : (
      <span key={i}>{part}</span>
    )
  );
}

export default function PublicationList() {
  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Selected Publications</h2>
      <p className="text-sm text-secondary mb-6">
        Full publication list available in my{" "}
        <a href="/CV_Jee-weon_Jung.pdf" target="_blank" rel="noopener noreferrer">
          CV
        </a>
        .
      </p>
      <ol className="space-y-4 list-decimal list-outside pl-5">
        {(publications as Publication[]).map((pub) => (
          <li key={pub.title} className="text-sm leading-relaxed">
            {highlightAuthor(pub.authors)},{" "}
            <em>&ldquo;{pub.title}&rdquo;</em>,{" "}
            {pub.venue}, {pub.year}.
            {pub.url && (
              <>
                {" "}
                <a href={pub.url} target="_blank" rel="noopener noreferrer">
                  [Link]
                </a>
              </>
            )}
          </li>
        ))}
      </ol>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/PublicationList.tsx
git commit -m "feat: add PublicationList component"
```

### Task 9: Create MentoringSection component

**Files:**
- Create: `src/components/MentoringSection.tsx`

- [ ] **Step 1: Create MentoringSection component**

Create `src/components/MentoringSection.tsx`:

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
    <li className="border-b border-gray-100 last:border-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full text-left py-3 flex items-baseline justify-between gap-4 hover:bg-gray-50 -mx-2 px-2 rounded transition-colors"
        aria-expanded={isOpen}
      >
        <span>
          <a
            href={mentee.url}
            target="_blank"
            rel="noopener noreferrer"
            className="font-medium"
            onClick={(e) => e.stopPropagation()}
          >
            {mentee.name}
          </a>
          <span className="text-secondary text-sm"> ({period})</span>
        </span>
        <span className="text-secondary text-sm shrink-0">
          {isOpen ? "▾" : "▸"}
        </span>
      </button>
      {isOpen && (
        <div className="pb-4 pl-2 space-y-2">
          <p className="text-sm text-secondary">
            <span className="font-medium">Topic:</span> {mentee.topic}
          </p>
          {mentee.outcomes.length > 0 && (
            <div>
              <p className="text-sm font-medium text-secondary mb-1">Publications:</p>
              <ul className="space-y-1">
                {mentee.outcomes.map((outcome, i) => (
                  <li key={i} className="text-sm text-secondary leading-relaxed">
                    {outcome}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </li>
  );
}

export default function MentoringSection() {
  const ongoing = (mentoring as Mentee[]).filter((m) => m.status === "ongoing");
  const previous = (mentoring as Mentee[]).filter((m) => m.status === "previous");

  return (
    <section>
      <h2 className="text-lg font-semibold mb-2">Mentoring</h2>
      <p className="text-sm text-secondary mb-6">
        I&apos;m always excited to mentor new individuals. Feel free to reach out
        via e-mail if you&apos;re interested in exploring a collaboration!
      </p>

      <h3 className="text-base font-medium mb-2">Ongoing</h3>
      <ul className="mb-8">
        {ongoing.map((mentee) => (
          <MenteeEntry key={mentee.name} mentee={mentee} />
        ))}
      </ul>

      <h3 className="text-base font-medium mb-2">Previous</h3>
      <ul>
        {previous.map((mentee) => (
          <MenteeEntry key={mentee.name} mentee={mentee} />
        ))}
      </ul>
    </section>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/components/MentoringSection.tsx
git commit -m "feat: add MentoringSection component with expandable entries"
```

---

## Chunk 5: Academic Page, 404, and Final Polish

### Task 10: Build academic page

**Files:**
- Create: `src/app/academic/page.tsx`

- [ ] **Step 1: Create academic page**

Create `src/app/academic/page.tsx`:

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
  { name: "SASV 2022", url: "https://sasv-challenge.github.io/" },
  {
    name: "VoxSRC 2022 Challenge",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2022.html",
  },
  {
    name: "VoxSRC 2022 Workshop",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2022.html",
  },
  {
    name: "VoxSRC 2023 Challenge",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/competition2023.html",
  },
  {
    name: "VoxSRC 2023 Workshop",
    url: "https://mm.kaist.ac.kr/datasets/voxceleb/voxsrc/interspeech2023.html",
  },
  {
    name: "ASVspoof 5 Workshop",
    url: "https://www.asvspoof.org/workshop2024",
  },
];

type Dataset =
  | { name: string; url: string; host: string }
  | { name: string; urls: { url: string; host: string }[] };

const datasets: Dataset[] = [
  {
    name: "TITW",
    url: "https://huggingface.co/datasets/jungjee/titw",
    host: "HuggingFace",
  },
  {
    name: "SpoofCeleb",
    url: "https://huggingface.co/datasets/jungjee/spoofceleb",
    host: "HuggingFace",
  },
  {
    name: "ASVspoof 5",
    urls: [
      {
        url: "https://huggingface.co/datasets/jungjee/asvspoof5",
        host: "HuggingFace",
      },
      {
        url: "https://zenodo.org/records/14498691",
        host: "Zenodo",
      },
    ],
  },
];

export default function AcademicPage() {
  return (
    <article className="space-y-12 py-8">
      <PublicationList />
      <MentoringSection />

      <section>
        <h2 className="text-lg font-semibold mb-4">Resources</h2>

        <h3 className="text-base font-medium mb-2">
          Challenge &amp; Workshop Organizations
        </h3>
        <ul className="space-y-1 mb-6">
          {challenges.map((c) => (
            <li key={c.url} className="text-sm">
              <a href={c.url} target="_blank" rel="noopener noreferrer">
                {c.name}
              </a>
            </li>
          ))}
        </ul>

        <h3 className="text-base font-medium mb-2">Datasets</h3>
        <ul className="space-y-1">
          {datasets.map((d) => (
            <li key={d.name} className="text-sm">
              <span className="font-medium">{d.name}</span>:{" "}
              {"urls" in d
                ? d.urls.map((link, i) => (
                    <span key={link.url}>
                      {i > 0 && ", "}
                      <a
                        href={link.url}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link.host}
                      </a>
                    </span>
                  ))
                : (
                    <a href={d.url} target="_blank" rel="noopener noreferrer">
                      {d.host}
                    </a>
                  )}
            </li>
          ))}
        </ul>
      </section>
    </article>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/academic/page.tsx
git commit -m "feat: build academic page with publications, mentoring, and resources"
```

### Task 11: Create custom 404 page

**Files:**
- Create: `src/app/not-found.tsx`

- [ ] **Step 1: Create 404 page**

Create `src/app/not-found.tsx`:

```tsx
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="py-20 text-center">
      <h2 className="text-2xl font-semibold mb-4">Page not found</h2>
      <p className="text-secondary mb-6">
        The page you&apos;re looking for doesn&apos;t exist.
      </p>
      <Link href="/" className="text-accent">
        Go back home
      </Link>
    </div>
  );
}
```

- [ ] **Step 2: Commit**

```bash
git add src/app/not-found.tsx
git commit -m "feat: add custom 404 page"
```

### Task 12: Full build verification and manual test

- [ ] **Step 1: Run production build**

```bash
npm run build
```

Expected: Build succeeds, `out/` directory contains `index.html`, `academic.html`, `404.html`, and `CV_Jee-weon_Jung.pdf`.

- [ ] **Step 2: Serve the static output locally and test**

```bash
npx serve out
```

Open `http://localhost:3000` (or whichever port `serve` gives). Test:

1. **Home page:** bio, experience, education, honors all render. Header has name, Academic link, social icons.
2. **Academic page:** click "Academic" in header. Publications list, mentoring expandable entries, resources all render. CV link opens the PDF.
3. **Social icons:** each icon links to correct URL and opens in new tab (except email which opens mail client).
4. **404:** navigate to a non-existent URL like `/xyz`. Custom 404 page shows with link back to home.
5. **Responsive:** resize browser to mobile width. Header stacks vertically. Content remains readable.
6. **Accessibility:** tab through the page. Mentoring expand/collapse works with keyboard. All links are reachable.

- [ ] **Step 3: Commit final state**

```bash
git add -A
git commit -m "feat: complete website rebuild — ready for Cloudflare Pages deployment"
```

### Task 13: Deploy to Cloudflare Pages

- [ ] **Step 1: Set up Cloudflare Pages project**

Go to the Cloudflare dashboard → Pages → Create a project → Connect to Git.

Configure:
- **Repository:** `jungjee/jungjee.github.io` (or whatever your GitHub repo is named)
- **Production branch:** `master`
- **Build command:** `npm run build`
- **Build output directory:** `out`
- **Node version:** Set environment variable `NODE_VERSION` = `20`

- [ ] **Step 2: Configure custom domain**

In Cloudflare Pages project settings → Custom domains:
- Add `jungjee.com`
- Add `www.jungjee.com`

Since the domain is already on Cloudflare DNS, the CNAME records will be configured automatically.

- [ ] **Step 3: Push and verify deployment**

```bash
git push origin master
```

Check the Cloudflare Pages dashboard for build status. Once deployed, verify `https://jungjee.com` loads the new site.

- [ ] **Step 4: Clean up old GitHub Pages config**

After confirming Cloudflare Pages works:
- Remove the `CNAME` file from the repo (Cloudflare handles the domain now)
- In GitHub repo settings → Pages, disable GitHub Pages if still active

```bash
git rm CNAME
git commit -m "chore: remove CNAME — domain now managed by Cloudflare Pages"
git push origin master
```
