import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { GameState } from '../../types';
import { Magnet } from '@/models/Magnet';
import GameEngineMagnets from '../engine/GameEngineMagnets';

interface MagnetGameState {
  levelId: number | null;
  placedMagnets: Magnet[];
  status: GameState;
  elapsedTime: number;
  selectedMagnet: Magnet | null;
}

const initialState: MagnetGameState = {
  levelId: null,
  status: 'idle',
  placedMagnets: [],
  elapsedTime: 0,
  selectedMagnet: null,
  // ballPosition: { x: 0, y: 0 }, // Initial placeholder
  // ball: null,
  // engine: null,
  // startTime: null,
  // target: null,
};

const magnetGameSlice = createSlice({
  name: 'game',
  initialState,
  reducers: {
    loadLevel: (state, action: PayloadAction<number>) => {
      console.log('⛔⛔⛔ [Redux] - loadLevel');

      // Reset everything for a new level
      state.levelId = action.payload;
      state.placedMagnets = [];
      state.status = 'idle';
      state.elapsedTime = 0;
      state.selectedMagnet = null;
      GameEngineMagnets.getInstance().cleanup(); // Cleanup previous game engine instance
    },
    startGame: (state) => {
      if (state.status === 'idle' || state.status === 'paused') {
        state.status = 'playing';
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
    // updateBallPosition: (
    //   state,
    //   action: PayloadAction<{ x: number; y: number }>
    // ) => {
    //   // Use sparingly - primarily for UI display if needed outside canvas
    //   state.ballPosition = action.payload;
    // },
    updateElapsedTime: (state, action: PayloadAction<number>) => {
      console.log('[MAGNET] - Redux - updateElapsedTime', action.payload);
      state.elapsedTime = action.payload;
    },
    levelWon: (state) => {
      state.status = 'won';
    },
    levelLost: (state) => {
      // Need criteria for losing (e.g., time limit, ball out of bounds?)
      state.status = 'lost';
    },
    resetGame: (state) => {
      // Reset the game state to initial state
      state.levelId = null;
      state.placedMagnets = [];
      state.status = 'idle';
      state.elapsedTime = 0;
      state.selectedMagnet = null;
      GameEngineMagnets.getInstance().cleanup(); // Cleanup previous game engine instance
    },

    setSelectedMagnet: (state, action: PayloadAction<Magnet | null>) => {
      state.selectedMagnet = action.payload;
    },
    clearSelectedMagnet: (state) => {
      state.selectedMagnet = null;
    },
  },
});

export const {
  loadLevel,
  startGame,
  pauseGame,
  placeMagnet,
  removeMagnet,
  toggleMagnetPolarity,
  // updateBallPosition,
  updateElapsedTime,
  levelWon,
  levelLost,
  resetGame,
  setSelectedMagnet,
} = magnetGameSlice.actions;

export default magnetGameSlice.reducer;
