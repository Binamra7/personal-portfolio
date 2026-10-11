import { describe, expect, it, vi } from "vitest";
import { AmbientEngine, CHIME_NOTES, MASTER_VOLUME } from "./ambient";

/** Minimal fake of the Web Audio graph: records gain ramps and node starts. */
function fakeContext() {
  const param = () => ({
    value: 0,
    setValueAtTime: vi.fn(),
    linearRampToValueAtTime: vi.fn(),
    exponentialRampToValueAtTime: vi.fn(),
    cancelScheduledValues: vi.fn(),
  });
  const node = () => {
    const n = {
      connect: vi.fn(() => n),
      gain: param(),
      frequency: param(),
      detune: param(),
      Q: param(),
      start: vi.fn(),
      stop: vi.fn(),
      type: "",
      buffer: null as unknown,
    };
    return n;
  };
  const gains: ReturnType<typeof node>[] = [];
  const ctx = {
    currentTime: 0,
    sampleRate: 8000,
    destination: {},
    resume: vi.fn(async () => {}),
    suspend: vi.fn(async () => {}),
    close: vi.fn(async () => {}),
    createGain: vi.fn(() => {
      const g = node();
      gains.push(g);
      return g;
    }),
    createOscillator: vi.fn(node),
    createBiquadFilter: vi.fn(node),
    createConvolver: vi.fn(node),
    createBuffer: vi.fn((_c: number, length: number) => ({
      getChannelData: () => new Float32Array(length),
    })),
  };
  return { ctx: ctx as unknown as AudioContext, raw: ctx, gains };
}

describe("AmbientEngine", () => {
  it("fades the master gain up to a quiet level on start", async () => {
    const { ctx, raw, gains } = fakeContext();
    const engine = new AmbientEngine(ctx);
    await engine.start();

    expect(engine.playing).toBe(true);
    expect(raw.resume).toHaveBeenCalled();
    const master = gains[0];
    expect(master?.gain.linearRampToValueAtTime).toHaveBeenCalledWith(MASTER_VOLUME, 4);
    expect(MASTER_VOLUME).toBeLessThanOrEqual(0.1);
    engine.stop();
  });

  it("fades out and suspends on stop", async () => {
    vi.useFakeTimers();
    const { ctx, raw, gains } = fakeContext();
    const engine = new AmbientEngine(ctx);
    await engine.start();
    engine.stop();

    expect(engine.playing).toBe(false);
    expect(gains[0]?.gain.linearRampToValueAtTime).toHaveBeenLastCalledWith(0, 1.5);
    vi.advanceTimersByTime(2000);
    expect(raw.suspend).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("only uses pentatonic chime notes", () => {
    expect(CHIME_NOTES.every((f) => f >= 200 && f <= 700)).toBe(true);
  });
});
