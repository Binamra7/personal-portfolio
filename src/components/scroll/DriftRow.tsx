"use client";

import { type CSSProperties, type ReactNode, useRef } from "react";
import { useScrollProgress } from "@/lib/scroll-progress";

/** Slides sideways by ±`distance`% while crossing the viewport. Parent must clip overflow. */
export function DriftRow({ children, distance = 3 }: { children: ReactNode; distance?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, [
    ["start", 1],
    ["end", 0],
  ]);
  return (
    <div ref={ref} className="drift-row" style={{ "--drift": `${distance}%` } as CSSProperties}>
      {children}
    </div>
  );
}
