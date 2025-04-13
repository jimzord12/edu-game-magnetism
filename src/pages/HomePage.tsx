// src/pages/HomePage.tsx
import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import '../styles/HomePage.css';
import { exportDatabase, deleteDatabase } from '../db/helpers';

const HomePage: React.FC = () => {
  const { currentPlayer, isLoading, error, login, createAccount, logout } =
    useAuth();
  const [username, setUsername] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleExportDatabase = async () => {
    try {
      setIsExporting(true);
      await exportDatabase();
      setIsExporting(false);
    } catch (error) {
      console.error('Error exporting database:', error);
      setIsExporting(false);
    }
  };

  const handleDeleteDatabase = async () => {
    try {
      setIsDeleting(true);
      await deleteDatabase();
      // No need to set isDeleting to false since page will refresh
    } catch (error) {
      console.error('Error deleting database:', error);
      setIsDeleting(false);
    }
  };

  // Focus input on mount and when switching modes
  useEffect(() => {
    if (!currentPlayer && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentPlayer, isCreating]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) return;

    if (isCreating) {
      await createAccount(username);
    } else {
      await login(username);
    }
    setUsername('');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && e.shiftKey) {
      setIsCreating(!isCreating);
    }
  };

  return (
    <div className="home-container">
      <header className="home-header">
        <h1 className="title">MagnetiX</h1>
        <p className="subtitle">
          Discover the fascinating world of magnetism through interactive
          puzzles
        </p>
        <div className="auth-section" role="region" aria-label="Authentication">
          {currentPlayer ? (
            <div className="player-info">
              <span>Welcome, {currentPlayer.username}!</span>
              <button
                onClick={logout}
                className="auth-button"
                aria-label="Log out of your account"
              >
                Logout
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="auth-form">
              <input
                ref={inputRef}
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Enter username"
                className="auth-input"
                aria-label="Username"
                aria-invalid={!!error}
                aria-describedby={error ? 'auth-error' : undefined}
                minLength={3}
                maxLength={20}
                pattern="[A-Za-z0-9_-]*"
                required
              />
              <button
                type="submit"
                className="auth-button"
                disabled={isLoading}
                aria-busy={isLoading}
              >
                {isCreating ? 'Create Account 🚀' : 'Login 🗝️'}
              </button>
              <button
                type="button"
                onClick={() => setIsCreating(!isCreating)}
                className="auth-switch"
                aria-label={
                  isCreating ? 'Switch to login' : 'Switch to create account'
                }
              >
                {isCreating ? 'Already have an account?' : 'Need an account?'}
                <span className="keyboard-hint">(Shift + Enter)</span>
              </button>
              {error && (
                <div className="auth-error" id="auth-error" role="alert">
                  {error}
                </div>
              )}
              {isLoading && (
                <div className="auth-loading" role="status">
                  Loading...
                </div>
              )}
            </form>
          )}
        </div>
      </header>

      <section className="info-section">
        <div className="info-card magnet-card">
          <h2>Magnetism</h2>
          <p>
            Magnets have two poles: North and South. Similar poles repel each
            other, while opposite poles attract. This fundamental principle
            powers everything from compasses to electric motors!
          </p>
        </div>

        <div className="info-card electro-card">
          <h2>Electromagnetism</h2>
          <p>
            When electricity flows through a wire, it creates a magnetic field.
            This relationship between electricity and magnetism is what makes
            modern technology possible, from speakers to generators.
          </p>
        </div>
      </section>

      <section className="navigation-section">
        <div className="navigation-subsection w-fit">
          <Link
            to={currentPlayer ? '/levels' : '#'}
            className={`nav-button primary-button w-64 ${
              !currentPlayer && 'disabled-link'
            }`}
            onClick={(e) => !currentPlayer && e.preventDefault()}
          >
            {currentPlayer ? 'Start Your Adventure' : 'Login to Play'}
          </Link>
          <Link
            to={currentPlayer ? '/sandbox' : '#'}
            className={`nav-button secondary-button w-64 text-right ${
              !currentPlayer && 'disabled-link'
            }`}
            onClick={(e) => !currentPlayer && e.preventDefault()}
          >
            {currentPlayer
              ? 'Experiment in Sandbox'
              : 'Login to Access Sandbox'}
          </Link>
        </div>
        <div className="navigation-subsection w-fit">
          <Link
            to={currentPlayer ? '/quiz' : '#'}
            className={`nav-button thirdly-button ${
              !currentPlayer && 'disabled-link'
            }`}
            onClick={(e) => !currentPlayer && e.preventDefault()}
          >
            {currentPlayer ? 'Take a Quiz' : 'Login to Access Quiz'}
          </Link>
        </div>
      </section>

      <footer className="home-footer">
        <p>Learn through play. Discover the power of magnets!</p>
        <div
          className="database-actions"
          style={{
            position: 'absolute',
            bottom: '10px',
            left: '10px',
            display: 'flex',
            gap: '10px',
          }}
        >
          <button
            className="export-button"
            onClick={handleExportDatabase}
            disabled={isExporting}
            style={{
              backgroundColor: '#2196F3', // Changed to blue color
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 15px',
              cursor: isExporting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              opacity: isExporting ? 0.7 : 1,
            }}
          >
            <span role="img" aria-label="Download">
              💾
            </span>
            {isExporting ? 'Exporting...' : 'Export Database'}
          </button>

          <button
            className="delete-button"
            onClick={handleDeleteDatabase}
            disabled={isDeleting}
            style={{
              backgroundColor: '#e53935', // Red color for danger
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              padding: '10px 15px',
              cursor: isDeleting ? 'not-allowed' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
              transition: 'all 0.2s ease',
              opacity: isDeleting ? 0.7 : 1,
            }}
          >
            <span role="img" aria-label="Delete">
              🗑️
            </span>
            {isDeleting ? 'Deleting...' : 'Reset Database'}
          </button>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
