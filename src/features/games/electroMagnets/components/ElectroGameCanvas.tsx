import React, { useRef } from 'react';
import { GameType, ILevel } from '@/features/levels/types';
import { useGameEngineBridge } from '../hooks/useGameEngineBridge';

interface GameCanvasProps<T extends GameType> {
  levelData: ILevel<T> | null;
}

const ElectroGameCanvas: React.FC<GameCanvasProps<'electromagnet'>> = ({
  levelData,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  // Use the bridge hook to connect to the singleton GameEngine
  useGameEngineBridge(levelData, containerRef);

  return (
    <div className="game-canvas-container">
      {/* The p5 canvas will be created inside this div by the GameEngine */}
      <div ref={containerRef} className="p5-canvas-wrapper">
        {!levelData && <p>Loading level...</p>}
      </div>
    </div>
  );
};

export default ElectroGameCanvas;
