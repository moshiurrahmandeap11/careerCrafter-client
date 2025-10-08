export const selectPersonalInfo = (state) => state.resume.personalInfo;
export const selectCareerObjective = (state) => state.resume.careerObjective;
export const selectSkills = (state) => state.resume.skills;
export const selectProjects = (state) => state.resume.projects;
export const selectExperience = (state) => state.resume.experience;
export const selectEducation = (state) => state.resume.education;
export const selectLanguages = (state) => state.resume.languages;
export const selectUploadedFile = (state) => state.resume.uploadedFile;
export const selectAtsScore = (state) => state.resume.atsScore;
export const selectSuggestions = (state) => state.resume.suggestions;
export const selectAnalyzing = (state) => state.resume.analyzing;
export const selectShowPreview = (state) => state.resume.showPreview;

export const selectResumeData = (state) => ({
  personalInfo: selectPersonalInfo(state),
  careerObjective: selectCareerObjective(state),
  skills: selectSkills(state),
  projects: selectProjects(state),
  experience: selectExperience(state),
  education: selectEducation(state),
  languages: selectLanguages(state)
});

export const selectAnalysisData = (state) => ({
  uploadedFile: selectUploadedFile(state),
  atsScore: selectAtsScore(state),
  suggestions: selectSuggestions(state),
  analyzing: selectAnalyzing(state)
});