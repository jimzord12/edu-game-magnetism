import p5 from 'p5';
import Matter from 'matter-js';
import { useEffect, useRef, useCallback, useState } from 'react';
import { SANDBOX_CONFIG, OBJECT_TYPES } from '../../../config/gameConfig';
import { Magnet } from '@/models/Magnet';
import { Wall } from '@/models/Wall';
import { calculateTotalForces } from '../utils/physicsUtils';
import { Ball } from '@/models/Ball';
import {
  createBall,
  createMouseOptions,
  createWalls,
  isMagnetClicked,
} from '../helpers';

// Define custom data structure for magnet bodies

interface UseSandboxEngineProps {
  containerRef: React.RefObject<HTMLDivElement | null>;
}

export const useSandboxEngine = ({ containerRef }: UseSandboxEngineProps) => {
  const p5InstanceRef = useRef<p5 | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  // No runner needed if using p.draw for updates
  // const runnerRef = useRef<Matter.Runner | null>(null);
  const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);
  const ballRef = useRef<Ball | null>(null);
  const dynamicEntitiesRef = useRef<(Ball | Magnet)[]>([]); // To track ball and magnets
  const wallsRef = useRef<Wall[]>([]); // To track walls
  const selectedMagnetRef = useRef<Magnet | null>(null); // Track currently selected magnet

  const [canvasSize] = useState({ width: 800, height: 600 }); // Fixed size for sandbox

  const handleMagnetSelection = useCallback(() => {
    if (!mouseConstraintRef.current || !engineRef.current) return;

    // Get mouse position from constraint
    const mousePos = mouseConstraintRef.current.mouse.position;
    if (!mousePos) return;

    // Find which magnet is being clicked
    const selectedMagnet = dynamicEntitiesRef.current.find((entity) => {
      if (!(entity instanceof Magnet)) return false;
      return isMagnetClicked(
        mousePos,
        entity.body.position,
        SANDBOX_CONFIG.MAGNETS.RADIUS
      );
    }) as Magnet | undefined;

    if (selectedMagnet) {
      selectedMagnetRef.current = selectedMagnet;
      Matter.Body.setStatic(selectedMagnet.body, false); // Make dynamic while dragging
    }
  }, [
    mouseConstraintRef.current,
    engineRef.current,
    selectedMagnetRef.current,
  ]);

  const handleMagnetRelease = useCallback(() => {
    if (selectedMagnetRef.current) {
      Matter.Body.setStatic(selectedMagnetRef.current.body, true); // Make static again
      selectedMagnetRef.current = null;
    }
  }, []);

  // --- Core Functions Exposed by Hook ---

  const addMagnet = useCallback(
    (x: number, y: number, isAttracting: boolean) => {
      if (!engineRef.current) {
        console.error('Engine not initialized. Cannot add magnet.');
        return;
      }

      // Creating the Magnet
      const magnet = new Magnet({
        x,
        y,
        isAttracting,
        matterOptions: {
          isStatic: SANDBOX_CONFIG.MAGNETS.IS_STATIC,
          density: SANDBOX_CONFIG.MAGNETS.DENSITY,
          frictionAir: 0.02,
          restitution: 0.5,
        },
      });

      Matter.World.add(engineRef.current.world, magnet.body);
      dynamicEntitiesRef.current.push(magnet); // Add to our tracked list
      console.log(
        '🧲 Added magnet:',
        magnet.body.id,
        'Attracting:',
        isAttracting
      );
    },
    []
  ); // Depends only on engineRef existence

  const clearAllDynamic = useCallback(() => {
    if (!engineRef.current) return;

    const bodies = dynamicEntitiesRef.current.map((entity) => entity.body);

    // Remove only the dynamic bodies (ball and magnets) we tracked
    Matter.World.remove(engineRef.current.world, bodies);

    // Clear the tracking array
    dynamicEntitiesRef.current = [];

    // Re-add the ball if desired, or require user to add it too
    const ball = createBall(canvasSize.width / 4, canvasSize.height / 2);
    Matter.World.add(engineRef.current.world, ball.body);
    ballRef.current = ball;
    dynamicEntitiesRef.current.push(ball);

    console.log('Cleared dynamic bodies and reset ball.');
  }, [canvasSize.width, canvasSize.height]); // Depends on canvas size for ball reset

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
    dynamicEntitiesRef.current = [];
  }, []);

  // --- Initialization Effect ---
  useEffect(() => {
    if (!containerRef.current || p5InstanceRef.current) {
      return; // Only run once or if container changes
    }

    const engine = Matter.Engine.create();
    engine.gravity = SANDBOX_CONFIG.WORLD.GRAVITY;
    engineRef.current = engine;
    dynamicEntitiesRef.current = []; // Reset tracking array

    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(canvasSize.width, canvasSize.height);
        p.frameRate(60);

        // --- Create Walls ---
        const walls = createWalls(canvasSize);

        wallsRef.current = walls;
        const wallBodies = walls.map((wall) => wall.body);

        Matter.World.add(engine.world, wallBodies);

        // --- Create Initial Ball ---
        const ball = createBall(canvasSize.width / 4, canvasSize.height / 2);

        Matter.World.add(engine.world, ball.body);
        ballRef.current = ball;
        dynamicEntitiesRef.current.push(ball);

        // --- Mouse Control ---
        const mouseOptions = createMouseOptions(p);
        const mouseConstraint = Matter.MouseConstraint.create(
          engine,
          mouseOptions
        );
        Matter.World.add(engine.world, mouseConstraint);
        mouseConstraintRef.current = mouseConstraint;

        // --- Physics Update (Before Update Event) ---
        Matter.Events.on(engine, 'beforeUpdate', () => {
          const worldBall = ballRef.current;
          if (!worldBall) return;

          const magnets = dynamicEntitiesRef.current.filter(
            (entity) => entity.body.label !== OBJECT_TYPES.BALL
          ) as Magnet[]; // Filter out the ball from the list;

          if (magnets.length === 0) return;

          // Calculate total force on ball from all magnets
          const totalForceOnBall = calculateTotalForces(worldBall, magnets);

          if (totalForceOnBall.x !== 0 || totalForceOnBall.y !== 0) {
            Matter.Body.applyForce(
              worldBall.body,
              worldBall.body.position,
              totalForceOnBall
            );
          }
        });
        console.log('Sandbox p5 Setup complete');
      }; // End p.setup

      p.draw = () => {
        p.background(230, 235, 240); // Light background

        // --- Update Engine ---
        if (engineRef.current) {
          Matter.Engine.update(engineRef.current, 1000 / 60); // Step the engine
        }

        // --- Rendering ---
        const entities = [...dynamicEntitiesRef.current, ...wallsRef.current];

        entities.forEach((entity) => {
          entity.render(p);
        }); // End bodies.forEach
      }; // End p.draw

      p.mousePressed = () => {
        if (mouseConstraintRef.current) {
          console.log('🐭 Mouse is Pressed!');
          handleMagnetSelection(); // Check for magnet selection
        }
      };

      p.mouseReleased = () => {
        if (mouseConstraintRef.current) {
          handleMagnetRelease(); // Handle magnet release
        }
      };
    }; // End sketch function

    // Create p5 instance
    if (containerRef.current) {
      containerRef.current.innerHTML = ''; // Clear previous if any
      p5InstanceRef.current = new p5(sketch, containerRef.current);
    } else {
      console.error('Sandbox container ref is not available.');
    }

    return cleanup; // Return cleanup function
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    containerRef,
    canvasSize,
    cleanup,
    dynamicEntitiesRef.current.length,
    handleMagnetSelection,
    handleMagnetRelease,
    mouseConstraintRef.current,
  ]); // Dependencies for initialization effect

  // Effect for cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Return functions to interact with the sandbox
  return { addMagnet, clearAllDynamic };
};
