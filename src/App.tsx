import React, { useEffect, useRef } from 'react';
import p5 from 'p5';
import { Bodies, Engine, Mouse, MouseConstraint, World } from 'matter-js';
import type { Body } from 'matter-js';
import Matter from 'matter-js';

const App: React.FC = () => {
  const canvasRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (canvasRef.current === null) return;
    // p5's Global Scope

    const sketch = (p: p5) => {
      let boxA: InstanceType<typeof Body>,
        boxB: InstanceType<typeof Body>,
        ground: InstanceType<typeof Body>;

      let engine: Engine;
      let world: World;
      let mouse: Mouse;
      let mouseConstraint: MouseConstraint;

      p.setup = () => {
        p.createCanvas(800, 400);

        engine = Matter.Engine.create();
        world = engine.world;

        mouse = Mouse.create(canvasRef.current!);
        mouseConstraint = MouseConstraint.create(engine, {
          mouse: mouse,
        });

        boxA = Bodies.rectangle(200, 200, 50, 50);
        boxB = Bodies.rectangle(300, 50, 80, 80);
        ground = Bodies.rectangle(400, 380, 810, 20, { isStatic: true });

        World.add(world, [boxA, boxB, ground, mouseConstraint]);
      };

      p.draw = () => {
        Engine.update(engine);
        p.background(220);

        p.rectMode(p.CENTER);
        p.fill(127);
        p.rect(boxA.position.x, boxA.position.y, 50, 50);
        p.rect(boxB.position.x, boxB.position.y, 80, 80);

        p.fill(0);
        p.rect(ground.position.x, ground.position.y, 810, 20);
      };
    };

    const p5Instance = new p5(sketch, canvasRef.current!);
    return () => p5Instance.remove();
  }, [canvasRef.current]);

  return <div ref={canvasRef} />;
};

export default App;
