# Binamra Khadka — Portfolio

My personal site. One static page with a dark, minimal look: work, about, skills, contact.

**Stack:** Next.js 16 (static export) · React 19 · TypeScript · Tailwind CSS v4 ·
Vitest · Playwright · Vercel

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
npm run check      # format + lint + typecheck + unit tests
npm run test:e2e   # Playwright + axe, against out/ (build first)
npm run images -- ./shot.png my-app   # add a screenshot
```

## Editing content

Everything you see on the page is in [`src/content/site.ts`](src/content/site.ts).
See [docs/CONTENT.md](docs/CONTENT.md).

## Docs

- [AGENTS.md](AGENTS.md): start here (humans and AI agents)
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md): how it fits together
- [docs/DESIGN.md](docs/DESIGN.md): design system and rules
- [docs/CONTENT.md](docs/CONTENT.md): adding projects, changing copy
- [docs/TESTING.md](docs/TESTING.md): unit, e2e and accessibility tests
- [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md): Vercel, CI, branches
- [docs/DECISIONS.md](docs/DECISIONS.md): why things are the way they are
