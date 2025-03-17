import { useEffect, useRef } from "react";
import p5 from "p5";
import { Engine, Mouse, MouseConstraint, World } from "matter-js";
import Matter from "matter-js";
import { Rect } from "../classes/Rect";
import { Boundary } from "../classes/Boundary";

type Props = {
  canvasW: number;
  canvasH: number;
};

const MagnetsGame = ({ canvasW, canvasH }: Props) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) return;
    // p5's Global Scope

    const sketch = (p: p5) => {
      let boxA: InstanceType<typeof Rect>;
      let boxB: InstanceType<typeof Rect>;
      let boxC: InstanceType<typeof Rect>;
      let ground: InstanceType<typeof Rect>;

      let engine: Engine;
      let world: World;
      let mouse: Mouse;
      let mouseConstraint: MouseConstraint;

      let boundaryLeft: InstanceType<typeof Boundary>;
      let boundaryRight: InstanceType<typeof Boundary>;

      p.setup = () => {
        p.createCanvas(canvasW, canvasH);

        engine = Matter.Engine.create();
        world = engine.world;

        mouse = Mouse.create(canvasRef.current!);
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
        });

        boxA = new Rect(p.width / 2, 0, 100, 100, p);
        boxB = new Rect(p.width / 2, 100, 100, 100, p);
        boxC = new Rect(p.width / 2, 200, 100, 100, p);
        ground = new Rect(p.width / 2, p.height - 10, 810, 20, p, true);

        boundaryLeft = new Boundary(10, 0, 20, p.height * 2, p, world);
        boundaryRight = new Boundary(
          p.width - 10,
          0,
          20,
          p.height * 2,
          p,
          world,
        );

        // Boundary.addHorizaontalBoundaries(world, p);

        World.add(world, [
          boxA.body,
          boxB.body,
          boxC.body,
          ground.body,
          mouseConstraint,
        ]);
      };

      p.draw = () => {
        Engine.update(engine);
        p.background(220);

        p.textSize(32);
        p.text("Magnets are Awesome 🧲!", 50, 100);

        boxA.show();
        boxB.show();
        boxC.show();

        boundaryLeft.show();
        boundaryRight.show();

        p.fill(0);
        p.rectMode(p.CENTER);
        p.rect(ground.body.position.x, ground.body.position.y, 810, 20);
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current!);
    return () => p5Instance.remove();
  }, [canvasRef.current]);

  return <div ref={canvasRef} />;
};

export default MagnetsGame;
