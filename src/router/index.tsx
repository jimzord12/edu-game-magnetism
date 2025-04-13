import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LevelSelectPage from '../pages/LevelSelectPage';
import GamePage from '../pages/games/MagnetGamePage';
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
          path={routePath.game}
          element={
            <PrivateRoute>
              <GamePage />
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
