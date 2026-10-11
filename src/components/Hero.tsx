import { heroIntro, heroLines, profile, stats } from "@/content/site";
import { CountUp } from "./CountUp";
import { ArrowDown, ArrowUpRight } from "./icons";
import { HeroHeadline } from "./scroll/HeroHeadline";
import { TopBar } from "./TopBar";

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col justify-end overflow-x-clip pt-32 pb-32 md:pb-36"
    >
      <TopBar />

      {/* Warm glow behind the headline. Static on purpose. */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 size-[60rem] translate-x-1/3 -translate-y-1/3 rounded-full opacity-70 blur-3xl"
        style={{
          background: "radial-gradient(closest-side, rgb(244 167 59 / 0.12), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-7xl px-5 md:px-10">
        <p className="mb-6 flex animate-fade-up items-center gap-3 font-mono text-[13px] text-muted [animation-delay:100ms] md:mb-10">
          <span className="h-px w-10 bg-accent" aria-hidden />
          {profile.name} — {profile.role}
        </p>

        <HeroHeadline lines={heroLines} srPrefix={`${profile.name}: `} />

        <div className="mt-12 grid gap-12 md:mt-16 lg:grid-cols-[1fr_1.25fr] lg:items-end">
          <div className="animate-fade-up [animation-delay:700ms]">
            <p className="max-w-md text-muted text-xl leading-snug md:text-2xl">{heroIntro}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-6 py-3.5 font-medium text-base text-bg transition-colors hover:bg-accent"
              >
                See the work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-6 py-3.5 text-base transition-colors hover:border-fg"
                >
                  Résumé
                  <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              )}
            </div>
          </div>

          <dl className="grid animate-fade-up grid-cols-2 gap-x-6 gap-y-8 [animation-delay:850ms]">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col-reverse border-line border-t pt-4">
                <dt className="mt-2 font-mono text-[13px] text-muted leading-relaxed">
                  {stat.label}
                </dt>
                <dd className="condensed text-5xl md:text-6xl">
                  <CountUp {...stat} />
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
