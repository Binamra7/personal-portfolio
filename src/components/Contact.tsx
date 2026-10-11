import { profile, socials } from "@/content/site";
import { CopyEmailButton } from "./CopyEmailButton";
import { ArrowUpRight, socialIcons } from "./icons";
import { Reveal } from "./Reveal";

export function Contact() {
  return (
    <section
      aria-labelledby="contact-title"
      id="contact"
      className="relative overflow-hidden border-t border-line"
    >
      <div
        aria-hidden
        className="pointer-events-none absolute -right-1/4 -bottom-1/2 size-[60rem] rounded-full opacity-60 blur-3xl"
        style={{
          background:
            "radial-gradient(closest-side, rgb(242 165 65 / 0.10), transparent)",
        }}
      />

      <div className="relative mx-auto max-w-6xl px-5 py-24 md:px-8 md:py-40">
        <Reveal>
          <p className="mb-4 font-mono text-xs tracking-widest text-faint uppercase">
            <span className="text-accent">04</span> — Contact
          </p>
          <h2
            id="contact-title"
            className="text-[clamp(2.5rem,8vw,6rem)] leading-[0.95] font-medium tracking-[-0.04em]"
          >
            Let&rsquo;s build
            <br />
            <span className="text-muted">something.</span>
          </h2>
        </Reveal>

        <Reveal delay={120} className="mt-12">
          <a
            href={`mailto:${profile.email}`}
            className="group inline-flex items-center gap-3 text-xl tracking-tight break-all transition-colors hover:text-accent md:text-3xl"
          >
            {profile.email}
            <ArrowUpRight className="size-6 shrink-0 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <CopyEmailButton email={profile.email} />
            <a
              href={profile.phone.href}
              className="px-2 py-2 text-sm text-muted transition-colors hover:text-fg"
            >
              {profile.phone.display}
            </a>
          </div>
        </Reveal>

        <Reveal delay={200} className="mt-16">
          <ul
            className="flex flex-wrap gap-x-8 gap-y-3"
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
                    className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-fg"
                  >
                    <Icon className="size-4" />
                    {label}
                  </a>
                </li>
              );
            })}
          </ul>
        </Reveal>
      </div>
    </section>
  );
}
