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
    let currentBalance = 0; // Starts at 0 (or some initial representation)
    data.push({ round: 0, balance: 0 });
    
    // Generate synthetic realistic-looking gambling data representing "wallet balance"
    for (let i = 1; i <= betCount; i++) {
      const isWin = Math.random() > 0.6; // 40% win rate (House edge)
      const swing = (totalLost / Math.max(1, betCount)) * (Math.random() * 2 + 0.5);
      
      if (isWin) {
        currentBalance += swing * 0.8; // Illusion of winning
      } else {
        currentBalance -= swing * 1.5; // Losing more (dropping down)
      }
      
      // Ensure the final point accurately reflects the actual total lost in negative
      if (i === betCount) {
        currentBalance = -totalLost;
      }
      
      data.push({ round: i, balance: Math.round(currentBalance) });
    }
    return data;
  }, [betCount, totalLost]);

  useEffect(() => {
    // Play calm, solemn BGM pad
    audio.playSolemnBGM();
    
    // Slight delay to let the BGM set the atmosphere before speaking
    setTimeout(() => {
      audio.speakEducationalMessage();
    }, 1000);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 backdrop-blur-xl text-white p-4 pt-12 glitch-effect select-none absolute inset-0 z-50 overflow-y-auto" data-text="">
      
      {/* Forced Game Over Header */}
      <div className="absolute top-0 left-0 w-full bg-red-900 text-white text-center py-2 border-b-4 border-red-700 font-bold tracking-widest animate-pulse z-20 shadow-[0_4px_20px_rgba(220,38,38,0.5)] text-sm md:text-base">
        🚫 접근 제한: 더 이상 게임을 진행할 수 없습니다 🚫
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, delay: 0.5 }}
        className="max-w-3xl w-full text-center relative z-10 my-auto pb-4"
      >
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="flex justify-center mb-2"
        >
          <Skull size={40} className="text-red-600" />
        </motion.div>
        
        <h1 className="text-xl md:text-3xl font-black-han text-red-600 mb-3 tracking-wider">
          도박의 끝은 언제나 파멸입니다.
        </h1>

        {/* User Stats Visualization */}
        <div className="flex flex-col gap-3 mb-4">
          <div className="flex flex-col md:flex-row gap-2 justify-center">
            <div className="bg-red-950/40 border border-red-900 rounded-lg p-2 flex-1 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
               <p className="text-gray-400 font-bold mb-1 text-xs tracking-widest">당신이 방금 잃은 총액</p>
               <p className="text-xl font-black-han text-red-500">{totalLost.toLocaleString()} 원</p>
            </div>
            <div className="bg-red-950/40 border border-red-900 rounded-lg p-2 flex-1 shadow-[0_0_15px_rgba(220,38,38,0.2)]">
               <p className="text-gray-400 font-bold mb-1 text-xs tracking-widest">속아 넘어간 횟수</p>
               <p className="text-xl font-black-han text-red-500">{betCount} 회</p>
            </div>
          </div>

          {/* Recharts Graph: Correlation between Bet Count and Loss */}
          <div className="bg-zinc-900/80 border border-red-900/50 rounded-xl p-4 shadow-[0_0_20px_rgba(220,38,38,0.1)] h-56 md:h-72 w-full relative">
            <div className="flex justify-between items-start mb-2">
              <p className="text-xs text-red-400 font-bold tracking-widest uppercase">나의 지갑 상태 (잔고 추이)</p>
              <p className="text-[10px] md:text-xs text-gray-400 bg-red-950/50 px-2 py-1 rounded border border-red-900/30">
                "가끔 이기는 듯 보이지만, 결국엔 추락합니다"
              </p>
            </div>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 15, right: 10, left: -10, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#444" vertical={false} />
                <XAxis 
                  dataKey="round" 
                  stroke="#888" 
                  tick={{fill: '#888', fontSize: 10}} 
                  tickLine={false}
                />
                <YAxis 
                  stroke="#888" 
                  tick={{fill: '#888', fontSize: 10}} 
                  tickFormatter={(val) => val < 0 ? `-₩${Math.abs(val/1000).toFixed(0)}k` : `₩${(val/1000).toFixed(0)}k`}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#18181b', borderColor: '#7f1d1d', borderRadius: '8px' }}
                  itemStyle={{ color: '#ef4444' }}
                  labelStyle={{ color: '#a1a1aa' }}
                  formatter={(value: number) => [
                    value < 0 ? `-₩${Math.abs(value).toLocaleString()}` : `₩${value.toLocaleString()}`, 
                    '현재 지갑 잔고'
                  ]}
                  labelFormatter={(label) => `${label}번째 베팅 후`}
                />
                <Line 
                  type="monotone" 
                  dataKey="balance" 
                  stroke="#ef4444" 
                  strokeWidth={3} 
                  dot={{ r: 3, fill: '#ef4444', strokeWidth: 0 }} 
                  activeDot={{ r: 6, fill: '#f87171' }} 
                  animationDuration={2000}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-2 text-xs md:text-sm text-left bg-zinc-900 border border-red-900 p-3 md:p-4 rounded-xl shadow-[0_0_20px_rgba(220,38,38,0.3)]">
          
          <div className="flex items-start gap-2 md:gap-3">
            <ShieldAlert className="text-yellow-500 shrink-0 w-4 h-4 md:w-5 md:h-5 mt-0.5" />
            <p>
              <strong className="text-red-400">당신은 지지 않았습니다. 이길 수 없었습니다.</strong><br/>
              이 게임의 10회 결과는 당신이 시작하기 전에 이미 정해져 있었습니다.
            </p>
          </div>

          <div className="flex items-start gap-2 md:gap-3">
            <AlertTriangle className="text-yellow-500 shrink-0 w-4 h-4 md:w-5 md:h-5 mt-0.5" />
            <p>
              <strong className="text-red-400">게임 도중 큰 돈을 딴 적이 있으시죠?</strong><br/>
              그것은 당신의 실력이 아니라 저희가 설계한 것입니다. 가끔씩 이기게 해주는 것도 마찬가지입니다.<br/>
              '조금만 더 하면 회복할 수 있다'고 믿게 만들기 위한 장치였습니다.
            </p>
          </div>

          <div className="flex items-start gap-2 md:gap-3">
            <Skull className="text-red-500 shrink-0 w-4 h-4 md:w-5 md:h-5 mt-0.5" />
            <p>
              <strong className="text-red-400">실제 도박 사업자도 똑같이 합니다.</strong> 다만 당신에게 알려주지 않을 뿐입니다.
            </p>
          </div>
        </div>

        {/* Neon Sign for Help */}
        <div className="mt-4 md:mt-5 mb-16">
          <div className="inline-block border-2 md:border-4 border-yellow-400 p-3 md:p-5 rounded-2xl shadow-[0_0_30px_rgba(253,224,71,0.8)] bg-black">
            <p className="text-lg md:text-2xl font-black-han text-yellow-300 neon-text tracking-wide leading-tight py-1 md:py-2">
              도박중독 <span className="text-pink-500 mx-1 text-xl md:text-3xl">김진균선생님</span>과 상담<br/>
              또는 <span className="text-cyan-400 mx-1 text-2xl md:text-4xl">1336번</span>으로 신고
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
