import { Identifiable } from './Identifiable';

export class Point extends Identifiable {
  constructor(public x: number, public y: number, id?: number) {
    super(id);
  }

  public distanceTo(other: Point): number {
    const dx = other.x - this.x;
    const dy = other.y - this.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  public toString(): string {
    return `(${this.x}, ${this.y})`;
  }
}
