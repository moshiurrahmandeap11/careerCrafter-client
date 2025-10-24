// learningPathSelectors.js
export const selectLearningPath = (state) => state.learningPath;

export const selectUserTopic = (state) => state.learningPath.userTopic;
export const selectCurrentLevel = (state) => state.learningPath.currentLevel;
export const selectGoal = (state) => state.learningPath.goal;
export const selectTimeframe = (state) => state.learningPath.timeframe;
export const selectGeneratedPath = (state) => state.learningPath.learningPath;
export const selectIsLoading = (state) => state.learningPath.isLoading;
export const selectError = (state) => state.learningPath.error;
export const selectSavedPaths = (state) => state.learningPath.generatedPaths;

// Derived selectors
export const selectStages = (state) => 
  state.learningPath.learningPath?.stages || [];

export const selectWeeklyProgress = (state) => 
  state.learningPath.learningPath?.weeklyProgress || [];

export const selectProgressMetrics = (state) => 
  state.learningPath.learningPath?.progressMetrics || { totalWeeks: 0, milestones: [] };

export const selectResources = (state) => 
  state.learningPath.learningPath?.resources || {};

export const selectCareerOpportunities = (state) => 
  state.learningPath.learningPath?.careerOpportunities || [];

export const selectHasLearningPath = (state) => 
  !!state.learningPath.learningPath;

export const selectCanGenerate = (state) => 
  !!state.learningPath.userTopic?.trim();