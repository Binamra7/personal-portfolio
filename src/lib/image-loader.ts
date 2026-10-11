/**
 * next/image loader for the static export: maps a requested width to a
 * pre-generated file (see scripts/optimize-images.mjs). 1200px is the original.
 */
export default function imageLoader({ src, width }: { src: string; width: number }) {
  if (width >= 1200 || !src.endsWith(".webp")) return src;
  return src.replace(/\.webp$/, `-${width}.webp`);
}
