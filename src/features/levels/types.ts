import { ElectroMagnet } from '@/models/ElectroMagnet';
import { Magnet } from '@/models/Magnet';
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
  // hazards?: Wall[]; // Added optional hazards array
  availableMagnets: number; // How many magnets the player can place
  minMagnetsToStart: number; // Minimum magnets to start the level

  timeLimit?: number;
  progress: ILevelProgress;
  magnetsOnlySensors?: boolean; // Whether the magnets have physical bodies or not
  // Optional: Pre-placed fixed magnets, other obstacles, time limit etc.
}

export interface ILevelMagnet extends Omit<ILevelBase, 'availableMagnets'> {
  gameType: 'magnet';
  availableMagnets: number;
  magnets: Magnet[]; // Array of placed magnets
  canBeDragged: boolean; // Whether the magnets can be dragged or not
}

export interface ILevelElectroMagnet extends ILevelBase {
  gameType: 'electromagnet';
  electromagnets: ElectroMagnet[];
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
