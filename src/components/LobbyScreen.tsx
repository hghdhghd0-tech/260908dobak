import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Menu, Crown, Gamepad2, Trophy, User,
  ChevronRight, Search, Globe, Volume2, VolumeX
} from 'lucide-react';
import { startLobbyMusic, stopLobbyMusic } from '../utils/casinoAudio';
import { startPreventionTTS, stopPreventionTTS } from '../utils/ttsAudio';

interface LobbyScreenProps {
  onEnter: () => void;
}

const NAV = ['슬롯', '라이브 카지노', '스포츠', '프로모션'];

const SIDE = [
  { icon: Crown,   label: 'VIP',    gold: true },
  { icon: Gamepad2, label: '게임',   gold: false },
  { icon: Trophy,   label: '토너먼트', gold: false },
];

const POPULAR = [
  { emoji: '🗿', name: '아즈텍 보물',   players: '1,245명 플레이중', art: 'linear-gradient(150deg,#1d4033,#0b1a14)', wide: false },
  { emoji: '🐉', name: '불타는 드래곤', players: '980명 플레이중',   art: 'linear-gradient(150deg,#4a1420,#1a0709)', wide: false },
  { emoji: '🎰', name: '메가 슬롯',     players: '1,520명 플레이중', art: 'linear-gradient(150deg,#3a1550,#150720)', wide: false },
  { emoji: '🪜', name: '스피드 사다리', players: '412명 플레이중',   art: 'linear-gradient(150deg,#12305c,#060f1f)', wide: false },
  { emoji: '🏇', name: '경마장 라이브', players: '885명 플레이중',   art: 'linear-gradient(150deg,#4d2a08,#170c02)', wide: true },
];

const LIVE = ['에볼루션 바카라', '라이브 룰렛', '블랙잭 VIP', '텍사스 홀덤'];

