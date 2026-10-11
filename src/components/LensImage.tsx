"use client";

import Image from "next/image";
import { type PointerEvent, useRef, useState } from "react";
import { useScrollProgress } from "@/lib/scroll-progress";

type LensImageProps = {
  src: string;
  alt: string;
  priority?: boolean;
};

/**
 * Screenshot as a sand duotone that opens up on scroll (`.lens-frame`) with a
 * slight parallax (`.lens-parallax`). A circular lens under the pointer shows
 * the real colours; tapping toggles full colour on touch screens.
 */
export function LensImage({ src, alt, priority = false }: LensImageProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [fullColour, setFullColour] = useState(false);
  useScrollProgress(ref, [
    ["start", 1],
    ["start", 0.45],
  ]);
  useScrollProgress(
    ref,
    [
      ["start", 1],
      ["end", 0],
    ],
    { name: "--q" },
  );

  function moveLens(event: PointerEvent<HTMLDivElement>) {
    if (event.pointerType !== "mouse") return;
    const rect = event.currentTarget.getBoundingClientRect();
    event.currentTarget.style.setProperty("--x", `${event.clientX - rect.left}px`);
    event.currentTarget.style.setProperty("--y", `${event.clientY - rect.top}px`);
  }

  return (
    // biome-ignore lint/a11y/useKeyWithClickEvents lint/a11y/noStaticElementInteractions: decorative colour toggle; the image is described by its alt text
    <div
      ref={ref}
      className="lens-frame group/lens relative aspect-video cursor-crosshair overflow-hidden rounded-xl bg-surface"
      onPointerMove={moveLens}
      onClick={() => setFullColour((c) => !c)}
      data-full-colour={fullColour}
    >
      <div className="lens-parallax absolute inset-x-0 -inset-y-[7%]">
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
      </div>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-bg/80 to-transparent"
      />
      <span className="pointer-events-none absolute right-4 bottom-4 rounded-full bg-bg/70 px-3 py-1.5 font-mono text-muted text-xs backdrop-blur transition-opacity group-hover/lens:opacity-0">
        <span className="hidden [@media(hover:hover)]:inline">Hover to see colour</span>
        <span className="[@media(hover:hover)]:hidden">Tap for colour</span>
      </span>
    </div>
  );
}
