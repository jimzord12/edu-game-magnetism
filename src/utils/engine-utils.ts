import { SANDBOX_CONFIG } from '@/config/gameConfig';
import Matter, { IMouseConstraintDefinition } from 'matter-js';
import p5 from 'p5';

export const createMouseOptionsElectro = (
  p: p5
): IMouseConstraintDefinition => {
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

export const isMagnetClickedElectro = (
  mousePos: Matter.Vector,
  magnetPos: Matter.Vector,
  radius: number
): boolean => {
  // Calculate distance between mouse and magnet center
  const distance = Matter.Vector.magnitude(
    Matter.Vector.sub(mousePos, magnetPos)
  );

  // Return true if mouse is within the magnet's radius
  return distance <= radius;
};
