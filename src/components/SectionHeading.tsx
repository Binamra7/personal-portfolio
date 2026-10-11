import { Reveal } from "./Reveal";

type SectionHeadingProps = {
  index: string;
  label: string;
  title: string;
  id: string;
};

/** Numbered section label + heading, e.g. "01 — Work". */
export function SectionHeading({
  index,
  label,
  title,
  id,
}: SectionHeadingProps) {
  return (
    <Reveal className="mb-12 md:mb-16">
      <p className="mb-4 font-mono text-xs tracking-widest text-faint uppercase">
        <span className="text-accent">{index}</span> — {label}
      </p>
      <h2
        id={id}
        className="max-w-2xl text-3xl font-medium tracking-tight text-balance md:text-5xl"
      >
        {title}
      </h2>
    </Reveal>
  );
}
