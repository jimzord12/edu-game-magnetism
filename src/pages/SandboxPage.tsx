import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSandboxEngine } from '../features/sandbox/hooks/useSandboxEngine';
import '../styles/SandboxPage.css';

const SandboxPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addMagnet, clearAllDynamic } = useSandboxEngine({ containerRef });

  const handleSpawnMagnet = (isAttracting: boolean) => {
    if (containerRef.current) {
      const canvasWidth = containerRef.current.offsetWidth || 800;
      const spawnX = canvasWidth / 2 + (Math.random() - 0.5) * 50;
      const spawnY = 50 + Math.random() * 50;
      addMagnet(spawnX, spawnY, isAttracting);
    } else {
      addMagnet(400, 50, isAttracting);
    }
  };

  return (
    <div className="sandbox-container">
      <header className="sandbox-header">
        <h1 className="sandbox-title">Physics Sandbox</h1>
        <p className="sandbox-subtitle">
          Experiment freely with magnetic forces! Drag magnets and the ball to
          see how they interact. Add different types of magnets and observe
          their effects on each other.
        </p>
      </header>

      <div className="sandbox-controls">
        <button
          onClick={() => handleSpawnMagnet(true)}
          className="sandbox-button attract-button"
        >
          🧲 Add Attracting Magnet
        </button>
        <button
          onClick={() => handleSpawnMagnet(false)}
          className="sandbox-button repel-button"
        >
          🔄 Add Repelling Magnet
        </button>
        <button
          onClick={clearAllDynamic}
          className="sandbox-button clear-button"
        >
          🗑️ Clear Objects
        </button>
      </div>

      <div className="sandbox-canvas-container" ref={containerRef}>
        {/* p5 canvas will be created here */}
      </div>

      <div className="navigation-footer">
        <Link to="/" className="back-button">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
};

export default SandboxPage;
