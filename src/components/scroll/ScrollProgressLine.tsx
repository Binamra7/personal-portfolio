"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "motion/react";
import { useRef } from "react";

/**
 * A vertical hairline that fills with the accent colour as its parent
 * section scrolls through the middle of the screen, with a glowing head.
 * Place inside a `relative` container; it stretches to the container's height.
 */
export function ScrollProgressLine({ className = "" }: { className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 60%", "end 60%"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });
  const top = useTransform(progress, (v) => `${v * 100}%`);

  return (
    <div
      ref={ref}
      aria-hidden
      className={`pointer-events-none absolute inset-y-0 w-px bg-line ${className}`}
    >
      <motion.div
        className="absolute inset-0 origin-top bg-accent"
        style={{ scaleY: reduce ? 1 : progress }}
      />
      {!reduce && (
        <motion.div
          className="absolute left-1/2 size-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_16px_4px] shadow-accent/50"
          style={{ top }}
        />
      )}
    </div>
  );
}
