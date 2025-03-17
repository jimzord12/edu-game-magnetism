import { Identifiable } from "./base/Identifiable";
import { colorfulPalette } from "../../constants/colorfulPalette";
import { Body, Bodies, Vector } from "matter-js";
import p5 from "p5";

export class Rect extends Identifiable {
  static colors = colorfulPalette;

  body: InstanceType<typeof Body>;

  magnitude = this.p.random(-10, 10);

  color = this.p.random(Rect.colors);

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    private p: p5, // Pass an instance of p5
    public isStatic: boolean = false,
  ) {
    super();
    this.body = Bodies.rectangle(x, y, w, h, {
      isStatic,
      restitution: 0.1,
      velocity: Vector.create(this.magnitude, this.magnitude),
    });
  }

  show() {
    const { x, y } = this.body.position;
    this.p.fill(this.color);
    this.p.rectMode(this.p.CENTER);
    this.p.stroke(0, 0, 0);

    this.p.push();
    this.p.translate(x, y); // Move to rectangle position
    this.p.rotate(this.body.angle);

    this.p.rect(0, 0, this.w, this.h); // Draw rect at origin (0,0) after transformation

    this.p.pop();
  }

  isOffCanvas(canvasWidth: number, canvasHeight: number) {
    return (
      this.body.position.x > canvasWidth + this.x ||
      this.body.position.x < -this.x ||
      this.body.position.y > canvasHeight + this.y ||
      this.body.position.x < -this.y
    );
  }
}
