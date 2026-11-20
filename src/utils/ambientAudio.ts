/**
 * Calm, luxury ambient audio engine.
 * Plays high-fidelity calm jazz loop (/audio/calm-jazz.mp3) with smooth fade-in/fade-out
 * and automatic fallback to procedural warm felt-piano acoustic chords.
 */

const JAZZ_AUDIO_SRC = '/audio/calm-jazz.mp3';

const PROCEDURAL_CHORD_PROGRESSION: number[][] = [
  // Dmaj9 (D3, A3, C#4, E4, F#4)
  [146.83, 220.0, 277.18, 329.63, 369.99],
  // Bm9 (B2, F#3, A3, C#4, D4)
  [123.47, 185.0, 220.0, 277.18, 293.66],
  // Gmaj9 (G2, D3, F#3, A3, B3)
  [98.0, 146.83, 185.0, 220.0, 246.94],
  // A13 / A6/9 (A2, E3, G3, B3, C#4, F#4)
  [110.0, 164.81, 196.0, 246.94, 277.18, 369.99],
];

class AmbientSoundscapeEngine {
  private audioElement: HTMLAudioElement | null = null;
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private filterNode: BiquadFilterNode | null = null;
  private intervalId: number | null = null;
  private fadeIntervalId: number | null = null;
  private chordIndex = 0;
  private isPlaying = false;
  private isUsingFile = false;
  private targetVolume = 0.18;

  private initAudioElement(): HTMLAudioElement | null {
    if (typeof window === 'undefined') return null;
    if (!this.audioElement) {
      const audio = new Audio(JAZZ_AUDIO_SRC);
      audio.loop = true;
      audio.preload = 'auto';
      audio.volume = 0.001;
      this.audioElement = audio;
    }
    return this.audioElement;
  }

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
      this.filterNode.frequency.value = 1100;
      this.filterNode.Q.value = 0.7;

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = 0.0001;

      this.filterNode.connect(this.masterGain);
      this.masterGain.connect(this.ctx.destination);
    }
    return this.ctx;
  }

  private scheduleProceduralChord(notes: number[]): void {
    if (!this.ctx || !this.filterNode) return;
    const now = this.ctx.currentTime;
    const chordDuration = 5.8;

    notes.forEach((freq, idx) => {
      if (!this.ctx || !this.filterNode) return;

      const osc = this.ctx.createOscillator();
      const overtone = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.value = freq;

      overtone.type = 'triangle';
      overtone.frequency.value = freq * 2;

      const overtoneGain = this.ctx.createGain();
      overtoneGain.gain.value = 0.07;

      const startOffset = idx * 0.12;
      const peakGain = idx === 0 ? 0.20 : 0.12;

      noteGain.gain.setValueAtTime(0.0001, now + startOffset);
      noteGain.gain.linearRampToValueAtTime(peakGain, now + startOffset + 1.2);
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

  private startProceduralFallback(): void {
    const ctx = this.ensureContext();
    if (!ctx || !this.masterGain) return;

    const now = ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(Math.max(this.masterGain.gain.value, 0.0001), now);
    this.masterGain.gain.linearRampToValueAtTime(this.targetVolume, now + 1.4);

    this.scheduleProceduralChord(
      PROCEDURAL_CHORD_PROGRESSION[this.chordIndex % PROCEDURAL_CHORD_PROGRESSION.length],
    );
    this.chordIndex += 1;

    this.intervalId = window.setInterval(() => {
      if (!this.isPlaying) return;
      this.scheduleProceduralChord(
        PROCEDURAL_CHORD_PROGRESSION[this.chordIndex % PROCEDURAL_CHORD_PROGRESSION.length],
      );
      this.chordIndex += 1;
    }, 5200);
  }

  public async start(): Promise<boolean> {
    if (this.isPlaying) return true;
    this.isPlaying = true;

    // First priority: Real Smooth Jazz Audio Loop
    const audio = this.initAudioElement();
    if (audio) {
      try {
        audio.currentTime = 0;
        audio.volume = 0.001;
        await audio.play();
        this.isUsingFile = true;

        if (this.fadeIntervalId !== null) {
          window.clearInterval(this.fadeIntervalId);
        }

        const step = 0.005;
        this.fadeIntervalId = window.setInterval(() => {
          if (!this.audioElement || !this.isPlaying) {
            if (this.fadeIntervalId !== null) window.clearInterval(this.fadeIntervalId);
            return;
          }
          if (this.audioElement.volume < this.targetVolume) {
            this.audioElement.volume = Math.min(this.targetVolume, this.audioElement.volume + step);
          } else {
            if (this.fadeIntervalId !== null) window.clearInterval(this.fadeIntervalId);
          }
        }, 60);

        return true;
      } catch {
        // Fallback to Web Audio synthesizer if browser prevents media element
        this.isUsingFile = false;
      }
    }

    // Fallback: Web Audio procedural chords
    const ctx = this.ensureContext();
    if (ctx && ctx.state === 'suspended') {
      try {
        await ctx.resume();
      } catch {
        return false;
      }
    }
    this.startProceduralFallback();
    return true;
  }

  public stop(): void {
    this.isPlaying = false;

    if (this.fadeIntervalId !== null) {
      window.clearInterval(this.fadeIntervalId);
      this.fadeIntervalId = null;
    }

    if (this.isUsingFile && this.audioElement) {
      const step = 0.025;
      const fadeAudio = this.audioElement;
      const fadeDownId = window.setInterval(() => {
        if (!fadeAudio) {
          window.clearInterval(fadeDownId);
          return;
        }
        if (fadeAudio.volume > step) {
          fadeAudio.volume = Math.max(0, fadeAudio.volume - step);
        } else {
          fadeAudio.volume = 0;
          fadeAudio.pause();
          window.clearInterval(fadeDownId);
        }
      }, 50);
      this.isUsingFile = false;
    }

    if (this.intervalId !== null) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.ctx && this.masterGain) {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.linearRampToValueAtTime(0.0001, now + 0.6);
    }
  }

  public getPlayingState(): boolean {
    return this.isPlaying;
  }
}

export const ambientAudio = new AmbientSoundscapeEngine();
