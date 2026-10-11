import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { archiveProjects, featuredProjects, profile } from "../../src/content/site";

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

  test("sections become visible when scrolled to", async ({ page }) => {
    await page.goto("/");
    await page.locator("#contact").scrollIntoViewIfNeeded();
    await expect(page.getByRole("heading", { name: /let.s talk/i })).toBeVisible();
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
    if (profile.resumeUrl) expect((await request.get(profile.resumeUrl)).ok()).toBe(true);
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
    await expect(toggles.first()).toHaveAttribute("data-state", "armed");

    // Browsers only allow audio after a gesture: the first click starts it.
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
});

test.describe("project visuals", () => {
  test("archive rows show a preview on hover (desktop)", async ({ page, isMobile }) => {
    test.skip(isMobile, "hover previews are desktop only");
    await page.goto("/");
    const row = page.getByTestId(`project-${archiveProjects[0]?.slug}`);
    await row.scrollIntoViewIfNeeded();
    await row.hover();
    await expect(
      page.locator('ul[aria-label="Earlier projects"] [aria-hidden] img').first(),
    ).toBeVisible();
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
