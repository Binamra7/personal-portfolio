import { profile } from "@/content/site";
import { LocalClock } from "./LocalClock";

export function SiteFooter() {
  return (
    <footer className="mx-auto max-w-7xl px-5 pb-28 md:px-10">
      <div className="flex flex-col gap-2 border-line border-t pt-6 font-mono text-[13px] text-faint sm:flex-row sm:justify-between">
        <p>
          © {new Date().getFullYear()} {profile.name}
        </p>
        <p>
          {profile.city}, {profile.country} · <LocalClock timeZone={profile.timeZone} />
        </p>
      </div>
    </footer>
  );
}
