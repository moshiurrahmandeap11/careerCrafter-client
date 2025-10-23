import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunk for saving CV
export const saveCV = createAsyncThunk(
  'cv/saveCV',
  async (cvData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append all CV data
      Object.keys(cvData).forEach(key => {
        if (key === 'personal' && cvData.personal.profileImage) {
          formData.append('profileImage', cvData.personal.profileImage);
        }
        formData.append(key, JSON.stringify(cvData[key]));
      });

      const response = await fetch('http://localhost:3000/v1/cvs', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const result = await response.json();
        return result;
      } else {
        throw new Error('Failed to save CV');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Async thunk for generating PDF
export const generatePDF = createAsyncThunk(
  'cv/generatePDF',
  async (cvData, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      
      // Append all CV data
      Object.keys(cvData).forEach(key => {
        if (key === 'personal' && cvData.personal.profileImage) {
          formData.append('profileImage', cvData.personal.profileImage);
        }
        formData.append(key, JSON.stringify(cvData[key]));
      });

      const response = await fetch('http://localhost:3000/v1/cvs/generate-pdf', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const blob = await response.blob();
        return { blob, name: cvData.personal.name };
      } else {
        throw new Error('Failed to generate PDF');
      }
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  cvData: {
    personal: {
      profileImage: null,
      name: '',
      title: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      country: '',
      postalCode: '',
      dateOfBirth: '',
      nationality: '',
      drivingLicense: '',
      summary: '',
      linkedin: '',
      github: '',
      portfolio: ''
    },
    education: [],
    experience: [],
    skills: [],
    projects: [],
    languages: [],
    certifications: [],
    references: []
  },
  activeTab: 'personal',
  showPreview: false,
  isCreating: false,
  isDownloading: false,
  cvId: null,
  mobileMenuOpen: false,
  toast: { show: false, message: '', type: '' },
  validationErrors: {}
};

const cvSlice = createSlice({
  name: 'cv',
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
      state.cvData.personal[field] = value;
    },
    updateProfileImage: (state, action) => {
      state.cvData.personal.profileImage = action.payload;
    },
    // Education
    addEducation: (state) => {
      state.cvData.education.push({ 
        institution: '', 
        degree: '', 
        field: '', 
        location: '',
        startDate: '',
        endDate: '',
        gpa: '',
        description: '',
        currentlyStudying: false
      });
    },
    updateEducation: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.cvData.education[index]) {
        state.cvData.education[index][field] = value;
      }
    },
    removeEducation: (state, action) => {
      state.cvData.education = state.cvData.education.filter((_, i) => i !== action.payload);
    },
    // Experience
    addExperience: (state) => {
      state.cvData.experience.push({ 
        company: '', 
        position: '', 
        location: '',
        startDate: '',
        endDate: '',
        currentlyWorking: false,
        description: '',
        achievements: []
      });
    },
    updateExperience: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.cvData.experience[index]) {
        state.cvData.experience[index][field] = value;
      }
    },
    removeExperience: (state, action) => {
      state.cvData.experience = state.cvData.experience.filter((_, i) => i !== action.payload);
    },
    // Skills
    addSkill: (state) => {
      state.cvData.skills.push({ 
        name: '', 
        level: '',
        category: 'Technical'
      });
    },
    updateSkill: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.cvData.skills[index]) {
        state.cvData.skills[index][field] = value;
      }
    },
    removeSkill: (state, action) => {
      state.cvData.skills = state.cvData.skills.filter((_, i) => i !== action.payload);
    },
    // Projects
    addProject: (state) => {
      state.cvData.projects.push({ 
        name: '', 
        technologies: '', 
        description: '',
        startDate: '',
        endDate: '',
        liveLink: '', 
        githubLink: '',
        role: '',
        teamSize: ''
      });
    },
    updateProject: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.cvData.projects[index]) {
        state.cvData.projects[index][field] = value;
      }
    },
    removeProject: (state, action) => {
      state.cvData.projects = state.cvData.projects.filter((_, i) => i !== action.payload);
    },
    // Languages
    addLanguage: (state) => {
      state.cvData.languages.push({ 
        name: '', 
        proficiency: '',
        level: '' 
      });
    },
    updateLanguage: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.cvData.languages[index]) {
        state.cvData.languages[index][field] = value;
      }
    },
    removeLanguage: (state, action) => {
      state.cvData.languages = state.cvData.languages.filter((_, i) => i !== action.payload);
    },
    // Certifications
    addCertification: (state) => {
      state.cvData.certifications.push({ 
        name: '', 
        issuer: '',
        issueDate: '',
        expiryDate: '',
        credentialId: '',
        credentialUrl: ''
      });
    },
    updateCertification: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.cvData.certifications[index]) {
        state.cvData.certifications[index][field] = value;
      }
    },
    removeCertification: (state, action) => {
      state.cvData.certifications = state.cvData.certifications.filter((_, i) => i !== action.payload);
    },
    // References
    addReference: (state) => {
      state.cvData.references.push({ 
        name: '', 
        position: '',
        company: '',
        email: '',
        phone: '',
        relationship: ''
      });
    },
    updateReference: (state, action) => {
      const { index, field, value } = action.payload;
      if (state.cvData.references[index]) {
        state.cvData.references[index][field] = value;
      }
    },
    removeReference: (state, action) => {
      state.cvData.references = state.cvData.references.filter((_, i) => i !== action.payload);
    },
    // Toast
    showToast: (state, action) => {
      state.toast = { ...action.payload, show: true };
    },
    hideToast: (state) => {
      state.toast = { show: false, message: '', type: '' };
    },
    clearCV: (state) => {
      state.cvData = initialState.cvData;
      state.cvId = null;
      state.showPreview = false;
    }
  },
  extraReducers: (builder) => {
    builder
      // Save CV cases
      .addCase(saveCV.pending, (state) => {
        state.isCreating = true;
        state.toast = { show: false, message: '', type: '' };
      })
      .addCase(saveCV.fulfilled, (state, action) => {
        state.isCreating = false;
        state.cvId = action.payload.id;
        state.showPreview = true;
        state.toast = { show: true, message: 'CV created successfully!', type: 'success' };
      })
      .addCase(saveCV.rejected, (state, action) => {
        state.isCreating = false;
        state.toast = { 
          show: true, 
          message: action.payload || 'Failed to create CV. Please try again.', 
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
        a.download = `${name.replace(/\s+/g, '_')}_CV.pdf`;
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
        state.toast = { show: true, message: 'CV downloaded successfully!', type: 'success' };
      })
      .addCase(generatePDF.rejected, (state, action) => {
        state.isDownloading = false;
        state.toast = { 
          show: true, 
          message: action.payload || 'Error downloading CV. Please try again.', 
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
  updateProfileImage,
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
  addCertification,
  updateCertification,
  removeCertification,
  addReference,
  updateReference,
  removeReference,
  showToast,
  hideToast,
  clearCV
} = cvSlice.actions;

export default cvSlice.reducer;