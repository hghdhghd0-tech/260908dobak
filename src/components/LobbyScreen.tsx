import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Menu, Crown, Gamepad2, Trophy, Coins, User, 
  ChevronRight, Bell, Search, Globe, LogIn, Volume2, VolumeX
} from 'lucide-react';
import { startLobbyMusic, stopLobbyMusic } from '../utils/casinoAudio';
import { startPreventionTTS, stopPreventionTTS } from '../utils/ttsAudio';

interface LobbyScreenProps {
  onEnter: () => void;
}

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ onEnter }) => {
  const [isMusicOn, setIsMusicOn] = useState(false);

  // Stop music if the user leaves the lobby screen
  useEffect(() => {
    return () => {
      stopLobbyMusic();
      stopPreventionTTS();
    };
  }, []);

  const toggleMusic = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isMusicOn) {
      stopLobbyMusic();
      stopPreventionTTS();
      setIsMusicOn(false);
    } else {
      startLobbyMusic();
      startPreventionTTS("도박은 자신에 대한 예의가 아닙니다.", 4500);
      setIsMusicOn(true);
    }
  };

  const fakeWinners = [
    { name: '김*수', amount: '₩45,800,000', game: '메가 슬롯' },
    { name: '이*진', amount: '₩12,500,000', game: '바카라' },
    { name: '박*호', amount: '₩8,900,000', game: '룰렛' },
    { name: '최*영', amount: '₩32,150,000', game: '스피드 사다리' },
    { name: '정*민', amount: '₩5,400,000', game: '영천 경마장' },
    { name: '강*훈', amount: '₩18,200,000', game: '타조 게임' },
    { name: '조*아', amount: '₩6,750,000', game: '블랙잭 라이브' },
    { name: '윤*석', amount: '₩21,000,000', game: '아즈텍 보물' },
  ];

  return (
    <div className="flex flex-col h-screen w-full bg-[#0a0d14] text-white font-sans overflow-hidden select-none">
      {/* Top Navbar */}
      <div className="h-16 bg-[#121620] border-b border-[#1f2636] flex items-center justify-between px-4 z-20">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onEnter}>
            <Menu className="text-gray-400 hover:text-white" size={24} />
            <div className="flex flex-col items-start leading-none ml-2">
              <span className="text-xl md:text-2xl font-bold text-yellow-400 font-black-han tracking-wide">영천중 카지노</span>
            </div>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-6 text-sm font-bold text-gray-300">
            <span className="text-yellow-400 border-b-2 border-yellow-400 py-5 cursor-pointer">슬롯</span>
            <span className="hover:text-white cursor-pointer">라이브 카지노</span>
            <span className="hover:text-white cursor-pointer">스포츠</span>
            <span className="hover:text-white cursor-pointer">프로모션</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={toggleMusic} 
            className={`hidden md:flex items-center gap-2 font-bold px-4 py-1.5 rounded-full text-sm transition-all border-2 ${
              isMusicOn 
                ? 'bg-yellow-500/20 text-yellow-400 border-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.5)] animate-pulse' 
                : 'bg-gray-800 text-gray-400 border-gray-600 hover:bg-gray-700'
            }`}
          >
            {isMusicOn ? <Volume2 size={16} /> : <VolumeX size={16} />}
            {isMusicOn ? '유혹의 소리 ON' : '유혹의 소리 OFF'}
          </button>
          <button onClick={onEnter} className="hidden sm:flex items-center justify-center bg-gradient-to-b from-yellow-300 to-yellow-600 text-black font-bold px-6 py-1.5 rounded-full text-sm hover:from-yellow-200 hover:to-yellow-500 transition-all shadow-[0_0_10px_rgba(234,179,8,0.3)]">
            로그인
          </button>
          <div className="hidden lg:flex items-center gap-1 text-gray-400 text-sm">
            <Globe size={16} /> 한국어
          </div>
          <div className="flex items-center gap-2 border-l border-[#1f2636] pl-4">
             <div className="flex flex-col items-end leading-tight">
               <span className="text-xs text-gray-400">Guest_8912</span>
               <span className="text-sm font-bold text-yellow-400">₩0</span>
             </div>
             <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center border border-gray-600">
               <User size={18} className="text-gray-400" />
             </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">
        {/* Left Sidebar */}
        <div className="hidden sm:flex w-20 flex-col items-center bg-[#121620] border-r border-[#1f2636] py-6 gap-8 z-10">
          <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onEnter}>
            <Crown size={24} className="text-yellow-400 group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-gray-400 group-hover:text-yellow-400">VIP</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onEnter}>
            <Gamepad2 size={24} className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-gray-400 group-hover:text-white">게임</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onEnter}>
            <Trophy size={24} className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-gray-400 group-hover:text-white">토너먼트</span>
          </div>
          <div className="flex flex-col items-center gap-1 cursor-pointer group mt-auto" onClick={onEnter}>
            <Search size={24} className="text-gray-400 group-hover:text-white group-hover:scale-110 transition-transform" />
            <span className="text-[10px] text-gray-400 group-hover:text-white">검색</span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-8">
            
            {/* Hero Banner (Mimicking the flashy DAILY WINS image) */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="relative w-full min-h-[350px] md:min-h-[450px] py-12 rounded-2xl overflow-hidden cursor-pointer group shadow-[0_10px_40px_rgba(0,0,0,0.8)] border-2 border-yellow-500/50 bg-[#2d1b54] flex flex-col justify-center items-center"
              onClick={onEnter}
            >
              {/* Flashy background - Purple radial sunburst effect */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-500 via-purple-700 to-indigo-950 opacity-90"></div>
              
              {/* Sunburst rays pattern */}
              <div className="absolute inset-0 opacity-20 bg-[repeating-conic-gradient(from_0deg,transparent_0deg,transparent_15deg,#ffffff_15deg,#ffffff_30deg)] mix-blend-overlay animate-[spin_60s_linear_infinite]"></div>

              {/* Decorative elements to mimic the sweet/pig aesthetic (using emojis instead of characters) */}
              <div className="absolute top-12 left-10 md:left-20 text-6xl md:text-8xl drop-shadow-2xl animate-pulse delay-75 z-0">💎</div>
              <div className="absolute top-20 right-10 md:right-24 text-6xl md:text-8xl drop-shadow-2xl animate-pulse delay-300 z-0">🍬</div>
              <div className="absolute bottom-10 left-1/4 text-4xl drop-shadow-lg opacity-80 z-0">🍭</div>
              <div className="absolute top-1/4 right-1/3 text-5xl drop-shadow-lg opacity-80 animate-bounce z-0">🪙</div>

              {/* Center Content */}
              <div className="relative z-10 p-4 md:p-8 flex flex-col justify-center items-center text-center w-full max-w-5xl">
                
                {/* DAILY WINS Logo Mockup */}
                <div className="relative mb-4 mt-4">
                  <Crown size={56} className="absolute -top-12 left-1/2 -translate-x-1/2 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,1)] z-20" fill="currentColor" />
                  <div className="bg-gradient-to-b from-red-600 to-red-900 border-4 border-yellow-400 px-8 py-2 rounded-xl shadow-2xl relative z-10 transform -rotate-2">
                    <h2 className="text-4xl md:text-5xl font-black-han italic text-white drop-shadow-md tracking-wider">DAILY<br/><span className="text-yellow-300">WINS</span></h2>
                  </div>
                </div>

                {/* Pink Ribbon - Daily Cash Prizes */}
                <div className="bg-gradient-to-b from-pink-400 to-pink-600 border-2 border-pink-200 text-white font-bold text-base md:text-2xl px-10 py-2 rounded-full shadow-[0_5px_15px_rgba(219,39,119,0.6)] mb-4 z-20">
                  매일마다 캐쉬 프라이즈 ⭐
                </div>

                {/* MASSIVE GOLD TEXT: ₩1,650,000,000 */}
                <div className="relative z-20 w-full px-2 mb-6">
                  <h1 className="text-6xl sm:text-7xl md:text-8xl lg:text-[7rem] font-black-han tracking-tighter w-full text-center py-2 leading-none"
                      style={{ 
                        background: 'linear-gradient(180deg, #fff7d6 0%, #facc15 40%, #a16207 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        filter: 'drop-shadow(0px 8px 4px rgba(0,0,0,0.8)) drop-shadow(0px 0px 15px rgba(234,179,8,0.5))',
                        WebkitTextStroke: '3px #451a03'
                      }}>
                    ₩1,650,000,000
                  </h1>
                </div>

                {/* Flashy Neon Sign - Gambling Prevention & Click CTA */}
                <div className="border-4 border-yellow-400 px-8 py-4 rounded-full shadow-[0_0_35px_rgba(253,224,71,1)] z-20 animate-pulse bg-black/80 backdrop-blur-md flex flex-col items-center justify-center gap-2 hover:scale-110 transition-transform cursor-pointer w-full max-w-4xl">
                  <span className="text-white font-sans font-black text-2xl md:text-3xl lg:text-4xl tracking-tight drop-shadow-[0_0_12px_rgba(255,255,255,1)] text-center leading-tight whitespace-nowrap">
                    영천중학교 <span className="text-pink-500 mx-1 drop-shadow-[0_0_20px_rgba(236,72,153,1)]">김진균선생님</span>과 도박예방
                  </span>
                  <span className="text-yellow-300 font-bold text-base md:text-xl animate-bounce mt-2 bg-black/50 px-6 py-2 rounded-full border border-yellow-500/50 whitespace-nowrap">
                    👆 여기를 클릭하여 바로 입장하세요! 👆
                  </span>
                </div>

              </div>
              
              {/* Fake X Multiplier badge bottom right */}
              <div className="absolute bottom-6 right-6 md:bottom-8 md:right-8 bg-black border-4 border-yellow-500 w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center shadow-[0_0_20px_rgba(234,179,8,0.6)] z-30 transform rotate-12">
                <span className="text-yellow-400 font-black-han text-4xl leading-none">X</span>
                <span className="text-white font-bold text-xs leading-tight text-center mt-1">PRIZE<br/>MULTIPLIER</span>
              </div>
            </motion.div>

            {/* Popular Games Section */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  인기 게임 <span className="text-yellow-500 text-sm">🔥</span>
                </h2>
                <span className="text-sm text-gray-400 flex items-center cursor-pointer hover:text-white" onClick={onEnter}>
                  더보기 <ChevronRight size={16} />
                </span>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {/* Game Card 1 */}
                <div onClick={onEnter} className="group relative bg-[#1c2230] rounded-xl overflow-hidden cursor-pointer border border-[#2b354a] hover:border-yellow-500/50 transition-colors">
                  <div className="aspect-[4/3] bg-gradient-to-br from-green-900 to-black relative p-4 flex flex-col items-center justify-center">
                    <span className="text-5xl drop-shadow-lg mb-2">🗿</span>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-3 text-center bg-[#161a23]">
                    <h3 className="font-bold text-gray-200">아즈텍 보물</h3>
                    <p className="text-xs text-gray-500 mt-1">1,245명 플레이중</p>
                    <button className="mt-3 w-full bg-[#2b354a] text-yellow-400 py-1.5 rounded-lg text-sm font-bold group-hover:bg-yellow-500 group-hover:text-black transition-colors">Play</button>
                  </div>
                </div>

                {/* Game Card 2 */}
                <div onClick={onEnter} className="group relative bg-[#1c2230] rounded-xl overflow-hidden cursor-pointer border border-[#2b354a] hover:border-yellow-500/50 transition-colors">
                  <div className="aspect-[4/3] bg-gradient-to-br from-red-900 to-black relative p-4 flex flex-col items-center justify-center">
                    <span className="text-5xl drop-shadow-lg mb-2">🐉</span>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-3 text-center bg-[#161a23]">
                    <h3 className="font-bold text-gray-200">불타는 드래곤</h3>
                    <p className="text-xs text-gray-500 mt-1">980명 플레이중</p>
                    <button className="mt-3 w-full bg-[#2b354a] text-yellow-400 py-1.5 rounded-lg text-sm font-bold group-hover:bg-yellow-500 group-hover:text-black transition-colors">Play</button>
                  </div>
                </div>

                {/* Game Card 3 */}
                <div onClick={onEnter} className="group relative bg-[#1c2230] rounded-xl overflow-hidden cursor-pointer border border-[#2b354a] hover:border-yellow-500/50 transition-colors">
                  <div className="aspect-[4/3] bg-gradient-to-br from-purple-900 to-black relative p-4 flex flex-col items-center justify-center">
                    <span className="text-5xl drop-shadow-lg mb-2">🎰</span>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-3 text-center bg-[#161a23]">
                    <h3 className="font-bold text-gray-200">메가 슬롯</h3>
                    <p className="text-xs text-gray-500 mt-1">1,520명 플레이중</p>
                    <button className="mt-3 w-full bg-[#2b354a] text-yellow-400 py-1.5 rounded-lg text-sm font-bold group-hover:bg-yellow-500 group-hover:text-black transition-colors">Play</button>
                  </div>
                </div>

                {/* Game Card 4 */}
                <div onClick={onEnter} className="group relative bg-[#1c2230] rounded-xl overflow-hidden cursor-pointer border border-[#2b354a] hover:border-yellow-500/50 transition-colors">
                  <div className="aspect-[4/3] bg-gradient-to-br from-blue-900 to-black relative p-4 flex flex-col items-center justify-center">
                    <span className="text-5xl drop-shadow-lg mb-2">🪜</span>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-3 text-center bg-[#161a23]">
                    <h3 className="font-bold text-gray-200">스피드 사다리</h3>
                    <p className="text-xs text-gray-500 mt-1">412명 플레이중</p>
                    <button className="mt-3 w-full bg-[#2b354a] text-yellow-400 py-1.5 rounded-lg text-sm font-bold group-hover:bg-yellow-500 group-hover:text-black transition-colors">Play</button>
                  </div>
                </div>

                {/* Game Card 5 */}
                <div onClick={onEnter} className="group relative bg-[#1c2230] rounded-xl overflow-hidden cursor-pointer border border-[#2b354a] hover:border-yellow-500/50 transition-colors hidden lg:block">
                  <div className="aspect-[4/3] bg-gradient-to-br from-orange-900 to-black relative p-4 flex flex-col items-center justify-center">
                    <span className="text-5xl drop-shadow-lg mb-2">🏇</span>
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-transparent transition-colors"></div>
                  </div>
                  <div className="p-3 text-center bg-[#161a23]">
                    <h3 className="font-bold text-gray-200">경마장 라이브</h3>
                    <p className="text-xs text-gray-500 mt-1">885명 플레이중</p>
                    <button className="mt-3 w-full bg-[#2b354a] text-yellow-400 py-1.5 rounded-lg text-sm font-bold group-hover:bg-yellow-500 group-hover:text-black transition-colors">Play</button>
                  </div>
                </div>
              </div>
            </div>

            {/* Live Casino Section (Compact) */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="text-xl md:text-2xl font-bold flex items-center gap-2">
                  실시간 카지노
                </h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 <div onClick={onEnter} className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl flex items-center justify-center cursor-pointer border border-gray-700 hover:border-yellow-500/50 transition-colors">
                    <span className="text-gray-300 font-bold">에볼루션 바카라</span>
                 </div>
                 <div onClick={onEnter} className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl flex items-center justify-center cursor-pointer border border-gray-700 hover:border-yellow-500/50 transition-colors">
                    <span className="text-gray-300 font-bold">라이브 룰렛</span>
                 </div>
                 <div onClick={onEnter} className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl flex items-center justify-center cursor-pointer border border-gray-700 hover:border-yellow-500/50 transition-colors">
                    <span className="text-gray-300 font-bold">블랙잭 VIP</span>
                 </div>
                 <div onClick={onEnter} className="h-24 bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl flex items-center justify-center cursor-pointer border border-gray-700 hover:border-yellow-500/50 transition-colors">
                    <span className="text-gray-300 font-bold">텍사스 홀덤</span>
                 </div>
              </div>
            </div>

          </div>
        </div>

        {/* Right Sidebar (Live Winners Feed) */}
        <div className="hidden xl:flex w-72 flex-col bg-[#121620] border-l border-[#1f2636] z-10">
          <div className="flex items-center justify-between p-4 border-b border-[#1f2636]">
            <span className="text-gray-300 font-bold">실시간 당첨 현황</span>
            <div className="flex bg-[#1a1f2e] rounded-lg p-1">
              <span className="px-3 py-1 bg-[#2b354a] rounded-md text-xs font-bold text-white">최근</span>
              <span className="px-3 py-1 text-xs text-gray-400">고액</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {fakeWinners.map((winner, idx) => (
              <div key={idx} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1f2e] transition-colors cursor-pointer" onClick={onEnter}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600 flex-shrink-0">
                  <User size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-bold text-gray-200 truncate">{winner.name}</span>
                    <span className="text-xs text-gray-500">방금 전</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 truncate">{winner.game}</span>
                    <span className="text-sm font-bold text-green-400">{winner.amount}</span>
                  </div>
                </div>
              </div>
            ))}
            {/* Duplicate for visual fill */}
            {fakeWinners.map((winner, idx) => (
              <div key={`dup-${idx}`} className="flex items-center gap-3 p-3 rounded-xl hover:bg-[#1a1f2e] transition-colors cursor-pointer" onClick={onEnter}>
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center border border-gray-600 flex-shrink-0">
                  <User size={16} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-center mb-0.5">
                    <span className="text-sm font-bold text-gray-200 truncate">{winner.name}</span>
                    <span className="text-xs text-gray-500">{idx + 2}분 전</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-400 truncate">{winner.game}</span>
                    <span className="text-sm font-bold text-green-400">{winner.amount}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
