import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import {
  levelLost,
  levelWon,
  pauseGame,
  placeMagnet,
  startGame,
  //   updateBallPosition,
  updateElapsedTime,
} from '../slices/magnetGameSlice'; // Import actions
import { UseGameEngineProps } from '../../types';
import GameEngineMagnets from '../engine/GameEngineMagnets';
import { Magnet } from '@/models/Magnet';

export const useGameEngineMagnet = ({
  levelData,
  // magnets,
  // gameStatus,
  containerRef,
}: UseGameEngineProps<'magnet'>) => {
  // Get Redux state
  const { status: gameStatus, placedMagnets: magnets } = useAppSelector(
    (state) => state.magnetGame
  );
  const dispatch = useAppDispatch();

  const gameEngine = GameEngineMagnets.getInstance(); // <-- Not Instantiated here
  const onPlaceMagnet = (x: number, y: number) => {
    const newMagnet = new Magnet({
      x,
      y,
      isAttracting: true,

      matterOptions: {
        isStatic: false,
        isSensor: levelData?.magnetsOnlySensors,
      },
    });
    dispatch(placeMagnet(newMagnet));
  };

  const handleUpdateTime = (time: number) => {
    dispatch(updateElapsedTime(time));
  };

  const handleGameStatusChange = (status: string) => {
    switch (status) {
      case 'playing':
        dispatch(startGame());
        break;
      case 'paused':
        dispatch(pauseGame());

        break;
      case 'won':
        dispatch(levelWon());
        break;

      case 'lost':
        dispatch(levelLost());

        break;
      default:
        break;
    }
  };

  useEffect(() => {
    if (containerRef.current === null || levelData === null) return;

    // Instantiate the GameEngine singleton
    const gameEngine = GameEngineMagnets.getInstance(); // <-- Not Instantiated here
    console.log('[useEffect]: ContainerRef.current:', containerRef.current);
    gameEngine.initialize(
      levelData,
      containerRef.current,
      onPlaceMagnet,
      handleUpdateTime,
      handleGameStatusChange
    ); // <-- Initialize the engine with the container
  }, [
    containerRef.current,
    gameEngine.isInitialized,
    gameEngine.isWorldReady,
    levelData,
  ]); // Only re-run if containerRef or levelData changes

  useEffect(() => {
    gameEngine.setGameStatus(gameStatus);
    console.log('[useEffect]: gameStatus:', gameStatus);
  }, [gameStatus, dispatch]);

  useEffect(() => {
    if (!magnets) return;

    // Update magnets in the physics engine
    gameEngine.updateMagnets(Array.from(magnets));
    console.log('useEffect: Updated Magnets:', magnets);
  }, [magnets]);
};
