import { ElectroMagnet } from '@/models/ElectroMagnet';
import { Magnet } from '@/models/Magnet';
import { ILevelMagnet, ILevelElectroMagnet, GameType } from '../levels/types';
import { Ball } from '@/models/Ball';
import Matter from 'matter-js';

export type GameState = 'idle' | 'playing' | 'won' | 'lost' | 'paused';

// Represents the dynamic state of the game during play
export interface IGameState<T extends GameType> {
  levelId: number | null;
  status: GameState;
  ballPosition: { x: number; y: number }; // For potential UI display, physics is source of truth
  placedMagnets: T extends 'magnet' ? Magnet[] : ElectroMagnet[];
  elapsedTime: number;
  engine: Matter.Engine | null; // Matter.js engine instance
  ball: Ball | null; // Ball object
  target: Ball | null; // Target object
  startTime: number | null; // Start time for elapsed time calculation
  // Add score, moves etc. later
}

export interface UseGameEnginePropsBase {
  // gameStatus: GameState;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseMagnetGameEngineProps extends UseGameEnginePropsBase {
  levelData: ILevelMagnet | null;
  // magnets: Magnet[];
}

export interface UseElectroMagnetGameEngineProps
  extends UseGameEnginePropsBase {
  levelData: ILevelElectroMagnet | null;
  magnets: ElectroMagnet[];
  gameStatus: GameState;
  containerRef: React.RefObject<HTMLDivElement | null>;
  // engine: Matter.Engine | null;
  // ball: Ball | null;
  // target: Ball | null;
  // startTime: number | null; // Initialize start time
}

export type UseGameEngineProps<T extends GameType> = T extends 'magnet'
  ? UseMagnetGameEngineProps
  : UseElectroMagnetGameEngineProps;

export type MovementType = 'oscillate' | 'circular' | 'linear'; // You can extend this later

export interface MovementPattern {
  type: MovementType;

  // For "oscillate" and "linear" types
  axis?: 'horizontal' | 'vertical'; // Optional (but required for oscillate and linear)
  amplitude?: number; // How far the entity moves from its original position (for oscillation)
  speed?: number; // How fast it moves (affects frequency for oscillation)

  // For "circular" type
  radius?: number; // Radius of the circular path
  center?: { x: number; y: number }; // Optional, defaults to initial position

  // Optional extras for all types
  startDelay?: number; // Delay in seconds before movement starts
  loop?: boolean; // Whether the movement repeats (default true)

  direction?: 1 | -1; // For circular movement
}
