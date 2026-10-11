"use client";

import { type CSSProperties, useRef } from "react";
import { useScrollProgress } from "@/lib/scroll-progress";

type Line = { text: string; accent?: boolean };

const DRIFT = ["-14%", "10%", "-6%"];

/** Settles in on load (CSS), then shears apart as the hero scrolls away. */
export function HeroHeadline({ lines, srPrefix }: { lines: Line[]; srPrefix: string }) {
  const ref = useRef<HTMLHeadingElement>(null);
  useScrollProgress(
    ref,
    [
      ["start", 0],
      ["start", -0.8],
    ],
    {
      target: (el) => el.closest("section") ?? el,
    },
  );

  return (
    <h1 ref={ref} className="condensed text-[clamp(3rem,13.5vw,13.5rem)] uppercase leading-[0.84]">
      <span className="sr-only">{srPrefix}</span>
      {lines.map((line, i) => (
        <span
          key={line.text}
          className="hero-line block overflow-hidden whitespace-nowrap pt-[0.04em]"
          style={{ "--drift": DRIFT[i % DRIFT.length] } as CSSProperties}
        >
          <span
            className={`block animate-settle ${line.accent ? "text-accent" : ""}`}
            style={{ animationDelay: `${150 + i * 120}ms` }}
          >
            {line.text}
          </span>
        </span>
      ))}
    </h1>
  );
}
