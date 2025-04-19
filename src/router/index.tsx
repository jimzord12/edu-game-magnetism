import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LevelSelectPage from '../pages/LevelSelectPage';
import MagnetsGamePage from '../pages/games/MagnetGamePage';
import ElectroMagnetsGamePage from '../pages/games/ElectroMagnetGamePage';
import SandboxPage from '../pages/SandboxPage';
import GameQuizPage from '../pages/GameQuizPage';
import { routePath } from './routePath';
import { PrivateRoute } from './PrivateRoute';


export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path={routePath.levelSelect}
          element={
            <PrivateRoute>
              <LevelSelectPage />
            </PrivateRoute>
          }
        />
        <Route
          path={routePath.magnetsGame}
          element={
            <PrivateRoute>
              <MagnetsGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path={routePath.electromagnetsGame}
          element={
            <PrivateRoute>
              <ElectroMagnetsGamePage />
            </PrivateRoute>
          }
        />
        <Route
          path={routePath.sandbox}
          element={
            <PrivateRoute>
              <SandboxPage />
            </PrivateRoute>
          }
        />
        <Route
          path={routePath.quiz}
          element={
            <PrivateRoute>
              <GameQuizPage />
            </PrivateRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
};
