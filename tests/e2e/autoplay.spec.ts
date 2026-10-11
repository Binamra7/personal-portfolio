import { expect, test } from "@playwright/test";

// Some browsers allow autoplay (e.g. for sites a visitor uses a lot, or when
// they've allowed sound for the site). There, the soundtrack starts on load.
test.use({ launchOptions: { args: ["--autoplay-policy=no-user-gesture-required"] } });

test("plays the soundtrack on load where the browser allows autoplay", async ({ page }) => {
  await page.goto("/");
  await expect(page.locator("[data-sound-toggle]").first()).toHaveAttribute(
    "data-state",
    "playing",
    { timeout: 10_000 },
  );
});
