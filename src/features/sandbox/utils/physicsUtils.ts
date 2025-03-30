import Matter from 'matter-js';
import { Magnet } from '@/models/Magnet';
import { Ball } from '@/models/Ball';
import { SANDBOX_CONFIG } from '@/config/gameConfig';

/**
 * Calculates the force exerted by a single magnet on the ball
 * @param magnet - The magnet body applying the force
 * @param ball - Current position of the ball
 * @returns Force vector from this magnet to the ball
 */
export const calculateSingleMagnetForce = (
  magnet: Magnet,
  ball: Ball
): Matter.Vector => {
  const magnetPos = magnet.body.position;
  const ballPos = ball.body.position;

  // Calculate direction vector from ball to magnet
  const direction = Matter.Vector.sub(magnetPos, ballPos);

  // Calculate squared distance (optimization to avoid sqrt until needed)
  const distanceSq = Matter.Vector.magnitudeSquared(direction);

  // Pre-calculate squared distance thresholds from config
  const maxDistSq = SANDBOX_CONFIG.MAGNETS.MAX_DISTANCE ** 2;
  const minDistSq = SANDBOX_CONFIG.MAGNETS.MIN_DISTANCE ** 2;

  // Skip if too close, too far, or at same position
  if (distanceSq === 0 || distanceSq > maxDistSq || distanceSq < minDistSq) {
    return Matter.Vector.create(0, 0);
  }

  // Now calculate actual distance (sqrt of squared distance)
  const distance = Math.sqrt(distanceSq);
  // Get normalized direction vector (length = 1)
  const normalizedDirection = Matter.Vector.normalise(direction);

  // Calculate strength factor (0-1) based on distance
  // Further away = weaker force (linear falloff)
  const strengthFactor = Math.max(
    0,
    (SANDBOX_CONFIG.MAGNETS.MAX_DISTANCE - distance) /
      SANDBOX_CONFIG.MAGNETS.MAX_DISTANCE
  );

  // Calculate force magnitude using square root of strength factor
  // (Makes force falloff smoother than linear)
  let forceMagnitude =
    SANDBOX_CONFIG.MAGNETS.STRENGTH * Math.sqrt(strengthFactor);

  // Flip direction if this is a repelling magnet
  if (!magnet.isAttracting) {
    forceMagnitude *= -1;
  }

  // Return force vector (direction × magnitude)
  return Matter.Vector.mult(normalizedDirection, forceMagnitude);
};

/**
 * Calculates the net force on the ball from all magnets
 * @param ball - The ball body receiving forces
 * @param magnets - Array of all magnet bodies
 * @returns Combined force vector from all magnets
 */
export const calculateTotalForces = (
  ball: Ball,
  magnets: Magnet[]
): Matter.Vector => {
  let totalForce = Matter.Vector.create(0, 0); // Initialize zero force

  // Sum forces from all magnets
  magnets.forEach((magnet) => {
    const force = calculateSingleMagnetForce(magnet, ball);
    totalForce = Matter.Vector.add(totalForce, force);
  });

  return totalForce;
};
