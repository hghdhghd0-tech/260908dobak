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

const TTS_LINE = '체험 해보세요, 도박은 아니란 걸 알겁니다.';

/** 원본과 동일한 문구·순서. 색은 이모지 뒤 후광에만 아주 옅게 씀 */
const GAMES: {
  mode: Exclude<GameMode, null>;
  emoji: string;
  title: string;
  desc: string;
  halo: string;
}[] = [
  { mode: 'OSTRICH', emoji: '🦤', title: '타조 게임',    desc: '좌/우를 맞혀라 1.95배', halo: '#3b82f6' },
  { mode: 'RACE',    emoji: '🏇', title: '영천 경마장',  desc: '20초의 짜릿한 승부',    halo: '#22c55e' },
  { mode: 'SLOT',    emoji: '🎰', title: '메가 슬롯',    desc: '터지면 인생 역전',      halo: '#a855f7' },
  { mode: 'LADDER',  emoji: '🪜', title: '스피드 사다리', desc: '홀짝 배당 1.95배',      halo: '#ec4899' },
];

/** 카드 네 모서리의 금색 브래킷 */
const Corners: React.FC = () => (
  <>
    <span className="corner top-2 left-2 border-t border-l rounded-tl-sm" />
    <span className="corner top-2 right-2 border-t border-r rounded-tr-sm" />
    <span className="corner bottom-2 left-2 border-b border-l rounded-bl-sm" />
    <span className="corner bottom-2 right-2 border-b border-r rounded-br-sm" />
  </>
);

export const IntroScreen: React.FC<IntroScreenProps> = ({ onStart }) => {
  const [isMusicOn, setIsMusicOn] = useState(true);

  useEffect(() => {
    startLobbyMusic();
    startPreventionTTS(TTS_LINE, 4500);
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
      startPreventionTTS(TTS_LINE, 4500);
      setIsMusicOn(true);
    }
  };

  const handleStart = (mode: GameMode) => {
    audio.init();
    audio.playBetSound();
    onStart(mode);
  };

  return (
    <div className="lobby-bg relative flex flex-col items-center justify-center min-h-screen text-[var(--ivory)] px-4 py-14 overflow-hidden">

      {/* 음악 토글 — 문구 유지 */}
      <button
        onClick={toggleMusic}
        aria-pressed={isMusicOn}
        className={`absolute top-5 right-5 z-50 flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold tracking-wide border transition-colors ${
          isMusicOn
            ? 'bg-[rgba(230,196,99,.1)] text-[var(--gold-hi)] border-[rgba(230,196,99,.55)]'
            : 'bg-transparent text-[var(--ivory-mute)] border-[rgba(255,255,255,.12)] hover:text-[var(--ivory-dim)]'
        }`}
      >
        {isMusicOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
        {isMusicOn ? '유혹의 소리 ON' : '유혹의 소리 OFF'}
      </button>

      {/* 히어로 */}
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10 text-center mb-12 max-w-3xl"
      >
        <div className="gold-rule w-56 mx-auto mb-5" />

        <h1 className="font-black-han gold-text breathe leading-[0.95] tracking-tight text-[clamp(2.9rem,10vw,5.4rem)]">
          영천중학교 CASINO
        </h1>

        <div className="gold-rule w-72 mx-auto mt-5 mb-6" />

        {/* 상담 안내 리본 */}
        <div className="inline-flex items-center gap-3 px-7 py-3.5 rounded-full border border-[rgba(230,196,99,.4)] bg-[rgba(230,196,99,.07)] backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-[var(--gold)] shrink-0" />
          <p
            className="font-black-han text-[clamp(1.25rem,4.8vw,2.15rem)] gold-text tracking-wide"
            style={{ filter: 'drop-shadow(0 1px 1px rgba(0,0,0,.6)) drop-shadow(0 0 16px rgba(230,196,99,.3))' }}
          >
            도박중독 김진균선생님과 1336번으로 해결
          </p>
        </div>

        {/* 축하금 */}
        <p className="mt-7 text-[clamp(1rem,3.6vw,1.4rem)] font-extrabold text-[var(--ivory)] tracking-wide">
          신규 가입 축하금{' '}
          <span className="tnum gold-text gold-glow font-black-han text-[1.22em] align-baseline">
            300,000원
          </span>{' '}
          지급!
          <span className="block mt-1.5 text-[.72em] font-bold text-[var(--ivory-dim)]">
            (중1 몇달치 용돈)
          </span>
        </p>
      </motion.div>

      {/* 게임 4종 — 원본 구조 유지 */}
      <div className="relative z-10 flex flex-col md:grid md:grid-cols-2 gap-5 w-full max-w-5xl px-2">
        {GAMES.map((g, i) => (
          <motion.button
            key={g.mode}
            onClick={() => handleStart(g.mode)}
            initial={{ y: 22, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.55, delay: 0.35 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
            whileTap={{ scale: 0.985 }}
            className="game-card sheen group relative rounded-2xl px-6 py-9 overflow-hidden"
          >
            <Corners />

            <div className="relative z-10 flex flex-col items-center justify-center">
              <div className="relative flex items-center justify-center mb-4">
                <span className="emoji-halo" style={{ background: g.halo }} />
                <span className="relative text-[3.6rem] leading-none drop-shadow-[0_6px_14px_rgba(0,0,0,.6)]">
                  {g.emoji}
                </span>
              </div>

              <h2 className="font-black-han text-[1.85rem] leading-tight text-[var(--ivory)] mb-1.5">
                {g.title}
              </h2>

              <p className="text-[.95rem] font-bold tracking-wide text-[var(--ivory-dim)] group-hover:text-[var(--gold-hi)] transition-colors">
                {g.desc}
              </p>
            </div>
          </motion.button>
        ))}
      </div>

      {/* 연령 경고 — 문구 유지 */}
      <div className="relative z-10 mt-14 text-center">
        <div className="gold-rule w-40 mx-auto mb-4 opacity-50" />
        <p className="text-[.72rem] leading-relaxed text-[var(--ivory-mute)]">
          * 19세 미만 청소년은 이용할 수 없습니다 (라는 경고문은 무시됩니다)
        </p>
      </div>
    </div>
  );
};
