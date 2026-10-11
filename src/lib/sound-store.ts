import type { AmbientEngine } from "./ambient";

/**
 * Shared sound state for every toggle.
 *
 * Sound is on by default, but browsers only allow audio after a click, tap or
 * key press (not scrolling), so the default state is "armed" until then. A
 * mute is saved in localStorage. The synth (`./ambient`) is a separate chunk,
 * prefetched when the browser is idle; the AudioContext is created inside the
 * gesture so browsers accept it as user-initiated.
 */
export type SoundState = "off" | "armed" | "playing";

const STORAGE_KEY = "sound";
const GESTURES = ["pointerdown", "keydown", "touchend"] as const;

let state: SoundState = "armed";
let engine: AmbientEngine | null = null;
let initialised = false;
const listeners = new Set<() => void>();

const loadEngine = () => import("./ambient");

// A function, so TypeScript re-reads `state` after an await instead of narrowing it.
const isOff = () => state === "off";

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

/** Must be called inside a user gesture: the AudioContext is created synchronously. */
async function play() {
  if (!engine) {
    const ctx = new AudioContext();
    void ctx.resume();
    const { AmbientEngine } = await loadEngine();
    engine = new AmbientEngine(ctx);
  }
  // The visitor may mute while the chunk loads or the context resumes.
  if (isOff()) return;
  await engine.start();
  if (isOff()) engine.stop();
  else setState("playing");
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
