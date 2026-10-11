import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { RagTerminal, TERMINAL_SCRIPT } from "./RagTerminal";

describe("<RagTerminal />", () => {
  it("renders the whole script when it cannot animate", () => {
    const { container } = render(<RagTerminal />);
    for (const line of TERMINAL_SCRIPT.filter((l) => l.text)) {
      expect(container.textContent).toContain(line.text);
    }
  });

  it("describes itself to screen readers", () => {
    const { getByLabelText } = render(<RagTerminal />);
    expect(getByLabelText(/assistant answers a question/i)).toBeInTheDocument();
  });
});
