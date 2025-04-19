import React from 'react';
import { useAppDispatch, useAppSelector } from '../../../../hooks/reduxHooks';
import {
  toggleMagnetPolarity,
  removeMagnet,
  setSelectedMagnet,
} from '../slices/magnetGameSlice';
import { Magnet } from '@/models/Magnet';
import '../../electroMagnets/components/ElectromagnetPanel.css';

interface MagnetPanelProps {
  gameStatus: string;
  magnets: Magnet[];
}

const MagnetPanel: React.FC<MagnetPanelProps> = ({ gameStatus, magnets }) => {
  const dispatch = useAppDispatch();
  const selectedMagnet = useAppSelector(
    (state) => state.magnetGame.selectedMagnet
  );
  const isInteractive = gameStatus === 'idle';

  return (
    <div className="magnet-panel electromagnet-panel">
      <h3 className="section-title">Your Magnets</h3>
      {magnets.length === 0 ? (
        <div className="magnet-info">No magnets placed yet.</div>
      ) : (
        <ul className="magnet-list">
          {magnets.map((magnet) => (
            <li
              key={magnet.id}
              className={`magnet-list-item electromagnet-list-item${
                selectedMagnet?.id === magnet.id ? ' selected' : ''
              }`}
              style={{ cursor: isInteractive ? 'pointer' : 'default' }}
              onClick={() =>
                isInteractive && dispatch(setSelectedMagnet(magnet))
              }
            >
              <span className="magnet-id">#{magnet.id}</span>
              <span className="magnet-position">
                ({magnet.body.position.x.toFixed(0)},{' '}
                {magnet.body.position.y.toFixed(0)})
              </span>
              <label className="switch-label electromagnet-switch">
                <input
                  type="checkbox"
                  checked={magnet.isAttracting}
                  disabled={!isInteractive}
                  onChange={(e) => {
                    e.stopPropagation();
                    dispatch(toggleMagnetPolarity(magnet.id));
                  }}
                />
                <span
                  className={`switch-slider${
                    magnet.isAttracting ? ' attract' : ' repel'
                  }`}
                ></span>
                <span className="switch-text" title="Polarity">
                  {magnet.isAttracting ? '🧲 Attract' : '🚫 Repel'}
                </span>
              </label>
              <button
                className="game-btn small-btn danger-btn"
                disabled={!isInteractive}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeMagnet(magnet.id));
                  if (selectedMagnet?.id === magnet.id)
                    dispatch(setSelectedMagnet(null));
                }}
                title="Remove Magnet"
              >
                🗑️
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MagnetPanel;
