import { profile, socials } from "@/content/site";
import { CopyEmailButton } from "./CopyEmailButton";
import { Glow } from "./Glow";
import { ArrowUpRight, socialIcons } from "./icons";
import { Reveal } from "./Reveal";
import { SectionLabel } from "./SectionLabel";
import { StretchText } from "./StretchText";
import { ScaleIn } from "./scroll/ScaleIn";

export function Contact() {
  return (
    <section
      aria-labelledby="contact-title"
      id="contact"
      className="relative overflow-x-clip pt-28 pb-16 md:pt-40"
    >
      <Glow className="bottom-0 left-1/2 size-[70rem] -translate-x-1/2 translate-y-1/2" />

      <div className="relative mx-auto max-w-7xl px-5 md:px-10">
        <SectionLabel index="05" label="Contact" aside={`${profile.city}, ${profile.country}`} />

        <Reveal>
          <ScaleIn>
            <h2
              id="contact-title"
              className="font-bold font-display text-[clamp(3.25rem,14.5vw,15rem)] uppercase leading-[0.8]"
            >
              <StretchText>
                Let&rsquo;s talk<span className="text-accent">.</span>
              </StretchText>
            </h2>
          </ScaleIn>
        </Reveal>

        <Reveal delay={120} className="mt-14 grid gap-10 md:grid-cols-[1fr_auto] md:items-end">
          <div>
            <a
              href={`mailto:${profile.email}`}
              className="group inline-flex items-center gap-3 break-all text-2xl transition-colors hover:text-accent md:text-4xl"
            >
              {profile.email}
              <ArrowUpRight className="size-7 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
            </a>
            <div className="mt-6 flex flex-wrap items-center gap-3">
              <CopyEmailButton email={profile.email} />
              <a
                href={profile.phone.href}
                className="px-2 py-2 font-mono text-[13px] text-muted transition-colors hover:text-fg"
              >
                {profile.phone.display}
              </a>
            </div>
          </div>

          <ul className="flex flex-wrap gap-x-8 gap-y-3" aria-label="Elsewhere">
            {socials.map(({ label, href, icon }) => {
              const Icon = socialIcons[icon];
              return (
                <li key={label}>
                  <a
                    href={href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 text-lg text-muted transition-colors hover:text-fg"
                  >
                    <Icon className="size-5" />
                    {label}
                  </a>
                </li>
              );
            })}
            {profile.resumeUrl && (
              <li>
                <a
                  href={profile.resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 text-lg text-muted transition-colors hover:text-fg"
                >
                  Résumé <ArrowUpRight className="size-4" />
                </a>
              </li>
            )}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
