import p5 from 'p5';
import Matter from 'matter-js';
import { SANDBOX_CONFIG, OBJECT_TYPES, GAME_CONFIG } from '@/config/gameConfig';
import { MovementPattern } from '@/features/games/types';
import { Point } from './base/Point';

export type MovementRestriction = 'horizontal' | 'vertical' | 'none';

export interface MagnetConstructorProps {
  id?: number; // Unique ID for the magnet
  x: number;
  y: number;
  isAttracting: boolean;
  // Optional configuration overrides
  matterOptions?: Matter.IBodyDefinition;
  renderConfig?: {
    radius?: number;
    maxDist?: number;
  };

  strength?: number;
  readonly restrictedMovement?: MovementRestriction; // Restrict movement to horizontal or vertical
  isRemovable?: boolean; // Whether the magnet can be removed by the player
  movementPattern?: MovementPattern;
}

export class Magnet extends Point {
  // Public properties
  public isAttracting: boolean;
  public readonly body: Matter.Body & {
    restrictedMovement: MovementRestriction;
  };
  public strength: number; // [min, max]
  public isRemovable: boolean;
  public movementPattern: MovementPattern | undefined; // Movement pattern for the magnet

  // Private properties for configuration
  protected readonly magnetRadius: number;
  protected readonly fieldMaxDist: number;

  constructor({
    id,
    x,
    y,
    isAttracting,
    matterOptions = {},
    renderConfig = {},
    movementPattern,
    strength = GAME_CONFIG.MAGNETS.DEFAULT_STRENGTH,
    restrictedMovement = 'none',
    isRemovable = true,
  }: MagnetConstructorProps) {
    super(x, y, id);
    this.isAttracting = isAttracting;
    this.strength = strength;
    this.isRemovable = isRemovable;
    this.movementPattern = movementPattern; // Assign the movement pattern

    // Determine configuration, using defaults from SANDBOX_CONFIG if not provided
    this.magnetRadius = renderConfig.radius ?? SANDBOX_CONFIG.MAGNETS.RADIUS;
    this.fieldMaxDist =
      renderConfig.maxDist ?? SANDBOX_CONFIG.MAGNETS.MAX_DISTANCE;

    const label = isAttracting
      ? OBJECT_TYPES.MAGNET_ATTRACT
      : OBJECT_TYPES.MAGNET_REPEL;

    const _body = Matter.Bodies.circle(x, y, this.magnetRadius, {
      label: label,
      density: SANDBOX_CONFIG.MAGNETS.DENSITY,
      friction: SANDBOX_CONFIG.MAGNETS.FRICTION,
      frictionAir: SANDBOX_CONFIG.MAGNETS.FRICTION_AIR,
      restitution: SANDBOX_CONFIG.MAGNETS.RESTITUTION,
      isStatic: SANDBOX_CONFIG.MAGNETS.IS_STATIC,
      mass: SANDBOX_CONFIG.MAGNETS.MASS,
      inertia: SANDBOX_CONFIG.MAGNETS.INERTIA,
      collisionFilter: {
        category: SANDBOX_CONFIG.MAGNETS.COLLISION_CATEGORY, // Category for collision filtering
        mask: SANDBOX_CONFIG.MAGNETS.COLLISION_MASK, // Mask for collision filtering
      },
      ...matterOptions, // Allow overriding defaults
    });

    // Create the Matter.js body
    this.body = Object.assign(_body, { restrictedMovement });
    console.log('🐦‍🔥 Created this Magnet: ', this);

    // Optionally, still add customData if direct body iteration is needed elsewhere
    // this.body.customData = { isMagnet: true, isAttracting: this.isAttracting };
  }

  /**
   * Renders the magnet and its field using the provided p5 instance.
   * @param p The p5 rendering context.
   */
  render(p: p5): void {
    const pos = this.body.position;
    const angle = this.body.angle;

    p.push(); // Isolate styles and transformations
    p.translate(pos.x, pos.y);
    p.rotate(angle);

    const baseColor = this.isAttracting ? [255, 0, 0] : [0, 0, 255]; // Red or Blue
    const layerRadii = [
      this.fieldMaxDist,
      this.fieldMaxDist * 0.66,
      this.fieldMaxDist * 0.33,
    ];
    const layerStrokeWeights = [1, 2, 3];
    const baseStrokeAlpha = [50, 75, 100];
    const baseFillAlpha = [0, 30, 60];

    // Draw Field Layers (Outer to Inner)
    for (let i = 0; i < layerRadii.length; i++) {
      const radius = layerRadii[i];
      const weight = layerStrokeWeights[i];
      const strokeAlpha = baseStrokeAlpha[i];
      const fillAlpha = baseFillAlpha[i];

      p.strokeWeight(weight);
      p.stroke(baseColor[0], baseColor[1], baseColor[2], strokeAlpha);
      if (fillAlpha > 0) {
        p.fill(baseColor[0], baseColor[1], baseColor[2], fillAlpha);
      } else {
        p.noFill();
      }
      p.ellipse(0, 0, radius * 2, radius * 2); // Draw layer
    }

    // Draw Central Magnet Body (on top of fields)
    p.strokeWeight(1);
    p.stroke(0); // Black outline
    p.fill(this.isAttracting ? [200, 0, 0] : [0, 0, 200]); // Solid color
    p.ellipse(0, 0, this.magnetRadius * 2, this.magnetRadius * 2); // Use configured radius

    p.pop(); // Restore previous drawing state
  }

  /**
   * Toggles the polarity of the magnet (Attracting <-> Repelling).
   * Updates the internal state and the associated Matter.js body's label.
   */
  togglePolarity(): void {
    this.isAttracting = !this.isAttracting;
    // Update the body's label to reflect the new state if needed
    this.body.label = this.isAttracting
      ? OBJECT_TYPES.MAGNET_ATTRACT
      : OBJECT_TYPES.MAGNET_REPEL;
    // Update customData if it exists/is used
    // if (this.body.customData) this.body.customData.isAttracting = this.isAttracting;
    console.log(
      `Magnet ${this.body.id} polarity toggled to: ${
        this.isAttracting ? 'Attract' : 'Repel'
      }`
    );
  }

  /**
   * Provides direct access to the underlying Matter.js body.
   * Useful for adding/removing from the world or direct physics manipulation.
   */
  getMatterBody(): Matter.Body {
    return this.body;
  }
}
