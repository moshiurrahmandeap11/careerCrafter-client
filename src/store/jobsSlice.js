import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks for API calls
export const fetchJobs = createAsyncThunk(
  'jobs/fetchJobs',
  async () => {
    const response = await fetch('/data/jobs.json');
    if (!response.ok) {
      throw new Error('Failed to fetch jobs');
    }
    return response.json();
  }
);

export const fetchSavedJobs = createAsyncThunk(
  'jobs/fetchSavedJobs',
  async () => {
    const response = await fetch('/data/saved-jobs.json');
    if (!response.ok) {
      throw new Error('Failed to fetch saved jobs');
    }
    return response.json();
  }
);

export const fetchApplications = createAsyncThunk(
  'jobs/fetchApplications',
  async () => {
    const response = await fetch('/data/applications.json');
    if (!response.ok) {
      throw new Error('Failed to fetch applications');
    }
    return response.json();
  }
);

const jobsSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    savedJobs: [],
    applications: [],
    loading: false,
    error: null,
    searchTerm: '',
    location: '',
    activeTab: 'recommended'
  },
  reducers: {
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setLocation: (state, action) => {
      state.location = action.payload;
    },
    setActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    toggleSaveJob: (state, action) => {
      const jobId = action.payload;
      const job = state.jobs.find(job => job.id === jobId);
      
      if (job) {
        job.saved = !job.saved;
        
        const isSaved = state.savedJobs.some(savedJob => savedJob.id === jobId);
        if (isSaved) {
          state.savedJobs = state.savedJobs.filter(savedJob => savedJob.id !== jobId);
        } else {
          state.savedJobs.push({ ...job, saved: true });
        }
      }
    },
    removeSavedJob: (state, action) => {
      const jobId = action.payload;
      state.savedJobs = state.savedJobs.filter(job => job.id !== jobId);
      
      // Also update the main jobs list
      const jobInMainList = state.jobs.find(job => job.id === jobId);
      if (jobInMainList) {
        jobInMainList.saved = false;
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    addApplication: (state, action) => {
      state.applications.push(action.payload);
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Jobs
      .addCase(fetchJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Fetch Saved Jobs
      .addCase(fetchSavedJobs.fulfilled, (state, action) => {
        state.savedJobs = action.payload;
      })
      // Fetch Applications
      .addCase(fetchApplications.fulfilled, (state, action) => {
        state.applications = action.payload;
      });
  }
});

export const {
  setSearchTerm,
  setLocation,
  setActiveTab,
  toggleSaveJob,
  removeSavedJob,
  clearError,
  addApplication
} = jobsSlice.actions;

export default jobsSlice.reducer;