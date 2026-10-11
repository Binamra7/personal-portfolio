# Editing content

All content is in **`src/content/site.ts`**. You shouldn't need to touch
components to change text, links or projects.

## Add a project

1. Take a screenshot of the app, ideally 16:9 and at least 1200px wide.
   The top of the image is what's kept when cropping.
2. Convert it:
   ```bash
   npm run images -- ~/Downloads/my-app.png my-app
   # → public/projects/my-app.webp
   ```
3. Add an entry to `projects` in `site.ts`:
   ```ts
   {
     slug: "my-app",                       // lowercase-dashes, unique
     title: "My App",
     summary: "One short sentence, under 90 characters.",
     image: "/projects/my-app.webp",
     imageAlt: "What the screenshot shows",
     stack: ["Next.js", "Postgres"],
     sourceUrl: "https://github.com/binamra7/my-app",
     liveUrl: "https://my-app.vercel.app", // optional
   },
   ```
   Array order = display order. The first project's image loads eagerly.
4. `npm run check`. The content tests check the image exists, the links are
   https and the summary is short enough.

## Other content

- **Name, role, headline, email, phone:** `profile`
- **Résumé button:** put the PDF in `public/` and set
  `profile.resumeUrl = "/resume.pdf"`. The button appears in the hero, and a
  test checks the file exists.
- **Social links:** `socials` (`icon` must be `github`, `linkedin` or `x`; add
  more in `components/icons.tsx` → `socialIcons`).
- **About text and timeline:** `about`
- **Skills:** `skills`
- **Nav:** `navItems`. Each `href` must match a section `id`.

## Social preview image

`src/app/opengraph-image.png` (1200×630) is a static file. If you change the
name, role or headline, regenerate it. Restore the generator from git history
(`git log --all -- src/app/opengraph-image.tsx`), build, and copy
`out/opengraph-image` over the PNG. Or make one in any design tool using the
tokens in DESIGN.md.
