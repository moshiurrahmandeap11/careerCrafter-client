import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export const analyzeResume = createAsyncThunk(
  'resumeCheck/analyzeResume',
  async ({ file, jobDescription = '' }, { rejectWithValue }) => {
    try {
      const text = await readFileAsText(file);
      const analysis = await analyzeWithAI(text, jobDescription);
      return analysis;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = (error) => reject(error);
    if (file.type === 'application/pdf') {
      // For PDF files, we'll use a simplified text extraction
      // In a real app, you'd want to use pdf-parse library
      resolve(`PDF Content: ${file.name} - Please use text format for better analysis`);
    } else {
      reader.readAsText(file);
    }
  });
};

const analyzeWithAI = async (resumeText, jobDescription = '') => {
  const prompt = createEnhancedAnalysisPrompt(resumeText, jobDescription);
  
  const completion = await groq.chat.completions.create({
    messages: [
      {
        role: "system",
        content: `You are an expert ATS (Applicant Tracking System) analyzer and professional resume coach. 
        Analyze resumes thoroughly and provide accurate scores based on real ATS criteria including:
        - Keyword optimization and relevance
        - Formatting and structure compliance
        - Content quality and impact
        - Readability and scannability
        - Section completeness
        - ATS compatibility factors`
      },
      {
        role: "user",
        content: prompt
      }
    ],
    model: "llama-3.1-8b-instant",
    temperature: 0.3, // Lower temperature for more consistent scoring
    max_tokens: 4096,
    stream: false
  });

  const analysisText = completion.choices[0]?.message?.content;
  return parseEnhancedAIResponse(analysisText, resumeText, jobDescription);
};

const createEnhancedAnalysisPrompt = (resumeText, jobDescription) => {
  const basePrompt = `
CRITICAL: You MUST analyze the resume based on REAL ATS scanning criteria and return ONLY valid JSON.

RESUME TO ANALYZE:
"""
${resumeText.substring(0, 3500)}${resumeText.length > 3500 ? '... [content truncated for analysis]' : ''}
"""

${jobDescription ? `
TARGET JOB DESCRIPTION:
"""
${jobDescription.substring(0, 1500)}${jobDescription.length > 1500 ? '... [description truncated]' : ''}
"""
` : ''}

ANALYSIS CRITERIA:

1. ATS SCORE (0-100): Based on:
   - Keyword density and relevance ${jobDescription ? 'to the job description' : ''}
   - Standard section presence (Contact, Experience, Education, Skills)
   - Formatting compatibility (no tables, columns, graphics)
   - File format and parsing compatibility
   - Header structure and organization

2. OVERALL SCORE (0-100): Based on:
   - Content quality and impact
   - Achievement quantification
   - Professional presentation
   - Readability and clarity
   - Action verb usage

3. CATEGORY SCORES (0-100 each):
   - content: Quality of experience descriptions and achievements
   - formatting: ATS-friendly structure and layout
   - keywords: Relevant keyword usage and optimization
   - readability: Language clarity and scannability
   - sections: Completeness of essential resume sections

4. KEYWORD ANALYSIS:
   - Analyze missing critical keywords ${jobDescription ? 'from the job description' : 'for the industry'}
   - Identify properly used keywords
   - Recommend additional relevant keywords

5. STRENGTHS & IMPROVEMENTS:
   - Provide specific, actionable feedback
   - Focus on ATS optimization opportunities
   - Suggest concrete improvements

RETURN STRICTLY IN THIS JSON FORMAT:
{
  "atsScore": number (0-100),
  "overallScore": number (0-100),
  "categoryScores": {
    "content": number (0-100),
    "formatting": number (0-100),
    "keywords": number (0-100),
    "readability": number (0-100),
    "sections": number (0-100)
  },
  "strengths": ["string1", "string2", ...],
  "improvements": ["string1", "string2", ...],
  "keywordAnalysis": {
    "missingKeywords": ["keyword1", "keyword2", ...],
    "foundKeywords": ["keyword1", "keyword2", ...],
    "recommendedKeywords": ["keyword1", "keyword2", ...]
  },
  "summary": "string",
  "aiSuggestions": ["string1", "string2", ...],
  "analysisDetails": {
    "hasQuantifiableAchievements": boolean,
    "hasActionVerbs": boolean,
    "hasProfessionalSummary": boolean,
    "contactInfoComplete": boolean,
    "sectionsPresent": ["experience", "education", "skills", ...],
    "formattingIssues": ["string1", "string2", ...]
  }
}

Be brutally honest and accurate in scoring. Base scores on real ATS requirements.`;

  return basePrompt;
};

