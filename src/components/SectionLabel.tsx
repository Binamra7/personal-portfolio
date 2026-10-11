import { Reveal } from "./Reveal";

type SectionLabelProps = {
  index: string;
  label: string;
  /** Right-aligned note, e.g. a count or date range. */
  aside?: string;
};

/** Mono label row with a hairline that draws itself in: `01  Work ———— 2021–2025`. */
export function SectionLabel({ index, label, aside }: SectionLabelProps) {
  return (
    <Reveal className="mb-10 md:mb-14">
      <div className="flex items-center gap-4 font-mono text-[13px] text-muted">
        <span className="text-accent">{index}</span>
        <h2 className="uppercase tracking-widest">{label}</h2>
        <span className="draw-line h-px flex-1 bg-line-strong" aria-hidden />
        {aside && <span>{aside}</span>}
      </div>
    </Reveal>
  );
}
