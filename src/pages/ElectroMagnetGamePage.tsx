import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../hooks/reduxHooks';
import {
  loadLevel,
  startGame,
  pauseGame,
  //   resetGame,
  placeMagnet,
  toggleMagnetPolarity,
  removeMagnet,
} from '../features/games/magnets/slices/magnetGameSlice';

import { ILevel, ILevelElectroMagnet } from '@/features/levels/types';
import { ELECTRO_MAGNET_LEVELS } from '@/config/levels';
import ElectroGameCanvas from '@/features/games/electroMagnets/components/ElectroGameCanvas';
import { ElectroMagnet } from '@/models/ElectroMagnet';

const findLevelById = (id: number): ILevel<'electromagnet'> | null => {
  return ELECTRO_MAGNET_LEVELS.find((level) => level.id === id) || null;
};

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
  } = useAppSelector((state) => state.electroGame);
  const [currentLevelData, setCurrentLevelData] =
    useState<ILevelElectroMagnet | null>(null);
  const [selectedMagnetId, setSelectedMagnetId] = useState<number | null>(null);

  // Load level data and initialize DB on mount/levelId change
  useEffect(() => {
    if (levelId) {
      const levelData = findLevelById(levelId);
      if (levelData) {
        setCurrentLevelData(levelData);
        // Dispatch action to load level into Redux state if not already loaded
        if (levelId !== currentLevelId) {
          dispatch(loadLevel(levelId));
        }
      } else {
        console.error(`Level with id ${levelId} not found.`);
        navigate('/levels'); // Redirect if level not found
      }
    } else {
      navigate('/levels'); // Redirect if no levelId
    }

    // Cleanup on unmount
    // return () => {
    //   dispatch(resetGame()); // Optional: reset game state when leaving page
    // };
  }, [levelId, dispatch, navigate, currentLevelId]);

  // Handle game winning - save progress
  useEffect(() => {
    if (gameStatus === 'won' && currentLevelId) {
      console.log(
        `Level ${currentLevelId} completed! Time: ${elapsedTime.toFixed(2)}s`
      );
      // TODO: Implement Win logic here

      // saveLevelProgress({
      //   levelId: currentLevelId,
      //   completed: true,
      //   bestTime: elapsedTime, // TODO: Check against existing best time
      // }).then(() => {
      //   console.log(`Progress saved for level ${currentLevelId}`);
      //   // Optionally show a success message or navigate automatically
      // });
    }
  }, [gameStatus, currentLevelId, elapsedTime, dispatch]);

  const handleStartPause = () => {
    if (gameStatus === 'playing') {
      dispatch(pauseGame());
    } else if (gameStatus === 'idle' && currentLevelData) {
      // Check if magnets are placed (optional requirement)
      if (placedMagnets.length > 0) {
        // Only start if at least one magnet is placed
        dispatch(startGame());
      } else {
        alert('Place at least one magnet to start!');
      }
    } else if (gameStatus === 'won' || gameStatus === 'lost') {
      // If game is over, treat button as 'Restart Level'
      if (levelId) {
        dispatch(loadLevel(levelId)); // Reloads level, resets state
      }
    }
  };

  const handleReset = () => {
    if (levelId) {
      dispatch(loadLevel(levelId)); // Reload level data and reset state
      setSelectedMagnetId(null);
    }
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (gameStatus !== 'idle' || !currentLevelData) return; // Only place in idle state

    const canvasRect = event.currentTarget.getBoundingClientRect();
    const x = event.clientX - canvasRect.left;
    const y = event.clientY - canvasRect.top;

    // Prevent placing too close to borders or on top of target/start (optional)
    const margin = 20;
    if (
      x < margin ||
      x > currentLevelData.canvasSize.width - margin ||
      y < margin ||
      y > currentLevelData.canvasSize.height - margin
    ) {
      console.log('Cannot place magnet near border.');
      return;
    }

    if (placedMagnets.length < currentLevelData.availableMagnets) {
      const newElectroMagnet = new ElectroMagnet({
        x,
        y,
        isAttracting: true, // Default to attracting
      });
      dispatch(placeMagnet(newElectroMagnet));
      setSelectedMagnetId(newElectroMagnet.id); // Select the newly placed magnet
    } else {
      alert(
        `You can only place ${currentLevelData.availableMagnets} Electromagnets.`
      );
    }
  };

  const handleMagnetClick = (event: React.MouseEvent, magnetId: number) => {
    event.stopPropagation(); // Prevent canvas click when clicking a magnet representation
    if (gameStatus !== 'idle') return; // Only interact in idle state
    setSelectedMagnetId(magnetId);
  };

  const handleTogglePolarity = () => {
    if (selectedMagnetId && gameStatus === 'idle') {
      dispatch(toggleMagnetPolarity(selectedMagnetId));
    }
  };

  const handleRemoveMagnet = () => {
    if (selectedMagnetId && gameStatus === 'idle') {
      dispatch(removeMagnet(selectedMagnetId));
      setSelectedMagnetId(null); // Deselect after removing
    }
  };

  if (!currentLevelData) {
    return <div>Loading Level...</div>;
  }

  const selectedMagnet = placedMagnets.find((m) => m.id === selectedMagnetId);

  return (
    <div className="game-page">
      <h1>{currentLevelData.name}</h1>
      <div className="game-area">
        <div className="game-controls">
          <button
            onClick={handleStartPause}
            disabled={
              !levelId || (gameStatus === 'idle' && placedMagnets.length === 0)
            }
          >
            {gameStatus === 'playing'
              ? 'Pause'
              : gameStatus === 'won' || gameStatus === 'lost'
              ? 'Restart Level'
              : 'Start'}
          </button>
          <button onClick={handleReset} disabled={gameStatus === 'playing'}>
            Reset
          </button>
          <button onClick={() => navigate('/levels')}>Level Select</button>
          <p>Status: {gameStatus}</p>
          <p>Time: {elapsedTime.toFixed(2)}s</p>
          <p>
            Magnets Placed: {placedMagnets.length} /{' '}
            {currentLevelData.availableMagnets}
          </p>

          {selectedMagnet && gameStatus === 'idle' && (
            <div className="magnet-controls">
              <h4>Selected Magnet</h4>
              <button onClick={handleTogglePolarity}>
                Toggle Polarity (
                {selectedMagnet.isAttracting ? 'Attract' : 'Repel'})
              </button>
              <button onClick={handleRemoveMagnet}>Remove Magnet</button>
            </div>
          )}
          {!selectedMagnet && gameStatus === 'idle' && (
            <p>Click on the canvas to place a magnet.</p>
          )}
          {gameStatus === 'idle' && selectedMagnet && (
            <p>
              Click canvas to place another, or interact with the selected
              magnet.
            </p>
          )}
          {gameStatus !== 'idle' && (
            <p>Game is running. Pause to modify magnets.</p>
          )}
        </div>

        {/* Pass click handler to the wrapper div */}
        <div
          onClick={handleCanvasClick}
          style={{
            cursor:
              gameStatus === 'idle' &&
              placedMagnets.length < currentLevelData.availableMagnets
                ? 'crosshair'
                : 'default',
          }}
        >
          <ElectroGameCanvas levelData={currentLevelData} />
          {/* Overlay Magnets for Interaction - Positioned absolutely over the canvas */}
          {gameStatus === 'idle' && (
            <div
              className="magnet-overlay"
              style={{
                position: 'relative',
                width: currentLevelData.canvasSize.width,
                height: 0,
              }}
            >
              {placedMagnets.map((magnet) => (
                <div
                  key={magnet.id}
                  onClick={(e) => handleMagnetClick(e, magnet.id)}
                  style={{
                    position: 'absolute',
                    left: `${magnet.body.position.x - 15}px`, // Center the clickable area
                    top: `${magnet.body.position.y - 15}px`, // Center the clickable area
                    width: '30px',
                    height: '30px',
                    borderRadius: '50%',
                    border: `2px dashed ${
                      selectedMagnetId === magnet.id ? 'yellow' : 'transparent'
                    }`,
                    backgroundColor:
                      selectedMagnetId === magnet.id
                        ? 'rgba(255, 255, 0, 0.2)'
                        : 'transparent',
                    cursor: 'pointer',
                    boxSizing: 'border-box',
                  }}
                  title={`Magnet at (${Math.round(
                    magnet.body.position.x
                  )}, ${Math.round(magnet.body.position.y)}) - ${
                    magnet.isAttracting ? 'Attract' : 'Repel'
                  }. Click to select.`}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePage;