const parseEnhancedAIResponse = (responseText, resumeText, jobDescription) => {
  try {
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const analysis = JSON.parse(jsonMatch[0]);
      
      // Validate and ensure all required fields exist
      return validateAnalysis(analysis, resumeText, jobDescription);
    }
    
    return createDynamicDefaultAnalysis(resumeText, jobDescription);
  } catch (error) {
    console.error('Error parsing AI response:', error);
    return createDynamicDefaultAnalysis(resumeText, jobDescription);
  }
};

const validateAnalysis = (analysis, resumeText, jobDescription) => {
  // Ensure all required fields exist with proper fallbacks
  const validated = {
    atsScore: Math.min(100, Math.max(0, analysis.atsScore || calculateDynamicATSScore(resumeText))),
    overallScore: Math.min(100, Math.max(0, analysis.overallScore || 70)),
    categoryScores: {
      content: analysis.categoryScores?.content || 70,
      formatting: analysis.categoryScores?.formatting || 75,
      keywords: analysis.categoryScores?.keywords || 65,
      readability: analysis.categoryScores?.readability || 80,
      sections: analysis.categoryScores?.sections || 75,
      ...analysis.categoryScores
    },
    strengths: Array.isArray(analysis.strengths) ? analysis.strengths : ['Resume successfully analyzed'],
    improvements: Array.isArray(analysis.improvements) ? analysis.improvements : ['Check resume formatting'],
    keywordAnalysis: {
      missingKeywords: Array.isArray(analysis.keywordAnalysis?.missingKeywords) ? analysis.keywordAnalysis.missingKeywords : [],
      foundKeywords: Array.isArray(analysis.keywordAnalysis?.foundKeywords) ? analysis.keywordAnalysis.foundKeywords : [],
      recommendedKeywords: Array.isArray(analysis.keywordAnalysis?.recommendedKeywords) ? analysis.keywordAnalysis.recommendedKeywords : [],
      ...analysis.keywordAnalysis
    },
    summary: analysis.summary || 'AI analysis completed with dynamic scoring.',
    aiSuggestions: Array.isArray(analysis.aiSuggestions) ? analysis.aiSuggestions : ['Review and optimize your resume content'],
    analysisDetails: analysis.analysisDetails || generateAnalysisDetails(resumeText)
  };

  return validated;
};

const calculateDynamicATSScore = (resumeText) => {
  let score = 50; // Base score
  
  // Simple heuristic scoring based on content analysis
  const lines = resumeText.split('\n');
  const wordCount = resumeText.split(/\s+/).length;
  
  // Check for essential sections
  const sections = ['experience', 'education', 'skills', 'summary', 'contact'];
  const foundSections = sections.filter(section => 
    resumeText.toLowerCase().includes(section)
  );
  
  // Adjust score based on findings
  score += foundSections.length * 5; // +5 for each essential section
  score += Math.min(wordCount / 50, 20); // Reward appropriate length
  score += (resumeText.includes('@') && resumeText.match(/\d/)) ? 10 : 0; // Contact info
  
  return Math.min(95, Math.max(30, score));
};

const generateAnalysisDetails = (resumeText) => {
  const text = resumeText.toLowerCase();
  return {
    hasQuantifiableAchievements: /\d+%|\$|\d+\.?\d*|\b(increased|decreased|improved|reduced)\b/.test(text),
    hasActionVerbs: /\b(managed|led|developed|created|implemented|achieved)\b/.test(text),
    hasProfessionalSummary: /\b(summary|objective|profile)\b/.test(text),
    contactInfoComplete: text.includes('@') && text.match(/\d/),
    sectionsPresent: ['experience', 'education', 'skills'].filter(section => text.includes(section)),
    formattingIssues: text.includes('\t') ? ['Avoid using tabs'] : []
  };
};

