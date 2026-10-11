"use client";

import { type ReactNode, useRef } from "react";
import { useScrollProgress } from "@/lib/scroll-progress";

/** Inks in left to right as it scrolls up the viewport. Styles: `.scroll-fill`. */
export function ScrollFillText({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  useScrollProgress(ref, [
    ["start", 0.95],
    ["start", 0.4],
  ]);
  return (
    <span ref={ref} className="scroll-fill">
      {children}
    </span>
  );
}
