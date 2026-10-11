"use client";

import { useLayoutEffect, useRef, useState } from "react";
import { onceInView } from "@/lib/in-view";
import { prefersReducedMotion } from "@/lib/scroll-progress";

/** Illustrative session for the RAG assistant project. */
export const TERMINAL_SCRIPT = [
  { text: '$ ask "why was /orders slow last june?"', tone: "fg" },
  { text: "  searching 10,412 chunks …", tone: "faint" },
  { text: "  3 matches  ·  notes/perf/2025-06.md", tone: "faint" },
  { text: "", tone: "fg" },
  { text: "An N+1 query in ActiveRecord. Rewrote it and", tone: "fg" },
  { text: "added a composite index: 3.2s → 1.2s. [1]", tone: "fg" },
  { text: "", tone: "fg" },
  { text: "[1] notes/perf/2025-06.md#orders-endpoint", tone: "accent" },
] as const;

const TONE = { fg: "text-fg", faint: "text-faint", accent: "text-accent" };
const CHARS_PER_SECOND = 70;

// Character offset where each line starts (+1 per line for the line break).
const LINE_STARTS = TERMINAL_SCRIPT.map((_, i) =>
  TERMINAL_SCRIPT.slice(0, i).reduce((n, line) => n + line.text.length + 1, 0),
);
const TOTAL = (LINE_STARTS.at(-1) ?? 0) + (TERMINAL_SCRIPT.at(-1)?.text.length ?? 0);

/**
 * Types the script out once in view. Untyped characters stay in the DOM but
 * invisible, so the box never changes size.
 */
export function RagTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(TOTAL);

  useLayoutEffect(() => {
    const node = ref.current;
    if (!node || prefersReducedMotion() || typeof IntersectionObserver === "undefined") return;

    setTyped(0);
    let frame = 0;
    const stop = onceInView(
      node,
      () => {
        const start = performance.now();
        const step = (now: number) => {
          const chars = Math.min(TOTAL, Math.floor(((now - start) / 1000) * CHARS_PER_SECOND));
          setTyped(chars);
          if (chars < TOTAL) frame = requestAnimationFrame(step);
        };
        frame = requestAnimationFrame(step);
      },
      { threshold: 0.5 },
    );
    return () => {
      stop();
      cancelAnimationFrame(frame);
    };
  }, []);

  const caretLine = typed < TOTAL ? LINE_STARTS.findLastIndex((start) => start <= typed) : -1;

  return (
    <div
      ref={ref}
      className="relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface md:aspect-[21/9]"
    >
      <pre
        role="img"
        aria-label="Example session: the assistant answers a question from notes and cites its source"
        className="flex-1 overflow-hidden whitespace-pre-wrap break-words px-5 py-8 font-mono text-[12px] leading-relaxed sm:text-sm md:px-10 md:py-14 md:text-lg"
      >
        {TERMINAL_SCRIPT.map((line, i) => {
          const shown = Math.max(0, Math.min(line.text.length, typed - (LINE_STARTS[i] ?? 0)));
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: static script
            <div key={i} className={TONE[line.tone]} aria-hidden>
              {line.text.slice(0, shown)}
              {i === caretLine && (
                <span className="inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-accent" />
              )}
              <span className="opacity-0">{line.text.slice(shown) || " "}</span>
            </div>
          );
        })}
      </pre>
      <div className="flex items-center justify-between border-line border-t px-5 py-3 font-mono text-faint text-xs md:px-10">
        <span>rag-assistant — zsh</span>
        <span className="flex items-center gap-2">
          <span className="size-1.5 rounded-full bg-accent" aria-hidden />
          mcp: connected
        </span>
      </div>
    </div>
  );
}
