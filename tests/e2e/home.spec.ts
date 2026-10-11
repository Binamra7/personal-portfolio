import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { archiveProjects, featuredProjects, profile } from "../../src/content/site";
import { audibleLevel, tapAudio } from "./audio-tap";

test.describe("home page", () => {
  test("loads without console errors and shows the hero", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    await page.goto("/");
    await expect(page).toHaveTitle(new RegExp(profile.name));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(profile.name);
    expect(errors).toEqual([]);
  });

  test("every project screenshot loads", async ({ page }) => {
    await page.goto("/");
    for (const project of featuredProjects) {
      if (!project.image) continue;
      const img = page.getByTestId(`project-${project.slug}`).locator("img").first();
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      expect(await img.evaluate((el: HTMLImageElement) => el.naturalWidth)).toBeGreaterThan(0);
    }
    // Archive screenshots only render on hover; check they are served.
    for (const project of archiveProjects) {
      if (!project.image) continue;
      const res = await page.request.get(project.image.src);
      expect(res.headers()["content-type"]).toBe("image/webp");
    }
  });

  test("counters land on their final values", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByText("500M+", { exact: true })).toBeVisible();
    await expect(page.getByText("1.2s", { exact: true })).toBeVisible({ timeout: 5000 });
  });

  test("sections reveal when scrolled to", async ({ page }) => {
    await page.goto("/");
    const block = page.locator("#contact [data-reveal]").first();
    // toBeVisible() treats opacity:0 as visible, so check the reveal state itself.
    await expect(block).toHaveAttribute("data-visible", "false");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(block).toHaveAttribute("data-visible", "true");
    await expect(block).toHaveCSS("opacity", "1");
  });

  test("content still appears if the app bundle fails to load", async ({ page }) => {
    await page.route("**/_next/static/chunks/**", (route) => route.abort());
    await page.goto("/");
    const block = page.locator("#contact [data-reveal]").first();
    await expect(block).toHaveCSS("opacity", "1", { timeout: 8000 });
  });

  test("never scrolls sideways, even on a 320px screen", async ({ browser }) => {
    const page = await browser.newPage({ viewport: { width: 320, height: 640 } });
    await page.goto("/");
    await page.mouse.wheel(0, 1200);
    const scrollX = await page.evaluate(() => {
      window.scrollTo(100, window.scrollY);
      return window.scrollX;
    });
    expect(scrollX).toBe(0);
    const dock = await page.locator('nav[aria-label="Main"] > div').boundingBox();
    expect(dock?.x ?? -1).toBeGreaterThanOrEqual(0);
    expect((dock?.x ?? 0) + (dock?.width ?? 0)).toBeLessThanOrEqual(320);
    await page.close();
  });

  test("has no detectable accessibility violations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test("serves SEO files and the résumé", async ({ request }) => {
    expect((await request.get("/robots.txt")).ok()).toBe(true);
    expect((await request.get("/sitemap.xml")).ok()).toBe(true);
    const og = await request.get("/opengraph-image.png");
    expect(og.headers()["content-type"]).toBe("image/png");
    if (profile.resumeUrl) {
      const resume = await request.get(profile.resumeUrl);
      expect(resume.headers()["content-type"]).toBe("application/pdf");
    }
    // A malformed URL must not crash the static server.
    expect((await request.get("/%E0%A4%A")).status()).toBe(404);
    expect((await request.get("/")).ok()).toBe(true);
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(page.getByRole("heading", { name: /nothing here/i })).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("dock links scroll to their sections and mark them active", async ({ page }) => {
    await page.goto("/");
    // The dock tucks itself away on the hero; scroll to reveal it.
    await page.mouse.wheel(0, 800);
    const dock = page.getByRole("navigation", { name: "Main" });
    await expect(dock).toBeInViewport();
    await dock.getByRole("link", { name: "Stack" }).click();
    await expect(page.locator("#stack")).toBeInViewport();
    await expect(dock.getByRole("link", { name: "Stack" })).toHaveAttribute(
      "aria-current",
      "location",
    );
  });

  test("sound is on by default, starts on first interaction, and remembers a mute", async ({
    page,
  }) => {
    await page.goto("/");
    const toggles = page.locator("[data-sound-toggle]");
    await expect(toggles).toHaveCount(2);
    await expect(toggles.first()).toContainText("Sound on");
    // Waiting for the browser to allow audio (no gesture yet).
    await expect(toggles.first()).toHaveAttribute("data-state", "armed");

    await page.locator("h1").click();
    await expect(toggles.first()).toHaveAttribute("data-state", "playing");

    await page
      .getByRole("button", { name: /mute ambient sound/i })
      .first()
      .click();
    await expect(toggles.nth(0)).toHaveAttribute("data-state", "off");
    await expect(toggles.nth(1)).toHaveAttribute("data-state", "off");

    await page.reload();
    await expect(page.locator("[data-sound-toggle]").first()).toHaveAttribute("data-state", "off");
  });

  test("a tap on a touch screen starts the sound", async ({ page, isMobile }) => {
    test.skip(!isMobile, "touch only");
    // Regression: a touch's pointerdown doesn't unlock audio; we used to give up after it.
    await page.goto("/");
    await page.locator("h1").tap();
    await expect(page.locator("[data-sound-toggle]").first()).toHaveAttribute(
      "data-state",
      "playing",
    );
  });

  test("the soundtrack is audible on small speakers, but quiet", async ({ page, isMobile }) => {
    test.skip(isMobile, "same audio on every device; measure once");
    await tapAudio(page);
    await page.goto("/");
    await page.locator("h1").click();
    await page.waitForTimeout(4500); // fade-in
    const level = await audibleLevel(page);
    // Regression: a bass-only mix measured about -60 dB here, which is silence on laptops.
    expect(level).toBeGreaterThan(-34);
    expect(level).toBeLessThan(-18);
  });
});

