import p5 from 'p5';
import Matter from 'matter-js';
import { useEffect, useRef, useCallback, useState } from 'react';
import { SANDBOX_CONFIG, OBJECT_TYPES } from '../../../config/gameConfig';

// Define custom data structure for magnet bodies
interface MagnetBodyData {
  isMagnet: true;
  isAttracting: boolean;
}

// Extend Matter.Body type definition locally if needed (optional but good practice)
declare module 'matter-js' {
  interface Body {
    customData?: MagnetBodyData; // Add our custom property
  }
}

interface UseSandboxEngineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useSandboxEngine = ({ containerRef }: UseSandboxEngineProps) => {
  const p5InstanceRef = useRef<p5 | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  // No runner needed if using p.draw for updates
  // const runnerRef = useRef<Matter.Runner | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const dynamicBodiesRef = useRef<Matter.Body[]>([]); // To track ball and magnets

  const [canvasSize] = useState({ width: 800, height: 600 }); // Fixed size for sandbox

  // --- Core Functions Exposed by Hook ---

  const addMagnet = useCallback(
    (x: number, y: number, isAttracting: boolean) => {
      if (!engineRef.current) {
        console.error('Engine not initialized. Cannot add magnet.');
        return;
      }

      const label = isAttracting
        ? OBJECT_TYPES.MAGNET_ATTRACT
        : OBJECT_TYPES.MAGNET_REPEL;
      const magnetBody = Matter.Bodies.circle(
        x,
        y,
        SANDBOX_CONFIG.MAGNET_RADIUS,
        {
          label: label,
          density: SANDBOX_CONFIG.MAGNET_DENSITY,
          frictionAir: 0.02,
          restitution: 0.5,
        }
      );

      // Store custom data directly on the body
      magnetBody.customData = {
        isMagnet: true,
        isAttracting: isAttracting,
      };

      Matter.World.add(engineRef.current.world, magnetBody);
      dynamicBodiesRef.current.push(magnetBody); // Add to our tracked list
      console.log('Added magnet:', magnetBody.id, 'Attracting:', isAttracting);
    },
    []
  ); // Depends only on engineRef existence

  const clearAllDynamic = useCallback(() => {
    if (!engineRef.current) return;

    // Remove only the dynamic bodies (ball and magnets) we tracked
    Matter.World.remove(engineRef.current.world, dynamicBodiesRef.current);

    // Clear the tracking array
    dynamicBodiesRef.current = [];

    // Re-add the ball if desired, or require user to add it too
    const ball = createBall(canvasSize.width / 4, canvasSize.height / 2);
    Matter.World.add(engineRef.current.world, ball);
    ballRef.current = ball;
    dynamicBodiesRef.current.push(ball);

    console.log('Cleared dynamic bodies and reset ball.');
  }, [canvasSize.width, canvasSize.height]); // Depends on canvas size for ball reset

  // Helper to create the initial ball
  const createBall = (x: number, y: number): Matter.Body => {
    return Matter.Bodies.circle(x, y, SANDBOX_CONFIG.BALL_RADIUS, {
      label: OBJECT_TYPES.BALL,
      density: SANDBOX_CONFIG.BALL_DENSITY,
      frictionAir: 0.01,
      restitution: 0.8,
    });
  };

