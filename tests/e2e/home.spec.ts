import AxeBuilder from "@axe-core/playwright";
import { expect, test } from "@playwright/test";
import { profile, projects } from "../../src/content/site";

test.describe("home page", () => {
  test("loads without console errors and shows the hero", async ({ page }) => {
    const errors: string[] = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("console", (m) => m.type() === "error" && errors.push(m.text()));

    await page.goto("/");
    await expect(page).toHaveTitle(new RegExp(profile.name));
    await expect(page.getByRole("heading", { level: 1 })).toContainText(
      profile.firstName,
    );
    expect(errors).toEqual([]);
  });

  test("every project screenshot loads", async ({ page }) => {
    await page.goto("/");
    for (const project of projects) {
      const img = page.getByTestId(`project-${project.slug}`).locator("img");
      await img.scrollIntoViewIfNeeded();
      await expect(img).toHaveJSProperty("complete", true);
      expect(
        await img.evaluate((el: HTMLImageElement) => el.naturalWidth),
      ).toBeGreaterThan(0);
    }
  });

  test("sections become visible when scrolled to", async ({ page }) => {
    await page.goto("/");
    const contact = page.locator("#contact");
    await contact.scrollIntoViewIfNeeded();
    await expect(
      page.getByRole("heading", { name: /let.s build/i }),
    ).toBeVisible();
  });

  test("has no detectable accessibility violations", async ({ page }) => {
    await page.emulateMedia({ reducedMotion: "reduce" });
    await page.goto("/");
    const results = await new AxeBuilder({ page }).analyze();
    expect(results.violations.map((v) => `${v.id}: ${v.help}`)).toEqual([]);
  });

  test("serves SEO files", async ({ request }) => {
    expect((await request.get("/robots.txt")).ok()).toBe(true);
    expect((await request.get("/sitemap.xml")).ok()).toBe(true);
    const og = await request.get("/opengraph-image.png");
    expect(og.headers()["content-type"]).toBe("image/png");
  });

  test("unknown routes show the 404 page", async ({ page }) => {
    const response = await page.goto("/does-not-exist");
    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole("heading", { name: /nothing here/i }),
    ).toBeVisible();
  });
});

test.describe("navigation", () => {
  test("desktop nav jumps to sections", async ({ page, isMobile }) => {
    test.skip(isMobile, "desktop nav is hidden on mobile");
    await page.goto("/");
    await page
      .getByRole("navigation", { name: "Main" })
      .getByRole("link", { name: "Skills" })
      .click();
    await expect(page).toHaveURL(/#skills$/);
    await expect(page.locator("#skills")).toBeInViewport();
  });

  test("mobile menu opens, navigates and closes", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "mobile only");
    await page.goto("/");
    await page.getByRole("button", { name: /open menu/i }).click();
    const menu = page.getByRole("navigation", { name: "Mobile" });
    await menu.getByRole("link", { name: "Contact" }).click();
    await expect(menu).toBeHidden();
    await expect(page.locator("#contact")).toBeInViewport();
  });
});
