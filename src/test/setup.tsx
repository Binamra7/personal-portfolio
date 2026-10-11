import "@testing-library/jest-dom/vitest";
import { cleanup } from "@testing-library/react";
import { afterEach, vi } from "vitest";

afterEach(() => cleanup());

// next/image renders a plain <img> in tests.
vi.mock("next/image", () => ({
  default: ({ fill: _fill, priority: _priority, ...props }: Record<string, unknown>) => {
    // biome-ignore lint/performance/noImgElement: test double for next/image
    // biome-ignore lint/a11y/useAltText: alt is passed through in props
    return <img {...props} />;
  },
}));
