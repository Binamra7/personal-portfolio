"use client";

import { useLayoutEffect, useRef } from "react";
import type { Stat } from "@/content/site";
import { onceInView } from "@/lib/in-view";
import { prefersReducedMotion } from "@/lib/scroll-progress";

export function formatStat(value: number, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

const display = (value: number, { decimals = 0, prefix = "", suffix = "" }: Stat) =>
  `${prefix}${formatStat(value, decimals)}${suffix}`;

/**
 * Counts from `from` to `to` when scrolled into view. The server renders the
 * final value; the client rewinds it before first paint. Frames write the
 * text node directly, so the animation causes no React renders.
 */
export function CountUp(stat: Stat) {
  const ref = useRef<HTMLSpanElement>(null);
  const { from = 0, to } = stat;

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;

    node.textContent = display(from, stat);
    let frame = 0;
    const stop = onceInView(node, () => {
      const start = performance.now();
      const step = (now: number) => {
        const t = Math.min((now - start) / 1800, 1);
        node.textContent = display(from + (to - from) * (1 - (1 - t) ** 4), stat);
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, [stat, from, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {display(to, stat)}
    </span>
  );
}
