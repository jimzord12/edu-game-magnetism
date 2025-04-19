import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import type {
  GameQuizState,
  Question,
  QuestionAnswer,
  QuizCategory,
} from '../types';
import { QuizService } from '../../../db/services/quiz.service';
import { db } from '../../../db/client';

const quizService = new QuizService(db);

// Async thunks
export const loadQuizQuestions = createAsyncThunk(
  'gameQuiz/loadQuestions',
  async () => {
    const response = await import(
      '../../../assets/magnetism_electromagnetism_quiz.json'
    );
    const data = response.default;

    // Validate and transform question types
    const transformedData: QuizCategory = {
      magnetism: data.magnetism.map((q) => ({
        ...q,
        type: q.type === 'multiple' ? 'multiple' : 'single',
      })),
      electromagnetism: data.electromagnetism.map((q) => ({
        ...q,
        type: q.type === 'multiple' ? 'multiple' : 'single',
      })),
    };

    return transformedData;
  }
);

export const saveQuizScore = createAsyncThunk(
  'gameQuiz/saveScore',
  async ({ playerId, score }: { playerId: number; score: number }) => {
    const result = await quizService.createQuizScore(playerId, score);
    return result;
  }
);

export const fetchPlayerScores = createAsyncThunk(
  'gameQuiz/fetchPlayerScores',
  async (playerId: number) => {
    const scores = await quizService.getPlayerQuizScores(playerId);
    return scores;
  }
);

export const fetchHighScores = createAsyncThunk(
  'gameQuiz/fetchHighScores',
  async (limit: number = 10) => {
    const scores = await quizService.getHighScores(limit);
    return scores;
  }
);

const initialState: GameQuizState = {
  currentQuestion: null,
  selectedAnswers: [],
  score: 0,
  questionsAnswered: 0,
  category: null,
  isComplete: false,
  error: null,
  playerScores: [],
  highScores: [],
  loading: false,
  questions: null,
  currentCategory: null,
};

// Helper function to get random questions
const getRandomQuestions = (
  questions: Question[],
  count: number
): Question[] => {
  const shuffled = [...questions].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const gameQuizSlice = createSlice({
  name: 'gameQuiz',
  initialState,
  reducers: {
    startQuiz: (state, action: PayloadAction<keyof QuizCategory>) => {
      if (!state.questions || !state.questions[action.payload]) {
        state.error = 'Questions not loaded. Please try again.';
        return;
      }

      const categoryQuestions = state.questions[action.payload];
      if (categoryQuestions.length === 0) {
        state.error = 'No questions available for this category.';
        return;
      }

      state.category = action.payload;
      state.score = 0;
      state.questionsAnswered = 0;
      state.isComplete = false;
      state.error = null;

      const randomQuestions = getRandomQuestions(categoryQuestions, 10);
      state.questions[action.payload] = randomQuestions;
      state.currentQuestion = randomQuestions[0];
      state.currentCategory = action.payload;
    },
    setCurrentQuestion: (state, action: PayloadAction<Question>) => {
      state.currentQuestion = action.payload;
      state.selectedAnswers = [];
    },
    selectAnswer: (state, action: PayloadAction<number>) => {
      if (state.currentQuestion?.type === 'single') {
        state.selectedAnswers = [action.payload];
      } else {
        const index = state.selectedAnswers.indexOf(action.payload);
        if (index === -1) {
          state.selectedAnswers.push(action.payload);
        } else {
          state.selectedAnswers.splice(index, 1);
        }
      }
    },
    submitAnswer: (state, action: PayloadAction<QuestionAnswer>) => {
      if (action.payload.isCorrect) {
        state.score += 1;
      }
      state.questionsAnswered += 1;
    },
    completeQuiz: (state) => {
      state.isComplete = true;
      state.currentQuestion = null;
    },
    resetQuiz: () => {
      return initialState;
    },
    setGameCategory: (state, action: PayloadAction<keyof QuizCategory>) => {
      state.currentCategory = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadQuizQuestions.fulfilled, (state, action) => {
        state.questions = action.payload;
        state.loading = false;
        state.error = null;
      })
      .addCase(loadQuizQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadQuizQuestions.rejected, (state, action) => {
        state.error = action.error.message || 'Failed to load quiz';
      })
      // Save Score
      .addCase(saveQuizScore.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(saveQuizScore.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(saveQuizScore.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to save score';
      })
      // Fetch Player Scores
      .addCase(fetchPlayerScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPlayerScores.fulfilled, (state, action) => {
        state.playerScores = action.payload.map((score) => ({
          id: score.id,
          playerId: score.playerId ?? 0, // Convert null to 0 if needed
          score: score.score,
          date: score.date,
        }));
        state.loading = false;
      })
      .addCase(fetchPlayerScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch player scores';
      })
      // Fetch High Scores
      .addCase(fetchHighScores.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchHighScores.fulfilled, (state, action) => {
        state.highScores = action.payload.map((result) => ({
          id: result.quiz_scores.id,
          playerId: result.quiz_scores.playerId ?? 0,
          score: result.quiz_scores.score,
          date: result.quiz_scores.date,
          playerName: result.players.name,
        }));
        state.loading = false;
      })
      .addCase(fetchHighScores.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch high scores';
      });
  },
});

export const {
  startQuiz,
  setCurrentQuestion,
  selectAnswer,
  submitAnswer,
  completeQuiz,
  resetQuiz,
  setGameCategory,
} = gameQuizSlice.actions;

export default gameQuizSlice.reducer;
