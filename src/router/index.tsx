import { HashRouter, Routes, Route } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LevelSelectPage from '../pages/LevelSelectPage';
import GamePage from '../pages/games/MagnetGamePage';
import SandboxPage from '../pages/SandboxPage';
import { routePath } from './routePath';

export const AppRouter: React.FC = () => {
  return (
    <HashRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path={routePath.levelSelect} element={<LevelSelectPage />} />
        <Route path={routePath.game} element={<GamePage />} />
        <Route path={routePath.sandbox} element={<SandboxPage />} />
      </Routes>
    </HashRouter>
  );
};
