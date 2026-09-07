import { motion } from 'motion/react';
import React from 'react';
import { Card } from '../types';

interface CardItemProps {
  card: Card;
  isHidden?: boolean;
}

export const CardItem: React.FC<CardItemProps> = ({ card, isHidden = false }) => {
  return (
    <motion.div
      initial={{ rotateY: 180 }}
      animate={{ rotateY: isHidden ? 180 : 0 }}
      transition={{ duration: 0.6, type: 'spring' }}
      className="relative w-20 h-28 md:w-24 md:h-36 preserve-3d"
      style={{ transformStyle: 'preserve-3d' }}
    >
      {/* Front of card */}
      <div 
        className="absolute inset-0 bg-white rounded-xl shadow-lg flex flex-col justify-between p-2 border-2 border-gray-200 backface-hidden"
        style={{ backfaceVisibility: 'hidden', color: card.color }}
      >
        <div className="text-lg md:text-xl font-bold leading-none">{card.value}</div>
        <div className="text-3xl md:text-5xl self-center">{card.suit}</div>
        <div className="text-lg md:text-xl font-bold leading-none self-end rotate-180">{card.value}</div>
      </div>

      {/* Back of card */}
      <div 
        className="absolute inset-0 bg-gradient-to-br from-indigo-700 to-purple-900 rounded-xl shadow-lg border-2 border-purple-400 backface-hidden flex items-center justify-center"
        style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
      >
        <div className="text-purple-300 opacity-50 font-black-han text-xl">VIP</div>
      </div>
    </motion.div>
  );
};
