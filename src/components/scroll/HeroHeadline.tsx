"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import type { CSSProperties } from "react";

type Line = { text: string; accent?: boolean };

/** Alternating directions, so the lines shear apart as the hero scrolls away. */
const DRIFT = ["-14%", "10%", "-6%"];

function DriftLine({ line, index }: { line: Line; index: number }) {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const x = useTransform(scrollY, [0, 700], ["0%", DRIFT[index % DRIFT.length] ?? "0%"]);
  const opacity = useTransform(scrollY, [0, 650], [1, 0.12]);

  return (
    <motion.span
      style={reduce ? undefined : { x, opacity }}
      className="block overflow-hidden whitespace-nowrap pt-[0.04em]"
    >
      {/* Load-in animation is CSS (`settle`) so it starts before hydration. */}
      <span
        className={`block animate-settle ${line.accent ? "text-accent" : ""}`}
        style={{ animationDelay: `${150 + index * 120}ms` } as CSSProperties}
      >
        {line.text}
      </span>
    </motion.span>
  );
}

/** The giant hero statement: settles in on load, shears apart on scroll. */
export function HeroHeadline({ lines, srPrefix }: { lines: Line[]; srPrefix: string }) {
  return (
    <h1 className="condensed text-[clamp(3.4rem,13.5vw,13.5rem)] uppercase leading-[0.84]">
      <span className="sr-only">{srPrefix}</span>
      {lines.map((line, i) => (
        <DriftLine key={line.text} line={line} index={i} />
      ))}
    </h1>
  );
}
