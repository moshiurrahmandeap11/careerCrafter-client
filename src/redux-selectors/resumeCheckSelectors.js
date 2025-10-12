export const selectResumeCheck = (state) => state.resumeCheck;

export const selectUploadedFile = (state) => state.resumeCheck.uploadedFile;
export const selectAnalysis = (state) => state.resumeCheck.analysis;
export const selectIsAnalyzing = (state) => state.resumeCheck.isAnalyzing;
export const selectAnalysisError = (state) => state.resumeCheck.analysisError;
export const selectJobDescription = (state) => state.resumeCheck.jobDescription;
export const selectToast = (state) => state.resumeCheck.toast;

// Derived selectors
export const selectAtsScore = (state) => state.resumeCheck.analysis?.atsScore || 0;
export const selectOverallScore = (state) => state.resumeCheck.analysis?.overallScore || 0;
export const selectCategoryScores = (state) => state.resumeCheck.analysis?.categoryScores || {};
export const selectStrengths = (state) => state.resumeCheck.analysis?.strengths || [];
export const selectImprovements = (state) => state.resumeCheck.analysis?.improvements || [];
export const selectKeywordAnalysis = (state) => state.resumeCheck.analysis?.keywordAnalysis || {};
export const selectAiSuggestions = (state) => state.resumeCheck.analysis?.aiSuggestions || [];

export const selectHasAnalysis = (state) => !!state.resumeCheck.analysis;
export const selectCanAnalyze = (state) => !!state.resumeCheck.uploadedFile;

// Add these to your existing selectors
export const selectAnalysisDetails = (state) =>
    state.resumeCheck.analysis?.analysisDetails || {};

export const selectHasQuantifiableAchievements = (state) =>
    state.resumeCheck.analysis?.analysisDetails?.hasQuantifiableAchievements || false;

export const selectHasActionVerbs = (state) =>
    state.resumeCheck.analysis?.analysisDetails?.hasActionVerbs || false;

export const selectContactInfoComplete = (state) =>
    state.resumeCheck.analysis?.analysisDetails?.contactInfoComplete || false;

export const selectSectionsPresent = (state) =>
    state.resumeCheck.analysis?.analysisDetails?.sectionsPresent || [];

export const selectFormattingIssues = (state) =>
    state.resumeCheck.analysis?.analysisDetails?.formattingIssues || [];