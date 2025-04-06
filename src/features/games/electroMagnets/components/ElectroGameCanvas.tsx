import React, { useRef, useEffect } from 'react';
import { useAppSelector } from '../../../../hooks/reduxHooks';
import './ElectroGameCanvas.css'; // For basic styling
import { GameType, ILevel } from '@/features/levels/types';
import { useGameEngine } from '../../magnets/hooks/useGameEngine';

interface GameCanvasProps<T extends GameType> {
  levelData: ILevel<T> | null;
}

const ElectroGameCanvas: React.FC<GameCanvasProps<'electromagnet'>> = ({
  levelData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { placedMagnets, status: gameStatus } = useAppSelector(
    (state) => state.electroGame
  );

  // Use the custom hook to manage the p5/Matter instance
  const { resetBall } = useGameEngine<'electromagnet'>({
    levelData,
    magnets: placedMagnets,
    gameStatus,
    containerRef,
  });

  // Effect to reset ball when level changes or game resets externally
  useEffect(() => {
    if (gameStatus === 'idle' && levelData) {
      // resetBall(); // Reset ball when entering idle state for a level
      // Note: Resetting might be better handled inside the hook's setup
      //       or triggered by a specific 'reset level' action.
    }
  }, [gameStatus, levelData, resetBall]);

  return (
    <div className="game-canvas-container">
      {/* The p5 canvas will be created inside this div by the hook */}
      <div ref={containerRef} className="p5-canvas-wrapper">
        {!levelData && <p>Loading level...</p>}
      </div>
      {/* You can add overlay UI elements here if needed */}
    </div>
  );
};

export default ElectroGameCanvas;
