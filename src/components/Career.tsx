import { career } from "@/content/site";
import { SectionLabel } from "./SectionLabel";
import { ScrollProgressLine } from "./scroll/ScrollProgressLine";
import { TimelineRow } from "./TimelineRow";

export function Career() {
  return (
    <section
      aria-label="Career"
      id="career"
      className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40"
    >
      <SectionLabel index="02" label="Career" aside="2022 — Now" />
      <ol className="relative pl-6 md:pl-10">
        <ScrollProgressLine className="left-0" />
        {career.map((role, i) => (
          <TimelineRow
            key={`${role.company}-${role.title}`}
            period={role.period}
            title={role.title}
            subtitle={`${role.company} · ${role.place}`}
            lines={role.highlights}
            delay={i * 80}
          />
        ))}
      </ol>
    </section>
  );
}
