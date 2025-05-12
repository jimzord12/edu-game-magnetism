import { useEffect, useCallback } from 'react';
import { useAppDispatch, useAppSelector } from '../../../hooks/reduxHooks';
import {
  loadQuizQuestions,
  startQuiz,
  selectAnswer,
  submitAnswer,
  completeQuiz,
  resetQuiz,
  saveQuizScore,
  fetchPlayerScores,
  fetchHighScores,
  setCurrentQuestion,
  setGameCategory,
} from '../slices/gameQuizSlice';
import type { QuestionAnswer, QuizCategory } from '../types';
import { useNavigate } from 'react-router-dom';

export function useQuiz() {
  const dispatch = useAppDispatch();
  const quizState = useAppSelector((state) => state.gameQuiz);
  const playerId = useAppSelector((state) => state.player.currentPlayer?.id);
  const navigate = useNavigate();

  // Start quiz for a specific category
  const handleStartQuiz = useCallback(
    (category: keyof QuizCategory) => {
      navigate('/quiz');
      dispatch(startQuiz(category));
      dispatch(setGameCategory(category));
    },
    [dispatch]
  );

  // Select an answer option
  const handleSelectAnswer = useCallback(
    (optionIndex: number) => {
      dispatch(selectAnswer(optionIndex));
    },
    [dispatch]
  );

  // Submit the current answer and load next question
  const handleSubmitAnswer = useCallback(async () => {
    if (
      !quizState.currentQuestion ||
      !playerId ||
      !quizState.category ||
      !quizState.questions
    )
      return;

    const isCorrect =
      quizState.selectedAnswers.every((answer) =>
        quizState.currentQuestion!.correctAnswers.includes(answer)
      ) &&
      quizState.selectedAnswers.length ===
        quizState.currentQuestion.correctAnswers.length;

    const answer: QuestionAnswer = {
      questionId: quizState.currentQuestion.id,
      selectedAnswers: quizState.selectedAnswers,
      isCorrect,
    };

    dispatch(submitAnswer(answer));

    // Check if there are more questions
    const currentQuestionIndex = quizState.questions[
      quizState.category
    ].findIndex((q) => q.id === quizState.currentQuestion!.id);

    const nextQuestion =
      quizState.questions[quizState.category][currentQuestionIndex + 1];

    if (nextQuestion) {
      dispatch(setCurrentQuestion(nextQuestion));
    } else {
      // Quiz is complete
      try {
        await dispatch(
          saveQuizScore({ playerId, score: quizState.score })
        ).unwrap();
        await dispatch(fetchPlayerScores(playerId)).unwrap();
        dispatch(completeQuiz());
      } catch (error) {
        console.error('Failed to save quiz score:', error);
      }
    }
  }, [dispatch, quizState, playerId]);

  // Reset the quiz state
  const handleResetQuiz = useCallback(() => {
    dispatch(resetQuiz());
    navigate('/quiz');
  }, [dispatch, quizState.category]);

  const handleRetakeQuiz = useCallback(async () => {
    try {
      const currentCategory = quizState.category;
      dispatch(resetQuiz());
      await dispatch(loadQuizQuestions()).unwrap();
      if (currentCategory) {
        dispatch(startQuiz(currentCategory));
      }
      navigate('/quiz');
    } catch (error) {
      console.error('Failed to retake quiz:', error);
    }
  }, [dispatch, quizState.category, navigate]);

  // Load questions and scores on mount
  useEffect(() => {
    dispatch(loadQuizQuestions());
    if (playerId) {
      dispatch(fetchPlayerScores(playerId));
      dispatch(fetchHighScores(10));
    }
  }, [dispatch, playerId]);

  return {
    quizState,
    handleStartQuiz,
    handleSelectAnswer,
    handleSubmitAnswer,
    handleResetQuiz,
    handleRetakeQuiz,
  };
}
