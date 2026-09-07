import { RaceOutcome } from '../types';

const RIGGING_SCRIPT = [
  'WIN', // Bet 1
  'WIN', // Bet 2
  'LOSE', // Bet 3
  'WIN', // Bet 4
  'LOSE', // Bet 5
  'LOSE', // Bet 6
  'LOSE', // Bet 7
];

export const getExpectedOutcome = (betHistoryCount: number): 'WIN' | 'LOSE' => {
  if (betHistoryCount < RIGGING_SCRIPT.length) {
    return RIGGING_SCRIPT[betHistoryCount] as 'WIN' | 'LOSE';
  }
  // After initial script, ALWAYS lose to simulate rigged gambling addiction phase
  return 'LOSE';
};

export const generateRace = (betHorseId: number, expectedOutcome: 'WIN' | 'LOSE'): RaceOutcome => {
  const otherHorses = [1, 2, 3, 4, 5, 6].filter(id => id !== betHorseId);
  const winnerId = expectedOutcome === 'WIN' 
    ? betHorseId 
    : otherHorses[Math.floor(Math.random() * otherHorses.length)];

  const horsePaths: number[][] = [];
  const steps = 20;

  for (let h = 1; h <= 6; h++) {
    const path = [0];
    let currentPos = 0;
    
    for (let t = 1; t <= steps; t++) {
      if (t === steps) {
        path.push(h === winnerId ? 100 : 75 + Math.random() * 20);
      } else {
        // Base speed
        let speed = Math.random() * 5 + 2; 
        
        // Dramatic effect: rigged loser horse (which player bet on) rushes ahead early
        if (h === betHorseId && expectedOutcome === 'LOSE' && t < 12) {
          speed = Math.random() * 8 + 5; 
        }
        
        // Winner speeds up at the end
        if (h === winnerId && t > 14) {
           speed = Math.random() * 10 + 6; 
        }
        
        currentPos += speed;
        // Cap it before finish line so they don't cross early
        if (currentPos > 93) currentPos = 90 + Math.random() * 3; 
        path.push(currentPos);
      }
    }
    horsePaths.push(path);
  }
  return { winnerId, horsePaths };
};
