import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ILevelData } from '../../game/types'; // Re-use game level type
import { ILevelProgress } from '../../../services/db'; // Re-use Dexie progress type
import { DEFAULT_LEVELS } from '../../../config/levels';

interface LevelsState {
  availableLevels: ILevelData[]; // Static definitions
  levelProgress: Record<string, ILevelProgress>; // Progress keyed by levelId
  loading: boolean;
  error: string | null;
}

const initialState: LevelsState = {
  availableLevels: DEFAULT_LEVELS, // Start with default levels
  levelProgress: {},
  loading: false,
  error: null,
};

const levelsSlice = createSlice({
  name: 'levels',
  initialState,
  reducers: {
    setLevels: (state, action: PayloadAction<ILevelData[]>) => {
      state.availableLevels = action.payload;
    },
    setProgress: (
      state,
      action: PayloadAction<Record<string, ILevelProgress>>
    ) => {
      state.levelProgress = action.payload;
      state.loading = false;
      state.error = null;
    },
    updateSingleProgress: (state, action: PayloadAction<ILevelProgress>) => {
      state.levelProgress[action.payload.levelId] = action.payload;
    },
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
  updateSingleProgress,
  setLoading,
  setError,
} = levelsSlice.actions;
export default levelsSlice.reducer;
