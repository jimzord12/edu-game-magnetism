// import { useEffect, useRef } from 'react';
// import Matter from 'matter-js';
// import { C } from 'vitest/dist/chunks/reporters.d.CfRkRKN2.js';

// /**
//  * Custom hook to add a MouseConstraint to a Matter.js engine that respects per-body drag restrictions.
//  *
//  * @param engine The Matter.Engine instance
//  * @param canvas The HTMLCanvasElement to bind the mouse to (from p5.js)
//  * @param filterBody Optional filter function to determine which bodies are draggable
//  * @returns The created MouseConstraint instance
//  */
// export function useMatterMouseConstraintWithRestriction(
//   engine: Matter.Engine | null,
//   canvas: HTMLCanvasElement | null,
//   filterBody?: (body: Matter.Body) => boolean
// ) {
//   const mouseConstraintRef = useRef<Matter.MouseConstraint | null>(null);

//   useEffect(() => {
//     if (!engine || !canvas) return;

//     // Create mouse and mouse constraint
//     console.log('gggggggggggggggggggggggggggggggg');
//     const mouse = Matter.Mouse.create(canvas);
//     const mouseConstraint = Matter.MouseConstraint.create(engine, {
//       mouse,
//       constraint: {
//         stiffness: 0.2,
//         render: { visible: false },
//       },
//       // Optionally filter which bodies are draggable
//       collisionFilter: filterBody ? undefined : undefined,
//     });

//     // Patch the mouseConstraint's events to restrict movement
//     Matter.Events.on(engine, 'beforeUpdate', () => {
//       const body =
//         (mouseConstraint.body as Matter.Body & {
//           restrictedMovement?: string;
//         }) || null;
//       if (body && mouseConstraint.mouse.button === 0) {
//         const restriction = body.restrictedMovement as
//           | 'horizontal'
//           | 'vertical'
//           | 'none'
//           | undefined;
//         if (restriction && restriction !== 'none') {
//           // Get the original position
//           const startPos = mouseConstraint.constraint.pointB || body.position;
//           // Get the current mouse position
//           const mousePos = mouse.position;
//           let newPos = { ...body.position };
//           if (restriction === 'horizontal') {
//             newPos = { x: mousePos.x, y: startPos.y };
//           } else if (restriction === 'vertical') {
//             newPos = { x: startPos.x, y: mousePos.y };
//           }
//           // Set the body's position directly (override normal drag)
//           Matter.Body.setPosition(body, newPos);
//         }
//       }
//     });

//     // Add to world
//     Matter.World.add(engine.world, mouseConstraint);
//     mouseConstraintRef.current = mouseConstraint;

//     // Cleanup
//     return () => {
//       Matter.World.remove(engine.world, mouseConstraint);
//       mouseConstraintRef.current = null;
//     };
//   }, [engine, canvas, filterBody]);

//   return mouseConstraintRef.current;
// }
