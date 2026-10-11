import { about } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function About() {
  return (
    <section
      aria-labelledby="about-title"
      id="about"
      className="border-t border-line"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
        <SectionHeading
          id="about-title"
          index="02"
          label="About"
          title="A bit about me"
        />

        <div className="grid gap-14 md:grid-cols-2 md:gap-20">
          <div className="space-y-4">
            {about.lines.map((line, i) => (
              <Reveal key={line} delay={i * 80}>
                <p className="text-lg text-muted md:text-xl">{line}</p>
              </Reveal>
            ))}
          </div>

          <ol aria-label="Milestones">
            {about.milestones.map((m, i) => (
              <Reveal
                as="li"
                key={m.year}
                delay={i * 80}
                className="flex items-baseline gap-6 border-t border-line py-5 last:border-b"
              >
                <span className="font-mono text-sm text-accent">{m.year}</span>
                <span>{m.text}</span>
              </Reveal>
            ))}
          </ol>
        </div>
      </div>
    </section>
  );
}
