import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  personalInfo: {
    fullName: '',
    title: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    github: '',
    portfolio: ''
  },
  careerObjective: '',
  skills: [],
  projects: [],
  experience: [],
  education: [],
  languages: [],
  uploadedFile: null,
  atsScore: null,
  suggestions: [],
  analyzing: false,
  showPreview: false
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    // Personal Info
    updatePersonalInfo: (state, action) => {
      state.personalInfo = { ...state.personalInfo, ...action.payload };
    },
    
    // Career Objective
    updateCareerObjective: (state, action) => {
      state.careerObjective = action.payload;
    },
    
    // Skills
    addSkill: (state, action) => {
      const skill = action.payload;
      if (skill && !state.skills.includes(skill)) {
        state.skills.push(skill);
      }
    },
    removeSkill: (state, action) => {
      state.skills = state.skills.filter(skill => skill !== action.payload);
    },
    
    // Projects
    addProject: (state) => {
      state.projects.push({
        id: Date.now(),
        name: '',
        description: '',
        keyFeatures: [''],
        githubUrl: '',
        liveUrl: '',
        techStack: ''
      });
    },
    updateProject: (state, action) => {
      const { id, updates } = action.payload;
      const projectIndex = state.projects.findIndex(project => project.id === id);
      if (projectIndex !== -1) {
        state.projects[projectIndex] = { ...state.projects[projectIndex], ...updates };
      }
    },
    removeProject: (state, action) => {
      state.projects = state.projects.filter(project => project.id !== action.payload);
    },
    addProjectFeature: (state, action) => {
      const projectId = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.keyFeatures.push('');
      }
    },
    removeProjectFeature: (state, action) => {
      const { projectId, featureIndex } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project) {
        project.keyFeatures = project.keyFeatures.filter((_, index) => index !== featureIndex);
      }
    },
    updateProjectFeature: (state, action) => {
      const { projectId, featureIndex, value } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project && project.keyFeatures[featureIndex] !== undefined) {
        project.keyFeatures[featureIndex] = value;
      }
    },
    
    // Experience
    addExperience: (state) => {
      state.experience.push({
        id: Date.now(),
        title: '',
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        current: false,
        description: ''
      });
    },
    updateExperience: (state, action) => {
      const { id, updates } = action.payload;
      const experienceIndex = state.experience.findIndex(exp => exp.id === id);
      if (experienceIndex !== -1) {
        state.experience[experienceIndex] = { ...state.experience[experienceIndex], ...updates };
      }
    },
    removeExperience: (state, action) => {
      state.experience = state.experience.filter(exp => exp.id !== action.payload);
    },
    
    // Education
    addEducation: (state) => {
      state.education.push({
        id: Date.now(),
        degree: '',
        institution: '',
        location: '',
        graduationDate: '',
        gpa: ''
      });
    },
    updateEducation: (state, action) => {
      const { id, updates } = action.payload;
      const educationIndex = state.education.findIndex(edu => edu.id === id);
      if (educationIndex !== -1) {
        state.education[educationIndex] = { ...state.education[educationIndex], ...updates };
      }
    },
    removeEducation: (state, action) => {
      state.education = state.education.filter(edu => edu.id !== action.payload);
    },
    
    // Languages
    addLanguage: (state) => {
      state.languages.push({
        id: Date.now(),
        language: '',
        proficiency: 'Intermediate'
      });
    },
    updateLanguage: (state, action) => {
      const { id, updates } = action.payload;
      const languageIndex = state.languages.findIndex(lang => lang.id === id);
      if (languageIndex !== -1) {
        state.languages[languageIndex] = { ...state.languages[languageIndex], ...updates };
      }
    },
    removeLanguage: (state, action) => {
      state.languages = state.languages.filter(lang => lang.id !== action.payload);
    },
    
    // File Upload & Analysis
    setUploadedFile: (state, action) => {
      state.uploadedFile = action.payload;
    },
    setAtsScore: (state, action) => {
      state.atsScore = action.payload;
    },
    setSuggestions: (state, action) => {
      state.suggestions = action.payload;
    },
    setAnalyzing: (state, action) => {
      state.analyzing = action.payload;
    },
    setShowPreview: (state, action) => {
      state.showPreview = action.payload;
    },
    
    // Reset
    resetResume: () => initialState
  }
});

export const {
  updatePersonalInfo,
  updateCareerObjective,
  addSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  addProjectFeature,
  removeProjectFeature,
  updateProjectFeature,
  addExperience,
  updateExperience,
  removeExperience,
  addEducation,
  updateEducation,
  removeEducation,
  addLanguage,
  updateLanguage,
  removeLanguage,
  setUploadedFile,
  setAtsScore,
  setSuggestions,
  setAnalyzing,
  setShowPreview,
  resetResume
} = resumeSlice.actions;

export default resumeSlice.reducer;