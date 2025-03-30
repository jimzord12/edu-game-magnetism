import Matter from 'matter-js';
import { GAME_CONFIG, OBJECT_TYPES } from '../config/gameConfig';

export interface WallOptions {
  x: number;
  y: number;
  width: number;
  height: number;
  angle?: number;
  options?: Matter.IBodyDefinition;
}

export class Wall {
  body: Matter.Body;

  constructor({ x, y, width, height, angle = 0, options = {} }: WallOptions) {
    this.body = Matter.Bodies.rectangle(x, y, width, height, {
      isStatic: true,
      friction: GAME_CONFIG.WALL_FRICTION,
      restitution: GAME_CONFIG.WALL_RESTITUTION,
      angle: angle,
      label: OBJECT_TYPES.WALL,
      ...options,
    });
  }
}
