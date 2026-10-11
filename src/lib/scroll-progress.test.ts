import { describe, expect, it } from "vitest";
import { progressFor, type ScrollOffset } from "./scroll-progress";

const vh = 1000;
const offset: ScrollOffset = [
  ["start", 0.9],
  ["start", 0.4],
];

describe("progressFor", () => {
  it("is 0 before the range, 1 after it, linear between", () => {
    expect(progressFor({ top: 950, bottom: 1250 }, vh, offset)).toBe(0);
    expect(progressFor({ top: 900, bottom: 1200 }, vh, offset)).toBe(0);
    expect(progressFor({ top: 650, bottom: 950 }, vh, offset)).toBeCloseTo(0.5);
    expect(progressFor({ top: 400, bottom: 700 }, vh, offset)).toBe(1);
    expect(progressFor({ top: -500, bottom: -200 }, vh, offset)).toBe(1);
  });

  it("supports ranges that span from one edge to the other", () => {
    const traverse: ScrollOffset = [
      ["start", 1],
      ["end", 0],
    ];
    // 300px tall element: range is 1300px of scrolling.
    expect(progressFor({ top: 1000, bottom: 1300 }, vh, traverse)).toBe(0);
    expect(progressFor({ top: 350, bottom: 650 }, vh, traverse)).toBeCloseTo(0.5);
    expect(progressFor({ top: -300, bottom: 0 }, vh, traverse)).toBe(1);
  });
});
