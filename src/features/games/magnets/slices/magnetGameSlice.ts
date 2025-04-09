import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGameState } from '../../types';
import { Magnet } from '@/models/Magnet';

const initialState: IGameState<'magnet'> = {
  levelId: null,
  status: 'idle',
  ballPosition: { x: 0, y: 0 }, // Initial placeholder
  placedMagnets: [],
  elapsedTime: 0,
};

const magnetGameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    loadLevel: (state, action: PayloadAction<number>) => {
      state.levelId = action.payload;
      state.status = 'idle'; // Or 'playing' if auto-starts
      state.placedMagnets = []; // Reset magnets for the new level
      state.elapsedTime = 0;
      // Ball position will be set by the game engine based on level data
    },
    startGame: (state) => {
      if (state.levelId) {
        state.status = 'playing';
        state.elapsedTime = 0;
      }
    },
    pauseGame: (state) => {
      if (state.status === 'playing') {
        state.status = 'idle'; // Treat idle as paused for now
      }
    },
    placeMagnet: (state, action: PayloadAction<Magnet>) => {
      // Basic placement, replace if ID exists, add if new
      const existingIndex = state.placedMagnets.findIndex(
        (m) => m.id === action.payload.id
      );
      if (existingIndex > -1) {
        state.placedMagnets[existingIndex] = action.payload;
      } else {
        state.placedMagnets.push(action.payload);
      }
    },
    removeMagnet: (state, action: PayloadAction<number>) => {
      // Action payload is magnet ID
      state.placedMagnets = state.placedMagnets.filter(
        (m) => m.id !== action.payload
      );
    },
    toggleMagnetPolarity: (state, action: PayloadAction<number>) => {
      // Action payload is magnet ID
      console.log('Redux - toggleMagnetPolarity', action.payload);
      const magnetIndex = state.placedMagnets.findIndex(
        (m) => m.id === action.payload
      );

      if (magnetIndex !== -1) {
        // Create a new array with the updated magnet
        const updatedMagnets = [...state.placedMagnets];

        // Clone the magnet and toggle its polarity
        const magnet = updatedMagnets[magnetIndex];
        const updatedMagnet = new Magnet({
          x: magnet.body.position.x,
          y: magnet.body.position.y,
          isAttracting: !magnet.isAttracting,
          // Copy other properties as needed
          matterOptions: {
            isStatic: true, // Maintaining static property
          },
          strength: magnet.strength,
        });

        // Preserve the same ID for the updated magnet
        updatedMagnet.id = magnet.id;

        // Replace the magnet in the array
        updatedMagnets[magnetIndex] = updatedMagnet;

      // Update the state with the new array
        state.placedMagnets = updatedMagnets;

        console.log(
          `Redux - Magnet polarity toggled to: ${
            updatedMagnet.isAttracting ? 'Attract' : 'Repel'
          }`
        );
      }
    },
    updateBallPosition: (
      state,
      action: PayloadAction<{ x: number; y: number }>
    ) => {
      // Use sparingly - primarily for UI display if needed outside canvas
      state.ballPosition = action.payload;
    },
    updateElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsedTime = action.payload;
    },
    levelWon: (state) => {
      state.status = 'won';
    },
    levelLost: (state) => {
      // Need criteria for losing (e.g., time limit, ball out of bounds?)
      state.status = 'lost';
    },
    resetGame: () => initialState, // Reset to initial state
  },
});

export const {
  loadLevel,
  startGame,
  pauseGame,
  placeMagnet,
  removeMagnet,
  toggleMagnetPolarity,
  updateBallPosition,
  updateElapsedTime,
  levelWon,
  levelLost,
  resetGame,
} = magnetGameSlice.actions;

export default magnetGameSlice.reducer;
