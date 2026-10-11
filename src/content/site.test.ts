import { existsSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import {
  archiveProjects,
  career,
  featuredProjects,
  heroLines,
  navItems,
  profile,
  socials,
  stats,
  toolkit,
} from "./site";

const allProjects = [...featuredProjects, ...archiveProjects];
const isHttps = (url: string) => new URL(url).protocol === "https:";
const publicFile = (path: string) => existsSync(join(process.cwd(), "public", path));

describe("site content", () => {
  it("has unique project slugs", () => {
    const slugs = allProjects.map((p) => p.slug);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it.each(allProjects)("$title has a screenshot that exists, or a built-in visual", (project) => {
    if (project.image) {
      expect(publicFile(project.image.src)).toBe(true);
      expect(project.image.alt.length).toBeGreaterThan(0);
    } else {
      expect(project.visual).toBeDefined();
    }
  });

  it("gives every archive project a screenshot for the hover preview", () => {
    for (const project of archiveProjects) expect(project.image).toBeDefined();
  });

  it.each(allProjects)("$title uses https links and short copy", (project) => {
    if (project.sourceUrl) expect(isHttps(project.sourceUrl)).toBe(true);
    if (project.liveUrl) expect(isHttps(project.liveUrl)).toBe(true);
    // Visitors skim. Keep summaries to one short sentence.
    expect(project.summary.length).toBeLessThanOrEqual(90);
    expect(project.stack.length).toBeGreaterThan(0);
  });

  it("keeps hero lines short enough to stay big", () => {
    for (const line of heroLines) expect(line.text.length).toBeLessThanOrEqual(16);
  });

  it("has sensible stats", () => {
    for (const stat of stats) {
      expect(Number.isFinite(stat.to)).toBe(true);
      expect(stat.label.length).toBeLessThanOrEqual(40);
    }
  });

  it("keeps career highlights short", () => {
    for (const role of career) {
      expect(role.highlights.length).toBeGreaterThan(0);
      expect(role.highlights.length).toBeLessThanOrEqual(3);
      for (const line of role.highlights) expect(line.length).toBeLessThanOrEqual(70);
    }
  });

  it("uses https for every social link", () => {
    for (const s of socials) expect(isHttps(s.href)).toBe(true);
  });

  it("links nav items to the page's sections", () => {
    expect(navItems.map((n) => n.href)).toEqual(["#work", "#career", "#stack", "#contact"]);
  });

  it("has a valid email, time zone and no empty tool groups", () => {
    expect(profile.email).toMatch(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
    expect(() => new Intl.DateTimeFormat("en", { timeZone: profile.timeZone })).not.toThrow();
    for (const group of toolkit) expect(group.items.length).toBeGreaterThan(0);
  });

  it("points resumeUrl at a real file when set", () => {
    if (profile.resumeUrl) expect(publicFile(profile.resumeUrl)).toBe(true);
  });
});
