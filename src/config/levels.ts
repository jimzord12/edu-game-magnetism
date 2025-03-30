import { ILevelData } from '../features/game/types';

export const DEFAULT_LEVELS: ILevelData[] = [
  {
    id: 'level-1',
    name: 'The Basics',
    canvasSize: { width: 800, height: 600 },
    ballStart: { x: 100, y: 300 },
    targetPosition: { x: 700, y: 300 },
    walls: [
      // Borders
      { x: 400, y: 5, width: 800, height: 10 }, // Top
      { x: 400, y: 595, width: 800, height: 10 }, // Bottom
      { x: 5, y: 300, width: 10, height: 600 }, // Left
      { x: 795, y: 300, width: 10, height: 600 }, // Right
      // Obstacle
      { x: 400, y: 300, width: 50, height: 200 },
    ],
    availableMagnets: 2,
  },
  // Add more levels here...
];
