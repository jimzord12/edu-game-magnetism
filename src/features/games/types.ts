import { ElectroMagnet } from '@/models/ElectroMagnet';
import { Magnet } from '@/models/Magnet';
import { ILevelMagnet, ILevelElectroMagnet, GameType } from '../levels/types';

export type GameState = 'idle' | 'playing' | 'won' | 'lost';

// Represents the dynamic state of the game during play
export interface IGameState<T extends GameType> {
  levelId: number | null;
  status: GameState;
  ballPosition: { x: number; y: number }; // For potential UI display, physics is source of truth
  placedMagnets: T extends 'magnet' ? Magnet[] : ElectroMagnet[];
  elapsedTime: number;
  // Add score, moves etc. later
}

export interface UseGameEnginePropsBase {
  gameStatus: GameState;
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export interface UseMagnetGameEngineProps extends UseGameEnginePropsBase {
  levelData: ILevelMagnet | null;
  magnets: Magnet[];
}

export interface UseElectroMagnetGameEngineProps
  extends UseGameEnginePropsBase {
  levelData: ILevelElectroMagnet | null;
  magnets: ElectroMagnet[];
}

export type UseGameEngineProps<T extends GameType> = T extends 'magnet'
  ? UseMagnetGameEngineProps
  : UseElectroMagnetGameEngineProps;
