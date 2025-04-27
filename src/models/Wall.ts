import p5 from 'p5';
import Matter, { IBodyDefinition } from 'matter-js';
import { SANDBOX_CONFIG, OBJECT_TYPES } from '@/config/gameConfig';
import { Identifiable } from './base/Identifiable';
import { MovementPattern } from '@/features/games/types';

interface WallConstructorProps {
  x: number;
  y: number;
  dimensions: { width: number; height: number };
  // Optional configuration overrides
  matterOptions?: Matter.IBodyDefinition;
  isHazard?: boolean; // Added for spikes
  movementPattern?: MovementPattern;
}

const defaultMatterOptions: IBodyDefinition = {
  label: OBJECT_TYPES.WALL,
  density: SANDBOX_CONFIG.WALL.DENSITY,
  isStatic: SANDBOX_CONFIG.WALL.IS_STATIC,
  restitution: SANDBOX_CONFIG.WALL.RESTITUTION,
  friction: SANDBOX_CONFIG.WALL.FRICTION,
};

export class Wall extends Identifiable {
  // Public properties
  public readonly body: Matter.Body; // The physics body
  dimensions: { width: number; height: number };
  public isHazard: boolean; // Added
  public movementPattern: MovementPattern | undefined; // Movement pattern for the wall

  constructor({
    x,
    y,
    dimensions,
    matterOptions = defaultMatterOptions,
    isHazard = false, // Default to false
    movementPattern,
  }: WallConstructorProps) {
    super();
    this.isHazard = isHazard;

    // Create the Matter.js body
    this.body = Matter.Bodies.rectangle(
      x,
      y,
      dimensions.width,
      dimensions.height,
      {
        ...matterOptions,
        isStatic: true,
        label: isHazard ? OBJECT_TYPES.HAZARD : OBJECT_TYPES.WALL,
        isSensor: isHazard, // Hazards should be sensors to detect collision without physical reaction
      }
    );
    this.dimensions = dimensions;
    this.movementPattern = movementPattern; // Assign the movement pattern

    if (this.isHazard) {
      console.log('☢️ Created this Hazard: ', this);
    }

    console.log('🧱 Created this Wall: ', this);
  }

  render(p: p5): void {
    const pos = this.body.position;
    const width = this.dimensions.width;
    const height = this.dimensions.height;

    p.push();
    p.translate(pos.x, pos.y);
    p.rotate(this.body.angle);
    p.fill(this.isHazard ? 'red' : 'gray'); // Red for hazards, dark grey otherwise
    // p.noStroke();
    p.rectMode(p.CENTER);
    p.rect(0, 0, width, height);
    p.pop();
  }

  /**
   * Provides direct access to the underlying Matter.js body.
   * Useful for adding/removing from the world or direct physics manipulation.
   */
  getMatterBody(): Matter.Body {
    return this.body;
  }
}
