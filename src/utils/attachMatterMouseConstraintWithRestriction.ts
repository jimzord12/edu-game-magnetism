import { SANDBOX_CONFIG } from '@/config/gameConfig';
import Matter, { IMouseConstraintDefinition } from 'matter-js';
import p5 from 'p5';

export function applyMouseDragRestriction(
  engine: Matter.Engine,
  mouseConstraint: Matter.MouseConstraint
) {
  const body =
    (mouseConstraint.body as Matter.Body & { restrictedMovement?: string }) ||
    null;
  if (body && mouseConstraint.mouse.button === 0) {
    const restriction = body.restrictedMovement as
      | 'horizontal'
      | 'vertical'
      | 'none'
      | undefined;
    if (restriction && restriction !== 'none') {
      const startPos = mouseConstraint.constraint.pointB || body.position;
      const mousePos = mouseConstraint.mouse.position;
      let newPos = { ...body.position };
      if (restriction === 'horizontal') {
        newPos = { x: mousePos.x, y: startPos.y };
      } else if (restriction === 'vertical') {
        newPos = { x: startPos.x, y: mousePos.y };
      }
      Matter.Body.setPosition(body, newPos);
    }
  }
}

export function attachMatterMouseConstraintWithRestriction(
  engine: Matter.Engine,
  canvas: HTMLCanvasElement,
  filterBody?: (body: Matter.Body) => boolean
): () => void {
  const mouse = Matter.Mouse.create(canvas);
  const mouseConstraint = Matter.MouseConstraint.create(engine, {
    mouse,
    constraint: {
      stiffness: 0.2,
      render: { visible: false },
    },
    // Optionally filter which bodies are draggable
    collisionFilter: filterBody ? undefined : undefined,
  });

  // For backward compatibility: call the exported function from the event handler
  Matter.Events.on(engine, 'beforeUpdate', () => {
    applyMouseDragRestriction(engine, mouseConstraint);
  });

  Matter.World.add(engine.world, mouseConstraint);

  // Cleanup function
  return () => {
    Matter.World.remove(engine.world, mouseConstraint);
  };
}

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
