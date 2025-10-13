// redux-slices/mockInterviewSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Async thunk to generate interview questions
export const startMockInterview = createAsyncThunk(
  'mockInterview/startMockInterview',
  async ({ userInfo, topic, questionCount, userId }, { rejectWithValue }) => {
    try {
      const questions = await generateInterviewQuestions(topic, questionCount);
      return {
        questions,
        userInfo,
        topic,
        questionCount,
        userId
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to evaluate answer
export const evaluateAnswer = createAsyncThunk(
  'mockInterview/evaluateAnswer',
  async ({ question, userAnswer, correctAnswer, questionIndex }, { rejectWithValue }) => {
    try {
      const evaluation = await checkAnswerCorrectness(question, userAnswer, correctAnswer);
      return { evaluation, questionIndex };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const generateInterviewQuestions = async (topic, count) => {
  const prompt = `
Generate ${count} interview questions about "${topic}". 
For each question, provide:
1. The question text
2. A time limit in seconds (30-180 based on complexity)
3. The expected correct answer

Return in this JSON format:
{
  "questions": [
    {
      "question": "string",
      "timeLimit": number,
      "correctAnswer": "string"
    }
  ]
}

Make questions varied and appropriate for the topic. Include technical, behavioral, and scenario-based questions when relevant.
`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert interview coach. Generate relevant, challenging interview questions."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 4096
  });

  const responseText = completion.choices[0]?.message?.content;
  
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const data = JSON.parse(jsonMatch[0]);
      return data.questions || createDefaultQuestions(topic, count);
    }
    return createDefaultQuestions(topic, count);
  } catch (error) {
    console.error('Error parsing questions:', error);
    return createDefaultQuestions(topic, count);
  }
};

const checkAnswerCorrectness = async (question, userAnswer, correctAnswer) => {
  const prompt = `
Question: "${question}"
Reference Answer: "${correctAnswer}"
User's Answer: "${userAnswer}"

Evaluate if the user's answer demonstrates understanding of the key concepts in the reference answer. Consider:

IMPORTANT EVALUATION CRITERIA:
1. Meaning and understanding - not exact wording
2. Key concepts covered from the reference answer
3. Overall correctness of the information
4. Relevance to the question asked
5. Ignore language differences - evaluate meaning across languages
6. Accept answers in any language if they convey the same meaning

Examples:
- Same meaning in different languages should be ACCEPTED
- Different wording but same concepts should be ACCEPTED
- Partial answers with key points should be PARTIALLY ACCEPTED
- Completely wrong or irrelevant answers should be REJECTED

Return ONLY one of these three responses:
"correct" - if the answer demonstrates good understanding of key concepts
"partial" - if the answer covers some but not all key concepts
"incorrect" - if the answer is wrong or misses all key concepts

Do not add any explanations.
`;

  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: `You are a multilingual interview evaluator. You understand all languages and evaluate based on meaning, not language or exact wording. Be fair and focus on conceptual understanding.`
        },
        {
          role: "user",
          content: prompt
        }
      ],
      model: "llama-3.1-8b-instant",
      temperature: 0.3,
      max_tokens: 20
    });

    const response = completion.choices[0]?.message?.content?.toLowerCase().trim();
    return response === 'correct' ? 'correct' : response === 'partial' ? 'partial' : 'incorrect';
    
  } catch (error) {
    console.error('Error evaluating answer:', error);
    // Fallback: simple keyword matching as backup
    return fallbackEvaluation(question, userAnswer, correctAnswer);
  }
};

// Fallback evaluation method
const fallbackEvaluation = (question, userAnswer, correctAnswer) => {
  // Convert to lowercase for comparison
  const userAnswerLower = userAnswer.toLowerCase();
  const correctAnswerLower = correctAnswer.toLowerCase();
  
  // Extract key words from correct answer (excluding common words)
  const commonWords = new Set(['the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by']);
  const keyWords = correctAnswerLower.split(/\s+/).filter(word => 
    word.length > 3 && !commonWords.has(word)
  );
  
  // Check how many key words are present in user's answer
  const matchingWords = keyWords.filter(word => 
    userAnswerLower.includes(word)
  );
  
  const matchRatio = matchingWords.length / keyWords.length;
  
  if (matchRatio >= 0.7) return 'correct';
  if (matchRatio >= 0.4) return 'partial';
  return 'incorrect';
};

