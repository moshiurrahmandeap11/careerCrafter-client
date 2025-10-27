import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer
} from 'recharts';
import {
  selectSkillGap,
  selectSector,
  selectAvailableSkills,
  selectUserSkills,
  selectAnalysis,
  selectIsLoading,
  selectIsAnalyzing,
  selectError,
  selectCurrentStep,
  selectOverallScore,
  selectSectorReadiness,
  selectStrengths,
  selectGaps,
  selectRecommendations,
  selectComparison,
  selectCategoryAnalysis,
  selectLearningPath,
  selectScoreChartData,
  selectComparisonChartData,
  selectCategoryChartData,
  selectHasAnalysis,
  selectCanAnalyze
} from '../../redux-selectors/skillGapSelectors';
import {
  setSector,
  setUserSkill,
  setCurrentStep,
  resetSkillGap,
  getSkillsForSector,
  analyzeSkillGap
} from '../../redux-slices/skillGapSlice';


const SkillGapAnalysis = () => {
  const dispatch = useDispatch();
  const [sectorInput, setSectorInput] = useState('');
  
  // Selectors
  const sector = useSelector(selectSector);
  const availableSkills = useSelector(selectAvailableSkills);
  const userSkills = useSelector(selectUserSkills);
  const analysis = useSelector(selectAnalysis);
  const isLoading = useSelector(selectIsLoading);
  const isAnalyzing = useSelector(selectIsAnalyzing);
  const error = useSelector(selectError);
  const currentStep = useSelector(selectCurrentStep);
  const overallScore = useSelector(selectOverallScore);
  const sectorReadiness = useSelector(selectSectorReadiness);
  const strengths = useSelector(selectStrengths);
  const gaps = useSelector(selectGaps);
  const recommendations = useSelector(selectRecommendations);
  const comparison = useSelector(selectComparison);
  const categoryAnalysis = useSelector(selectCategoryAnalysis);
  const learningPath = useSelector(selectLearningPath);
  const scoreChartData = useSelector(selectScoreChartData);
  const comparisonChartData = useSelector(selectComparisonChartData);
  const categoryChartData = useSelector(selectCategoryChartData);
  const hasAnalysis = useSelector(selectHasAnalysis);
  const canAnalyze = useSelector(selectCanAnalyze);

  const handleSectorSubmit = (e) => {
    e.preventDefault();
    if (sectorInput.trim()) {
      dispatch(setSector(sectorInput.trim()));
      dispatch(getSkillsForSector(sectorInput.trim()));
    }
  };

  const handleSkillChange = (skillName, proficiency) => {
    dispatch(setUserSkill({ skillName, proficiency }));
  };

  const handleAnalyze = () => {
    if (userSkills.length > 0) {
      dispatch(analyzeSkillGap({ sector, userSkills }));
    }
  };

  const handleReset = () => {
    dispatch(resetSkillGap());
    setSectorInput('');
  };

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  const proficiencyOptions = [
    { value: 'none', label: 'Not Familiar', color: '#f0f0f0' },
    { value: 'beginner', label: 'Beginner', color: '#ff6b6b' },
    { value: 'moderate', label: 'Moderate', color: '#4ecdc4' },
    { value: 'expert', label: 'Expert', color: '#45b7d1' }
  ];

  // Group skills by category
  const skillsByCategory = availableSkills.reduce((acc, skill) => {
    if (!acc[skill.category]) {
      acc[skill.category] = [];
    }
    acc[skill.category].push(skill);
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skill Gap Analysis</h1>
          <p className="text-gray-600">Assess your skills and identify areas for improvement</p>
        </div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${
                    currentStep >= step
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-600'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-12 h-1 ${
                      currentStep > step ? 'bg-blue-600' : 'bg-gray-300'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <div className="text-red-600 font-semibold">Error: {error}</div>
              <button
                onClick={() => dispatch(resetSkillGap())}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                Try Again
              </button>
            </div>
          </div>
        )}

        {/* Step 1: Sector Input */}
        {currentStep === 1 && (
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h2 className="text-2xl font-semibold mb-4">Enter Your Sector</h2>
            <p className="text-gray-600 mb-6">
              Tell us which sector or field you're skilled in (e.g., Web Development, Data Science, Digital Marketing, etc.)
            </p>
            
            <form onSubmit={handleSectorSubmit}>
              <div className="mb-4">
                <input
                  type="text"
                  value={sectorInput}
                  onChange={(e) => setSectorInput(e.target.value)}
                  placeholder="e.g., Web Development, Data Science, Digital Marketing..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
              >
                {isLoading ? 'Loading Skills...' : 'Get Skills Assessment'}
              </button>
            </form>
          </div>
        )}

        {/* Step 2: Skills Assessment */}
        {currentStep === 2 && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-semibold">Assess Your Skills in {sector}</h2>
              <button
                onClick={handleReset}
                className="text-gray-500 hover:text-gray-700"
              >
                Change Sector
              </button>
            </div>

            <div className="mb-6">
              <div className="flex space-x-2 mb-4">
                {proficiencyOptions.map((option) => (
                  <div key={option.value} className="flex items-center">
                    <div
                      className="w-4 h-4 rounded mr-2"
                      style={{ backgroundColor: option.color }}
                    />
                    <span className="text-sm text-gray-600">{option.label}</span>
                  </div>
                ))}
              </div>
            </div>

            {isLoading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading skills for {sector}...</p>
              </div>
            ) : (
              <>
                {Object.entries(skillsByCategory).map(([category, skills]) => (
                  <div key={category} className="mb-8">
                    <h3 className="text-xl font-semibold mb-4 text-gray-800 border-b pb-2">
                      {category}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {skills.map((skill) => {
                        const userSkill = userSkills.find(us => us.name === skill.name);
                        const currentProficiency = userSkill?.proficiency || 'none';

                        return (
                          <div
                            key={skill.name}
                            className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                          >
                            <div className="flex justify-between items-start mb-3">
                              <div>
                                <h4 className="font-semibold text-gray-900">{skill.name}</h4>
                                <p className="text-sm text-gray-600 mt-1">{skill.description}</p>
                                <span
                                  className={`inline-block mt-2 px-2 py-1 text-xs rounded-full ${
                                    skill.importance === 'High'
                                      ? 'bg-red-100 text-red-800'
                                      : skill.importance === 'Medium'
                                      ? 'bg-yellow-100 text-yellow-800'
                                      : 'bg-green-100 text-green-800'
                                  }`}
                                >
                                  {skill.importance} Priority
                                </span>
                              </div>
                            </div>
                            
                            <div className="flex space-x-2">
                              {proficiencyOptions.map((option) => (
                                <button
                                  key={option.value}
                                  onClick={() => handleSkillChange(skill.name, option.value)}
                                  className={`flex-1 py-2 px-3 text-xs rounded border transition-colors ${
                                    currentProficiency === option.value
                                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                                      : 'border-gray-300 text-gray-600 hover:bg-gray-50'
                                  }`}
                                  style={{
                                    backgroundColor: currentProficiency === option.value ? option.color : undefined
                                  }}
                                >
                                  {option.label}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}

                <div className="flex justify-between mt-8 pt-6 border-t">
                  <button
                    onClick={() => dispatch(setCurrentStep(1))}
                    className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleAnalyze}
                    disabled={!canAnalyze || isAnalyzing}
                    className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                  >
                    {isAnalyzing ? 'Analyzing...' : `Analyze ${userSkills.length} Skills`}
                  </button>
                </div>
              </>
            )}
          </div>
        )}

        {/* Step 3: Results */}
        {currentStep === 3 && analysis && (
          <div className="space-y-6">
            {/* Score Summary */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Overall Score */}
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">Overall Score</h3>
                  <div className="relative inline-block">
                    <div className="w-32 h-32 rounded-full border-8 border-blue-100 flex items-center justify-center">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-blue-600">{overallScore}</div>
                        <div className="text-sm text-gray-600">/ 100</div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4">
                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                      overallScore >= 80
                        ? 'bg-green-100 text-green-800'
                        : overallScore >= 60
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {sectorReadiness} Level
                    </span>
                  </div>
                </div>

                {/* Comparison Chart */}
                <div className="lg:col-span-2">
                  <h3 className="text-lg font-semibold mb-4">Industry Comparison</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comparisonChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="score" name="Score" fill="#8884d8" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>

            {/* Charts Row */}
            <div>
              {/* Score Distribution */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Score Distribution</h3>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={scoreChartData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {scoreChartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Analysis Details */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Strengths */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-green-600">Strengths</h3>
                <ul className="space-y-2">
                  {strengths.map((strength, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2">✓</span>
                      <span className="text-gray-700">{strength}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Skill Gaps */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-red-600">Areas for Improvement</h3>
                <ul className="space-y-2">
                  {gaps.map((gap, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-red-500 mr-2">⚠</span>
                      <span className="text-gray-700">{gap}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations */}
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 text-blue-600">Recommendations</h3>
                <ul className="space-y-2">
                  {recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2">→</span>
                      <span className="text-gray-700">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Learning Path */}
            {learningPath.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4">Recommended Learning Path</h3>
                <div className="space-y-4">
                  {learningPath.map((item, index) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                      <div className="flex justify-between items-start">
                        <h4 className="font-semibold text-gray-900">{item.skill}</h4>
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          item.priority === 'High'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'Medium'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}>
                          {item.priority} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">Timeline: {item.timeline}</p>
                      {item.resources && item.resources.length > 0 && (
                        <div className="mt-2">
                          <p className="text-sm font-medium text-gray-700">Resources:</p>
                          <ul className="text-sm text-gray-600 ml-4 list-disc">
                            {item.resources.map((resource, resIndex) => (
                              <li key={resIndex}>{resource}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-center space-x-4 pt-6">
              <button
                onClick={() => dispatch(setCurrentStep(2))}
                className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Re-assess Skills
              </button>
              <button
                onClick={handleReset}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                Start New Analysis
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SkillGapAnalysis;