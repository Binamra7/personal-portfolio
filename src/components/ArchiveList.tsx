"use client";

import { AnimatePresence, motion, useMotionValue, useSpring } from "motion/react";
import Image from "next/image";
import { type PointerEvent, useState } from "react";
import type { Project } from "@/content/site";
import { ArrowUpRight, GitHubIcon } from "./icons";
import { Reveal } from "./Reveal";

/**
 * Older projects as big typographic rows. On desktop, hovering a row shows a
 * small screenshot preview that trails the cursor on a spring.
 */
export function ArchiveList({ projects }: { projects: Project[] }) {
  const [active, setActive] = useState<number | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const springX = useSpring(x, { stiffness: 260, damping: 28, mass: 0.6 });
  const springY = useSpring(y, { stiffness: 260, damping: 28, mass: 0.6 });

  function track(event: PointerEvent<HTMLUListElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set(event.clientX - rect.left);
    y.set(event.clientY - rect.top);
  }

  const activeProject = active === null ? null : projects[active];

  return (
    <ul
      className="relative"
      onPointerMove={track}
      onPointerLeave={() => setActive(null)}
      aria-label="Earlier projects"
    >
      {projects.map((project, i) => (
        <Reveal
          as="li"
          key={project.slug}
          delay={i * 80}
          className="group relative border-line border-t last:border-b"
        >
          <article
            data-testid={`project-${project.slug}`}
            onPointerEnter={() => setActive(i)}
            className="flex items-center gap-5 py-6 md:gap-8 md:py-8"
          >
            <span className="w-11 shrink-0 font-mono text-[13px] text-faint md:w-16">
              {project.year}
            </span>
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

      <AnimatePresence>
        {activeProject?.image && (
          <motion.div
            key="preview"
            aria-hidden
            className="pointer-events-none absolute top-0 left-0 z-20 hidden w-80 [@media(hover:hover)]:md:block"
            style={{
              x: springX,
              y: springY,
              translateX: "-50%",
              translateY: "-115%",
            }}
            initial={{ opacity: 0, scale: 0.85, rotate: -4 }}
            animate={{ opacity: 1, scale: 1, rotate: -2 }}
            exit={{ opacity: 0, scale: 0.85, rotate: 2 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          >
            <div className="relative aspect-video overflow-hidden rounded-lg shadow-2xl shadow-black/60 ring-1 ring-line-strong">
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
                        p.slug === activeProject.slug ? "opacity-100" : "opacity-0"
                      }`}
                    />
                  ),
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </ul>
  );
}
