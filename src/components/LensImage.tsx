"use client";

import { motion, useReducedMotion, useScroll, useTransform } from "motion/react";
import Image from "next/image";
import { type PointerEvent, useRef, useState } from "react";

type LensImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

/**
 * A screenshot shown as a sand duotone (see `.duotone` in globals.css) that
 * opens up as it scrolls into view and drifts with a slight parallax.
 * A circular "lens" follows the pointer and reveals the real colours.
 * On touch screens, tapping toggles full colour.
 */
export function LensImage({ src, alt, priority = false }: LensImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const [fullColour, setFullColour] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const clipPath = useTransform(
    scrollYProgress,
    [0, 0.4],
    ["inset(14% 10% 14% 10% round 28px)", "inset(0% 0% 0% 0% round 12px)"],
  );
  const y = useTransform(scrollYProgress, [0, 1], ["-6%", "6%"]);

  function moveLens(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    <motion.div
      ref={ref}
      style={reduceMotion ? undefined : { clipPath }}
      className="group/lens relative aspect-video cursor-crosshair overflow-hidden rounded-xl bg-surface"
      onPointerMove={moveLens}
      onClick={() => setFullColour((c) => !c)}
      data-full-colour={fullColour}
    >
      <motion.div
        style={reduceMotion ? undefined : { y }}
        className="absolute inset-x-0 -inset-y-[7%]"
      >
        <div className="duotone absolute inset-0">
          <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover object-top"
          />
        </div>
        {/* Real colours, clipped to the lens circle. Decorative duplicate. */}
        <div
          aria-hidden
          className="absolute inset-0 transition-[--lens-r] duration-700 ease-out [--lens-r:0px] [clip-path:circle(var(--lens-r)_at_var(--x,50%)_var(--y,50%))] group-hover/lens:[--lens-r:170px] group-data-[full-colour=true]/lens:[--lens-r:150%]"
        >
          <Image
            src={src}
            alt=""
            fill
            sizes="(min-width: 1280px) 1200px, 100vw"
            className="object-cover object-top"
          />
        </div>
      </motion.div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/80 to-transparent"
      />
      <span className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-bg/70 px-3 py-1.5 font-mono text-muted text-xs backdrop-blur transition-opacity group-hover/lens:opacity-0">
        <span className="hidden [@media(hover:hover)]:inline">Hover to see colour</span>
        <span className="[@media(hover:hover)]:hidden">Tap for colour</span>
      </span>
    </motion.div>
  );
}
