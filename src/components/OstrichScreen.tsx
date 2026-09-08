import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { OstrichOutcome } from '../types';
import { audio } from '../utils/audio';
import { getRiggedLogic } from '../utils/manipulation';

interface OstrichScreenProps {
  balance: number;
  betHistoryCount: number;
  onGameEnd: (newBalance: number, outcome: 'WIN' | 'LOSE') => void;
  onTriggerEducation: () => void;
}

interface HistoryItem {
  round: number;
  result: 'LEFT' | 'RIGHT';
}

const OstrichSVG = ({ isRunning }: { isRunning: boolean }) => (
  <motion.svg 
    viewBox="0 0 100 100" 
    className="w-20 h-20 md:w-32 md:h-32 drop-shadow-xl"
    animate={isRunning ? { y: [0, -10, 0] } : { y: 0 }}
    transition={{ repeat: Infinity, duration: 0.3 }}
  >
    {/* Legs */}
    <motion.line 
      x1="45" y1="60" x2="40" y2="90" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"
      animate={isRunning ? { x2: [40, 30, 40, 50, 40] } : {}}
      transition={{ repeat: Infinity, duration: 0.3, ease: "linear" }}
    />
    <motion.line 
      x1="55" y1="60" x2="60" y2="90" stroke="#f59e0b" strokeWidth="4" strokeLinecap="round"
      animate={isRunning ? { x2: [60, 70, 60, 50, 60] } : {}}
      transition={{ repeat: Infinity, duration: 0.3, ease: "linear", delay: 0.15 }}
    />
    {/* Tail */}
    <path d="M 30 50 Q 15 40 25 35 Q 20 45 30 50" fill="white"/>
    <path d="M 30 50 Q 10 50 15 60 Q 20 55 30 50" fill="#1f2937"/>
    {/* Body */}
    <ellipse cx="50" cy="50" rx="22" ry="16" fill="#1f2937"/>
    <ellipse cx="50" cy="55" rx="18" ry="10" fill="white"/>
    {/* Neck */}
    <path d="M 65 45 Q 75 25 70 12" fill="none" stroke="#fca5a5" strokeWidth="6" strokeLinecap="round"/>
    {/* Head */}
    <circle cx="68" cy="12" r="6" fill="#fca5a5"/>
    <circle cx="70" cy="10" r="1.5" fill="black"/>
    {/* Beak */}
    <polygon points="73,11 82,13 73,15" fill="#f59e0b"/>
  </motion.svg>
);

