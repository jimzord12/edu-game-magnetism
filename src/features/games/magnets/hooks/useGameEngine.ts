import p5 from 'p5';
import Matter from 'matter-js';
import { useEffect, useRef, useCallback } from 'react';
import { GAME_CONFIG, OBJECT_TYPES } from '../../../../config/gameConfig';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import {
  levelWon,
  //   updateBallPosition,
  updateElapsedTime,
} from '../slices/magnetGameSlice'; // Import actions
import { UseGameEngineProps } from '../../types';
import { GameType } from '@/features/levels/types';

export const useGameEngine = <T extends GameType>({
  levelData,
  magnets,
  gameStatus,
  containerRef,
}: UseGameEngineProps<T>) => {
  const p5InstanceRef = useRef<p5 | null>(null);
  const engineRef = useRef<Matter.Engine | null>(null);
  const runnerRef = useRef<Matter.Runner | null>(null);
  const ballRef = useRef<Matter.Body | null>(null);
  const targetRef = useRef<Matter.Body | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const animationFrameId = useRef<number | null>(null);

  const dispatch = useAppDispatch();

  // Cleanup function
  const cleanup = useCallback(() => {
    console.log('Cleaning up game engine...');
    if (animationFrameId.current) {
      cancelAnimationFrame(animationFrameId.current);
    }
    if (p5InstanceRef.current) {
      p5InstanceRef.current.remove();
      p5InstanceRef.current = null;
    }
    if (runnerRef.current && engineRef.current) {
      Matter.Runner.stop(runnerRef.current);
      Matter.World.clear(engineRef.current.world, false); // false = keepStatic
      Matter.Engine.clear(engineRef.current);
      engineRef.current = null;
      runnerRef.current = null;
    }
    ballRef.current = null;
    targetRef.current = null;
    startTimeRef.current = null;
  }, []);

  // Initialize p5 sketch
  useEffect(() => {
    if (!levelData || !containerRef?.current || p5InstanceRef.current) {
      // Don't initialize if no level data, container isn't ready, or already initialized
      return;
    }

    // --- Matter.js Setup ---
    const engine = Matter.Engine.create();
    engine.gravity = { ...GAME_CONFIG.WORLD.GRAVITY };
    engineRef.current = engine;

    // --- p5.js Sketch Definition ---
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(levelData.canvasSize.width, levelData.canvasSize.height);
        p.frameRate(60);
        console.log('p5 Setup complete for level:', levelData.id);

        const ball = Matter.Bodies.circle(
          levelData.ballStart.x,
          levelData.ballStart.y,
          GAME_CONFIG.BALL.RADIUS,
          {
            label: OBJECT_TYPES.BALL,
            density: GAME_CONFIG.BALL.DENSITY,
            frictionAir: GAME_CONFIG.BALL.FRICTION_AIR,
            restitution: 0.8, // Make ball bouncy
          }
        );
        ballRef.current = ball;

        const target = Matter.Bodies.circle(
          levelData.targetPosition.x,
          levelData.targetPosition.y,
          GAME_CONFIG.TARGET.RADIUS,
          {
            label: OBJECT_TYPES.TARGET,
            isStatic: true,
            isSensor: true, // No collision response, just detection
          }
        );
        targetRef.current = target;

        const wallBodies = levelData.walls.map((wall) => wall.body);

        Matter.World.add(engine.world, [...wallBodies, ball, target]);

        // --- Matter.js Runner ---
        // We will manually step the engine in draw for better control with React state
        // runnerRef.current = Matter.Runner.create();
        // Matter.Runner.run(runnerRef.current, engine); // Use manual stepping instead

        // --- Collision Events ---
        Matter.Events.on(engine, 'collisionStart', (event) => {
          if (gameStatus !== 'playing') return;

          event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            const labels = [bodyA.label, bodyB.label];

            if (
              labels.includes(OBJECT_TYPES.BALL) &&
              labels.includes(OBJECT_TYPES.TARGET)
            ) {
              console.log('Ball reached target!');
              dispatch(levelWon());
            }
          });
        });

        // --- Physics Update Event (Before Update) ---
        Matter.Events.on(engine, 'beforeUpdate', () => {
          if (gameStatus !== 'playing' || !ballRef.current) return;

          // Apply Magnet Forces
          const ballPos = ballRef.current.position;
          let totalForce = { x: 0, y: 0 };

          magnets.forEach((magnet) => {
            const magnetPos = {
              x: magnet.body.position.x,
              y: magnet.body.position.y,
            };
            const direction = Matter.Vector.sub(magnetPos, ballPos);
            const distanceSq = Matter.Vector.magnitudeSquared(direction);

            if (
              distanceSq > GAME_CONFIG.MAGNETS.MAX_DISTANCE ** 2 ||
              distanceSq < GAME_CONFIG.MAGNETS.MIN_DISTANCE ** 2
            ) {
              return; // Magnet too far or too close
            }

            const distance = Math.sqrt(distanceSq);
            const normalizedDirection = Matter.Vector.normalise(direction);

            // Force calculation (Inverse Square-like, but tunable)
            // Simple 1/distance or 1/distance^2 can be too strong/weak
            // Let's try linear falloff for simplicity first
            const strengthFactor =
              (GAME_CONFIG.MAGNETS.MAX_DISTANCE - distance) /
              GAME_CONFIG.MAGNETS.MAX_DISTANCE;
            let forceMagnitude =
              GAME_CONFIG.MAGNETS.DEFAULT_STRENGTH * strengthFactor;

            // Inverse square (more realistic but harder to tune)
            // forceMagnitude = GAME_CONFIG.MAGNET_DEFAULT_STRENGTH / distanceSq;

            if (!magnet.isAttracting) {
              forceMagnitude *= -1; // Repel
            }

            const force = Matter.Vector.mult(
              normalizedDirection,
              forceMagnitude
            );
            totalForce = Matter.Vector.add(totalForce, force);
          });

          // Apply the total calculated force to the ball
          Matter.Body.applyForce(ballRef.current, ballPos, totalForce);
        });
      };

      p.draw = () => {
        p.background(240); // Clear background

        // --- Update Physics Engine ---
        if (gameStatus === 'playing') {
          if (startTimeRef.current === null) {
            startTimeRef.current = p.millis();
          }
          // Manually step the engine
          Matter.Engine.update(engine, GAME_CONFIG.WORLD.PHYSICS_TIMESTEP);

          // Update elapsed time in Redux (consider throttling this)
          const elapsed = (p.millis() - startTimeRef.current) / 1000;
          dispatch(updateElapsedTime(elapsed));

          // Optionally update ball position in Redux for external UI
          // if (ballRef.current) {
          //    dispatch(updateBallPosition(ballRef.current.position));
          // }
        } else {
          // Reset start time if game is not playing
          startTimeRef.current = null;
        }

        // --- Rendering ---
        // Draw Walls
        const walls = Matter.Composite.allBodies(engine.world).filter(
          (body) => body.label === OBJECT_TYPES.WALL
        );
        p.fill(100); // Dark grey for walls
        p.noStroke();
        walls.forEach((wall) => {
          p.push();
          p.translate(wall.position.x, wall.position.y);
          p.rotate(wall.angle);
          p.rectMode(p.CENTER);
          // vertices aren't simple width/height for rotated rects
          // For simplicity, draw using vertices if available, otherwise approx.
          if (wall.vertices) {
            p.beginShape();
            wall.vertices.forEach((vert) =>
              p.vertex(vert.x - wall.position.x, vert.y - wall.position.y)
            ); // Adjust for translation
            p.endShape(p.CLOSE);
          } else {
            // Fallback if vertices are not directly available (should be)
            // This might not render rotation correctly
            // p.rect(0, 0, wallData., wallData.height);
            console.warn('Wall vertices not found for rendering');
          }
          p.pop();
        });

        // Draw Target
        if (targetRef.current) {
          p.fill(0, 200, 0, 150); // Green semi-transparent target
          p.noStroke();
          p.ellipse(
            targetRef.current.position.x,
            targetRef.current.position.y,
            GAME_CONFIG.TARGET.RADIUS * 2
          );
        }

        // Draw Ball
        if (ballRef.current) {
          p.fill(50, 50, 200); // Blue ball
          p.noStroke();
          p.ellipse(
            ballRef.current.position.x,
            ballRef.current.position.y,
            GAME_CONFIG.BALL.RADIUS * 2
          );
        }

        // --- Draw Magnets (Enhanced Visualization) ---
        const maxDist = GAME_CONFIG.MAGNETS.MAX_DISTANCE; // Cache for readability
        const layerRadii = [maxDist, maxDist * 0.66, maxDist * 0.33]; // Radii for layers (outer to inner)
        const layerStrokeWeights = [1, 1.5, 2]; // Stroke weights (outer to inner)
        // Base opacities (adjust as needed)
        const baseStrokeAlpha = [50, 75, 100]; // Alpha for stroke (outer to inner)
        const baseFillAlpha = [0, 20, 40]; // Alpha for fill (outer to inner) - 0 for outermost

        magnets.forEach((magnet) => {
          p.push(); // Isolate transformations and styles for this magnet
          p.translate(magnet.body.position.x, magnet.body.position.y);

          const isAttracting = magnet.isAttracting;
          const baseColor = isAttracting ? [255, 0, 0] : [0, 0, 255]; // Red or Blue

          // --- Draw Field Layers (Outer to Inner) ---
          for (let i = 0; i < layerRadii.length; i++) {
            const radius = layerRadii[i];
            const weight = layerStrokeWeights[i];
            const strokeAlpha = baseStrokeAlpha[i];
            const fillAlpha = baseFillAlpha[i];

            // Set Stroke
            p.strokeWeight(weight);
            p.stroke(baseColor[0], baseColor[1], baseColor[2], strokeAlpha);

            // Set Fill (only for inner layers)
            if (fillAlpha > 0) {
              p.fill(baseColor[0], baseColor[1], baseColor[2], fillAlpha);
            } else {
              p.noFill();
            }

            // Draw Layer Ellipse
            p.ellipse(0, 0, radius * 2, radius * 2);
          }

          // --- Draw Central Magnet Body (on top of fields) ---
          p.strokeWeight(1);
          p.stroke(0); // Black outline for the magnet itself
          p.fill(isAttracting ? [200, 0, 0] : [0, 0, 200]); // Slightly darker solid color
          p.ellipse(0, 0, 20, 20); // Draw the magnet circle

          p.pop(); // Restore previous drawing state
        });

        // Display Game Status
        if (gameStatus === 'won') {
          p.fill(0, 150, 0);
          p.textSize(48);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(
            'You Win!',
            levelData.canvasSize.width / 2,
            levelData.canvasSize.height / 2
          );
        } else if (gameStatus === 'lost') {
          p.fill(150, 0, 0);
          p.textSize(48);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(
            'Try Again!',
            levelData.canvasSize.width / 2,
            levelData.canvasSize.height / 2
          );
        } else if (gameStatus === 'idle' && levelData) {
          p.fill(0, 100);
          p.textSize(24);
          p.textAlign(p.CENTER, p.CENTER);
          p.text(
            'Place Magnets and Press Start',
            levelData.canvasSize.width / 2,
            levelData.canvasSize.height / 2
          );
        }
      };

      // --- Mouse Interaction (Example: Placing Magnets - better handled by React UI) ---
      // p.mousePressed = () => {
      //     if (p.mouseX > 0 && p.mouseX < p.width && p.mouseY > 0 && p.mouseY < p.height) {
      //         // Example: Dispatch action to place a magnet via Redux state
      //         // This logic should ideally be in the React component controlling the canvas
      //         console.log("Mouse clicked at:", p.mouseX, p.mouseY);
      //     }
      // };
    };

    // --- Create p5 instance ---
    // Ensure container is empty before creating a new sketch
    if (containerRef?.current) {
      containerRef.current.innerHTML = ''; // Clear previous canvas if any
      p5InstanceRef.current = new p5(sketch, containerRef.current);
    } else {
      console.error('Container ref is not available for p5 sketch.');
    }

    // --- Cleanup on unmount or dependency change ---
    return () => {
      cleanup();
    };
  }, [levelData, containerRef, dispatch, cleanup, magnets, gameStatus]); // Re-run if levelData or container changes

  // Effect to update game state based on external Redux state changes
  useEffect(() => {
    // Example: If game status changes externally (e.g., Pause button),
    // you might need to stop/start the Matter Runner or adjust logic here.
    console.log('Game status changed to:', gameStatus);
    if (gameStatus !== 'playing' && startTimeRef.current !== null) {
      // Ensure timer stops if game paused/won/lost
      startTimeRef.current = null;
    }
  }, [gameStatus]);

  // Effect specifically for cleaning up when the component unmounts
  useEffect(() => {
    return cleanup;
  }, [cleanup]);

  // Return any methods or refs needed by the parent component (optional)
  return {
    // Example: function to reset the ball position manually
    resetBall: () => {
      if (ballRef.current && levelData) {
        Matter.Body.setPosition(ballRef.current, {
          x: levelData.ballStart.x,
          y: levelData.ballStart.y,
        });
        Matter.Body.setVelocity(ballRef.current, { x: 0, y: 0 });
        Matter.Body.setAngularVelocity(ballRef.current, 0);
      }
    },
  };
};
