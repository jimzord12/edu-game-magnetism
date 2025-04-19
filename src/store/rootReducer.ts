import { combineReducers } from '@reduxjs/toolkit';
import magnetGameReducer from '../features/games/magnets/slices/magnetGameSlice';
import electroGameReducer from '../features/games/electroMagnets/slices/electroGameSlice';
import levelsReducer from '../features/levels/slices/levelSlice';
import playerReducer from '../features/player/slices/playerSlice';
import gameQuizReducer from '../features/gameQuiz/slices/gameQuizSlice';

// Combine all feature reducers here
const rootReducer = combineReducers({
  magnetGame: magnetGameReducer,
  electroGame: electroGameReducer,
  levels: levelsReducer,
  player: playerReducer,
  gameQuiz: gameQuizReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
