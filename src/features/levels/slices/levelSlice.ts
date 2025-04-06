import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import {
  ILevelElectroMagnet,
  ILevelMagnet,
  ILevelProgress,
  isMagnetLevel,
} from '../types';
import { ELECTRO_MAGNET_LEVELS, MAGNET_LEVELS } from '../../../config/levels';

interface LevelsState {
  availableLevels: {
    magnet?: ILevelMagnet[];
    electroMagnet?: ILevelElectroMagnet[];
  }; // Static definitions
  levelProgress: Record<string, ILevelProgress>;
  loading: boolean;
  error: string | null;
}

const initialState: LevelsState = {
  availableLevels: {
    magnet: MAGNET_LEVELS,
    electroMagnet: ELECTRO_MAGNET_LEVELS,
  }, // Start with default levels
  levelProgress: {},
  loading: false,
  error: null,
};

const levelsSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    setLevels: (
      state,
      action: PayloadAction<(ILevelElectroMagnet | ILevelMagnet)[]>
    ) => {
      for (const level of action.payload) {
        if (isMagnetLevel(level) && state.availableLevels.magnet) {
          state.availableLevels.magnet.push(level);
          continue;
        }
        if (!isMagnetLevel(level) && state.availableLevels.electroMagnet) {
          state.availableLevels.electroMagnet.push(level);
        }
      }
    },
    setProgress: (
      state,
      action: PayloadAction<Record<string, ILevelProgress>>
    ) => {
      state.levelProgress = action.payload;
      state.loading = false;
      state.error = null;
    },
    // TODO: IMPLEMENT THIS LATER
    // updateSingleProgress: (state, action: PayloadAction<ILevelProgress>) => {
    //   state.levelProgress[action.payload.levelId] = action.payload;
    // },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add async thunks later to load progress from DB
    // Add async thunks later to potentially load level designs from DB/API
  },
});

export const {
  setLevels,
  setProgress,
  // updateSingleProgress,
  setLoading,
  setError,
} = levelsSlice.actions;
export default levelsSlice.reducer;
