import { combineReducers } from '@reduxjs/toolkit';
import gameReducer from '../features/game/slices/gameSlice';
import levelsReducer from '../features/levels/slices/levelSlice';
import playerReducer from '../features/player/slices/playerSlice'; // Example

// Combine all feature reducers here
const rootReducer = combineReducers({
  game: gameReducer,
  levels: levelsReducer,
  player: playerReducer,
  // Add more reducers as features grow
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
