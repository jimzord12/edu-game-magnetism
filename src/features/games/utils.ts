import { Bodies, Vector } from 'matter-js';

type Point = Vector; // Just for clarity, as Vector is a type from Matter.js

export const areBodiesOverlapping = (
  bodyA: Matter.Body,
  bodyB: Matter.Body
): boolean => {
  const bodyARadius = bodyA.circleRadius || 0;
  const bodyBRadius = bodyB.circleRadius || 0;
  const dx = bodyA.position.x - bodyB.position.x;
  const dy = bodyA.position.y - bodyB.position.y;
  const distance = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
  return distance < bodyARadius + bodyBRadius;
};

export const willNewMagnetOverlap = (
  newMagnet: {
    position: Point;
    radius: number;
  },
  existingMagnets: Matter.Body[]
) => {
  const { position, radius } = newMagnet;
  const newMagnetBody = Bodies.circle(position.x, position.y, radius);

  return existingMagnets.some((magnet) =>
    areBodiesOverlapping(newMagnetBody, magnet)
  );
};
