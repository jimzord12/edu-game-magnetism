import { Bodies, Body, World } from "matter-js";
import p5 from "p5";

export class Boundary {
  body: InstanceType<typeof Body>;

  static addHorizaontalBoundaries(world: World, p: p5) {
    const w = p.width;
    const h = p.height;

    const leftBoundary = new Boundary(0, 0, 50, h, p, world);
    const RightBoundary = new Boundary(w, 0, 50, h, p, world);

    World.add(world, [leftBoundary.body, RightBoundary.body]);

    leftBoundary.show();
    RightBoundary.show();
  }

  constructor(
    public x: number,
    public y: number,
    public w: number,
    public h: number,
    private p: p5,
    private world: Matter.World,
  ) {
    this.body = Bodies.rectangle(x, y, w, h, {
      isStatic: true,
      restitution: 0.8,
      friction: 0.5,
      render: { visible: false }, // Set to true if you want to see walls
    });

    World.add(this.world, this.body);
  }

  show() {
    this.p.fill(150);
    this.p.noStroke();
    this.p.rectMode(this.p.CENTER);
    this.p.rect(this.x, this.y, this.w, this.h);
  }
}
