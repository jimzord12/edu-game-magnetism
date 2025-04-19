import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IGameState } from '../../types';
import { ElectroMagnet } from '@/models/ElectroMagnet';

const initialState: IGameState<'electromagnet'> & {
  selectedElectromagnet: ElectroMagnet | null;
} = {
  levelId: null,
  status: 'idle',
  ballPosition: { x: 0, y: 0 }, // Initial placeholder
  placedMagnets: [],
  elapsedTime: 0,
  selectedElectromagnet: null,
};

const electroGameSlice = createSlice({
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
    placeMagnet: (state, action: PayloadAction<ElectroMagnet>) => {
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
      state.placedMagnets = state.placedMagnets.filter(
        (m) => m.id !== action.payload
      );
      if (state.selectedElectromagnet?.id === action.payload) {
        state.selectedElectromagnet = null;
      }
    },
    toggleMagnetPolarity: (state, action: PayloadAction<number>) => {
      const idx = state.placedMagnets.findIndex((m) => m.id === action.payload);
      if (idx !== -1) {
        const old = state.placedMagnets[idx];
        // Create a new instance with toggled polarity
        const updated = new ElectroMagnet({
          ...old,
          x: old.body.position.x,
          y: old.body.position.y,
          isAttracting: !old.isAttracting,
        });
        updated.id = old.id;
        state.placedMagnets = [
          ...state.placedMagnets.slice(0, idx),
          updated,
          ...state.placedMagnets.slice(idx + 1),
        ];
      }
    },
    toggleMagnetActive: (state, action: PayloadAction<number>) => {
      const idx = state.placedMagnets.findIndex((m) => m.id === action.payload);
      if (idx !== -1) {
        const old = state.placedMagnets[idx];
        // Create a new instance with toggled isActive
        const updated = new ElectroMagnet({
          ...old,
          x: old.body.position.x,
          y: old.body.position.y,
          isActive: !old.isActive,
        });
        updated.id = old.id;
        // state.placedMagnets = [
        //   ...state.placedMagnets.slice(0, idx),
        //   updated,
        //   ...state.placedMagnets.slice(idx + 1),
        // ];
        const newState = [...state.placedMagnets];
        newState[idx] = updated;
        state.placedMagnets = newState;
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

    setSelectedElectromagnet: (
      state,
      action: PayloadAction<ElectroMagnet | null>
    ) => {
      state.selectedElectromagnet = action.payload;
    },

    clearSelectedElectromagnet: (state) => {
      state.selectedElectromagnet = null;
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
  toggleMagnetActive,
  updateBallPosition,
  updateElapsedTime,
  levelWon,
  levelLost,
  resetGame,
  setSelectedElectromagnet,
} = electroGameSlice.actions;

export default electroGameSlice.reducer;
