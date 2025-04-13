import React from 'react';
import { Link } from 'react-router-dom';
import { useQuiz } from '../hooks/useQuiz';
import { QuizQuestion } from './QuizQuestion';
import { QuizResults } from './QuizResults';

export const GameQuiz: React.FC = () => {
  const {
    quizState,
    handleStartQuiz,
    handleSelectAnswer,
    handleSubmitAnswer,
    handleResetQuiz,
    handleRetakeQuiz,
  } = useQuiz();

  if (quizState.loading || !quizState.questions) {
    return (
      <div className="quiz-loading">
        <p>Loading quiz questions...</p>
      </div>
    );
  }

  if (quizState.error) {
    return (
      <div className="quiz-error">
        <p>Error: {quizState.error}</p>
        <Link to="/" className="back-button">
          Back to Home
        </Link>
      </div>
    );
  }

  if (!quizState.category) {
    return (
      <div className="quiz-selection">
        <h2 className="quiz-game-header">Select Quiz Category</h2>
        <div className="category-buttons">
          <button onClick={() => handleStartQuiz('magnetism')}>
            Magnetism Quiz
          </button>
          <button onClick={() => handleStartQuiz('electromagnetism')}>
            Electromagnet Quiz
          </button>
        </div>
      </div>
    );
  }

  if (quizState.isComplete) {
    return (
      <QuizResults
        score={quizState.score}
        totalQuestions={quizState.questionsAnswered}
        onReset={handleRetakeQuiz}
      />
    );
  }

  if (!quizState.currentQuestion) {
    return (
      <div className="quiz-error">
        <p>No questions available for this category.</p>
        <button onClick={handleResetQuiz} className="back-button">
          Start Over
        </button>
      </div>
    );
  }

  return (
    <div className="game-quiz">
      <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-sky-600 to-blue-500 bg-clip-text text-transparent drop-shadow">
        {quizState.category === 'magnetism' ? 'Magnetism' : 'Electromagnet'}{' '}
        Quiz
      </h2>
      <div className="quiz-progress">
        Question {quizState.questionsAnswered + 1} of{' '}
        {quizState.questions[quizState.category].length}
      </div>

      {quizState.error && (
        <div className="error-message">{quizState.error}</div>
      )}

      <QuizQuestion
        question={quizState.currentQuestion}
        selectedAnswers={quizState.selectedAnswers}
        onSelect={handleSelectAnswer}
        onSubmit={handleSubmitAnswer}
      />
    </div>
  );
};
