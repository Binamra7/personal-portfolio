"use client";

import { type RefObject, useEffect } from "react";

/**
 * Scroll-linked animation without a library. Registered elements get a 0→1
 * CSS variable (default `--p`) that CSS maps to transforms. One shared rAF
 * loop does a read pass then a write pass, so scrolling never re-renders React.
 *
 * Offsets say where an element edge meets a viewport line:
 *   [["start", 0.95], ["start", 0.4]] is 0 when the element's top is 95% down
 *   the viewport and 1 when it reaches 40%.
 */
export type Edge = "start" | "end";
export type ScrollOffset = readonly [readonly [Edge, number], readonly [Edge, number]];

type Subscriber = {
  el: HTMLElement;
  target: HTMLElement;
  offset: ScrollOffset;
  name: string;
  last: number;
};

const subscribers = new Set<Subscriber>();
let frame = 0;

const clamp = (v: number) => (v <= 0 ? 0 : v >= 1 ? 1 : v);

/** Pure maths, exported for tests. */
export function progressFor(
  rect: { top: number; bottom: number },
  vh: number,
  offset: ScrollOffset,
) {
  const edge = (e: Edge) => (e === "start" ? rect.top : rect.bottom);
  const d0 = edge(offset[0][0]) - vh * offset[0][1];
  const d1 = edge(offset[1][0]) - vh * offset[1][1];
  const span = d0 - d1;
  if (span === 0) return d0 <= 0 ? 1 : 0;
  return clamp(d0 / span);
}

function update() {
  frame = 0;
  const vh = window.innerHeight;
  // Read every rect before writing any style, so the browser lays out once.
  const values: number[] = [];
  for (const s of subscribers)
    values.push(progressFor(s.target.getBoundingClientRect(), vh, s.offset));
  let i = 0;
  for (const s of subscribers) {
    const p = values[i++] ?? 0;
    if (Math.abs(p - s.last) > 0.0005) {
      s.last = p;
      s.el.style.setProperty(s.name, p.toFixed(4));
    }
  }
}

function schedule() {
  if (!frame) frame = requestAnimationFrame(update);
}

function subscribe(sub: Subscriber) {
  if (subscribers.size === 0) {
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule, { passive: true });
  }
  subscribers.add(sub);
  schedule();
  return () => {
    subscribers.delete(sub);
    sub.el.style.removeProperty(sub.name);
    if (subscribers.size === 0) {
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    }
  };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches ?? false);

/**
 * Writes scroll progress to `name` on the element. Under reduced motion it
 * does nothing, so CSS falls back to the finished state. `target` measures a
 * different element (e.g. the enclosing section).
 */
export function useScrollProgress(
  ref: RefObject<HTMLElement | null>,
  offset: ScrollOffset,
  { name = "--p", target }: { name?: string; target?: (el: HTMLElement) => HTMLElement } = {},
) {
  // biome-ignore lint/correctness/useExhaustiveDependencies: offsets and target are static per call site
  useEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    return subscribe({ el, target: target?.(el) ?? el, offset, name, last: -1 });
  }, [ref]);
}
