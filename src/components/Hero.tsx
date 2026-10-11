import type { CSSProperties, ReactNode } from "react";
import { profile, socials } from "@/content/site";
import { ArrowDown, ArrowUpRight, socialIcons } from "./icons";

/** A line of text that slides up from behind a mask on page load. */
function RiseLine({ children, delay }: { children: ReactNode; delay: number }) {
  return (
    <span className="block overflow-hidden pb-[0.08em]">
      <span
        className="block animate-rise"
        style={{ animationDelay: `${delay}ms` } as CSSProperties}
      >
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  return (
    <section
      id="top"
      aria-label="Introduction"
      className="relative flex min-h-svh flex-col justify-end overflow-hidden pt-28 pb-12 md:pb-16"
    >
      {/* Warm glow, top-left. Static on purpose. */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-1/3 -left-1/4 size-[70rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(242 165 65 / 0.13), transparent)",
        }}
      />

      <div className="relative mx-auto w-full max-w-6xl px-5 md:px-8">
        <p className="mb-8 flex items-center gap-3 font-mono text-xs tracking-widest text-muted uppercase">
          <span className="inline-block h-px w-8 bg-accent" aria-hidden />
          <RiseLine delay={0}>
            {profile.role} · {profile.location}
          </RiseLine>
        </p>

        <h1 className="text-[clamp(3.5rem,13vw,10.5rem)] leading-[0.88] font-medium tracking-[-0.045em]">
          <RiseLine delay={120}>{profile.firstName}</RiseLine>
          <RiseLine delay={220}>
            <span className="text-muted">
              {profile.name.split(" ").slice(1).join(" ")}
            </span>
            <span className="text-accent">.</span>
          </RiseLine>
        </h1>

        <div className="mt-10 grid gap-10 md:mt-14 md:grid-cols-[1fr_auto] md:items-end">
          <div className="max-w-md">
            <p className="text-xl tracking-tight md:text-2xl">
              <RiseLine delay={380}>{profile.headline}</RiseLine>
            </p>
            <p className="mt-2 text-base text-muted md:text-lg">
              <RiseLine delay={460}>{profile.intro}</RiseLine>
            </p>

            <div className="mt-8 flex animate-rise flex-wrap gap-3 [animation-delay:560ms]">
              <a
                href="#work"
                className="group inline-flex items-center gap-2 rounded-full bg-fg px-5 py-3 text-sm font-medium text-bg transition-colors hover:bg-accent"
              >
                See my work
                <ArrowDown className="size-4 transition-transform group-hover:translate-y-0.5" />
              </a>
              <a
                href="#contact"
                className="group inline-flex items-center gap-2 rounded-full border border-line-strong px-5 py-3 text-sm transition-colors hover:border-fg"
              >
                Get in touch
                <ArrowUpRight className="size-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
              {profile.resumeUrl && (
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center px-2 py-3 text-sm text-muted underline-offset-4 transition-colors hover:text-fg hover:underline"
                >
                  Résumé
                </a>
              )}
            </div>
          </div>

          <ul
            className="flex animate-rise gap-2 [animation-delay:640ms]"
            aria-label="Social links"
          >
            {socials.map(({ label, href, icon }) => {
              const Icon = socialIcons[icon];
              return (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    aria-label={label}
                    className="grid size-11 place-items-center rounded-full border border-line text-muted transition-colors hover:border-line-strong hover:text-fg"
                  >
                    <Icon className="size-[18px]" />
                  </a>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
