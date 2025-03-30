import type { Gravity } from 'matter-js';

export const GAME_CONFIG = {
  GRAVITY: { x: 0, y: 0, scale: 0.0001 } satisfies Gravity, // Top-down view, no gravity unless desired
  PHYSICS_TIMESTEP: 1000 / 60, // ~60 FPS
  MAGNET_DEFAULT_STRENGTH: 0.005, // Adjust based on world scale
  MAGNET_MAX_DISTANCE: 300, // Max distance magnet affects ball (pixels)
  MAGNET_MIN_DISTANCE: 20, // Min distance to avoid extreme forces
  BALL_RADIUS: 10,
  TARGET_RADIUS: 15,
  WALL_FRICTION: 0.1,
  WALL_RESTITUTION: 0.5, // Bounciness
  BALL_DENSITY: 0.01,
  BALL_FRICTION_AIR: 0.01, // Damping
};

export const OBJECT_TYPES = {
  BALL: 'ball',
  WALL: 'wall',
  MAGNET: 'magnet', // Not a physics object itself, but a source of force
  MAGNET_ATTRACT: 'magnet_attract',
  MAGNET_REPEL: 'magnet_repel',
  TARGET: 'target',
};

// Add config for dynamic magnets if needed (radius, density etc)
export const SANDBOX_CONFIG = {
  MAGNET_RADIUS: 15,
  MAGNET_DENSITY: 0.05, // Make them reasonably heavy
  BALL_RADIUS: 10,
  BALL_DENSITY: 0.01,
  GRAVITY: { x: 0, y: 0, scale: 0.0001 } satisfies Gravity, // Top-down view,
  MAGNET_STRENGTH: 0.006, // Adjust force strength for sandbox
  MAGNET_MAX_DISTANCE: 250,
  MAGNET_MIN_DISTANCE: 20,
};
