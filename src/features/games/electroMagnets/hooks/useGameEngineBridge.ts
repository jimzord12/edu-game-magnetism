// import { useEffect, useRef } from 'react';
// import { useAppDispatch, useAppSelector } from '@/hooks/reduxHooks';
// import GameEngineElectro from '../engine/GameEngineElectro';
// import { ILevel } from '@/features/levels/types';
// import {
//   levelLost,
//   levelWon,
//   placeMagnet,
//   updateElapsedTime,
// } from '../slices/electroGameSlice';
// import { attachMatterMouseConstraintWithRestriction } from '@/utils/attachMatterMouseConstraintWithRestriction';
// import { OBJECT_TYPES, SANDBOX_CONFIG } from '@/config/gameConfig';
// import { ElectroMagnet } from '@/models/ElectroMagnet';

// /**
//  * A hook that interfaces with the GameEngine singleton
//  * This connects the persistent game engine to React components
//  */
// export const useGameEngineBridge = (
//   levelData: ILevel<'electromagnet'> | null,
//   containerRef: React.RefObject<HTMLDivElement | null>
// ) => {
//   const gameEngine = GameEngineElectro.getInstance();
//   const dispatch = useAppDispatch();
//   const gameTimerRef = useRef<number | null>(null);
//   const pausedTimeRef = useRef<number | null>(null);
//   const mouseConstraintCleanupRef = useRef<null | (() => void)>(null);

//   const onPlaceMagnet = (x: number, y: number) => {
//     const newElectroMagnet = new ElectroMagnet({
//       x,
//       y,
//       isAttracting: true,

//       matterOptions: {
//         isStatic: false,
//         isSensor: false, // It allows the particualar games' magnets to be sensors or to have physical bodies
//         // isSensor: levelData?.magnetsOnlySensors, // It allows the particualar games' magnets to be sensors or to have physical bodies
//         collisionFilter: {
//           category: SANDBOX_CONFIG.MOUSE.COLLISION_CATEGORY, // <--- whatever category your magnets use
//           mask: SANDBOX_CONFIG.MOUSE.COLLISION_MASK, // <--- who they collide with
//         },
//       },
//     });
//     dispatch(placeMagnet(newElectroMagnet));
//   };

//   const handleUpdateTime = (time: number) => {
//     if (gameEngine.engine) {
//       dispatch(updateElapsedTime(time));
//     }
//   };

//   // Get Redux state
//   const { placedMagnets: magnets, status: gameStatus } = useAppSelector(
//     (state) => state.electroGame
//   );

//   // Attach mouse constraint with drag restriction (non-React version)
//   // useEffect(() => {
//   //   if (!gameEngine.engine) return;
//   //   const canvasContainer = gameEngine.containerElement; // This exists and returns the canvas element ✅
//   //   if (!canvasContainer) return;
//   //   // Clean up previous constraint if any
//   //   if (mouseConstraintCleanupRef.current) {
//   //     mouseConstraintCleanupRef.current();
//   //     mouseConstraintCleanupRef.current = null;
//   //   }
//   //   const { MAGNET, MAGNET_ATTRACT, MAGNET_REPEL } = OBJECT_TYPES;
//   //   // Patch: get the mouseConstraint from the utility and set it on the game engine
//   //   let mouseConstraint: Matter.MouseConstraint | null = null;
//   //   const cleanup = attachMatterMouseConstraintWithRestriction(
//   //     gameEngine.engine,
//   //     canvas,
//   //     (body) =>
//   //       body.label === MAGNET ||
//   //       body.label === MAGNET_ATTRACT ||
//   //       body.label === MAGNET_REPEL
//   //   );
//   //   // Try to find the mouseConstraint in the engine's world
//   //   const allConstraints = (gameEngine.engine as any)?.world?.constraints || [];
//   //   mouseConstraint = allConstraints.find((c: any) => c.mouse);
//   //   if (mouseConstraint) {
//   //     gameEngine.setMouseConstraint(mouseConstraint);
//   //   }
//   //   mouseConstraintCleanupRef.current = cleanup;
//   //   return () => {
//   //     if (mouseConstraintCleanupRef.current) {
//   //       mouseConstraintCleanupRef.current();
//   //       mouseConstraintCleanupRef.current = null;
//   //     }
//   //     gameEngine.setMouseConstraint(null);
//   //   };
//   // }, [gameEngine.engine, gameEngine.getCanvasElement, magnets]);

