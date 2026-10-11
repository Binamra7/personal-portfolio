import type { AmbientEngine } from "./ambient";

/**
 * Shared sound state for every toggle.
 *
 * Sound is on by default. Once the page is idle we try to start it; browsers
 * that allow autoplay (e.g. for sites a visitor uses often) play straight
 * away. Others keep the AudioContext suspended until a user activation, so
 * every click, tap or key press retries until audio is actually running.
 * A mute is saved in localStorage. The synth (`./ambient`) is a lazy chunk.
 */
export type SoundState = "off" | "armed" | "playing";

const STORAGE_KEY = "sound";
// Only some of these grant user activation (e.g. a touch's pointerdown doesn't,
// its pointerup/touchend do), so keep listening until the context is running.
const GESTURES = ["pointerdown", "pointerup", "touchend", "click", "keydown"] as const;

let state: SoundState = "armed";
let ctx: AudioContext | null = null;
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

/** Marks the context as playing once the browser actually lets it run. */
function sync() {
  if (ctx?.state === "running" && state === "armed") {
    removeGestureListeners();
    setState("playing");
  }
}

function context() {
  if (!ctx) {
    ctx = new AudioContext();
    ctx.addEventListener("statechange", sync);
  }
  return ctx;
}

/** Safe to call with or without a user gesture; within one, it unlocks audio. */
function tryPlay() {
  // iOS Safari: play through the silent switch, like a music app.
  const session = (navigator as Navigator & { audioSession?: { type: string } }).audioSession;
  if (session) session.type = "playback";

  const audio = context();
  void audio.resume().then(sync);
  void loadEngine().then(({ AmbientEngine }) => {
    engine ??= new AmbientEngine(audio);
    if (state !== "off") void engine.start();
  });
}

function onGesture(event: Event) {
  // Clicks on a sound toggle are handled by `toggle()`.
  if (event.target instanceof Element && event.target.closest("[data-sound-toggle]")) return;
  if (state === "armed") tryPlay();
}

function addGestureListeners() {
  for (const type of GESTURES) {
    window.addEventListener(type, onGesture, { capture: true, passive: true });
  }
}

function removeGestureListeners() {
  for (const type of GESTURES) {
    window.removeEventListener(type, onGesture, { capture: true });
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
    // Try autoplay once the page has finished its own work.
    const idle = window.requestIdleCallback ?? ((cb: () => void) => setTimeout(cb, 1500));
    idle(() => {
      if (state === "armed") tryPlay();
    });
  },

  /** Must run from a click handler. On (armed or playing) → off; off → on. */
  toggle() {
    if (typeof AudioContext === "undefined") return;
    if (state === "off") {
      savePreference(true);
      setState("armed");
      tryPlay();
    } else {
      savePreference(false);
      removeGestureListeners();
      setState("off");
      engine?.stop();
    }
  },
};
