# AGENTS.md

Guide for AI coding agents (and humans) working in this repo. Read this first.
`CLAUDE.md` just imports this file, so keep everything here.

## What this is

Binamra Khadka's portfolio: one static page (hero, work, career, stack,
contact). Next.js 16 App Router with `output: "export"`, React 19,
TypeScript 7, Tailwind CSS v4, motion + Lenis for animation, Biome for
lint/format. Hosted on Vercel at https://binamrakhadka.vercel.app.

## ⚠️ Production guardrails

- **`main` is production.** Every push or merge to `main` deploys live via
  Vercel's Git integration. Never push or merge to `main` without the owner's
  explicit go-ahead. Work on a branch; Vercel builds a preview URL for it.
- Before calling work done, run `npm run check` and
  `npm run build && npm run test:e2e`. CI runs the same.
- Don't add server-only features (API routes, middleware, ISR, `next/image`
  optimization, `headers()`/`cookies()`). The site is a static export, and
  `next build` will fail.
- Facts about the owner come from the résumé (`public/binamra-khadka-resume.pdf`).
  Don't invent roles, numbers or availability claims.

## Commands

| Task                         | Command                              |
| ---------------------------- | ------------------------------------ |
| Dev server (localhost:3000)  | `npm run dev`                        |
| Production build → `out/`    | `npm run build`                      |
| Serve the built `out/`       | `npm start`                          |
| Lint + format + types + unit | `npm run check`                      |
| Auto-fix lint/format         | `npm run lint:fix`                   |
| Unit tests / watch           | `npm test` / `npm run test:watch`    |
| E2E + a11y (needs a build)   | `npm run build && npm run test:e2e`  |
| Add a screenshot             | `npm run images -- <file> <slug>`    |
| Regenerate social image      | `npm run build && npm run og`        |

First e2e run on a machine: `npx playwright install chromium`.

## Where things live

```
src/
  content/site.ts      ← ALL copy, links, projects, career, stack. Edit content here only.
  app/
    layout.tsx         fonts, metadata, Lenis, `.js` flag script
    page.tsx           section order (+ Dock)
    globals.css        tokens (@theme), keyframes, duotone, reveal, `condensed`
    opengraph-image.png, icon.svg, sitemap.ts, robots.ts, not-found.tsx
  components/
    Hero, Work, Career, Stack, Contact, SiteFooter     sections (server)
    TopBar, Dock, SoundToggle, LocalClock               page chrome
    LensImage      duotone screenshot + scroll reveal + colour lens (client)
    ArchiveList    big-type rows + cursor-following preview (client)
    RagTerminal    typed terminal illustration (client)
    CountUp        animated stat numbers (client)
    Reveal         fade-up on scroll (client, CSS-driven)
    StretchText    hover-widening text that reserves its width (no reflow)
    scroll/        scroll-linked effects: HeroHeadline, ScrollFillText,
                   DriftRow, ScrollProgressLine, ScaleIn
    SmoothScroll   Lenis (client)
    icons.tsx      inline SVG icons
  hooks/useActiveSection.ts
  lib/ambient.ts       generative Web Audio soundtrack
  lib/sound-store.ts   shared on/off state for all sound toggles
  lib/site-url.ts
public/projects/       WebP screenshots (≤1200px)
scripts/               serve-static, optimize-images, render-og
tests/e2e/             Playwright specs (run against out/)
docs/                  see below
```

## Conventions

- Server components by default. Use `"use client"` only for state, effects or
  motion, and keep those components small and leaf-level.
- Style with Tailwind utilities and theme tokens (`bg-bg`, `text-muted`,
  `text-accent`, `border-line`, `condensed`). No hard-coded hex in
  components. New tokens go in `@theme` and in `docs/DESIGN.md`.
- Copy is short. Unit tests enforce lengths for summaries, highlights, hero
  lines and stat labels.
- Motion: CSS keyframes for load-in, `<Reveal>` for scroll-in, `motion` only
  for scroll-linked or spring/layout effects. Everything must respect
  `prefers-reduced-motion` (CSS handles it globally; motion components check
  `useReducedMotion`).
- **Hover/scroll effects must not change layout.** Animate transforms,
  opacity, colour or background position. To widen text on hover, use
  `<StretchText>`. An e2e test fails if hovering resizes anything.
- Accessibility is tested (axe in e2e). One `h1`; each section has an `h2`
  (via `SectionLabel`); icon-only controls get `aria-label`; text contrast ≥ 4.5:1.
- External links: `target="_blank" rel="noreferrer"`.
- Tests live next to the code (`Foo.test.tsx`). Content rules are in
  `src/content/site.test.ts`.
- Use the `@/` import alias for `src/`. Biome sorts imports and Tailwind classes.

## Common tasks

- **Add or edit a project:** `docs/CONTENT.md` (or the `/add-project` command).
- **Change the look:** read `docs/DESIGN.md` first.
- **Why is X done this way?** `docs/DECISIONS.md`.
- **Deploying / Vercel:** `docs/DEPLOYMENT.md`.
- **Tests:** `docs/TESTING.md`.
