import { toolkit } from "@/content/site";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";

/**
 * The toolkit as one flowing block of big type. Hovering a tool dims the rest.
 */
export function Stack() {
  return (
    <section
      aria-label="Stack"
      id="stack"
      className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40"
    >
      <SectionLabel index="03" label="Stack" aside="Daily drivers" />

      <div className="group/stack space-y-6 md:space-y-4">
        {toolkit.map((group, i) => (
          <Reveal key={group.label} delay={i * 70}>
            <h3 className="mb-1 font-mono text-[13px] text-faint uppercase tracking-widest md:sr-only">
              {group.label}
            </h3>
            <div className="md:grid md:grid-cols-[11rem_1fr] md:items-center md:gap-8">
              <span
                aria-hidden
                className="hidden font-mono text-[13px] text-faint tracking-widest md:block"
              >
                {group.label}
              </span>
              <p className="condensed flex flex-wrap gap-x-5 text-[clamp(2.4rem,5.6vw,5.25rem)] uppercase leading-[1.02] md:gap-x-7">
                {group.items.map((item) => (
                  <span
                    key={item}
                    className="hover:!opacity-100 transition-[opacity,color] duration-300 hover:text-accent group-hover/stack:opacity-25"
                  >
                    {item}
                  </span>
                ))}
              </p>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
