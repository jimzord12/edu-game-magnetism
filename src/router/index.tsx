import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LevelSelectPage from '../pages/LevelSelectPage';
import GamePage from '../pages/GamePage';
import SandboxPage from '../pages/SandboxPage';
import { routePath } from './routePath';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: routePath.levelSelect,
    element: <LevelSelectPage />,
  },
  {
    path: routePath.game,
    element: <GamePage />,
  },

  {
    path: routePath.sandbox,
    element: <SandboxPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
