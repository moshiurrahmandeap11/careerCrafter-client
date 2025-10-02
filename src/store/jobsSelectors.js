export const selectJobs = (state) => state.jobs.jobs;
export const selectSavedJobs = (state) => state.jobs.savedJobs;
export const selectApplications = (state) => state.jobs.applications;
export const selectLoading = (state) => state.jobs.loading;
export const selectError = (state) => state.jobs.error;
export const selectSearchTerm = (state) => state.jobs.searchTerm;
export const selectLocation = (state) => state.jobs.location;
export const selectActiveTab = (state) => state.jobs.activeTab;

export const selectFilteredJobs = (state) => {
  const jobs = selectJobs(state);
  const searchTerm = selectSearchTerm(state);
  const location = selectLocation(state);
  
  return jobs.filter(job => {
    const matchesSearch = !searchTerm || 
      job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesLocation = !location || 
      job.location.toLowerCase().includes(location.toLowerCase());
    
    return matchesSearch && matchesLocation;
  });
};

export const selectTabCounts = (state) => ({
  recommended: selectJobs(state).length,
  saved: selectSavedJobs(state).length,
  applications: selectApplications(state).length
});