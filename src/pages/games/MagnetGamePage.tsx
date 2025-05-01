import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import GameCanvas from '../../features/games/magnets/components/MagnetGameCanvas';
import MagnetPanel from '../../features/games/magnets/components/MagnetPanel';
import { motion } from 'motion/react';
import {
  loadLevel,
  startGame,
  pauseGame,
  resetGame,
  setSelectedMagnet,
} from '../../features/games/magnets/slices/magnetGameSlice';

import { ILevel, ILevelMagnet } from '@/features/levels/types';
import { getMagnetLevels } from '@/config/levels';
import { useUnmountEffect } from '@/hooks/useUnmountEffect';
import '../../styles/MagnetGamePage.css';

// ---- Utility Functions

const findLevelById = (id: number): ILevel<'magnet'> | null => {
  return getMagnetLevels().find((level) => level.id === id) || null;
};

// const findMagnetById = (id: number, magnets: Magnet[]): Magnet | null => {
//   return magnets.find((m) => m.id === id) || null;
// };

const getTotalPermittedMagnets = (levelData: ILevel<'magnet'>) =>
  levelData.availableMagnets;
// levelData.availableMagnets.attract + levelData.availableMagnets.repel;

const GamePage: React.FC = () => {
  const { levelId: levelIdStr } = useParams<{ levelId: string }>();
  const levelId = levelIdStr ? parseInt(levelIdStr) : null;
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    status: gameStatus,
    levelId: currentLevelId,
    placedMagnets,
    elapsedTime,
    selectedMagnet,
  } = useAppSelector((state) => state.magnetGame);
  const [currentLevelData, setCurrentLevelData] = useState<ILevelMagnet | null>(
    null
  );
  // const [selectedMagnet, setSelectedMagnet] = useState<Magnet | null>(null);

  useEffect(() => {
    if (levelId) {
      const levelData = findLevelById(levelId);
      if (levelData) {
        setCurrentLevelData(levelData);
        if (levelId !== currentLevelId) {
          dispatch(loadLevel(levelId));
        }
      } else {
        console.error(`Level with id ${levelId} not found.`);
        navigate('/levels');
      }
    } else {
      navigate('/levels');
    }
  }, [levelId, dispatch, navigate, currentLevelId]);

  useUnmountEffect(() => {
    dispatch(resetGame());
  });

  useEffect(() => {
    if (gameStatus === 'won' && currentLevelId) {
      console.log(
        `Level ${currentLevelId} completed! Time: ${elapsedTime.toFixed(2)}s`
      );
    }
  }, [gameStatus, currentLevelId, elapsedTime, dispatch]);

  const handleStartPause = () => {
    if (gameStatus === 'playing') {
      dispatch(pauseGame());
    } else if (gameStatus === 'idle' && currentLevelData) {
      if (placedMagnets.length >= currentLevelData.minMagnetsToStart) {
        dispatch(startGame());
      } else {
        alert(
          `Place at least ${currentLevelData.minMagnetsToStart} magnets to start!`
        );
      }
    } else if (gameStatus === 'won' || gameStatus === 'lost') {
      if (levelId) {
        dispatch(loadLevel(levelId));
      }
    }
  };

  const handleReset = () => {
    if (levelId) {
      dispatch(loadLevel(levelId));
      dispatch(setSelectedMagnet(null));
    }
  };

  const handleLevelSelect = () => {
    navigate('/levels');
  };

  // const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
  //   if (gameStatus !== 'idle' || !currentLevelData) return;

  //   const canvasRect = event.currentTarget.getBoundingClientRect();
  //   const x = event.clientX - canvasRect.left;
  //   const y = event.clientY - canvasRect.top;

  //   const margin = 20;
  //   if (
  //     x < margin ||
  //     x > currentLevelData.canvasSize.width - margin ||
  //     y < margin ||
  //     y > currentLevelData.canvasSize.height - margin
  //   ) {
  //     console.log('Cannot place magnet near border.');
  //     return;
  //   }

  //   const permittedNumOfMagnets = currentLevelData.availableMagnets;
  //   // currentLevelData.availableMagnets.attract +
  //   // currentLevelData.availableMagnets.repel;

  //   if (placedMagnets.length < permittedNumOfMagnets) {
  //     const newMagnet = new Magnet({
  //       x,
  //       y,
  //       isAttracting: true,
  //     });
  //     dispatch(placeMagnet(newMagnet));
  //     dispatch(setSelectedMagnet(newMagnet));
  //   } else {
  //     alert(`You can only place ${currentLevelData.availableMagnets} magnets.`);
  //   }
  // };

  // const handleMagnetClick = (event: React.MouseEvent, Magnet: Magnet) => {
  //   event.stopPropagation();
  //   if (gameStatus !== 'idle') return;

  //   const magnet = findMagnetById(Magnet.id, placedMagnets);
  //   if (!magnet) return;
  //   dispatch(setSelectedMagnet(magnet));
  // };

  if (!currentLevelData) {
    return (
      <div className="game-page">
        <div className="loading-spinner">Loading Level...</div>
      </div>
    );
  }

  return (
    <div className="game-page">
      <header className="game-header">
        <h1 className="game-title">
          <span className="text-red-500">Mag</span>
          <span className="text-blue-500">net Games: </span>
          {currentLevelData.name}
        </h1>
        <p className="game-subtitle">
          Place magnets strategically to guide the ball to its target
        </p>
      </header>

      <div className="game-area">
        <motion.div
          className="game-controls"
          layout
          transition={{ duration: 0.3 }}
        >
          <div className="control-section">
            <h3 className="section-title">Game Controls</h3>
            <div className="button-group">
              <button
                className={`game-btn primary-btn ${
                  placedMagnets.length < currentLevelData.minMagnetsToStart &&
                  'opacity-50 cursor-not-allowed'
                }`}
                onClick={handleStartPause}
                disabled={
                  !levelId ||
                  (gameStatus === 'idle' &&
                    placedMagnets.length < currentLevelData.minMagnetsToStart)
                }
              >
                {gameStatus === 'playing'
                  ? '⏸️ Pause'
                  : gameStatus === 'won' || gameStatus === 'lost'
                  ? '🔄 Restart'
                  : '▶️ Start'}
              </button>
              <button
                className="game-btn secondary-btn"
                onClick={handleReset}
                disabled={gameStatus === 'playing'}
              >
                🔄 Reset
              </button>
            </div>
            <button
              className="game-btn secondary-btn w-full"
              onClick={handleLevelSelect}
            >
              📋 Level Select
            </button>
          </div>

          <div className="control-section">
            <h3 className="section-title">Game Stats</h3>
            <div className="game-stats">
              <div className="stat-item">
                <span>Status:</span>
                <span className={`status-badge status-${gameStatus}`}>
                  {gameStatus}
                </span>
              </div>
              <div className="stat-item">
                <span>Time:</span>
                <span className="stat-value">{elapsedTime.toFixed(2)}s</span>
              </div>
              <div className="stat-item">
                <span>Magnets:</span>
                <span className="stat-value">
                  {placedMagnets.length} /{' '}
                  {getTotalPermittedMagnets(currentLevelData)}
                </span>
              </div>
            </div>
          </div>

          {/* <AnimatePresence mode="wait"> */}
          <motion.div
            className="control-section"
            key={gameStatus + (selectedMagnet ? '-selected' : '-none')}
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="section-title">Instructions</h3>
            {!selectedMagnet && gameStatus === 'idle' && (
              <p className="instructions">
                Click on the canvas to place a magnet. Red magnets attract, blue
                magnets repel.
              </p>
            )}
            {gameStatus === 'idle' && selectedMagnet && (
              <p className="instructions">
                Click canvas to place another magnet, or modify the selected
                one.
              </p>
            )}
            {gameStatus === 'playing' && (
              <p className="instructions">
                Game is running. Pause to modify magnets.
              </p>
            )}
            {gameStatus === 'won' && (
              <p className="instructions" style={{ color: '#28a745' }}>
                Congratulations! You've completed this level! 🎉
              </p>
            )}
            {gameStatus === 'lost' && (
              <p className="instructions" style={{ color: '#dc3545' }}>
                Level failed. Try a different magnet arrangement.
              </p>
            )}
          </motion.div>
          {/* </AnimatePresence> */}
        </motion.div>

        <div
          className="game-canvas-wrapper"
          // onClick={handleCanvasClick}
          style={{
            cursor:
              gameStatus === 'idle' &&
              placedMagnets.length < getTotalPermittedMagnets(currentLevelData)
                ? 'crosshair'
                : 'default',
          }}
        >
          {/* {gameStatus === 'idle' && (
            <div
              className="magnet-overlay"
              style={{
                width: currentLevelData.canvasSize.width,
                height: currentLevelData.canvasSize.height,
              }}
            >
              {placedMagnets.map((magnet) => (
                <div
                  key={magnet.id}
                  onClick={(e) => handleMagnetClick(e, magnet)}
                  className={`magnet-indicator ${
                    magnet.isAttracting ? 'attract-magnet' : 'repel-magnet'
                  } ${
                    selectedMagnet?.id === magnet.id ? 'selected-magnet' : ''
                  }`}
                  style={{
                    left: `${magnet.body.position.x - 15}px`,
                    top: `${magnet.body.position.y - 15}px`,
                    width: '30px',
                    height: '30px',
                  }}
                  title={`Magnet at (${Math.round(
                    magnet.body.position.x
                  )}, ${Math.round(magnet.body.position.y)}) - ${
                    magnet.isAttracting ? 'Attracting' : 'Repelling'
                  }. Click to select.`}
                />
              ))}
            </div>
          )} */}
          <GameCanvas levelData={currentLevelData} />
        </div>
      </div>
      <MagnetPanel
        gameStatus={gameStatus}
        magnets={placedMagnets}
        // selectedMagnetId={selectedMagnet?.id ?? null}
        // onSelect={handlePanelSelect}
      />
      <div className="navigation-footer">
        <button className="game-btn secondary-btn" onClick={handleLevelSelect}>
          ← Back to Level Selection
        </button>
      </div>
    </div>
  );
};

export default GamePage;
