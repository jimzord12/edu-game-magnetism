import { useEffect } from 'react';
import GameEngineElectro from '../engine/GameEngineElectro';
import { ElectroMagnet } from '@/models/ElectroMagnet';
import {
  levelLost,
  levelWon,
  pauseGame,
  placeMagnet,
  startGame,
  updateElapsedTime,
} from '../slices/electroGameSlice';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import { ILevel } from '@/features/levels/types';

/**
 * A hook that interfaces with the GameEngine singleton
 * This connects the persistent game engine to React components
 */
export const useGameEngineSimple = (
  levelData: ILevel<'electromagnet'> | null,
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  // Get Redux state
  const { status: gameStatus, placedMagnets: magnets } = useAppSelector(
    (state) => state.electroGame
  );

  const dispatch = useAppDispatch();
  const gameEngine = GameEngineElectro.getInstance(); // <-- Not Instantiated here
  const onPlaceMagnet = (x: number, y: number) => {
    const newElectroMagnet = new ElectroMagnet({
      x,
      y,
      isAttracting: true,

      matterOptions: {
        isStatic: false,
        isSensor: levelData?.magnetsOnlySensors,
      },
    });
    dispatch(placeMagnet(newElectroMagnet));
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
    const gameEngine = GameEngineElectro.getInstance(); // <-- Not Instantiated here
    console.log('[useEffect]: ontainerRef.current:', containerRef.current);
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
