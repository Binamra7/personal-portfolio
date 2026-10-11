# Architecture

## Rendering

- Next.js App Router, `output: "export"` (see `next.config.ts`). `next build`
  pre-renders everything to plain files in `out/`. No server runs in
  production.
- One route: `/` (`src/app/page.tsx`), plus `404.html`, `robots.txt`,
  `sitemap.xml`, `icon.svg`, `opengraph-image.png`.
- Components are React Server Components unless marked `"use client"`. Only
  three are client components, and each is small:
  - `SiteHeader`: scroll state, active-section tracking (IntersectionObserver),
    mobile menu.
  - `Reveal`: adds `data-visible` when its element scrolls into view.
  - `CopyEmailButton`: clipboard.

## Data flow

```
src/content/site.ts  ──►  section components  ──►  page.tsx  ──►  out/index.html
```

Content is typed (`Project`, `SkillGroup`, …) and validated by
`src/content/site.test.ts` (unique slugs, images exist, https links, short
copy).

## Styling

Tailwind v4, configured in CSS. Tokens are in the `@theme` block of
`src/app/globals.css` and become utilities (`--color-muted` → `text-muted`).
Three bits of non-utility CSS live there on purpose:

1. **Film grain**: a fixed `body::after` SVG noise layer.
2. **Reveal**: `.js [data-reveal]` hidden → `[data-visible="true"]` shown.
   The `.js` class is added by an inline script in `layout.tsx` before first
   paint, so with JS off nothing is hidden.
3. **Screenshot treatment**: `.shot-img` filters (see DESIGN.md).

## Fonts

`next/font/google` (Space Grotesk, JetBrains Mono) downloads the fonts at build
time and serves them from the site itself. No runtime request to Google. Exposed as CSS
variables and mapped to `font-sans` / `font-mono`.

## Images

`next/image` with `unoptimized: true` (the optimizer needs a server). Screenshots are
pre-optimized to WebP (≤1200px) with `scripts/optimize-images.mjs`. Images
use `fill` inside a fixed-aspect frame, so layout never shifts and any image
size works.

## Metadata

`layout.tsx` exports `metadata`. The absolute base URL comes from
`getSiteUrl()` (`src/lib/site-url.ts`): `NEXT_PUBLIC_SITE_URL`, else Vercel's
`VERCEL_PROJECT_PRODUCTION_URL`, else localhost.
