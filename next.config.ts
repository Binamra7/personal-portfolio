import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static site: `next build` writes plain HTML/CSS/JS to `out/`.
  // Works with Vercel's Next.js preset and with an "out" output directory.
  output: "export",
  // The image optimizer needs a server; screenshots are pre-optimized
  // WebP files instead (see scripts/optimize-images.mjs).
  images: { unoptimized: true },
  reactStrictMode: true,
};

export default nextConfig;
