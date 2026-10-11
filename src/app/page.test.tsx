import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { navItems, profile } from "@/content/site";
import Home from "./page";

describe("home page", () => {
  it("has exactly one h1 with the owner's name", () => {
    render(<Home />);
    const h1s = screen.getAllByRole("heading", { level: 1 });
    expect(h1s).toHaveLength(1);
    expect(h1s[0]).toHaveTextContent(profile.firstName);
  });

  it("has a section for every nav anchor", () => {
    const { container } = render(<Home />);
    for (const item of navItems) {
      expect(container.querySelector(item.href)).not.toBeNull();
    }
  });

  it("links to the contact email", () => {
    render(<Home />);
    expect(
      screen.getByRole("link", { name: new RegExp(profile.email) }),
    ).toHaveAttribute("href", `mailto:${profile.email}`);
  });
});
