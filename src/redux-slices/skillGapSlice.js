import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: import.meta.env.VITE_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Async thunk to get skills for a sector
export const getSkillsForSector = createAsyncThunk(
  'skillGap/getSkillsForSector',
  async (sector, { rejectWithValue }) => {
    try {
      const skills = await fetchSkillsFromAI(sector);
      return skills;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk to analyze skill gap
export const analyzeSkillGap = createAsyncThunk(
  'skillGap/analyzeSkillGap',
  async ({ sector, userSkills }, { rejectWithValue }) => {
    try {
      const analysis = await analyzeSkillsWithAI(sector, userSkills);
      return analysis;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// AI function to fetch skills for a sector
const fetchSkillsFromAI = async (sector) => {
  const prompt = `
    Based on the sector "${sector}", provide a comprehensive list of essential technologies, tools, and skills required in 2024.
    Return ONLY a JSON array of skill objects with this exact structure:
    
    [
      {
        "name": "Skill Name",
        "category": "Frontend/Backend/Database/DevOps/etc",
        "importance": "High/Medium/Low",
        "description": "Brief description of why this skill is important"
      }
    ]
    
    Include 15-20 of the most relevant and current skills. Be specific and practical.
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are a career advisor and technology expert. Provide accurate, current skill requirements for different sectors."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.7,
    max_tokens: 2048,
    stream: false
  });

  const response = completion.choices[0]?.message?.content;
  
  try {
    const jsonMatch = response.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return getDefaultSkills(sector);
  } catch (error) {
    console.error('Error parsing skills response:', error);
    return getDefaultSkills(sector);
  }
};

// AI function to analyze skill gap
const analyzeSkillsWithAI = async (sector, userSkills) => {
  const skillsData = JSON.stringify(userSkills, null, 2);
  
  const prompt = `
    Analyze the skill gap for someone in the "${sector}" sector with the following self-assessed skills:
    
    ${skillsData}
    
    Provide a comprehensive skill gap analysis with this exact JSON structure:
    
    {
      "overallScore": 85,
      "sectorReadiness": "Advanced/Beginner/Intermediate",
      "strengths": ["array of strengths"],
      "gaps": ["array of skill gaps"],
      "recommendations": ["array of recommendations"],
      "comparison": {
        "industryAverage": 75,
        "userScore": 85,
        "percentile": 80
      },
      "categoryAnalysis": [
        {
          "category": "Frontend",
          "score": 85,
          "status": "Strong/Weak/Average"
        }
      ],
      "learningPath": [
        {
          "skill": "Skill Name",
          "priority": "High/Medium/Low",
          "resources": ["resource1", "resource2"],
          "timeline": "1-2 months"
        }
      ]
    }
    
    Be honest and constructive in the assessment. Compare against industry standards for 2024.
  `;

  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: "You are an expert career coach and technology analyst. Provide accurate skill gap analysis and practical recommendations."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.5,
    max_tokens: 4096,
    stream: false
  });

  const response = completion.choices[0]?.message?.content;
  
  try {
    const jsonMatch = response.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      return JSON.parse(jsonMatch[0]);
    }
    return createDefaultAnalysis(sector, userSkills);
  } catch (error) {
    console.error('Error parsing analysis response:', error);
    return createDefaultAnalysis(sector, userSkills);
  }
};

// Default skills fallback
const getDefaultSkills = (sector) => {
  const defaultSkills = {
    'web development': [
      { name: "React", category: "Frontend", importance: "High", description: "Modern frontend library for building user interfaces" },
      { name: "Node.js", category: "Backend", importance: "High", description: "JavaScript runtime for server-side development" },
      { name: "MongoDB", category: "Database", importance: "Medium", description: "NoSQL database for modern applications" },
      { name: "Express.js", category: "Backend", importance: "High", description: "Web application framework for Node.js" },
      { name: "Git", category: "Tools", importance: "High", description: "Version control system essential for collaboration" }
    ],
    'data science': [
      { name: "Python", category: "Programming", importance: "High", description: "Primary language for data analysis and ML" },
      { name: "Pandas", category: "Data Analysis", importance: "High", description: "Data manipulation and analysis library" },
      { name: "SQL", category: "Database", importance: "High", description: "Essential for data querying and management" },
      { name: "Machine Learning", category: "AI/ML", importance: "High", description: "Core competency for predictive modeling" },
      { name: "Data Visualization", category: "Analysis", importance: "Medium", description: "Communicating insights through charts and graphs" }
    ]
  };

  return defaultSkills[sector.toLowerCase()] || [
    { name: "Communication", category: "Soft Skills", importance: "High", description: "Essential for team collaboration" },
    { name: "Problem Solving", category: "Soft Skills", importance: "High", description: "Critical thinking and analytical skills" },
    { name: "Technical Fundamentals", category: "Core", importance: "High", description: "Basic technical knowledge for the sector" }
  ];
};

// Default analysis fallback
const createDefaultAnalysis = (sector, userSkills) => {
  const totalSkills = userSkills.length;
  const proficientSkills = userSkills.filter(skill => 
    ['moderate', 'expert'].includes(skill.proficiency)
  ).length;
  
  const score = Math.round((proficientSkills / totalSkills) * 100);

  return {
    overallScore: score,
    sectorReadiness: score >= 80 ? "Advanced" : score >= 60 ? "Intermediate" : "Beginner",
    strengths: ["Willingness to learn and assess skills"],
    gaps: ["Continue building practical experience"],
    recommendations: ["Focus on hands-on projects", "Network with professionals in the field"],
    comparison: {
      industryAverage: 70,
      userScore: score,
      percentile: Math.min(90, Math.max(10, score - 10))
    },
    categoryAnalysis: [],
    learningPath: []
  };
};

const initialState = {
  sector: '',
  availableSkills: [],
  userSkills: [],
  analysis: null,
  isLoading: false,
  isAnalyzing: false,
  error: null,
  currentStep: 1 // 1: Sector input, 2: Skills assessment, 3: Results
};

const skillGapSlice = createSlice({
  name: 'skillGap',
  initialState,
  reducers: {
    setSector: (state, action) => {
      state.sector = action.payload;
    },
    setUserSkill: (state, action) => {
      const { skillName, proficiency } = action.payload;
      const existingIndex = state.userSkills.findIndex(skill => skill.name === skillName);
      
      if (existingIndex >= 0) {
        if (proficiency === 'none') {
          state.userSkills.splice(existingIndex, 1);
        } else {
          state.userSkills[existingIndex].proficiency = proficiency;
        }
      } else if (proficiency !== 'none') {
        const skillData = state.availableSkills.find(skill => skill.name === skillName);
        if (skillData) {
          state.userSkills.push({
            ...skillData,
            proficiency
          });
        }
      }
    },
    setCurrentStep: (state, action) => {
      state.currentStep = action.payload;
    },
    resetSkillGap: (state) => {
      return initialState;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Get skills for sector
      .addCase(getSkillsForSector.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getSkillsForSector.fulfilled, (state, action) => {
        state.isLoading = false;
        state.availableSkills = action.payload;
        state.userSkills = [];
        state.currentStep = 2;
      })
      .addCase(getSkillsForSector.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      // Analyze skill gap
      .addCase(analyzeSkillGap.pending, (state) => {
        state.isAnalyzing = true;
        state.error = null;
      })
      .addCase(analyzeSkillGap.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.analysis = action.payload;
        state.currentStep = 3;
      })
      .addCase(analyzeSkillGap.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.error = action.payload;
      });
  }
});

export const {
  setSector,
  setUserSkill,
  setCurrentStep,
  resetSkillGap,
  clearError
} = skillGapSlice.actions;

export default skillGapSlice.reducer;