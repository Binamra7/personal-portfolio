// Checks every link in the built page (out/index.html).
//   node scripts/check-links.mjs            internal + external
//   node scripts/check-links.mjs --internal anchors and local files only (no network)
// Exits 1 if any link is broken.

import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";

const internalOnly = process.argv.includes("--internal");
const page = "out/index.html";

if (!existsSync(page)) {
  console.error("No build found in out/. Run `npm run build` first.");
  process.exit(1);
}

const html = readFileSync(page, "utf8");
const decode = (s) => s.replaceAll("&amp;", "&");
const hrefs = [...new Set([...html.matchAll(/<a[^>]+href="([^"]+)"/g)].map((m) => decode(m[1])))];
const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));

// Sites that refuse automated requests; a real visitor gets through.
const BOT_BLOCKED = { "www.linkedin.com": 999 };
const UA =
  "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/140.0 Safari/537.36";

async function checkExternal(url) {
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const res = await fetch(url, {
        redirect: "follow",
        headers: { "user-agent": UA },
        signal: AbortSignal.timeout(30_000),
      });
      if (BOT_BLOCKED[new URL(url).hostname] === res.status)
        return { ok: true, note: "bot-blocked, skipped" };
      if (res.ok) return { ok: true, note: String(res.status) };
      if (attempt === 2) return { ok: false, note: `HTTP ${res.status}` };
    } catch (error) {
      if (attempt === 2)
        return { ok: false, note: error.name === "TimeoutError" ? "timeout" : error.message };
    }
  }
}

function checkInternal(href) {
  if (href.startsWith("#"))
    return ids.has(href.slice(1)) ? { ok: true } : { ok: false, note: "no element with this id" };
  if (href.startsWith("mailto:"))
    return /^mailto:[^@\s]+@[^@\s]+\.[^@\s]+$/.test(href)
      ? { ok: true }
      : { ok: false, note: "bad address" };
  if (href.startsWith("tel:"))
    return /^tel:\+?\d{6,15}$/.test(href) ? { ok: true } : { ok: false, note: "bad number" };
  const file = join("out", decodeURIComponent(href.split(/[?#]/)[0]));
  return existsSync(file) ? { ok: true } : { ok: false, note: "file missing from build" };
}

const results = await Promise.all(
  hrefs.map(async (href) => {
    const external = /^https?:\/\//.test(href);
    if (external && internalOnly) return null;
    return { href, ...(external ? await checkExternal(href) : checkInternal(href)) };
  }),
);

let broken = 0;
for (const r of results.filter(Boolean)) {
  if (!r.ok) broken++;
  console.log(`${r.ok ? "ok  " : "FAIL"}  ${r.href}${r.note ? `  (${r.note})` : ""}`);
}
console.log(`\n${results.filter(Boolean).length} links checked, ${broken} broken.`);
process.exit(broken ? 1 : 0);
