import type { AllLevels } from '@/features/levels/types';
import { useAppSelector } from '@/hooks/reduxHooks';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';
import '../styles/LevelSelectPage.css';

const LevelSelectPage: React.FC = () => {
  const { availableLevels } = useAppSelector((state) => state.levels);
  const levels: AllLevels = useMemo((): AllLevels => {
    return {
      magnet: availableLevels.magnet ?? [],
      electromagnet: availableLevels.electroMagnet ?? [],
    };
  }, [availableLevels.magnet?.length, availableLevels.electroMagnet?.length]);

  return (
    <div className="level-select-container">
      <header className="level-select-header">
        <h1>Choose Your Challenge</h1>
        <p>
          Select a level to test your understanding of magnetic forces and
          interactions
        </p>
      </header>

      <div className="categories-container">
        <div className="category-column">
          <div className="category-title">
            <h2 className="text-2xl italic text-shadow-lg/30">
              <span className="text-red-500">Mag</span>
              <span className="text-blue-500">nets</span>
            </h2>
          </div>
          <ul className="levels-list">
            {levels.magnet.map((level) => (
              <li key={level.id} className="level-item">
                <Link
                  to={`/magnetsGame/${level.id}`}
                  className="level-button magnet-level-button"
                >
                  {level.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="category-column">
          <div className="category-title">
            <h2 className="text-2xl italic text-shadow-lg/30">
              <span className="text-amber-400">Electro</span>
              <span className="text-red-500">Mag</span>
              <span className="text-blue-500">nets</span>
            </h2>
          </div>
          <ul className="levels-list">
            {levels.electromagnet.map((level) => (
              <li key={level.id} className="level-item">
                <Link
                  to={`/electromagnetsGame/${level.id}`}
                  className="level-button electromagnet-level-button"
                >
                  {level.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="navigation-footer">
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
    </div>
  );
};

export default LevelSelectPage;
