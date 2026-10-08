/**
 * Système Audio Tactique & Synthétiseur Web Audio
 * Fournit les bruitages militaires (clics keypad, alerte, succès, bougies)
 * et une bande-son synthétisée dynamique style Call of Duty / Joyeux Anniversaire.
 */

class SoundSystem {
  private ctx: AudioContext | null = null;
  private musicGainNode: GainNode | null = null;
  private musicOscillators: OscillatorNode[] = [];
  private isMusicPlaying: boolean = false;
  private isMuted: boolean = false;
  private musicInterval: number | null = null;
  private currentStep: number = 0;
  private audioAnalyser: AnalyserNode | null = null;
  private customAudioElement: HTMLAudioElement | null = null;
  private customSourceNode: MediaElementAudioSourceNode | null = null;

  private initContext() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioCtx();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Bip de touche du clavier tactique
  public playKeypadBeep(freq = 1200) {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(freq * 0.8, this.ctx.currentTime + 0.06);

      gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.06);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.07);
    } catch {
      // Audio context might fail before user interaction
    }
  }

  // Erreur de code
  public playErrorBuzz() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, this.ctx.currentTime);
      osc.frequency.setValueAtTime(120, this.ctx.currentTime + 0.12);

      gain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.26);
    } catch {
      // ignore
    }
  }

  // Déverrouillage réussi - Radio militaire & fanfare tactique
  public playAccessGranted() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const notes = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
      notes.forEach((freq, idx) => {
        if (!this.ctx) return;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const startTime = this.ctx.currentTime + idx * 0.09;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.15, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.26);
      });
    } catch {
      // ignore
    }
  }

  // Souffle de bougie
  public playCandleSound(extinguish: boolean) {
    try {
      this.initContext();
      if (!this.ctx) return;
      
      const bufferSize = this.ctx.sampleRate * 0.2;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.4));
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = extinguish ? 'lowpass' : 'bandpass';
      filter.frequency.setValueAtTime(extinguish ? 400 : 1200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.2);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch {
      // ignore
    }
  }

  // Son de frappe terminal / machine à écrire
  public playTerminalClick() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800 + Math.random() * 400, this.ctx.currentTime);
      gain.gain.setValueAtTime(0.04, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.05);
    } catch {
      // ignore
    }
  }

  // Son de bris de sceau de cire
  public playWaxSealBreak() {
    try {
      this.initContext();
      if (!this.ctx) return;
      const bufferSize = this.ctx.sampleRate * 0.15;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufferSize * 0.2));
      }

      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.setValueAtTime(1200, this.ctx.currentTime);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.18, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.15);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      noise.start();
    } catch {
      // ignore
    }
  }

  // Obtenir le nœud d'analyse audio pour les visualisations du lecteur
  public getAnalyser(): AnalyserNode | null {
    this.initContext();
    if (!this.ctx) return null;
    if (!this.audioAnalyser) {
      this.audioAnalyser = this.ctx.createAnalyser();
      this.audioAnalyser.fftSize = 64;
    }
    return this.audioAnalyser;
  }

  // Démarrer la musique de fond synthétisée (Mélodie tactique d'anniversaire)
  public setMuted(muted: boolean) {
    this.isMuted = muted;

    if (this.musicGainNode && this.ctx) {
      const targetGain = muted ? 0 : 0.12;
      this.musicGainNode.gain.setValueAtTime(targetGain, this.ctx.currentTime);
    }

    if (this.customAudioElement) {
      this.customAudioElement.muted = muted;
      this.customAudioElement.volume = muted ? 0 : 1;
    }
  }

  public toggleMute(): boolean {
    const nextMuted = !this.isMuted;
    this.setMuted(nextMuted);
    return nextMuted;
  }

  public startBackgroundMusic(onStateChange?: (playing: boolean) => void) {
    this.initContext();
    if (!this.ctx) return;
    if (this.isMusicPlaying) return;

    this.isMusicPlaying = true;
    if (onStateChange) onStateChange(true);

    const analyser = this.getAnalyser();
    this.musicGainNode = this.ctx.createGain();
    this.musicGainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.12, this.ctx.currentTime);

    if (analyser && this.musicGainNode) {
      this.musicGainNode.connect(analyser);
      analyser.connect(this.ctx.destination);
    } else if (this.musicGainNode) {
      this.musicGainNode.connect(this.ctx.destination);
    }

    // Mélodie inspirée du thème Joyeux Anniversaire dans un arrangement épique / dark tactical
    // Notes: Sol, Sol, La, Sol, Do, Si | Sol, Sol, La, Sol, Ré, Do
    const melodyNotes = [
      196.00, 196.00, 220.00, 196.00, 261.63, 246.94, // G3, G3, A3, G3, C4, B3
      196.00, 196.00, 220.00, 196.00, 293.66, 261.63, // G3, G3, A3, G3, D4, C4
      196.00, 196.00, 392.00, 329.63, 261.63, 246.94, 220.00, // G3, G3, G4, E4, C4, B3, A3
      349.23, 349.23, 329.63, 261.63, 293.66, 261.63  // F4, F4, E4, C4, D4, C4
    ];

    const bassNotes = [
      98.00, 98.00, 110.00, 98.00, 130.81, 123.47,
      98.00, 98.00, 110.00, 98.00, 146.83, 130.81,
      98.00, 98.00, 98.00, 82.41, 130.81, 123.47, 110.00,
      87.31, 87.31, 82.41, 130.81, 146.83, 130.81
    ];

    this.currentStep = 0;

    const playNote = () => {
      if (!this.isMusicPlaying || !this.ctx || !this.musicGainNode) return;

      const noteIdx = this.currentStep % melodyNotes.length;
      const freq = melodyNotes[noteIdx];
      const bassFreq = bassNotes[noteIdx % bassNotes.length];

      // Oscilateur principal mélodie
      const osc = this.ctx.createOscillator();
      const noteGain = this.ctx.createGain();
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      noteGain.gain.setValueAtTime(0.08, this.ctx.currentTime);
      noteGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.38);

      osc.connect(noteGain);
      noteGain.connect(this.musicGainNode);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.4);

      // Oscilateur basse tactique
      const bassOsc = this.ctx.createOscillator();
      const bassGain = this.ctx.createGain();
      bassOsc.type = 'triangle';
      bassOsc.frequency.setValueAtTime(bassFreq * 0.5, this.ctx.currentTime);

      bassGain.gain.setValueAtTime(0.12, this.ctx.currentTime);
      bassGain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.35);

      bassOsc.connect(bassGain);
      bassGain.connect(this.musicGainNode);

      bassOsc.start();
      bassOsc.stop(this.ctx.currentTime + 0.36);

      this.currentStep++;
    };

    playNote();
    this.musicInterval = window.setInterval(playNote, 420);
  }

  // Arrêter la musique synthétisée
  public stopBackgroundMusic(onStateChange?: (playing: boolean) => void) {
    this.isMusicPlaying = false;
    if (this.musicInterval !== null) {
      clearInterval(this.musicInterval);
      this.musicInterval = null;
    }
    if (this.customAudioElement) {
      this.customAudioElement.pause();
      this.customAudioElement.currentTime = 0;
    }
    if (onStateChange) onStateChange(false);
  }

  // Jouer un fichier audio personnalisé fourni par l'utilisateur
  public playCustomAudio(fileOrUrl: File | string, onEnded?: () => void) {
    this.stopBackgroundMusic();
    this.initContext();

    if (!this.customAudioElement) {
      this.customAudioElement = new Audio();
    }

    if (typeof fileOrUrl === 'string') {
      this.customAudioElement.src = fileOrUrl;
    } else {
      this.customAudioElement.src = URL.createObjectURL(fileOrUrl);
    }

    this.customAudioElement.loop = true;
    this.customAudioElement.muted = this.isMuted;
    this.customAudioElement.volume = this.isMuted ? 0 : 1;
    this.customAudioElement.onended = onEnded || null;

    if (this.ctx && !this.customSourceNode && this.customAudioElement) {
      try {
        this.customSourceNode = this.ctx.createMediaElementSource(this.customAudioElement);
        const analyser = this.getAnalyser();
        if (analyser) {
          this.customSourceNode.connect(analyser);
          analyser.connect(this.ctx.destination);
        } else {
          this.customSourceNode.connect(this.ctx.destination);
        }
      } catch {
        // already connected
      }
    }

    this.customAudioElement.play().catch(() => {
      // autoplay restriction handled by user click
    });
    this.isMusicPlaying = true;
  }

  public toggleMusic(onStateChange?: (playing: boolean) => void): boolean {
    if (this.isMusicPlaying) {
      this.stopBackgroundMusic(onStateChange);
      return false;
    } else {
      this.startBackgroundMusic(onStateChange);
      return true;
    }
  }

  public isPlaying(): boolean {
    return this.isMusicPlaying;
  }

  // Jouer 2 fichiers audio simultanément avec des volumes différents
  public playDualAudio(url1: string, url2: string, volume1: number = 0.7, volume2: number = 0.4) {
    this.initContext();
    if (!this.ctx) return;

    // Premier fichier audio
    const audio1 = new Audio();
    audio1.src = url1;
    audio1.volume = Math.max(0, Math.min(1, volume1));

    // Deuxième fichier audio
    const audio2 = new Audio();
    audio2.src = url2;
    audio2.volume = Math.max(0, Math.min(1, volume2));

    // Jouer les deux en même temps
    audio1.play().catch(() => console.log('Audio 1 playback failed'));
    audio2.play().catch(() => console.log('Audio 2 playback failed'));
  }
}

export const tacticalAudio = new SoundSystem();
