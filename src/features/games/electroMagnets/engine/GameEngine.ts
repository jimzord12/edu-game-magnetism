// GameEngine.ts - A singleton physics engine that persists regardless of React's lifecycle

import Matter from 'matter-js';
import p5 from 'p5';
import { Ball } from '@/models/Ball';
import { GAME_CONFIG, OBJECT_TYPES, BASE_CONFIG } from '@/config/gameConfig';
import { ILevel } from '@/features/levels/types';
import { ElectroMagnet } from '@/models/ElectroMagnet';

type GameEventCallback = (data?: unknown) => void;

/**
 * Singleton GameEngine class that manages the Matter.js physics world and p5.js rendering
 * This decouples the physics state from React's component lifecycle
 */
class GameEngine {
  private static instance: GameEngine | null = null;
  private engine: Matter.Engine | null = null;
  private p5Instance: p5 | null = null;
  private ball: Ball | null = null;
  private target: Ball | null = null;
  private containerElement: HTMLElement | null = null;
  private currentLevel: ILevel<'electromagnet'> | null = null;
  private wallBodies: Matter.Body[] = [];
  private isWorldReady: boolean = false;
  private startTime: number | null = null;
  private magnets: ElectroMagnet[] = [];
  private gameStatus: 'idle' | 'playing' | 'paused' | 'won' | 'lost' = 'idle';
  private isInitialized: boolean = false;

  // Event callbacks
  private onCollisionCallbacks: GameEventCallback[] = [];
  private onRenderCallbacks: GameEventCallback[] = [];
  private onWinCallbacks: GameEventCallback[] = [];

