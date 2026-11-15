// Web Audio API Synthesizer for High-Impact Demonstrations
// Generates phone ringtones, police sirens, payment chimes, and alert buzzers without external MP3 dependencies.

let audioCtx: AudioContext | null = null;
let activeOscillators: OscillatorNode[] = [];

function getAudioContext(): AudioContext {
  if (!audioCtx || audioCtx.state === "closed") {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume();
  }
  return audioCtx;
}

export function stopAllSounds() {
  activeOscillators.forEach((osc) => {
    try {
      osc.stop();
      osc.disconnect();
    } catch {}
  });
  activeOscillators = [];
}

/**
 * Realistic US/UK Dual-Tone Phone Ringtone (440Hz + 480Hz)
 */
export function playPhoneRing(durationMs = 3000): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc1.frequency.setValueAtTime(440, now);
      osc2.frequency.setValueAtTime(480, now);

      // Ring cadence: 1.5s ring, 0.5s pause, repeat
      gainNode.gain.setValueAtTime(0, now);
      gainNode.gain.setValueAtTime(0.2, now + 0.05);
      gainNode.gain.setValueAtTime(0.2, now + 1.2);
      gainNode.gain.setValueAtTime(0, now + 1.25);
      gainNode.gain.setValueAtTime(0.2, now + 1.6);
      gainNode.gain.setValueAtTime(0.2, now + 2.8);
      gainNode.gain.setValueAtTime(0, now + 2.85);

      osc1.connect(gainNode);
      osc2.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now);

      const stopTime = now + durationMs / 1000;
      osc1.stop(stopTime);
      osc2.stop(stopTime);

      activeOscillators.push(osc1, osc2);

      setTimeout(() => {
        resolve();
      }, durationMs);
    } catch {
      resolve();
    }
  });
}

/**
 * High-Urgency Police / Cyber Strobe Siren (Oscillating 650Hz to 1100Hz)
 */
export function playSirenAlert(durationMs = 2500): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gainNode = ctx.createGain();

      osc.type = "sawtooth";
      gainNode.gain.setValueAtTime(0.18, now);

      // Siren sweep
      const cycles = 5;
      const cycleDuration = durationMs / 1000 / cycles;
      for (let i = 0; i < cycles; i++) {
        const start = now + i * cycleDuration;
        const mid = start + cycleDuration / 2;
        const end = start + cycleDuration;
        osc.frequency.setValueAtTime(600, start);
        osc.frequency.exponentialRampToValueAtTime(1150, mid);
        osc.frequency.exponentialRampToValueAtTime(600, end);
      }

      osc.connect(gainNode);
      gainNode.connect(ctx.destination);

      osc.start(now);
      const stopTime = now + durationMs / 1000;
      gainNode.gain.setValueAtTime(0.18, stopTime - 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.001, stopTime);
      osc.stop(stopTime);

      activeOscillators.push(osc);

      setTimeout(() => {
        resolve();
      }, durationMs);
    } catch {
      resolve();
    }
  });
}

/**
 * Paytm/bKash Style Two-Tone Upbeat Confirmation Chime (C5 -> G5)
 */
export function playPaymentChime(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";

      // Note 1: 523.25 Hz (C5)
      osc.frequency.setValueAtTime(523.25, now);
      // Note 2: 783.99 Hz (G5)
      osc.frequency.setValueAtTime(783.99, now + 0.18);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);

      activeOscillators.push(osc);
      setTimeout(resolve, 600);
    } catch {
      resolve();
    }
  });
}

/**
 * Harsh Warning Buzzer for Fake Payment & Tampered QR
 */
export function playWarningBuzzer(): Promise<void> {
  return new Promise((resolve) => {
    try {
      const ctx = getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "square";
      osc.frequency.setValueAtTime(180, now);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.setValueAtTime(0, now + 0.2);
      gain.gain.setValueAtTime(0.25, now + 0.3);
      gain.gain.setValueAtTime(0.001, now + 0.55);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.6);

      activeOscillators.push(osc);
      setTimeout(resolve, 600);
    } catch {
      resolve();
    }
  });
}
