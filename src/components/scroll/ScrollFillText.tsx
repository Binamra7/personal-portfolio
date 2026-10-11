"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

/**
 * Text that "inks in" from left to right as it scrolls up the viewport:
 * a two-tone gradient clipped to the glyphs, with its position tied to scroll.
 */
export function ScrollFillText({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 95%", "start 40%"] });
  const backgroundPositionX = useTransform(scrollYProgress, [0, 1], ["100%", "0%"]);

  if (reduce) return <span ref={ref}>{children}</span>;

  return (
    <motion.span
      ref={ref}
      style={{ backgroundPositionX }}
      className="bg-[length:200%_100%] bg-[linear-gradient(90deg,var(--color-fg)_50%,rgb(236_235_228/0.16)_50%)] bg-clip-text text-transparent [-webkit-box-decoration-break:clone] [box-decoration-break:clone]"
    >
      {children}
    </motion.span>
  );
}
