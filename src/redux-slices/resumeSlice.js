import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for saving resume
export const saveResume = createAsyncThunk(
  'resume/saveResume',
  async (resumeData, { rejectWithValue }) => {
    try {
      // Simulate 3 second delay before API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await fetch('http://localhost:3000/v1/resumes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to save resume');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for generating PDF
export const generatePDF = createAsyncThunk(
  'resume/generatePDF',
  async (resumeData, { rejectWithValue }) => {
    try {
      // Simulate 3 second delay before API call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const response = await fetch('http://localhost:3000/v1/resumes/generate-pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resumeData)
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return { blob, name: resumeData.personal.name };
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  resumeData: {
    personal: {
      name: '',
      title: '',
      email: '',
      phone: '',
      location: '',
      website: '',
      github: '',
      summary: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    languages: []
  },
  activeTab: 'personal',
  showPreview: false,
  isCreating: false,
  isDownloading: false,
  resumeId: null,
  mobileMenuOpen: false,
  toast: { show: false, message: '', type: '' },
  validationErrors: {}
};

const resumeSlice = createSlice({
  name: 'resume',
  initialState,
  reducers: {
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
      if (state.mobileMenuOpen) {
        state.mobileMenuOpen = false;
      }
    },
    setShowPreview: (state, action) => {
      state.showPreview = action.payload;
    },
    setMobileMenuOpen: (state, action) => {
      state.mobileMenuOpen = action.payload;
    },
    updatePersonalInfo: (state, action) => {
      const { field, value } = action.payload;
      state.resumeData.personal[field] = value;
    },
    addEducation: (state) => {
      state.resumeData.education.push({ 
        institution: '', 
        degree: '', 
        field: '', 
        duration: '' 
      });
    },
    updateEducation: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData.education[index]) {
        state.resumeData.education[index][field] = value;
      }
    },
    removeEducation: (state, action) => {
      state.resumeData.education = state.resumeData.education.filter((_, i) => i !== action.payload);
    },
    addExperience: (state) => {
      state.resumeData.experience.push({ 
        company: '', 
        position: '', 
        duration: '', 
        location: '', 
        description: '' 
      });
    },
    updateExperience: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData.experience[index]) {
        state.resumeData.experience[index][field] = value;
      }
    },
    removeExperience: (state, action) => {
      state.resumeData.experience = state.resumeData.experience.filter((_, i) => i !== action.payload);
    },
    addSkill: (state) => {
      state.resumeData.skills.push({ 
        name: '', 
        level: '' 
      });
    },
    updateSkill: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData.skills[index]) {
        state.resumeData.skills[index][field] = value;
      }
    },
    removeSkill: (state, action) => {
      state.resumeData.skills = state.resumeData.skills.filter((_, i) => i !== action.payload);
    },
    addProject: (state) => {
      state.resumeData.projects.push({ 
        name: '', 
        technologies: '', 
        keyFeatures: '', 
        liveLink: '', 
        githubLink: '', 
        description: '' 
      });
    },
    updateProject: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData.projects[index]) {
        state.resumeData.projects[index][field] = value;
      }
    },
    removeProject: (state, action) => {
      state.resumeData.projects = state.resumeData.projects.filter((_, i) => i !== action.payload);
    },
    addLanguage: (state) => {
      state.resumeData.languages.push({ 
        name: '', 
        proficiency: '' 
      });
    },
    updateLanguage: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.resumeData.languages[index]) {
        state.resumeData.languages[index][field] = value;
      }
    },
    removeLanguage: (state, action) => {
      state.resumeData.languages = state.resumeData.languages.filter((_, i) => i !== action.payload);
    },
    showToast: (state, action) => {
      state.toast = { ...action.payload, show: true };
    },
    hideToast: (state) => {
      state.toast = { show: false, message: '', type: '' };
    },
    clearResume: (state) => {
      state.resumeData = initialState.resumeData;
      state.resumeId = null;
      state.showPreview = false;
    },
    setValidationErrors: (state, action) => {
      state.validationErrors = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Save Resume cases
      .addCase(saveResume.pending, (state) => {
        state.isCreating = true;
        state.toast = { show: false, message: '', type: '' };
      })
      .addCase(saveResume.fulfilled, (state, action) => {
        state.isCreating = false;
        state.resumeId = action.payload.id;
        state.showPreview = true;
        state.toast = { show: true, message: 'Resume created successfully!', type: 'success' };
      })
      .addCase(saveResume.rejected, (state, action) => {
        state.isCreating = false;
        state.toast = { 
          show: true, 
          message: action.payload || 'Failed to create resume. Please try again.', 
          type: 'error' 
        };
      })
      // Generate PDF cases
      .addCase(generatePDF.pending, (state) => {
        state.isDownloading = true;
        state.toast = { show: false, message: '', type: '' };
      })
      .addCase(generatePDF.fulfilled, (state, action) => {
        state.isDownloading = false;
        // Trigger download
        const { blob, name } = action.payload;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.style.display = 'none';
        a.href = url;
        a.download = `${name.replace(/\s+/g, '_')}_resume.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        state.toast = { show: true, message: 'PDF downloaded successfully!', type: 'success' };
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.isDownloading = false;
        state.toast = { 
          show: true, 
          message: action.payload || 'Error downloading PDF. Please try again.', 
          type: 'error' 
        };
      });
  }
});

export const {
  setActiveTab,
  setShowPreview,
  setMobileMenuOpen,
  updatePersonalInfo,
  addEducation,
  updateEducation,
  removeEducation,
  addExperience,
  updateExperience,
  removeExperience,
  addSkill,
  updateSkill,
  removeSkill,
  addProject,
  updateProject,
  removeProject,
  addLanguage,
  updateLanguage,
  removeLanguage,
  showToast,
  hideToast,
  clearResume,
  setValidationErrors
} = resumeSlice.actions;

export default resumeSlice.reducer;