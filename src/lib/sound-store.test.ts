import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

/** Fake AudioContext: resume() only succeeds once `allowed` is true. */
class FakeAudioContext extends EventTarget {
  static allowed = false;
  state: AudioContextState = "suspended";
  resume() {
    if (FakeAudioContext.allowed && this.state !== "running") {
      this.state = "running";
      this.dispatchEvent(new Event("statechange"));
    }
    return Promise.resolve();
  }
}

const engine = vi.hoisted(() => ({ start: vi.fn(async () => {}), stop: vi.fn() }));
vi.mock("./ambient", () => ({
  AmbientEngine: class {
    start = engine.start;
    stop = engine.stop;
  },
}));

let hidden = false;
const flush = () => new Promise((r) => setTimeout(r, 0));

async function loadStore() {
  vi.resetModules();
  const { soundStore } = await import("./sound-store");
  return soundStore;
}

beforeEach(() => {
  FakeAudioContext.allowed = false;
  hidden = false;
  localStorage.clear();
  engine.start.mockClear();
  engine.stop.mockClear();
  vi.stubGlobal("AudioContext", FakeAudioContext);
  vi.stubGlobal("requestIdleCallback", (cb: () => void) => cb());
  Object.defineProperty(document, "hidden", { configurable: true, get: () => hidden });
});

// Each test loads a fresh store module; remove listeners earlier stores left on window/document.
const added: [EventTarget, string, EventListenerOrEventListenerObject, unknown][] = [];
for (const target of [window, document]) {
  const original = target.addEventListener.bind(target);
  target.addEventListener = (
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: unknown,
  ) => {
    added.push([target, type, listener, options]);
    original(type, listener, options as AddEventListenerOptions);
  };
}

afterEach(() => {
  for (const [target, type, listener, options] of added.splice(0)) {
    target.removeEventListener(type, listener, options as EventListenerOptions);
  }
  vi.unstubAllGlobals();
});

describe("soundStore", () => {
  it("is armed by default and plays once the browser allows audio", async () => {
    const store = await loadStore();
    store.init();
    await flush();
    expect(store.getSnapshot()).toBe("armed");

    FakeAudioContext.allowed = true;
    window.dispatchEvent(new Event("pointerup"));
    await flush();
    expect(store.getSnapshot()).toBe("playing");
    expect(engine.start).toHaveBeenCalled();
  });

  it("autoplays on load where the browser allows it", async () => {
    FakeAudioContext.allowed = true;
    const store = await loadStore();
    store.init();
    await flush();
    expect(store.getSnapshot()).toBe("playing");
  });

  it("keeps listening after a gesture that doesn't unlock audio", async () => {
    const store = await loadStore();
    store.init();
    window.dispatchEvent(new Event("pointerdown")); // a touch's pointerdown: not an activation
    await flush();
    expect(store.getSnapshot()).toBe("armed");

    FakeAudioContext.allowed = true;
    window.dispatchEvent(new Event("touchend"));
    await flush();
    expect(store.getSnapshot()).toBe("playing");
  });

  it("never starts in a background tab, and starts when the tab is shown", async () => {
    FakeAudioContext.allowed = true;
    hidden = true;
    const store = await loadStore();
    store.init();
    await flush();
    expect(store.getSnapshot()).toBe("armed");
    expect(engine.start).not.toHaveBeenCalled();

    hidden = false;
    document.dispatchEvent(new Event("visibilitychange"));
    await flush();
    expect(store.getSnapshot()).toBe("playing");
  });

  it("remembers a mute across visits", async () => {
    FakeAudioContext.allowed = true;
    let store = await loadStore();
    store.init();
    await flush();
    store.toggle();
    expect(store.getSnapshot()).toBe("off");
    expect(engine.stop).toHaveBeenCalled();

    store = await loadStore();
    store.init();
    await flush();
    expect(store.getSnapshot()).toBe("off");
  });

  it("does not start if muted while the synth is still loading", async () => {
    const store = await loadStore();
    store.init();
    store.toggle(); // mute immediately, before any gesture or load
    FakeAudioContext.allowed = true;
    window.dispatchEvent(new Event("click"));
    await flush();
    expect(store.getSnapshot()).toBe("off");
    expect(engine.start).not.toHaveBeenCalled();
  });
});
