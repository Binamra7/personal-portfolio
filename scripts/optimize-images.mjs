// Converts a raw screenshot into the WebP the site serves.
//   npm run images -- <input-file> <slug>
//   e.g. npm run images -- ~/Desktop/shot.png my-app  ->  public/projects/my-app.webp
// Resizes to max 1200px wide (the frame never renders larger) at quality 82.

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

const [input, slug] = process.argv.slice(2);

if (!input || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error(
    "Usage: npm run images -- <input-file> <slug>   (slug: lowercase, digits, dashes)",
  );
  process.exit(1);
}

const outDir = join("public", "projects");
const output = join(outDir, `${slug}.webp`);

await mkdir(outDir, { recursive: true });
const info = await sharp(input)
  .resize({ width: 1200, withoutEnlargement: true })
  .webp({ quality: 82 })
  .toFile(output);

console.log(
  `Wrote ${output} (${info.width}x${info.height}, ${Math.round(info.size / 1024)} KB)`,
);
console.log(`Use image: "/projects/${slug}.webp" in src/content/site.ts`);
