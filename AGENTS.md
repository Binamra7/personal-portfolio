# AGENTS.md

Guide for AI coding agents (and humans) working in this repo. Read this first.
`CLAUDE.md` just imports this file, so keep everything here.

## What this is

Binamra Khadka's personal portfolio: one static page (hero, work, about,
skills, contact). Next.js App Router with `output: "export"`, React 19,
TypeScript, Tailwind CSS v4. Hosted on Vercel.

## ⚠️ Production guardrails

- **`main` is production.** Every push/merge to `main` deploys live via
  Vercel's Git integration. Never push or merge to `main` without the owner's
  explicit go-ahead. Work on a branch; Vercel builds a preview URL for it.
- Run `npm run check` and `npm run build && npm run test:e2e` before calling
  work done. CI runs the same on every PR.
- Don't add a server-only feature (API routes, middleware, ISR, `next/image`
  optimization, `headers()`/`cookies()`). The site is a static export and
  `next build` will fail.

## Commands

| Task                        | Command                               |
| --------------------------- | ------------------------------------- |
| Dev server (localhost:3000) | `npm run dev`                         |
| Production build → `out/`   | `npm run build`                       |
| Serve the built `out/`      | `npm start`                           |
| Everything except e2e       | `npm run check`                       |
| Unit tests / watch          | `npm test` / `npm run test:watch`     |
| E2E + a11y (needs a build)  | `npm run build && npm run test:e2e`   |
| Fix formatting / lint       | `npm run format` / `npm run lint:fix` |
| Add a screenshot            | `npm run images -- <file> <slug>`     |

First e2e run on a machine: `npx playwright install chromium`.

## Where things live

```
src/
  content/site.ts      ← ALL copy, links, projects, skills. Edit content here only.
  app/
    layout.tsx         fonts, metadata, skip link, `.js` flag script
    page.tsx           section order
    globals.css        design tokens (@theme), reveal + screenshot styles
    opengraph-image.png, icon.svg, sitemap.ts, robots.ts, not-found.tsx
  components/          one file per section + small shared pieces
    Reveal.tsx         scroll-in animation wrapper (client)
    SiteHeader.tsx     sticky nav, active section, mobile menu (client)
    ProjectShot.tsx    screenshot frame + blending treatment
    CopyEmailButton.tsx (client)
    icons.tsx          inline SVG icons (no icon library)
  lib/site-url.ts      absolute URL for metadata
public/projects/       WebP screenshots (1200px max)
scripts/               serve-static.mjs, optimize-images.mjs
tests/e2e/             Playwright specs (run against `out/`)
docs/                  deeper docs, see below
```

## Conventions

- Server components by default. Add `"use client"` only for state/effects;
  keep client components small (currently: header, reveal, copy button).
- Style with Tailwind utilities using the theme tokens (`bg-bg`, `text-muted`,
  `text-accent`, `border-line`…). Don't hard-code hex colours in components.
  New tokens go in `@theme` in `globals.css` and in `docs/DESIGN.md`.
- Copy is short. One sentence per summary, ≤ 90 chars (a unit test enforces
  it). No paragraphs.
- Animations: CSS only (no Framer Motion etc.). Wrap new blocks in
  `<Reveal>`; stagger with `delay` in 60–120ms steps. Everything must respect
  `prefers-reduced-motion` (handled globally in `globals.css`).
- Accessibility is tested (axe in e2e). Keep one `h1`, label sections, give
  icon-only links an `aria-label`, keep text contrast ≥ 4.5:1.
- External links: `target="_blank" rel="noreferrer"`.
- Tests sit next to the code (`Foo.test.tsx`). Content rules live in
  `src/content/site.test.ts`.
- Imports use the `@/` alias for `src/`.

## Common tasks

- **Add/edit a project:** see `docs/CONTENT.md` (or the `/add-project` command).
- **Change look & feel:** read `docs/DESIGN.md` first. It explains the rules
  that keep the site from looking generic.
- **Why is X done this way?** `docs/DECISIONS.md`.
- **Deploy/Vercel questions:** `docs/DEPLOYMENT.md`.
- **Testing details:** `docs/TESTING.md`.
