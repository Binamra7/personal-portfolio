import Image from "next/image";
import type { Project } from "@/content/site";

/** Text for the fake address bar: the live host, or the repo path. */
function addressFor(project: Project) {
  const { hostname, pathname } = new URL(project.liveUrl ?? project.sourceUrl);
  return project.liveUrl ? hostname : `${hostname}${pathname}`;
}

/**
 * A screenshot inside a minimal browser frame.
 *
 * The screenshots are old, bright and inconsistent in size, so the frame does
 * the work: a fixed aspect ratio with top-anchored cropping (16:9, the shape of most screenshots), a desaturated
 * dimmed image (see `.shot-img` in globals.css), a warm tint and a fade into
 * the page background. Hovering the parent `.group` brings back full colour.
 */
export function ProjectShot({
  project,
  priority = false,
}: {
  project: Project;
  priority?: boolean;
}) {
  return (
    <div className="relative overflow-hidden rounded-xl border border-line bg-surface transition-colors duration-500 group-hover:border-line-strong">
      <div className="flex h-8 items-center gap-3 border-b border-line bg-raised/60 px-3">
        <span className="flex gap-1.5" aria-hidden>
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
          <span className="size-2 rounded-full bg-line-strong" />
        </span>
        <span className="truncate font-mono text-[11px] text-faint">
          {addressFor(project)}
        </span>
      </div>

      <div className="relative aspect-video overflow-hidden">
        <Image
          src={project.image}
          alt={project.imageAlt}
          fill
          priority={priority}
          sizes="(min-width: 1024px) 640px, 100vw"
          className="shot-img object-cover object-top"
        />
        {/* Warm tint that fades out on hover. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 bg-accent/10 mix-blend-color transition-opacity duration-700 group-hover:opacity-0"
        />
        {/* Fade the bottom of the screenshot into the frame. */}
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-surface to-transparent"
        />
      </div>
    </div>
  );
}
