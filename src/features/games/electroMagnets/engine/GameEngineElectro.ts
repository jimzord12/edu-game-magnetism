// GameEngine.ts - A singleton physics engine that persists regardless of React's lifecycle

import Matter, { Events, MouseConstraint } from 'matter-js';
import p5 from 'p5';
import { Ball } from '@/models/Ball';
import { Wall } from '@/models/Wall';
import {
  BASE_CONFIG,
  GAME_CONFIG,
  OBJECT_TYPES,
  SANDBOX_CONFIG,
} from '@/config/gameConfig';
import { ILevel } from '@/features/levels/types';
import { ElectroMagnet } from '@/models/ElectroMagnet';
import { GameState } from '../../types';
import { createMouseOptionsElectro } from '@/utils/attachMatterMouseConstraintWithRestriction';
import { isMagnetClicked } from '@/features/sandbox/helpers';
import { willNewMagnetOverlap } from '../../utils';

type GameEventCallback = (data?: unknown) => void;

/**
 * Singleton GameEngine class that manages the Matter.js physics world and p5.js rendering
 * This decouples the physics state from React's component lifecycle
 */
class GameEngineElectro {
  private static instance: GameEngineElectro | null = null;
  public engine: Matter.Engine | null = null;
  private p5Instance: p5 | null = null;
  private ball: Ball | null = null;
  private target: Ball | null = null; // Target is also represented as a Ball model for simplicity
  public containerElement: HTMLElement | null = null;
  private currentLevel: ILevel<'electromagnet'> | null = null;
  private walls: Wall[] = []; // Changed from wallBodies: Matter.Body[]
  public isWorldReady: boolean = false;
  private startTime: number | null = null;
  private magnets: ElectroMagnet[] = [];
  private gameStatus: GameState = 'idle';
  public isInitialized: boolean = false;
  private mouseConstraint: Matter.MouseConstraint | null = null;
  private selectedMagnet: ElectroMagnet | null = null;
  private selectedMagnetPrevPos: Matter.Vector | null = null;

  // Event callbacks
  private onCollisionCallbacks: GameEventCallback[] = [];
  private onRenderCallbacks: GameEventCallback[] = [];
  private onWinCallbacks: GameEventCallback[] = [];
  private onLoseCallbacks: GameEventCallback[] = [];

  // React Bridges
  public onUpdateTime: ((time: number) => void) | null = null;
  public onGameStatusChange: ((status: string) => void) | null = null;

  // Prevent direct instantiation outside this class
  private constructor() {}

  /**
   * Get the singleton instance
   */
  public static getInstance(): GameEngineElectro {
    if (!GameEngineElectro.instance) {
      GameEngineElectro.instance = new GameEngineElectro();
    }
    return GameEngineElectro.instance;
  }

