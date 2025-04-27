import { lazy, Suspense, useEffect, useState } from 'react';
import useDB from './hooks/useDB';
import LoadingPage from './pages/LoadingPage';
import { waitFor } from './utils/helpers';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useAppDispatch } from './hooks/reduxHooks';
import { createNewPlayer } from './features/player/slices/playerSlice';

function App() {
  const [hasDBInit, setHasDBInit] = useState(false);
  const { initializeDB } = useDB();
  const dispatch = useAppDispatch();
  const [gamePlayers] = useLocalStorage<string>('gamePlayers', '');

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await initializeDB();

        // If there are players in local storage, ensure they exist in the database
        const playerNames = gamePlayers.split(' ').filter(Boolean);
        for (const username of playerNames) {
          try {
            await dispatch(createNewPlayer(username)).unwrap();
          } catch (error: unknown) {
            // Convert error to string safely, handling both string and Error objects
            const errorMessage =
              error instanceof Error
                ? error.message
                : typeof error === 'string'
                ? error
                : error && typeof error === 'object' && 'message' in error
                ? String(error.message)
                : 'Unknown error';

            console.log(!errorMessage.includes('UNIQUE constraint failed'));
            if (!errorMessage.includes('UNIQUE constraint failed')) {
              console.error(`Error syncing player ${username}:`, errorMessage);
            }
          }
        }
        setHasDBInit(true);
      } catch (error) {
        console.error('Error initializing application:', error);
      }
    };

    initializeApp();
  }, [initializeDB, dispatch, gamePlayers]);

  const LazyAppRouter = lazy(() =>
    import('./router').then((module) => {
      if (import.meta.env.DEV) {
        return waitFor(200).then(() => ({ default: module.AppRouter }));
      }
      return { default: module.AppRouter };
    })
  );

  return (
    <Suspense
      fallback={<LoadingPage msg="Loading/Creating SQLite3 Database" />}
    >
      {hasDBInit && <LazyAppRouter />}
    </Suspense>
  );
}

export default App;
