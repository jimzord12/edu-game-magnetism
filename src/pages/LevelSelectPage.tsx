import { ELECTRO_MAGNET_LEVELS, MAGNET_LEVELS } from '@/config/levels';
import { AllLevels } from '@/features/levels/types';
import React, { useMemo } from 'react';
import { Link } from 'react-router-dom';

const LevelSelectPage: React.FC = () => {
  const levels: AllLevels = useMemo(
    (): AllLevels => ({
      magnet: MAGNET_LEVELS,
      electromagnet: ELECTRO_MAGNET_LEVELS,
    }),
    []
  );

  return (
    <div className="flex gap-8 items-center justify-around">
      <div className="flex gap-8">
        <div>
          <h1>Magnets</h1>
          <ul>
            {levels.magnet.map((level) => {
              return (
                <li key={level.id} style={{ margin: '10px 0' }}>
                  <Link to={`/game/${level.id}`}>
                    <button style={{ minWidth: '200px', textAlign: 'left' }}>
                      {level.name}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>

        <div>
          <h1>ElectroMagnets</h1>
          <ul className="flex flex-col">
            {levels.electromagnet.map((level) => {
              return (
                <li key={level.id} style={{ margin: '10px 0' }}>
                  <Link to={`/game/${level.id}`}>
                    <button style={{ minWidth: '200px', textAlign: 'left' }}>
                      {level.name}
                    </button>
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div>
        <Link to="/">
          <button>Back to Home</button>
        </Link>
      </div>
    </div>
  );
};

export default LevelSelectPage;