const createDefaultQuestions = (topic, count) => {
  const questions = [];
  for (let i = 0; i < count; i++) {
    questions.push({
      question: `Tell me about your experience with ${topic} and how you've used it in projects?`,
      timeLimit: 120,
      correctAnswer: `This is a sample correct answer for ${topic} question ${i + 1}.`
    });
  }
  return questions;
};

const initialState = {
  // Interview setup
  userInfo: null,
  interviewTopic: '',
  questionCount: 0,
  
  // Interview state
  questions: [],
  currentQuestion: 0,
  userAnswers: [],
  correctAnswers: [],
  timeRemaining: 0,
  isInterviewActive: false,
  isInterviewCompleted: false,
  isEvaluating: false,
  
  // Score and results
  score: 0,
  totalTime: 0,
  
  // UI state
  error: null,
  loading: false
};

const mockInterviewSlice = createSlice({
  name: 'mockInterview',
  initialState,
  reducers: {
    submitAnswer: (state, action) => {
      const { questionIndex, answer, timeSpent } = action.payload;
      const currentQ = state.questions[questionIndex];
      
      // Store user answer - evaluation will happen async
      state.userAnswers[questionIndex] = {
        userAnswer: answer,
        timeSpent,
        evaluation: 'pending', // 'correct', 'partial', 'incorrect'
        score: 0
      };
      
      // Store correct answer for results
      state.correctAnswers[questionIndex] = currentQ.correctAnswer;
      
      // Move to next question or finish
      if (questionIndex < state.questions.length - 1) {
        state.currentQuestion = questionIndex + 1;
        state.timeRemaining = state.questions[questionIndex + 1].timeLimit;
      } else {
        state.isInterviewActive = false;
        state.isInterviewCompleted = true;
      }
    },
    
    setTimer: (state, action) => {
      state.timeRemaining = action.payload;
    },
    
    submitInterview: (state) => {
      state.isInterviewActive = false;
      state.isInterviewCompleted = true;
      
      // Calculate final score with partial credit
      state.score = state.userAnswers.reduce((total, answer) => {
        if (answer.evaluation === 'correct') return total + 1;
        if (answer.evaluation === 'partial') return total + 0.5;
        if (answer.userAnswer && answer.evaluation === 'incorrect') return total - 0.25;
        return total; // No penalty for unanswered questions
      }, 0);
    },
    
    resetInterview: (state) => {
      return initialState;
    },
    
    setPaused: (state, action) => {
      state.isPaused = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Start interview
      .addCase(startMockInterview.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(startMockInterview.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload.questions;
        state.userInfo = action.payload.userInfo;
        state.interviewTopic = action.payload.topic;
        state.questionCount = action.payload.questionCount;
        state.currentQuestion = 0;
        state.timeRemaining = action.payload.questions[0]?.timeLimit || 60;
        state.isInterviewActive = true;
        state.isInterviewCompleted = false;
        state.userAnswers = [];
        state.correctAnswers = [];
        state.score = 0;
      })
      .addCase(startMockInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Evaluate answer
      .addCase(evaluateAnswer.pending, (state) => {
        state.isEvaluating = true;
      })
      .addCase(evaluateAnswer.fulfilled, (state, action) => {
        const { evaluation, questionIndex } = action.payload;
        state.isEvaluating = false;
        if (state.userAnswers[questionIndex]) {
          state.userAnswers[questionIndex].evaluation = evaluation;
          state.userAnswers[questionIndex].score = 
            evaluation === 'correct' ? 1 : 
            evaluation === 'partial' ? 0.5 : 0;
        }
      })
      .addCase(evaluateAnswer.rejected, (state) => {
        state.isEvaluating = false;
      });
  }
});

export const {
  submitAnswer,
  setTimer,
  submitInterview,
  resetInterview,
  setPaused
} = mockInterviewSlice.actions;

export default mockInterviewSlice.reducer;