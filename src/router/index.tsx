import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import HomePage from '../pages/HomePage';
import LevelSelectPage from '../pages/LevelSelectPage';
import GamePage from '../pages/GamePage';
import SandboxPage from '../pages/SandboxPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <HomePage />,
    // You can add layout components here if needed
  },
  {
    path: '/levels',
    element: <LevelSelectPage />,
  },
  {
    path: '/game/:levelId', // Parameter for level ID
    element: <GamePage />,
  },

  {
    path: '/sandbox', // Add the sandbox route
    element: <SandboxPage />,
  },
]);

export const AppRouter: React.FC = () => {
  return <RouterProvider router={router} />;
};
