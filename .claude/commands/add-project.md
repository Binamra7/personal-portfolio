---
description: Add a new project to the portfolio from a screenshot and repo URL
argument-hint: <screenshot-path> <github-url> [live-url]
---

Add a project to the portfolio. Arguments: $ARGUMENTS

1. Read `docs/CONTENT.md` and `src/content/site.ts`.
2. Pick a slug (lowercase-dashes) from the repo name. Run
   `npm run images -- <screenshot-path> <slug>`.
3. Look at the screenshot and repo README (if reachable) to write:
   - `summary`: one sentence, ≤ 90 chars, plain words
   - `imageAlt`: what the screenshot shows
   - `stack`: 2–5 main technologies
4. Append the entry to `projects` in `src/content/site.ts` (ask if it should
   go somewhere other than the end).
5. Run `npm run check`, then `npm run build && npm run test:e2e`.
6. Show the diff. Do not commit to or push `main`.
