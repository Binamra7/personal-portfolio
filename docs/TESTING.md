# Testing

| Layer                 | Tool                           | Where                      | Runs in CI |
| --------------------- | ------------------------------ | -------------------------- | ---------- |
| Content rules         | Vitest                         | `src/content/site.test.ts` | ✅         |
| Components            | Vitest + Testing Library       | `src/**/*.test.tsx`        | ✅         |
| Page end-to-end       | Playwright (desktop + Pixel 7) | `tests/e2e/*.spec.ts`      | ✅         |
| Accessibility         | axe-core via Playwright        | `tests/e2e/home.spec.ts`   | ✅         |
| Types / lint / format | tsc, ESLint, Prettier          | n/a                        | ✅         |

## Running

```bash
npm test                          # unit, once
npm run test:watch                # unit, watch
npm run test:coverage             # unit + coverage report in coverage/
npm run build && npm run test:e2e # e2e against the real static build
npx playwright test --ui          # e2e, interactive
```

## Notes

- E2E serves `out/` with `scripts/serve-static.mjs`, which handles clean URLs and 404s
  the same way Vercel does. Always rebuild before e2e or you're testing stale output.
- `next/image` is mocked to a plain `<img>` in `src/test/setup.tsx`.
- jsdom has no IntersectionObserver. `Reveal` and the header skip observing,
  which is fine because reveal CSS isn't loaded in unit tests.
- The axe test runs with `reducedMotion: "reduce"` so nothing is caught
  mid-animation. A colour-contrast failure usually means a token is too dim.
