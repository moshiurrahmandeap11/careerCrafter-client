import React, { useState, useEffect, useCallback } from 'react';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';
import { useNavigate } from 'react-router';
import useAuth from '../../hooks/UseAuth/useAuth';

const AiJobMatch = () => {
    const { user } = useAuth();
    const email = user?.email;
    
    const [userProfile, setUserProfile] = useState(null);
    const [jobs, setJobs] = useState([]);
    const [matchedJobs, setMatchedJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [dataLoading, setDataLoading] = useState(true);
    const [error, setError] = useState('');
    const [activeTab, setActiveTab] = useState('profile');
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();

    // Fetch user profile
    const fetchUserProfile = useCallback(async () => {
        if (!email) return;

        try {
            const response = await axiosIntense.get(`/users/email/${email}`);
            if (response.data) {
                setUserProfile(response.data);
                setError('');
            } else {
                setError('User profile not found');
            }
        } catch (err) {
            console.error('Error fetching user profile:', err);
            setError('Failed to load user profile. Please refresh the page.');
        }
    }, [email]);

    // Fetch jobs
    const fetchJobs = useCallback(async () => {
        try {
            const response = await axiosIntense.get('/jobs');
            if (response.data.success) {
                setJobs(response.data.data);
            }
        } catch (err) {
            console.error('Error fetching jobs:', err);
        }
    }, []);

    // Initial data load
    useEffect(() => {
        const loadData = async () => {
            if (email) {
                setDataLoading(true);
                await Promise.all([fetchUserProfile(), fetchJobs()]);
                setDataLoading(false);
            }
        };
        loadData();
    }, [email, fetchUserProfile, fetchJobs]);

    // Handle job matching
    const handleJobMatch = async () => {
        if (!userProfile?._id) {
            setError('User profile not loaded properly. Please refresh the page.');
            return;
        }

        setLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const response = await axiosIntense.post('/ai-jobs/match', {
                userId: userProfile._id
            });

            if (response.data.success) {
                const matches = response.data.data.matches || [];
                setMatchedJobs(matches);
                setActiveTab('results');
                
                if (matches.length > 0) {
                    setSuccessMessage(`🎉 Found ${matches.length} perfect job matches for you!`);
                } else {
                    setError('No matching jobs found. Try updating your profile or check back later.');
                }
            } else {
                setError(response.data.message || 'Matching failed. Please try again.');
            }
        } catch (err) {
            console.error('Job matching error:', err);
            setError(err.response?.data?.message || 'Failed to perform job matching. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    // Helper functions
    const getUserExperience = () => {
        if (!userProfile?.tags) return 'Not specified';
        const experienceTags = userProfile.tags.filter(tag => 
            typeof tag === 'string' && (
                tag.includes('Developer') || tag.includes('Engineer') || 
                tag.includes('Designer') || tag.includes('Manager')
            )
        );
        return experienceTags.length > 0 ? experienceTags.join(', ') : 'Not specified';
    };

    const getUserSkills = () => {
        if (!userProfile?.tags) return [];
        return userProfile.tags.filter(tag => 
            typeof tag === 'string' && !(
                tag.includes('Developer') || tag.includes('Engineer') || 
                tag.includes('Designer') || tag.includes('Manager')
            )
        );
    };

    const getUserDesiredJobTitle = () => {
        if (!userProfile?.tags) return 'Job Seeker';
        const jobTitleTags = userProfile.tags.filter(tag => 
            typeof tag === 'string' && (
                tag.includes('Developer') || tag.includes('Engineer') || 
                tag.includes('Designer') || tag.includes('Manager')
            )
        );
        return jobTitleTags.length > 0 ? jobTitleTags[0] : 'Job Seeker';
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'bg-green-500';
        if (score >= 70) return 'bg-blue-500';
        if (score >= 60) return 'bg-yellow-500';
        return 'bg-red-500';
    };

    const getScoreBadge = (score) => {
        if (score >= 80) return { text: 'Excellent Match', color: 'text-green-700 bg-green-100' };
        if (score >= 70) return { text: 'Good Match', color: 'text-blue-700 bg-blue-100' };
        if (score >= 60) return { text: 'Fair Match', color: 'text-yellow-700 bg-yellow-100' };
        return { text: 'Basic Match', color: 'text-gray-700 bg-gray-100' };
    };

    // Action handlers
    const handleApply = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    const handleSaveJob = (jobId) => {
        setSuccessMessage('✅ Job saved to favorites!');
        setTimeout(() => setSuccessMessage(''), 3000);
    };

    const handleViewDetails = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    // Loading state
    if (dataLoading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
                <div className="text-center">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-blue-600 mx-auto mb-4"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-16 h-16 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Loading Your Profile</h2>
                    <p className="text-gray-600 text-lg">Preparing AI job matching system...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error && !userProfile) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-100 flex items-center justify-center p-4">
                <div className="text-center max-w-md">
                    <div className="bg-white rounded-2xl shadow-2xl p-8">
                        <div className="text-red-500 text-7xl mb-4">⚠️</div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Unable to Load Profile</h2>
                        <p className="text-gray-600 mb-6">{error}</p>
                        <div className="space-y-3">
                            <button 
                                onClick={() => window.location.reload()}
                                className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-semibold transition-colors"
                            >
                                Refresh Page
                            </button>
                            <button 
                                onClick={fetchUserProfile}
                                className="w-full bg-gray-200 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-300 font-semibold transition-colors"
                            >
                                Retry Loading
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-block mb-4">
                        <div className="flex items-center justify-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-full text-sm font-semibold">
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M13 7H7v6h6V7z" />
                                <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
                            </svg>
                            <span>AI-Powered Job Matching</span>
                        </div>
                    </div>
                    <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 mb-4">
                        Find Your Dream Job
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Let our advanced AI analyze your profile and match you with perfect opportunities
                    </p>
                </div>

                {/* Success Message */}
                {successMessage && (
                    <div className="max-w-3xl mx-auto mb-6 animate-fade-in">
                        <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-lg shadow-sm">
                            <div className="flex items-center">
                                <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                <p className="text-green-800 font-medium">{successMessage}</p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Left Sidebar */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden sticky top-8">
                            {/* Profile Header */}
                            <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 text-white">
                                <div className="flex flex-col items-center text-center">
                                    <div className="relative mb-4">
                                        <img 
                                            src={userProfile?.profileImage || '/default-avatar.png'} 
                                            alt={userProfile?.fullName}
                                            className="w-28 h-28 rounded-full border-4 border-white shadow-lg object-cover"
                                            onError={(e) => {
                                                e.target.src = 'https://ui-avatars.com/api/?name=' + 
                                                    encodeURIComponent(userProfile?.fullName || 'User') + 
                                                    '&size=128&background=3B82F6&color=fff';
                                            }}
                                        />
                                        <div className="absolute bottom-0 right-0 bg-green-500 w-6 h-6 rounded-full border-2 border-white"></div>
                                    </div>
                                    <h2 className="text-2xl font-bold mb-1">
                                        {userProfile?.fullName || 'User'}
                                    </h2>
                                    <p className="text-blue-100 mb-3 text-sm">
                                        {getUserDesiredJobTitle()}
                                    </p>
                                    <span className="bg-white/20 backdrop-blur-sm text-white px-4 py-1.5 rounded-full text-sm font-semibold">
                                        {userProfile?.roleType === 'premium' ? '⭐ Premium Member' : '✨ Standard Member'}
                                    </span>
                                </div>
                            </div>

                            {/* Profile Details */}
                            <div className="p-6">
                                <div className="space-y-3 mb-6">
                                    <ProfileItem icon="💼" label="Experience" value={getUserExperience()} />
                                    <ProfileItem icon="🎓" label="Education" value={userProfile?.education || 'Not specified'} />
                                    <ProfileItem icon="📍" label="Location" value={userProfile?.preferredLocation || 'Not specified'} />
                                    <ProfileItem icon="💰" label="Expected Salary" value={`$${userProfile?.expectedSalary || '0'}/month`} />
                                    <ProfileItem icon="🏢" label="Job Type" value={userProfile?.preferredJobType || 'Not specified'} />
                                    <ProfileItem icon="👤" label="Role" value={userProfile?.role || 'Not specified'} />
                                </div>

                                {/* Skills */}
                                {getUserSkills().length > 0 && (
                                    <div className="mb-6">
                                        <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                                            <span className="text-xl mr-2">🎯</span>
                                            Skills & Expertise
                                        </h3>
                                        <div className="flex flex-wrap gap-2">
                                            {getUserSkills().slice(0, 8).map((skill, index) => (
                                                <span 
                                                    key={index}
                                                    className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold border border-blue-200"
                                                >
                                                    {skill}
                                                </span>
                                            ))}
                                            {getUserSkills().length > 8 && (
                                                <span className="text-gray-500 text-xs px-2 py-1">
                                                    +{getUserSkills().length - 8} more
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {/* AI Credits */}
                                <div className="mb-6 bg-gradient-to-r from-purple-50 to-pink-50 p-4 rounded-xl border border-purple-200">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="text-sm font-semibold text-purple-900">AI Credits</span>
                                        <span className="text-2xl font-bold text-purple-600">
                                            {userProfile?.aiCredits?.toLocaleString() || '0'}
                                        </span>
                                    </div>
                                    <div className="w-full bg-purple-200 rounded-full h-2">
                                        <div 
                                            className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all"
                                            style={{ width: `${Math.min((userProfile?.aiCredits || 0) / 100, 100)}%` }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Match Button */}
                                <button 
                                    onClick={handleJobMatch}
                                    disabled={loading}
                                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold py-4 px-6 rounded-xl transition-all duration-300 transform hover:-translate-y-1 hover:shadow-2xl disabled:opacity-50 disabled:transform-none disabled:hover:shadow-none flex items-center justify-center space-x-2"
                                >
                                    {loading ? (
                                        <>
                                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                            <span>Analyzing...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                            </svg>
                                            <span>Find Perfect Matches</span>
                                        </>
                                    )}
                                </button>

                                <p className="text-xs text-gray-500 text-center mt-3">
                                    Uses 1 AI credit per search
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Right Side - Results */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                            {/* Tabs */}
                            <div className="flex border-b border-gray-200 bg-gray-50">
                                <TabButton 
                                    active={activeTab === 'profile'} 
                                    onClick={() => setActiveTab('profile')}
                                    icon={
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="Profile Overview"
                                />
                                <TabButton 
                                    active={activeTab === 'results'} 
                                    onClick={() => setActiveTab('results')}
                                    icon={
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                                        </svg>
                                    }
                                    label="AI Matches"
                                    badge={matchedJobs.length > 0 ? matchedJobs.length : null}
                                />
                            </div>

                            {/* Tab Content */}
                            <div className="p-8">
                                {activeTab === 'profile' && <ProfileOverviewTab />}
                                {activeTab === 'results' && (
                                    <ResultsTab 
                                        error={error}
                                        loading={loading}
                                        matchedJobs={matchedJobs}
                                        jobs={jobs}
                                        getScoreColor={getScoreColor}
                                        getScoreBadge={getScoreBadge}
                                        handleApply={handleApply}
                                        handleSaveJob={handleSaveJob}
                                        handleViewDetails={handleViewDetails}
                                        handleJobMatch={handleJobMatch}
                                    />
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// Components
const ProfileItem = ({ icon, label, value }) => (
    <div className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
        <span className="text-gray-600 text-sm flex items-center">
            <span className="mr-2">{icon}</span>
            {label}
        </span>
        <span className="text-gray-900 font-semibold text-sm text-right capitalize">
            {value}
        </span>
    </div>
);

const TabButton = ({ active, onClick, icon, label, badge }) => (
    <button
        onClick={onClick}
        className={`flex-1 py-4 px-6 text-center font-semibold transition-all flex items-center justify-center space-x-2 ${
            active 
                ? 'text-blue-600 bg-white border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
        }`}
    >
        {icon}
        <span>{label}</span>
        {badge !== null && (
            <span className={`ml-2 px-2.5 py-0.5 rounded-full text-xs font-bold ${
                active ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600'
            }`}>
                {badge}
            </span>
        )}
    </button>
);

const ProfileOverviewTab = () => (
    <div className="space-y-8">
        <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Welcome to AI Job Matching</h3>
            <p className="text-gray-600 text-lg">
                Our advanced AI will analyze your profile and find the perfect jobs for you. Click "Find Perfect Matches" to get started!
            </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <FeatureCard 
                icon="🎯"
                title="Skills Match"
                description="AI analyzes your skills against job requirements to find the best matches"
                gradient="from-blue-50 to-blue-100"
                borderColor="border-blue-500"
            />
            <FeatureCard 
                icon="💰"
                title="Salary Fit"
                description="Match jobs within your expected salary range and compensation expectations"
                gradient="from-green-50 to-green-100"
                borderColor="border-green-500"
            />
            <FeatureCard 
                icon="🏢"
                title="Culture Fit"
                description="Find companies that match your work preferences and company culture"
                gradient="from-purple-50 to-purple-100"
                borderColor="border-purple-500"
            />
        </div>

        <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-l-4 border-yellow-500 p-6 rounded-xl">
            <h4 className="font-bold text-gray-900 mb-3 text-lg flex items-center">
                <span className="text-2xl mr-2">🤖</span>
                How AI Matching Works
            </h4>
            <ul className="space-y-3">
                <ListItem text="Analyzes your skills, experience, and education against job requirements" />
                <ListItem text="Considers your salary expectations and preferred work arrangements" />
                <ListItem text="Matches based on company culture and growth opportunities" />
                <ListItem text="Provides detailed insights on why each job is a good fit" />
                <ListItem text="Ranks jobs by compatibility score from 60% to 95%" />
            </ul>
        </div>
    </div>
);

const FeatureCard = ({ icon, title, description, gradient, borderColor }) => (
    <div className={`bg-gradient-to-br ${gradient} border-l-4 ${borderColor} p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow`}>
        <div className="text-4xl mb-3">{icon}</div>
        <h4 className="font-bold text-gray-900 mb-2 text-lg">{title}</h4>
        <p className="text-gray-600 text-sm leading-relaxed">{description}</p>
    </div>
);

const ListItem = ({ text }) => (
    <li className="flex items-start text-gray-700">
        <svg className="w-5 h-5 text-yellow-500 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
        </svg>
        <span className="text-sm">{text}</span>
    </li>
);

const ResultsTab = ({ error, loading, matchedJobs, jobs, getScoreColor, getScoreBadge, handleApply, handleSaveJob, handleViewDetails, handleJobMatch }) => (
    <div className="space-y-6">
        {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
                <div className="flex items-center">
                    <svg className="w-6 h-6 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                    <span className="font-medium">{error}</span>
                </div>
            </div>
        )}

        {loading ? (
            <div className="text-center py-16">
                <div className="relative inline-block mb-6">
                    <div className="animate-spin rounded-full h-20 w-20 border-b-4 border-blue-600"></div>
                    <div className="absolute inset-0 flex items-center justify-center">
                        <svg className="w-10 h-10 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M13 7H7v6h6V7z" />
                        </svg>
                    </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900 mb-3">AI is Analyzing Your Profile</h3>
                <p className="text-gray-600 text-lg mb-2">Matching you with the best opportunities...</p>
                <p className="text-gray-500 text-sm">This usually takes 10-30 seconds</p>
                <div className="flex justify-center items-center space-x-2 mt-6">
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
            </div>
        ) : matchedJobs.length > 0 ? (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-200">
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900 mb-1">
                            🎉 Found {matchedJobs.length} Perfect {matchedJobs.length === 1 ? 'Match' : 'Matches'}
                        </h3>
                        <p className="text-gray-600">Sorted by compatibility score (highest first)</p>
                    </div>
                    <button
                        onClick={handleJobMatch}
                        className="bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-blue-50 transition-colors border border-blue-200 flex items-center space-x-2"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span>Refresh</span>
                    </button>
                </div>

                {matchedJobs.map((match, index) => {
                    const job = jobs.find(j => j._id === match.jobId);
                    if (!job) return null;
                    
                    const badge = getScoreBadge(match.matchScore);
                    
                    return (
                        <div 
                            key={index} 
                            className="border-2 border-gray-200 rounded-2xl p-6 hover:shadow-2xl hover:border-blue-300 transition-all duration-300 bg-white transform hover:-translate-y-1"
                        >
                            {/* Job Header */}
                            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-3">
                                        <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-bold text-2xl flex-shrink-0">
                                            {job.company.charAt(0).toUpperCase()}
                                        </div>
                                        <div>
                                            <h3 className="text-2xl font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                                                {job.title}
                                            </h3>
                                            <p className="text-blue-600 font-semibold text-lg">
                                                {job.company}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        <span className="bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-green-200">
                                            💰 ${job.salaryMin?.toLocaleString()} - ${job.salaryMax?.toLocaleString()}
                                        </span>
                                        <span className="bg-blue-100 text-blue-700 px-4 py-1.5 rounded-full text-sm font-semibold capitalize border border-blue-200">
                                            {job.jobType || 'Full-time'}
                                        </span>
                                        <span className="bg-purple-100 text-purple-700 px-4 py-1.5 rounded-full text-sm font-semibold capitalize border border-purple-200">
                                            {job.workMode || 'On-site'}
                                        </span>
                                        <span className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm font-semibold border border-gray-200">
                                            📍 {job.location || 'Remote'}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col items-center gap-2">
                                    <div className={`${getScoreColor(match.matchScore)} text-white px-6 py-3 rounded-2xl font-bold text-2xl shadow-lg`}>
                                        {match.matchScore}%
                                    </div>
                                    <span className={`${badge.color} px-3 py-1 rounded-full text-xs font-bold`}>
                                        {badge.text}
                                    </span>
                                </div>
                            </div>

                            {/* Match Details Grid */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                                <MatchDetailCard
                                    title="Why This Match"
                                    icon="✅"
                                    iconColor="text-green-500"
                                    bgColor="bg-green-50"
                                    borderColor="border-green-200"
                                    items={match.reasons || []}
                                />
                                
                                {match.strengths && match.strengths.length > 0 && (
                                    <MatchDetailCard
                                        title="Your Strengths"
                                        icon="⭐"
                                        iconColor="text-blue-500"
                                        bgColor="bg-blue-50"
                                        borderColor="border-blue-200"
                                        items={match.strengths}
                                    />
                                )}

                                {match.improvements && match.improvements.length > 0 && (
                                    <MatchDetailCard
                                        title="Growth Areas"
                                        icon="💡"
                                        iconColor="text-yellow-500"
                                        bgColor="bg-yellow-50"
                                        borderColor="border-yellow-200"
                                        items={match.improvements}
                                    />
                                )}
                            </div>

                            {/* Fit Analysis Bar Chart */}
                            {match.fitAnalysis && (
                                <div className="mb-6 bg-gray-50 rounded-xl p-5 border border-gray-200">
                                    <h4 className="font-bold text-gray-900 mb-4 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M2 11a1 1 0 011-1h2a1 1 0 011 1v5a1 1 0 01-1 1H3a1 1 0 01-1-1v-5zM8 7a1 1 0 011-1h2a1 1 0 011 1v9a1 1 0 01-1 1H9a1 1 0 01-1-1V7zM14 4a1 1 0 011-1h2a1 1 0 011 1v12a1 1 0 01-1 1h-2a1 1 0 01-1-1V4z" />
                                        </svg>
                                        Detailed Compatibility Analysis
                                    </h4>
                                    <div className="space-y-3">
                                        <FitBar label="Skills Match" value={match.fitAnalysis.skills} />
                                        <FitBar label="Experience Level" value={match.fitAnalysis.experience} />
                                        <FitBar label="Education" value={match.fitAnalysis.education} />
                                        <FitBar label="Salary Range" value={match.fitAnalysis.salary} />
                                        <FitBar label="Location/Work Mode" value={match.fitAnalysis.location} />
                                        <FitBar label="Company Culture" value={match.fitAnalysis.culture} />
                                    </div>
                                </div>
                            )}

                            {/* Job Description */}
                            <div className="mb-6">
                                <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                    <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                                    </svg>
                                    Job Description
                                </h4>
                                <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
                                    {job.description}
                                </p>
                            </div>

                            {/* Required Skills */}
                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                                <div className="mb-6">
                                    <h4 className="font-bold text-gray-900 mb-3 flex items-center">
                                        <svg className="w-5 h-5 mr-2 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                                            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                                            <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        Required Skills
                                    </h4>
                                    <div className="flex flex-wrap gap-2">
                                        {job.requiredSkills.slice(0, 8).map((skill, idx) => (
                                            <span key={idx} className="bg-indigo-100 text-indigo-800 px-3 py-1.5 rounded-lg text-xs font-semibold border border-indigo-200">
                                                {skill}
                                            </span>
                                        ))}
                                        {job.requiredSkills.length > 8 && (
                                            <span className="bg-gray-100 text-gray-600 px-3 py-1.5 rounded-lg text-xs font-semibold border border-gray-200">
                                                +{job.requiredSkills.length - 8} more
                                            </span>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-3 pt-6 border-t-2 border-gray-200">
                                <button 
                                    onClick={() => handleApply(job._id)}
                                    className="flex-1 sm:flex-none bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Apply Now</span>
                                </button>
                                <button 
                                    onClick={() => handleSaveJob(job._id)}
                                    className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                                    </svg>
                                    <span>Save</span>
                                </button>
                                <button 
                                    onClick={() => handleViewDetails(job._id)}
                                    className="flex-1 sm:flex-none bg-gray-700 hover:bg-gray-800 text-white px-8 py-3 rounded-xl font-bold transition-all transform hover:-translate-y-0.5 hover:shadow-lg flex items-center justify-center space-x-2"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                    <span>Details</span>
                                </button>
                            </div>

                            {/* AI Recommendation */}
                            {match.recommendation && (
                                <div className="mt-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-blue-500 p-4 rounded-lg">
                                    <p className="text-sm font-semibold text-blue-900 flex items-center">
                                        <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        AI Recommendation: {match.recommendation}
                                    </p>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        ) : (
            <div className="text-center py-16">
                <div className="inline-block p-8 bg-gradient-to-br from-gray-100 to-gray-200 rounded-full mb-6">
                    <svg className="w-24 h-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <h3 className="text-3xl font-bold text-gray-900 mb-3">
                    No Matches Yet
                </h3>
                <p className="text-gray-600 text-lg mb-8 max-w-md mx-auto">
                    Click the "Find Perfect Matches" button to start discovering jobs that match your profile.
                </p>
                <button
                    onClick={handleJobMatch}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white px-10 py-4 rounded-xl font-bold text-lg transition-all transform hover:-translate-y-1 hover:shadow-2xl flex items-center justify-center space-x-3 mx-auto"
                >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span>Start Matching Now</span>
                </button>
            </div>
        )}
    </div>
);

const MatchDetailCard = ({ title, icon, iconColor, bgColor, borderColor, items }) => (
    <div className={`${bgColor} rounded-xl p-5 border-2 ${borderColor}`}>
        <h4 className="font-bold text-gray-900 mb-4 flex items-center">
            <span className={`${iconColor} text-xl mr-2`}>{icon}</span>
            {title}
        </h4>
        <ul className="space-y-2">
            {items.slice(0, 4).map((item, idx) => (
                <li key={idx} className="flex items-start text-sm text-gray-700">
                    <span className={`${iconColor} mr-2 mt-0.5 flex-shrink-0`}>•</span>
                    <span className="leading-snug">{item}</span>
                </li>
            ))}
        </ul>
    </div>
);

const FitBar = ({ label, value }) => {
    const getBarColor = (val) => {
        if (val >= 80) return 'from-green-500 to-emerald-500';
        if (val >= 60) return 'from-blue-500 to-indigo-500';
        if (val >= 40) return 'from-yellow-500 to-orange-500';
        return 'from-red-500 to-pink-500';
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-1.5">
                <span className="text-sm font-semibold text-gray-700">{label}</span>
                <span className="text-sm font-bold text-gray-900">{value}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
                <div 
                    className={`bg-gradient-to-r ${getBarColor(value)} h-3 rounded-full transition-all duration-500 shadow-sm`}
                    style={{ width: `${value}%` }}
                ></div>
            </div>
        </div>
    );
};

export default AiJobMatch;