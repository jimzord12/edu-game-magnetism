import { useCallback, useEffect, useRef } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
import GameEngine from '../engine/GameEngine';
import { ILevel } from '@/features/levels/types';
import {
  levelLost,
  levelWon,
  updateElapsedTime,
} from '../slices/electroGameSlice';

// let prevGameStatus: null | GameState = null;

/**
 * A hook that interfaces with the GameEngine singleton
 * This connects the persistent game engine to React components
 */
export const useGameEngineBridge = (
  levelData: ILevel<'electromagnet'> | null,
  containerRef: React.RefObject<HTMLDivElement | null>
) => {
  const gameEngine = GameEngine.getInstance();
  const dispatch = useAppDispatch();
  const gameTimerRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);

  // Get Redux state
  const { placedMagnets: magnets, status: gameStatus } = useAppSelector(
    (state) => state.electroGame
  );

  const recreateGameInstance = useCallback(() => {
    // If the game engine is already initialized, destroy it first
    if (!levelData || !containerRef.current) return;

    gameEngine.cleanup();
    // Create a new instance of the game engine
    gameEngine.initialize(levelData, containerRef.current);
  }, [levelData, containerRef]);

  // Initialize game engine when level changes
  useEffect(() => {
    if (!levelData || !containerRef.current) return;

    // Initialize game engine with level data
    gameEngine.initialize(levelData, containerRef.current);

    // Set up event listeners
    const unsubscribeWin = gameEngine.onWin(() => {
      dispatch(levelWon());
    });
    const unsubscribeLose = gameEngine.onLose(() => {
      dispatch(levelLost());
    });

    return () => {
      // Cleanup event listeners
      unsubscribeWin();
      unsubscribeLose();

      // Stop game loop if it's running
      if (gameTimerRef.current) {
        cancelAnimationFrame(gameTimerRef.current);
        gameTimerRef.current = null;
      }
    };
  }, [levelData, containerRef]);

  useEffect(() => {
    if (gameStatus === 'idle' && gameEngine.engine === null) {
      gameEngine.initialize(levelData!, containerRef.current!);
    }
  }, [gameStatus, levelData, containerRef]);

  // Update magnets in the physics world when they change
  useEffect(() => {
    if (!magnets) return;

    // Update magnets in the physics engine
    gameEngine.updateMagnets(magnets);
  }, [magnets]);

  // Handle game status changes (play, pause, etc.)
  useEffect(() => {
    console.log('AAAAAAAAAAAAAAA');
    // Stop any existing game loop
    if (gameTimerRef.current) {
      cancelAnimationFrame(gameTimerRef.current);
      gameTimerRef.current = null;
    }

    // Sync game engine status with Redux status
    gameEngine.setGameStatus(gameStatus);

    if (gameStatus === 'playing') {
      // Start game loop
      const gameLoop = () => {
        // Update physics
        gameEngine.update();

        // Apply magnetic forces
        gameEngine.applyMagneticForces(magnets);

        // Update elapsed time in Redux
        dispatch(updateElapsedTime(gameEngine.getElapsedTime()));

        // Continue loop
        gameTimerRef.current = requestAnimationFrame(gameLoop);
      };

      // Start loop
      gameTimerRef.current = requestAnimationFrame(gameLoop);

      // Clear paused time
      pausedTimeRef.current = null;
    } else if (gameStatus === 'paused') {
      // Store the current time when paused
      pausedTimeRef.current = Date.now();
    } else if (gameStatus === 'idle') {
      // Reset ball position when returning to idle
      gameEngine.resetBall();
      pausedTimeRef.current = null;
    } else if (gameStatus === 'won' || gameStatus === 'lost') {
      // Game over states - no need to reset yet
      pausedTimeRef.current = null;
    }

    return () => {
      if (gameTimerRef.current) {
        cancelAnimationFrame(gameTimerRef.current);
        gameTimerRef.current = null;
      }
    };
  }, [gameStatus, magnets, dispatch]);

  return {
    resetBall: () => gameEngine.resetBall(),
    getEngine: () => gameEngine,
    recreateGameInstance,
  };
};
