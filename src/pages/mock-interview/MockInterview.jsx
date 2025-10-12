import React, { useState, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Clock, 
  Play, 
  Pause, 
  SkipForward, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  User,
  Briefcase,
  Mail,
  Target,
  BarChart3,
  Trophy,
  RotateCcw
} from 'lucide-react';
import useAuth from '../../hooks/UseAuth/useAuth';

// Redux actions and selectors
import {
  startMockInterview,
  submitAnswer,
  submitInterview,
  resetInterview,
  setTimer
} from '../../redux-slices/mockInterviewSlice';

import {
  selectInterviewState,
  selectCurrentQuestion,
  selectScore,
  selectTimeRemaining,
  selectIsInterviewActive,
  selectIsInterviewCompleted,
  selectQuestions,
  selectUserAnswers,
  selectCorrectAnswers
} from '../../redux-selectors/mockInterviewSelectors';

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

  // Local state
  const [userInfo, setUserInfo] = useState({
    name: user?.displayName || '',
    title: user?.title || '',
    email: user?.email || ''
  });
  const [interviewTopic, setInterviewTopic] = useState('');
  const [questionCount, setQuestionCount] = useState(10);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [isPaused, setIsPaused] = useState(false);
  const [step, setStep] = useState(1); // 1: User info, 2: Topic, 3: Question count, 4: Interview, 5: Results

  const timerRef = useRef(null);

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
    
    // Start the mock interview
    dispatch(startMockInterview({
      userInfo: { ...userInfo, email: user?.email || userInfo.email },
      topic: interviewTopic,
      questionCount,
      userId: user?.uid
    }));
  };

  const handleAnswerSubmit = (e) => {
    e.preventDefault();
    if (currentAnswer.trim() && isInterviewActive) {
      dispatch(submitAnswer({
        questionIndex: currentQuestion,
        answer: currentAnswer.trim(),
        timeSpent: questions[currentQuestion]?.timeLimit - timeRemaining
      }));
      
      setCurrentAnswer('');
      
      // Move to next question or finish
      if (currentQuestion < questions.length - 1) {
        // Next question logic is handled in the slice
      } else {
        handleFinishInterview();
      }
    }
  };

  const handleAutoSubmit = () => {
    if (isInterviewActive) {
      dispatch(submitAnswer({
        questionIndex: currentQuestion,
        answer: '', // Empty answer for timeout
        timeSpent: questions[currentQuestion]?.timeLimit
      }));
      
      setCurrentAnswer('');
      
      if (currentQuestion < questions.length - 1) {
        // Next question logic is handled in the slice
      } else {
        handleFinishInterview();
      }
    }
  };

  const handleFinishInterview = () => {
    dispatch(submitInterview());
    setStep(5);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const handleRestart = () => {
    dispatch(resetInterview());
    setStep(1);
    setUserInfo({
      name: user?.displayName || '',
      title: user?.title || '',
      email: user?.email || ''
    });
    setInterviewTopic('');
    setQuestionCount(10);
    setCurrentAnswer('');
    setIsPaused(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  const togglePause = () => {
    setIsPaused(!isPaused);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateScore = () => {
    return userAnswers.reduce((total, answer, index) => {
      if (answer.isCorrect) return total + 1;
      if (answer.userAnswer && !answer.isCorrect) return total - 0.25;
      return total;
    }, 0);
  };

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 12
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2 shadow-sm mb-6"
            whileHover={{ scale: 1.05 }}
          >
            <Trophy className="w-4 h-4 text-amber-600" />
            <span className="text-sm font-semibold text-amber-700">AI-Powered Mock Interview</span>
          </motion.div>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
            AI Mock
            <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Interview
            </span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Practice your interview skills with AI and get instant feedback on your performance.
          </p>
        </motion.div>

        <div className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8">
          {/* Step 1: User Information */}
          {step === 1 && (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-6"
            >
              <motion.h2 variants={itemVariants} className="text-2xl font-bold text-gray-900 text-center">
                Tell Us About Yourself
              </motion.h2>

              <motion.form variants={itemVariants} onSubmit={handleUserInfoSubmit} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <User className="w-4 h-4" />
                      <span>Full Name *</span>
                    </label>
                    <input
                      type="text"
                      value={userInfo.name}
                      onChange={(e) => setUserInfo({...userInfo, name: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="Enter your full name"
                      required
                    />
                  </div>

                  <div>
                    <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                      <Briefcase className="w-4 h-4" />
                      <span>Professional Title *</span>
                    </label>
                    <input
                      type="text"
                      value={userInfo.title}
                      onChange={(e) => setUserInfo({...userInfo, title: e.target.value})}
                      className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                      placeholder="e.g., Software Engineer, Product Manager"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Mail className="w-4 h-4" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    value={userInfo.email}
                    onChange={(e) => setUserInfo({...userInfo, email: e.target.value})}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="your.email@example.com"
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  variants={itemVariants}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Continue to Interview Setup
                </motion.button>
              </motion.form>
            </motion.div>
          )}

          {/* Step 2: Interview Topic */}
          {step === 2 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Choose Your Interview Topic
              </h2>

              <form onSubmit={handleTopicSubmit} className="space-y-6">
                <div>
                  <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 mb-2">
                    <Target className="w-4 h-4" />
                    <span>Interview Topic *</span>
                  </label>
                  <input
                    type="text"
                    value={interviewTopic}
                    onChange={(e) => setInterviewTopic(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholder="e.g., React.js, Data Structures, Product Management, Behavioral Questions"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-2">
                    Be specific about the skills or domain you want to be interviewed on.
                  </p>
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(1)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Continue
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 3: Question Count */}
          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-gray-900 text-center">
                Select Number of Questions
              </h2>

              <form onSubmit={handleQuestionCountSubmit} className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  {[10, 20, 30].map((count) => (
                    <motion.button
                      key={count}
                      type="button"
                      onClick={() => setQuestionCount(count)}
                      className={`p-6 border-2 rounded-2xl text-center transition-all duration-200 ${
                        questionCount === count
                          ? 'border-blue-500 bg-blue-50 text-blue-700'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                      }`}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <div className="text-2xl font-bold">{count}</div>
                      <div className="text-sm">Questions</div>
                    </motion.button>
                  ))}
                </div>

                <p className="text-center text-gray-600">
                  Each question will have a time limit based on its complexity.
                </p>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={() => setStep(2)}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                  >
                    Back
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                  >
                    Start Interview
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 4: Active Interview */}
          {step === 4 && isInterviewActive && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              {/* Interview Header */}
              <div className="flex justify-between items-center mb-8">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Mock Interview</h2>
                  <p className="text-gray-600">Topic: {interviewTopic}</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* Timer */}
                  <div className={`flex items-center space-x-2 px-4 py-2 rounded-full ${
                    timeRemaining < 30 ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    <Clock className="w-4 h-4" />
                    <span className="font-mono font-bold">{formatTime(timeRemaining)}</span>
                  </div>

                  {/* Progress */}
                  <div className="text-sm text-gray-600">
                    Question {currentQuestion + 1} of {questions.length}
                  </div>

                  {/* Pause/Resume Button */}
                  <button
                    onClick={togglePause}
                    className="p-2 text-gray-600 hover:text-gray-800 transition-colors duration-200"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </button>
                </div>
              </div>

              {/* Current Question */}
              <div className="bg-gray-50 rounded-2xl p-6 mb-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  {questions[currentQuestion]?.question}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>Time limit: {formatTime(questions[currentQuestion]?.timeLimit)}</span>
                </div>
              </div>

              {/* Answer Form */}
              <form onSubmit={handleAnswerSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Your Answer
                  </label>
                  <textarea
                    value={currentAnswer}
                    onChange={(e) => setCurrentAnswer(e.target.value)}
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                    placeholder="Type your answer here..."
                    disabled={isPaused}
                  />
                </div>

                <div className="flex space-x-4">
                  <button
                    type="button"
                    onClick={togglePause}
                    className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 flex items-center justify-center space-x-2"
                  >
                    {isPaused ? <Play className="w-4 h-4" /> : <Pause className="w-4 h-4" />}
                    <span>{isPaused ? 'Resume' : 'Pause'}</span>
                  </button>
                  
                  <button
                    type="submit"
                    disabled={!currentAnswer.trim() || isPaused}
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    <SkipForward className="w-4 h-4" />
                    <span>
                      {currentQuestion < questions.length - 1 ? 'Next Question' : 'Finish Interview'}
                    </span>
                  </button>
                </div>
              </form>
            </motion.div>
          )}

          {/* Step 5: Results */}
          {step === 5 && isInterviewCompleted && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-8"
            >
              <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-4">Interview Results</h2>
                <p className="text-gray-600">Topic: {interviewTopic}</p>
              </div>

              {/* Score Summary */}
              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="bg-green-50 border border-green-200 rounded-2xl p-6 text-center">
                  <div className="text-2xl font-bold text-green-700 mb-2">{calculateScore().toFixed(2)}</div>
                  <div className="text-sm font-medium text-green-600">Final Score</div>
                </div>
                
                <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 text-center">
                  <div className="text-2xl font-bold text-blue-700 mb-2">
                    {userAnswers.filter(answer => answer.isCorrect).length}
                  </div>
                  <div className="text-sm font-medium text-blue-600">Correct Answers</div>
                </div>
                
                <div className="bg-orange-50 border border-orange-200 rounded-2xl p-6 text-center">
                  <div className="text-2xl font-bold text-orange-700 mb-2">
                    {userAnswers.filter(answer => answer.userAnswer && !answer.isCorrect).length}
                  </div>
                  <div className="text-sm font-medium text-orange-600">Wrong Answers</div>
                </div>
              </div>

              {/* Detailed Results */}
              <div className="space-y-6">
                <h3 className="text-xl font-bold text-gray-900 flex items-center space-x-2">
                  <BarChart3 className="w-5 h-5" />
                  <span>Detailed Breakdown</span>
                </h3>

                {questions.map((question, index) => {
                  const userAnswer = userAnswers[index];
                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                      className="border border-gray-200 rounded-2xl p-6"
                    >
                      <div className="flex items-start space-x-4">
                        <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                          userAnswer?.isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                        }`}>
                          {userAnswer?.isCorrect ? (
                            <CheckCircle className="w-4 h-4" />
                          ) : (
                            <XCircle className="w-4 h-4" />
                          )}
                        </div>
                        
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-2">
                            Q{index + 1}: {question.question}
                          </h4>
                          
                          <div className="space-y-3">
                            <div>
                              <div className="text-sm font-medium text-gray-700 mb-1">Your Answer:</div>
                              <div className="text-gray-600 bg-gray-50 rounded-lg p-3">
                                {userAnswer?.userAnswer || 'No answer provided'}
                              </div>
                            </div>

                            {!userAnswer?.isCorrect && (
                              <div>
                                <div className="text-sm font-medium text-green-700 mb-1 flex items-center space-x-1">
                                  <CheckCircle className="w-4 h-4" />
                                  <span>Correct Answer:</span>
                                </div>
                                <div className="text-green-700 bg-green-50 rounded-lg p-3">
                                  {correctAnswers[index]}
                                </div>
                              </div>
                            )}

                            <div className="flex justify-between text-sm text-gray-500">
                              <span>Time spent: {userAnswer?.timeSpent || 0}s</span>
                              <span>Score: {userAnswer?.isCorrect ? '+1' : userAnswer?.userAnswer ? '-0.25' : '0'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>

              {/* Restart Button */}
              <div className="text-center">
                <button
                  onClick={handleRestart}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2 mx-auto"
                >
                  <RotateCcw className="w-5 h-5" />
                  <span>Start New Interview</span>
                </button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MockInterview;