/**
 * Calm, luxury generative ambient soundscape engine using Web Audio API.
 * Produces warm low-pass filtered felt-piano/pad chords (Dmaj9 -> Bm9 -> Gmaj9 -> Asus4)
 * with smooth fade-in/fade-out and zero external audio file dependencies.
 */

const CHORD_PROGRESSION: number[][] = [
  // Dmaj9 (D3, A3, C#4, E4, F#4)
  [146.83, 220.0, 277.18, 329.63, 369.99],
  // Bm9 (B2, F#3, A3, C#4, D4)
  [123.47, 185.0, 220.0, 277.18, 293.66],
  // Gmaj9 (G2, D3, F#3, A3, B3)
  [98.0, 146.83, 185.0, 220.0, 246.94],
  // A6/9 (A2, E3, F#3, B3, C#4)
  [110.0, 164.81, 185.0, 246.94, 277.18],
];

class AmbientSoundscapeEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private intervalId: number | null = null;
  private chordIndex = 0;
  private isPlaying = false;
  private targetVolume = 0.18;

  private ensureContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtx) return null;

    if (!this.ctx) {
      this.ctx = new AudioCtx();
      this.filterNode = this.ctx.createBiquadFilter();
      this.filterNode.type = 'lowpass';
      this.filterNode.frequency.value = 920;
      this.filterNode.Q.value = 0.7;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private scheduleChord(notes: number[]): void {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    const chordDuration = 6.2;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.filterNode) return;

      // Soft primary sine + subtle warm triangle harmonic
      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      overtone.type = 'triangle';
      overtone.frequency.value = freq * 2;

      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.value = 0.08;

      // Gentle stagger like an unhurried felt piano arpeggio
      const startOffset = idx * 0.14;
      const peakGain = idx === 0 ? 0.22 : 0.14;

      noteGain.gain.setValueAtTime(0.0001, now + startOffset);
      noteGain.gain.linearRampToValueAtTime(peakGain, now + startOffset + 1.3);
      noteGain.gain.exponentialRampToValueAtTime(0.0008, now + startOffset + chordDuration);

      osc.connect(noteGain);
      overtone.connect(overtoneGain);
      overtoneGain.connect(noteGain);
      noteGain.connect(this.filterNode);

      osc.start(now + startOffset);
      overtone.start(now + startOffset);
      osc.stop(now + startOffset + chordDuration + 0.15);
      overtone.stop(now + startOffset + chordDuration + 0.15);
    });
  }

  public async start(): Promise<boolean> {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return false;

    if (ctx.state === 'suspended') {
      await ctx.resume();
    }

    if (this.isPlaying) return true;
    this.isPlaying = true;

    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 1.4);

    this.scheduleChord(CHORD_PROGRESSION[this.chordIndex % CHORD_PROGRESSION.length]);
    this.chordIndex += 1;

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.scheduleChord(CHORD_PROGRESSION[this.chordIndex % CHORD_PROGRESSION.length]);
      this.chordIndex += 1;
    }, 5400);

    return true;
  }

  public stop(): void {
    this.isPlaying = false;
    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.7);
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientSoundscapeEngine();
