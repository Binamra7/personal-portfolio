import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CopyEmailButton } from "./CopyEmailButton";

describe("<CopyEmailButton />", () => {
  it("copies the email and confirms", async () => {
    const user = userEvent.setup();
    const writeText = vi
      .spyOn(navigator.clipboard, "writeText")
      .mockResolvedValue();
    render(<CopyEmailButton email="me@example.com" />);

    await user.click(screen.getByRole("button", { name: /copy email/i }));

    expect(writeText).toHaveBeenCalledWith("me@example.com");
    expect(await screen.findByText("Copied")).toBeInTheDocument();
  });

  it("stays usable when the clipboard is blocked", async () => {
    const user = userEvent.setup();
    vi.spyOn(navigator.clipboard, "writeText").mockRejectedValue(
      new Error("denied"),
    );
    render(<CopyEmailButton email="me@example.com" />);

    await user.click(screen.getByRole("button", { name: /copy email/i }));

    expect(screen.getByText("Copy email")).toBeInTheDocument();
  });
});
