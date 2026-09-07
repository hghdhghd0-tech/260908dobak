import { motion } from 'motion/react';
import React, { useEffect, useState } from 'react';
import { audio } from '../utils/audio';
import { GameMode } from '../types';
import { startLobbyMusic, stopLobbyMusic } from '../utils/casinoAudio';
import { startPreventionTTS, stopPreventionTTS } from '../utils/ttsAudio';
import { Volume2, VolumeX } from 'lucide-react';

interface IntroScreenProps {
  onStart: (mode: GameMode) => void;
}

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [isMusicOn, setIsMusicOn] = useState(true); // Auto play true because user interacted to get here

  useEffect(() => {
    // Start music and custom TTS when entering this screen
    startLobbyMusic();
    startPreventionTTS("체험 해보세요, 도박은 아니란 걸 알겁니다.", 4500);

    return () => {
      stopLobbyMusic();
      stopPreventionTTS();
    };
  }, []);

  const toggleMusic = () => {
    if (isMusicOn) {
      stopLobbyMusic();
      stopPreventionTTS();
      setIsMusicOn(false);
    } else {
      startLobbyMusic();
      startPreventionTTS("체험 해보세요, 도박은 아니란 걸 알겁니다.", 4500);
      setIsMusicOn(true);
    }
  };

  const handleStart = (mode: GameMode) => {
    audio.init();
    audio.playBetSound();
    onStart(mode);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#111] text-white p-4 relative">
      
      {/* Music Toggle Button */}
      <button 
        onClick={toggleMusic} 
        className={`absolute top-4 right-4 flex items-center gap-2 font-bold px-4 py-2 rounded-full text-sm transition-all border-2 z-50 ${
          isMusicOn 
            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse' 
            : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'
        }`}
      >
        {isMusicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
        {isMusicOn ? '유혹의 소리 ON' : '유혹의 소리 OFF'}
      </button>

      <motion.div
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, type: "spring" }}
        className="text-center mb-12"
      >
        <h1 className="text-6xl md:text-7xl font-black-han neon-text mb-2 text-pink-500 drop-shadow-[0_0_15px_rgba(236,72,153,0.5)]">
          영천중학교 CASINO
        </h1>
        <p className="text-2xl md:text-3xl text-yellow-300 mb-2 font-black-han tracking-wider drop-shadow-[0_0_15px_rgba(253,224,71,0.9)] animate-pulse">
          도박중독 김진균선생님과 1336번으로 해결
        </p>
        <p className="text-xl md:text-2xl text-yellow-400 mb-2 font-bold tracking-widest mt-6">
          신규 가입 축하금 300,000원 지급! (중1 몇달치 용돈)
        </p>
      </motion.div>

      <div className="flex flex-col md:grid md:grid-cols-2 gap-6 w-full max-w-5xl px-4 z-10">
        {/* Ostrich Game Button (Moved from bottom right to top left) */}
        <motion.button
          onClick={() => handleStart('OSTRICH')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative bg-gray-900 border-2 border-blue-500 rounded-2xl p-6 overflow-hidden shadow-[0_0_30px_rgba(59,130,246,0.3)] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-blue-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4 drop-shadow-lg">🦤</span>
            <h2 className="text-3xl font-black-han text-blue-400 mb-2">타조 게임</h2>
            <p className="text-gray-300 font-bold text-base">좌/우를 맞혀라 1.95배</p>
          </div>
        </motion.button>

        {/* Race Game Button (Moved from bottom right to top right) */}
        <motion.button
          onClick={() => handleStart('RACE')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative bg-gray-900 border-2 border-green-600 rounded-2xl p-6 overflow-hidden shadow-[0_0_30px_rgba(22,163,74,0.3)] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-green-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4 drop-shadow-lg">🏇</span>
            <h2 className="text-3xl font-black-han text-green-400 mb-2">영천 경마장</h2>
            <p className="text-gray-300 font-bold text-base">20초의 짜릿한 승부</p>
          </div>
        </motion.button>

        {/* Slot Game Button */}
        <motion.button
          onClick={() => handleStart('SLOT')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative bg-gray-900 border-2 border-purple-600 rounded-2xl p-6 overflow-hidden shadow-[0_0_30px_rgba(147,51,234,0.3)] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-purple-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4 drop-shadow-lg">🎰</span>
            <h2 className="text-3xl font-black-han text-purple-400 mb-2">메가 슬롯</h2>
            <p className="text-gray-300 font-bold text-base">터지면 인생 역전</p>
          </div>
        </motion.button>

        {/* Ladder Game Button (Moved from top right to bottom right) */}
        <motion.button
          onClick={() => handleStart('LADDER')}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="group relative bg-gray-900 border-2 border-pink-500 rounded-2xl p-6 overflow-hidden shadow-[0_0_30px_rgba(236,72,153,0.3)] transition-all"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-pink-900/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col items-center justify-center h-full">
            <span className="text-6xl mb-4 drop-shadow-lg">🪜</span>
            <h2 className="text-3xl font-black-han text-pink-400 mb-2">스피드 사다리</h2>
            <p className="text-gray-300 font-bold text-base">홀짝 배당 1.95배</p>
          </div>
        </motion.button>
      </div>
      
      <div className="mt-12 text-sm text-gray-500">
        * 19세 미만 청소년은 이용할 수 없습니다 (라는 경고문은 무시됩니다)
      </div>
    </div>
  );
};

