"use client";

import { useSyncExternalStore } from "react";
import { soundStore } from "@/lib/sound-store";

/**
 * Toggles the generative ambient soundtrack. Off by default: browsers block
 * autoplay, and nobody likes surprise audio. `withLabel` adds visible text.
 */
export function SoundToggle({ withLabel = false }: { withLabel?: boolean }) {
  const on = useSyncExternalStore(
    soundStore.subscribe,
    soundStore.getSnapshot,
    soundStore.getServerSnapshot,
  );

  return (
    <button
      type="button"
      onClick={soundStore.toggle}
      aria-pressed={on}
      aria-label={on ? "Mute ambient sound" : "Play ambient sound"}
      title={on ? "Mute" : "Ambient sound"}
      className={`group flex h-10 items-center justify-center gap-2.5 rounded-full text-muted transition-colors hover:bg-fg/10 hover:text-fg ${
        withLabel ? "px-3" : "w-10"
      }`}
    >
      <span className="flex h-3.5 items-end gap-[3px]" aria-hidden>
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-full w-[2px] origin-bottom rounded-full bg-current transition-transform duration-500 ${
              on ? "animate-eq text-accent" : "scale-y-[0.3]"
            }`}
            style={{ animationDelay: `${i * -0.27}s` }}
          />
        ))}
      </span>
      {withLabel && (
        <span aria-hidden className="font-mono text-[13px]">
          {on ? "Sound on" : "Sound off"}
        </span>
      )}
    </button>
  );
}
