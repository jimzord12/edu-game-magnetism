import React from 'react';
import { Link } from 'react-router-dom';
import { GameQuiz } from '../features/gameQuiz/components/GameQuiz';
import '../features/gameQuiz/components/GameQuiz.css';
import '../styles/GameQuizPage.css';
import { useQuiz } from '@/features/gameQuiz/hooks/useQuiz';

const GameQuizPage: React.FC = () => {
  const { handleResetQuiz } = useQuiz();

  return (
    <div className="quiz-container">
      <div className="game-quiz-page">
        <header className="quiz-header">
          <h1>Magnetism Quiz Challenge</h1>
          <p>Test your knowledge about magnets and electromagnetism!</p>
        </header>
        <main>
          <GameQuiz />
        </main>
        <div className="navigation-footer">
          <Link to="/" className="back-button" onClick={handleResetQuiz}>
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default GameQuizPage;
