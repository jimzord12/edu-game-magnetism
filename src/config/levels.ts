import { ILevelElectroMagnet, ILevelMagnet } from '@/features/levels/types';
import { Wall } from '@/models/Wall';

const thinWallDimensions = { width: 10, height: 50 };

// Id Convention:
// 100 - 199: Magnet Level
// 200 - 299: Electromagnet Level

const MAGNET_LEVELS: ILevelMagnet[] = [
  {
    id: 100,
    gameType: 'magnet',
    name: 'The Basics',
    canvasSize: { width: 800, height: 600 },
    ballStart: { x: 100, y: 300 },
    targetPosition: { x: 700, y: 300 },
    walls: [
      new Wall({ x: 400, y: 5, dimensions: thinWallDimensions }),
      new Wall({ x: 400, y: 595, dimensions: thinWallDimensions }),
      new Wall({ x: 5, y: 300, dimensions: thinWallDimensions }),
    ],
    availableMagnets: {
      attract: 3,
      repel: 0,
    },
    progress: {
      completed: false,
      bestTime: undefined,
    },
  },
  {
    id: 101,
    gameType: 'magnet',
    name: 'Tricky Walls',
    canvasSize: { width: 800, height: 600 },
    ballStart: { x: 100, y: 300 },
    targetPosition: { x: 700, y: 300 },
    walls: [
      new Wall({ x: 400, y: 5, dimensions: thinWallDimensions }),
      new Wall({ x: 400, y: 595, dimensions: thinWallDimensions }),
      new Wall({ x: 5, y: 300, dimensions: thinWallDimensions }),
    ],
    availableMagnets: {
      attract: 3,
      repel: 0,
    },
    progress: {
      completed: false,
      bestTime: undefined,
    },
  },
  {
    id: 102,
    gameType: 'magnet',
    name: 'Ice Hockey',
    canvasSize: { width: 800, height: 600 },
    ballStart: { x: 100, y: 300 },
    targetPosition: { x: 700, y: 300 },
    walls: [
      new Wall({ x: 400, y: 5, dimensions: thinWallDimensions }),
      new Wall({ x: 400, y: 595, dimensions: thinWallDimensions }),
      new Wall({ x: 5, y: 300, dimensions: thinWallDimensions }),
    ],
    availableMagnets: {
      attract: 3,
      repel: 0,
    },
    progress: {
      completed: false,
      bestTime: undefined,
    },
  },

  // Add more levels here...
];

const ELECTRO_MAGNET_LEVELS: ILevelElectroMagnet[] = [
  {
    id: 200,
    gameType: 'electromagnet',
    name: 'The Basics',
    canvasSize: { width: 800, height: 600 },
    ballStart: { x: 100, y: 300 },
    targetPosition: { x: 700, y: 300 },
    walls: [
      new Wall({ x: 400, y: 5, dimensions: thinWallDimensions }),
      new Wall({ x: 400, y: 595, dimensions: thinWallDimensions }),
      new Wall({ x: 5, y: 300, dimensions: thinWallDimensions }),
    ],
    availableMagnets: 4,
    progress: {
      completed: false,
      bestTime: undefined,
    },
  },
  {
    id: 201,
    gameType: 'electromagnet',
    name: 'The Maze',
    canvasSize: { width: 800, height: 600 },
    ballStart: { x: 100, y: 300 },
    targetPosition: { x: 700, y: 300 },
    walls: [
      new Wall({ x: 400, y: 5, dimensions: thinWallDimensions }),
      new Wall({ x: 400, y: 595, dimensions: thinWallDimensions }),
      new Wall({ x: 5, y: 300, dimensions: thinWallDimensions }),
    ],
    availableMagnets: 2,
    progress: {
      completed: false,
      bestTime: undefined,
    },
  },
  {
    id: 202,
    gameType: 'electromagnet',
    name: 'The Survivor',
    canvasSize: { width: 800, height: 600 },
    ballStart: { x: 100, y: 300 },
    targetPosition: { x: 700, y: 300 },
    walls: [
      new Wall({ x: 400, y: 5, dimensions: thinWallDimensions }),
      new Wall({ x: 400, y: 595, dimensions: thinWallDimensions }),
      new Wall({ x: 5, y: 300, dimensions: thinWallDimensions }),
    ],
    availableMagnets: 2,
    progress: {
      completed: false,
      bestTime: undefined,
    },
  },
  // Add more levels here...
];

export const getMagnetLevels = () => {
  return MAGNET_LEVELS;
};

export const getElectroMagnetLevels = () => {
  return ELECTRO_MAGNET_LEVELS;
};
