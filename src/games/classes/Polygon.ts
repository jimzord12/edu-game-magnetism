import { Identifiable } from "./base/Identifiable";
import { colorfulPalette } from "../../constants/colorfulPalette";
import { Body, Bodies } from "matter-js";
import p5 from "p5";

export class Polygon extends Identifiable {
  static colors = colorfulPalette;

  body: InstanceType<typeof Body>;

  magnitude = this.p.random(-10, 10);

  color = this.p.random(Polygon.colors);

  constructor(
    public x: number,
    public y: number,
    public s: number,
    public r: number,
    private p: p5, // Pass an instance of p5
  ) {
    super();
    this.s = p.max(s, 3);
    this.body = Bodies.polygon(x, y, s, r, {
      restitution: 0.8,
      // velocity: Vector.create(this.magnitude, this.magnitude),
    });
  }

  show() {
    const angle = this.p.TWO_PI / this.s; // 1.256
    this.p.fill(this.color);
    this.p.push();
    this.p.translate(this.body.position.x, this.body.position.y);
    this.p.rotate(this.body.angle * -1);
    this.p.beginShape();
    for (let a = 0; a < this.p.TWO_PI; a += angle) {
      const sx = this.p.cos(a) * this.r;
      const sy = this.p.sin(a) * this.r;
      this.p.vertex(sx, sy);
    }
    this.p.endShape(this.p.CLOSE);
    this.p.pop();
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
