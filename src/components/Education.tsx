import { education } from "@/content/site";
import { SectionLabel } from "./SectionLabel";
import { TimelineRow } from "./TimelineRow";

export function Education() {
  return (
    <section
      aria-label="Education"
      id="education"
      className="mx-auto max-w-7xl px-5 py-28 md:px-10 md:py-40"
    >
      <SectionLabel index="03" label="Education" />
      <ol className="pl-6 md:pl-10">
        {education.map((entry) => (
          <TimelineRow
            key={entry.degree}
            period={entry.period}
            title={entry.degree}
            subtitle={entry.field}
            lines={[entry.school, `${entry.university}, ${entry.place}`]}
          />
        ))}
      </ol>
    </section>
  );
}
