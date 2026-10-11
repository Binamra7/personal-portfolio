"use client";

import { useEffect, useRef, useState } from "react";

/** A short scripted session for the RAG assistant project (illustrative). */
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

const TOTAL = TERMINAL_SCRIPT.reduce((n, line) => n + line.text.length + 1, 0);

const toneClass = { fg: "text-fg", faint: "text-faint", accent: "text-accent" };

/**
 * Types the script out once it scrolls into view. Untyped characters are
 * rendered invisible so the box never changes size.
 */
export function RagTerminal() {
  const ref = useRef<HTMLDivElement>(null);
  const [typed, setTyped] = useState(TOTAL);

  useEffect(() => {
    const node = ref.current;
    if (!node || typeof IntersectionObserver === "undefined") return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    let timer: ReturnType<typeof setInterval> | undefined;
    setTyped(0);
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return;
        observer.disconnect();
        timer = setInterval(() => {
          setTyped((n) => {
            if (n >= TOTAL) clearInterval(timer);
            return Math.min(n + 2, TOTAL);
          });
        }, 28);
      },
      { threshold: 0.5 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      clearInterval(timer);
    };
  }, []);

  let remaining = typed;
  return (
    <div
      ref={ref}
      className="relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface md:aspect-[21/9]"
    >
      <pre
        role="img"
        className="flex-1 overflow-hidden px-5 py-8 font-mono text-[12px] leading-relaxed sm:text-sm md:px-10 md:py-14 md:text-lg"
        aria-label="Example session: the assistant answers a question from notes and cites its source"
      >
        {TERMINAL_SCRIPT.map((line, i) => {
          const visible = Math.max(0, Math.min(line.text.length, remaining));
          remaining -= line.text.length + 1;
          const isCaretLine = remaining < 0 && remaining > -(line.text.length + 2) && typed < TOTAL;
          return (
            // biome-ignore lint/suspicious/noArrayIndexKey: static script
            <div key={i} className={toneClass[line.tone]} aria-hidden>
              {line.text.slice(0, visible)}
              {isCaretLine && (
                <span className="inline-block h-[1em] w-[0.55em] translate-y-[0.15em] bg-accent" />
              )}
              <span className="opacity-0">{line.text.slice(visible) || " "}</span>
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