  // --- Cleanup ---
  const cleanup = useCallback(() => {
    console.log('Cleaning up sandbox engine...');
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
    if (engineRef.current) {
      // Stop runner if it were used
      // if (runnerRef.current) Matter.Runner.stop(runnerRef.current);
      if (mouseConstraintRef.current) {
        Matter.World.remove(
          engineRef.current.world,
          mouseConstraintRef.current
        );
        mouseConstraintRef.current = null;
      }
      Matter.World.clear(engineRef.current.world, false);
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    ballRef.current = null;
    dynamicBodiesRef.current = [];
  }, []);

  // --- Initialization Effect ---
  useEffect(() => {
    if (!containerRef.current || p5InstanceRef.current) {
      return; // Only run once or if container changes
    }

    const engine = Matter.Engine.create();
    engine.gravity = SANDBOX_CONFIG.GRAVITY;
    engineRef.current = engine;
    dynamicBodiesRef.current = []; // Reset tracking array

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(canvasSize.width, canvasSize.height);
        p.frameRate(60);
        console.log('Sandbox p5 Setup complete');

        // --- Create Boundaries ---
        const wallOptions: Matter.IBodyDefinition = {
          isStatic: true,
          restitution: 0.8,
          friction: 0.1,
        };
        Matter.World.add(engine.world, [
          Matter.Bodies.rectangle(
            canvasSize.width / 2,
            -10,
            canvasSize.width,
            20,
            wallOptions
          ), // Top
          Matter.Bodies.rectangle(
            canvasSize.width / 2,
            canvasSize.height + 10,
            canvasSize.width,
            20,
            wallOptions
          ), // Bottom
          Matter.Bodies.rectangle(
            -10,
            canvasSize.height / 2,
            20,
            canvasSize.height,
            wallOptions
          ), // Left
          Matter.Bodies.rectangle(
            canvasSize.width + 10,
            canvasSize.height / 2,
            20,
            canvasSize.height,
            wallOptions
          ), // Right
        ]);

        // --- Create Initial Ball ---
        const ball = createBall(canvasSize.width / 4, canvasSize.height / 2);
        Matter.World.add(engine.world, ball);
        ballRef.current = ball;
        dynamicBodiesRef.current.push(ball);

        // --- Mouse Control ---
        const p5Canvas = (p as typeof p & { canvas: HTMLCanvasElement }).canvas;
        const mouse = Matter.Mouse.create(p5Canvas);
        mouse.pixelRatio = p.pixelDensity(); // Important for high-density displays

        const mouseConstraint = Matter.MouseConstraint.create(engine, {
          mouse: mouse,
          constraint: {
            stiffness: 0.2, // Adjust for desired drag feel
            render: {
              visible: false, // Don't draw the default constraint line
            },
          },
        });
        Matter.World.add(engine.world, mouseConstraint);
        mouseConstraintRef.current = mouseConstraint;

        // --- Physics Update (Before Update Event) ---
        Matter.Events.on(engine, 'beforeUpdate', () => {
          const worldBall = ballRef.current;
          if (!worldBall) return;

          const magnets = dynamicBodiesRef.current.filter(
            (body) => body.customData?.isMagnet
          );
          if (magnets.length === 0) return; // No magnets, no forces

          const ballPos = worldBall.position;
          let totalForceOnBall = { x: 0, y: 0 };

          magnets.forEach((magnet) => {
            // Ensure it's a magnet (redundant check, but safe)
            if (!magnet.customData?.isMagnet) return;

            const magnetPos = magnet.position;
            const direction = Matter.Vector.sub(magnetPos, ballPos);
            const distanceSq = Matter.Vector.magnitudeSquared(direction);

            const maxDistSq = SANDBOX_CONFIG.MAGNET_MAX_DISTANCE ** 2;
            const minDistSq = SANDBOX_CONFIG.MAGNET_MIN_DISTANCE ** 2;

            if (
              distanceSq === 0 ||
              distanceSq > maxDistSq ||
              distanceSq < minDistSq
            ) {
              return;
            }

            const distance = Math.sqrt(distanceSq);
            const normalizedDirection = Matter.Vector.normalise(direction);

            // Use sandbox strength and falloff
            const strengthFactor = Math.max(
              0,
              (SANDBOX_CONFIG.MAGNET_MAX_DISTANCE - distance) /
                SANDBOX_CONFIG.MAGNET_MAX_DISTANCE
            );
            let forceMagnitude =
              SANDBOX_CONFIG.MAGNET_STRENGTH * strengthFactor * strengthFactor;

            if (!magnet.customData.isAttracting) {
              forceMagnitude *= -1; // Repel
            }

            const force = Matter.Vector.mult(
              normalizedDirection,
              forceMagnitude
            );
            totalForceOnBall = Matter.Vector.add(totalForceOnBall, force);

            // --- Optional: Apply opposite force to magnet ---
            // For realistic interaction, magnets should push/pull each other and the ball
            // const forceOnMagnet = Matter.Vector.neg(force); // Opposite direction
            // Matter.Body.applyForce(magnet, magnetPos, forceOnMagnet);
          }); // End magnets.forEach

          // Apply the total calculated force to the ball
          if (
            worldBall &&
            (totalForceOnBall.x !== 0 || totalForceOnBall.y !== 0)
          ) {
            Matter.Body.applyForce(worldBall, ballPos, totalForceOnBall);
          }
        }); // End beforeUpdate event
      }; // End p.setup

      p.draw = () => {
        p.background(230, 235, 240); // Light background

        // --- Update Engine ---
        if (engineRef.current) {
          Matter.Engine.update(engineRef.current, 1000 / 60); // Step the engine
        }

        // --- Rendering ---
        const bodies = Matter.Composite.allBodies(engine.world);

        bodies.forEach((body) => {
          p.push();
          p.translate(body.position.x, body.position.y);
          p.rotate(body.angle);

          if (body.isStatic) {
            p.fill(100); // Dark grey for static walls
            p.noStroke();
            p.beginShape();
            body.vertices.forEach((vert) =>
              p.vertex(vert.x - body.position.x, vert.y - body.position.y)
            );
            p.endShape(p.CLOSE);
          } else if (body.label === OBJECT_TYPES.BALL) {
            p.fill(50, 50, 200); // Blue ball
            p.noStroke();
            p.ellipse(0, 0, SANDBOX_CONFIG.BALL_RADIUS * 2);
          } else if (body.customData?.isMagnet) {
            // Use the enhanced magnet drawing logic
            const isAttracting = body.customData.isAttracting;
            const baseColor = isAttracting ? [255, 0, 0] : [0, 0, 255];
            const maxDist = SANDBOX_CONFIG.MAGNET_MAX_DISTANCE;
            const layerRadii = [maxDist, maxDist * 0.66, maxDist * 0.33];
            const layerStrokeWeights = [1, 2, 3];
            const baseStrokeAlpha = [50, 75, 100];
            const baseFillAlpha = [0, 30, 60];

            // Draw fields first
            for (let i = 0; i < layerRadii.length; i++) {
              const radius = layerRadii[i];
              const weight = layerStrokeWeights[i];
              const strokeAlpha = baseStrokeAlpha[i];
              const fillAlpha = baseFillAlpha[i];
              p.strokeWeight(weight);
              p.stroke(baseColor[0], baseColor[1], baseColor[2], strokeAlpha);
              if (fillAlpha > 0)
                p.fill(baseColor[0], baseColor[1], baseColor[2], fillAlpha);
              else p.noFill();
              p.ellipse(0, 0, radius * 2);
            }
            // Draw magnet body on top
            p.strokeWeight(1);
            p.stroke(0);
            p.fill(isAttracting ? [200, 0, 0] : [0, 0, 200]);
            p.ellipse(0, 0, SANDBOX_CONFIG.MAGNET_RADIUS * 2);
          }
          // Add drawing for other body types if needed

          p.pop();
        }); // End bodies.forEach
      }; // End p.draw
    }; // End sketch function

    // Create p5 instance
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear previous if any
      p5InstanceRef.current = new p5(sketch, containerRef.current);
    } else {
      console.error('Sandbox container ref is not available.');
    }

    return cleanup; // Return cleanup function
  }, [containerRef, canvasSize, cleanup, dynamicBodiesRef.current.length]); // Dependencies for initialization effect

  //   // Effect for cleanup on unmount
  //   useEffect(() => {
  //     return cleanup;
  //   }, [cleanup]);

  // Return functions to interact with the sandbox
  return { addMagnet, clearAllDynamic };
};