//   // Initialize game engine when level changes
//   useEffect(() => {
//     if (!levelData || !containerRef.current) return;

//     // Initialize game engine with level data
//     gameEngine.initialize(
//       levelData,
//       containerRef.current,
//       onPlaceMagnet,
//       handleUpdateTime
//     );

//     if (levelData.electromagnets?.length > 0) {
//       // Add magnets to the game engine
//       levelData.electromagnets.forEach((magnet) => {
//         dispatch(placeMagnet(magnet));
//       });
//     }

//     // Set up event listeners
//     const unsubscribeWin = gameEngine.onWin(() => {
//       dispatch(levelWon());
//     });
//     const unsubscribeLose = gameEngine.onLose(() => {
//       dispatch(levelLost());
//     });

//     return () => {
//       // Cleanup event listeners
//       unsubscribeWin();
//       unsubscribeLose();

//       // Stop game loop if it's running
//       if (gameTimerRef.current) {
//         cancelAnimationFrame(gameTimerRef.current);
//         gameTimerRef.current = null;
//       }
//     };
//   }, [levelData, containerRef]);

//   useEffect(() => {
//     if (!levelData || !containerRef.current) return;

//     if (gameStatus === 'idle' && gameEngine.engine === null) {
//       gameEngine.initialize(levelData, containerRef.current);
//     }
//   }, [gameStatus, levelData, containerRef]);

//   // Update magnets in the physics world when they change
//   useEffect(() => {
//     if (!magnets) return;

//     // Update magnets in the physics engine
//     gameEngine.updateMagnets(Array.from(magnets));

//     // Ensure restrictedMovement is set on the Matter.js body for each magnet
//     // Array.from(magnets).forEach((magnet) => {
//     //   if (magnet.body) {
//     //     magnet.body.restrictedMovement = magnet?.restrictedMovement || 'none';
//     //   }
//     // });
//   }, [magnets]);

//   // Handle game status changes (play, pause, etc.)
//   useEffect(() => {
//     // // Stop any existing game loop
//     // if (gameTimerRef.current) {
//     //   cancelAnimationFrame(gameTimerRef.current);
//     //   gameTimerRef.current = null;
//     // }

//     // Sync game engine status with Redux status
//     gameEngine.setGameStatus(gameStatus);

//     if (gameStatus === 'playing') {
//       // Start game loop
//       const gameLoop = () => {
//         console.log('🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀🚀');

//         // Update physics
//         gameEngine.update();

//         // Apply magnetic forces
//         gameEngine.applyMagneticForces(Array.from(magnets));

//         // Update elapsed time in Redux
//         dispatch(updateElapsedTime(gameEngine.getElapsedTime()));

//         // Continue loop
//         gameTimerRef.current = requestAnimationFrame(gameLoop);
//       };

//       // Start loop
//       gameTimerRef.current = requestAnimationFrame(gameLoop);

//       // Clear paused time
//       pausedTimeRef.current = null;
//     } else if (gameStatus === 'paused') {
//       // Store the current time when paused
//       pausedTimeRef.current = Date.now();
//     } else if (gameStatus === 'idle') {
//       // Reset ball position when returning to idle
//       gameEngine.resetBall();
//       pausedTimeRef.current = null;
//     } else if (gameStatus === 'won' || gameStatus === 'lost') {
//       // Game over states - no need to reset yet
//       pausedTimeRef.current = null;
//     }

//     return () => {
//       if (gameTimerRef.current) {
//         cancelAnimationFrame(gameTimerRef.current);
//         gameTimerRef.current = null;
//       }
//     };
//   }, [gameStatus, magnets, dispatch]);

//   return {
//     resetBall: () => gameEngine.resetBall(),
//     getEngine: () => gameEngine,
//     // recreateGameInstance,
//   };
// };
export {};
