# Testing

| Layer           | Tool                           | Where                       |
| --------------- | ------------------------------ | --------------------------- |
| Content rules   | Vitest                         | `src/content/site.test.ts`  |
| Components/libs | Vitest + Testing Library       | `src/**/*.test.ts(x)`       |
| End-to-end      | Playwright (desktop + Pixel 7) | `tests/e2e/*.spec.ts`       |
| Accessibility   | axe-core via Playwright        | `tests/e2e/home.spec.ts`    |
| Links           | `scripts/check-links.mjs`      | internal in CI, external weekly |
| Lint / format   | Biome                          | `biome.json`                |
| Types           | TypeScript 7 (`tsc`)           | `tsconfig.json`             |

All of these run in CI.

```bash
npm test                          # unit, once
npm run test:watch
npm run test:coverage
npm run build && npm run test:e2e # always rebuild first
npx playwright test --ui
```

## Notes

- E2E serves `out/` with `scripts/serve-static.mjs`, which handles clean URLs and
  404s the way Vercel does.
- `next/image` is mocked to a plain `<img>` in `src/test/setup.tsx`.
- jsdom has no IntersectionObserver or AudioContext. Components fall back to
  their final, static state there, which is also what no-JS visitors see.
- `AmbientEngine` takes a context factory, so `ambient.test.ts` passes in a
  fake Web Audio graph and checks the gain ramps.
- The dock hides on the hero, so e2e scrolls before using it.
- If axe reports `color-contrast`, a token is too dim. Fix the token, not the test.
