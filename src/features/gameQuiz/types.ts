export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswers: number[];
  type: 'single' | 'multiple';
}

export interface QuizCategory {
  magnetism: Question[];
  electromagnetism: Question[];
}

export interface GameQuizState {
  currentQuestion: Question | null;
  selectedAnswers: number[];
  score: number;
  questionsAnswered: number;
  category: keyof QuizCategory | null;
  isComplete: boolean;
  error: string | null;
  loading: boolean;
  playerScores: Array<{
    id: number;
    playerId: number;
    score: number;
    date: Date;
  }>;
  highScores: Array<{
    id: number;
    playerId: number;
    score: number;
    date: Date;
    playerName: string;
  }>;
  questions: QuizCategory | null;
  currentCategory: keyof QuizCategory | null;
}

export interface QuestionAnswer {
  questionId: number;
  selectedAnswers: number[];
  isCorrect: boolean;
}
