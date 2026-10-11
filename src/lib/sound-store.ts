import { AmbientEngine } from "./ambient";

/**
 * One shared ambient engine for the whole page, so every sound toggle
 * (top bar, dock) controls and reflects the same state.
 */
let engine: AmbientEngine | null = null;
let on = false;
const listeners = new Set<() => void>();

function emit() {
  for (const listener of listeners) listener();
}

function onVisibility() {
  if (!engine || !on) return;
  if (document.hidden) engine.stop();
  else void engine.start();
}

export const soundStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: () => on,
  getServerSnapshot: () => false,
  /** Must be called from a user gesture (browsers block autoplay). */
  toggle() {
    if (typeof AudioContext === "undefined") return;
    if (!engine) {
      engine = new AmbientEngine();
      // Pause while the tab is hidden; resume when it comes back.
      document.addEventListener("visibilitychange", onVisibility);
    }
    on = !on;
    if (on) void engine.start();
    else engine.stop();
    emit();
  },
};