test.describe("project visuals", () => {
  test("archive rows show a preview on hover (desktop)", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover previews are desktop only");
    await page.goto("/");
    const preview = page.locator('ul[aria-label="Earlier projects"] [data-active]');
    await expect(preview).toHaveAttribute("data-active", "false");
    const row = page.getByTestId(`project-${archiveProjects[0]?.slug}`);
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    await expect(preview).toHaveAttribute("data-active", "true");
    await expect(preview).toHaveCSS("opacity", "1");
  });
});

test.describe("layout stability", () => {
  // Hover effects must never reflow the page (regression: width-animated
  // headings used to wrap onto new lines and push content down).
  test("hovering headings and rows never changes the layout", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover only");
    test.setTimeout(90_000);
    await page.goto("/");
    const targets = page.locator(
      '#contact-title, #career h3, ul[aria-label="Earlier projects"] article, #stack p > span:first-child',
    );
    const count = await targets.count();
    for (let i = 0; i < count; i++) {
      const el = targets.nth(i);
      await el.scrollIntoViewIfNeeded();
      await page.mouse.move(1, 1);
      await page.waitForTimeout(300);
      const before = await el.boundingBox();
      const docBefore = await page.evaluate(() => document.documentElement.scrollHeight);
      await el.hover();
      await page.waitForTimeout(800);
      const after = await el.boundingBox();
      const docAfter = await page.evaluate(() => document.documentElement.scrollHeight);
      expect(Math.round(after?.height ?? 0)).toBe(Math.round(before?.height ?? 0));
      expect(docAfter).toBe(docBefore);
    }
  });

  test("the hero headline keeps its height while animating in", async ({ page }) => {
    await page.goto("/");
    const heights = new Set<number>();
    for (let t = 0; t < 8; t++) {
      heights.add(Math.round((await page.locator("h1").boundingBox())?.height ?? 0));
      await page.waitForTimeout(200);
    }
    expect(heights.size).toBe(1);
  });
});

test.describe("touch screens", () => {
  test("show screenshots in full colour and archive thumbnails by default", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "touch only");
    await page.goto("/");
    await expect(page.getByText(/tap for colour/i)).toHaveCount(0);
    await expect(page.getByText(/hover to see colour/i)).toBeHidden();

    const lens = page
      .getByTestId("project-sleekstore")
      .locator('[aria-hidden="true"]')
      .filter({ has: page.locator("img") })
      .first();
    await lens.scrollIntoViewIfNeeded();
    const radius = await lens.evaluate((el) =>
      getComputedStyle(el).getPropertyValue("--lens-r").trim(),
    );
    expect(radius).toBe("150%");

    for (const project of archiveProjects) {
      const thumb = page.getByTestId(`project-${project.slug}`).locator("img");
      await thumb.scrollIntoViewIfNeeded();
      await expect(thumb).toBeVisible();
    }
  });
});