const createDynamicDefaultAnalysis = (resumeText, jobDescription) => {
  const dynamicScore = calculateDynamicATSScore(resumeText);
  
  return {
    atsScore: dynamicScore,
    overallScore: dynamicScore + 5,
    categoryScores: {
      content: 70,
      formatting: 75,
      keywords: 65,
      readability: 80,
      sections: 75
    },
    strengths: ['Resume uploaded successfully', 'Basic structure present'],
    improvements: ['Add more quantifiable achievements', 'Include relevant keywords'],
    keywordAnalysis: {
      missingKeywords: jobDescription ? extractKeywords(jobDescription).slice(0, 5) : ['technical', 'skills', 'experience'],
      foundKeywords: extractKeywords(resumeText).slice(0, 5),
      recommendedKeywords: ['achievements', 'results', 'leadership']
    },
    summary: 'Basic analysis completed. Consider enhancing with specific achievements and targeted keywords.',
    aiSuggestions: [
      'Use more action verbs to start bullet points',
      'Include numbers to quantify achievements',
      'Tailor keywords to match target job descriptions'
    ],
    analysisDetails: generateAnalysisDetails(resumeText)
  };
};

const extractKeywords = (text) => {
  // Simple keyword extraction
  const words = text.toLowerCase().match(/\b[a-z]{4,}\b/g) || [];
  const commonWords = new Set(['the', 'and', 'for', 'with', 'this', 'that', 'have', 'from']);
  
  return [...new Set(words.filter(word => 
    !commonWords.has(word) && word.length > 3
  ))].slice(0, 10);
};

// Fixed initial state - uploadedFile now stores metadata only
const initialState = {
  uploadedFile: null, // This will store serializable file metadata
  analysis: null,
  isAnalyzing: false,
  analysisError: null,
  jobDescription: '',
  toast: {
    show: false,
    message: '',
    type: 'success'
  }
};

const resumeCheckSlice = createSlice({
  name: 'resumeCheck',
  initialState,
  reducers: {
    setUploadedFile: (state, action) => {
      const file = action.payload;
      if (file) {
        // Store only serializable metadata instead of the File object
        state.uploadedFile = {
          name: file.name,
          size: file.size,
          type: file.type,
          lastModified: file.lastModified,
        };
      } else {
        state.uploadedFile = null;
      }
      state.analysis = null;
      state.analysisError = null;
    },
    setJobDescription: (state, action) => {
      state.jobDescription = action.payload;
    },
    clearAnalysis: (state) => {
      state.analysis = null;
      state.uploadedFile = null;
      state.analysisError = null;
    },
    showToast: (state, action) => {
      state.toast = { ...action.payload, show: true };
    },
    hideToast: (state) => {
      state.toast = { show: false, message: '', type: 'success' };
    },
    resetResumeCheck: (state) => {
      return initialState;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(analyzeResume.pending, (state) => {
        state.isAnalyzing = true;
        state.analysisError = null;
        state.toast = { show: false, message: '', type: 'success' };
      })
      .addCase(analyzeResume.fulfilled, (state, action) => {
        state.isAnalyzing = false;
        state.analysis = action.payload;
        state.toast = {
          show: true,
          message: 'Resume analysis completed successfully!',
          type: 'success'
        };
      })
      .addCase(analyzeResume.rejected, (state, action) => {
        state.isAnalyzing = false;
        state.analysisError = action.payload;
        state.toast = {
          show: true,
          message: action.payload || 'Failed to analyze resume. Please try again.',
          type: 'error'
        };
      });
  }
});

export const {
  setUploadedFile,
  setJobDescription,
  clearAnalysis,
  showToast,
  hideToast,
  resetResumeCheck
} = resumeCheckSlice.actions;

export default resumeCheckSlice.reducer;