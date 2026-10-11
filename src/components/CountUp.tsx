"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import type { Stat } from "@/content/site";

// useLayoutEffect warns during server rendering; fall back to useEffect there.
const useIsoLayoutEffect = typeof window === "undefined" ? useEffect : useLayoutEffect;

export function formatStat(value: number, decimals = 0) {
  return value.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Counts from `from` to `to` when scrolled into view. The server renders the
 * final number (good for no-JS and crawlers); the client rewinds it before
 * first paint, then animates.
 */
export function CountUp({ from = 0, to, decimals = 0, prefix = "", suffix = "" }: Stat) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(to);

  useIsoLayoutEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setValue(from);
    let frame = 0;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry?.isIntersecting) return;
      observer.disconnect();
      const start = performance.now();
      const duration = 1800;
      const step = (now: number) => {
        const t = Math.min((now - start) / duration, 1);
        const eased = 1 - (1 - t) ** 4;
        setValue(from + (to - from) * eased);
        if (t < 1) frame = requestAnimationFrame(step);
      };
      frame = requestAnimationFrame(step);
    });
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [from, to]);

  return (
    <span ref={ref} className="tabular-nums">
      {prefix}
      {formatStat(value, decimals)}
      {suffix}
    </span>
  );
}
