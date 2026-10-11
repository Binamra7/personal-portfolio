// Converts a screenshot into the WebP files the site serves.
//   npm run images -- <input-file> <slug>
//   → public/projects/<slug>.webp (1200px) plus <slug>-640.webp and <slug>-320.webp
// The widths must match `images.deviceSizes`/`imageSizes` in next.config.ts.

import { mkdir } from "node:fs/promises";
import { join } from "node:path";
import sharp from "sharp";

export const WIDTHS = [1200, 640, 320];

const [input, slug] = process.argv.slice(2);

if (!input || !slug || !/^[a-z0-9-]+$/.test(slug)) {
  console.error("Usage: npm run images -- <input-file> <slug>   (slug: lowercase, digits, dashes)");
  process.exit(1);
}

const outDir = join("public", "projects");
await mkdir(outDir, { recursive: true });

for (const width of WIDTHS) {
  const name = width === WIDTHS[0] ? `${slug}.webp` : `${slug}-${width}.webp`;
  const info = await sharp(input)
    .resize({ width, withoutEnlargement: true })
    .webp({ quality: 80, effort: 6 })
    .toFile(join(outDir, name));
  console.log(`${name}  ${info.width}x${info.height}  ${Math.round(info.size / 1024)} KB`);
}
console.log(`Use image: { src: "/projects/${slug}.webp", alt: "…" } in src/content/site.ts`);
