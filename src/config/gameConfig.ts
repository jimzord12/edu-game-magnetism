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

const SANDBOX_MAGNET_DIMENSIONS = {
  RADIUS: 10,
};

// Add config for dynamic magnets if needed (radius, density etc)
export const SANDBOX_CONFIG = {
  MAGNETS: {
    RADIUS: SANDBOX_MAGNET_DIMENSIONS.RADIUS,
    IS_STATIC: true, // Must be false to be movable
    FRICTION_AIR: 0.5, // Higher damping makes it feel heavier
    FRICTION: 0.8, // Surface friction (reduced from Infinity)
    RESTITUTION: 0.2, // Lower bounciness
    MASS: 10, // Increased mass makes it feel heavier
    STRENGTH: 0.001,
    DENSITY: 10, // Increased density
    INERTIA: Infinity, // Prevents rotation
    MAX_DISTANCE: 250,
    MIN_DISTANCE: SANDBOX_MAGNET_DIMENSIONS.RADIUS * 2,
    COLLISION_CATEGORY: 0x0002,
    COLLISION_MASK: 0xffffffff,
  },
  BALL: {
    RADIUS: 10,
    DENSITY: 0.2,
    IS_STATIC: false, // Make them moveable
    FRICTION_AIR: 0.01, // Damping
    FRICTION: 0.05, // Surface friction
    RESTITUTION: 0.5, // Bounciness
    MASS: 0.5, // Make them moveable
  },
  WALL: {
    IS_STATIC: true, // Static walls
    FRICTION: 2, // Surface friction
    RESTITUTION: 0.5, // Bounciness
    DENSITY: 1, // Make them reasonably heavy
  },
  MOUSE: {
    COLLISION_CATEGORY: 0x0001,
    STIFFNESS: 0.3,
    COLLISION_MASK: 0xffffffff,
  },
  WORLD: {
    GRAVITY: { x: 0, y: 0, scale: 0.0001 } satisfies Gravity, // Top-down view,
  },
};
