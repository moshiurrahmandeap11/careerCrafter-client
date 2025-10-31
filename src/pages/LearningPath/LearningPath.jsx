// LearningPath.jsx
import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { 
  selectCanGenerate, 
  selectCareerOpportunities, 
  selectCurrentLevel, 
  selectError, 
  selectGeneratedPath, 
  selectGoal, 
  selectHasLearningPath, 
  selectIsLoading, 
  selectProgressMetrics, 
  selectResources, 
  selectStages, 
  selectTimeframe, 
  selectUserTopic, 
  selectWeeklyProgress 
} from '../../redux-selectors/learningPathSelectors';

import { 
  generateLearningPath, 
  saveLearningPath, 
  clearLearningPath,
  setUserTopic,
  setCurrentLevel,
  setGoal,
  setTimeframe
} from '../../redux-slices/learningPathSlice';

const LearningPath = () => {
  const dispatch = useDispatch();
  const userTopic = useSelector(selectUserTopic);
  const currentLevel = useSelector(selectCurrentLevel);
  const goal = useSelector(selectGoal);
  const timeframe = useSelector(selectTimeframe);
  const learningPath = useSelector(selectGeneratedPath);
  const isLoading = useSelector(selectIsLoading);
  const error = useSelector(selectError);
  const stages = useSelector(selectStages);
  const weeklyProgress = useSelector(selectWeeklyProgress);
  const progressMetrics = useSelector(selectProgressMetrics);
  const resources = useSelector(selectResources);
  const careerOpportunities = useSelector(selectCareerOpportunities);
  const hasLearningPath = useSelector(selectHasLearningPath);
  const canGenerate = useSelector(selectCanGenerate);

  const [showDetails, setShowDetails] = useState({});

  const handleGeneratePath = () => {
    if (userTopic.trim()) {
      dispatch(generateLearningPath({
        topic: userTopic,
        currentLevel,
        goal,
        timeframe
      }));
    }
  };

  const toggleStageDetails = (index) => {
    setShowDetails(prev => ({
      ...prev,
      [index]: !prev[index]
    }));
  };

  // Data for progress chart
  const progressData = progressMetrics.milestones?.map(milestone => ({
    week: `Week ${milestone.week}`,
    progress: milestone.progressPercentage,
    milestone: milestone.title
  })) || [];

  // Data for skills distribution
  const skillsData = stages.flatMap((stage, index) => 
    stage.skills?.map(skill => ({
      skill,
      stage: `Stage ${index + 1}`,
      value: 1
    })) || []
  );

  if (!hasLearningPath) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">
              AI-Powered Learning Path Generator
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Tell us what you want to learn, and we'll create a personalized learning path with detailed milestones, resources, and progress tracking.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  What do you want to learn?
                </label>
                <input
                  type="text"
                  value={userTopic}
                  onChange={(e) => dispatch(setUserTopic(e.target.value))}
                  placeholder="e.g., Web Development, Data Science, Digital Marketing..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Level
                </label>
                <select
                  value={currentLevel}
                  onChange={(e) => dispatch(setCurrentLevel(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="beginner">Beginner</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Learning Goal
                </label>
                <select
                  value={goal}
                  onChange={(e) => dispatch(setGoal(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="basic">Basic Understanding</option>
                  <option value="proficiency">Proficiency</option>
                  <option value="mastery">Mastery</option>
                  <option value="job-ready">Job Ready</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Timeframe
                </label>
                <select
                  value={timeframe}
                  onChange={(e) => dispatch(setTimeframe(e.target.value))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="3 months">3 Months</option>
                  <option value="6 months">6 Months</option>
                  <option value="1 year">1 Year</option>
                </select>
              </div>
            </div>

            <button
              onClick={handleGeneratePath}
              disabled={!canGenerate || isLoading}
              className="w-full bg-blue-600 text-white py-4 px-6 rounded-lg font-semibold text-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Generating Your Learning Path...' : 'Generate Learning Path'}
            </button>

            {error && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-700">{error}</p>
              </div>
            )}
          </div>

          {/* Career Sectors Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: 'Web Development', emoji: '💻' },
              { name: 'Data Science', emoji: '📊' },
              { name: 'Mobile Development', emoji: '📱' },
              { name: 'AI/ML Engineering', emoji: '🤖' },
              { name: 'Cloud Computing', emoji: '☁️' },
              { name: 'Cybersecurity', emoji: '🔒' },
              { name: 'Digital Marketing', emoji: '📈' },
              { name: 'UI/UX Design', emoji: '🎨' }
            ].map((sector) => (
              <div
                key={sector.name}
                onClick={() => dispatch(setUserTopic(sector.name))}
                className="bg-white rounded-xl shadow-md p-6 text-center cursor-pointer hover:shadow-lg transition-shadow"
              >
                <div className="text-3xl mb-2">{sector.emoji}</div>
                <h3 className="font-semibold text-gray-800">{sector.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Your Learning Path: {learningPath?.topic || 'Unknown Topic'}
          </h1>
          <p className="text-gray-600">{learningPath?.overview || 'No overview available'}</p>
          <div className="flex justify-center gap-4 mt-4">
            <button
              onClick={() => dispatch(clearLearningPath())}
              className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Create New Path
            </button>
          </div>
        </div>

        {/* Progress Overview Chart */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Progress Timeline</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={progressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="week" />
                <YAxis label={{ value: 'Progress %', angle: -90, position: 'insideLeft' }} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Progress']}
                  labelFormatter={(label) => `Milestone: ${label}`}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="progress" 
                  stroke="#8884d8" 
                  strokeWidth={3}
                  dot={{ r: 6 }}
                  name="Progress Percentage"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Learning Stages */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">Learning Stages</h2>
          <div className="space-y-6">
            {stages.map((stage, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-6 py-4">
                <div 
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => toggleStageDetails(index)}
                >
                  <div>
                    <h3 className="text-xl font-semibold text-gray-800">
                      Stage {index + 1}: {stage.stage}
                    </h3>
                    <p className="text-gray-600">{stage.duration}</p>
                  </div>
                  <button className="text-blue-600 font-semibold">
                    {showDetails[index] ? 'Hide Details' : 'Show Details'}
                  </button>
                </div>
                
                {showDetails[index] && (
                  <div className="mt-4 space-y-4">
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Skills to Learn:</h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.skills?.map((skill, skillIndex) => (
                          <span key={skillIndex} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm">
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Topics:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {stage.topics?.map((topic, topicIndex) => (
                          <li key={topicIndex}>{topic}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold text-gray-700 mb-2">Projects:</h4>
                      <ul className="list-disc list-inside text-gray-600 space-y-1">
                        {stage.projects?.map((project, projectIndex) => (
                          <li key={projectIndex}>{project}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                      <strong>Milestone:</strong> {stage.milestone}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Weekly Schedule */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Weekly Breakdown</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {weeklyProgress.slice(0, 12).map((week, index) => (
                <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                  <h4 className="font-semibold text-gray-800">Week {week.week}: {week.focus}</h4>
                  <ul className="list-disc list-inside text-gray-600 text-sm mt-2 space-y-1">
                    {week.tasks?.map((task, taskIndex) => (
                      <li key={taskIndex}>{task}</li>
                    ))}
                  </ul>
                  <p className="text-sm text-green-600 mt-2">
                    <strong>✓</strong> {week.completionCriteria}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Skills Distribution */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Skills Overview</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={skillsData.slice(0, 10)}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="skill" angle={-45} textAnchor="end" height={80} />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="value" fill="#8884d8" name="Skill Priority" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Resources and Career Opportunities */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Resources */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Learning Resources</h2>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Free Resources:</h4>
                <ul className="list-disc list-inside text-gray-600 space-y-1">
                  {resources.free?.map((resource, index) => (
                    <li key={index}>{resource}</li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold text-gray-700 mb-2">Tools & Software:</h4>
                <div className="flex flex-wrap gap-2">
                  {resources.tools?.map((tool, index) => (
                    <span key={index} className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm">
                      {tool}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Career Opportunities */}
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Career Opportunities</h2>
            <div className="space-y-3">
              {careerOpportunities.map((opportunity, index) => (
                <div key={index} className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-800">{opportunity}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearningPath;