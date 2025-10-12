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
  async ({ question, userAnswer, correctAnswer }, { rejectWithValue }) => {
    try {
      const isCorrect = await checkAnswerCorrectness(question, userAnswer, correctAnswer);
      return { isCorrect };
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
Correct Answer: "${correctAnswer}"
User's Answer: "${userAnswer}"

Evaluate if the user's answer is essentially correct. Consider:
- Key concepts covered
- Overall understanding
- Relevance to the question

Return ONLY "true" or "false" without any additional text.
`;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a fair interview evaluator. Be reasonable but strict in evaluation."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.3,
    max_tokens: 10
  });

  const response = completion.choices[0]?.message?.content?.toLowerCase().trim();
  return response === 'true';
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
      
      // Store user answer
      state.userAnswers[questionIndex] = {
        userAnswer: answer,
        timeSpent,
        isCorrect: false // Will be evaluated async
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
      
      // Calculate final score
      state.score = state.userAnswers.reduce((total, answer, index) => {
        if (answer.isCorrect) return total + 1;
        if (answer.userAnswer && !answer.isCorrect) return total - 0.25;
        return total;
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
      })
      .addCase(startMockInterview.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      
      // Evaluate answer
      .addCase(evaluateAnswer.fulfilled, (state, action) => {
        const { isCorrect } = action.payload;
        if (state.userAnswers[state.currentQuestion - 1]) {
          state.userAnswers[state.currentQuestion - 1].isCorrect = isCorrect;
        }
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