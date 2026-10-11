# Decisions

### Static export (`output: "export"`)
The site has no dynamic data, so static is the fastest and simplest option.
It works with Vercel's Next.js preset or with an `out` output directory.
Trade-off: no API routes, middleware or image optimizer.

### Biome instead of ESLint + Prettier
TypeScript 7 (the native rewrite) ships no classic JS API, and
`typescript-eslint` / `eslint-config-next` don't support it or ESLint 10
yet. Biome lints and formats in one fast binary with no TypeScript
dependency. It also sorts imports and Tailwind classes. We chose it so tooling
never holds the TypeScript version back.

### TypeScript 7
Next 16.4's build-time type check works with it, and `tsc` is much faster.

### motion + Lenis
CSS handles load-in and scroll-in. `motion` is used only where CSS can't do
the job: scroll-linked clip-path/parallax, spring-follow previews and the dock's
shared-layout pill. Lenis gives inertial scrolling and animated anchor jumps.
Both are skipped under reduced motion.

### Generated audio instead of a music file
No licensing, no download, about 3 KB of code, and it never loops audibly.
Off by default, because surprise audio is hostile and browsers block it anyway.

### Duotone screenshots
The screenshots can't be retaken right now and are bright and mismatched.
Mapping them all to page-black → sand makes them look intentional. The colour
lens keeps the real UI one hover away.

### Static `opengraph-image.png`
A generated OG route is exported without a file extension, and static hosts can
serve that with the wrong content type. The PNG is rendered by
`scripts/render-og.mjs` using the site's own fonts.

### Résumé in `/public`
The old site already linked to a résumé. The PDF is the source of truth for
content. Set `profile.resumeUrl = null` to stop publishing it.

### X / Twitter link removed
The old site had two different handles, and the résumé lists neither.

### Removed from v1
styled-components, react-icons, the Babel config, the Timeline carousel, the
"Accomplishments" placeholder stats, `/api/hello`, the committed `out.zip`, and
a broken résumé link. All of it is still in git history.
