// learningPathSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

export const generateLearningPath = createAsyncThunk(
  'learningPath/generateLearningPath',
  async ({ topic, currentLevel = 'beginner', goal = 'mastery', timeframe = '6 months' }, { rejectWithValue }) => {
    try {
      const learningPath = await generateLearningPathWithAI(topic, currentLevel, goal, timeframe);
      return learningPath;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const generateLearningPathWithAI = async (topic, currentLevel, goal, timeframe) => {
  const prompt = createLearningPathPrompt(topic, currentLevel, goal, timeframe);

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert career counselor and learning path designer. 
        Create structured, practical learning paths for various career fields and topics.
        Provide realistic timelines, clear milestones, and actionable steps.`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 4096,
    stream: false
  });

  const responseText = completion.choices[0]?.message?.content;
  return parseLearningPathResponse(responseText, topic);
};

const createLearningPathPrompt = (topic, currentLevel, goal, timeframe) => {
  return `
Create a comprehensive learning path for someone who wants to learn: "${topic}"

CURRENT LEVEL: ${currentLevel}
GOAL: ${goal}
TIMEFRAME: ${timeframe}

Please provide a structured learning path with the following information:

LEARNING PATH DETAILS:
- Topic overview and importance
- Prerequisites (if any)
- Step-by-step learning stages
- Resources and tools recommendations
- Projects and practical applications
- Assessment methods
- Career opportunities

PROGRESS METRICS:
- Weekly progress expectations
- Key milestones
- Skills to acquire at each stage

RETURN IN THIS JSON FORMAT:
{
  "topic": "${topic}",
  "currentLevel": "${currentLevel}",
  "goal": "${goal}",
  "timeframe": "${timeframe}",
  "overview": "Brief overview of the topic and its importance",
  "prerequisites": ["prerequisite1", "prerequisite2", ...],
  "stages": [
    {
      "stage": "Stage 1 Name",
      "duration": "X weeks",
      "skills": ["skill1", "skill2", ...],
      "topics": ["topic1", "topic2", ...],
      "resources": ["resource1", "resource2", ...],
      "projects": ["project1", "project2", ...],
      "milestone": "What should be achieved by end of this stage"
    }
  ],
  "weeklyProgress": [
    {
      "week": 1,
      "focus": "Main focus for this week",
      "tasks": ["task1", "task2", ...],
      "completionCriteria": "How to know you've completed this week successfully"
    }
  ],
  "careerOpportunities": ["role1", "role2", ...],
  "resources": {
    "free": ["free_resource1", "free_resource2", ...],
    "paid": ["paid_resource1", "paid_resource2", ...],
    "tools": ["tool1", "tool2", ...],
    "communities": ["community1", "community2", ...]
  },
  "progressMetrics": {
    "totalWeeks": 24,
    "milestones": [
      {
        "week": 4,
        "title": "Milestone 1",
        "description": "What should be achieved",
        "progressPercentage": 25
      }
    ]
  }
}

Make the learning path practical, actionable, and tailored to the specified timeframe and goals.`;
};

const parseLearningPathResponse = (responseText, topic) => {
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const learningPath = JSON.parse(jsonMatch[0]);
      return validateLearningPath(learningPath, topic);
    }
    return createDefaultLearningPath(topic);
  } catch (error) {
    console.error('Error parsing learning path response:', error);
    return createDefaultLearningPath(topic);
  }
};

const validateLearningPath = (learningPath, topic) => {
  const validated = {
    topic: learningPath.topic || topic,
    currentLevel: learningPath.currentLevel || 'beginner',
    goal: learningPath.goal || 'mastery',
    timeframe: learningPath.timeframe || '6 months',
    overview: learningPath.overview || `Learning path for ${topic}`,
    prerequisites: Array.isArray(learningPath.prerequisites) ? learningPath.prerequisites : ['Basic computer literacy'],
    stages: Array.isArray(learningPath.stages) ? learningPath.stages : createDefaultStages(topic),
    weeklyProgress: Array.isArray(learningPath.weeklyProgress) ? learningPath.weeklyProgress : createDefaultWeeklyProgress(),
    careerOpportunities: Array.isArray(learningPath.careerOpportunities) ? learningPath.careerOpportunities : [`${topic} Specialist`],
    resources: learningPath.resources || createDefaultResources(),
    progressMetrics: learningPath.progressMetrics || createDefaultProgressMetrics()
  };
  return validated;
};

const createDefaultLearningPath = (topic) => {
  return {
    topic,
    currentLevel: 'beginner',
    goal: 'mastery',
    timeframe: '6 months',
    overview: `Comprehensive learning path for ${topic}`,
    prerequisites: ['Basic computer literacy', 'Internet access'],
    stages: createDefaultStages(topic),
    weeklyProgress: createDefaultWeeklyProgress(),
    careerOpportunities: [`${topic} Developer`, `${topic} Analyst`],
    resources: createDefaultResources(),
    progressMetrics: createDefaultProgressMetrics()
  };
};

const createDefaultStages = (topic) => [
  {
    stage: "Foundation",
    duration: "4 weeks",
    skills: ["Basic concepts", "Fundamental principles"],
    topics: ["Introduction", "Core concepts"],
    resources: ["Online tutorials", "Documentation"],
    projects: ["Simple practice project"],
    milestone: "Understand basic concepts"
  }
];

const createDefaultWeeklyProgress = () => [
  {
    week: 1,
    focus: "Getting started",
    tasks: ["Research basics", "Set up environment"],
    completionCriteria: "Basic understanding achieved"
  }
];

const createDefaultResources = () => ({
  free: ["YouTube tutorials", "Free online courses"],
  paid: ["Udemy courses", "Books"],
  tools: ["Required software", "Development tools"],
  communities: ["Online forums", "Discord groups"]
});

const createDefaultProgressMetrics = () => ({
  totalWeeks: 24,
  milestones: [
    {
      week: 4,
      title: "Basic Proficiency",
      description: "Understand fundamental concepts",
      progressPercentage: 25
    }
  ]
});

const initialState = {
  userTopic: '',
  currentLevel: 'beginner',
  goal: 'mastery',
  timeframe: '6 months',
  learningPath: null,
  isLoading: false,
  error: null,
  generatedPaths: []
};

const learningPathSlice = createSlice({
  name: 'learningPath',
  initialState,
  reducers: {
    setUserTopic: (state, action) => {
      state.userTopic = action.payload;
    },
    setCurrentLevel: (state, action) => {
      state.currentLevel = action.payload;
    },
    setGoal: (state, action) => {
      state.goal = action.payload;
    },
    setTimeframe: (state, action) => {
      state.timeframe = action.payload;
    },
    clearLearningPath: (state) => {
      state.learningPath = null;
      state.error = null;
    },
    saveLearningPath: (state) => {
      if (state.learningPath) {
        state.generatedPaths.push({
          ...state.learningPath,
          savedAt: new Date().toISOString(),
          id: Date.now().toString()
        });
      }
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(generateLearningPath.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(generateLearningPath.fulfilled, (state, action) => {
        state.isLoading = false;
        state.learningPath = action.payload;
      })
      .addCase(generateLearningPath.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  }
});

export const {
  setUserTopic,
  setCurrentLevel,
  setGoal,
  setTimeframe,
  clearLearningPath,
  saveLearningPath
} = learningPathSlice.actions;

export default learningPathSlice.reducer;