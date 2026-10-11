import { education } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

/** Same row layout as Career, so the two read as one timeline. */
export function Education() {
  return (
    <section
      aria-label="Education"
      id="education"
      className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40"
    >
      <SectionLabel index="03" label="Education" aside={education[0]?.period} />

      <ol className="pl-6 md:pl-10">
        {education.map((entry) => (
          <Reveal
            as="li"
            key={entry.degree}
            className="group relative grid gap-4 py-10 md:grid-cols-[11rem_1fr_1fr] md:gap-10 md:py-14"
          >
            <span className="draw-line absolute inset-x-0 top-0 h-px bg-line" aria-hidden />
            <p className="font-mono text-[13px] text-accent">{entry.period}</p>
            <div>
              <h3 className="condensed text-4xl uppercase leading-[0.95] transition-colors duration-500 group-hover:text-accent md:text-5xl">
                {entry.degree}
              </h3>
              <p className="mt-3 text-lg text-muted">{entry.field}</p>
            </div>
            <ul className="space-y-2.5 text-lg text-muted leading-snug transition-colors duration-500 group-hover:text-fg">
              {[entry.school, `${entry.university}, ${entry.place}`].map((line) => (
                <li key={line} className="flex gap-3">
                  <span className="mt-[0.7em] h-px w-3 shrink-0 bg-faint" aria-hidden />
                  {line}
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </ol>
    </section>
  );
}
