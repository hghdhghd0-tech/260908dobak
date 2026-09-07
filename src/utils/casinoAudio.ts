let audioCtx: AudioContext | null = null;
let isPlaying = false;
let nextNoteTime = 0;
let currentNote = 0;
let timerID: number | undefined;

// C Major Pentatonic Scale for a bright, exciting casino feel
const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25]; // C4, D4, E4, G4, A4, C5
const bassScale = [65.41, 73.42, 82.41, 98.00]; // C2, D2, E2, G2

function playNote(time: number, freq: number, type: OscillatorType, duration: number, vol: number) {
  if (!audioCtx) return;
  const osc = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();
  
  osc.type = type;
  osc.frequency.value = freq;
  
  // Quick attack, exponential decay for a "plucky" synth sound
  gainNode.gain.setValueAtTime(0, time);
  gainNode.gain.linearRampToValueAtTime(vol, time + 0.02);
  gainNode.gain.exponentialRampToValueAtTime(0.001, time + duration);
  
  osc.connect(gainNode);
  gainNode.connect(audioCtx.destination);
  
  osc.start(time);
  osc.stop(time + duration);
}

function schedule() {
  if (!audioCtx) return;
  
  // Schedule notes slightly ahead of time
  while (nextNoteTime < audioCtx.currentTime + 0.1) {
    // 1. Driving Bassline (Every 8th note)
    if (currentNote % 2 === 0) {
      const bassNote = bassScale[(currentNote / 2) % bassScale.length];
      playNote(nextNoteTime, bassNote, 'sawtooth', 0.2, 0.15);
    }

    // 2. Fast Arpeggio (Every 16th note)
    // Create a rising/falling pattern to simulate slots spinning
    const arpeggioIndex = currentNote % scale.length;
    const note = scale[arpeggioIndex];
    playNote(nextNoteTime, note * 2, 'square', 0.1, 0.05);
    
    // 3. Occasional "Jackpot / Coin" Chime
    if (Math.random() < 0.05) {
      playNote(nextNoteTime, 1046.50, 'sine', 0.4, 0.15); // C6
      playNote(nextNoteTime + 0.1, 1318.51, 'sine', 0.6, 0.15); // E6
      playNote(nextNoteTime + 0.2, 1567.98, 'sine', 0.8, 0.15); // G6
    }

    // 4. "Ticking" sound (simulating a roulette wheel or slot reel)
    playNote(nextNoteTime, 8000, 'triangle', 0.05, 0.01);

    nextNoteTime += 0.12; // Fast tempo (approx 125 BPM)
    currentNote++;
  }
  
  timerID = requestAnimationFrame(schedule);
}

export const startLobbyMusic = () => {
  if (isPlaying) return;
  
  // Initialize AudioContext on first user interaction
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  
  // If the context was suspended by the browser, resume it
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  isPlaying = true;
  nextNoteTime = audioCtx.currentTime + 0.1;
  schedule();
};

export const stopLobbyMusic = () => {
  if (!isPlaying) return;
  isPlaying = false;
  if (timerID) {
    cancelAnimationFrame(timerID);
  }
  if (audioCtx) {
    audioCtx.suspend();
  }
};
