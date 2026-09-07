export const RIGGED_ROUNDS = [
  { isWin: true, k: 0.8, minBetPct: 0.1, intent: '초심자의 행운' },
  { isWin: false, k: -1.0, minBetPct: 0.1, intent: '긴장 유발' },
  { isWin: true, k: 1.2, minBetPct: 0.15, intent: '회복 경험' },
  { isWin: true, k: 2.0, minBetPct: 0.2, intent: '과신 형성' },
  { isWin: true, k: 0.6, minBetPct: 0.25, intent: '최고점 도달' },
  { isWin: false, k: -1.0, minBetPct: 0.3, intent: '하락 시작' },
  { isWin: false, k: -1.0, minBetPct: 0.35, intent: '본전 심리' },
  { isWin: false, k: -1.0, minBetPct: 0.4, intent: '추격 배팅' },
  { isWin: true, k: 1.0, minBetPct: 0.45, intent: '거짓 희망' },
  { isWin: false, k: -1.0, minBetPct: 1.0, intent: '파산 확정' },
];

export const getRiggedLogic = (betCount: number) => {
  const index = Math.min(betCount, RIGGED_ROUNDS.length - 1);
  return RIGGED_ROUNDS[index];
};
