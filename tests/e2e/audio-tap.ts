import type { Page } from "@playwright/test";

/**
 * Routes everything the page sends to the speakers through a 200 Hz high-pass
 * analyser: roughly what laptop and phone speakers can actually reproduce.
 * Call before `page.goto`.
 */
export async function tapAudio(page: Page) {
  await page.addInitScript(() => {
    type Connect = (this: AudioNode, dest: AudioNode, ...rest: number[]) => AudioNode;
    const connect = AudioNode.prototype.connect as Connect;
    (AudioNode.prototype as unknown as { connect: Connect }).connect = function (dest, ...rest) {
      if (!(dest instanceof AudioDestinationNode)) return connect.call(this, dest, ...rest);
      // biome-ignore lint/suspicious/noExplicitAny: test-only globals
      const w = window as any;
      if (!w.__audibleTap) {
        const input = this.context.createGain();
        connect.call(input, dest);
        const highpass = this.context.createBiquadFilter();
        highpass.type = "highpass";
        highpass.frequency.value = 200;
        const analyser = this.context.createAnalyser();
        analyser.fftSize = 4096;
        connect.call(input, highpass);
        connect.call(highpass, analyser);
        w.__audibleTap = { input, analyser };
      }
      return connect.call(this, w.__audibleTap.input, ...rest);
    };
  });
}

/** Median audible RMS level in dBFS over `seconds`. */
export async function audibleLevel(page: Page, seconds = 6) {
  return page.evaluate(async (seconds) => {
    // biome-ignore lint/suspicious/noExplicitAny: test-only globals
    const analyser: AnalyserNode | undefined = (window as any).__audibleTap?.analyser;
    if (!analyser) return -Infinity;
    const data = new Float32Array(analyser.fftSize);
    const levels: number[] = [];
    for (let i = 0; i < seconds * 4; i++) {
      analyser.getFloatTimeDomainData(data);
      const rms = Math.sqrt(data.reduce((sum, v) => sum + v * v, 0) / data.length);
      levels.push(20 * Math.log10(rms || 1e-9));
      await new Promise((r) => setTimeout(r, 250));
    }
    return levels.sort((a, b) => a - b)[Math.floor(levels.length / 2)] ?? -Infinity;
  }, seconds);
}
