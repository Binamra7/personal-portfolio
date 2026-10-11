// Serves the static export in `out/` — a stand-in for Vercel when previewing
// a production build locally or running e2e tests. Zero dependencies.
//   node scripts/serve-static.mjs [port]   (default: $PORT or 3000)

import { createReadStream, existsSync } from "node:fs";
import { stat } from "node:fs/promises";
import { createServer } from "node:http";
import { extname, join, normalize, resolve } from "node:path";

const root = resolve("out");
const port = Number(process.argv[2] ?? process.env.PORT ?? 3000);

if (!existsSync(join(root, "index.html"))) {
  console.error("No build found in out/. Run `npm run build` first.");
  process.exit(1);
}

const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json",
  ".txt": "text/plain; charset=utf-8",
  ".xml": "application/xml",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".woff2": "font/woff2",
};

async function resolveFile(urlPath) {
  const safe = normalize(decodeURIComponent(urlPath)).replace(
    /^(\.\.[/\\])+/,
    "",
  );
  const base = join(root, safe);
  if (!base.startsWith(root)) return null;

  // Mirror Vercel's clean URLs: /foo -> foo.html, /foo/ -> foo/index.html
  for (const candidate of [base, `${base}.html`, join(base, "index.html")]) {
    try {
      if ((await stat(candidate)).isFile()) return candidate;
    } catch {
      // try next candidate
    }
  }
  return null;
}

createServer(async (req, res) => {
  const { pathname } = new URL(req.url ?? "/", "http://localhost");
  const file = await resolveFile(pathname);
  const target = file ?? join(root, "404.html");

  res.writeHead(file ? 200 : 404, {
    "Content-Type": types[extname(target)] ?? "application/octet-stream",
  });
  createReadStream(target).pipe(res);
}).listen(port, () => {
  console.log(`Serving out/ at http://localhost:${port}`);
});
