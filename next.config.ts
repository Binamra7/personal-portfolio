import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Fully static: `next build` writes plain files to `out/`.
  output: "export",
  // No image server in a static export: a custom loader picks from
  // pre-generated widths. Keep these in sync with scripts/optimize-images.mjs.
  images: {
    loader: "custom",
    loaderFile: "./src/lib/image-loader.ts",
    deviceSizes: [640, 1200],
    imageSizes: [320],
  },
  reactStrictMode: true,
};

export default nextConfig;