  // Prevent direct instantiation outside this class
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): GameEngine {
    if (!GameEngine.instance) {
      GameEngine.instance = new GameEngine();
    }
    return GameEngine.instance;
  }

  /**
   * Initialize the game engine with level data and container
   */
  public initialize(
    levelData: ILevel<'electromagnet'>,
    container: HTMLElement
  ): void {
    // If already initialized with the same level, don't reinitialize
    if (this.isInitialized && this.currentLevel?.id === levelData.id) {
      console.log('Game engine already initialized with this level');
      return;
    }

    // Clean up previous instance if it exists
    this.cleanup();

    this.currentLevel = levelData;
    this.containerElement = container;
    this.isWorldReady = false;
    this.gameStatus = 'idle';

    // Create Matter.js engine
    this.engine = Matter.Engine.create();
    this.engine.gravity = { ...GAME_CONFIG.WORLD.GRAVITY };

    // Create p5 sketch
    const sketch = (p: p5) => {
      p.setup = () => {
        p.createCanvas(levelData.canvasSize.width, levelData.canvasSize.height);
        p.frameRate(60);
        console.log('GameEngine: p5 setup complete for level:', levelData.id);

        // Create Ball
        this.ball = new Ball({
          x: levelData.ballStart.x,
          y: levelData.ballStart.y,
          radius: GAME_CONFIG.BALL.RADIUS,
          matterOptions: {
            label: OBJECT_TYPES.BALL,
            density: GAME_CONFIG.BALL.DENSITY,
            frictionAir: GAME_CONFIG.BALL.FRICTION_AIR,
            restitution: 0.8,
          },
        });

        // Create Target
        this.target = new Ball({
          x: levelData.targetPosition.x,
          y: levelData.targetPosition.y,
          radius: GAME_CONFIG.TARGET.RADIUS,
          matterOptions: {
            label: OBJECT_TYPES.TARGET,
            isStatic: true,
            isSensor: true,
          },
        });

        // Load Walls
        this.wallBodies = levelData.walls.map((wall) => wall.body);

        // Add elements to world one by one
        this.wallBodies.forEach((wall) => {
          Matter.World.add(this.engine!.world, wall);
        });

        Matter.World.add(this.engine!.world, this.ball.body);
        Matter.World.add(this.engine!.world, this.target.body);

        // Collision events
        Matter.Events.on(this.engine!, 'collisionStart', (event) => {
          event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            const labels = [bodyA.label, bodyB.label];

            // Handle ball-target collision
            if (
              labels.includes(OBJECT_TYPES.BALL) &&
              labels.includes(OBJECT_TYPES.TARGET)
            ) {
              this.gameStatus = 'won';
              this.onWinCallbacks.forEach((cb) => cb());
            }

            // Notify collision listeners
            this.onCollisionCallbacks.forEach((cb) => cb({ bodyA, bodyB }));
          });
        });

        this.isWorldReady = true;
      };

      p.draw = () => {
        p.background(220);

        // Draw Walls
        p.fill(100);
        p.noStroke();
        const walls = this.wallBodies;
        walls.forEach((wall) => {
          p.push();
          p.translate(wall.position.x, wall.position.y);
          p.rotate(wall.angle);
          p.rectMode(p.CENTER);
          if (wall.vertices) {
            p.beginShape();
            wall.vertices.forEach((vert) =>
              p.vertex(vert.x - wall.position.x, vert.y - wall.position.y)
            );
            p.endShape(p.CLOSE);
          }
          p.pop();
        });

        // Draw Target
        if (this.target) {
          p.fill(0, 200, 0, 150);
          p.noStroke();
          p.ellipse(
            this.target.body.position.x,
            this.target.body.position.y,
            GAME_CONFIG.TARGET.RADIUS * 2
          );
        }

        // Draw Ball
        if (this.ball) {
          p.fill(50, 50, 200);
          p.noStroke();
          p.ellipse(
            this.ball.body.position.x,
            this.ball.body.position.y,
            GAME_CONFIG.BALL.RADIUS * 2
          );
        }

        // 🧲 --- Draw Magnets (Enhanced Visualization) --- 🧲
        this.drawMagnets(p);

        // Display Game Status
        this.drawGameStatus(p);

        // Notify render listeners
        this.onRenderCallbacks.forEach((cb) => cb());
      };
    };

    // Create p5 instance
    if (this.containerElement) {
      this.containerElement.innerHTML = '';
      this.p5Instance = new p5(sketch, this.containerElement);
      this.isInitialized = true;
    }
  }

  /**
   * Draw magnets and their magnetic fields
   */
  private drawMagnets(p: p5): void {
    if (!this.magnets || this.magnets.length === 0) return;

    const maxDist = GAME_CONFIG.MAGNETS.MAX_DISTANCE;
    const layerRadii = [maxDist, maxDist * 0.66, maxDist * 0.33];
    const layerStrokeWeights = [1, 1.5, 2];
    const baseStrokeAlpha = [50, 75, 100];
    const baseFillAlpha = [0, 20, 40];

    this.magnets.forEach((magnet) => {
      p.push();
      p.translate(magnet.body.position.x, magnet.body.position.y);

      const isAttracting = magnet.isAttracting;
      const baseColor = isAttracting
        ? BASE_CONFIG.MAGNETS.ATTRACT_COLOR
        : BASE_CONFIG.MAGNETS.REPEL_COLOR;

      // Draw magnetic field layers
      for (let i = 0; i < layerRadii.length; i++) {
        if (!magnet.isActive) continue;

        const radius = layerRadii[i];
        const weight = layerStrokeWeights[i];
        const strokeAlpha = baseStrokeAlpha[i];
        const fillAlpha = baseFillAlpha[i];

        p.strokeWeight(weight);
        p.stroke(baseColor[0], baseColor[1], baseColor[2], strokeAlpha);

        if (fillAlpha > 0) {
          p.fill(baseColor[0], baseColor[1], baseColor[2], fillAlpha);
        } else {
          p.noFill();
        }

        p.ellipse(0, 0, radius * 2, radius * 2);
      }

      // Draw magnet body
      p.strokeWeight(1);
      p.stroke(0);
      p.fill(isAttracting ? [200, 0, 0] : [0, 0, 200]);
      p.ellipse(0, 0, 20, 20);

      p.pop();
    });
  }

  /**
   * Draw game status messages
   */
  private drawGameStatus(p: p5): void {
    if (!this.currentLevel) return;

    if (this.gameStatus === 'won') {
      p.fill(0, 150, 0);
      p.textSize(48);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(
        'You Win!',
        this.currentLevel.canvasSize.width / 2,
        this.currentLevel.canvasSize.height / 2
      );
    } else if (this.gameStatus === 'lost') {
      p.fill(150, 0, 0);
      p.textSize(48);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(
        'Try Again!',
        this.currentLevel.canvasSize.width / 2,
        this.currentLevel.canvasSize.height / 2
      );
    } else if (this.gameStatus === 'idle' && this.currentLevel) {
      p.fill(0, 100);
      p.textSize(24);
      p.textAlign(p.CENTER, p.CENTER);
      p.text(
        'Place Magnets and Press Start',
        this.currentLevel.canvasSize.width / 2,
        this.currentLevel.canvasSize.height / 2
      );
    }
  }

  /**
   * Update the physics world (called from game loop or Redux)
   */
  public update(deltaTime: number = GAME_CONFIG.WORLD.PHYSICS_TIMESTEP): void {
    if (!this.engine || !this.isWorldReady || this.gameStatus !== 'playing')
      return;

    Matter.Engine.update(this.engine, deltaTime);

    if (this.startTime === null) {
      this.startTime = Date.now();
    }
  }

  /**
   * Set the game status
   */
  public setGameStatus(
    status: 'idle' | 'playing' | 'paused' | 'won' | 'lost'
  ): void {
    this.gameStatus = status;

    if (status === 'playing') {
      if (this.startTime === null) {
        this.startTime = Date.now();
      }
    } else if (status === 'paused') {
      // Just pause, don't reset startTime
    } else {
      this.startTime = null;
    }
  }

  /**
   * Get the current game status
   */
  public getGameStatus(): string {
    return this.gameStatus;
  }

  /**
   * Update magnets in the physics world without reinitializing
   */
  public updateMagnets(magnets: ElectroMagnet[]): void {
    if (!this.engine || !this.isWorldReady) return;

    this.magnets = magnets;

    const world = this.engine.world;

    // Remove existing magnet bodies
    const allBodies = Matter.Composite.allBodies(world);
    allBodies.forEach((body) => {
      if (body.label === OBJECT_TYPES.MAGNET) {
        Matter.World.remove(world, body, true);
      }
    });

    // Add current magnets individually - allow during any game state
    magnets.forEach((magnet) => {
      Matter.World.add(world, magnet.body);
    });
  }

  /**
   * Apply magnetic forces to the ball
   */
  public applyMagneticForces(magnets: ElectroMagnet[]): void {
    if (
      !this.ball ||
      !this.engine ||
      !this.isWorldReady ||
      this.gameStatus !== 'playing'
    )
      return;

    const ballPos = this.ball.body.position;
    let totalForce = { x: 0, y: 0 };

    magnets.forEach((magnet) => {
      if (!magnet.isActive) return;

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
        return;
      }

      const distance = Math.sqrt(distanceSq);
      const normalizedDirection = Matter.Vector.normalise(direction);
      const strengthFactor =
        (GAME_CONFIG.MAGNETS.MAX_DISTANCE - distance) /
        GAME_CONFIG.MAGNETS.MAX_DISTANCE;
      let forceMagnitude =
        GAME_CONFIG.MAGNETS.DEFAULT_STRENGTH * strengthFactor;

      if (!magnet.isAttracting) {
        forceMagnitude *= -1;
      }

      const force = Matter.Vector.mult(normalizedDirection, forceMagnitude);
      totalForce = Matter.Vector.add(totalForce, force);
    });

    Matter.Body.applyForce(this.ball.body, ballPos, totalForce);
  }

  /**
   * Reset the ball position
   */
  public resetBall(): void {
    if (!this.ball || !this.currentLevel) return;

    Matter.Body.setPosition(this.ball.body, {
      x: this.currentLevel.ballStart.x,
      y: this.currentLevel.ballStart.y,
    });
    Matter.Body.setVelocity(this.ball.body, { x: 0, y: 0 });
    Matter.Body.setAngularVelocity(this.ball.body, 0);
  }

  /**
   * Cleanup resources
   */
  public cleanup(): void {
    if (this.p5Instance) {
      this.p5Instance.remove();
      this.p5Instance = null;
    }

    if (this.engine) {
      Matter.World.clear(this.engine.world, false);
      Matter.Engine.clear(this.engine);
      this.engine = null;
    }

    this.ball = null;
    this.target = null;
    this.wallBodies = [];
    this.isWorldReady = false;
    this.startTime = null;
    this.magnets = [];
    this.isInitialized = false;
  }

  /**
   * Register event callbacks
   */
  public onCollision(callback: GameEventCallback): () => void {
    this.onCollisionCallbacks.push(callback);
    return () => {
      this.onCollisionCallbacks = this.onCollisionCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  public onRender(callback: GameEventCallback): () => void {
    this.onRenderCallbacks.push(callback);
    return () => {
      this.onRenderCallbacks = this.onRenderCallbacks.filter(
        (cb) => cb !== callback
      );
    };
  }

  public onWin(callback: GameEventCallback): () => void {
    this.onWinCallbacks.push(callback);
    return () => {
      this.onWinCallbacks = this.onWinCallbacks.filter((cb) => cb !== callback);
    };
  }

  /**
   * Get elapsed time in seconds
   */
  public getElapsedTime(): number {
    if (!this.startTime) return 0;

    // If paused, return elapsed time until pause
    if (this.gameStatus === 'paused') {
      return (this.startTime - Date.now()) / 1000;
    }

    return (Date.now() - this.startTime) / 1000;
  }

  /**
   * Toggle game pause state
   */
  public togglePause(): void {
    if (this.gameStatus === 'playing') {
      this.gameStatus = 'paused';
    } else if (this.gameStatus === 'paused') {
      this.gameStatus = 'playing';
      this.startTime = Date.now();
    }
  }
}

export default GameEngine;
