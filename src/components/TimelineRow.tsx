import { Reveal } from "./Reveal";

type TimelineRowProps = {
  period: string;
  title: string;
  subtitle: string;
  lines: string[];
  delay?: number;
};

/** One row of the Career / Education timelines. */
export function TimelineRow({ period, title, subtitle, lines, delay }: TimelineRowProps) {
  return (
    <Reveal
      as="li"
      delay={delay}
      className="group relative grid gap-4 py-10 md:grid-cols-[11rem_1fr_1fr] md:gap-10 md:py-14"
    >
      <span className="draw-line absolute inset-x-0 top-0 h-px bg-line" aria-hidden />
      <p className="font-mono text-[13px] text-accent">{period}</p>
      <div>
        <h3 className="condensed text-4xl uppercase leading-[0.95] transition-colors duration-500 group-hover:text-accent md:text-5xl">
          {title}
        </h3>
        <p className="mt-3 text-lg text-muted">{subtitle}</p>
      </div>
      <ul className="space-y-2.5 text-lg text-muted leading-snug transition-colors duration-500 group-hover:text-fg">
        {lines.map((line) => (
          <li key={line} className="flex gap-3">
            <span className="mt-[0.7em] h-px w-3 shrink-0 bg-faint" aria-hidden />
            {line}
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
