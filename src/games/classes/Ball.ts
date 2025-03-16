import { Identifiable } from "./base/Identifiable";
import { colorfulPalette } from "../../constants/colorfulPalette";
import { Body, Bodies, Vector } from "matter-js";
import p5 from "p5";

export class Ball extends Identifiable {
  static colors = colorfulPalette;

  body: InstanceType<typeof Body>;

  magnitude = this.p.random(-10, 10);

  color = this.p.random(Ball.colors);

  constructor(
    public x: number,
    public y: number,
    public r: number,
    private p: p5, // Pass an instance of p5
  ) {
    super();
    this.x = x;
    this.y = y;
    this.r = r;
    this.body = Bodies.circle(x, y, r, {
      restitution: 0.8,
      velocity: Vector.create(this.magnitude, this.magnitude),
    });
  }

  show() {
    const { x, y } = this.body.position;
    this.p.fill(this.color); // ⚠️ You must first fill it, and then create it xD
    this.p.ellipse(x, y, this.r * 2);
  }

  isOffCanvas(canvasWidth: number, canvasHeight: number) {
    return (
      this.body.position.x > canvasWidth + this.r ||
      this.body.position.x < -this.r ||
      this.body.position.y > canvasHeight + this.r ||
      this.body.position.x < -this.y
    );
  }
}
