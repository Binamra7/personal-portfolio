import type { Project } from "@/content/site";
import { ArrowUpRight, GitHubIcon } from "./icons";

export function ProjectLinks({ project }: { project: Project }) {
  return (
    <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-base">
      {project.liveUrl && (
        <a
          href={project.liveUrl}
          target="_blank"
          rel="noreferrer"
          className="group/link inline-flex items-center gap-1.5 text-fg transition-colors hover:text-accent"
        >
          Live demo
          <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
          <span className="sr-only">of {project.title} (opens in new tab)</span>
        </a>
      )}
      {project.sourceUrl ? (
        <a
          href={project.sourceUrl}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
        >
          <GitHubIcon className="size-4" />
          Source
          <span className="sr-only">code for {project.title} (opens in new tab)</span>
        </a>
      ) : (
        <span className="font-mono text-[13px] text-faint">Private code</span>
      )}
    </div>
  );
}
