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
      const magnet = state.placedMagnets.find((m) => m.id === action.payload);
      if (magnet) {
        magnet.isAttracting = !magnet.isAttracting;
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
