import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { SlotOutcome } from '../types';
import { audio } from '../utils/audio';

interface SlotScreenProps {
  balance: number;
  betHistoryCount: number;
  onGameEnd: (newBalance: number, outcome: 'WIN' | 'LOSE') => void;
  onTriggerEducation: () => void;
  onBack: () => void;
}

const SYMBOLS = ['🍒', '🍋', '🍇', '🍉', '🔔', '💎', '7️⃣'];
const SPIN_DURATION = 3000; // 3 seconds

// Education rigging: User wins early to get hooked, then loses everything
const getRiggedSlotOutcome = (betHistoryCount: number): SlotOutcome => {
  if (betHistoryCount === 0 || betHistoryCount === 2) {
    // Teaser win: 3 of a kind
    const winSymbol = SYMBOLS[Math.floor(Math.random() * 4)]; // Pick a low tier fruit
    return { reels: [winSymbol, winSymbol, winSymbol], multiplier: 3 };
  } else if (betHistoryCount === 5) {
     // Big win to completely hook them before the fall
     return { reels: ['7️⃣', '7️⃣', '7️⃣'], multiplier: 10 };
  } else {
    // Guaranteed lose
    return { reels: ['🍒', '🍋', '💎'], multiplier: 0 };
  }
};

export const SlotScreen: React.FC<SlotScreenProps> = ({ 
  balance, 
  betHistoryCount, 
  onGameEnd,
  onTriggerEducation,
  onBack
}) => {
  const [phase, setPhase] = useState<'BETTING' | 'SPINNING' | 'RESULT'>('BETTING');
  const [betAmount, setBetAmount] = useState<number>(0);
  const [reels, setReels] = useState<string[]>(['🎰', '🎰', '🎰']);
  const [spinning, setSpinning] = useState([false, false, false]);
  const [resultMessage, setResultMessage] = useState<{ text: string, type: 'win' | 'lose' } | null>(null);

  const chips = [10000, 50000, 100000, 500000];

  const handleBet = (amount: number) => {
    if (balance >= betAmount + amount) {
      audio.playBetSound();
      setBetAmount(prev => prev + amount);
    }
  };

  const handleClearBet = () => {
    audio.playClearSound();
    setBetAmount(0);
  };

  const handleSpin = () => {
    if (betAmount === 0) return;
    
    setPhase('SPINNING');
    setResultMessage(null);
    audio.playStartBell();
    // Simulate mechanical spinning sound
    audio.playTone(150, 'sawtooth', 0.5, 0.1);

    const outcome = getRiggedSlotOutcome(betHistoryCount);
    
    // Start spin animation state
    setSpinning([true, true, true]);

    // Reel 1 stops
    setTimeout(() => {
      setSpinning(prev => [false, prev[1], prev[2]]);
      setReels(prev => [outcome.reels[0], prev[1], prev[2]]);
      audio.playTone(300, 'square', 0.1, 0.1);
    }, SPIN_DURATION * 0.4);

    // Reel 2 stops
    setTimeout(() => {
      setSpinning(prev => [prev[0], false, prev[2]]);
      setReels(prev => [prev[0], outcome.reels[1], prev[2]]);
      audio.playTone(300, 'square', 0.1, 0.1);
    }, SPIN_DURATION * 0.7);

    // Reel 3 stops & Result
    setTimeout(() => {
      setSpinning([false, false, false]);
      setReels(outcome.reels);
      audio.playTone(400, 'square', 0.2, 0.15);
      
      determineResult(outcome);
    }, SPIN_DURATION);
  };

  const determineResult = (outcome: SlotOutcome) => {
    const isWin = outcome.multiplier > 0;
    
    if (isWin) {
      audio.playWinSound();
      const payout = betAmount * outcome.multiplier;
      setResultMessage({ text: `JACKPOT!\n+${payout.toLocaleString()}원`, type: 'win' });
      setTimeout(() => {
        onGameEnd(balance - betAmount + payout, 'WIN');
        resetRound();
      }, 3000);
    } else {
      audio.playLoseSound();
      setResultMessage({ text: `꽝\n-${betAmount.toLocaleString()}원`, type: 'lose' });
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
    setResultMessage(null);
  };

  // Fast fake spinning effect for UI
  useEffect(() => {
    let interval: number;
    if (spinning.some(s => s)) {
      interval = window.setInterval(() => {
        setReels(prev => prev.map((r, i) => spinning[i] ? SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)] : r));
      }, 100);
    }
    return () => clearInterval(interval);
  }, [spinning]);

  return (
    <div className="flex flex-col h-screen w-full bg-[#1a0f2e] font-sans text-white relative select-none items-center justify-center">
      
      {/* Header */}
      <div className="absolute top-0 w-full bg-gradient-to-r from-purple-900 to-indigo-900 text-white text-center py-3 border-b-4 border-pink-500 shadow-[0_0_15px_rgba(236,72,153,0.5)] z-10 flex justify-center items-center">
        <h1 className="text-2xl md:text-4xl font-black-han tracking-widest text-yellow-300 drop-shadow-[0_0_12px_rgba(253,224,71,0.9)] animate-pulse">영천중학교 김진균선생님과 함께 도박예방</h1>
      </div>

      {/* Main Machine Container */}
      <div className="w-full max-w-4xl bg-gray-900 rounded-3xl border-8 border-gray-700 p-8 shadow-2xl flex flex-col gap-8 mt-16">
        
        {/* Reels Area */}
        <div className="bg-gray-800 rounded-2xl border-4 border-gray-600 p-6 shadow-inner">
           <div className="flex justify-between items-center bg-black p-4 rounded-xl border-2 border-gray-700 h-48 md:h-64 relative overflow-hidden">
             
             {/* Payline indicator */}
             <div className="absolute top-1/2 left-0 w-full h-1 bg-red-500/50 -translate-y-1/2 z-0"></div>

             {reels.map((symbol, i) => (
                <div key={i} className="flex-1 flex justify-center items-center h-full relative z-10">
                  <motion.div
                    key={`${i}-${symbol}-${spinning[i]}`} // Force re-render for animation
                    initial={spinning[i] ? { y: -50, opacity: 0.5 } : { y: 0, opacity: 1 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={spinning[i] ? { duration: 0.1, repeat: Infinity } : { type: 'spring' }}
                    className="text-6xl md:text-8xl bg-white text-black w-24 h-32 md:w-32 md:h-40 flex items-center justify-center rounded-xl border-4 border-gray-300 shadow-inner"
                  >
                    {symbol}
                  </motion.div>
                </div>
             ))}
           </div>
        </div>

        {/* Control Panel (Similar compact style to Race) */}
        <div className="bg-gray-800 border-t-4 border-gray-700 p-4 rounded-xl flex flex-col md:flex-row items-center justify-between gap-4 shadow-inner">
            
            {/* Balances */}
            <div className="flex flex-col justify-center h-full gap-2 min-w-[160px] p-4 bg-black rounded-lg border border-gray-700 shadow-lg">
              <div className="flex justify-between items-end">
                <span className="text-gray-400 text-xs">보유 금액</span>
                <span className="text-yellow-400 text-lg md:text-xl font-bold">{balance.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between items-end border-t border-gray-800 pt-2">
                <span className="text-gray-400 text-xs">현재 베팅</span>
                <span className="text-green-400 text-lg md:text-xl font-bold">{betAmount.toLocaleString()} 원</span>
              </div>
            </div>
            
            {/* Betting Chips & Actions */}
            <div className="flex-1 flex flex-col justify-center gap-2 w-full">
              <div className="flex items-center gap-2 flex-wrap">
                {chips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleBet(chip)}
                    disabled={phase !== 'BETTING' || balance < betAmount + chip}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-sm font-bold py-2 rounded border border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
                  >
                    {(chip / 10000)}만
                  </button>
                ))}
                <button
                  onClick={() => handleBet(balance - betAmount)}
                  disabled={phase !== 'BETTING' || balance === betAmount || balance === 0}
                  className="flex-1 bg-red-800 hover:bg-red-700 text-white text-sm font-bold py-2 rounded border border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
                >
                  MAX
                </button>
                <button
                  onClick={handleClearBet}
                  disabled={phase !== 'BETTING' || betAmount === 0}
                  className="bg-gray-600 hover:bg-gray-500 text-white text-sm font-bold py-2 px-4 rounded border border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ml-auto whitespace-nowrap"
                >
                  취소
                </button>
              </div>
              
              <button 
                onClick={handleSpin}
                disabled={phase !== 'BETTING' || betAmount === 0}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-black-han text-xl md:text-2xl py-3 rounded-lg border-2 border-pink-400 shadow-[0_0_15px_rgba(236,72,153,0.5)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all mt-2"
              >
                {phase === 'BETTING' ? 'SPIN !' : '회전 중...'}
              </button>
            </div>
        </div>

      </div>

      {/* Result Overlay */}
      <AnimatePresence>
        {resultMessage && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className={`bg-gray-900 border-4 ${resultMessage.type === 'win' ? 'border-yellow-400' : 'border-red-600'} p-10 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] text-center max-w-lg w-full`}>
              <h2 className={`text-6xl md:text-7xl font-black-han mb-6 ${resultMessage.type === 'win' ? 'text-yellow-400 drop-shadow-[0_0_10px_rgba(250,204,21,1)]' : 'text-red-600'}`}>
                {resultMessage.type === 'win' ? 'WIN!' : 'LOSE'}
              </h2>
              <p className="text-3xl font-bold whitespace-pre-line text-white">
                {resultMessage.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
