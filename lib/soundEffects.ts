'use client';

import { SoundTheme, SoundType } from './types';

class SoundEffectsEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;
  private volume: number = 0.6;

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public setVolume(vol: number) {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  public setMuted(muted: boolean) {
    this.isMuted = muted;
  }

  public play(theme: SoundTheme, type: SoundType, customVolume?: number) {
    if (this.isMuted || theme === 'muted') return;

    const ctx = this.getAudioContext();
    if (!ctx) return;

    const finalVol = (customVolume !== undefined ? customVolume : this.volume);
    if (finalVol <= 0) return;

    try {
      const now = ctx.currentTime;

      switch (theme) {
        case 'crystal':
          this.playCrystalSound(ctx, now, type, finalVol);
          break;
        case 'spa':
          this.playSpaSound(ctx, now, type, finalVol);
          break;
        case 'modern':
          this.playModernSound(ctx, now, type, finalVol);
          break;
        case 'playful':
          this.playPlayfulSound(ctx, now, type, finalVol);
          break;
        case 'minimal':
          this.playMinimalSound(ctx, now, type, finalVol);
          break;
        default:
          this.playCrystalSound(ctx, now, type, finalVol);
          break;
      }
    } catch (e) {
      console.warn('Audio playback not allowed or failed:', e);
    }
  }

  // ----------------------------------------------------
  // 1. Crystal / Elegant Theme (Bell & Crystal Shimmers)
  // ----------------------------------------------------
  private playCrystalSound(ctx: AudioContext, now: number, type: SoundType, vol: number) {
    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1046.5, now); // C6
        osc.frequency.exponentialRampToValueAtTime(2093, now + 0.08); // C7
        gain.gain.setValueAtTime(0.18 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.13);
        break;
      }
      case 'addToCart': {
        // Celestial two-tone bell chime
        [1174.66, 1760.0].forEach((freq, i) => { // D6 -> A6
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.09);
          gain.gain.setValueAtTime(0.22 * vol, now + i * 0.09);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.09 + 0.35);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.09);
          osc.stop(now + i * 0.09 + 0.36);
        });
        break;
      }
      case 'wishlist': {
        // Shimmering ascending third
        [1318.51, 1661.22].forEach((freq, i) => { // E6 -> G#6
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.2 * vol, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.28);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.29);
        });
        break;
      }
      case 'modalToggle': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(587.33, now); // D5
        osc.frequency.exponentialRampToValueAtTime(1174.66, now + 0.16); // D6
        gain.gain.setValueAtTime(0.12 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.23);
        break;
      }
      case 'checkoutSuccess': {
        // Celestial major arpeggio fanfare (C5, E5, G5, C6)
        [523.25, 659.25, 783.99, 1046.5, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.1);
          gain.gain.setValueAtTime(0.25 * vol, now + i * 0.1);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.1 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.1);
          osc.stop(now + i * 0.1 + 0.62);
        });
        break;
      }
      case 'filterChange': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(880, now);
        osc.frequency.exponentialRampToValueAtTime(1320, now + 0.06);
        gain.gain.setValueAtTime(0.12 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
        break;
      }
    }
  }

  // ----------------------------------------------------
  // 2. Spa / ASMR Relaxing Theme (Warm harmonic bowl tones)
  // ----------------------------------------------------
  private playSpaSound(ctx: AudioContext, now: number, type: SoundType, vol: number) {
    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(432, now); // 432 Hz healing frequency
        gain.gain.setValueAtTime(0.15 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.22);
        break;
      }
      case 'addToCart': {
        // Soothing warm singing bowl double harmonic
        [432, 648].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.2 * vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.55);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.58);
        });
        break;
      }
      case 'wishlist': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(528, now); // Love frequency 528 Hz
        osc.frequency.exponentialRampToValueAtTime(660, now + 0.2);
        gain.gain.setValueAtTime(0.18 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
        break;
      }
      case 'modalToggle': {
        // Deep breathing atmospheric swell
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(216, now);
        osc.frequency.exponentialRampToValueAtTime(432, now + 0.3);
        gain.gain.setValueAtTime(0.14 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.48);
        break;
      }
      case 'checkoutSuccess': {
        // Zen temple singing bowl triad
        [288, 432, 576, 864].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.12);
          gain.gain.setValueAtTime(0.22 * vol, now + i * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.12 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.12);
          osc.stop(now + i * 0.12 + 0.85);
        });
        break;
      }
      case 'filterChange': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(360, now);
        osc.frequency.exponentialRampToValueAtTime(480, now + 0.1);
        gain.gain.setValueAtTime(0.12 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.22);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.24);
        break;
      }
    }
  }

  // ----------------------------------------------------
  // 3. Modern Chic Theme (Acoustic pops & clean tactile UI)
  // ----------------------------------------------------
  private playModernSound(ctx: AudioContext, now: number, type: SoundType, vol: number) {
    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(750, now);
        osc.frequency.exponentialRampToValueAtTime(180, now + 0.035);
        gain.gain.setValueAtTime(0.25 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.05);
        break;
      }
      case 'addToCart': {
        // Modern crisp double blip
        [600, 900].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.22 * vol, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.12);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.13);
        });
        break;
      }
      case 'wishlist': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(450, now);
        osc.frequency.exponentialRampToValueAtTime(950, now + 0.09);
        gain.gain.setValueAtTime(0.22 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'modalToggle': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(320, now);
        osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);
        gain.gain.setValueAtTime(0.16 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.14);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.15);
        break;
      }
      case 'checkoutSuccess': {
        // Modern bright power chord
        [440, 554.37, 659.25, 880].forEach((freq) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now);
          gain.gain.setValueAtTime(0.18 * vol, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 0.48);
        });
        break;
      }
      case 'filterChange': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(500, now);
        osc.frequency.exponentialRampToValueAtTime(300, now + 0.05);
        gain.gain.setValueAtTime(0.15 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.07);
        break;
      }
    }
  }

  // ----------------------------------------------------
  // 4. Playful & Vibrant Theme (Bubbly bright notes)
  // ----------------------------------------------------
  private playPlayfulSound(ctx: AudioContext, now: number, type: SoundType, vol: number) {
    switch (type) {
      case 'click': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(600, now);
        osc.frequency.exponentialRampToValueAtTime(1200, now + 0.05);
        gain.gain.setValueAtTime(0.2 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.09);
        break;
      }
      case 'addToCart': {
        [523.25, 783.99, 1046.5].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.07);
          gain.gain.setValueAtTime(0.22 * vol, now + i * 0.07);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.07 + 0.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.07);
          osc.stop(now + i * 0.07 + 0.22);
        });
        break;
      }
      case 'wishlist': {
        [880, 1108.73, 1318.51].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, now + i * 0.06);
          gain.gain.setValueAtTime(0.2 * vol, now + i * 0.06);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.06 + 0.18);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.06);
          osc.stop(now + i * 0.06 + 0.2);
        });
        break;
      }
      case 'modalToggle': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(400, now);
        osc.frequency.exponentialRampToValueAtTime(800, now + 0.1);
        gain.gain.setValueAtTime(0.18 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.16);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.18);
        break;
      }
      case 'checkoutSuccess': {
        // High-energy celebration chime
        [523.25, 659.25, 783.99, 1046.5, 1318.51, 1567.98].forEach((freq, i) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, now + i * 0.08);
          gain.gain.setValueAtTime(0.24 * vol, now + i * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + i * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + i * 0.08);
          osc.stop(now + i * 0.08 + 0.42);
        });
        break;
      }
      case 'filterChange': {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(700, now);
        osc.frequency.exponentialRampToValueAtTime(1000, now + 0.06);
        gain.gain.setValueAtTime(0.15 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.1);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.11);
        break;
      }
    }
  }

  // ----------------------------------------------------
  // 5. Minimal Theme (Subtle clicks)
  // ----------------------------------------------------
  private playMinimalSound(ctx: AudioContext, now: number, type: SoundType, vol: number) {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'sine';

    switch (type) {
      case 'click':
        osc.frequency.setValueAtTime(1200, now);
        gain.gain.setValueAtTime(0.08 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.03);
        break;
      case 'addToCart':
        osc.frequency.setValueAtTime(987.77, now);
        gain.gain.setValueAtTime(0.12 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.09);
        break;
      case 'wishlist':
        osc.frequency.setValueAtTime(1174.66, now);
        gain.gain.setValueAtTime(0.1 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.07);
        break;
      case 'modalToggle':
        osc.frequency.setValueAtTime(600, now);
        gain.gain.setValueAtTime(0.08 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
        break;
      case 'checkoutSuccess':
        osc.frequency.setValueAtTime(1046.5, now);
        gain.gain.setValueAtTime(0.15 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
        break;
      case 'filterChange':
        osc.frequency.setValueAtTime(800, now);
        gain.gain.setValueAtTime(0.06 * vol, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
        break;
    }

    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.26);
  }
}

export const soundFx = new SoundEffectsEngine();