export const LobbyScreen: React.FC<LobbyScreenProps> = ({ onEnter }) => {
  const [isMusicOn, setIsMusicOn] = useState(false);

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
      startPreventionTTS('도박은 자신에 대한 예의가 아닙니다.', 4500);
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

  const WinRow: React.FC<{ w: typeof fakeWinners[0]; when: string }> = ({ w, when }) => (
    <div className="win-row flex items-center gap-3 p-3 rounded-xl cursor-pointer" onClick={onEnter}>
      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 border border-[rgba(230,196,99,.28)] bg-[#1a1026]">
        <User size={15} className="text-[var(--ivory-mute)]" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center mb-0.5">
          <span className="text-sm font-bold text-[var(--ivory)] truncate">{w.name}</span>
          <span className="text-[10px] text-[var(--ivory-mute)]">{when}</span>
        </div>
        <div className="flex justify-between items-center gap-2">
          <span className="text-[11px] text-[var(--ivory-mute)] truncate">{w.game}</span>
          <span className="tnum text-sm font-bold gold-text">{w.amount}</span>
        </div>
      </div>
    </div>
  );

  return (
    <div className="lobby-chrome flex flex-col h-screen w-full text-[var(--ivory)] overflow-hidden select-none">

      {/* ── 상단 내비 ─────────────────────────────── */}
      <div className="h-16 lobby-panel border-b flex items-center justify-between px-4 z-20 shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 cursor-pointer" onClick={onEnter}>
            <Menu className="text-[var(--ivory-mute)] hover:text-[var(--ivory)] transition-colors" size={22} />
            <span className="ml-2 font-black-han gold-text text-xl md:text-2xl tracking-tight">
              영천중 카지노
            </span>
          </div>
          <div className="hidden md:flex items-center gap-6 ml-6 text-sm font-bold">
            {NAV.map((n, i) => (
              <span key={n} className={`nav-link cursor-pointer ${i === 0 ? 'is-active' : ''}`}>
                {n}
              </span>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleMusic}
            aria-pressed={isMusicOn}
            className={`hidden md:flex items-center gap-2 font-bold px-4 py-1.5 rounded-full text-xs border transition-colors ${
              isMusicOn
                ? 'bg-[rgba(230,196,99,.12)] text-[var(--gold-hi)] border-[rgba(230,196,99,.6)]'
                : 'bg-transparent text-[var(--ivory-mute)] border-[rgba(255,255,255,.12)] hover:text-[var(--ivory-dim)]'
            }`}
          >
            {isMusicOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
            {isMusicOn ? '유혹의 소리 ON' : '유혹의 소리 OFF'}
          </button>

          <button
            onClick={onEnter}
            className="hidden sm:flex items-center justify-center font-bold px-6 py-1.5 rounded-full text-sm text-[#2a1a02] transition-transform hover:scale-105"
            style={{
              background: 'linear-gradient(180deg,#fbe9a8,#e6c463 46%,#b8891f)',
              boxShadow: '0 4px 16px rgba(230,196,99,.34), inset 0 1px 0 rgba(255,255,255,.5)',
            }}
          >
            로그인
          </button>

          <div className="hidden lg:flex items-center gap-1 text-[var(--ivory-mute)] text-xs">
            <Globe size={14} /> 한국어
          </div>

          <div className="flex items-center gap-2 border-l border-[rgba(230,196,99,.16)] pl-3">
            <div className="flex flex-col items-end leading-tight">
              <span className="text-[10px] text-[var(--ivory-mute)]">Guest_8912</span>
              <span className="tnum text-sm font-bold gold-text">₩0</span>
            </div>
            <div className="w-8 h-8 rounded-full flex items-center justify-center border border-[rgba(230,196,99,.28)] bg-[#1a1026]">
              <User size={16} className="text-[var(--ivory-mute)]" />
            </div>
          </div>
        </div>
      </div>

      <div className="flex flex-1 overflow-hidden relative">

        {/* ── 좌측 사이드바 ───────────────────────── */}
        <div className="hidden sm:flex w-20 flex-col items-center lobby-panel border-r py-6 gap-8 z-10 shrink-0">
          {SIDE.map(({ icon: Icon, label, gold }) => (
            <div key={label} className="flex flex-col items-center gap-1 cursor-pointer group" onClick={onEnter}>
              <Icon
                size={22}
                className={`transition-transform group-hover:scale-110 ${
                  gold ? 'text-[var(--gold)]' : 'text-[var(--ivory-mute)] group-hover:text-[var(--ivory)]'
                }`}
              />
              <span className={`text-[10px] ${gold ? 'text-[var(--gold)]' : 'text-[var(--ivory-mute)] group-hover:text-[var(--ivory)]'}`}>
                {label}
              </span>
            </div>
          ))}
          <div className="flex flex-col items-center gap-1 cursor-pointer group mt-auto" onClick={onEnter}>
            <Search size={22} className="text-[var(--ivory-mute)] group-hover:text-[var(--ivory)] transition-transform group-hover:scale-110" />
            <span className="text-[10px] text-[var(--ivory-mute)] group-hover:text-[var(--ivory)]">검색</span>
          </div>
        </div>

        {/* ── 본문 ────────────────────────────────── */}
        <div className="flex-1 overflow-y-auto pb-20 custom-scrollbar">
          <div className="p-4 md:p-6 lg:p-8 max-w-7xl mx-auto space-y-10">

            {/* 히어로 */}
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onClick={onEnter}
              className="hero-stage relative w-full min-h-[350px] md:min-h-[470px] py-12 rounded-2xl overflow-hidden cursor-pointer flex flex-col justify-center items-center"
            >
              <div className="hero-rays absolute -inset-1/2" />
              <div className="hero-vignette absolute inset-0" />

              {/* 장식 이모지 */}
              <div className="float-slow absolute top-12 left-8 md:left-20 text-6xl md:text-8xl drop-shadow-2xl z-0">💎</div>
              <div className="float-slow absolute top-20 right-8 md:right-24 text-6xl md:text-8xl drop-shadow-2xl z-0" style={{ animationDelay: '1.6s' }}>🍬</div>
              <div className="float-slow absolute bottom-10 left-1/4 text-4xl drop-shadow-lg opacity-80 z-0" style={{ animationDelay: '3.1s' }}>🍭</div>
              <div className="float-slow absolute top-1/4 right-1/3 text-5xl drop-shadow-lg opacity-80 z-0" style={{ animationDelay: '4.4s' }}>🪙</div>

              <div className="relative z-10 px-4 md:px-8 flex flex-col justify-center items-center text-center w-full max-w-5xl">

                {/* DAILY WINS */}
                <div className="relative mb-5 mt-6">
                  <Crown
                    size={52}
                    fill="currentColor"
                    className="absolute -top-11 left-1/2 -translate-x-1/2 text-[var(--gold-hi)] drop-shadow-[0_0_18px_rgba(230,196,99,.95)] z-20"
                  />
                  <div className="plaque px-9 py-2.5 rounded-xl relative z-10 -rotate-2">
                    <h2 className="font-black-han italic text-4xl md:text-5xl text-white leading-[1.05] tracking-wider drop-shadow-[0_3px_4px_rgba(0,0,0,.6)]">
                      DAILY<br />
                      <span className="text-[var(--gold-hi)]">WINS</span>
                    </h2>
                  </div>
                </div>

                {/* 핑크 리본 */}
                <div className="ribbon-pink text-white font-bold text-base md:text-2xl px-10 py-2 rounded-full mb-5 z-20">
                  매일마다 캐쉬 프라이즈 ⭐
                </div>

                {/* 잭팟 */}
                <div className="relative z-20 w-full px-2 mb-7">
                  <h1 className="jackpot tnum font-black-han text-center leading-none tracking-tighter text-[clamp(2.6rem,11vw,7rem)] py-2">
                    ₩1,650,000,000
                  </h1>
                </div>

                {/* 입장 안내 */}
                <div className="enter-plate rounded-full px-8 py-4 z-20 flex flex-col items-center justify-center gap-2 cursor-pointer w-full max-w-4xl">
                  <span className="font-black text-xl md:text-3xl lg:text-4xl tracking-tight text-white text-center leading-tight whitespace-nowrap drop-shadow-[0_0_14px_rgba(255,255,255,.55)]">
                    영천중학교 <span className="mx-1 text-[#ff6bb0] drop-shadow-[0_0_18px_rgba(255,107,176,.9)]">김진균선생님</span>과 도박예방
                  </span>
                  <span className="mt-1.5 text-sm md:text-lg font-bold text-[var(--gold-hi)] bg-[rgba(230,196,99,.1)] border border-[rgba(230,196,99,.4)] px-6 py-2 rounded-full whitespace-nowrap">
                    👆 여기를 클릭하여 바로 입장하세요! 👆
                  </span>
                </div>
              </div>

              {/* 배수 뱃지 */}
              <div className="mult-badge absolute bottom-6 right-6 md:bottom-8 md:right-8 w-24 h-24 md:w-28 md:h-28 rounded-full flex flex-col items-center justify-center z-30 rotate-12">
                <span className="font-black-han gold-text text-4xl leading-none">X</span>
                <span className="text-white font-bold text-[10px] leading-tight text-center mt-1">
                  PRIZE<br />MULTIPLIER
                </span>
              </div>
            </motion.div>

            {/* 인기 게임 */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-black-han text-xl md:text-2xl flex items-center gap-2 text-[var(--ivory)]">
                  인기 게임 <span className="text-base">🔥</span>
                </h2>
                <span
                  className="text-sm text-[var(--ivory-mute)] flex items-center cursor-pointer hover:text-[var(--gold-hi)] transition-colors"
                  onClick={onEnter}
                >
                  더보기 <ChevronRight size={15} />
                </span>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {POPULAR.map((g) => (
                  <div
                    key={g.name}
                    onClick={onEnter}
                    className={`tile group relative rounded-xl overflow-hidden cursor-pointer ${g.wide ? 'hidden lg:block' : ''}`}
                  >
                    <div
                      className="tile-art aspect-[4/3] flex items-center justify-center"
                      style={{ background: g.art }}
                    >
                      <span className="relative z-10 text-5xl drop-shadow-[0_6px_14px_rgba(0,0,0,.7)] transition-transform duration-300 group-hover:scale-110">
                        {g.emoji}
                      </span>
                    </div>
                    <div className="p-3 text-center">
                      <h3 className="font-bold text-[var(--ivory)] text-sm">{g.name}</h3>
                      <p className="text-[11px] text-[var(--ivory-mute)] mt-1">{g.players}</p>
                      <button className="play-btn mt-3 w-full py-1.5 rounded-lg text-sm font-bold">
                        Play
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 실시간 카지노 */}
            <div>
              <div className="flex justify-between items-end mb-4">
                <h2 className="font-black-han text-xl md:text-2xl text-[var(--ivory)]">실시간 카지노</h2>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {LIVE.map((t) => (
                  <div
                    key={t}
                    onClick={onEnter}
                    className="live-tile h-24 rounded-xl flex items-center justify-center cursor-pointer"
                  >
                    <span className="font-bold text-[var(--ivory-dim)] text-sm">{t}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* ── 우측 당첨 피드 ──────────────────────── */}
        <div className="hidden xl:flex w-72 flex-col lobby-panel border-l z-10 shrink-0">
          <div className="flex items-center justify-between p-4 border-b border-[rgba(230,196,99,.14)]">
            <span className="font-bold text-[var(--ivory)] text-sm">실시간 당첨 현황</span>
            <div className="flex rounded-lg p-1 bg-[#1a1026] border border-[rgba(230,196,99,.14)]">
              <span className="px-3 py-1 rounded-md text-[11px] font-bold text-[#2a1a02] bg-[var(--gold)]">최근</span>
              <span className="px-3 py-1 text-[11px] text-[var(--ivory-mute)]">고액</span>
            </div>
          </div>
          <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
            {fakeWinners.map((w, i) => (
              <WinRow key={i} w={w} when="방금 전" />
            ))}
            {fakeWinners.map((w, i) => (
              <WinRow key={`d-${i}`} w={w} when={`${i + 2}분 전`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
