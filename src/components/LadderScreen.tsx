import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { LadderOutcome } from '../types';
import { audio } from '../utils/audio';

interface LadderScreenProps {
  balance: number;
  betHistoryCount: number;
  onGameEnd: (newBalance: number, outcome: 'WIN' | 'LOSE') => void;
  onTriggerEducation: () => void;
}

interface HistoryItem extends LadderOutcome {
  round: number;
}

const FAKE_USERS = [
  '수익도사★ 43승 4패 연승구간 진행중',
  '♥호랑이♥ 미니게임 레전드',
  '네임드 NO.1 무료리딩 방',
  '아기상어 라이브 30승 달성',
  '김갑환 확실한 픽 드립니다',
];

// Education rigging: User wins early, then loses everything
const getRiggedLadderOutcome = (betHistoryCount: number, userBet: 'ODD' | 'EVEN'): LadderOutcome => {
  const shouldWin = betHistoryCount === 0 || betHistoryCount === 2 || betHistoryCount === 5;
  const targetResult = shouldWin ? userBet : (userBet === 'ODD' ? 'EVEN' : 'ODD');
  
  // Return a combination that results in the targetResult
  if (targetResult === 'ODD') {
    return Math.random() > 0.5 
      ? { start: 'LEFT', lines: 4, result: 'ODD' }
      : { start: 'RIGHT', lines: 3, result: 'ODD' };
  } else {
    return Math.random() > 0.5 
      ? { start: 'LEFT', lines: 3, result: 'EVEN' }
      : { start: 'RIGHT', lines: 4, result: 'EVEN' };
  }
};

