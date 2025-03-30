import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { useSandboxEngine } from '../features/sandbox/hooks/useSandboxEngine';
// Basic styling, you can create a specific CSS file if needed
// import './SandboxPage.css';

const SandboxPage: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { addMagnet, clearAllDynamic } = useSandboxEngine({ containerRef });

  const handleSpawnMagnet = (isAttracting: boolean) => {
    // Spawn near the top-center for simplicity
    if (containerRef.current) {
      const canvasWidth = containerRef.current.offsetWidth || 800; // Use default if not measured yet
      const spawnX = canvasWidth / 2 + (Math.random() - 0.5) * 50; // Add some randomness
      const spawnY = 50 + Math.random() * 50;
      addMagnet(spawnX, spawnY, isAttracting);
    } else {
      addMagnet(400, 50, isAttracting); // Fallback coordinates
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '20px',
      }}
    >
      <h1>Physics Sandbox</h1>
      <p>
        Drag magnets (or the ball) around. Add more magnets using the buttons.
      </p>
      <div style={{ marginBottom: '15px' }}>
        <button
          onClick={() => handleSpawnMagnet(true)}
          style={{ backgroundColor: 'lightcoral', marginRight: '10px' }}
        >
          Add Attracting Magnet (+)
        </button>
        <button
          onClick={() => handleSpawnMagnet(false)}
          style={{ backgroundColor: 'lightblue', marginRight: '10px' }}
        >
          Add Repelling Magnet (-)
        </button>
        <button onClick={clearAllDynamic}>Clear Dynamic Objects</button>
        <Link to="/" style={{ marginLeft: '20px' }}>
          <button>Back to Home</button>
        </Link>
      </div>
      <div
        ref={containerRef}
        style={{
          width: '800px',
          height: '600px',
          border: '1px solid #666',
          marginBottom: '20px',
        }}
      >
        {/* p5 canvas will be created here */}
      </div>
    </div>
  );
};

export default SandboxPage;
