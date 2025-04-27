import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import {
  toggleMagnetPolarity,
  toggleMagnetActive,
  removeMagnet,
  setSelectedElectromagnet,
} from '../slices/electroGameSlice';
import { ElectroMagnet } from '@/models/ElectroMagnet';
import './ElectromagnetPanel.css';
// import useForceRerender from '@/hooks/useForceRerender';

interface ElectromagnetPanelProps {
  gameStatus: string;
  magnets: ElectroMagnet[];
}

const ElectromagnetPanel: React.FC<ElectromagnetPanelProps> = ({
  gameStatus,
  magnets: placedMagnets,
}) => {
  //   const { forceUpdate } = useForceRerender();
  const dispatch = useAppDispatch();
  const { selectedElectromagnet } = useAppSelector(
    (state) => state.electroGame
  );

  const isInteractive =
    gameStatus === 'idle' ||
    gameStatus === 'playing' ||
    gameStatus === 'paused';

  const magnets = placedMagnets.sort((a, b) => a.id - b.id);

  return (
    <div className="magnet-panel electromagnet-panel">
      <h3 className="section-title">Your Electromagnets</h3>
      {magnets.length === 0 ? (
        <div className="magnet-info">No electromagnets placed yet.</div>
      ) : (
        <ul className="magnet-list">
          {magnets.map((magnet) => (
            <li
              key={magnet.id}
              className="magnet-list-item electromagnet-list-item hover:bg-gray-300/50 px-2 py-1 rounded"
              style={{
                cursor: isInteractive ? 'pointer' : 'default',
                backgroundColor:
                  selectedElectromagnet?.id === magnet.id
                    ? 'rgba(134, 130, 121, 0.3)'
                    : '',
                borderRadius: '10px',
              }}
              onClick={() =>
                isInteractive && dispatch(setSelectedElectromagnet(magnet))
              }
            >
              <span className="magnet-id">#{magnet.id}</span>
              <span className="magnet-position">
                ({magnet.body.position.x.toFixed(0)},{' '}
                {magnet.body.position.y.toFixed(0)})
              </span>
              <label
                className="switch-label electromagnet-switch hover:bg-gray-300 px-2 py-1 rounded"
                title="ON/OFF"
                style={{ cursor: 'pointer' }}
              >
                <input
                  type="checkbox"
                  checked={magnet.isActive}
                  disabled={!isInteractive}
                  onChange={(e) => {
                    e.stopPropagation();
                    dispatch(toggleMagnetActive(magnet.id));
                    // forceUpdate();
                  }}
                />
                <span
                  className={`switch-slider${magnet.isActive ? ' active' : ''}`}
                  aria-hidden="true"
                ></span>
                <span className="switch-text" title="ON/OFF">
                  {magnet.isActive ? '🟢 ON' : '⚪ OFF'}
                </span>
              </label>
              <label
                className="switch-label electromagnet-switch hover:bg-gray-300 px-2 py-1 rounded"
                title="Polarity"
              >
                <input
                  type="checkbox"
                  checked={magnet.isAttracting}
                  disabled={!isInteractive}
                  onChange={(e) => {
                    e.stopPropagation();
                    console.log('AAAAAAA: ', placedMagnets);
                    dispatch(toggleMagnetPolarity(magnet.id));
                    // forceUpdate();
                  }}
                />
                <span
                  className={`switch-slider${
                    magnet.isAttracting ? ' attract' : ' repel'
                  }`}
                  aria-hidden="true"
                ></span>
                <span className="switch-text" title="Polarity">
                  {magnet.isAttracting ? '🧲 Attract' : '🚫 Repel'}
                </span>
              </label>
              {magnet.isRemovable && (
                <button
                  className="game-btn small-btn danger-btn"
                  disabled={!isInteractive}
                  onClick={(e) => {
                    e.stopPropagation();
                    dispatch(removeMagnet(magnet.id));
                    if (selectedElectromagnet?.id === magnet.id) {
                      dispatch(setSelectedElectromagnet(null));
                      // forceUpdate(); // Force update to re-render the list
                    }
                  }}
                  title="Remove Electromagnet"
                >
                  🗑️
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ElectromagnetPanel;
