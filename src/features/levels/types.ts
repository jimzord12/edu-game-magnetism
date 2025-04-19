import { Wall } from '@/models/Wall';

export type GameType = 'magnet' | 'electromagnet';

// Represents the static definition of a level
export interface ILevelBase {
  id: number;
  name: string;
  gameType: GameType;
  canvasSize: { width: number; height: number };
  ballStart: { x: number; y: number };
  targetPosition: { x: number; y: number };
  walls: Wall[];
  availableMagnets: number; // How many magnets the player can place

  timeLimit?: number;
  progress: ILevelProgress;   
  // Optional: Pre-placed fixed magnets, other obstacles, time limit etc.
}

export interface ILevelMagnet extends Omit<ILevelBase, 'availableMagnets'> {
  gameType: 'magnet';
  availableMagnets: {
    attract: number;
    repel: number;
  };
}

export interface ILevelElectroMagnet extends ILevelBase {
  gameType: 'electromagnet';
}

export const isMagnetLevel = (
  level: ILevelMagnet | ILevelElectroMagnet
): level is ILevelMagnet => {
  return level.gameType === 'magnet';
};

export type ILevel<T> = T extends 'magnet' ? ILevelMagnet : ILevelElectroMagnet;

export interface ILevelProgress {
  completed: boolean;
  bestTime?: number;
}

export interface AllLevels {
  magnet: ILevelMagnet[];
  electromagnet: ILevelElectroMagnet[];
}
