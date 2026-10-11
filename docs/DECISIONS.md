# Decisions

Short records of choices that might look odd later.

### Static export (`output: "export"`)

The site has no dynamic data. A static export is the fastest, cheapest option and has
the fewest moving parts. It also works whether the Vercel project uses the Next.js preset
or an `out` output directory (the old site used `next export`).
Trade-off: no API routes, middleware or image optimizer.

### No animation library

Everything is a fade/rise or a hover transition. CSS + one IntersectionObserver
(`Reveal.tsx`) does it with zero bundle cost and handles reduced-motion in one
media query. Only reach for `motion` if you need gestures, layout animations or
springs.

### No icon library

Nine icons, inlined in `components/icons.tsx`. Cheaper than `react-icons`.

### Pre-optimized WebP instead of `next/image` optimization

The optimizer needs a server. `scripts/optimize-images.mjs` (sharp) does it
once at authoring time.

### Static `opengraph-image.png`

A generated `opengraph-image.tsx` gets exported as an extensionless file, and
static hosts may serve that with the wrong content type. A real `.png` avoids that.
It was generated once from the site's own tokens.

### TypeScript pinned to ~6.0

TypeScript 7 (native) is out, but `typescript-eslint` supports up to `<6.1`.
Revisit when typescript-eslint supports TS 7.

### ESLint pinned to 9

`eslint-config-next` 16 bundles plugins (react, import, jsx-a11y) that don't
support ESLint 10 yet.

### Known dev-only audit advisory

`braces` (via `eslint-config-next` → `fast-glob` → `micromatch`) has a high
advisory with no patched release. It only affects lint tooling, never the shipped site.
CI audits production deps only (`npm audit --omit=dev`).

### Removed from v1

styled-components, react-icons, Babel config, the unused Timeline carousel
and "Accomplishments" section (it had template placeholder numbers), the
`/api/hello` template route, the committed `out.zip` build artifact, and a
broken "Learn More" link to a missing `binamra.pdf`. All of it is still in git
history (before the v2 commit).
