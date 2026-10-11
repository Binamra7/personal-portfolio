/**
 * Generative "zen" ambience, synthesised live with the Web Audio API.
 * No audio files: a soft drone (A + E, slowly breathing filter) and sparse
 * pentatonic chimes washed through a synthetic reverb.
 *
 * Browsers only allow audio after a user gesture, so `start()` must be called
 * from a click handler.
 */

/** Overall loudness. Deliberately quiet: background, not foreground. */
export const MASTER_VOLUME = 0.07;

/** A minor pentatonic, two octaves: always consonant together. */
export const CHIME_NOTES = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];

const DRONE_NOTES = [110, 164.81, 220];

type Timer = ReturnType<typeof setTimeout>;

export class AmbientEngine {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private sources: AudioScheduledSourceNode[] = [];
  private chimeTimer: Timer | null = null;
  private stopTimer: Timer | null = null;
  playing = false;

  constructor(private readonly createContext: () => AudioContext = () => new AudioContext()) {}

  async start() {
    if (this.playing) return;
    this.playing = true;
    if (this.stopTimer) clearTimeout(this.stopTimer);

    if (!this.ctx) this.build();
    const ctx = this.ctx as AudioContext;
    const master = this.master as GainNode;

    await ctx.resume();
    const now = ctx.currentTime;
    master.gain.cancelScheduledValues(now);
    master.gain.setValueAtTime(master.gain.value, now);
    master.gain.linearRampToValueAtTime(MASTER_VOLUME, now + 4);
    this.scheduleChime(1500);
  }

  stop() {
    if (!this.playing || !this.ctx || !this.master) return;
    this.playing = false;
    if (this.chimeTimer) clearTimeout(this.chimeTimer);

    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.setValueAtTime(this.master.gain.value, now);
    this.master.gain.linearRampToValueAtTime(0, now + 1.5);
    // Suspend after the fade so the audio thread can idle.
    this.stopTimer = setTimeout(() => this.ctx?.suspend(), 1600);
  }

  /** Releases the audio context entirely. */
  dispose() {
    this.stop();
    for (const s of this.sources) s.stop();
    this.sources = [];
    void this.ctx?.close();
    this.ctx = null;
  }

  private build() {
    const ctx = this.createContext();
    this.ctx = ctx;

    this.master = ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(ctx.destination);

    this.reverb = ctx.createConvolver();
    this.reverb.buffer = impulseResponse(ctx, 5, 2.5);
    const wet = ctx.createGain();
    wet.gain.value = 0.6;
    this.reverb.connect(wet).connect(this.master);

    // Drone: detuned sine pairs through a low-pass whose cutoff "breathes".
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;
    filter.Q.value = 0.7;
    filter.connect(this.master);
    filter.connect(this.reverb);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 250;
    lfo.connect(lfoDepth).connect(filter.frequency);
    lfo.start();
    this.sources.push(lfo);

    for (const [i, freq] of DRONE_NOTES.entries()) {
      for (const detune of [-5, 5]) {
        const osc = ctx.createOscillator();
        osc.type = i === 0 ? "sine" : "triangle";
        osc.frequency.value = freq;
        osc.detune.value = detune;
        const gain = ctx.createGain();
        gain.gain.value = i === 0 ? 0.35 : 0.12;
        osc.connect(gain).connect(filter);
        osc.start();
        this.sources.push(osc);
      }
    }
  }

  private scheduleChime(delay: number) {
    this.chimeTimer = setTimeout(() => {
      if (!this.playing) return;
      this.chime();
      // Sparse and irregular: 3–8 seconds apart.
      this.scheduleChime(3000 + Math.random() * 5000);
    }, delay);
  }

  private chime() {
    const ctx = this.ctx;
    if (!ctx || !this.master || !this.reverb) return;

    const freq = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)] ?? 440;
    const now = ctx.currentTime;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.18, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 4);
    env.connect(this.reverb);

    const dry = ctx.createGain();
    dry.gain.value = 0.25;
    env.connect(dry).connect(this.master);

    // Fundamental + a quiet overtone gives a soft bell timbre.
    for (const [mult, level] of [
      [1, 1],
      [2.76, 0.12],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq * mult;
      const g = ctx.createGain();
      g.gain.value = level;
      osc.connect(g).connect(env);
      osc.start(now);
      osc.stop(now + 4.1);
    }
  }
}

/** Decaying stereo noise: a cheap, convincing reverb tail. */
function impulseResponse(ctx: BaseAudioContext, seconds: number, decay: number) {
  const length = Math.floor(ctx.sampleRate * seconds);
  const buffer = ctx.createBuffer(2, length, ctx.sampleRate);
  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    for (let i = 0; i < length; i++) {
      data[i] = (Math.random() * 2 - 1) * (1 - i / length) ** decay;
    }
  }
  return buffer;
}
