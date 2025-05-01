import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/reduxHooks';
import {
  loadLevel,
  startGame,
  pauseGame,
  resumeGame,
  placeMagnet,
  resetGame,
} from '../../features/games/electroMagnets/slices/electroGameSlice';

import { ILevel, ILevelElectroMagnet } from '@/features/levels/types';
import ElectroGameCanvas from '@/features/games/electroMagnets/components/ElectroGameCanvas';
import ElectromagnetPanel from '@/features/games/electroMagnets/components/ElectromagnetPanel';
import { getElectroMagnetLevels } from '@/config/levels';
import useForceRerender from '@/hooks/useForceRerender';

const findLevelById = (id: number): ILevel<'electromagnet'> | null => {
  return getElectroMagnetLevels().find((level) => level.id === id) || null;
};

const GamePage: React.FC = () => {
  const { levelId: levelIdStr } = useParams<{ levelId: string }>();
  const levelId = levelIdStr ? parseInt(levelIdStr) : null;
  const { value, forceUpdate } = useForceRerender(); // Updated to use the correct variable name
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const {
    status: gameStatus,
    levelId: currentLevelId,
    placedMagnets,
    elapsedTime,
    // selectedElectromagnet,
  } = useAppSelector((state) => state.electroGame);
  const [currentLevelData, setCurrentLevelData] =
    useState<ILevelElectroMagnet | null>(null);

  // Add Level Magnets to the Redux Slice
  useEffect(() => {
    if (
      currentLevelData?.electromagnets &&
      currentLevelData?.electromagnets.length > 0
    ) {
      currentLevelData.electromagnets.forEach((magnet) => {
        dispatch(placeMagnet(magnet));
      });
    }
  }, [currentLevelData, dispatch, value]);

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
  }, [levelId, dispatch, navigate, currentLevelId, value]);

  const handleStartPause = () => {
    if (gameStatus === 'playing') {
      dispatch(pauseGame());
    } else if (gameStatus === 'paused') {
      dispatch(resumeGame());
    } else if (gameStatus === 'idle' && currentLevelData) {
      if (placedMagnets.size >= currentLevelData.minMagnetsToStart) {
        dispatch(startGame());
      } else {
        alert(
          `Place at least ${currentLevelData.minMagnetsToStart} magnets to start!`
        );
      }
    } else if (gameStatus === 'won' || gameStatus === 'lost') {
      if (levelId) {
        dispatch(loadLevel(levelId));
        // console.log('Game reset and level loaded.');
      }
    }
  };

  const handleReset = () => {
    if (levelId) {
      dispatch(loadLevel(levelId));
      forceUpdate(); // Force a re-render to update the UI
    }
  };

  const handleResetGame = () => {
    dispatch(resetGame());
    navigate('/levels');
  };

  // const findMagnetById = (
  //   id: number,
  //   magnets: ElectroMagnet[]
  // ): ElectroMagnet | null => {
  //   return magnets.find((m) => m.id === id) || null;
  // };

  // const handleMagnetClick = (
  //   event: React.MouseEvent,
  //   magnet: ElectroMagnet
  // ) => {
  //   event.stopPropagation();
  //   if (gameStatus !== 'idle') return;

  //   const _magnet = findMagnetById(magnet.id, Array.from(placedMagnets));
  //   if (!_magnet) return;
  //   console.log('Magnet clicked:', magnet.id);
  //   dispatch(setSelectedElectromagnet(_magnet));
  //   forceUpdate();
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
          <span className="text-red-500">Electro</span>
          <span className="text-blue-500">magnet Games: </span>
          {currentLevelData.name}
        </h1>
        <p className="game-subtitle">
          Place electromagnets and control their state to guide the ball to its
          target
        </p>
      </header>
      <div className="game-area">
        <div className="game-controls">
          <div className="control-section">
            <h3 className="section-title">Game Controls</h3>
            <div className="button-group">
              <button
                className={`game-btn primary-btn ${
                  placedMagnets.size < currentLevelData.minMagnetsToStart &&
                  gameStatus === 'idle' &&
                  'opacity-50 cursor-not-allowed'
                }`}
                onClick={handleStartPause}
                disabled={
                  !levelId ||
                  (gameStatus === 'idle' &&
                    placedMagnets.size < currentLevelData.minMagnetsToStart)
                }
              >
                {gameStatus === 'playing'
                  ? '⏸️ Pause'
                  : gameStatus === 'paused'
                  ? '▶️ Resume'
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
              onClick={handleResetGame}
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
                <span>Electromagnets:</span>
                <span className="stat-value">
                  {placedMagnets.size} / {currentLevelData.availableMagnets}
                </span>
              </div>
            </div>
          </div>
          <div className="control-section">
            <h3 className="section-title">Instructions</h3>
            {gameStatus === 'idle' && (
              <p className="instructions">
                Click on the canvas to place an electromagnet. Use the panel
                below to toggle ON/OFF and polarity.
              </p>
            )}
            {gameStatus === 'playing' && (
              <p className="instructions">
                Game is running. You can still toggle ON/OFF and polarity.
              </p>
            )}
            {gameStatus === 'paused' && (
              <p className="instructions" style={{ color: '#FFA500' }}>
                Game paused. Press Resume to continue.
              </p>
            )}
            {gameStatus === 'won' && (
              <p className="instructions" style={{ color: '#28a745' }}>
                Congratulations! You've completed this level! 🎉
              </p>
            )}
            {gameStatus === 'lost' && (
              <p className="instructions" style={{ color: '#dc3545' }}>
                Level failed. Try a different arrangement.
              </p>
            )}
          </div>
        </div>
        <div
          className="game-canvas-wrapper"
          // onClick={handleCanvasClick}
          style={{
            cursor:
              (gameStatus === 'idle' || gameStatus === 'paused') &&
              placedMagnets.size < currentLevelData.availableMagnets
                ? 'crosshair'
                : 'default',
            width: currentLevelData.canvasSize.width,
            height: currentLevelData.canvasSize.height,
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
              {Array.from(placedMagnets).map((magnet) => (
                <div
                  key={magnet.id}
                  onClick={(e) => handleMagnetClick(e, magnet)}
                  className={`magnet-indicator ${
                    magnet.isAttracting ? 'attract-magnet' : 'repel-magnet'
                  } ${
                    selectedElectromagnet?.id === magnet.id
                      ? 'selected-magnet'
                      : ''
                  }`}
                  style={{
                    left: `${magnet.body.position.x - 15}px`,
                    top: `${magnet.body.position.y - 15}px`,
                    width: '30px',
                    height: '30px',
                  }}
                  title={`Electromagnet at (${Math.round(
                    magnet.body.position.x
                  )}, ${Math.round(magnet.body.position.y)}) - ${
                    magnet.isAttracting ? 'Attract' : 'Repel'
                  }.`}
                />
              ))}
            </div>
          )} */}
          <ElectroGameCanvas levelData={currentLevelData} />
        </div>
      </div>
      <ElectromagnetPanel
        gameStatus={gameStatus}
        magnets={Array.from(placedMagnets)}
      />
      <div className="navigation-footer">
        <button className="game-btn secondary-btn" onClick={handleResetGame}>
          ← Back to Level Selection
        </button>
      </div>
    </div>
  );
};

export default GamePage;
