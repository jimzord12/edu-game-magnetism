import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ElectroMagnet } from '@/models/ElectroMagnet';
import GameEngine from '../engine/GameEngineElectro';
import { GameState } from '../../types';
interface ElectroGameState {
  levelId: number | null;
  placedMagnets: Set<ElectroMagnet>;
  status: GameState;
  elapsedTime: number;
  selectedElectromagnet: ElectroMagnet | null;
}

const initialState: ElectroGameState = {
  levelId: null,
  placedMagnets: new Set<ElectroMagnet>(),
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
      state.placedMagnets = new Set<ElectroMagnet>();
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
      if (!state.placedMagnets.has(action.payload)) {
        console.log('🐦🚀 Placing magnet: ', action.payload);
        state.placedMagnets.add(action.payload);
      }
    },
    removeMagnet: (state, action: PayloadAction<number>) => {
      const newPlacedMagnets = Array.from(state.placedMagnets).filter(
        (m) => m.id !== action.payload
      );
      state.placedMagnets = new Set(newPlacedMagnets);

      if (state.selectedElectromagnet?.id === action.payload) {
        state.selectedElectromagnet = null;
      }
    },
    toggleMagnetActive: (state, action: PayloadAction<number>) => {
      let magnets = Array.from(state.placedMagnets);
      const idx = magnets.findIndex((m) => m.id === action.payload);
      if (idx !== -1) {
        const old = magnets[idx];
        // Create a new instance with toggled isActive
        const updated = new ElectroMagnet({
          ...old,
          x: old.body.position.x,
          y: old.body.position.y,
          isActive: !old.isActive,
          matterOptions: {
            isStatic: old.body.isStatic,
            isSensor: old.body.isSensor,
          },
        });
        updated.id = old.id;
        console.log('🐦🚀 Toggling magnet active: ', old.id);
        magnets = [
          ...magnets.slice(0, idx),
          updated,
          ...magnets.slice(idx + 1),
        ];

        state.placedMagnets = new Set(magnets);

        // Update selected magnet if needed
        if (state.selectedElectromagnet?.id === action.payload) {
          state.selectedElectromagnet = updated;
        }
      }
    },
    toggleMagnetPolarity: (state, action: PayloadAction<number>) => {
      let magnets = Array.from(state.placedMagnets);

      const idx = magnets.findIndex((m) => m.id === action.payload);
      if (idx !== -1) {
        const old = magnets[idx];
        // Create a new instance with toggled polarity
        const updated = new ElectroMagnet({
          ...old,
          x: old.body.position.x,
          y: old.body.position.y,
          isAttracting: !old.isAttracting,
        });
        updated.id = old.id;
        magnets = [
          ...magnets.slice(0, idx),
          updated,
          ...magnets.slice(idx + 1),
        ];

        state.placedMagnets = new Set(magnets);

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
      let magnets = Array.from(state.placedMagnets);
      const idx = magnets.findIndex((m) => m.id === id);
      if (idx !== -1) {
        const old = magnets[idx];
        const updated = new ElectroMagnet({
          ...old,
          x: old.body.position.x,
          y: old.body.position.y,
        });
        updated.id = old.id;
        updated.updateStrength(strength);
        magnets = [
          ...magnets.slice(0, idx),
          updated,
          ...magnets.slice(idx + 1),
        ];

        state.placedMagnets = new Set(magnets);

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
    resetGame: (state) => {
      // Reset the game state to initial state
      state.levelId = null;
      state.placedMagnets = new Set<ElectroMagnet>();
      state.status = 'idle';
      state.elapsedTime = 0;
      state.selectedElectromagnet = null;
      GameEngine.getInstance().cleanup(); // Cleanup previous game engine instance
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
  resetGame,
} = electroGameSlice.actions;

export default electroGameSlice.reducer;
