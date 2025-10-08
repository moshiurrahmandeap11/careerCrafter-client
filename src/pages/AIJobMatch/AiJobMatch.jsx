import React, { useState, useEffect } from 'react';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';
import { useNavigate } from 'react-router';

const AiJobMatch = () => {
    const [userProfile, setUserProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const navigate = useNavigate();

    useEffect(() => {
        fetchUserProfile();
        fetchJobs();
    }, []);

    const fetchUserProfile = async () => {
        try {

            const userId = localStorage.getItem('userId') || "68e44591bb1c0a1a48a0f9dc";
            
            console.log('Fetching user profile for ID:', userId);
            const response = await axiosIntense.get(`/users/${userId}`);
            console.log('User profile response:', response.data);
            setUserProfile(response.data);
        } catch (err) {
            console.error('Error fetching user profile:', err);
            console.error('Error details:', err.response?.data);
            setError('Failed to load user profile');
        }
    };

    const fetchJobs = async () => {
        try {
            console.log('Fetching all jobs...');
            const response = await axiosIntense.get('/jobs');
            console.log('Jobs response:', response.data);
            if (response.data.success) {
                setJobs(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
            console.error('Error details:', err.response?.data);
        }
    };

    const handleJobMatch = async () => {
        setLoading(true);
        setError('');

        try {
            console.log('Starting AI job matching for user:', userProfile._id);
            
            const response = await axiosIntense.post('/ai-jobs/match', {
                userId: userProfile._id
            });

            console.log('AI Match response:', response.data);

            if (response.data.success) {
                setMatchedJobs(response.data.data.matches);
                setActiveTab('results');
                console.log('Matches found:', response.data.data.matches.length);
            } else {
                setError(response.data.message);
            }
        } catch (err) {
            console.error('Job matching error:', err);
            console.error('Error details:', err.response?.data);
            setError('Failed to perform job matching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const handleApply = (jobId) => {
        console.log('Applying to job:', jobId);
        navigate(`/job/${jobId}`);
    };

    const handleSaveJob = (jobId) => {
        console.log('Saving job:', jobId);
        alert('Job saved to favorites!');
    };

    const handleViewDetails = (jobId) => {
        console.log('Viewing job details:', jobId);
        alert('Job details feature coming soon!');
    };

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Loading Profile</h2>
                    <p className="text-gray-600">Please wait while we load your profile...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        AI Job Match
                    </h1>
                    <p className="text-xl text-gray-600">
                        Find your perfect job match with our AI-powered tool
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Side - User Profile */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 sticky top-8">
                            {/* Profile Header */}
                            <div className="flex flex-col items-center text-center mb-6">
                                <img 
                                    src={userProfile.profileImage} 
                                    alt={userProfile.fullName}
                                    className="w-24 h-24 rounded-full border-4 border-blue-500 object-cover mb-4"
                                />
                                <h2 className="text-xl font-bold text-gray-900">
                                    {userProfile.fullName}
                                </h2>
                                <p className="text-gray-600 mb-2">
                                    {userProfile.desiredJobTitle || 'Job Seeker'}
                                </p>
                                <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                                    {userProfile.roleType === 'premium' ? 'Premium' : 'Standard'}
                                </span>
                            </div>

                            {/* Profile Details */}
                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-semibold text-gray-700">Experience:</span>
                                    <span className="text-gray-600">{userProfile.yearsOfExperience || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-semibold text-gray-700">Education:</span>
                                    <span className="text-gray-600 capitalize">{userProfile.education || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-semibold text-gray-700">Location:</span>
                                    <span className="text-gray-600 capitalize">{userProfile.preferredLocation || 'Not specified'}</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-semibold text-gray-700">Expected Salary:</span>
                                    <span className="text-gray-600">${userProfile.expectedSalary || '0'}/month</span>
                                </div>
                                <div className="flex justify-between items-center py-2 border-b border-gray-100">
                                    <span className="font-semibold text-gray-700">Job Type:</span>
                                    <span className="text-gray-600 capitalize">{userProfile.preferredJobType || 'Not specified'}</span>
                                </div>
                            </div>

                            {/* Skills */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.skills?.map((skill, index) => (
                                        <span 
                                            key={index}
                                            className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {skill}
                                        </span>
                                    ))}
                                    {(!userProfile.skills || userProfile.skills.length === 0) && (
                                        <span className="text-gray-500 text-sm">No skills listed</span>
                                    )}
                                </div>
                            </div>

                            {/* Certifications */}
                            <div className="mb-6">
                                <h3 className="font-semibold text-gray-900 mb-3">Certifications</h3>
                                <div className="flex flex-wrap gap-2">
                                    {userProfile.certifications?.map((cert, index) => (
                                        <span 
                                            key={index}
                                            className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium"
                                        >
                                            {cert}
                                        </span>
                                    ))}
                                    {(!userProfile.certifications || userProfile.certifications.length === 0) && (
                                        <span className="text-gray-500 text-sm">No certifications</span>
                                    )}
                                </div>
                            </div>

                            {/* Match Button */}
                            <button 
                                onClick={handleJobMatch}
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 px-4 rounded-xl transition-all duration-200 transform hover:-translate-y-1 hover:shadow-lg disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none"
                            >
                                {loading ? (
                                    <div className="flex items-center justify-center">
                                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                        Matching Jobs...
                                    </div>
                                ) : (
                                    'Find Job Matches'
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Right Side - Results */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                        activeTab === 'profile' 
                                            ? 'text-blue-600 border-b-2 border-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    Profile Overview
                                </button>
                                <button
                                    onClick={() => setActiveTab('results')}
                                    className={`flex-1 py-4 px-6 text-center font-semibold transition-colors ${
                                        activeTab === 'results' 
                                            ? 'text-blue-600 border-b-2 border-blue-600' 
                                            : 'text-gray-500 hover:text-gray-700'
                                    }`}
                                >
                                    AI Matches 
                                    {matchedJobs.length > 0 && (
                                        <span className="ml-2 bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-sm">
                                            {matchedJobs.length}
                                        </span>
                                    )}
                                </button>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6">
                                {activeTab === 'profile' && (
                                    <div className="space-y-6">
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-4">
                                                Profile Overview
                                            </h3>
                                            <p className="text-gray-600 mb-6">
                                                Click "Find Job Matches" to discover jobs that match your profile using AI.
                                            </p>
                                        </div>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">Skills Match</h4>
                                                <p className="text-gray-600 text-sm">
                                                    AI will analyze your skills against job requirements to find the best matches
                                                </p>
                                            </div>
                                            <div className="bg-green-50 border-l-4 border-green-500 p-6 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">Salary Fit</h4>
                                                <p className="text-gray-600 text-sm">
                                                    Match jobs within your expected salary range and compensation expectations
                                                </p>
                                            </div>
                                            <div className="bg-purple-50 border-l-4 border-purple-500 p-6 rounded-lg">
                                                <h4 className="font-semibold text-gray-900 mb-2">Culture Fit</h4>
                                                <p className="text-gray-600 text-sm">
                                                    Find companies that match your work preferences and company culture
                                                </p>
                                            </div>
                                        </div>

                                        <div className="bg-yellow-50 border-l-4 border-yellow-500 p-6 rounded-lg mt-6">
                                            <h4 className="font-semibold text-gray-900 mb-2">How AI Matching Works</h4>
                                            <ul className="text-gray-600 text-sm space-y-2">
                                                <li>• Analyzes your skills, experience, and education against job requirements</li>
                                                <li>• Considers your salary expectations and preferred work arrangements</li>
                                                <li>• Matches based on company culture and growth opportunities</li>
                                                <li>• Provides detailed insights on why each job is a good fit</li>
                                            </ul>
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'results' && (
                                    <div className="space-y-6">
                                        {error && (
                                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                                                <div className="flex items-center">
                                                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                                    </svg>
                                                    {error}
                                                </div>
                                            </div>
                                        )}

                                        {loading ? (
                                            <div className="text-center py-12">
                                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                                                <h3 className="text-lg font-semibold text-gray-900 mb-2">AI is Working Its Magic</h3>
                                                <p className="text-gray-600">Analyzing your profile and matching with available jobs...</p>
                                                <p className="text-gray-500 text-sm mt-2">This may take a few moments</p>
                                            </div>
                                        ) : matchedJobs.length > 0 ? (
                                            <div className="space-y-6">
                                                <div className="flex justify-between items-center">
                                                    <h3 className="text-xl font-bold text-gray-900">
                                                        Found {matchedJobs.length} Job Matches
                                                    </h3>
                                                    <span className="text-sm text-gray-600">
                                                        Sorted by match score
                                                    </span>
                                                </div>

                                                {matchedJobs.map((match, index) => {
                                                    const job = jobs.find(j => j._id === match.jobId);
                                                    return job ? (
                                                        <div key={index} className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-shadow duration-200 bg-white">
                                                            {/* Job Header */}
                                                            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4">
                                                                <div className="flex-1">
                                                                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                                                                        {job.title}
                                                                    </h3>
                                                                    <p className="text-blue-600 font-semibold mb-3">
                                                                        {job.company}
                                                                    </p>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                                            ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                                                                        </span>
                                                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                                                                            {job.jobType || 'Full-time'}
                                                                        </span>
                                                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm capitalize">
                                                                            {job.workMode || 'On-site'}
                                                                        </span>
                                                                        <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                                                                            {job.location || 'Remote'}
                                                                        </span>
                                                                    </div>
                                                                </div>
                                                                <div className={`${getScoreColor(match.matchScore)} text-white px-4 py-2 rounded-full font-bold text-lg mt-4 sm:mt-0`}>
                                                                    {match.matchScore}%
                                                                </div>
                                                            </div>

                                                            {/* Match Details */}
                                                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                                                                <div className="bg-gray-50 rounded-lg p-4">
                                                                    <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                                        <svg className="w-4 h-4 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                                                        </svg>
                                                                        Why this match:
                                                                    </h4>
                                                                    <ul className="space-y-2">
                                                                        {match.reasons.map((reason, idx) => (
                                                                            <li key={idx} className="flex items-start text-sm text-gray-600">
                                                                                <span className="text-green-500 mr-2">✓</span>
                                                                                {reason}
                                                                            </li>
                                                                        ))}
                                                                    </ul>
                                                                </div>

                                                                {match.strengths && match.strengths.length > 0 && (
                                                                    <div className="bg-green-50 rounded-lg p-4">
                                                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                                            <svg className="w-4 h-4 text-blue-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                                            </svg>
                                                                            Your Strengths:
                                                                        </h4>
                                                                        <ul className="space-y-2">
                                                                            {match.strengths.map((strength, idx) => (
                                                                                <li key={idx} className="flex items-start text-sm text-gray-600">
                                                                                    <span className="text-blue-500 mr-2">★</span>
                                                                                    {strength}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}

                                                                {match.improvements && match.improvements.length > 0 && (
                                                                    <div className="bg-yellow-50 rounded-lg p-4">
                                                                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center">
                                                                            <svg className="w-4 h-4 text-yellow-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                                                                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                                                                            </svg>
                                                                            Areas to Improve:
                                                                        </h4>
                                                                        <ul className="space-y-2">
                                                                            {match.improvements.map((improvement, idx) => (
                                                                                <li key={idx} className="flex items-start text-sm text-gray-600">
                                                                                    <span className="text-yellow-500 mr-2">💡</span>
                                                                                    {improvement}
                                                                                </li>
                                                                            ))}
                                                                        </ul>
                                                                    </div>
                                                                )}
                                                            </div>

                                                            {/* Job Description Preview */}
                                                            <div className="mb-6">
                                                                <h4 className="font-semibold text-gray-900 mb-2">Job Description</h4>
                                                                <p className="text-gray-600 text-sm line-clamp-3">
                                                                    {job.description}
                                                                </p>
                                                            </div>

                                                            {/* Required Skills */}
                                                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                                                                <div className="mb-6">
                                                                    <h4 className="font-semibold text-gray-900 mb-2">Required Skills</h4>
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {job.requiredSkills.slice(0, 6).map((skill, idx) => (
                                                                            <span key={idx} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                                                {skill}
                                                                            </span>
                                                                        ))}
                                                                        {job.requiredSkills.length > 6 && (
                                                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                                +{job.requiredSkills.length - 6} more
                                                                            </span>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Actions */}
                                                            <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-200">
                                                                <button 
                                                                    onClick={() => handleApply(job._id)}
                                                                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
                                                                >
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                                                    </svg>
                                                                    Apply Now
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleSaveJob(job._id)}
                                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
                                                                >
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                                                    </svg>
                                                                    Save Job
                                                                </button>
                                                                <button 
                                                                    onClick={() => handleViewDetails(job._id)}
                                                                    className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-semibold transition-colors flex items-center"
                                                                >
                                                                    <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                                    </svg>
                                                                    View Details
                                                                </button>
                                                            </div>
                                                        </div>
                                                    ) : null;
                                                })}
                                            </div>
                                        ) : (
                                            <div className="text-center py-12">
                                                <div className="text-gray-400 text-6xl mb-4">🔍</div>
                                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                                    No matches yet
                                                </h3>
                                                <p className="text-gray-600 mb-6">
                                                    Click the "Find Job Matches" button to start the AI matching process.
                                                </p>
                                                <button
                                                    onClick={handleJobMatch}
                                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors"
                                                >
                                                    Start Matching
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AiJobMatch;