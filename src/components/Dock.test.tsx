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

  it("falls back to sound off where Web Audio is unavailable", async () => {
    const user = userEvent.setup();
    render(<Dock />);
    // jsdom has no AudioContext: the default "on" must degrade to off, and stay off.
    const button = await screen.findByRole("button", { name: /play ambient sound/i });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await user.click(button);
    expect(button).toHaveAttribute("aria-pressed", "false");
  });
});
