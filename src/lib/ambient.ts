/**
 * Generative ambient music, synthesised with the Web Audio API: a soft A/E
 * drone under a slowly breathing low-pass filter, plus sparse pentatonic
 * chimes through a synthetic reverb. No audio files.
 *
 * Loaded lazily by `sound-store.ts`, which owns the AudioContext.
 */

export const MASTER_VOLUME = 0.07;

/** A minor pentatonic across two octaves, so any two notes sound consonant. */
export const CHIME_NOTES = [220, 261.63, 293.66, 329.63, 392, 440, 523.25, 587.33, 659.25];

const DRONE_NOTES = [110, 164.81, 220];

export class AmbientEngine {
  private master: GainNode | null = null;
  private reverb: ConvolverNode | null = null;
  private chimeTimer: ReturnType<typeof setTimeout> | undefined;
  private suspendTimer: ReturnType<typeof setTimeout> | undefined;
  playing = false;

  constructor(private readonly ctx: AudioContext) {}

  async start() {
    if (this.playing) return;
    this.playing = true;
    clearTimeout(this.suspendTimer);
    const master = this.master ?? this.build();

    await this.ctx.resume();
    this.rampTo(master, MASTER_VOLUME, 4);
    this.scheduleChime(1500);
  }

  stop() {
    if (!this.playing || !this.master) return;
    this.playing = false;
    clearTimeout(this.chimeTimer);
    this.rampTo(this.master, 0, 1.5);
    // Let the fade finish, then let the audio thread idle.
    this.suspendTimer = setTimeout(() => void this.ctx.suspend(), 1600);
  }

  private rampTo(gain: GainNode, value: number, seconds: number) {
    const now = this.ctx.currentTime;
    gain.gain.cancelScheduledValues(now);
    gain.gain.setValueAtTime(gain.gain.value, now);
    gain.gain.linearRampToValueAtTime(value, now + seconds);
  }

  private build() {
    const { ctx } = this;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    this.master = master;

    const reverb = ctx.createConvolver();
    reverb.buffer = impulseResponse(ctx, 4, 2.5);
    const wet = ctx.createGain();
    wet.gain.value = 0.6;
    reverb.connect(wet).connect(master);
    this.reverb = reverb;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 500;
    filter.Q.value = 0.7;
    filter.connect(master);
    filter.connect(reverb);

    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.04;
    const lfoDepth = ctx.createGain();
    lfoDepth.gain.value = 250;
    lfo.connect(lfoDepth).connect(filter.frequency);
    lfo.start();

    // Each drone note is a slightly detuned pair, which gives a slow beating shimmer.
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
      }
    }
    return master;
  }

  private scheduleChime(delay: number) {
    this.chimeTimer = setTimeout(() => {
      if (!this.playing) return;
      this.chime();
      this.scheduleChime(3000 + Math.random() * 5000);
    }, delay);
  }

  private chime() {
    const { ctx, master, reverb } = this;
    if (!master || !reverb) return;

    const freq = CHIME_NOTES[Math.floor(Math.random() * CHIME_NOTES.length)] ?? 440;
    const now = ctx.currentTime;
    const env = ctx.createGain();
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(0.18, now + 0.02);
    env.gain.exponentialRampToValueAtTime(0.0001, now + 4);
    env.connect(reverb);
    const dry = ctx.createGain();
    dry.gain.value = 0.25;
    env.connect(dry).connect(master);

    // Fundamental plus a quiet inharmonic overtone: a soft bell.
    for (const [ratio, level] of [
      [1, 1],
      [2.76, 0.12],
    ] as const) {
      const osc = ctx.createOscillator();
      osc.frequency.value = freq * ratio;
      const gain = ctx.createGain();
      gain.gain.value = level;
      osc.connect(gain).connect(env);
      osc.start(now);
      osc.stop(now + 4.1);
    }
  }
}

/** Exponentially decaying stereo noise: a cheap, convincing reverb tail. */
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
