// src/pages/HomePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';

const HomePage: React.FC = () => {
  return (
    <div>
      <h1>Welcome to Magnet Maze!</h1>
      <p>Learn about magnets by solving puzzles.</p>
      <Link to="/levels">
        <button>Start Playing</button>
      </Link>
      <Link to="/sandbox">
        <button>Sandbox</button>
      </Link>
      {/* Add links to Settings, About etc. later */}
    </div>
  );
};

export default HomePage;
