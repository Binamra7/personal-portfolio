"use client";

import { motion } from "motion/react";
import { useEffect, useState } from "react";
import { navItems } from "@/content/site";
import { useActiveSection } from "@/hooks/useActiveSection";
import { SoundToggle } from "./SoundToggle";

const ids = navItems.map((item) => item.href.slice(1));

/** Visible once the visitor scrolls past the top of the hero. */
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

/**
 * Floating bottom navigation with a sliding active pill and the sound toggle.
 * Tucked away on the hero so it doesn't cover the intro; it slides up once
 * you scroll, or when it receives keyboard focus.
 */
export function Dock() {
  const active = useActiveSection(ids);
  const shown = useScrolledPast(0.35);

  return (
    <nav
      aria-label="Main"
      data-shown={shown}
      className="group/dock fixed bottom-4 left-1/2 z-50 -translate-x-1/2 transition-[translate,opacity] duration-700 ease-[var(--ease-out-expo)] focus-within:translate-y-0! focus-within:opacity-100! data-[shown=false]:translate-y-[160%] data-[shown=false]:opacity-0 md:bottom-6"
    >
      <div className="flex items-center gap-0.5 rounded-full border border-line bg-raised/75 p-1.5 shadow-2xl shadow-black/50 backdrop-blur-xl">
        <ul className="flex items-center">
          {navItems.map((item) => {
            const isActive = active === item.href.slice(1);
            return (
              <li key={item.href} className="relative">
                {isActive && (
                  <motion.span
                    layoutId="dock-pill"
                    className="absolute inset-0 rounded-full bg-fg"
                    transition={{ type: "spring", stiffness: 400, damping: 34 }}
                  />
                )}
                <a
                  href={item.href}
                  aria-current={isActive ? "location" : undefined}
                  className={`relative block rounded-full px-3 py-2.5 font-mono text-[13px] transition-colors sm:px-4 ${
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
