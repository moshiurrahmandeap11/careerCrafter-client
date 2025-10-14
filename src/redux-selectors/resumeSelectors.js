export const selectResumeData = (state) => state.resume.resumeData;
export const selectActiveTab = (state) => state.resume.activeTab;
export const selectShowPreview = (state) => state.resume.showPreview;
export const selectIsCreating = (state) => state.resume.isCreating;
export const selectIsDownloading = (state) => state.resume.isDownloading;
export const selectResumeId = (state) => state.resume.resumeId;
export const selectMobileMenuOpen = (state) => state.resume.mobileMenuOpen;
export const selectToast = (state) => state.resume.toast;
export const selectValidationErrors = (state) => state.resume.validationErrors;

// Select specific sections
export const selectPersonalInfo = (state) => state.resume.resumeData.personal;
export const selectEducation = (state) => state.resume.resumeData.education;
export const selectExperience = (state) => state.resume.resumeData.experience;
export const selectSkills = (state) => state.resume.resumeData.skills;
export const selectProjects = (state) => state.resume.resumeData.projects;
export const selectLanguages = (state) => state.resume.resumeData.languages;

// Validation selectors
export const selectIsFormValid = (state) => {
  const { personal, education, skills } = state.resume.resumeData;

  const hasPersonalInfo = personal.name && personal.title && personal.email &&
    personal.phone && personal.location && personal.summary;
  const hasEducation = education.length > 0;
  const hasSkills = skills.length > 0;

  return hasPersonalInfo && hasEducation && hasSkills;
};