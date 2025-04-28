import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { PlayerService } from '../../../db/services/player.service';
import { db } from '../../../db/client';

interface PlayerState {
  currentPlayer: {
    id: number;
    username: string;
    gamesPlayed: number;
  } | null;
  loading: boolean;
  error: string | null;
}

const testingMode = true;

const initialState: PlayerState = {
  currentPlayer: testingMode
    ? {
        id: 1,
        username: 'testUser',
        gamesPlayed: 0,
      }
    : null,
  loading: false,
  error: null,
};

const playerService = new PlayerService(db);

// Async thunks
export const loginPlayer = createAsyncThunk(
  'player/login',
  async (username: string) => {
    const player = await playerService.getPlayerByUsername(username);
    if (!player) {
      throw new Error('Player not found');
    }
    return {
      id: player.id,
      username: player.name,
      gamesPlayed: player.gamesPlayed,
    };
  }
);

export const createNewPlayer = createAsyncThunk(
  'player/create',
  async (username: string, { rejectWithValue }) => {
    try {
      const player = await playerService.createPlayer({
        name: username,
        age: 0, // Age is required by schema but not used in UI
        gamesPlayed: 0,
      });

      return {
        id: player.id,
        username: player.name,
        gamesPlayed: player.gamesPlayed,
      };
    } catch (error) {
      // Ensure we always return an Error object with a message
      if (error instanceof Error) {
        return rejectWithValue(error.message);
      }
      // If it's not an Error instance, create one with a generic message
      return rejectWithValue('Failed to create player');
    }
  }
);

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    logout: (state) => {
      state.currentPlayer = null;
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginPlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginPlayer.fulfilled, (state, action) => {
        state.currentPlayer = action.payload;
        state.loading = false;
      })
      .addCase(loginPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to login';
      })
      // Create new player
      .addCase(createNewPlayer.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createNewPlayer.fulfilled, (state, action) => {
        state.currentPlayer = action.payload;
        state.loading = false;
      })
      .addCase(createNewPlayer.rejected, (state, action) => {
        state.loading = false;
        state.error = (action.payload as string) || 'Failed to create player';
      });
  },
});

export const { logout, clearError } = playerSlice.actions;
export default playerSlice.reducer;