export const OstrichScreen: React.FC<OstrichScreenProps> = ({ 
  balance, 
  betHistoryCount, 
  onGameEnd 
}) => {
  const [phase, setPhase] = useState<'BETTING' | 'RUNNING' | 'RESULT'>('BETTING');
  const [betAmount, setBetAmount] = useState<number>(0);
  const [betChoice, setBetChoice] = useState<'LEFT' | 'RIGHT' | null>(null);
  const [outcome, setOutcome] = useState<OstrichOutcome | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [round, setRound] = useState(748 + betHistoryCount);
  const [resultMessage, setResultMessage] = useState<{ text: string, type: 'win' | 'lose' } | null>(null);

  const chips = [10000, 50000, 100000, 500000];
  const RUN_DURATION = 5000;

  useEffect(() => {
    const initHistory: HistoryItem[] = [];
    for (let i = 0; i < 8; i++) {
      initHistory.push({ round: 747 + betHistoryCount - i, result: Math.random() > 0.5 ? 'LEFT' : 'RIGHT' });
    }
    setHistory(initHistory);
  }, []);

  const handleBetAmount = (amount: number) => {
    if (balance >= betAmount + amount) {
      audio.playBetSound();
      setBetAmount(prev => prev + amount);
      setShakeButton('AMOUNT');
      setTimeout(() => setShakeButton(null), 300); // clear shake
    }
  };

  const handleClearBet = () => {
    audio.playClearSound();
    setBetAmount(0);
    setBetChoice(null);
  };

  const currentLogic = getRiggedLogic(betHistoryCount);
  const minBetAmount = Math.max(100, Math.floor(balance * currentLogic.minBetPct));
  const isBetValid = betAmount >= minBetAmount && betAmount <= balance;

  const handleStartRun = () => {
    if (betAmount === 0 || !betChoice || !isBetValid) return;
    
    setPhase('RUNNING');
    setResultMessage(null);
    audio.playStartBell();
    audio.startGallop();

    // The outcome is predetermined based on the logic table
    const roundOutcome: OstrichOutcome = { 
      result: currentLogic.isWin ? betChoice : (betChoice === 'LEFT' ? 'RIGHT' : 'LEFT') 
    };
    setOutcome(roundOutcome);

    setTimeout(() => {
      determineResult(roundOutcome);
    }, RUN_DURATION);
  };

  const determineResult = (finalOutcome: OstrichOutcome) => {
    audio.stopGallop();
    const isWin = finalOutcome.result === betChoice;
    
    setHistory(prev => [{ result: finalOutcome.result, round }, ...prev.slice(0, 10)]);

    if (isWin) {
      audio.playWinSound();
      const profit = Math.floor(betAmount * currentLogic.k);
      setResultMessage({ text: `적중!\n+${profit.toLocaleString()}원`, type: 'win' });
      setTimeout(() => {
        onGameEnd(balance + profit, 'WIN');
        resetRound();
      }, 3000);
    } else {
      audio.playLoseSound();
      const loss = betAmount;
      setResultMessage({ text: `낙첨\n-${loss.toLocaleString()}원`, type: 'lose' });
      setTimeout(() => {
        onGameEnd(balance - loss, 'LOSE');
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

  const [shakeButton, setShakeButton] = useState<'LEFT' | 'RIGHT' | 'AMOUNT' | null>(null);

  const handleBetClick = (choice: 'LEFT' | 'RIGHT') => {
    if (phase === 'BETTING') {
      audio.playBetSound();
      setBetChoice(choice);
      setShakeButton(choice);
      setTimeout(() => setShakeButton(null), 500); // clear shake after animation
    }
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#111] font-sans relative select-none">
      
      {/* Fake Header */}
      <div className="bg-[#1a202c] text-white text-sm px-4 py-2 flex justify-between shadow-sm z-20 relative">
        <span className="font-bold text-gray-200">영천중학교 도박 예방</span>
        <span className="text-blue-400 font-bold tracking-widest">이길 것 같나요?</span>
      </div>

      <div className="flex-1 flex flex-col relative overflow-hidden bg-[#7cb3e8]">
        
        {/* Background Elements */}
        {/* Mountains */}
        <div className="absolute inset-0 z-0 flex items-end justify-center mb-32 md:mb-48 opacity-70">
           <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-48 text-[#6297ce] fill-current">
              <path d="M0,50 L20,10 L45,40 L70,5 L100,50 Z" />
           </svg>
           <svg viewBox="0 0 100 50" preserveAspectRatio="none" className="w-full h-40 absolute bottom-0 text-[#4c81b8] fill-current opacity-60">
              <path d="M-10,50 L15,20 L50,45 L85,15 L110,50 Z" />
           </svg>
        </div>

        {/* Bushes/Trees */}
        <div className="absolute bottom-[25%] md:bottom-[30%] w-full flex whitespace-nowrap overflow-hidden z-0 px-[-50px]">
           {Array.from({ length: 20 }).map((_, i) => (
             <div key={i} className="inline-block flex-shrink-0 w-20 h-24 md:w-32 md:h-40 bg-green-500 rounded-full mx-[-10px] md:mx-[-20px] shadow-[inset_0_-10px_0_rgba(0,0,0,0.1)] border-4 border-green-600"></div>
           ))}
        </div>

        {/* Tree Trunks (behind dirt) */}
        <div className="absolute bottom-[20%] md:bottom-[25%] w-full flex justify-around z-0">
           {Array.from({ length: 15 }).map((_, i) => (
             <div key={i} className="w-4 h-12 md:w-6 md:h-16 bg-[#8b5a2b]"></div>
           ))}
        </div>

        {/* Ground */}
        <div className="absolute bottom-0 w-full h-[25%] md:h-[30%] bg-[#d29b5c] z-0 overflow-hidden">
           {/* Grass Top Scallop */}
           <div className="absolute top-[-10px] md:top-[-15px] left-0 w-full flex">
             {Array.from({ length: 30 }).map((_, i) => (
               <div key={i} className="w-12 h-12 md:w-16 md:h-16 bg-[#86efac] rounded-full mx-[-5px]"></div>
             ))}
           </div>
           {/* Grass Main Strip */}
           <div className="absolute top-0 w-full h-4 md:h-6 bg-[#86efac]"></div>
           
           {/* Dirt Spots */}
           {Array.from({ length: 10 }).map((_, i) => (
             <div key={i} className={`absolute w-8 h-8 md:w-12 md:h-12 bg-[#b88247] rounded-full opacity-60`} 
                  style={{ left: `${10 * i + Math.random() * 5}%`, top: `${30 + Math.random() * 50}%` }}></div>
           ))}
        </div>

        {/* Flags */}
        <div className="absolute left-[10%] bottom-[35%] md:bottom-[40%] z-10">
          <div className="w-2 h-24 md:h-32 bg-gray-200 border-2 border-gray-400"></div>
          <div className="absolute top-2 left-2 bg-red-500 text-white font-black-han px-4 py-2 text-xl md:text-3xl rounded-r-lg shadow-lg border-2 border-red-700">LEFT</div>
        </div>
        <div className="absolute right-[10%] bottom-[35%] md:bottom-[40%] z-10">
          <div className="w-2 h-24 md:h-32 bg-gray-200 border-2 border-gray-400 right-0 absolute"></div>
          <div className="absolute top-2 right-2 bg-blue-500 text-white font-black-han px-4 py-2 text-xl md:text-3xl rounded-l-lg shadow-lg border-2 border-blue-700">RIGHT</div>
        </div>

        {/* The Ostrich */}
        <div className="absolute w-full bottom-[25%] md:bottom-[30%] flex justify-center z-20">
           <motion.div
              initial={{ x: 0, scaleX: 1 }}
              animate={{ 
                x: phase === 'RUNNING' ? (outcome?.result === 'LEFT' ? [0, "15vw", "-15vw", "25vw", "-30vw", "15vw", "-100vw"] : [0, "-15vw", "15vw", "-25vw", "30vw", "-15vw", "100vw"]) : (phase === 'RESULT' ? (outcome?.result === 'LEFT' ? "-100vw" : "100vw") : 0),
                scaleX: phase === 'RUNNING' ? (outcome?.result === 'LEFT' ? [1, 1, -1, 1, -1, 1, -1] : [-1, -1, 1, -1, 1, -1, 1]) : (phase === 'RESULT' ? (outcome?.result === 'LEFT' ? -1 : 1) : (betChoice === 'LEFT' ? -1 : 1))
              }}
              transition={
                phase === 'RUNNING' 
                  ? { duration: RUN_DURATION / 1000, times: [0, 0.15, 0.3, 0.5, 0.7, 0.85, 1], ease: "easeInOut" } 
                  : { duration: 0 }
              }
           >
             <OstrichSVG isRunning={phase === 'RUNNING'} />
           </motion.div>
        </div>

        {/* Top Floating Title (VOD style) */}
        <div className="absolute top-4 w-full flex justify-center z-10">
          <div className="bg-white/90 border-4 border-blue-400 px-8 py-2 rounded-2xl shadow-xl flex items-center gap-4">
             <span className="text-yellow-400 text-3xl drop-shadow-md">⭐</span>
             <span className="font-black-han text-3xl text-gray-800">타조게임</span>
             <span className="text-gray-300 text-3xl drop-shadow-md">⚪</span>
          </div>
        </div>

      </div>

      {/* History Ribbon */}
      <div className="flex-none bg-[#1e293b] border-y-4 border-gray-900 h-12 md:h-16 flex items-center px-4 z-20">
         <div className="w-full text-center font-black-han whitespace-nowrap bg-black/60 rounded-full py-1 md:py-2 text-base md:text-xl border-2 border-yellow-500/50 tracking-widest shadow-[0_0_15px_rgba(253,224,71,0.3)] animate-pulse">
           <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]">도박예방은 영천중학교 </span>
           <span className="text-pink-400 drop-shadow-[0_0_8px_rgba(244,114,182,1)] mx-1 text-lg md:text-2xl">김진균선생님</span>
           <span className="text-yellow-300 drop-shadow-[0_0_5px_rgba(253,224,71,0.8)]">과 함께</span>
         </div>
      </div>

      {/* Bottom Control Panel */}
      <div className="flex-none bg-gray-800 border-t-4 border-gray-900 p-2 md:p-3 flex flex-col md:flex-row items-stretch justify-between gap-3 shadow-inner z-20">
        
        {/* Bet Selection Buttons */}
        <div className="flex gap-2 w-full md:w-auto md:min-w-[200px]">
          <button
            onClick={() => handleBetClick('LEFT')}
            disabled={phase !== 'BETTING'}
            className={`flex-1 rounded-lg border-b-4 font-black-han text-2xl md:text-3xl transition-all shadow-md flex items-center justify-center py-2 ${
              betChoice === 'LEFT' 
              ? 'bg-red-500 border-red-700 text-white transform translate-y-1 border-b-0' 
              : 'bg-red-600 border-red-800 text-gray-200 hover:bg-red-500 disabled:opacity-50'
            } ${shakeButton === 'LEFT' ? 'animate-shake filter contrast-125 hue-rotate-15' : ''}`}
          >
            LEFT
          </button>
          <button
            onClick={() => handleBetClick('RIGHT')}
            disabled={phase !== 'BETTING'}
            className={`flex-1 rounded-lg border-b-4 font-black-han text-2xl md:text-3xl transition-all shadow-md flex items-center justify-center py-2 ${
              betChoice === 'RIGHT' 
              ? 'bg-blue-500 border-blue-700 text-white transform translate-y-1 border-b-0' 
              : 'bg-blue-600 border-blue-800 text-gray-200 hover:bg-blue-500 disabled:opacity-50'
            } ${shakeButton === 'RIGHT' ? 'animate-shake filter contrast-125 hue-rotate-15' : ''}`}
          >
            RIGHT
          </button>
        </div>

        {/* Balances */}
        <div className="flex flex-row md:flex-col justify-center items-center md:items-stretch gap-4 md:gap-1 px-4 py-2 md:py-1 bg-gray-900 rounded border border-gray-700 shadow-lg w-full md:w-[160px]">
          <div className="flex-1 md:flex-none flex justify-between items-center md:items-end">
            <span className="text-gray-400 text-xs mr-2 md:mr-0">보유</span>
            <span className="text-yellow-400 text-base font-bold">{balance.toLocaleString()} 원</span>
          </div>
          <div className="hidden md:block border-t border-gray-700"></div>
          <div className="flex-1 md:flex-none flex justify-between items-center md:items-end">
            <span className="text-gray-400 text-xs mr-2 md:mr-0">베팅</span>
            <span className="text-green-400 text-base font-bold">{betAmount.toLocaleString()} 원</span>
          </div>
        </div>
        
        {/* Betting Chips & Actions */}
        <div className="flex-1 flex flex-col justify-center gap-1.5 w-full md:w-auto">
          <div className="flex justify-between items-center px-1">
             <span className="text-red-400 text-xs font-bold animate-pulse">
               {betAmount < minBetAmount ? `최소 베팅 금액: ${minBetAmount.toLocaleString()}원 (${currentLogic.minBetPct * 100}%)` : '조건 충족됨'}
             </span>
          </div>
          <div className={`flex items-center gap-1.5 flex-wrap ${shakeButton === 'AMOUNT' ? 'animate-shake' : ''}`}>
            {chips.map(chip => (
              <button
                key={chip}
                onClick={() => handleBetAmount(chip)}
                disabled={phase !== 'BETTING' || balance < betAmount + chip}
                className="flex-1 bg-gray-700 hover:bg-gray-600 text-white text-xs md:text-sm font-bold py-2 md:py-1.5 rounded border border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
              >
                {(chip / 10000)}만
              </button>
            ))}
            <button
              onClick={() => handleBetAmount(balance - betAmount)}
              disabled={phase !== 'BETTING' || balance === betAmount || balance === 0}
              className="flex-1 bg-red-800 hover:bg-red-700 text-white text-xs md:text-sm font-bold py-2 md:py-1.5 rounded border border-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-sm whitespace-nowrap"
            >
              올인
            </button>
            <button
              onClick={handleClearBet}
              disabled={phase !== 'BETTING' || betAmount === 0}
              className="bg-gray-600 hover:bg-gray-500 text-white text-xs md:text-sm font-bold py-2 md:py-1.5 px-3 md:px-4 rounded border border-gray-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-sm ml-auto whitespace-nowrap"
            >
              취소
            </button>
          </div>
          
          <button 
            onClick={handleStartRun}
            disabled={phase !== 'BETTING' || betAmount === 0 || !betChoice || !isBetValid}
            className="w-full bg-gradient-to-b from-yellow-400 to-yellow-600 hover:from-yellow-300 hover:to-yellow-500 text-black font-black-han text-lg py-2 rounded border-2 border-yellow-700 shadow-[0_0_10px_rgba(250,204,21,0.3)] disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed transition-all whitespace-nowrap mt-1"
          >
            {phase === 'BETTING' 
              ? (isBetValid ? '좌우 베팅 확정 (타조 출발)' : '최소 베팅액을 맞춰주세요')
              : '타조가 달리는 중...'}
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
            className="result-scrim absolute inset-0 z-50 flex items-center justify-center"
          >
            <div className={`result-card ${resultMessage.type === 'win' ? 'is-win' : 'is-lose'} p-10 rounded-2xl text-center max-w-lg w-full -translate-y-10`}>
              <h2 className={`text-6xl md:text-7xl font-black-han mb-6 ${resultMessage.type === 'win' ? 'gold-text' : 'text-[#ff5c85]'}`}>
                {resultMessage.type === 'win' ? '적중!' : '낙첨'}
              </h2>
              <p className="text-3xl font-bold whitespace-pre-line text-[var(--ivory)] leading-snug">
                {resultMessage.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
