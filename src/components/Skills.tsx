import { skills } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Skills() {
  return (
    <section
      aria-labelledby="skills-title"
      id="skills"
      className="border-t border-line"
    >
      <div className="mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-36">
        <SectionHeading
          id="skills-title"
          index="03"
          label="Skills"
          title="What I work with"
        />

        <dl className="grid gap-x-10 sm:grid-cols-2">
          {skills.map((group, i) => (
            <Reveal
              key={group.label}
              delay={i * 60}
              className="border-t border-line py-6"
            >
              <dt className="mb-3 font-mono text-xs tracking-widest text-faint uppercase">
                {group.label}
              </dt>
              <dd className="text-xl tracking-tight md:text-2xl">
                {group.items.map((item, j) => (
                  <span key={item}>
                    {item}
                    {j < group.items.length - 1 && (
                      <span className="mx-2.5 text-faint" aria-hidden>
                        /
                      </span>
                    )}
                  </span>
                ))}
              </dd>
            </Reveal>
          ))}
        </dl>
      </div>
    </section>
  );
}
