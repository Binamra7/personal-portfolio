import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { navItems } from "@/content/site";
import { Dock } from "./Dock";

describe("<Dock />", () => {
  it("renders a link for every nav item", () => {
    render(<Dock />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const item of navItems) {
      expect(nav.querySelector(`a[href="${item.href}"]`)).toHaveTextContent(item.label);
    }
  });

  it("has a sound toggle that is off by default", async () => {
    const user = userEvent.setup();
    render(<Dock />);
    const button = screen.getByRole("button", { name: /play ambient sound/i });
    expect(button).toHaveAttribute("aria-pressed", "false");

    // jsdom has no AudioContext, so the toggle must stay safely off.
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
