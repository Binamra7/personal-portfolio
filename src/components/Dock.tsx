"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { navItems } from "@/content/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { useScrollProgress } from "@/lib/scroll-progress";
import { SoundToggle } from "./SoundToggle";

const ids = navItems.map((item) => item.href.slice(1));

function useScrolledPast(fraction: number) {
  const [past, setPast] = useState(false);
  useEffect(() => {
    const onScroll = () => setPast(window.scrollY > window.innerHeight * fraction);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [fraction]);
  return past;
}

/** Position and width of the active link, for the sliding pill. */
function usePill(list: React.RefObject<HTMLUListElement | null>, active: string | null) {
  const [pill, setPill] = useState<{ x: number; width: number } | null>(null);

  useLayoutEffect(() => {
    const measure = () => {
      const link = active ? list.current?.querySelector<HTMLElement>(`a[href="#${active}"]`) : null;
      // offsetParent is null when the link is hidden (desktop-only items on mobile).
      setPill(link?.offsetParent ? { x: link.offsetLeft, width: link.offsetWidth } : null);
    };
    measure();
    window.addEventListener("resize", measure);
    void document.fonts?.ready.then(measure);
    return () => window.removeEventListener("resize", measure);
  }, [list, active]);

  return pill;
}

/**
 * Bottom navigation. Hidden on the hero so it doesn't cover the intro; slides
 * up after scrolling or on keyboard focus. Shows page progress on its edge.
 */
export function Dock() {
  const active = useActiveSection(ids);
  const shown = useScrolledPast(0.35);
  const navRef = useRef<HTMLElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const pill = usePill(listRef, active);
  useScrollProgress(
    navRef,
    [
      ["start", 0],
      ["end", 1],
    ],
    {
      target: () => document.documentElement,
    },
  );

  return (
    <nav
      ref={navRef}
      aria-label="Main"
      data-shown={shown}
      className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-[translate,opacity] duration-700 ease-[var(--ease-out-expo)] focus-within:translate-y-0! focus-within:opacity-100! data-[shown=false]:translate-y-[160%] data-[shown=false]:opacity-0 md:bottom-6"
    >
      <div className="relative flex items-center gap-0.5 overflow-hidden rounded-full border border-line bg-raised/75 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <span aria-hidden className="page-progress absolute inset-x-6 bottom-0 h-px bg-accent" />
        <ul ref={listRef} className="relative flex items-center">
          <li
            aria-hidden
            className="absolute inset-y-0 left-0 rounded-full bg-fg transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.34,1.3,0.64,1)]"
            style={{
              width: pill?.width ?? 0,
              transform: `translateX(${pill?.x ?? 0}px)`,
              opacity: pill ? 1 : 0,
            }}
          />
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.href} className={item.desktopOnly ? "hidden md:block" : undefined}>
                <a
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative block rounded-full px-3 py-2.5 font-mono text-[13px] transition-colors duration-300 sm:px-4 ${
                    isActive ? "text-bg" : "text-muted hover:text-fg"
                  }`}
                >
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
        <span className="mx-1 h-5 w-px bg-line-strong" aria-hidden />
        <SoundToggle />
      </div>
    </nav>
  );
}
