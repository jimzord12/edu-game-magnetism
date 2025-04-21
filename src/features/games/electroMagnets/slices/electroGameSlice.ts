import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ElectroMagnet } from '@/models/ElectroMagnet';
import GameEngine from '../engine/GameEngine';
interface ElectroGameState {
  levelId: number | null;
  placedMagnets: ElectroMagnet[];
  status: 'idle' | 'playing' | 'paused' | 'won' | 'lost';
  elapsedTime: number;
  selectedElectromagnet: ElectroMagnet | null;
}

const initialState: ElectroGameState = {
  levelId: null,
  placedMagnets: [],
  status: 'idle',
  elapsedTime: 0,
  selectedElectromagnet: null,
};

const electroGameSlice = createSlice({
  name: 'electroGame',
  initialState,
  reducers: {
    loadLevel: (state, action: PayloadAction<number>) => {
      // Reset everything for a new level
      state.levelId = action.payload;
      state.placedMagnets = [];
      state.status = 'idle';
      state.elapsedTime = 0;
      state.selectedElectromagnet = null;
      GameEngine.getInstance().cleanup(); // Cleanup previous game engine instance
    },
    startGame: (state) => {
      // Start the game (if in idle or paused state)
      if (state.status === 'idle' || state.status === 'paused') {
        state.status = 'playing';
      }
    },
    pauseGame: (state) => {
      // Pause the game (if currently playing)
      if (state.status === 'playing') {
        state.status = 'paused';
      }
    },
    resumeGame: (state) => {
      // Resume the game (if currently paused)
      if (state.status === 'paused') {
        state.status = 'playing';
      }
    },
    toggleGamePause: (state) => {
      // Toggle between playing and paused
      if (state.status === 'playing') {
        state.status = 'paused';
      } else if (state.status === 'paused') {
        state.status = 'playing';
      }
    },
    levelWon: (state) => {
      state.status = 'won';
    },
    levelLost: (state) => {
      state.status = 'lost';
    },
    placeMagnet: (state, action: PayloadAction<ElectroMagnet>) => {
      state.placedMagnets.push(action.payload);
    },
    removeMagnet: (state, action: PayloadAction<number>) => {
      state.placedMagnets = state.placedMagnets.filter(
        (m) => m.id !== action.payload
      );
      if (state.selectedElectromagnet?.id === action.payload) {
        state.selectedElectromagnet = null;
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
        state.placedMagnets = [
          ...state.placedMagnets.slice(0, idx),
          updated,
          ...state.placedMagnets.slice(idx + 1),
        ];

        // Update selected magnet if needed
        if (state.selectedElectromagnet?.id === action.payload) {
          state.selectedElectromagnet = updated;
        }
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

        // Update selected magnet if needed
        if (state.selectedElectromagnet?.id === action.payload) {
          state.selectedElectromagnet = updated;
        }
      }
    },
    updateMagnetStrength: (
      state,
      action: PayloadAction<{ id: number; strength: number }>
    ) => {
      const { id, strength } = action.payload;
      const idx = state.placedMagnets.findIndex((m) => m.id === id);
      if (idx !== -1) {
        const old = state.placedMagnets[idx];
        const updated = new ElectroMagnet({
          ...old,
          x: old.body.position.x,
          y: old.body.position.y,
        });
        updated.id = old.id;
        updated.updateStrength(strength);
        state.placedMagnets = [
          ...state.placedMagnets.slice(0, idx),
          updated,
          ...state.placedMagnets.slice(idx + 1),
        ];

        // Update selected magnet if needed
        if (state.selectedElectromagnet?.id === id) {
          state.selectedElectromagnet = updated;
        }
      }
    },
    setSelectedElectromagnet: (
      state,
      action: PayloadAction<ElectroMagnet | null>
    ) => {
      state.selectedElectromagnet = action.payload;
    },
    updateElapsedTime: (state, action: PayloadAction<number>) => {
      state.elapsedTime = action.payload;
    },
  },
});

export const {
  loadLevel,
  startGame,
  pauseGame,
  resumeGame,
  toggleGamePause,
  levelWon,
  levelLost,
  placeMagnet,
  removeMagnet,
  toggleMagnetActive,
  toggleMagnetPolarity,
  updateMagnetStrength,
  setSelectedElectromagnet,
  updateElapsedTime,
} = electroGameSlice.actions;

export default electroGameSlice.reducer;
