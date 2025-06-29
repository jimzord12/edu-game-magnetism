import React, { useRef } from 'react';
import { useGameEngineMagnet } from '../hooks/useGameEngineMagnet';
import { GameType, ILevel } from '@/features/levels/types';

interface GameCanvasProps<T extends GameType> {
  levelData: ILevel<T> | null;
}

const MagnetGameCanvas: React.FC<
  GameCanvasProps<'magnet'> & {
    forceRerender: () => void;
  }
> = ({ levelData, forceRerender }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  // const { placedMagnets, status: gameStatus } = useAppSelector(
  //   (state) => state.magnetGame
  // );

  // Use the custom hook to manage the p5/Matter instance
  useGameEngineMagnet({
    levelData,
    containerRef,
    forceRerender,
  });

  // // Effect to reset ball when level changes or game resets externally
  // useEffect(() => {
  //   if (gameStatus === 'idle' && levelData) {
  //     // resetBall(); // Reset ball when entering idle state for a level
  //     // Note: Resetting might be better handled inside the hook's setup
  //     //       or triggered by a specific 'reset level' action.
  //   }
  // }, [gameStatus, levelData]);

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

export default MagnetGameCanvas;
