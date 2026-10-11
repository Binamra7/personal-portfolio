import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { navItems, profile, projects, skills, socials } from "./site";

const isHttps = (url: string) => new URL(url).protocol === "https:";

describe("site content", () => {
  it("has unique project slugs", () => {
    const slugs = projects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(projects)("$title has an image that exists in /public", (project) => {
    expect(existsSync(join(process.cwd(), "public", project.image))).toBe(true);
  });

  it.each(projects)("$title uses https links and short copy", (project) => {
    expect(isHttps(project.sourceUrl)).toBe(true);
    if (project.liveUrl) expect(isHttps(project.liveUrl)).toBe(true);
    // Visitors skim. Keep summaries to one short sentence.
    expect(project.summary.length).toBeLessThanOrEqual(90);
    expect(project.imageAlt.length).toBeGreaterThan(0);
    expect(project.stack.length).toBeGreaterThan(0);
  });

  it("uses https for every social link", () => {
    for (const s of socials) expect(isHttps(s.href)).toBe(true);
  });

  it("only links nav items to sections that exist on the page", () => {
    expect(navItems.map((n) => n.href)).toEqual([
      "#work",
      "#about",
      "#skills",
      "#contact",
    ]);
  });

  it("has a valid email and no empty skill groups", () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    for (const group of skills) expect(group.items.length).toBeGreaterThan(0);
  });

  it("points resumeUrl at a real file when set", () => {
    if (profile.resumeUrl) {
      expect(existsSync(join(process.cwd(), "public", profile.resumeUrl))).toBe(
        true,
      );
    }
  });
});
