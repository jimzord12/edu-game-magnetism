import React from 'react';
import { useAppDispatch } from '../../../../hooks/reduxHooks';
import { toggleMagnetPolarity, removeMagnet } from '../slices/magnetGameSlice';
import { Magnet } from '@/models/Magnet';

interface MagnetPanelProps {
  gameStatus: string;
  magnets: Magnet[];
  selectedMagnetId: number | null;
  onSelect: (magnet: Magnet | null) => void;
}

const MagnetPanel: React.FC<MagnetPanelProps> = ({
  gameStatus,
  magnets,
  selectedMagnetId,
  onSelect,
}) => {
  const dispatch = useAppDispatch();
  const isIdle = gameStatus === 'idle';
  const isDisabled = gameStatus !== 'idle';

  return (
    <div className="magnet-panel">
      <h3 className="section-title">Your Magnets</h3>
      {magnets.length === 0 ? (
        <div className="magnet-info">No magnets placed yet.</div>
      ) : (
        <ul className="magnet-list">
          {magnets.map((magnet) => (
            <li
              key={magnet.id}
              className={`magnet-list-item${
                selectedMagnetId === magnet.id ? ' selected' : ''
              }`}
              onClick={() => isIdle && onSelect(magnet)}
              style={{ cursor: isIdle ? 'pointer' : 'default' }}
            >
              <span className="magnet-id">#{magnet.id}</span>
              <span
                className={`polarity-badge ${
                  magnet.isAttracting ? 'attract-badge' : 'repel-badge'
                }`}
              >
                {magnet.isAttracting ? 'Attract' : 'Repel'}
              </span>
              <span className="magnet-position">
                ({magnet.body.position.x.toFixed(0)},{' '}
                {magnet.body.position.y.toFixed(0)})
              </span>
              <button
                className="game-btn small-btn"
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(toggleMagnetPolarity(magnet.id));
                }}
                title="Toggle Polarity"
              >
                🔄
              </button>
              <button
                className="game-btn small-btn danger-btn"
                disabled={isDisabled}
                onClick={(e) => {
                  e.stopPropagation();
                  dispatch(removeMagnet(magnet.id));
                  if (selectedMagnetId === magnet.id) onSelect(null);
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
