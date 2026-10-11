import { describe, expect, it } from "vitest";
import { getSiteUrl } from "./site-url";

describe("getSiteUrl", () => {
  it("prefers NEXT_PUBLIC_SITE_URL and strips a trailing slash", () => {
    expect(
      getSiteUrl({
        NEXT_PUBLIC_SITE_URL: "https://binamra.dev/",
        VERCEL_PROJECT_PRODUCTION_URL: "x.vercel.app",
      }),
    ).toBe("https://binamra.dev");
  });

  it("falls back to the Vercel production URL", () => {
    expect(getSiteUrl({ VERCEL_PROJECT_PRODUCTION_URL: "me.vercel.app" })).toBe(
      "https://me.vercel.app",
    );
  });

  it("falls back to localhost", () => {
    expect(getSiteUrl({})).toBe("http://localhost:3000");
  });
});
