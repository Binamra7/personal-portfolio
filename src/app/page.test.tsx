import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { archiveProjects, featuredProjects, navItems, profile } from "@/content/site";
import Home from "./page";

describe("home page", () => {
  it("has exactly one h1, which names the owner", () => {
    render(<Home />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(profile.name);
  });

  it("has a section for every nav anchor", () => {
    const { container } = render(<Home />);
    for (const item of navItems) {
      expect(container.querySelector(item.href)).not.toBeNull();
    }
  });

  it("renders every project", () => {
    render(<Home />);
    for (const project of [...featuredProjects, ...archiveProjects]) {
      expect(screen.getByTestId(`project-${project.slug}`)).toBeInTheDocument();
    }
  });

  it("links to the contact email and the résumé", () => {
    render(<Home />);
    expect(screen.getByRole("link", { name: new RegExp(profile.email) })).toHaveAttribute(
      "href",
      `mailto:${profile.email}`,
    );
    if (profile.resumeUrl) {
      for (const link of screen.getAllByRole("link", { name: /résumé/i })) {
        expect(link).toHaveAttribute("href", profile.resumeUrl);
      }
    }
  });

  it("opens external links safely", () => {
    const { container } = render(<Home />);
    for (const link of container.querySelectorAll('a[target="_blank"]')) {
      expect(link.getAttribute("rel")).toContain("noreferrer");
    }
  });
});
