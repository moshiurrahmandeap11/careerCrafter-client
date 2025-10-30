import React, { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import {
  Clock,
  Play,
  Pause,
  CheckCircle,
  XCircle,
  AlertCircle,
  RotateCcw,
  Mic,
  MicOff,
} from "lucide-react";
import useAuth from "../../hooks/UseAuth/useAuth";

// Redux actions and selectors
import {
  startMockInterview,
  submitAnswer,
  submitInterview,
  resetInterview,
  setTimer,
  evaluateAnswer,
} from "../../redux-slices/mockInterviewSlice";

import {
  selectInterviewState,
  selectCurrentQuestion,
  selectScore,
  selectTimeRemaining,
  selectIsInterviewActive,
  selectIsInterviewCompleted,
  selectQuestions,
  selectUserAnswers,
  selectCorrectAnswers,
  selectIsEvaluating,
} from "../../redux-selectors/mockInterviewSelectors";
import { Link } from "react-router";
import LiveInterviewBanner from "./VideoInterview/LiveInterviewBanner/LiveInterviewBanner";

const MockInterview = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  // Redux state
  const interviewState = useSelector(selectInterviewState);
  const currentQuestion = useSelector(selectCurrentQuestion);
  const score = useSelector(selectScore);
  const timeRemaining = useSelector(selectTimeRemaining);
  const isInterviewActive = useSelector(selectIsInterviewActive);
  const isInterviewCompleted = useSelector(selectIsInterviewCompleted);
  const questions = useSelector(selectQuestions);
  const userAnswers = useSelector(selectUserAnswers);
  const correctAnswers = useSelector(selectCorrectAnswers);
  const isEvaluating = useSelector(selectIsEvaluating);

  // Speech recognition
  const {
    transcript,
    listening,
    resetTranscript,
    browserSupportsSpeechRecognition,
    isMicrophoneAvailable,
  } = useSpeechRecognition();

  // Local state
  const [userInfo, setUserInfo] = useState({
    name: user?.displayName || "",
    title: user?.title || "",
    email: user?.email || "",
  });
  const [interviewTopic, setInterviewTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(10);
  const [currentAnswer, setCurrentAnswer] = useState("");
  const [isPaused, setIsPaused] = useState(false);
  const [step, setStep] = useState(1);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [isFirstListening, setIsFirstListening] = useState(true);

  const timerRef = useRef(null);
  const textareaRef = useRef(null);
  const previousTranscriptRef = useRef("");

  // Check browser support
  useEffect(() => {
    if (!browserSupportsSpeechRecognition) {
      setIsSpeechSupported(false);
    }
  }, [browserSupportsSpeechRecognition]);

  // Fixed: Sync transcript with currentAnswer in real-time without duplication
  useEffect(() => {
    if (
      listening &&
      transcript &&
      transcript !== previousTranscriptRef.current
    ) {
      // If this is the first time listening, replace the current answer
      // Otherwise, append only the new words
      if (isFirstListening) {
        setCurrentAnswer(transcript);
        setIsFirstListening(false);
      } else {
        // Only add new words that aren't already in the current answer
        const newWords = transcript
          .replace(previousTranscriptRef.current, "")
          .trim();
        if (newWords) {
          setCurrentAnswer(
            (prev) => prev + (prev && !prev.endsWith(" ") ? " " : "") + newWords
          );
        }
      }
      previousTranscriptRef.current = transcript;
    }
  }, [transcript, listening, isFirstListening]);

  // Reset first listening flag when stopping
  useEffect(() => {
    if (!listening) {
      setIsFirstListening(true);
      previousTranscriptRef.current = "";
    }
  }, [listening]);

  // Timer effect
  useEffect(() => {
    if (isInterviewActive && !isPaused && timeRemaining > 0) {
      timerRef.current = setInterval(() => {
        dispatch(setTimer(timeRemaining - 1));
      }, 1000);
    } else if (timeRemaining === 0 && isInterviewActive) {
      handleAutoSubmit();
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isInterviewActive, isPaused, timeRemaining, dispatch]);

  // Auto-scroll textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height =
        textareaRef.current.scrollHeight + "px";
    }
  }, [currentAnswer]);

  const handleUserInfoSubmit = (e) => {
    e.preventDefault();
    if (userInfo.name && userInfo.title && userInfo.email) {
      setStep(2);
    }
  };

  const handleTopicSubmit = (e) => {
    e.preventDefault();
    if (interviewTopic.trim()) {
      setStep(3);
    }
  };

  const handleQuestionCountSubmit = (e) => {
    e.preventDefault();
    setStep(4);

    dispatch(
      startMockInterview({
        userInfo: { ...userInfo, email: user?.email || userInfo.email },
        topic: interviewTopic,
        questionCount,
        userId: user?.uid,
      })
    );
  };

  const handleAnswerSubmit = async (e) => {
    e.preventDefault();
    if (currentAnswer.trim() && isInterviewActive) {
      if (listening) {
        stopListening();
      }

      dispatch(
        submitAnswer({
          questionIndex: currentQuestion,
          answer: currentAnswer.trim(),
          timeSpent: questions[currentQuestion]?.timeLimit - timeRemaining,
        })
      );

      if (currentAnswer.trim()) {
        dispatch(
          evaluateAnswer({
            question: questions[currentQuestion]?.question,
            userAnswer: currentAnswer.trim(),
            correctAnswer: questions[currentQuestion]?.correctAnswer,
            questionIndex: currentQuestion,
          })
        );
      }

      setCurrentAnswer("");
      resetTranscript();
      previousTranscriptRef.current = "";

      if (currentQuestion < questions.length - 1) {
        // Next question handled in slice
      } else {
        handleFinishInterview();
      }
    }
  };

  const handleAutoSubmit = () => {
    if (isInterviewActive) {
      if (listening) {
        stopListening();
      }

      dispatch(
        submitAnswer({
          questionIndex: currentQuestion,
          answer: currentAnswer.trim() || "",
          timeSpent: questions[currentQuestion]?.timeLimit,
        })
      );

      setCurrentAnswer("");
      resetTranscript();
      previousTranscriptRef.current = "";

      if (currentQuestion < questions.length - 1) {
        // Next question handled in slice
      } else {
        handleFinishInterview();
      }
    }
  };

  const handleFinishInterview = () => {
    if (listening) {
      stopListening();
    }

    dispatch(submitInterview());
    setStep(5);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleRestart = () => {
    if (listening) {
      stopListening();
    }

    dispatch(resetInterview());
    setStep(1);
    setUserInfo({
      name: user?.displayName || "",
      title: user?.title || "",
      email: user?.email || "",
    });
    setInterviewTopic("");
    setQuestionCount(10);
    setCurrentAnswer("");
    setIsPaused(false);
    resetTranscript();
    previousTranscriptRef.current = "";
    setIsFirstListening(true);

    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);

    if (listening && !isPaused) {
      stopListening();
    }
  };

  const startListening = () => {
    resetTranscript();
    previousTranscriptRef.current = "";
    setIsFirstListening(true);
    SpeechRecognition.startListening({
      continuous: true,
      language: "en-US",
    });
  };

  const stopListening = () => {
    SpeechRecognition.stopListening();
    setIsFirstListening(true);
    previousTranscriptRef.current = "";
  };

  const toggleListening = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs
      .toString()
      .padStart(2, "0")}`;
  };

  const calculateScore = () => {
    return userAnswers.reduce((total, answer) => {
      if (answer.evaluation === "correct") return total + 1;
      if (answer.evaluation === "partial") return total + 0.5;
      if (answer.userAnswer && answer.evaluation === "incorrect")
        return total - 0.25;
      return total;
    }, 0);
  };

  const getEvaluationIcon = (evaluation) => {
    switch (evaluation) {
      case "correct":
        return <CheckCircle className="w-4 h-4" />;
      case "partial":
        return <AlertCircle className="w-4 h-4" />;
      case "incorrect":
        return <XCircle className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getEvaluationText = (evaluation) => {
    switch (evaluation) {
      case "correct":
        return "Correct";
      case "partial":
        return "Partial";
      case "incorrect":
        return "Incorrect";
      default:
        return "Not Evaluated";
    }
  };

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Mock Interview
          </h1>
          <p className="text-gray-600">
            Practice your interview skills with AI feedback
          </p>
        </div>

        <div className="bg-white rounded-lg border border-gray-300 p-6">
          {/* Step 1: User Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 text-center">
                Tell Us About Yourself
              </h2>

              <form onSubmit={handleUserInfoSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, name: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Professional Title *
                    </label>
                    <input
                      type="text"
                      value={userInfo.title}
                      onChange={(e) =>
                        setUserInfo({ ...userInfo, title: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="e.g., Software Engineer"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) =>
                      setUserInfo({ ...userInfo, email: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Continue
                </button>
              </form>
            </div>
          )}

          {/* Step 2: Interview Topic */}
          {step === 2 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 text-center">
                Choose Interview Topic
              </h2>

              <form onSubmit={handleTopicSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Interview Topic *
                  </label>
                  <input
                    type="text"
                    value={interviewTopic}
                    onChange={(e) => setInterviewTopic(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g., React.js, Data Structures"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Continue
                  </button>
                </div>
              </form>
              <div>
                <LiveInterviewBanner></LiveInterviewBanner>
              </div>
            </div>
          )}

          {/* Step 3: Question Count */}
          {step === 3 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-gray-900 text-center">
                Number of Questions
              </h2>

              <form onSubmit={handleQuestionCountSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  {[10, 20, 30].map((count) => (
                    <button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`p-4 border rounded-lg text-center transition-colors ${
                        questionCount === count
                          ? "border-blue-500 bg-blue-50 text-blue-700"
                          : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                      }`}
                    >
                      <div className="font-bold">{count}</div>
                      <div className="text-xs">Questions</div>
                    </button>
                  ))}
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                  >
                    Start Interview
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 4: Active Interview */}
          {step === 4 && isInterviewActive && (
            <div className="space-y-6">
              {/* Interview Header */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 mb-6">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    Mock Interview
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Topic: {interviewTopic}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Timer */}
                  <div
                    className={`flex items-center gap-1 px-3 py-1 rounded text-sm font-medium ${
                      timeRemaining < 30
                        ? "bg-red-100 text-red-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    <Clock className="w-4 h-4" />
                    <span className="font-mono">
                      {formatTime(timeRemaining)}
                    </span>
                  </div>

                  {/* Progress */}
                  <div className="text-sm text-gray-600">
                    {currentQuestion + 1} / {questions.length}
                  </div>

                  {/* Pause/Resume Button */}
                  <button
                    onClick={togglePause}
                    className="p-1 text-gray-600 hover:text-gray-800"
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Current Question */}
              <div className="bg-gray-50 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {questions[currentQuestion]?.question}
                </h3>
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>
                    Time: {formatTime(questions[currentQuestion]?.timeLimit)}
                  </span>
                </div>
              </div>

              {/* Answer Form */}
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Your Answer
                    </label>

                    {/* Voice Recognition Controls */}
                    {isSpeechSupported && (
                      <button
                        type="button"
                        onClick={toggleListening}
                        disabled={isPaused || !isMicrophoneAvailable}
                        className={`flex items-center gap-1 px-2 py-1 rounded text-sm transition-colors ${
                          listening
                            ? "bg-red-100 text-red-700 hover:bg-red-200"
                            : "bg-green-100 text-green-700 hover:bg-green-200"
                        } ${
                          isPaused || !isMicrophoneAvailable
                            ? "opacity-50 cursor-not-allowed"
                            : ""
                        }`}
                      >
                        {listening ? (
                          <>
                            <MicOff className="w-3 h-3" />
                            <span className="text-xs">Stop</span>
                          </>
                        ) : (
                          <>
                            <Mic className="w-3 h-3" />
                            <span className="text-xs">Voice</span>
                          </>
                        )}
                      </button>
                    )}
                  </div>

                  {/* Speech Recognition Status */}
                  {isSpeechSupported && listening && (
                    <div className="mb-2 p-2 bg-blue-50 border border-blue-200 rounded text-sm">
                      <div className="flex items-center gap-1 text-blue-700">
                        <span className="text-xs font-medium">
                          Listening... Speak now
                        </span>
                      </div>
                    </div>
                  )}

                  <textarea
                    ref={textareaRef}
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="Type your answer here or use voice input..."
                    disabled={isPaused}
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-1"
                  >
                    {isPaused ? (
                      <Play className="w-4 h-4" />
                    ) : (
                      <Pause className="w-4 h-4" />
                    )}
                    <span className="text-sm">
                      {isPaused ? "Resume" : "Pause"}
                    </span>
                  </button>

                  <button
                    type="submit"
                    disabled={!currentAnswer.trim() || isPaused || isEvaluating}
                    className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span className="text-sm">
                      {currentQuestion < questions.length - 1
                        ? "Next"
                        : "Finish"}
                    </span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Step 5: Results */}
          {step === 5 && isInterviewCompleted && (
            <div className="space-y-6">
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Interview Results
                </h2>
                <p className="text-gray-600 text-sm">Topic: {interviewTopic}</p>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-green-700 mb-1">
                    {calculateScore().toFixed(1)}
                  </div>
                  <div className="text-xs font-medium text-green-600">
                    Final Score
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
                  <div className="text-xl font-bold text-blue-700 mb-1">
                    {
                      userAnswers.filter(
                        (answer) => answer.evaluation === "correct"
                      ).length
                    }
                  </div>
                  <div className="text-xs font-medium text-blue-600">
                    Correct
                  </div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-4">
                <h3 className="font-bold text-gray-900 text-sm">
                  Questions & Answers
                </h3>

                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  return (
                    <div
                      key={index}
                      className="border border-gray-200 rounded-lg p-4"
                    >
                      <div className="flex items-start gap-3">
                        <div
                          className={`flex-shrink-0 w-6 h-6 rounded flex items-center justify-center ${
                            userAnswer?.evaluation === "correct"
                              ? "bg-green-100 text-green-600"
                              : userAnswer?.evaluation === "partial"
                              ? "bg-blue-100 text-blue-600"
                              : "bg-red-100 text-red-600"
                          }`}
                        >
                          {getEvaluationIcon(userAnswer?.evaluation)}
                        </div>

                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium text-gray-900 text-sm">
                              Q{index + 1}: {question.question}
                            </h4>
                            <span
                              className={`text-xs px-2 py-1 rounded ${
                                userAnswer?.evaluation === "correct"
                                  ? "bg-green-100 text-green-800"
                                  : userAnswer?.evaluation === "partial"
                                  ? "bg-blue-100 text-blue-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {getEvaluationText(userAnswer?.evaluation)}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div>
                              <div className="text-xs font-medium text-gray-700 mb-1">
                                Your Answer:
                              </div>
                              <div className="text-gray-600 bg-gray-50 rounded p-2 text-sm">
                                {userAnswer?.userAnswer || "No answer"}
                              </div>
                            </div>

                            {(userAnswer?.evaluation === "incorrect" ||
                              userAnswer?.evaluation === "partial") && (
                              <div>
                                <div className="text-xs font-medium text-green-700 mb-1">
                                  Expected Answer:
                                </div>
                                <div className="text-green-700 bg-green-50 rounded p-2 text-sm">
                                  {correctAnswers[index]}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Restart Button */}
              <div className="text-center">
                <button
                  onClick={handleRestart}
                  className="bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center gap-2 mx-auto"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>Start New Interview</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;
