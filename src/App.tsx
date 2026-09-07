/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { GameState, GameMode } from './types';
import { LobbyScreen } from './components/LobbyScreen';
import { IntroScreen } from './components/IntroScreen';
import { GameScreen } from './components/GameScreen';
import { SlotScreen } from './components/SlotScreen';
import { LadderScreen } from './components/LadderScreen';
import { OstrichScreen } from './components/OstrichScreen';
import { LoanScreen } from './components/LoanScreen';
import { EducationScreen } from './components/EducationScreen';

export default function App() {
  const [gameState, setGameState] = useState<GameState>('LOBBY');
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [balance, setBalance] = useState<number>(300000);
  const [betHistoryCount, setBetHistoryCount] = useState<number>(0);
  const [loansTaken, setLoansTaken] = useState<number>(0);

  const handleEnterLobby = () => {
    setGameState('INTRO');
  };

  const handleStartGame = (mode: GameMode) => {
    setGameMode(mode);
    setGameState('BETTING');
  };

  const handleBackToLobby = () => {
    setGameState('INTRO');
    setGameMode(null);
  };

  const handleGameEnd = (newBalance: number, outcome: 'WIN' | 'LOSE') => {
    setBalance(newBalance);
    setBetHistoryCount(prev => prev + 1);

    if (newBalance <= 0) {
      // Go straight to education screen on bankruptcy
      setGameState('EDUCATION');
    } else {
      setGameState('BETTING');
    }
  };

  const handleAcceptLoan = () => {
    setLoansTaken(prev => prev + 1);
    const loanAmount = loansTaken === 0 ? 500000 : 1000000;
    setBalance(loanAmount);
    setGameState('BETTING');
  };

  const triggerEducation = () => {
    setGameState('EDUCATION');
  };

  const renderActiveGame = () => {
    if (gameMode === 'SLOT') {
      return (
        <SlotScreen 
          balance={balance} 
          betHistoryCount={betHistoryCount} 
          onGameEnd={handleGameEnd} 
          onTriggerEducation={triggerEducation}
          onBack={handleBackToLobby}
        />
      );
    }
    if (gameMode === 'LADDER') {
      return (
        <LadderScreen 
          balance={balance} 
          betHistoryCount={betHistoryCount} 
          onGameEnd={handleGameEnd} 
          onTriggerEducation={triggerEducation}
        />
      );
    }
    if (gameMode === 'OSTRICH') {
      return (
        <OstrichScreen 
          balance={balance} 
          betHistoryCount={betHistoryCount} 
          onGameEnd={handleGameEnd} 
          onTriggerEducation={triggerEducation}
        />
      );
    }
    return (
      <GameScreen 
        balance={balance} 
        betHistoryCount={betHistoryCount} 
        onGameEnd={handleGameEnd} 
        onTriggerEducation={triggerEducation}
      />
    );
  };

  return (
    <div className="min-h-screen bg-black font-sans selection:bg-pink-500/30">
      {gameState === 'LOBBY' && (
        <LobbyScreen onEnter={handleEnterLobby} />
      )}

      {gameState === 'INTRO' && (
        <IntroScreen onStart={handleStartGame} />
      )}
      
      {(gameState === 'BETTING' || gameState === 'RACING' || gameState === 'RESULT') && (
        renderActiveGame()
      )}

      {gameState === 'EDUCATION' && (
        <div className="relative">
          {/* Keep game screen in background but heavily blurred */}
          <div className="blur-xl pointer-events-none grayscale opacity-50">
            {renderActiveGame()}
          </div>
          <EducationScreen 
            betCount={betHistoryCount} 
            totalLost={300000 - balance} 
          />
        </div>
      )}
    </div>
  );
}

