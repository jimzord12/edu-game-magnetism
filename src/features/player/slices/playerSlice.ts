import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface PlayerState {
  loading: boolean;
  error: string | null;
}

const initialState: PlayerState = {
  loading: false,
  error: null,
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
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

export const { setLoading, setError } = playerSlice.actions;
export default playerSlice.reducer;
