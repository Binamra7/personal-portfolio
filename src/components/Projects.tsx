import { projects, type Project } from "@/content/site";
import { ArrowUpRight, GitHubIcon } from "./icons";
import { ProjectShot } from "./ProjectShot";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

function ProjectRow({ project, index }: { project: Project; index: number }) {
  const primaryUrl = project.liveUrl ?? project.sourceUrl;
  const number = String(index + 1).padStart(2, "0");

  return (
    <Reveal
      as="li"
      className="border-t border-line py-10 first:border-t-0 first:pt-0 md:py-14"
    >
      <article
        aria-labelledby={`${project.slug}-title`}
        data-testid={`project-${project.slug}`}
        className="group grid gap-8 lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-14"
      >
        <div className="order-2 lg:order-1">
          <p className="mb-4 font-mono text-xs text-faint">{number}</p>
          <h3
            id={`${project.slug}-title`}
            className="text-2xl font-medium tracking-tight md:text-3xl"
          >
            {project.title}
          </h3>
          <p className="mt-3 max-w-sm text-muted">{project.summary}</p>

          <ul
            className="mt-6 flex flex-wrap gap-2"
            aria-label={`${project.title} tech stack`}
          >
            {project.stack.map((tech) => (
              <li
                key={tech}
                className="rounded-full border border-line px-3 py-1 font-mono text-[11px] text-muted"
              >
                {tech}
              </li>
            ))}
          </ul>

          <div className="mt-8 flex gap-6 text-sm">
            {project.liveUrl && (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noreferrer"
                className="group/link inline-flex items-center gap-1.5 transition-colors hover:text-accent"
              >
                Live demo
                <ArrowUpRight className="size-4 transition-transform group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5" />
                <span className="sr-only">
                  for {project.title} (opens in new tab)
                </span>
              </a>
            )}
            <a
              href={project.sourceUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-muted transition-colors hover:text-fg"
            >
              <GitHubIcon className="size-4" />
              Source
              <span className="sr-only">
                code for {project.title} (opens in new tab)
              </span>
            </a>
          </div>
        </div>

        <a
          href={primaryUrl}
          target="_blank"
          rel="noreferrer"
          tabIndex={-1}
          aria-hidden
          className="order-1 block lg:order-2"
        >
          <ProjectShot project={project} priority={index === 0} />
        </a>
      </article>
    </Reveal>
  );
}

export function Projects() {
  return (
    <section
      aria-labelledby="work-title"
      id="work"
      className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36"
    >
      <SectionHeading
        id="work-title"
        index="01"
        label="Work"
        title="Selected projects"
      />
      <ol>
        {projects.map((project, index) => (
          <ProjectRow key={project.slug} project={project} index={index} />
        ))}
      </ol>
    </section>
  );
}
