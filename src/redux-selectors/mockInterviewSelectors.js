export const selectInterviewState = (state) => state.mockInterview;

export const selectCurrentQuestion = (state) => state.mockInterview.currentQuestion;
export const selectScore = (state) => state.mockInterview.score;
export const selectTimeRemaining = (state) => state.mockInterview.timeRemaining;
export const selectIsInterviewActive = (state) => state.mockInterview.isInterviewActive;
export const selectIsInterviewCompleted = (state) => state.mockInterview.isInterviewCompleted;
export const selectQuestions = (state) => state.mockInterview.questions;
export const selectUserAnswers = (state) => state.mockInterview.userAnswers;
export const selectCorrectAnswers = (state) => state.mockInterview.correctAnswers;
export const selectUserInfo = (state) => state.mockInterview.userInfo;
export const selectInterviewTopic = (state) => state.mockInterview.interviewTopic;
export const selectQuestionCount = (state) => state.mockInterview.questionCount;
export const selectIsLoading = (state) => state.mockInterview.loading;
export const selectError = (state) => state.mockInterview.error;

// Derived selectors
export const selectProgress = (state) => {
  const { currentQuestion, questions } = state.mockInterview;
  return questions.length > 0 ? (currentQuestion / questions.length) * 100 : 0;
};

export const selectCurrentQuestionData = (state) => {
  const { currentQuestion, questions } = state.mockInterview;
  return questions[currentQuestion] || null;
};

export const selectResults = (state) => {
  const { userAnswers, questions, score } = state.mockInterview;
  return {
    totalQuestions: questions.length,
    correctAnswers: userAnswers.filter(answer => answer.isCorrect).length,
    wrongAnswers: userAnswers.filter(answer => answer.userAnswer && !answer.isCorrect).length,
    unanswered: userAnswers.filter(answer => !answer.userAnswer).length,
    finalScore: score
  };
};