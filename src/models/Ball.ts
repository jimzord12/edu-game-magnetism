import p5 from 'p5';
import Matter from 'matter-js';
import { SANDBOX_CONFIG, OBJECT_TYPES } from '@/config/gameConfig';
import { Point } from './base/Point';

interface BallConstructorProps {
  x: number;
  y: number;
  radius?: number;
  matterOptions?: Matter.IBodyDefinition;
}

export class Ball extends Point {
  public readonly body: Matter.Body;
  private readonly radius: number;

  constructor({
    x,
    y,
    radius = SANDBOX_CONFIG.BALL.RADIUS,
    matterOptions = {},
  }: BallConstructorProps) {
    super(x, y);
    this.radius = radius;
    this.body = Matter.Bodies.circle(x, y, this.radius, {
      label: OBJECT_TYPES.BALL,
      density: SANDBOX_CONFIG.BALL.DENSITY,
      frictionAir: SANDBOX_CONFIG.BALL.FRICTION_AIR,
      restitution: SANDBOX_CONFIG.BALL.RESTITUTION,
      friction: SANDBOX_CONFIG.BALL.FRICTION,
      mass: SANDBOX_CONFIG.BALL.MASS,
      ...matterOptions,
    });

    console.log('🐦‍🔥 Created this Ball: ', this);
  }

  render(
    p: p5,
    {
      r = 50,
      g = 50,
      b = 200,
      a = 1000,
    }: { r?: number; g?: number; b?: number; a?: number } = {}
  ): void {
    const pos = this.body.position;

    p.push();
    p.translate(pos.x, pos.y);
    p.rotate(this.body.angle);
    p.fill(r, g, b, a); // Use provided color parameters with alpha
    p.noStroke();
    p.ellipse(0, 0, this.radius * 2);
    p.pop();
  }

  getMatterBody(): Matter.Body {
    return this.body;
  }
}
