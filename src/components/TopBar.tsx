import { profile } from "@/content/site";
import { LocalClock } from "./LocalClock";
import { SoundToggle } from "./SoundToggle";

/** Sits on top of the hero only (not fixed). Navigation lives in the Dock. */
export function TopBar() {
  return (
    <div className="absolute inset-x-0 top-0 z-10">
      <div className="mx-auto flex max-w-7xl animate-fade-up items-center justify-between px-5 py-6 font-mono text-[13px] text-muted md:px-10">
        <a
          href="#top"
          aria-label={`${profile.name}, back to top`}
          className="condensed text-3xl text-fg lowercase transition-colors hover:text-accent"
        >
          {profile.initials}
          <span className="text-accent">.</span>
        </a>
        <div className="flex items-center gap-4 md:gap-6">
          <p className="hidden items-center gap-2 sm:flex">
            <span className="relative flex size-2" aria-hidden>
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60" />
              <span className="relative inline-flex size-2 rounded-full bg-accent" />
            </span>
            <span>{profile.city}</span>
            <LocalClock timeZone={profile.timeZone} />
          </p>
          <SoundToggle withLabel />
        </div>
      </div>
    </div>
  );
}
