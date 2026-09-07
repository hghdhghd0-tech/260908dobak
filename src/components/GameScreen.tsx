import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useEffect } from 'react';
import { RaceOutcome } from '../types';
import { getExpectedOutcome, generateRace } from '../utils/gameLogic';
import { audio } from '../utils/audio';

interface GameScreenProps {
  balance: number;
  betHistoryCount: number;
  onGameEnd: (newBalance: number, outcome: 'WIN' | 'LOSE') => void;
  onTriggerEducation: () => void;
}

const HORSE_DATA = [
  { id: 1, name: '천지호령', jockey: '김동영', bg: 'bg-white', text: 'text-black', odds: 2.1 },
  { id: 2, name: '코리아캡틴', jockey: '박재이', bg: 'bg-yellow-400', text: 'text-black', odds: 3.5 },
  { id: 3, name: '레인비치', jockey: '서승운', bg: 'bg-red-500', text: 'text-white', odds: 1.8 },
  { id: 4, name: '럭키', jockey: '이효식', bg: 'bg-black', text: 'text-white', odds: 5.2 },
  { id: 5, name: '천지스타', jockey: '최시대', bg: 'bg-[#4385f5]', text: 'text-white', odds: 4.0 },
  { id: 6, name: '예스트리플', jockey: '정도윤', bg: 'bg-[#00b050]', text: 'text-white', odds: 2.8 },
];

