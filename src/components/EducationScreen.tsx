import { motion } from 'motion/react';
import React, { useEffect, useMemo } from 'react';
import { Skull, AlertTriangle, ShieldAlert } from 'lucide-react';
import { audio } from '../utils/audio';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface EducationScreenProps {
  betCount: number;
  totalLost: number;
}

export const EducationScreen: React.FC<EducationScreenProps> = ({ betCount, totalLost }) => {
  const chartData = useMemo(() => {
    const data = [];
    let currentBalance = 0;
    data.push({ round: 0, balance: 0 });

    for (let i = 1; i <= betCount; i++) {
      const isWin = Math.random() > 0.6;
      const swing = (totalLost / Math.max(1, betCount)) * (Math.random() * 2 + 0.5);
      currentBalance += isWin ? swing * 0.8 : -swing * 1.5;
      if (i === betCount) currentBalance = -totalLost;
      data.push({ round: i, balance: Math.round(currentBalance) });
    }
    return data;
  }, [betCount, totalLost]);

  useEffect(() => {
    audio.playSolemnBGM();
    const t = setTimeout(() => audio.speakEducationalMessage(), 1000);
    return () => clearTimeout(t);
  }, []);

  const points: { icon: React.ReactNode; body: React.ReactNode }[] = [
    {
      icon: <ShieldAlert className="text-[var(--blood)] shrink-0 w-5 h-5 mt-0.5" />,
      body: (
        <>
          <strong className="text-[var(--blood)]">당신은 지지 않았습니다. 이길 수 없었습니다.</strong>
          <br />
          이 게임의 10회 결과는 당신이 시작하기 전에 이미 정해져 있었습니다.
        </>
      ),
    },
    {
      icon: <AlertTriangle className="text-[var(--blood)] shrink-0 w-5 h-5 mt-0.5" />,
      body: (
        <>
          <strong className="text-[var(--blood)]">게임 도중 큰 돈을 딴 적이 있으시죠?</strong>
          <br />
          그것은 당신의 실력이 아니라 저희가 설계한 것입니다. 가끔씩 이기게 해주는 것도 마찬가지입니다.
          <br />
          '조금만 더 하면 회복할 수 있다'고 믿게 만들기 위한 장치였습니다.
        </>
      ),
    },
    {
      icon: <Skull className="text-[var(--blood)] shrink-0 w-5 h-5 mt-0.5" />,
      body: (
        <>
          <strong className="text-[var(--blood)]">실제 도박 사업자도 똑같이 합니다.</strong> 다만 당신에게 알려주지 않을 뿐입니다.
        </>
      ),
    },
  ];

  return (
    <div className="edu-bg absolute inset-0 z-50 flex flex-col items-center min-h-screen text-[var(--ash-txt)] px-4 pt-12 pb-10 select-none overflow-y-auto">

      {/* 접근 제한 띠 */}
      <div className="edu-band absolute top-0 left-0 w-full text-center py-2 font-bold tracking-widest text-sm md:text-base text-white z-20">
        🚫 접근 제한: 더 이상 게임을 진행할 수 없습니다 🚫
      </div>

      <motion.div
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1.1, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-3xl w-full text-center relative z-10 my-auto"
      >
        <div className="flex justify-center mb-3">
          <Skull size={38} className="text-[var(--blood)]" />
        </div>

        <h1 className="font-black-han text-2xl md:text-4xl text-[var(--ash-txt)] tracking-tight leading-tight">
          도박의 끝은 언제나 파멸입니다.
        </h1>
        <div className="w-24 h-[2px] bg-[var(--blood)] mx-auto mt-3 mb-6" />

        {/* 통계 */}
        <div className="flex flex-col md:flex-row gap-2.5 justify-center mb-3">
          <div className="edu-stat rounded-lg p-3 flex-1">
            <p className="text-[var(--ash-mute)] font-bold mb-1.5 text-[11px] tracking-widest">당신이 방금 잃은 총액</p>
            <p className="tnum text-2xl font-black-han text-[var(--blood)]">{totalLost.toLocaleString()} 원</p>
          </div>
          <div className="edu-stat rounded-lg p-3 flex-1">
            <p className="text-[var(--ash-mute)] font-bold mb-1.5 text-[11px] tracking-widest">속아 넘어간 횟수</p>
            <p className="tnum text-2xl font-black-han text-[var(--blood)]">{betCount} 회</p>
          </div>
        </div>

        {/* 잔고 추이 */}
        <div className="edu-panel rounded-xl p-4 h-56 md:h-72 w-full relative mb-4">
          <div className="flex justify-between items-start mb-2 gap-2">
            <p className="text-[11px] text-[var(--ash-dim)] font-bold tracking-widest">나의 지갑 상태 (잔고 추이)</p>
            <p className="text-[10px] md:text-[11px] text-[var(--ash-dim)] bg-[#111820] px-2 py-1 rounded border border-[var(--ash-line)]">
              "가끔 이기는 듯 보이지만, 결국엔 추락합니다"
            </p>
          </div>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 22 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#263141" vertical={false} />
              <XAxis dataKey="round" stroke="#566375" tick={{ fill: '#566375', fontSize: 10 }} tickLine={false} />
              <YAxis
                stroke="#566375"
                tick={{ fill: '#566375', fontSize: 10 }}
                tickFormatter={(val) => (val < 0 ? `-₩${Math.abs(val / 1000).toFixed(0)}k` : `₩${(val / 1000).toFixed(0)}k`)}
                tickLine={false}
                axisLine={false}
              />
              <Tooltip
                contentStyle={{ backgroundColor: '#0e1319', borderColor: '#263141', borderRadius: 8 }}
                itemStyle={{ color: '#ff4d6a' }}
                labelStyle={{ color: '#8996a8' }}
                formatter={(value: number) => [
                  value < 0 ? `-₩${Math.abs(value).toLocaleString()}` : `₩${value.toLocaleString()}`,
                  '현재 지갑 잔고',
                ]}
                labelFormatter={(label) => `${label}번째 베팅 후`}
              />
              <Line
                type="monotone"
                dataKey="balance"
                stroke="#ff4d6a"
                strokeWidth={2.5}
                dot={{ r: 2.5, fill: '#ff4d6a', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#ff8098' }}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* 해설 */}
        <div className="edu-panel rounded-xl p-4 text-left space-y-3 text-xs md:text-sm leading-relaxed">
          {points.map((p, i) => (
            <div key={i} className={`flex items-start gap-3 ${i > 0 ? 'pt-3 border-t border-[var(--ash-line)]' : ''}`}>
              {p.icon}
              <p className="text-[var(--ash-dim)]">{p.body}</p>
            </div>
          ))}
        </div>

        {/* 상담 안내 — 이 화면에서 유일하게 빛나는 곳 */}
        <div className="mt-7">
          <div className="help-sign inline-block px-5 py-4 md:px-8 md:py-6 rounded-2xl">
            <p className="font-black-han text-lg md:text-2xl text-[#c8fff0] tracking-wide leading-snug">
              도박중독 <span className="mx-1 text-xl md:text-3xl text-white">김진균선생님</span>과 상담
              <br />
              또는 <span className="mx-1 text-2xl md:text-4xl text-[#7be3c4]">1336번</span>으로 신고
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
