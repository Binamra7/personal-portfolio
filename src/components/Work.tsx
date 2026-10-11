import { archiveProjects, featuredProjects, type Project } from "@/content/site";
import { ArchiveList } from "./ArchiveList";
import { LensImage } from "./LensImage";
import { ProjectLinks } from "./ProjectLinks";
import { RagTerminal } from "./RagTerminal";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { ScrollFillText } from "./scroll/ScrollFillText";

function FeaturedProject({ project, index }: { project: Project; index: number }) {
  return (
    <article
      aria-labelledby={`${project.slug}-title`}
      data-testid={`project-${project.slug}`}
      className="mb-28 last:mb-0 md:mb-40"
    >
      <Reveal className="mb-4 flex items-end justify-between gap-6 font-mono text-[13px] text-muted">
        <span className="text-accent">{String(index + 1).padStart(2, "0")}</span>
        <span className="hidden text-right sm:block">{project.stack.join(" · ")}</span>
      </Reveal>

      <Reveal>
        <h3
          id={`${project.slug}-title`}
          className="condensed mb-6 text-[clamp(3rem,11vw,10rem)] uppercase leading-[0.85] md:mb-8"
        >
          <ScrollFillText>{project.title}</ScrollFillText>
        </h3>
      </Reveal>

      {project.image ? (
        <LensImage src={project.image.src} alt={project.image.alt} />
      ) : (
        project.visual === "rag-terminal" && <RagTerminal />
      )}

      <Reveal className="mt-8 grid gap-6 md:grid-cols-[1fr_auto] md:items-center">
        <p className="max-w-xl text-xl leading-snug md:text-2xl">{project.summary}</p>
        <ProjectLinks project={project} />
      </Reveal>
      <p className="mt-4 font-mono text-[13px] text-muted sm:hidden">{project.stack.join(" · ")}</p>
    </article>
  );
}

export function Work() {
  return (
    <section aria-label="Work" id="work" className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40">
      <SectionLabel
        index="01"
        label="Selected work"
        aside={`${featuredProjects.length} projects`}
      />
      {featuredProjects.map((project, index) => (
        <FeaturedProject key={project.slug} project={project} index={index} />
      ))}

      <div className="mt-32 md:mt-44">
        <SectionLabel
          index="01.b"
          label="Earlier work"
          aside={`${archiveProjects.length} projects`}
        />
        <ArchiveList projects={archiveProjects} />
      </div>
    </section>
  );
}
