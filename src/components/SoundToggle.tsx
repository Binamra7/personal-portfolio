"use client";

import { useEffect, useSyncExternalStore } from "react";
import { soundStore } from "@/lib/sound-store";

/**
 * Toggles the ambient soundtrack. On by default, but "armed" ("Tap for sound")
 * until the first click/tap/key, because browsers block autoplay.
 * `withLabel` adds visible text.
 */
export function SoundToggle({ withLabel = false }: { withLabel?: boolean }) {
  const state = useSyncExternalStore(
    soundStore.subscribe,
    soundStore.getSnapshot,
    soundStore.getServerSnapshot,
  );
  useEffect(() => soundStore.init(), []);

  const playing = state === "playing";
  const label = { armed: "Tap for sound", playing: "Sound on", off: "Sound off" }[state];

  return (
    <button
      type="button"
      data-sound-toggle
      data-state={state}
      onClick={soundStore.toggle}
      aria-pressed={playing}
      aria-label={playing ? "Mute ambient sound" : "Play ambient sound"}
      title={playing ? "Mute" : "Play ambient sound"}
      className={`group flex h-10 items-center justify-center gap-2.5 rounded-full text-muted transition-colors hover:bg-fg/10 hover:text-fg ${
        withLabel ? "px-3" : "w-10"
      }`}
    >
      <span
        className={`flex h-3.5 items-end gap-[3px] ${state === "off" ? "" : "text-accent"}`}
        aria-hidden
      >
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-full w-[2px] origin-bottom rounded-full bg-current transition-transform duration-500 ${
              playing ? "animate-eq" : state === "armed" ? "scale-y-[0.55]" : "scale-y-[0.3]"
            }`}
            style={{ animationDelay: `${i * -0.27}s` }}
          />
        ))}
      </span>
      {withLabel && (
        <span aria-hidden className="font-mono text-[13px]">
          {label}
        </span>
      )}
    </button>
  );
}
