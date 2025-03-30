// Represents the static definition of a level
export interface ILevelData {
  id: string;
  name: string;
  canvasSize: { width: number; height: number };
  ballStart: { x: number; y: number };
  targetPosition: { x: number; y: number };
  walls: {
    x: number;
    y: number;
    width: number;
    height: number;
    angle?: number;
  }[];
  availableMagnets: number; // How many magnets the player can place
  // Optional: Pre-placed fixed magnets, other obstacles, time limit etc.
}

// Represents the dynamic state of the game during play
export interface IGameState {
  levelId: string | null;
  status: 'idle' | 'playing' | 'won' | 'lost';
  ballPosition: { x: number; y: number }; // For potential UI display, physics is source of truth
  placedMagnets: IPlacedMagnet[];
  elapsedTime: number;
  // Add score, moves etc. later
}

export interface IPlacedMagnet {
  id: string; // Unique ID for this placed magnet
  x: number;
  y: number;
  isAttracting: boolean; // Polarity: true = attract, false = repel
  // Optional: type, strength if variable magnets are added
}
