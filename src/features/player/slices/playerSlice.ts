import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IPlayerProfile } from '../../../services/db'; // Assuming profile type from Dexie

interface PlayerState {
  profile: IPlayerProfile | null;
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  profile: null,
  loading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setProfile: (state, action: PayloadAction<IPlayerProfile>) => {
      state.profile = action.payload;
      state.loading = false;
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
    // Add reducers for updating name, settings, etc. later
    // Add async thunks for loading/saving profile from DB later
  },
});

export const { setProfile, setLoading, setError } = playerSlice.actions;
export default playerSlice.reducer;
