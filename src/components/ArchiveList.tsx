"use client";

import Image from "next/image";
import { type PointerEvent, useEffect, useRef, useState } from "react";
import type { Project } from "@/content/site";
import { ArrowUpRight, GitHubIcon } from "./icons";
import { Reveal } from "./Reveal";

/** Eases an element towards the pointer each frame, then goes idle. */
function useFollowPointer() {
  const ref = useRef<HTMLDivElement>(null);
  const target = useRef({ x: 0, y: 0 });
  const pos = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef(0);

  useEffect(() => () => cancelAnimationFrame(frame.current), []);

  function tick() {
    const p = pos.current;
    const t = target.current;
    if (!p || !ref.current) return;
    p.x += (t.x - p.x) * 0.2;
    p.y += (t.y - p.y) * 0.2;
    ref.current.style.transform = `translate3d(${p.x}px, ${p.y}px, 0)`;
    frame.current =
      Math.abs(t.x - p.x) + Math.abs(t.y - p.y) > 0.5 ? requestAnimationFrame(tick) : 0;
  }

  function track(event: PointerEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    target.current = { x: event.clientX - rect.left, y: event.clientY - rect.top };
    pos.current ??= { ...target.current }; // first move: appear under the cursor, don't fly in
    if (!frame.current) frame.current = requestAnimationFrame(tick);
  }

  return { ref, track };
}

/**
 * Older projects as big typographic rows. Hovering a row shows a screenshot
 * preview that trails the cursor; touch screens show each screenshot inline.
 */
export function ArchiveList({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<string | null>(null);
  const follow = useFollowPointer();

  return (
    <ul
      className="relative"
      onPointerMove={follow.track}
      onPointerLeave={() => setActive(null)}
      aria-label="Earlier projects"
    >
      {projects.map((project, i) => (
        <Reveal
          as="li"
          key={project.slug}
          delay={i * 80}
          className="group relative border-line border-t last-of-type:border-b"
        >
          <article
            data-testid={`project-${project.slug}`}
            onPointerEnter={() => setActive(project.slug)}
            className="flex items-center gap-5 py-6 md:gap-8 md:py-8"
          >
            <div className="min-w-0 flex-1">
              <h3 className="condensed text-4xl uppercase transition-colors group-hover:text-accent md:text-6xl">
                <a
                  href={project.liveUrl ?? project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="after:absolute after:inset-0"
                >
                  {project.title}
                  <span className="sr-only"> (opens in new tab)</span>
                </a>
              </h3>
              <p className="mt-1 text-base text-muted md:hidden">{project.summary}</p>
              {project.image && (
                <div className="relative mt-4 touch-device:block hidden aspect-video overflow-hidden rounded-lg ring-1 ring-line">
                  <Image
                    src={project.image.src}
                    alt={project.image.alt}
                    fill
                    sizes="(max-width: 640px) 100vw, 640px"
                    className="object-cover object-top"
                  />
                </div>
              )}
            </div>
            <span className="hidden font-mono text-[13px] text-muted md:block">
              {project.stack.join(" · ")}
            </span>
            <span className="relative z-10 flex shrink-0 items-center gap-4">
              {project.sourceUrl && (
                <a
                  href={project.sourceUrl}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`Source code for ${project.title}`}
                  className="text-faint transition-colors hover:text-fg"
                >
                  <GitHubIcon className="size-5" />
                </a>
              )}
              <ArrowUpRight
                aria-hidden
                className="size-6 text-faint transition-all duration-500 group-hover:rotate-45 group-hover:text-accent"
              />
            </span>
          </article>
        </Reveal>
      ))}

      <div
        ref={follow.ref}
        aria-hidden
        className="pointer-events-none absolute top-0 left-0 z-20 hidden hover-device:block"
      >
        <div
          data-active={active !== null}
          className="relative aspect-video w-80 -translate-x-1/2 -translate-y-[115%] -rotate-4 scale-85 overflow-hidden rounded-lg opacity-0 shadow-2xl shadow-black/60 ring-1 ring-line-strong transition-[opacity,scale,rotate] duration-300 ease-[var(--ease-out-expo)] data-[active=true]:-rotate-2 data-[active=true]:scale-100 data-[active=true]:opacity-100"
        >
          {projects.map(
            (p) =>
              p.image && (
                <Image
                  key={p.slug}
                  src={p.image.src}
                  alt=""
                  fill
                  sizes="320px"
                  className={`object-cover object-top transition-opacity duration-300 ${
                    p.slug === active ? "opacity-100" : "opacity-0"
                  }`}
                />
              ),
          )}
        </div>
      </div>
    </ul>
  );
}