export const LadderScreen: React.FC<LadderScreenProps> = ({ 
  balance, 
  betHistoryCount, 
  onGameEnd 
}) => {
  const [phase, setPhase] = useState<'BETTING' | 'DRAWING' | 'RESULT'>('BETTING');
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betChoice, setBetChoice] = useState<'ODD' | 'EVEN' | null>(null);
  const [outcome, setOutcome] = useState<LadderOutcome | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [round, setRound] = useState(1085 + betHistoryCount);
  const [resultMessage, setResultMessage] = useState<{ text: string, type: 'win' | 'lose' } | null>(null);
  
  // Animation path state
  const [pathProgress, setPathProgress] = useState(0);

  const chips = [10000, 50000, 100000, 500000];
  const LADDER_DURATION = 3500;

  // Initialize fake history
  useEffect(() => {
    const initHistory: HistoryItem[] = [];
    for (let i = 0; i < 6; i++) {
      const isOdd = Math.random() > 0.5;
      const start = Math.random() > 0.5 ? 'LEFT' : 'RIGHT';
      const lines = isOdd ? (start === 'LEFT' ? 4 : 3) : (start === 'LEFT' ? 3 : 4);
      initHistory.push({ round: 1084 + betHistoryCount - i, start, lines, result: isOdd ? 'ODD' : 'EVEN' });
    }
    setHistory(initHistory);
  }, []);

  const handleBetAmount = (amount: number) => {
    if (balance >= betAmount + amount) {
      audio.playBetSound();
      setBetAmount(prev => prev + amount);
    }
  };

  const handleClearBet = () => {
    audio.playClearSound();
    setBetAmount(0);
    setBetChoice(null);
  };

  const handleStartDraw = () => {
    if (betAmount === 0 || !betChoice) return;
    
    setPhase('DRAWING');
    setResultMessage(null);
    audio.playStartBell();

    const roundOutcome = getRiggedLadderOutcome(betHistoryCount, betChoice);
    setOutcome(roundOutcome);
    setPathProgress(0);

    let start: number | null = null;
    let animFrame: number;
    let lastTick = 0;

    const animate = (time: number) => {
      if (start === null) start = time;
      const elapsed = time - start;
      const progress = Math.min(elapsed / LADDER_DURATION, 1);
      setPathProgress(progress);
      
      // Play ticking sound
      if (progress > lastTick + 0.1 && progress < 0.9) {
        audio.playTone(300 + Math.random() * 200, 'square', 0.05, 0.05);
        lastTick = progress;
      }

      if (progress < 1) {
        animFrame = requestAnimationFrame(animate);
      } else {
        setTimeout(() => determineResult(roundOutcome), 500);
      }
    };
    animFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animFrame);
  };

  const determineResult = (finalOutcome: LadderOutcome) => {
    const isWin = finalOutcome.result === betChoice;
    
    setHistory(prev => [{ ...finalOutcome, round }, ...prev.slice(0, 5)]);

    if (isWin) {
      audio.playWinSound();
      const payout = Math.floor(betAmount * 1.95);
      setResultMessage({ text: `적중!\n+${payout.toLocaleString()}원`, type: 'win' });
      setTimeout(() => {
        onGameEnd(balance - betAmount + payout, 'WIN');
        resetRound();
      }, 3000);
    } else {
      audio.playLoseSound();
      setResultMessage({ text: `낙첨\n-${betAmount.toLocaleString()}원`, type: 'lose' });
      setTimeout(() => {
        onGameEnd(balance - betAmount, 'LOSE');
        resetRound();
      }, 2500);
    }
    setPhase('RESULT');
  };

  const resetRound = () => {
    setPhase('BETTING');
    setBetAmount(0);
    setBetChoice(null);
    setOutcome(null);
    setRound(prev => prev + 1);
    setResultMessage(null);
  };

  // Build SVG Path based on outcome
  const getPathString = (outcome: LadderOutcome | null) => {
    if (!outcome) return "";
    const isLeftStart = outcome.start === 'LEFT';
    const has4Lines = outcome.lines === 4;
    
    // Grid: L(30), R(70). Y: Start(10), End(90). Rungs: 25, 45, 65, 85
    if (isLeftStart) {
      if (!has4Lines) {
        // Left-3-Even
        return "M 30 10 L 30 25 L 70 25 L 70 45 L 30 45 L 30 65 L 70 65 L 70 90";
      } else {
        // Left-4-Odd
        return "M 30 10 L 30 25 L 70 25 L 70 45 L 30 45 L 30 65 L 70 65 L 70 85 L 30 85 L 30 90";
      }
    } else {
      if (!has4Lines) {
        // Right-3-Odd
        return "M 70 10 L 70 25 L 30 25 L 30 45 L 70 45 L 70 65 L 30 65 L 30 90";
      } else {
        // Right-4-Even
        return "M 70 10 L 70 25 L 30 25 L 30 45 L 70 45 L 70 65 L 30 65 L 30 85 L 70 85 L 70 90";
      }
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#f4e6eb] font-sans text-gray-800 relative select-none">
      
      {/* Fake Browser/Header */}
      <div className="bg-[#d4b5c4] text-white px-4 py-2 flex justify-between items-center shadow-sm">
        <span className="font-black-han text-lg md:text-xl tracking-wide text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] animate-pulse">영천중학교 김진균선생님과 함께 도박예방</span>
        <span className="text-pink-700 text-sm font-bold tracking-widest">{round}회차 진행중</span>
      </div>

      <div className="flex flex-1 overflow-hidden p-2 md:p-4 gap-2 md:gap-4">
        
        {/* Left Panel: Fake Leaderboard/Chat */}
        <div className="hidden md:flex w-64 bg-[#a58b97] rounded-xl flex-col border-4 border-[#c5a8b6] shadow-lg overflow-hidden">
          <div className="bg-[#8a6e79] text-white font-bold py-2 text-center text-lg shadow-sm">픽분석 보드</div>
          <div className="flex-1 p-2 overflow-y-auto space-y-2 bg-[#bca7b1]">
            <div className="bg-[#e8d5de] rounded-lg p-3 text-center border-2 border-white shadow-sm mb-4">
              <div className="w-16 h-16 bg-white rounded-full mx-auto mb-2 flex items-center justify-center text-2xl shadow-inner border-2 border-gray-300">😎</div>
              <p className="font-bold text-sm text-pink-700">{FAKE_USERS[0]}</p>
              <button className="mt-2 bg-pink-500 text-white text-xs px-3 py-1 rounded-full font-bold shadow-sm hover:bg-pink-600">무료픽 신청하기</button>
            </div>
            {FAKE_USERS.slice(1).map((user, idx) => (
              <div key={idx} className="bg-[#e8d5de] rounded px-3 py-2 text-xs font-bold text-gray-700 border border-white shadow-sm flex items-center gap-2">
                <span className="bg-white rounded-full w-5 h-5 flex items-center justify-center text-pink-500 shadow-inner">{idx+2}</span>
                {user}
              </div>
            ))}
          </div>
        </div>

        {/* Center Panel: Main Ladder Area */}
        <div className="flex-1 bg-[#c5a8b6] rounded-xl flex flex-col border-4 border-[#e8d5de] shadow-lg overflow-hidden relative">
          
          <div className="absolute top-2 w-full text-center z-10 pointer-events-none">
            <h1 className="text-3xl md:text-5xl font-black-han text-white drop-shadow-[0_4px_4px_rgba(0,0,0,0.3)] stroke-black tracking-widest">
              SPEED LADDER
            </h1>
          </div>

          {/* SVG Ladder Container */}
          <div className="flex-1 bg-[#d4b5c4] m-4 mt-16 rounded-xl border-4 border-[#a58b97] relative shadow-inner overflow-hidden flex items-center justify-center">
            
            <svg viewBox="0 0 100 100" className="w-full max-h-full max-w-sm absolute inset-0 m-auto">
              {/* Background Grid */}
              <line x1="30" y1="10" x2="30" y2="90" stroke="#a58b97" strokeWidth="2" />
              <line x1="70" y1="10" x2="70" y2="90" stroke="#a58b97" strokeWidth="2" />
              <line x1="30" y1="25" x2="70" y2="25" stroke="#a58b97" strokeWidth="2" />
              <line x1="30" y1="45" x2="70" y2="45" stroke="#a58b97" strokeWidth="2" />
              <line x1="30" y1="65" x2="70" y2="65" stroke="#a58b97" strokeWidth="2" />
              <line x1="30" y1="85" x2="70" y2="85" stroke="#a58b97" strokeWidth="2" />

              {/* Start & End Labels (Circles) */}
              <circle cx="30" cy="5" r="4" fill="#ef4444" stroke="white" strokeWidth="0.5"/>
              <text x="30" y="6.5" fontSize="3" fill="white" textAnchor="middle" fontWeight="bold">좌</text>
              
              <circle cx="70" cy="5" r="4" fill="#3b82f6" stroke="white" strokeWidth="0.5"/>
              <text x="70" y="6.5" fontSize="3" fill="white" textAnchor="middle" fontWeight="bold">우</text>
              
              <circle cx="30" cy="95" r="4" fill="#3b82f6" stroke="white" strokeWidth="0.5"/>
              <text x="30" y="96.5" fontSize="3" fill="white" textAnchor="middle" fontWeight="bold">홀</text>
              
              <circle cx="70" cy="95" r="4" fill="#ef4444" stroke="white" strokeWidth="0.5"/>
              <text x="70" y="96.5" fontSize="3" fill="white" textAnchor="middle" fontWeight="bold">짝</text>

              {/* Animated Path */}
              {phase !== 'BETTING' && outcome && (
                <motion.path
                  d={getPathString(outcome)}
                  fill="none"
                  stroke="#fbbf24"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: pathProgress }}
                  transition={{ duration: 0 }} // Managed via requestAnimationFrame state
                />
              )}
            </svg>

            {/* Waiting text */}
            {phase === 'BETTING' && (
              <div className="absolute bottom-4 bg-black/60 text-white px-4 py-1 rounded-full text-sm font-bold tracking-widest animate-pulse">
                {round}회차 추첨 대기중...
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: History */}
        <div className="w-48 md:w-64 bg-[#a58b97] rounded-xl flex flex-col border-4 border-[#c5a8b6] shadow-lg overflow-hidden">
          <div className="bg-[#8a6e79] text-white font-bold py-2 text-center text-sm md:text-lg shadow-sm">지난회차결과</div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 bg-[#bca7b1]">
            <AnimatePresence>
              {history.map((h, i) => (
                <motion.div 
                  key={h.round}
                  initial={i === 0 ? { height: 0, opacity: 0 } : false}
                  animate={{ height: 'auto', opacity: 1 }}
                  className="bg-[#8a6e79] rounded-lg p-2 text-center shadow-inner border border-gray-400"
                >
                  <div className="text-white text-xs font-bold mb-1">{h.round}</div>
                  <div className="flex justify-center gap-1 md:gap-2">
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-md ${h.start === 'LEFT' ? 'bg-red-500' : 'bg-blue-500'}`}>
                      {h.start === 'LEFT' ? '좌' : '우'}
                    </div>
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-md ${h.lines === 3 ? 'bg-blue-500' : 'bg-red-500'}`}>
                      {h.lines}
                    </div>
                    <div className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white text-xs md:text-sm font-bold shadow-md ${h.result === 'ODD' ? 'bg-blue-500' : 'bg-red-500'}`}>
                      {h.result === 'ODD' ? '홀' : '짝'}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="flex-none bg-gray-800 border-t-4 border-gray-900 p-2 md:p-3 flex items-stretch justify-between gap-3 shadow-inner h-24 md:h-28 z-20">
        
        {/* Bet Selection Buttons */}
        <div className="flex gap-2 min-w-[120px] md:min-w-[180px]">
          <button
            onClick={() => { if(phase==='BETTING') { audio.playBetSound(); setBetChoice('ODD'); } }}
            disabled={phase !== 'BETTING'}
            className={`flex-1 rounded-lg border-b-4 font-black-han text-xl md:text-3xl transition-all shadow-md flex items-center justify-center ${
              betChoice === 'ODD' 
              ? 'bg-blue-500 border-blue-700 text-white transform translate-y-1 border-b-0' 
              : 'bg-blue-600 border-blue-800 text-gray-200 hover:bg-blue-500 disabled:opacity-50'
            }`}
          >
            홀
          </button>
          <button
            onClick={() => { if(phase==='BETTING') { audio.playBetSound(); setBetChoice('EVEN'); } }}
            disabled={phase !== 'BETTING'}
            className={`flex-1 rounded-lg border-b-4 font-black-han text-xl md:text-3xl transition-all shadow-md flex items-center justify-center ${
              betChoice === 'EVEN' 
              ? 'bg-red-500 border-red-700 text-white transform translate-y-1 border-b-0' 
              : 'bg-red-600 border-red-800 text-gray-200 hover:bg-red-500 disabled:opacity-50'
            }`}
          >
            짝
          </button>
        </div>

        {/* Balances */}
        <div className="flex flex-col justify-center gap-1 min-w-[140px] px-3 bg-gray-900 rounded border border-gray-700 shadow-lg">
          <div className="flex justify-between items-end">
            <span className="text-gray-400 text-xs">보유</span>
            <span className="text-yellow-400 text-sm md:text-base font-bold">{balance.toLocaleString()} 원</span>
          </div>
          <div className="flex justify-between items-end border-t border-gray-700 pt-1">
            <span className="text-gray-400 text-xs">베팅</span>
            <span className="text-green-400 text-sm md:text-base font-bold">{betAmount.toLocaleString()} 원</span>
          </div>
          <div className="text-center text-[10px] text-gray-500 mt-1">배당률: 1.95</div>
        </div>
        
        {/* Betting Chips & Actions */}
        <div className="flex-1 flex flex-col justify-center gap-1.5 h-full">
          <div className="flex items-center gap-1.5 flex-wrap">
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => handleBetAmount(chip)}
                disabled={phase !== 'BETTING' || balance < betAmount + chip}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs font-bold py-1.5 rounded border border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
              >
                {(chip / 10000)}만
              </button>
            ))}
            <button
              onClick={() => handleBetAmount(balance - betAmount)}
              disabled={phase !== 'BETTING' || balance === betAmount || balance === 0}
              className="flex-1 bg-red-800 hover:bg-red-700 text-white text-xs font-bold py-1.5 rounded border border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
            >
              올인
            </button>
            <button
              onClick={handleClearBet}
              disabled={phase !== 'BETTING' || betAmount === 0}
              className="bg-gray-600 hover:bg-gray-500 text-white text-xs font-bold py-1.5 px-3 rounded border border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ml-auto whitespace-nowrap"
            >
              취소
            </button>
          </div>
          
          <button 
            onClick={handleStartDraw}
            disabled={phase !== 'BETTING' || betAmount === 0 || !betChoice}
            className="sheen w-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-black-han text-sm md:text-lg py-1.5 rounded border-2 border-yellow-700 shadow-[0_0_14px_rgba(250,204,21,0.45),inset_0_1px_0_rgba(255,255,255,0.5)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all whitespace-nowrap"
          >
            {phase === 'BETTING' ? '홀짝 베팅 확정 (추첨 시작)' : '추첨 진행 중...'}
          </button>
        </div>
      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {resultMessage && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className={`bg-white border-8 ${resultMessage.type === 'win' ? 'border-blue-600' : 'border-red-600'} p-10 rounded-2xl shadow-2xl text-center max-w-lg w-full transform -translate-y-10`}>
              <h2 className={`text-6xl md:text-7xl font-black-han mb-6 ${resultMessage.type === 'win' ? 'text-blue-600' : 'text-red-600'}`}>
                {resultMessage.type === 'win' ? '적중!' : '낙첨'}
              </h2>
              <p className="text-3xl font-bold whitespace-pre-line text-black leading-snug">
                {resultMessage.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
