export const selectCVData = (state) => state.cv.cvData;
export const selectActiveTab = (state) => state.cv.activeTab;
export const selectShowPreview = (state) => state.cv.showPreview;
export const selectIsCreating = (state) => state.cv.isCreating;
export const selectIsDownloading = (state) => state.cv.isDownloading;
export const selectCVId = (state) => state.cv.cvId;
export const selectMobileMenuOpen = (state) => state.cv.mobileMenuOpen;
export const selectToast = (state) => state.cv.toast;

// Select specific sections
export const selectPersonalInfo = (state) => state.cv.cvData.personal;
export const selectEducation = (state) => state.cv.cvData.education;
export const selectExperience = (state) => state.cv.cvData.experience;
export const selectSkills = (state) => state.cv.cvData.skills;
export const selectProjects = (state) => state.cv.cvData.projects;
export const selectLanguages = (state) => state.cv.cvData.languages;
export const selectCertifications = (state) => state.cv.cvData.certifications;
export const selectReferences = (state) => state.cv.cvData.references;

// Validation selector
export const selectIsFormValid = (state) => {
  const { personal, education, experience, skills } = state.cv.cvData;

  const hasPersonalInfo = personal.name && personal.title && personal.email &&
    personal.phone && personal.summary;
  const hasEducation = education.length > 0;
  const hasExperience = experience.length > 0;
  const hasSkills = skills.length > 0;

  return hasPersonalInfo && hasEducation && hasExperience && hasSkills;
};