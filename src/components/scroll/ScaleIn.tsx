"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import { type ReactNode, useRef } from "react";

/** Grows from slightly smaller to full size as it scrolls into view. Transform only. */
export function ScaleIn({ children, from = 0.82 }: { children: ReactNode; from?: number }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "start 45%"] });
  const scale = useTransform(scrollYProgress, [0, 1], [from, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["25%", "0%"]);

  return (
    <motion.div ref={ref} style={reduce ? undefined : { scale, y }} className="origin-bottom-left">
      {children}
    </motion.div>
  );
}
