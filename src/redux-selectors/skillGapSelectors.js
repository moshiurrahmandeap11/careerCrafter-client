export const selectSkillGap = (state) => state.skillGap;

export const selectSector = (state) => state.skillGap.sector;
export const selectAvailableSkills = (state) => state.skillGap.availableSkills;
export const selectUserSkills = (state) => state.skillGap.userSkills;
export const selectAnalysis = (state) => state.skillGap.analysis;
export const selectIsLoading = (state) => state.skillGap.isLoading;
export const selectIsAnalyzing = (state) => state.skillGap.isAnalyzing;
export const selectError = (state) => state.skillGap.error;
export const selectCurrentStep = (state) => state.skillGap.currentStep;

// Derived selectors
export const selectOverallScore = (state) => state.skillGap.analysis?.overallScore || 0;
export const selectSectorReadiness = (state) => state.skillGap.analysis?.sectorReadiness || 'Beginner';
export const selectStrengths = (state) => state.skillGap.analysis?.strengths || [];
export const selectGaps = (state) => state.skillGap.analysis?.gaps || [];
export const selectRecommendations = (state) => state.skillGap.analysis?.recommendations || [];
export const selectComparison = (state) => state.skillGap.analysis?.comparison || {};
export const selectCategoryAnalysis = (state) => state.skillGap.analysis?.categoryAnalysis || [];
export const selectLearningPath = (state) => state.skillGap.analysis?.learningPath || [];

export const selectHasAnalysis = (state) => !!state.skillGap.analysis;
export const selectCanAnalyze = (state) => state.skillGap.userSkills.length > 0;

// Chart data selectors
export const selectScoreChartData = (state) => {
  const analysis = state.skillGap.analysis;
  if (!analysis) return [];
  
  return [
    { name: 'Your Score', value: analysis.overallScore },
    { name: 'Remaining', value: 100 - analysis.overallScore }
  ];
};

export const selectComparisonChartData = (state) => {
  const comparison = state.skillGap.analysis?.comparison;
  if (!comparison) return [];
  
  return [
    { name: 'You', score: comparison.userScore },
    { name: 'Industry Avg', score: comparison.industryAverage }
  ];
};

export const selectCategoryChartData = (state) => {
  const categories = state.skillGap.analysis?.categoryAnalysis;
  if (!categories) return [];
  
  return categories.map(category => ({
    name: category.category,
    score: category.score
  }));
};