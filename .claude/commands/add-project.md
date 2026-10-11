---
description: Add a new project to the portfolio from a screenshot and repo URL
argument-hint: <screenshot-path> <github-url> [live-url] [featured|archive]
---

Add a project to the portfolio. Arguments: $ARGUMENTS

1. Read `docs/CONTENT.md` and `src/content/site.ts`.
2. Pick a slug (lowercase-dashes) from the repo name. Run
   `npm run images -- <screenshot-path> <slug>`.
3. Look at the screenshot and repo README (if reachable) to write:
   - `summary`: one sentence, ≤ 90 chars, plain words
   - `image.alt`: what the screenshot shows
   - `stack`: 2–5 main technologies; `year`
4. Add it to `featuredProjects` or `archiveProjects` (default: archive; ask if unsure).
5. Run `npm run check`, then `npm run build && npm run test:e2e`.
6. Show the diff. Do not commit to or push `main`.
