import type { Question } from '../types';

interface QuizQuestionProps {
  question: Question;
  selectedAnswers: number[];
  onSelect: (index: number) => void;
  onSubmit: () => void;
}

export const QuizQuestion: React.FC<QuizQuestionProps> = ({
  question,
  selectedAnswers,
  onSelect,
  onSubmit,
}) => {
  const isMultipleChoice = question.type === 'multiple';

  return (
    <div className="quiz-question">
      <h3>{question.question}</h3>
      <p className="question-type">
        {isMultipleChoice ? '(Select all that apply)' : '(Select one answer)'}
      </p>

      <div className="options-list">
        {question.options.map((option, index) => (
          <label key={index} className="option-label">
            <input
              type={isMultipleChoice ? 'checkbox' : 'radio'}
              name="quiz-answer"
              checked={selectedAnswers.includes(index)}
              onChange={() => onSelect(index)}
            />
            <span>{option}</span>
          </label>
        ))}
      </div>

      <button
        className="submit-button"
        onClick={onSubmit}
        disabled={selectedAnswers.length === 0}
      >
        Submit Answer
      </button>
    </div>
  );
};
