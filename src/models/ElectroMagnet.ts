import { GAME_CONFIG } from '@/config/gameConfig';
import { Magnet, MagnetConstructorProps } from './Magnet';

export interface ElectroMagnetConstructorProps extends MagnetConstructorProps {
  isActive?: boolean;
  strengthRange?: {
    min: number;
    max: number;
  };
}

export class ElectroMagnet extends Magnet {
  public isActive: boolean;
  public strengthRange: {
    min: number;
    max: number;
  };

  constructor({
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
  }: ElectroMagnetConstructorProps) {
    super({
      x,
      y,
      isAttracting,
      matterOptions,
      renderConfig,
      strength,
    });

    this.isActive = isActive;
    this.strengthRange = strengthRange;
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
}
