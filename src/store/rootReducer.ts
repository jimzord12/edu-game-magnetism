import { combineReducers } from '@reduxjs/toolkit';
import magnetGameReducer from '../features/games/magnets/slices/magnetGameSlice';
import electroGameReducer from '../features/games/electroMagnets/slices/electroGameSlice';
import levelsReducer from '../features/levels/slices/levelSlice';
import playerReducer from '../features/player/slices/playerSlice'; // Example

// Combine all feature reducers here
const rootReducer = combineReducers({
  magnetGame: magnetGameReducer,
  electroGame: electroGameReducer,
  levels: levelsReducer,
  player: playerReducer,
  // Add more reducers as features grow
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
