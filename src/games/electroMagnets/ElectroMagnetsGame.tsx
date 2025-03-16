import { useEffect, useRef } from "react";
import p5 from "p5";
import { Bodies, Engine, Mouse, MouseConstraint, World } from "matter-js";
import type { Body } from "matter-js";
import Matter from "matter-js";
import { Ball } from "../classes/Ball";

type Props = {
  canvasW: number;
  canvasH: number;
};

const ElectroMagnetsGame = ({ canvasW, canvasH }: Props) => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) return;
    // p5's Global Scope

    const sketch = (p: p5) => {
      let ballA: InstanceType<typeof Ball>;
      let ballB: InstanceType<typeof Ball>;
      let ballC: InstanceType<typeof Ball>;
      let ground: InstanceType<typeof Body>;

      let engine: Engine;
      let world: World;
      let mouse: Mouse;
      let mouseConstraint: MouseConstraint;

      p.setup = () => {
        p.createCanvas(canvasW, canvasH);

        engine = Matter.Engine.create();
        world = engine.world;

        mouse = Mouse.create(canvasRef.current!);
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
        });

        ballA = new Ball(p.width / 2 - 25, 10, 10, p);
        ballB = new Ball(p.width / 2, 50, 15, p);
        ballC = new Ball(p.width / 2 + 35, 20, 20, p);
        ground = Bodies.rectangle(400, 380, 810, 20, { isStatic: true });

        World.add(world, [
          ballA.body,
          ballB.body,
          ballC.body,
          ground,
          mouseConstraint,
        ]);
      };

      p.draw = () => {
        Engine.update(engine);
        p.background(200);

        p.textSize(32);
        p.text("Electro-Magnets are even Awesomer ⚡+🧲!", 50, 100);

        p.rectMode(p.CENTER);
        p.fill(127);
        ballA.show();
        ballB.show();
        ballC.show();

        p.fill(0);
        p.rect(ground.position.x, ground.position.y, 810, 20);
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current!);
    return () => p5Instance.remove();
  }, [canvasRef.current]);

  return <div ref={canvasRef} />;
};

export default ElectroMagnetsGame;
