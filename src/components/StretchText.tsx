import type { ReactNode } from "react";

/**
 * Text that widens (variable `wdth` 75 → 100) on hover without moving
 * anything around it.
 *
 * An invisible copy set at full width sits in the same grid cell and
 * reserves the space, so the visible copy can animate freely inside it.
 * Keep it to short, single-line text: it never wraps.
 */
export function StretchText({ children }: { children: ReactNode }) {
  return (
    <span className="group/stretch inline-grid whitespace-nowrap align-top">
      <span
        aria-hidden
        className="invisible col-start-1 row-start-1 [font-variation-settings:'wdth'_100]"
      >
        {children}
      </span>
      <span className="col-start-1 row-start-1 transition-[font-variation-settings] duration-700 ease-[var(--ease-out-expo)] [font-variation-settings:'wdth'_75] group-hover/stretch:[font-variation-settings:'wdth'_100]">
        {children}
      </span>
    </span>
  );
}
