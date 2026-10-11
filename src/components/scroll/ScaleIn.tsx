"use client";

import { type ReactNode, useRef } from "react";
import { useScrollProgress } from "@/lib/scroll-progress";

/** Grows from 82% to full size as it scrolls into view. */
export function ScaleIn({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, [
    ["start", 1],
    ["start", 0.45],
  ]);
  return (
    <div ref={ref} className="scale-in">
      {children}
    </div>
  );
}
