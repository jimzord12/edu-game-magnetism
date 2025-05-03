import { Wall } from '@/models/Wall';
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
    position: Point | Matter.Vector;
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

export const isOverlappingWith = <T extends Matter.Body>(
  posOfObjectToBePlaced: {
    position: Point | Matter.Vector;
    radius: number;
  },
  arrayOfPossibleOverlappingObjects: T[]
) => {
  return arrayOfPossibleOverlappingObjects.some((object) => {
    const { position, circleRadius } = object as ReturnType<
      typeof Bodies.circle
    >;
    const dx = posOfObjectToBePlaced.position.x - position.x;
    const dy = posOfObjectToBePlaced.position.y - position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance < posOfObjectToBePlaced.radius + circleRadius!; // Check if the distance is less than the sum of the radii
  });
};

export const createBoundingWallsForCanvas = (canvas: {
  width: number;
  height: number;
}): Wall[] => {
  const { width, height } = canvas;
  const wallThickness = 10; // Adjust this value as needed

  return [
    new Wall({
      x: width / 2,
      y: wallThickness / 2,
      dimensions: { width, height: wallThickness },
    }), // Top wall
    new Wall({
      x: width / 2,
      y: height - wallThickness / 2,
      dimensions: { width, height: wallThickness },
    }), // Bottom wall
    new Wall({
      x: wallThickness / 2,
      y: height / 2,
      dimensions: { width: wallThickness, height },
    }), // Left wall
    new Wall({
      x: width - wallThickness / 2,
      y: height / 2,
      dimensions: { width: wallThickness, height },
    }), // Right wall
  ];
};
