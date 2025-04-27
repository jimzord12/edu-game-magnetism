import { GAME_CONFIG } from '@/config/gameConfig';
import { Magnet, MagnetConstructorProps } from './Magnet';
import p5 from 'p5';

export interface ElectroMagnetConstructorProps extends MagnetConstructorProps {
  id?: number; // Unique ID for the magnet
  isActive?: boolean;
  strengthRange?: {
    min: number;
    max: number;
  };
  readonly restrictedMovement?: 'horizontal' | 'vertical' | 'none'; // Restrict movement to horizontal or vertical
  isRemovable?: boolean; // Whether the magnet can be removed by the player
}

export class ElectroMagnet extends Magnet {
  public isActive: boolean;
  public strengthRange: {
    min: number;
    max: number;
  };

  constructor({
    id,
    x,
    y,
    isAttracting,
    matterOptions = {},
    renderConfig = {},
    isActive = true,
    strengthRange = {
      min: GAME_CONFIG.ELECTROMAGNETS.MIN_STRENGTH,
      max: GAME_CONFIG.ELECTROMAGNETS.MAX_STRENGTH,
    },
    strength,
    restrictedMovement = 'none',
    isRemovable = true,
  }: ElectroMagnetConstructorProps) {
    super({
      id,
      x,
      y,
      isAttracting,
      matterOptions,
      renderConfig,
      strength,
      restrictedMovement,
      isRemovable,
    });

    this.isActive = isActive;
    this.strengthRange = strengthRange;

    console.log('🐦‍🔥 Created this ElectroMagnet: ', this);
  }

  public toggleMagnetism(): void {
    this.isActive = !this.isActive;
  }

  public togglePolarity(): void {
    this.isAttracting = !this.isAttracting;
  }

  public updateStrength(strength: number): void {
    if (
      strength < this.strengthRange.min ||
      strength > this.strengthRange.max
    ) {
      console.log(`[Warning]: Strength out of range: ${strength}`);
      return;
    }
    this.strength = strength;
  }

  /**
   * Returns a multiplier for force calculation: 0 if inactive, 1 if active.
   * Use this in physics calculations to instantly enable/disable the magnet's effect.
   */
  public getForceMultiplier(): number {
    return this.isActive ? 1 : 0;
  }

  /**
   * Renders the magnet and its field using the provided p5 instance.
   * @param p The p5 rendering context.
   */
  public render(p: p5): void {
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
      if (this.isActive === true) {
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
    }

    // Draw Central Magnet Body (on top of fields)
    p.strokeWeight(1);
    p.stroke(0); // Black outline
    p.fill(this.isAttracting ? [200, 0, 0] : [0, 0, 200]); // Solid color
    p.ellipse(0, 0, this.magnetRadius * 2, this.magnetRadius * 2); // Use configured radius

    p.pop(); // Restore previous drawing state
  }
}
