import Matter from 'matter-js';
import { GAME_CONFIG, OBJECT_TYPES } from '../config/gameConfig';

export interface BallOptions {
  x: number;
  y: number;
  radius?: number;
  options?: Matter.IBodyDefinition;
}

export class Ball {
  body: Matter.Body;
  radius: number;

  constructor({
    x,
    y,
    radius = GAME_CONFIG.BALL_RADIUS,
    options = {},
  }: BallOptions) {
    this.radius = radius;
    this.body = Matter.Bodies.circle(x, y, this.radius, {
      label: OBJECT_TYPES.BALL,
      density: GAME_CONFIG.BALL_DENSITY,
      frictionAir: GAME_CONFIG.BALL_FRICTION_AIR,
      restitution: 0.8,
      ...options, // Allow overriding defaults
    });
  }

  // Add methods here if needed later, e.g., applySkin(), updateState()
}
