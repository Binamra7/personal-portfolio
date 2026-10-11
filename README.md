# Binamra Khadka — Portfolio

Live at **[binamrakhadka.vercel.app](https://binamrakhadka.vercel.app)**.

A single, dark, typographic page: big statement, work, career, stack, contact.
It has a variable-font animation, duotone screenshots with a colour lens, and
an optional generative ambient soundtrack.

**Stack:** Next.js 16 (static export) · React 19 · TypeScript 7 · Tailwind CSS v4 ·
motion · Lenis · Biome · Vitest · Playwright · Vercel

## Quick start

```bash
nvm use            # Node 24 (see .nvmrc; ≥ 22.12 works)
npm install
npm run dev        # http://localhost:3000
```

## Scripts

```bash
npm run build      # static site → out/
npm start          # serve out/ locally
npm run check      # Biome + typecheck + unit tests
npm run test:e2e   # Playwright + axe against out/ (build first)
npm run images -- ./shot.png my-app   # add a screenshot
npm run og         # regenerate the social preview image (after a build)
```

## Editing content

Everything on the page lives in [`src/content/site.ts`](src/content/site.ts).
See [docs/CONTENT.md](docs/CONTENT.md).

## Docs

- [AGENTS.md](AGENTS.md): start here (humans and AI agents)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how it fits together
- [docs/DESIGN.md](docs/DESIGN.md): design system, motion, image treatment
- [docs/CONTENT.md](docs/CONTENT.md): adding projects, changing copy
- [docs/TESTING.md](docs/TESTING.md): unit, e2e and accessibility tests
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): Vercel, CI, branches
- [docs/DECISIONS.md](docs/DECISIONS.md): why things are the way they are
