import { motion } from 'motion/react';
import React, { useEffect } from 'react';
import { HandCoins } from 'lucide-react';
import { audio } from '../utils/audio';

interface LoanScreenProps {
  onAcceptLoan: () => void;
  loanAmount: number;
}

export const LoanScreen: React.FC<LoanScreenProps> = ({ onAcceptLoan, loanAmount }) => {
  useEffect(() => {
    audio.playLoanPrompt();
  }, []);

  const handleAccept = () => {
    audio.playBetSound();
    onAcceptLoan();
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-black/90 backdrop-blur-md text-white p-4 absolute inset-0 z-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-gradient-to-b from-zinc-800 to-zinc-950 border-2 border-red-900 p-8 rounded-2xl max-w-md w-full text-center shadow-[0_0_50px_rgba(220,38,38,0.2),inset_0_1px_0_rgba(255,255,255,0.06)]"
      >
        <div className="flex justify-center mb-6">
          <HandCoins size={64} className="text-yellow-500" />
        </div>
        
        <h2 className="text-3xl font-black-han text-red-500 mb-2">잔액 부족</h2>
        <p className="text-zinc-400 mb-8">보유하신 게임 머니가 모두 소진되었습니다.</p>
        
        <div className="bg-black p-4 rounded-xl mb-8 border border-zinc-800">
          <p className="text-sm text-zinc-500 mb-2">VIP 특별 대출</p>
          <p className="text-2xl font-bold text-yellow-400 mb-1">{loanAmount.toLocaleString()} ₩</p>
          <p className="text-xs text-red-400">* 이자율: 일 120% (복리 적용)</p>
        </div>

        <button
          onClick={handleAccept}
          className="sheen w-full bg-gradient-to-r from-red-700 to-red-900 hover:from-red-600 hover:to-red-800 text-white font-bold py-4 rounded-xl text-xl transition-all shadow-[0_10px_20px_-6px_rgba(127,29,29,0.6),inset_0_1px_0_rgba(255,255,255,0.15)]"
        >
          대출받고 게임 계속하기
        </button>
      </motion.div>
    </div>
  );
};

