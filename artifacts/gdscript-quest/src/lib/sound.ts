let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const Ctor =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext })
        .webkitAudioContext;
    if (!Ctor) return null;
    ctx = new Ctor();
  }
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType, gain = 0.07) {
  const ac = getCtx();
  if (!ac) return;
  const osc = ac.createOscillator();
  const g = ac.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.setValueAtTime(gain, ac.currentTime);
  g.gain.exponentialRampToValueAtTime(0.0001, ac.currentTime + dur);
  osc.connect(g).connect(ac.destination);
  osc.start();
  osc.stop(ac.currentTime + dur);
}

export function playDing() {
  tone(880, 0.12, "triangle");
  setTimeout(() => tone(1318.5, 0.18, "triangle"), 90);
}

export function playBuzz() {
  tone(180, 0.18, "sawtooth", 0.05);
}

export function playPop() {
  tone(520, 0.08, "square", 0.05);
}
