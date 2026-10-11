# Editing content

Everything is in **`src/content/site.ts`**. Facts should match the résumé in
`public/binamra-khadka-resume.pdf`.

| What                       | Export             |
| -------------------------- | ------------------ |
| Name, role, city, email…   | `profile`          |
| Giant hero statement       | `heroLines` (≤ 16 chars each, one may be `accent`) |
| Line under the statement   | `heroIntro`        |
| Count-up numbers           | `stats` (`from` lets a number count *down*) |
| Big project showcases      | `featuredProjects` |
| Older projects list        | `archiveProjects`  |
| Jobs                       | `career` (≤ 3 highlights, ≤ 70 chars each) |
| Degrees                    | `education` (own section, same layout as career) |
| Tools                      | `toolkit`          |
| Social links               | `socials` (`github` / `linkedin`; add icons in `components/icons.tsx`) |
| Dock links                 | `navItems` (must match section ids) |

## Add a project

1. Screenshot the app, ideally 16:9 and ≥ 1200px wide. The top of the image is
   kept when cropping.
2. `npm run images -- ~/Downloads/shot.png my-app` → `public/projects/my-app.webp`
   plus `-640`/`-320` variants (a content test checks they exist)
3. Add the entry:
   ```ts
   {
     slug: "my-app",
     title: "My App",
     summary: "One short sentence, under 90 characters.",
     stack: ["Next.js", "Postgres"],
     sourceUrl: "https://github.com/binamra7/my-app", // omit if private
     liveUrl: "https://my-app.vercel.app",            // only if the demo works end to end
     image: { src: "/projects/my-app.webp", alt: "What the screenshot shows" },
   }
   ```
   Put it in `featuredProjects` (large, with the duotone lens) or
   `archiveProjects` (list row with hover preview, image required).
   A featured project without a screenshot needs a `visual`. Add new visuals
   next to `RagTerminal` and wire them up in `components/Work.tsx`.
4. `npm run check`, then `npm run build && npm run check:links`

A demo that opens but whose backend is gone is a broken link. Leave `liveUrl`
out and the row links to the source instead. FilmStop and Bug Reporter are
like this today: their Heroku APIs were shut down.

## Résumé

The PDF is served from `public/binamra-khadka-resume.pdf`. To update it,
replace the file and keep the name. Set `profile.resumeUrl = null` to hide
all résumé links.

## Social preview image

After changing the hero copy, edit the card markup in `scripts/render-og.mjs`,
then run `npm run build && npm run og`.
