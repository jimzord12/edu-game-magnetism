import { SANDBOX_CONFIG, OBJECT_TYPES } from '@/config/gameConfig';
import { Ball } from '@/models/Ball';
import { Wall } from '@/models/Wall';
import Matter, { IMouseConstraintDefinition } from 'matter-js';
import p5 from 'p5';

export const createBall = (x: number, y: number): Ball => {
  return new Ball({
    x,
    y,
    radius: SANDBOX_CONFIG.BALL.RADIUS,
    matterOptions: {
      label: OBJECT_TYPES.BALL,
      density: SANDBOX_CONFIG.BALL.DENSITY,
      frictionAir: SANDBOX_CONFIG.BALL.FRICTION_AIR,
      restitution: SANDBOX_CONFIG.BALL.RESTITUTION,
      friction: SANDBOX_CONFIG.BALL.FRICTION,
    },
  });
};

export const createWalls = (canvasSize: {
  width: number;
  height: number;
}): Wall[] => {
  const wall_Top = new Wall({
    x: canvasSize.width / 2,
    y: 10,
    dimensions: { width: canvasSize.width, height: 20 },
  });

  const wall_Bottom = new Wall({
    x: canvasSize.width / 2,
    y: canvasSize.height - 10,
    dimensions: { width: canvasSize.width, height: 20 },
  });

  const wall_Left = new Wall({
    x: 10,
    y: canvasSize.height / 2,
    dimensions: { width: 20, height: canvasSize.height },
  });

  const wall_Right = new Wall({
    x: canvasSize.width - 10,
    y: canvasSize.height / 2,
    dimensions: { width: 20, height: canvasSize.height },
  });

  return [wall_Top, wall_Bottom, wall_Left, wall_Right];
};

export const createMouseOptions = (p: p5): IMouseConstraintDefinition => {
  const p5Canvas = (p as typeof p & { canvas: HTMLCanvasElement }).canvas;
  const mouse = Matter.Mouse.create(p5Canvas);
  mouse.pixelRatio = p.pixelDensity(); // Important for high-density displays

  return {
    mouse: mouse,
    constraint: {
      stiffness: SANDBOX_CONFIG.MOUSE.STIFFNESS, // Adjust for desired drag feel
      render: {
        visible: false, // Don't draw the default constraint line
      },
    },
    collisionFilter: {
      category: SANDBOX_CONFIG.MOUSE.COLLISION_CATEGORY, // Category for mouse constraint
      mask: SANDBOX_CONFIG.MOUSE.COLLISION_MASK, // Only collide with objects in this category
    },
  };
};

export const isMagnetClicked = (mousePos: Matter.Vector, magnetPos: Matter.Vector, radius: number): boolean => {
    // Calculate distance between mouse and magnet center
    const distance = Matter.Vector.magnitude(
      Matter.Vector.sub(mousePos, magnetPos)
    );
    
    // Return true if mouse is within the magnet's radius
    return distance <= radius;
  };