  /**
   * Initialize the game engine with level data and container
   */
  public initialize(
    levelData: ILevel<'electromagnet'>,
    container: HTMLElement,
    onPlaceMagnet?: (x: number, y: number) => void,
    onUpdateTime?: (time: number) => void,
    onGameStatusChange?: (status: string) => void
  ): void {
    // Clean up previous instance if it exists
    this.cleanup();

    console.log('Level data:', levelData);
    console.log('Container element:', container);
    console.log('onPlaceMagnet:', onPlaceMagnet);
    console.log('onUpdateTime:', onUpdateTime);

    this.onUpdateTime = onUpdateTime || null; // Default to no-op if not provided
    this.onGameStatusChange = onGameStatusChange || null; // Default to no-op if not provided

    this.currentLevel = levelData;
    this.containerElement = container;
    this.isWorldReady = false;
    this.gameStatus = 'idle';

    // Create p5 sketch
    const sketch = (p: p5) => {
      console.log('SKETCH: p5 instance:', p);

      this.walls = []; // Clear walls array

      // Create Matter.js engine
      this.engine = Matter.Engine.create();
      this.engine.gravity = { ...GAME_CONFIG.WORLD.GRAVITY };

      let mouseConstraint: MouseConstraint;

      p.setup = () => {
        p.createCanvas(levelData.canvasSize.width, levelData.canvasSize.height);

        // p.frameRate(60);
        console.log('GameEngine: p5 setup complete for level:', levelData.id);

        if (this.engine === null) {
          console.error('⛔⛔ Engine not initialized! ⛔⛔');
          return;
        }
        const mouseOptions = createMouseOptionsElectro(p);
        this.mouseConstraint = MouseConstraint.create(
          this.engine!,
          mouseOptions
        );
        mouseConstraint = this.mouseConstraint;
        Matter.World.add(this.engine.world, mouseConstraint);

        //// --- Create Game Objects --- ////
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

        //// ---- Load Level Entity Objects ---- ////
        this.walls = levelData.walls;
        const levelMagnets = levelData.electromagnets || [];

        //// --- Add Game Objects to the Physics World --- ////

        // Add elements to world
        const wallBodies = this.walls.map((wall) => wall.body);
        const ballBody = this.ball.body!;
        const targetBody = this.target.body!;
        const levelMagnetsBodies = levelMagnets.map((magnet) => magnet.body);
        this.magnets.push(...(levelData.electromagnets || []));

        const magnetBodies = this.magnets.map((magnet) => magnet.body);

        const allBodies = [
          ballBody,
          targetBody,
          ...levelMagnetsBodies,
          ...wallBodies,
          ...magnetBodies,
        ];

        Matter.World.add(this.engine.world, allBodies); // Add all bodies to the world

        // Add the mouse constraint to world separately to ensure it's added after bodies

        //// ---- EVENTS ---- ////

        // Mouse events
        // Events.on(mouseConstraint, 'mousemove', (e) => {
        //   console.log('◻︎ mouse move:', e);
        //   if (this.mouseConstraint !== null) {
        //     console.log('Mouse constraint:', this.mouseConstraint.body);
        //   }
        // });

        Events.on(mouseConstraint, 'startdrag', (event) => {
          const e = event as unknown as Matter.IMouseEvent<MouseConstraint> & {
            body: Matter.Body & {
              restrictedMovement?: 'horizontal' | 'vertical' | 'none';
            };
          };

          const body = e.body;
          if (!body) return;

          if (body.restrictedMovement && body.restrictedMovement !== 'none') {
            // this.selectedMagnet = body; // Save body
            this.selectedMagnetPrevPos = { ...body.position }; // Save starting position
          }
        });

        Events.on(mouseConstraint, 'enddrag', (e) => {
          console.log('◻︎ stopped dragging body:', e);
          if (this.mouseConstraint !== null) {
            this.selectedMagnetPrevPos = null;
          }
        });

        // Collision events
        Matter.Events.on(this.engine, 'collisionStart', (event) => {
          event.pairs.forEach((pair) => {
            const { bodyA, bodyB } = pair;
            const labels = [bodyA.label, bodyB.label];

            // Handle ball-target collision
            if (
              labels.includes(OBJECT_TYPES.BALL) &&
              labels.includes(OBJECT_TYPES.TARGET)
            ) {
              this.setGameStatus('won'); // Callbacks handled by setGameStatus
            }

            // Handle ball-hazard collision
            if (
              labels.includes(OBJECT_TYPES.BALL) &&
              labels.includes(OBJECT_TYPES.HAZARD)
            ) {
              console.log('Collision: Ball hit Hazard!');
              this.setGameStatus('lost'); // Callbacks handled by setGameStatus
            }

            // Handle ball-wall collision (for logging/debugging)
            if (
              labels.includes(OBJECT_TYPES.BALL) &&
              labels.includes(OBJECT_TYPES.WALL)
            ) {
              console.log('Collision: Ball hit Wall!'); // Added log
            }

            // Notify generic collision listeners
            this.onCollisionCallbacks.forEach((cb) => cb({ bodyA, bodyB }));
          });
        });

        this.isWorldReady = true;
      };

      p.draw = () => {
        // Game State Management
        switch (this.gameStatus) {
          case 'idle':
            this.update(); // Update the game engine
            this.applyEntityMovements();
            this.applyMagnetMovementRestrictions(); // Apply movement restrictions

            break;
          case 'playing':
            this.update(); // Update the game engine
            this.applyEntityMovements();
            this.applyMagnetMovementRestrictions(); // Apply movement restrictions

            onGameStatusChange?.('playing'); // Notify game status change
            break;
          case 'paused':
            // this.update(); // Update the game engine
            onGameStatusChange?.('paused'); // Notify game status change
            break;
          case 'won':
            onGameStatusChange?.('won'); // Notify game status change
            // Do nothing, just render the current state
            break;
          case 'lost':
            onGameStatusChange?.('lost'); // Notify game status change
            // Do nothing, just render the current state
            break;

          default:
            break;
        }

        p.background(220);

        // Render Walls and Hazards (using their own render methods)
        this.walls.forEach((wall) => {
          wall.render(p);
        });

        // Render Target (using Ball's render method)
        if (this.target) {
          const [r, g, b] = BASE_CONFIG.TARGET.COLOR;
          const [strokeR, strokeG, strokeB] = BASE_CONFIG.TARGET.STROKE_COLOR;
          p.push();
          this.target.render(p, {
            r: r,
            g: g,
            b: b,
          });
          p.stroke(strokeR, strokeG, strokeB); // Darker green
          p.pop();
        }

        // Render Ball (using its own render method)
        if (this.ball) {
          this.ball.render(p);
        }

        // Render Magnets (using their own render methods)
        this.magnets.forEach((magnet) => {
          magnet.render(p);
        });

        // Display Game Status
        this.drawGameStatus(p);

        // Notify render listeners
        this.onRenderCallbacks.forEach((cb) => cb());
      };

      // Handle mousePressed for magnet placement
      p.mousePressed = () => {
        //// ---- Mouse constraint setup ---- ////
        // We create a single mouse constraint here in setup
        // and it will be the only one used throughout
        console.log('Mouse pressed - mouseConstraint:', this.mouseConstraint);
        if (!this.engine || !this.mouseConstraint) {
          console.log('Setup - Engine created:', this.engine);
        }

        if (!onPlaceMagnet || !this.currentLevel) return;

        // Only allow placement if game is idle or paused
        // if (!(this.gameStatus === 'idle' || this.gameStatus === 'paused'))
        //   return;

        // Enforce magnet limit
        if (
          (this.gameStatus === 'idle' || this.gameStatus === 'paused') &&
          this.magnets.length < this.currentLevel.availableMagnets
        ) {
          const margin = 20;
          const x = p.mouseX;
          const y = p.mouseY;

          // Enforce border margin
          if (
            x < margin ||
            x > this.currentLevel.canvasSize.width - margin ||
            y < margin ||
            y > this.currentLevel.canvasSize.height - margin
          ) {
            return;
          }

          // Enforce no overlapping magnets
          const isOverlapping = willNewMagnetOverlap(
            { position: { x, y }, radius: SANDBOX_CONFIG.MAGNETS.RADIUS },
            this.magnets.map((m) => m.body)
          );

          if (!isOverlapping) {
            console.log(
              'Magnet placement failed: Overlapping with existing magnets!'
            );
            onPlaceMagnet(x, y);
          } else {
            console.log('🚀🚀🚀 Starting Handle Magnet Selection...'); // Debugging log
            this.handleMagnetSelection();
          }
        } else {
          // Only handle magnet selection if we have a valid mouse constraint
          if (this.isWorldReady && this.isInitialized && this.mouseConstraint) {
            console.log('Starting Handle Magnet Selection...'); // Debugging log
            this.handleMagnetSelection(); // Handle magnet selection on mouse press
          } else {
            console.log(
              'Cannot handle magnet selection - not ready or no mouseConstraint'
            );
          }
        }
      };

      p.mouseReleased = () => {
        this.onMouseUp();
      };
    };

    console.log('Before P5 Init: ', this.containerElement);

    // Create p5 instance
    if (this.containerElement) {
      this.containerElement.innerHTML = '';
      this.p5Instance = new p5(sketch, this.containerElement);
      console.log('p5Instance: ', this.p5Instance);
      this.isInitialized = true;
    }

    // Don't create a second mouse constraint here!
    // The one created in p.setup is sufficient
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
  public update(): void {
    if (!this.engine) return;
    if (!this.isWorldReady) return;
    if (!this.ball) return;
    if (!this.currentLevel) return;

    // ---- Game Time Management ---- //
    if (this.startTime === null && this.gameStatus === 'idle') {
      // The Game is in 'idle' Mode.
      console.log('[Game Time Management] - Game is idle!');
    } else if (this.startTime === null && this.gameStatus === 'playing') {
      console.log('[Game Time Management] - Game started!');
      // The Game is starting
      this.startTime = Date.now();
    } else if (this.startTime !== null && this.gameStatus === 'paused') {
      // The Game is Paused
      console.log('[Game Time Management] - Game paused!');
    } else {
      // The Game is running
      if (this.startTime === null) {
        console.error('Start time is null, cannot calculate elapsed time!');
        return;
      }

      this.applyMagneticForces(this.magnets); // Apply magnetic forces to the ball

      const elapsedTime = (Date.now() - this.startTime) / 1000; // in seconds
      if (this.onUpdateTime) {
        this.onUpdateTime(elapsedTime); // Call the callback with elapsed time
      }
      // console.log('Elapsed Time: ', elapsedTime); // Log the elapsed time
    }

    this.hasBallExceededBounds(); // Check if the ball is out of bounds

    Matter.Engine.update(this.engine);
  }

  /**
   * Set the game status
   */
  public setGameStatus(status: GameState): void {
    // Prevent setting the same status again or changing from won/lost
    if (
      this.gameStatus === status ||
      this.gameStatus === 'won' ||
      this.gameStatus === 'lost'
    ) {
      return;
    }

    console.log(`Game status changing from ${this.gameStatus} to ${status}`); // Add log
    this.gameStatus = status;

    if (status === 'playing') {
      if (this.startTime === null) {
        this.startTime = Date.now();
      }
    } else if (status === 'paused') {
      // Pause logic (currently just stops timer implicitly)
      // If you need to store elapsed time before pause, do it here
    } else {
      // Handle idle, won, lost

      if (status === 'won') {
        console.log('Triggering onWin callbacks');
        this.onWinCallbacks.forEach((cb) => cb());
      } else if (status === 'lost') {
        console.log('Triggering onLose callbacks');
        this.onLoseCallbacks.forEach((cb) => cb());
      } else if (status === 'idle') {
        console.log('Game is idle, waiting for player action.');
        this.startTime = null; // Reset timer for terminal states or idle
      }
      // No specific action needed for 'idle' here besides resetting timer
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

    console.log('[GameEngine] Updating magnets:', magnets);

    const world = this.engine.world;

    // Remove existing magnet bodies
    const allBodies = Matter.Composite.allBodies(world);
    allBodies.forEach((body) => {
      if (
        [
          OBJECT_TYPES.MAGNET,
          OBJECT_TYPES.MAGNET_ATTRACT,
          OBJECT_TYPES.MAGNET_REPEL,
        ].includes(body.label)
      ) {
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

      if (distanceSq > GAME_CONFIG.MAGNETS.MAX_DISTANCE ** 2) {
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

  private applyMagnetMovementRestrictions(): void {
    if (
      this.mouseConstraint &&
      this.selectedMagnet &&
      this.selectedMagnetPrevPos
    ) {
      const movement = this.selectedMagnet.body.restrictedMovement;
      const mouse = this.mouseConstraint.mouse;

      if (movement === 'horizontal') {
        mouse.position.y = this.selectedMagnetPrevPos.y; // Lock Y
      } else if (movement === 'vertical') {
        mouse.position.x = this.selectedMagnetPrevPos.x; // Lock X
      }
    }
  }

  private applyEntityMovements() {
    const updateEntity = <T extends Wall | ElectroMagnet>(entity: T) => {
      if (entity.movementPattern === undefined) return;
      if (entity.movementPattern.speed === undefined) return;
      if (entity.movementPattern.amplitude === undefined) return;

      if (
        entity.movementPattern.startDelay &&
        entity.movementPattern.startDelay > this.getElapsedTime()
      )
        return;

      const { type, axis, amplitude, speed } = entity.movementPattern;
      const { x: initialX, y: initialY } = entity;

      if (type === 'oscillate') {
        const direction = entity.movementPattern.direction || 1;
        const delay = entity.movementPattern.startDelay || 0;
        const offset =
          Math.sin(this.getElapsedTime() * speed + delay) *
          amplitude *
          direction; // Re-enable offset calculation
        if (axis === 'horizontal') {
          Matter.Body.setPosition(entity.body, {
            x: initialX + offset,
            y: initialY,
          });
        } else if (axis === 'vertical') {
          Matter.Body.setPosition(entity.body, {
            x: initialX,
            y: initialY + offset,
          });
        }
      }
    };

    this.walls.forEach(updateEntity);
    this.magnets.forEach(updateEntity);
  }

  /**
   * Remove magnetic forces from the ball
   */
  public removeMagneticForces(): void {
    if (!this.ball || !this.engine || !this.isWorldReady) return;

    const ballPos = this.ball.body.position;
    const totalForce = { x: 0, y: 0 };

    // Apply zero force to the ball
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
    this.walls = []; // Clear walls array on cleanup
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

  public onLose(callback: GameEventCallback): () => void {
    this.onLoseCallbacks.push(callback);
    return () => {
      this.onLoseCallbacks = this.onLoseCallbacks.filter(
        (cb) => cb !== callback
      );
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

  /**
   * Get the HTMLCanvasElement used by p5.js
   */
  public getCanvasElement(): HTMLCanvasElement | null {
    if (this.p5Instance && this.p5Instance.drawingContext) {
      return this.p5Instance.drawingContext.canvas as HTMLCanvasElement;
    }
    return null;
  }

  private handleMagnetSelection() {
    // First check if the world and engine are actually ready
    if (!this.isWorldReady || !this.isInitialized) {
      console.log('Game world not ready for magnet selection');
      return;
    }

    console.log(
      '[handleMagnetSelection] #1: Mouse constraint: ',
      this.mouseConstraint
    ); // Debugging log
    if (this.mouseConstraint === null || this.engine === null) return;

    // Get mouse position from constraint
    const mousePos = this.mouseConstraint.mouse.position;
    if (!mousePos) return;

    // Additional debugging
    console.log(
      '[handleMagnetSelection] #2: Available magnets: ',
      this.magnets.length
    );

    // Find which magnet is being clicked
    const selectedMagnet = this.magnets.find((entity) => {
      if (!entity.body.label.startsWith('magnet')) return false;

      return isMagnetClicked(
        mousePos,
        entity.body.position,
        SANDBOX_CONFIG.MAGNETS.RADIUS
      );
    }) as ElectroMagnet | undefined;

    if (selectedMagnet) {
      console.log(
        '[handleMagnetSelection] #3: Selected magnet:',
        selectedMagnet
      );
      this.selectedMagnet = selectedMagnet;
      Matter.Body.setStatic(selectedMagnet.body, false); // Make dynamic while dragging
      console.log(
        'Selected magnet, is Static:',
        this.selectedMagnet.body.isStatic
      ); // Debugging log
      console.log('[handleMagnetSelection] #4: Game State:', this.gameStatus);
    }
  }

  private handleMagnetRelease() {
    if (this.selectedMagnet) {
      Matter.Body.setStatic(this.selectedMagnet.body, true); // Make static again
      this.selectedMagnet = null;
    }
  }

  /**
   * Set the mouse constraint
   */
  public setMouseConstraint(mouseConstraint: Matter.MouseConstraint) {
    this.mouseConstraint = mouseConstraint;
  }

  /**
   * Handle mouse up event to release the magnet
   */
  public onMouseUp() {
    this.handleMagnetRelease();
  }

  public hasBallExceededBounds(): boolean {
    if (!this.ball || !this.currentLevel) return false;
    // Check if ball is out of bounds
    const ballPos = this.ball.body.position;
    const canvasWidth = this.currentLevel.canvasSize.width;
    const canvasHeight = this.currentLevel.canvasSize.height;

    if (
      ballPos.x < -25 ||
      ballPos.x > canvasWidth + 25 ||
      ballPos.y < -25 ||
      ballPos.y > canvasHeight + 25
    ) {
      console.log('Game Over: Ball went out of bounds!');
      this.setGameStatus('lost'); // Callbacks handled by setGameStatus
      return true;
    }
    return false;
  }

  //// ---- DEBUGGING ---- ////
}

export default GameEngineElectro;
