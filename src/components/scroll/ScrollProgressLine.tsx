"use client";

import { useRef } from "react";
import { useScrollProgress } from "@/lib/scroll-progress";

/** Vertical hairline that fills as its container passes the middle of the screen. */
export function ScrollProgressLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useScrollProgress(ref, [
    ["start", 0.6],
    ["end", 0.6],
  ]);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 w-px bg-line ${className}`}
    >
      <div className="progress-fill absolute inset-0 bg-accent" />
      <div className="progress-head absolute inset-0">
        <div className="-translate-1/2 absolute left-1/2 size-2 rounded-full bg-accent shadow-[0_0_16px_4px] shadow-accent/50" />
      </div>
    </div>
  );
}
