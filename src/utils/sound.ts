export function playTone(type: 'complete' | 'fail' | 'milestone', enabled: boolean): void {
  if (!enabled || typeof window === 'undefined') return;
  try {
    const AudioCtx =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    const playNote = (freq: number, start: number, dur: number, gainVal = 0.08) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, start);
      gain.gain.setValueAtTime(gainVal, start);
      gain.gain.exponentialRampToValueAtTime(0.001, start + dur);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(start);
      osc.stop(start + dur);
    };

    if (type === 'complete') {
      playNote(523.25, now, 0.14);
      playNote(659.25, now + 0.09, 0.22);
    } else if (type === 'milestone') {
      playNote(523.25, now, 0.12);
      playNote(659.25, now + 0.08, 0.12);
      playNote(783.99, now + 0.16, 0.14);
      playNote(1046.5, now + 0.24, 0.28);
    } else {
      playNote(329.63, now, 0.16, 0.06);
      playNote(246.94, now + 0.12, 0.24, 0.06);
    }
  } catch {
    // Ignore audio context restrictions
  }
}
