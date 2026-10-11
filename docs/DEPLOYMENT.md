# Deployment

## How it ships

- Vercel's Git integration builds every push.
  - Push to **`main`** → **production** (live site).
  - Push to any other branch / PR → **preview URL**. Use it to check changes.
- Vercel runs `npm run build` (`next build`), which writes the static site to
  `out/`. Works with Vercel's Next.js preset as-is.
- Node version comes from `package.json` → `engines.node` (≥ 22.12).

## Vercel project settings to check (one-time, after the v2 upgrade)

The old site used `next build && next export`. `next export` no longer
exists. If the dashboard overrides any of these, reset them to default:

- **Build Command:** default (or `npm run build`), not `next export`
- **Output Directory:** default (or `out`)
- **Install Command:** default (`npm install`/`npm ci`; this repo uses npm)
- **Node.js Version:** 22.x or 24.x

Optional env var: `NEXT_PUBLIC_SITE_URL=https://your-domain` if you add a
custom domain (for correct canonical/OG URLs). Without it, Vercel's production
URL (currently `binamrakhadka.vercel.app`) is used.

## CI (GitHub Actions)

`.github/workflows/ci.yml` runs on PRs and on pushes to `main`:

1. **check**: `biome ci` (lint + format), typecheck, unit tests +
   coverage, and `npm audit` on production deps.
2. **e2e**: build, then Playwright + axe on desktop and mobile. On failure the
   HTML report is uploaded as an artifact.

`.github/workflows/links.yml` checks every external link each Monday (and on
demand). It runs on a schedule, not on PRs, so a third-party outage never
blocks a merge. Internal anchors and files are checked in the e2e job.

Deployment is left to Vercel (no deploy job, no tokens in GitHub). Suggested:
protect `main` in GitHub settings and require the CI checks to pass before merging.

Dependabot (`.github/dependabot.yml`) opens a grouped monthly PR for npm
minor/patch bumps and GitHub Actions updates.

## Release flow

```
branch → push → CI + Vercel preview → review preview → merge to main → live
```