export const GameScreen: React.FC<GameScreenProps> = ({ 
  balance, 
  betHistoryCount, 
  onGameEnd, 
  onTriggerEducation 
}) => {
  const [phase, setPhase] = useState<'BETTING' | 'RACING' | 'RESULT'>('BETTING');
  const [betAmount, setBetAmount] = useState<number>(0);
  const [selectedHorse, setSelectedHorse] = useState<number | null>(null);
  const [outcome, setOutcome] = useState<RaceOutcome | null>(null);
  const [resultMessage, setResultMessage] = useState<{ text: string, type: 'win' | 'lose' } | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const chips = [10000, 50000, 100000, 500000];
  const timesArray = Array.from({length: 21}, (_, i) => i / 20);

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

  const handleStartRace = () => {
    if (betAmount === 0 || !selectedHorse) return;
    
    audio.playStartBell();
    audio.startGallop();

    setPhase('RACING');
    setResultMessage(null);

    const expectedOutcome = getExpectedOutcome(betHistoryCount);
    const roundOutcome = generateRace(selectedHorse, expectedOutcome);
    setOutcome(roundOutcome);

    // Race is 20 seconds long
    setTimeout(() => {
      determineResult(selectedHorse, roundOutcome);
    }, 20500); // 500ms buffer after finish line
  };

  const determineResult = (betHorseId: number, roundOutcome: RaceOutcome) => {
    const userWon = roundOutcome.winnerId === betHorseId;
    const horse = HORSE_DATA.find(h => h.id === betHorseId)!;
    
    if (userWon) {
      audio.playWinSound();
      const payout = Math.floor(betAmount * horse.odds);
      setResultMessage({ text: `+${payout.toLocaleString()}원`, type: 'win' });
      setTimeout(() => {
        onGameEnd(balance - betAmount + payout, 'WIN');
        resetRound();
      }, 3500);
    } else {
      audio.playLoseSound();
      setResultMessage({ text: `-${betAmount.toLocaleString()}원\n우승마: ${roundOutcome.winnerId}번 (${HORSE_DATA.find(h=>h.id === roundOutcome.winnerId)?.name})`, type: 'lose' });
      setTimeout(() => {
        onGameEnd(balance - betAmount, 'LOSE');
        resetRound();
      }, 3500);
    }
    setPhase('RESULT');
  };

  const resetRound = () => {
    setPhase('BETTING');
    setBetAmount(0);
    setSelectedHorse(null);
    setOutcome(null);
    setResultMessage(null);
  };

  return (
    <div className="flex flex-col h-screen w-full bg-[#1b263b] font-sans text-black relative select-none overflow-hidden min-w-[800px]">
      {/* Top Header Bar */}
      <div className="bg-[#0f1d3a] text-white px-3 py-2 flex justify-between items-center z-10 border-b border-[#2b3a5a]">
        <span className="font-black-han text-lg md:text-xl tracking-wide text-yellow-300 drop-shadow-[0_0_10px_rgba(253,224,71,0.8)] animate-pulse">영천중학교 김진균선생님과 함께 도박예방</span>
      </div>
      
      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar (Horse Info) */}
        <div className="w-[280px] bg-white flex flex-col border-r-2 border-gray-400 z-10">
          <div className="bg-[#0f172a] text-white font-bold py-2.5 px-4 text-center tracking-widest text-[15px]">
            출전마 정보
          </div>
          <div className="flex-1 bg-white overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-100 border-b border-gray-300">
                <tr>
                  <th className="py-2.5 font-semibold border-r border-gray-200">번호</th>
                  <th className="py-2.5 font-semibold border-r border-gray-200">마명</th>
                  <th className="py-2.5 font-semibold border-r border-gray-200">기수명</th>
                  <th className="py-2.5 font-bold text-red-600">배당</th>
                </tr>
              </thead>
              <tbody>
                {HORSE_DATA.map((horse) => (
                  <tr 
                    key={horse.id} 
                    onClick={() => phase === 'BETTING' && setSelectedHorse(horse.id)}
                    className={`cursor-pointer border-b border-gray-200 hover:bg-yellow-50 transition-colors ${selectedHorse === horse.id ? 'bg-[#ffeb3b]' : ''}`}
                  >
                    <td className="py-3 px-1 text-center border-r border-gray-200">
                      <div className={`w-[26px] h-[26px] mx-auto flex items-center justify-center font-bold text-sm border border-black ${horse.bg} ${horse.text}`}>
                        {horse.id}
                      </div>
                    </td>
                    <td className="py-3 px-1 text-center font-bold border-r border-gray-200 text-[15px]">{horse.name}</td>
                    <td className="py-3 px-1 text-center text-gray-700 border-r border-gray-200 text-[13px]">{horse.jockey}</td>
                    <td className="py-3 px-1 text-center font-bold text-red-600 text-[15px]">{horse.odds.toFixed(1)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Main Content (Track + Controls) */}
        <div className="flex-1 flex flex-col min-w-0 bg-[#d2b48c]">
          
          {/* Top Yellow Banner */}
          <div className="bg-[#ffeb3b] px-4 py-2 flex justify-between items-center text-black font-bold shadow-sm z-10">
            <span className="text-red-600 text-sm">▶ 당신은 결국 패자가...</span>
          </div>

          {/* Track Area */}
          <div className="flex-1 relative flex flex-col overflow-hidden border-b-[6px] border-[#2b3245]">
            
            {/* Sky & Mountains */}
            <div className="h-[25%] bg-[#a7d8ed] relative border-b-2 border-gray-300">
              {/* SVG Mountains matching the image style */}
              <svg className="absolute bottom-0 w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                {/* Back mountains */}
                <polygon points="0,100 0,60 20,45 40,70 65,40 85,60 100,50 100,100" fill="#9bb3ca" />
                {/* Front mountains */}
                <polygon points="0,100 10,75 30,55 50,85 75,50 100,70 100,100" fill="#7a8c9e" />
              </svg>
            </div>
            
            {/* White Fence */}
            <div className="h-4 bg-white relative flex items-center justify-between px-1">
              {/* Vertical posts */}
              {Array.from({ length: 40 }).map((_, i) => (
                <div key={i} className="h-full w-0.5 bg-gray-300"></div>
              ))}
              {/* Horizontal rails */}
              <div className="absolute top-[3px] w-full h-[2px] bg-gray-300"></div>
              <div className="absolute top-[10px] w-full h-[2px] bg-gray-300"></div>
            </div>

            {/* Dirt Track */}
            <div className="flex-1 bg-[#d2b48c] relative">
              {/* Finish Line (dashed red/white on right) */}
              <div className="absolute right-[2%] top-0 bottom-0 w-2.5">
                <div className="w-full h-full border-r-[8px] border-dashed border-red-600"></div>
                <div className="absolute inset-0 w-full h-full border-r-[8px] border-dashed border-white" style={{ clipPath: 'inset(10px 0 0 0)' }}></div>
              </div>
              
              {HORSE_DATA.map((horse, idx) => (
                <div key={horse.id} className="absolute w-full" style={{ top: `${8 + idx * 14.5}%` }}>
                  <div className="relative w-full h-full pr-[2%]">
                    <motion.div
                      className="absolute top-0 flex items-center"
                      animate={ phase !== 'BETTING' && outcome ? { left: outcome.horsePaths[horse.id-1].map(p => `${p * 0.95}%`) } : { left: '2%' } }
                      transition={ phase !== 'BETTING' ? { duration: 20, ease: "linear", times: timesArray } : { duration: 0 } }
                    >
                      {/* Using simple placeholder horse graphics or emoji, scaled appropriately */}
                      <span className="text-4xl inline-block scale-x-[-1] drop-shadow-md">🏇</span>
                      {/* Number Tag attached to horse */}
                      <div className={`absolute -top-1 -right-2 w-5 h-5 flex items-center justify-center font-bold text-[11px] border border-black ${horse.bg} ${horse.text} shadow-sm z-10`}>
                        {horse.id}
                      </div>
                    </motion.div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Control Panel */}
          <div className="h-[96px] bg-[#1a233a] flex items-stretch p-2 gap-2 text-white">
            
            {/* Selected Horse Info */}
            <div className="w-[160px] bg-[#0b162c] rounded border border-[#2b3a5a] flex items-center justify-center gap-2 relative">
              <div className="absolute top-1 left-2 text-[10px] text-gray-400 font-bold">선택마</div>
              {selectedHorse ? (
                <div className="flex items-center gap-2 mt-2">
                  <div className={`w-8 h-8 flex items-center justify-center font-bold text-lg border border-gray-600 ${HORSE_DATA.find(h=>h.id === selectedHorse)?.bg} ${HORSE_DATA.find(h=>h.id === selectedHorse)?.text}`}>
                    {selectedHorse}
                  </div>
                  <span className="text-[15px] font-bold text-white">{HORSE_DATA.find(h=>h.id === selectedHorse)?.name}</span>
                </div>
              ) : (
                <span className="text-sm text-gray-500 font-bold mt-2">선택 안됨</span>
              )}
            </div>

            {/* Balances */}
            <div className="w-[140px] bg-[#0b162c] rounded border border-[#2b3a5a] flex flex-col justify-center px-3 py-2 gap-1.5">
              <div className="flex justify-between items-center">
                <span className="text-gray-400 text-xs">보유</span>
                <span className="text-[#ffeb3b] text-[15px] font-bold tracking-tight">{balance.toLocaleString()} 원</span>
              </div>
              <div className="flex justify-between items-center border-t border-[#2b3a5a] pt-1.5">
                <span className="text-gray-400 text-xs">베팅</span>
                <span className="text-[#4caf50] text-[15px] font-bold tracking-tight">{betAmount.toLocaleString()} 원</span>
              </div>
            </div>
            
            {/* Betting Chips & Action */}
            <div className="flex-1 flex flex-col justify-between gap-1">
              <div className="flex items-center gap-1 h-[40px]">
                {chips.map(chip => (
                  <button
                    key={chip}
                    onClick={() => handleBet(chip)}
                    disabled={phase !== 'BETTING' || balance < betAmount + chip || !selectedHorse}
                    className="flex-1 bg-[#374151] hover:bg-[#4b5563] text-gray-200 text-sm font-bold h-full rounded border border-[#4b5563] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {(chip / 10000)}만
                  </button>
                ))}
                <button
                  onClick={() => handleBet(balance - betAmount)}
                  disabled={phase !== 'BETTING' || balance === betAmount || balance === 0 || !selectedHorse}
                  className="flex-1 bg-[#d32f2f] hover:bg-[#b71c1c] text-white text-sm font-bold h-full rounded border border-[#b71c1c] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  올인
                </button>
                <button
                  onClick={handleClearBet}
                  disabled={phase !== 'BETTING' || betAmount === 0}
                  className="flex-1 bg-[#4b5563] hover:bg-[#6b7280] text-gray-300 text-sm font-bold h-full rounded border border-[#6b7280] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  취소
                </button>
              </div>

              <button 
                onClick={handleStartRace}
                disabled={phase !== 'BETTING' || betAmount === 0 || !selectedHorse}
                className="w-full bg-[#424242] hover:bg-[#616161] text-gray-200 font-bold text-sm h-[40px] rounded border border-[#616161] disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
              >
                {phase === 'BETTING' ? '경주 시작 (베팅 확정)' : '경주 진행 중...'}
              </button>
            </div>
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
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <div className={`bg-white border-8 ${resultMessage.type === 'win' ? 'border-blue-600' : 'border-red-600'} p-8 rounded-xl shadow-2xl text-center max-w-sm w-full transform -translate-y-10`}>
              <h2 className={`text-5xl font-black-han mb-4 ${resultMessage.type === 'win' ? 'text-blue-600' : 'text-red-600'}`}>
                {resultMessage.type === 'win' ? '적중!' : '낙첨'}
              </h2>
              <p className="text-xl font-bold whitespace-pre-line text-black leading-snug">
                {resultMessage.text}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

