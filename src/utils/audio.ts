class AudioEngine {
  ctx: AudioContext | null = null;
  gallopInterval: number | null = null;
  bgmOscillator: OscillatorNode | null = null;

  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq: number, type: OscillatorType, duration: number, vol = 0.1) {
    if (!this.ctx) return;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc.type = type;
    osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
    
    gain.gain.setValueAtTime(vol, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + duration);
    
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc.start();
    osc.stop(this.ctx.currentTime + duration);
  }

  playBetSound() {
    // Sharp high-pitched click, like a casino chip
    this.playTone(1200, 'square', 0.05, 0.2);
    setTimeout(() => this.playTone(1600, 'sine', 0.05, 0.2), 30);
  }

  playClearSound() {
    this.playTone(300, 'sawtooth', 0.1, 0.2);
  }

  playStartBell() {
    this.playTone(880, 'sine', 0.6, 0.3);
    setTimeout(() => this.playTone(880, 'sine', 1.0, 0.3), 300);
  }

  startGallop() {
    if (!this.ctx) return;
    // Simulate galloping with low frequency bursts
    this.gallopInterval = window.setInterval(() => {
      this.playTone(100, 'square', 0.05, 0.1);
      setTimeout(() => this.playTone(120, 'square', 0.05, 0.08), 80);
      setTimeout(() => this.playTone(90, 'square', 0.05, 0.05), 160);
    }, 300);
  }

  stopGallop() {
    if (this.gallopInterval !== null) {
      clearInterval(this.gallopInterval);
      this.gallopInterval = null;
    }
  }

  playWinSound() {
    this.stopGallop();
    // Fast, exciting jackpot arpeggio
    const notes = [659.25, 880, 1046.50, 1318.51, 1760, 2093]; 
    for (let j = 0; j < 3; j++) {
      notes.forEach((freq, i) => {
        setTimeout(() => this.playTone(freq, 'square', 0.1, 0.15), (j * notes.length + i) * 60);
      });
    }
  }

  playLoseSound() {
    this.stopGallop();
    // Sharp, harsh buzzer
    this.playTone(150, 'sawtooth', 0.4, 0.3);
    this.playTone(160, 'square', 0.4, 0.3);
    setTimeout(() => {
      this.playTone(100, 'sawtooth', 0.8, 0.4);
      this.playTone(105, 'square', 0.8, 0.4);
    }, 400);
  }

  playLoanPrompt() {
    // Urgent, aggressive alert
    for (let i = 0; i < 4; i++) {
      setTimeout(() => this.playTone(400, 'sawtooth', 0.2, 0.3), i * 300);
      setTimeout(() => this.playTone(300, 'sawtooth', 0.2, 0.3), i * 300 + 150);
    }
  }

  playSolemnBGM() {
    if (!this.ctx) return;
    
    // Calm, solemn, slightly dark drone pad
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sine';
    osc2.type = 'triangle';
    
    // Low, solemn frequencies (e.g., D minor drone)
    osc1.frequency.setValueAtTime(73.42, this.ctx.currentTime); // D2
    osc2.frequency.setValueAtTime(110.00, this.ctx.currentTime); // A2
    
    // Very slow attack, sustain, and release
    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.3, this.ctx.currentTime + 3);
    gain.gain.setValueAtTime(0.3, this.ctx.currentTime + 15);
    gain.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 20);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start();
    osc2.start();
    
    osc1.stop(this.ctx.currentTime + 20);
    osc2.stop(this.ctx.currentTime + 20);
  }

  speakEducationalMessage() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const msg = new SpeechSynthesisUtterance("도박은 절대 이길 수 없는 싸움입니다.");
      msg.lang = 'ko-KR';
      msg.rate = 0.85; // Slightly slower for solemnity
      msg.pitch = 0.8; // Slightly lower pitch
      
      window.speechSynthesis.speak(msg);
    }
  }

  playScaryGlitch() {
    if (!this.ctx) return;
    // Terrifying drone sound for education screen
    const osc1 = this.ctx.createOscillator();
    const osc2 = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    
    osc1.type = 'sawtooth';
    osc2.type = 'square';
    
    osc1.frequency.setValueAtTime(50, this.ctx.currentTime);
    osc2.frequency.setValueAtTime(51, this.ctx.currentTime); // Dissonance
    
    // Modulate frequency to create wobble
    osc1.frequency.linearRampToValueAtTime(10, this.ctx.currentTime + 3);
    osc2.frequency.linearRampToValueAtTime(12, this.ctx.currentTime + 3);

    gain.gain.setValueAtTime(0, this.ctx.currentTime);
    gain.gain.linearRampToValueAtTime(0.4, this.ctx.currentTime + 0.5);
    
    osc1.connect(gain);
    osc2.connect(gain);
    gain.connect(this.ctx.destination);
    
    osc1.start();
    osc2.start();
    
    // Stop after 10 seconds
    osc1.stop(this.ctx.currentTime + 10);
    osc2.stop(this.ctx.currentTime + 10);
  }
}

export const audio = new AudioEngine();
