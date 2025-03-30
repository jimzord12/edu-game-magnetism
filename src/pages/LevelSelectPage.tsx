import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { DEFAULT_LEVELS } from '../config/levels';
import { ILevelData } from '../features/game/types';
import { getAllLevelProgress, ILevelProgress } from '../services/db';

const LevelSelectPage: React.FC = () => {
  const [levels] = useState<ILevelData[]>(DEFAULT_LEVELS); // Load static levels for now
  const [progress, setProgress] = useState<Record<string, ILevelProgress>>({});

  useEffect(() => {
    getAllLevelProgress().then((allProgress) => {
      const progressMap = allProgress.reduce((acc, p) => {
        acc[p.levelId] = p;
        return acc;
      }, {} as Record<string, ILevelProgress>);
      setProgress(progressMap);
    });
  }, []);

  return (
    <div>
      <h1>Select a Level</h1>
      <ul>
        {levels.map((level) => {
          const levelProgress = progress[level.id];
          const isCompleted = levelProgress?.completed || false;
          return (
            <li key={level.id} style={{ margin: '10px 0' }}>
              <Link to={`/game/${level.id}`}>
                <button style={{ minWidth: '200px', textAlign: 'left' }}>
                  {level.name} {isCompleted ? '✅' : ''}
                  {levelProgress?.bestTime &&
                    ` (Best: ${levelProgress.bestTime.toFixed(2)}s)`}
                </button>
              </Link>
            </li>
          );
        })}
      </ul>
      <Link to="/">
        <button>Back to Home</button>
      </Link>
    </div>
  );
};

export default LevelSelectPage;
