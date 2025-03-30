import { configureStore } from '@reduxjs/toolkit';
import rootReducer from './rootReducer';
// import { logger } from 'redux-logger'; // Optional: for debugging

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // Might need to disable serializableCheck for things like Matter.js bodies
      // if you were to ever put them in state (which you shouldn't!)
      serializableCheck: false, // Use cautiously
      immutableCheck: true, // Helps catch state mutations
    }),
  // .concat(logger), // Optional: Add logger middleware
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
