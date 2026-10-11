import type { AmbientEngine } from "./ambient";

/**
 * Shared state for the ambient soundtrack, used by every sound toggle.
 *
 * Sound is ON by default, but browsers only allow audio after a user gesture
 * (click, tap or key press; scrolling doesn't count). So the default state is
 * "armed": the soundtrack starts on the visitor's first interaction. A mute
 * is remembered in localStorage.
 *
 * Performance: the synth code (`./ambient`) is a separate chunk, prefetched
 * when the browser is idle after load and never on the critical path. The
 * AudioContext itself is created synchronously inside the gesture so every
 * browser treats it as user-initiated.
 */
export type SoundState = "off" | "armed" | "playing";

const STORAGE_KEY = "sound";
const GESTURES = ["pointerdown", "keydown", "touchend"] as const;

let state: SoundState = "armed";
let engine: AmbientEngine | null = null;
let initialised = false;
const listeners = new Set<() => void>();

const loadEngine = () => import("./ambient");

function setState(next: SoundState) {
  state = next;
  for (const listener of listeners) listener();
}

function savePreference(on: boolean) {
  try {
    localStorage.setItem(STORAGE_KEY, on ? "on" : "off");
  } catch {
    // Storage can be unavailable (private mode); the default just applies.
  }
}

function readPreference(): boolean {
  try {
    return localStorage.getItem(STORAGE_KEY) !== "off";
  } catch {
    return true;
  }
}

/** Creates (or reuses) the engine with a context made inside the current gesture. */
async function play() {
  if (!engine) {
    const ctx = new AudioContext(); // synchronous: still inside the gesture
    void ctx.resume();
    const { AmbientEngine } = await loadEngine();
    engine = new AmbientEngine(() => ctx);
  }
  await engine.start();
  if (state !== "off") setState("playing");
}

function stop() {
  engine?.stop();
}

function onFirstGesture(event: Event) {
  // Clicking a sound toggle is handled by `toggle()`; don't race it.
  if (event.target instanceof Element && event.target.closest("[data-sound-toggle]")) return;
  removeGestureListeners();
  if (state === "armed") void play();
}

function addGestureListeners() {
  for (const type of GESTURES) {
    window.addEventListener(type, onFirstGesture, { capture: true, passive: true });
  }
}

function removeGestureListeners() {
  for (const type of GESTURES) {
    window.removeEventListener(type, onFirstGesture, { capture: true });
  }
}

function onVisibility() {
  if (state !== "playing") return;
  if (document.hidden) engine?.stop();
  else void engine?.start();
}

export const soundStore = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },
  getSnapshot: (): SoundState => state,
  getServerSnapshot: (): SoundState => "armed",

  /** Call once on the client after mount. Safe to call repeatedly. */
  init() {
    if (initialised || typeof window === "undefined") return;
    initialised = true;
    if (typeof AudioContext === "undefined") {
      setState("off");
      return;
    }
    document.addEventListener("visibilitychange", onVisibility);
    if (!readPreference()) {
      setState("off");
      return;
    }
    addGestureListeners();
    // Warm the synth chunk without competing with page load.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 2000));
    idle(() => void loadEngine());
  },

  /** Must run from a click handler. */
  toggle() {
    if (typeof AudioContext === "undefined") return;
    removeGestureListeners();
    if (state === "off") {
      savePreference(true);
      setState("armed");
      void play();
    } else {
      savePreference(false);
      setState("off");
      stop();
    }
  },
};
