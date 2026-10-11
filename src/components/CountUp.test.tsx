import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CountUp, formatStat } from "./CountUp";

describe("formatStat", () => {
  it("formats with thousands separators and fixed decimals", () => {
    expect(formatStat(1000)).toBe("1,000");
    expect(formatStat(1.2, 1)).toBe("1.2");
    expect(formatStat(3, 1)).toBe("3.0");
  });
});

describe("<CountUp />", () => {
  it("renders the final value with prefix and suffix (no IntersectionObserver)", () => {
    render(<CountUp from={3.2} to={1.2} decimals={1} suffix="s" label="x" />);
    expect(screen.getByText("1.2s")).toBeInTheDocument();
  });
});
