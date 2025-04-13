import React from 'react';

interface QuizResultsProps {
  score: number;
  totalQuestions: number;
  onReset: () => void;
}

export const QuizResults: React.FC<QuizResultsProps> = ({
  score,
  totalQuestions,
  onReset,
}) => {
  const percentage = Math.round((score / totalQuestions) * 100);

  return (
    <div className="quiz-results">
      <h2>Quiz Complete!</h2>
      <div className="score-display">
        <p className="score">
          Score: {score}/{totalQuestions}
        </p>
        <p className="percentage">{percentage}%</p>
      </div>

      <div className="feedback">
        {percentage === 100 && (
          <p>Perfect score! You're a magnetism expert! 🌟</p>
        )}
        {percentage >= 70 && percentage < 100 && (
          <p>Great job! You have a solid understanding of magnetism! 👏</p>
        )}
        {percentage >= 40 && percentage < 70 && (
          <p>Good effort! Keep learning about magnetism! 📚</p>
        )}
        {percentage < 40 && (
          <p>Keep practicing! Review the topics and try again! 💪</p>
        )}
      </div>

      <button className="reset-button" onClick={onReset}>
        Try Again
      </button>
    </div>
  );
};
