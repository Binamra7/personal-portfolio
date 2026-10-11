import { career, education } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

export function Career() {
  return (
    <section
      aria-label="Career"
      id="career"
      className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40"
    >
      <SectionLabel index="02" label="Career" aside="2022 — Now" />

      <ol>
        {career.map((role, i) => (
          <Reveal
            as="li"
            key={`${role.company}-${role.title}`}
            delay={i * 80}
            className="group relative grid gap-4 py-10 md:grid-cols-[11rem_1fr_1fr] md:gap-10 md:py-14"
          >
            <span className="draw-line absolute inset-x-0 top-0 h-px bg-line" aria-hidden />
            <p className="font-mono text-[13px] text-accent">{role.period}</p>
            <div>
              <h3 className="stretchy font-bold text-4xl uppercase leading-[0.95] md:text-5xl">
                {role.title}
              </h3>
              <p className="mt-3 text-lg text-muted">
                {role.company} <span className="text-faint">·</span> {role.place}
              </p>
            </div>
            <ul className="space-y-2.5 text-lg text-muted leading-snug">
              {role.highlights.map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-[0.7em] h-px w-3 shrink-0 bg-faint" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}

        <Reveal
          as="li"
          className="relative grid gap-4 py-10 md:grid-cols-[11rem_1fr_1fr] md:gap-10 md:py-14"
        >
          <span className="draw-line absolute inset-x-0 top-0 h-px bg-line" aria-hidden />
          <p className="font-mono text-[13px] text-faint">{education.period}</p>
          <div>
            <h3 className="condensed text-3xl text-muted uppercase md:text-4xl">
              {education.title}
            </h3>
            <p className="mt-2 text-faint text-lg">{education.school}</p>
          </div>
        </Reveal>
      </ol>
    </section>
  );
}
