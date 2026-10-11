"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

/**
 * Slides its content sideways while it crosses the viewport. Alternate
 * `direction` between neighbours for a gentle counter-scrolling effect.
 * The parent must clip horizontal overflow.
 */
export function DriftRow({
  children,
  direction = 1,
  distance = 5,
}: {
  children: ReactNode;
  direction?: 1 | -1;
  /** Percent of the row's width to travel each way. */
  distance?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const d = distance * direction;
  const x = useTransform(scrollYProgress, [0, 1], [`${-d}%`, `${d}%`]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { x }}>
      {children}
    </motion.div>
  );
}
