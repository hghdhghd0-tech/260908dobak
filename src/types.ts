export type GameState = 'LOBBY' | 'INTRO' | 'BETTING' | 'RACING' | 'RESULT' | 'LOAN_PROMPT' | 'GLITCH' | 'EDUCATION';
export type GameMode = 'RACE' | 'SLOT' | 'LADDER' | 'OSTRICH' | null;
export type BetSide = number | null;

export interface RaceOutcome {
  winnerId: number;
  horsePaths: number[][];
}

export interface SlotOutcome {
  reels: string[];
  multiplier: number;
}

export interface LadderOutcome {
  start: 'LEFT' | 'RIGHT';
  lines: 3 | 4;
  result: 'ODD' | 'EVEN';
}

export interface OstrichOutcome {
  result: 'LEFT' | 'RIGHT';
}


