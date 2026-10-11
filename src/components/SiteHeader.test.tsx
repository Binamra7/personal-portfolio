import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { navItems } from "@/content/site";
import { SiteHeader } from "./SiteHeader";

describe("<SiteHeader />", () => {
  it("renders a link for every nav item", () => {
    render(<SiteHeader />);
    const nav = screen.getByRole("navigation", { name: "Main" });
    for (const item of navItems) {
      expect(nav.querySelector(`a[href="${item.href}"]`)).toHaveTextContent(
        item.label,
      );
    }
  });

  it("toggles the mobile menu and closes it on Escape", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    const button = screen.getByRole("button", { name: /open menu/i });
    expect(button).toHaveAttribute("aria-expanded", "false");

    await user.click(button);
    expect(
      screen.getByRole("navigation", { name: "Mobile" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /close menu/i })).toHaveAttribute(
      "aria-expanded",
      "true",
    );

    await user.keyboard("{Escape}");
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });

  it("closes the mobile menu after choosing a link", async () => {
    const user = userEvent.setup();
    render(<SiteHeader />);
    await user.click(screen.getByRole("button", { name: /open menu/i }));
    const mobile = screen.getByRole("navigation", { name: "Mobile" });
    await user.click(mobile.querySelector('a[href="#work"]')!);
    expect(screen.queryByRole("navigation", { name: "Mobile" })).toBeNull();
  });
});
