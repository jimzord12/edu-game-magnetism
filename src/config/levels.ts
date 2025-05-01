import { MAZE_1200x800 } from '@/features/levels/maze';
import { ILevelElectroMagnet, ILevelMagnet } from '@/features/levels/types';
import { ElectroMagnet } from '@/models/ElectroMagnet';
import { Wall } from '@/models/Wall';

const thinWallDimensions = { width: 10, height: 50 };
const thinLongWallDimensions = { width: 10, height: 300 };

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
    magnets: [],
    availableMagnets: 3,
    progress: {
      completed: false,
      bestTime: undefined,
    },
    minMagnetsToStart: 1,
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
    magnets: [],
    availableMagnets: 2,
    progress: {
      completed: false,
      bestTime: undefined,
    },
    minMagnetsToStart: 1,
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
    magnets: [],
    availableMagnets: 1,
    progress: {
      completed: false,
      bestTime: undefined,
    },
    minMagnetsToStart: 1,
  },

  // Add more levels here...
];

const ELECTRO_MAGNET_LEVELS: ILevelElectroMagnet[] = [
  {
    id: 200,
    gameType: 'electromagnet',
    name: 'The Basics',
    canvasSize: { width: 1200, height: 800 },
    ballStart: { x: 100, y: 400 },
    targetPosition: { x: 1100, y: 400 },
    walls: [
      new Wall({
        x: 800,
        y: 400,
        dimensions: thinLongWallDimensions,

        // movementPattern: {
        //   type: 'oscillate',
        //   axis: 'vertical',
        //   amplitude: 6,
        //   speed: 2.5,
        //   startDelay: 1,
        //   loop: true,
        // },
      }),
      new Wall({
        x: 1050,
        y: 250,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: Math.PI / 4, // Rotate the wall by 45 degrees
        },
      }),
      new Wall({
        x: 1050,
        y: 525,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: -Math.PI / 4, // Rotate the wall by 45 degrees
        },
      }),
      new Wall({
        x: 500,
        y: 550,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: Math.PI / 2, // Rotate the wall by 90 degrees
        },
      }),
      new Wall({
        x: 500,
        y: 250,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: Math.PI / 2, // Rotate the wall by 45 degrees
        },
        // isHazard: true,
      }),
    ],
    availableMagnets: 2, // Number of magnets the player can place
    minMagnetsToStart: 1, // Minimum magnets to start the level
    electromagnets: [
      new ElectroMagnet({
        x: 325,
        y: 400,
        isAttracting: true,
        isRemovable: false,
        restrictedMovement: 'none',
        matterOptions: {
          isSensor: true,
        },
      }),
    ],
    progress: {
      completed: false,
      bestTime: undefined,
    },
    magnetsOnlySensors: true, // Magnets are only sensors, no physical bodies
  },
  {
    id: 201,
    gameType: 'electromagnet',
    name: 'The Survivor',
    canvasSize: { width: 1200, height: 800 },
    ballStart: { x: 100, y: 400 },
    targetPosition: { x: 1100, y: 400 },
    walls: [
      new Wall({
        x: 1050,
        y: 200,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: Math.PI / 4, // Rotate the wall by 45 degrees
        },
        isHazard: false,
        movementPattern: {
          type: 'oscillate',
          axis: 'vertical',
          amplitude: 200,
          speed: 2,
          startDelay: 0.25,
          loop: true,
        },
      }),
      new Wall({
        x: 1050,
        y: 625,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: -Math.PI / 4, // Rotate the wall by 45 degrees
        },
        isHazard: false,
        movementPattern: {
          type: 'oscillate',
          axis: 'vertical',
          amplitude: 200,
          speed: 2,
          startDelay: 1,
          loop: true,
        },
      }),
      new Wall({
        x: 800,
        y: 350,
        dimensions: thinLongWallDimensions,
        isHazard: true,
        movementPattern: {
          type: 'oscillate',
          axis: 'vertical',
          amplitude: 350,
          speed: 3,
          startDelay: 0.35,
          loop: true,
        },
      }),

      new Wall({
        x: 500,
        y: 625,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: Math.PI / 4, // Rotate the wall by 90 degrees
        },
        isHazard: true,
        movementPattern: {
          type: 'oscillate',
          axis: 'vertical',
          amplitude: 200,
          speed: 2.5,
          startDelay: 0.6,
          loop: true,
        },
      }),
      new Wall({
        x: 500,
        y: 250,
        dimensions: thinLongWallDimensions,
        matterOptions: {
          angle: -Math.PI / 4, // Rotate the wall by 45 degrees
        },
        isHazard: true,
        movementPattern: {
          type: 'oscillate',
          axis: 'vertical',
          amplitude: 250,
          speed: 2,
          startDelay: 0.45,
          loop: true,
        },
      }),
    ],
    availableMagnets: 2, // Number of magnets the player can place
    minMagnetsToStart: 1, // Minimum magnets to start the level
    electromagnets: [
      new ElectroMagnet({
        x: 325,
        y: 400,
        isAttracting: true,
        isRemovable: false,
        restrictedMovement: 'none',
        matterOptions: {
          isSensor: false,
        },
      }),
    ],
    progress: {
      completed: false,
      bestTime: undefined,
    },
    magnetsOnlySensors: true, // Magnets are only sensors, no physical bodies
  },
  {
    id: 202,
    gameType: 'electromagnet',
    name: 'The Maze',
    canvasSize: { width: 1200, height: 800 },
    ballStart: { x: 35, y: 35 },
    targetPosition: { x: -700, y: -300 },
    walls: MAZE_1200x800,
    availableMagnets: 2,
    minMagnetsToStart: 1,
    electromagnets: [],
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
