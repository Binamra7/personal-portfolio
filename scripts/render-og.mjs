// Renders src/app/opengraph-image.png (1200×630) using the site's own
// self-hosted fonts. Run after changing the hero copy:
//   npm run build && npm run og
// It serves out/, waits for hydration, overlays the card, and screenshots it.

import { spawn } from "node:child_process";
import { setTimeout as sleep } from "node:timers/promises";
import { chromium } from "@playwright/test";

const PORT = 4174;
const server = spawn("node", ["scripts/serve-static.mjs", String(PORT)], { stdio: "inherit" });
await sleep(800);

const card = `
  <div style="display:flex;justify-content:space-between;font-family:var(--font-martian);font-size:22px;color:#adaba2">
    <span><span style="color:#f4a73b">bk.</span>&nbsp;&nbsp;Binamra Khadka</span><span>Kathmandu, Nepal</span>
  </div>
  <div style="font-family:var(--font-bricolage);font-variation-settings:'wdth' 75;font-weight:700;font-size:112px;line-height:.86;text-transform:uppercase;letter-spacing:-0.02em">
    <div>I build fast,</div><div style="color:#f4a73b">real-time &amp; AI</div><div>web products.</div>
  </div>
  <div style="font-family:var(--font-martian);font-size:22px;color:#adaba2">Full-stack software engineer · Rails · Next.js · LLMs</div>`;

try {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1200, height: 630 } });
  await page.goto(`http://localhost:${PORT}/`, { waitUntil: "networkidle" });
  await page.waitForTimeout(3000); // let hydration + hero animation finish
  await page.evaluate((html) => {
    const el = document.createElement("div");
    el.style.cssText =
      "position:fixed;inset:0;z-index:2147483647;display:flex;flex-direction:column;justify-content:space-between;padding:72px 80px;color:#ecebe4;background:radial-gradient(circle at 100% 0%, #2b2011 0%, #0b0b0a 55%)";
    el.innerHTML = html;
    document.documentElement.appendChild(el);
  }, card);
  await page.evaluate(() => document.fonts.ready);
  await page.screenshot({ path: "src/app/opengraph-image.png" });
  await browser.close();
  console.log("Wrote src/app/opengraph-image.png");
} finally {
  server.kill();
}
