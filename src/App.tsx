import { lazy, Suspense, useEffect, useState } from 'react';
import useDB from './hooks/useDB';
import LoadingPage from './pages/LoadingPage';
import { waitFor } from './utils/helpers';

function App() {
  const [hasDBInit, setHasDBInit] = useState(false);
  const { initializeDB } = useDB();

  useEffect(() => {
    try {
      initializeDB().then(() => {
        setHasDBInit(true);
      });
    } catch (error) {
      console.error('Error initializing database:', error);
    }
  }, []);

  const LazyAppRouter = lazy(() =>
    import('./router').then((module) => {
      // Add artificial delay only in development
      if (import.meta.env.DEV) {
        return waitFor(2000).then(() => ({ default: module.AppRouter }));
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
