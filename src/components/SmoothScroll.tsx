"use client";

import Lenis from "lenis";
import { useEffect } from "react";

/**
 * Inertial smooth scrolling via Lenis. Also animates in-page anchor links.
 * Skipped entirely for visitors who prefer reduced motion.
 */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      autoRaf: true,
      lerp: 0.1,
      anchors: { offset: -16 },
    });
    return () => lenis.destroy();
  }, []);

  return null;
}
