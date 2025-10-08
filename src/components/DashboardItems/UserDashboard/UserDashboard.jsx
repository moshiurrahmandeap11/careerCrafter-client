import React, { useState, useEffect } from 'react';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';
import useAuth from '../../../hooks/UseAuth/useAuth';

const UserDashboard = () => {
    const { user } = useAuth();
    const [userProfile, setUserProfile] = useState(null);
    const [userJobs, setUserJobs] = useState([]);
    const [aiJobMatches, setAiJobMatches] = useState([]);
    const [applications, setApplications] = useState([]);
    const [activeTab, setActiveTab] = useState('overview');
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalJobs: 0,
        totalApplications: 0,
        aiMatches: 0,
        profileCompletion: 0
    });

    // Fetch user data and all related information
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                setLoading(true);
                
                if (!user?.uid) {
                    console.error('User UID not found');
                    setLoading(false);
                    return;
                }

                // Fetch user profile by email from your users collection
                const userResponse = await axiosIntense.get(`/users/email/${user.email}`);
                setUserProfile(userResponse.data);

                const userId = userResponse.data._id;

                // Fetch user's posted jobs
                const jobsResponse = await axiosIntense.get(`/jobs/user/${userId}`);
                setUserJobs(jobsResponse.data.data || []);

                // Fetch AI job matches
                const aiMatchesResponse = await axiosIntense.get(`/ai-jobs/user/${userId}/matches?limit=5`);
                setAiJobMatches(aiMatchesResponse.data.data || []);

                // Fetch job applications
                const applicationsResponse = await axiosIntense.get(`/applications/user/${userId}`);
                setApplications(applicationsResponse.data.data || []);

                // Calculate stats
                setStats({
                    totalJobs: jobsResponse.data.data?.length || 0,
                    totalApplications: applicationsResponse.data.data?.length || 0,
                    aiMatches: aiMatchesResponse.data.data?.length || 0,
                    profileCompletion: calculateProfileCompletion(userResponse.data)
                });

            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (user?.email) {
            fetchUserData();
        }
    }, [user]);

    const calculateProfileCompletion = (userData) => {
        let completion = 0;
        const fields = ['fullName', 'email', 'skills', 'education', 'experience', 'desiredJobTitle'];
        
        fields.forEach(field => {
            if (userData[field] && userData[field].length > 0) {
                completion += 100 / fields.length;
            }
        });

        return Math.round(completion);
    };

    const handleAiJobMatch = async () => {
        try {
            if (!userProfile?._id) {
                alert('User profile not loaded');
                return;
            }

            const response = await axiosIntense.post('/ai-jobs/match', { userId: userProfile._id });
            
            if (response.data.success) {
                // Refresh AI matches
                const aiMatchesResponse = await axiosIntense.get(`/ai-jobs/user/${userProfile._id}/matches?limit=5`);
                setAiJobMatches(aiMatchesResponse.data.data || []);
                setStats(prev => ({ ...prev, aiMatches: aiMatchesResponse.data.data?.length || 0 }));
                
                alert('AI Job Matching completed successfully!');
            }
        } catch (error) {
            console.error('Error in AI job matching:', error);
            alert('Error in AI job matching');
        }
    };

    const handleDeleteJob = async (jobId) => {
        if (window.confirm('Are you sure you want to delete this job?')) {
            try {
                await axiosIntense.delete(`/jobs/${jobId}`);
                setUserJobs(prev => prev.filter(job => job._id !== jobId));
                setStats(prev => ({ ...prev, totalJobs: prev.totalJobs - 1 }));
            } catch (error) {
                console.error('Error deleting job:', error);
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="bg-white shadow">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-6">
                        <h1 className="text-3xl font-bold text-gray-900">User Dashboard</h1>
                        <div className="flex items-center space-x-4">
                            <img 
                                src={user?.photoURL || userProfile?.profileImage || '/default-avatar.png'} 
                                alt="Profile" 
                                className="h-10 w-10 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-medium text-gray-900">
                                    {user?.displayName || userProfile?.fullName || 'User'}
                                </p>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Navigation Tabs */}
            <div className="bg-white border-b">
                <div className="max-w-7xl mx-auto">
                    <nav className="flex space-x-8">
                        {['overview', 'my-jobs', 'ai-matches', 'applications', 'profile'].map(tab => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                className={`py-4 px-1 border-b-2 font-medium text-sm capitalize ${
                                    activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                }`}
                            >
                                {tab.replace('-', ' ')}
                            </button>
                        ))}
                    </nav>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="px-4 py-6 sm:px-0">
                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Total Jobs Posted</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalJobs}</dd>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Job Applications</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.totalApplications}</dd>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">AI Matches</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.aiMatches}</dd>
                                </div>
                            </div>
                            <div className="bg-white overflow-hidden shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <dt className="text-sm font-medium text-gray-500 truncate">Profile Completion</dt>
                                    <dd className="mt-1 text-3xl font-semibold text-gray-900">{stats.profileCompletion}%</dd>
                                </div>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                            {/* Recent AI Matches */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Recent AI Job Matches
                                    </h3>
                                    {aiJobMatches.length > 0 ? (
                                        <div className="space-y-4">
                                            {aiJobMatches.slice(0, 3).map((match, index) => (
                                                <div key={index} className="border rounded-lg p-4">
                                                    <div className="flex justify-between items-start">
                                                        <div>
                                                            <h4 className="font-medium text-gray-900">
                                                                {match.matchedJobs?.[0]?.title || 'Job Title'}
                                                            </h4>
                                                            <p className="text-sm text-gray-500">
                                                                Match Score: {match.matchedJobs?.[0]?.matchScore}%
                                                            </p>
                                                        </div>
                                                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                            AI Recommended
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No AI matches yet.</p>
                                    )}
                                    <button
                                        onClick={handleAiJobMatch}
                                        className="mt-4 w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Find AI Job Matches
                                    </button>
                                </div>
                            </div>

                            {/* Recent Applications */}
                            <div className="bg-white shadow rounded-lg">
                                <div className="px-4 py-5 sm:p-6">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900 mb-4">
                                        Recent Applications
                                    </h3>
                                    {applications.length > 0 ? (
                                        <div className="space-y-4">
                                            {applications.slice(0, 3).map(application => (
                                                <div key={application._id} className="border rounded-lg p-4">
                                                    <h4 className="font-medium text-gray-900">{application.jobTitle}</h4>
                                                    <p className="text-sm text-gray-500">{application.company}</p>
                                                    <div className="mt-2">
                                                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                            application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                            application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                            'bg-red-100 text-red-800'
                                                        }`}>
                                                            {application.status}
                                                        </span>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p className="text-gray-500">No applications yet.</p>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* My Jobs Tab */}
                {activeTab === 'my-jobs' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">My Posted Jobs</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Jobs you have posted on the platform.
                                </p>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {userJobs.map(job => (
                                    <li key={job._id}>
                                        <div className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                            <div className="flex items-center justify-between">
                                                <div className="flex items-center">
                                                    <div className="flex-shrink-0">
                                                        <img className="h-12 w-12 rounded-lg" src={job.image || '/default-job.png'} alt="" />
                                                    </div>
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-gray-900">{job.title}</div>
                                                        <div className="text-sm text-gray-500">{job.company}</div>
                                                        <div className="text-sm text-gray-500">
                                                            ${job.salaryMin} - ${job.salaryMax}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center space-x-4">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        job.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                                                    }`}>
                                                        {job.status}
                                                    </span>
                                                    <button
                                                        onClick={() => handleDeleteJob(job._id)}
                                                        className="text-red-600 hover:text-red-900 text-sm font-medium"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                            <div className="mt-2">
                                                <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                                            </div>
                                            <div className="mt-2 flex flex-wrap gap-2">
                                                {job.requiredSkills?.slice(0, 4).map((skill, index) => (
                                                    <span key={index} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                                        {skill}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {userJobs.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">You haven't posted any jobs yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* AI Matches Tab */}
                {activeTab === 'ai-matches' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <div className="flex justify-between items-center">
                                    <div>
                                        <h3 className="text-lg leading-6 font-medium text-gray-900">AI Job Matches</h3>
                                        <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                            Jobs matched by AI based on your profile.
                                        </p>
                                    </div>
                                    <button
                                        onClick={handleAiJobMatch}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition duration-200"
                                    >
                                        Refresh Matches
                                    </button>
                                </div>
                            </div>
                            {aiJobMatches.length > 0 ? (
                                <div className="divide-y divide-gray-200">
                                    {aiJobMatches.map((matchSession, index) => (
                                        <div key={matchSession._id} className="p-6">
                                            <div className="flex justify-between items-start mb-4">
                                                <h4 className="text-md font-medium text-gray-900">
                                                    Match Session {aiJobMatches.length - index}
                                                </h4>
                                                <span className="text-sm text-gray-500">
                                                    {new Date(matchSession.matchDate).toLocaleDateString()}
                                                </span>
                                            </div>
                                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                                {matchSession.matchedJobs?.map((jobMatch, jobIndex) => (
                                                    <div key={jobIndex} className="border rounded-lg p-4 hover:shadow-md transition-shadow duration-200">
                                                        <div className="flex justify-between items-start mb-2">
                                                            <h5 className="font-medium text-gray-900">{jobMatch.title}</h5>
                                                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                jobMatch.matchScore >= 80 ? 'bg-green-100 text-green-800' :
                                                                jobMatch.matchScore >= 60 ? 'bg-yellow-100 text-yellow-800' :
                                                                'bg-red-100 text-red-800'
                                                            }`}>
                                                                {jobMatch.matchScore}% Match
                                                            </span>
                                                        </div>
                                                        <p className="text-sm text-gray-600 mb-3">{jobMatch.company}</p>
                                                        <div className="space-y-2">
                                                            <div className="text-sm">
                                                                <strong>Strengths:</strong>
                                                                <ul className="list-disc list-inside ml-2 text-gray-600">
                                                                    {jobMatch.strengths?.slice(0, 2).map((strength, i) => (
                                                                        <li key={i}>{strength}</li>
                                                                    ))}
                                                                </ul>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">No AI matches found. Click "Refresh Matches" to find jobs.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Applications Tab */}
                {activeTab === 'applications' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow overflow-hidden sm:rounded-md">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">My Job Applications</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    All jobs you have applied to.
                                </p>
                            </div>
                            <ul className="divide-y divide-gray-200">
                                {applications.map(application => (
                                    <li key={application._id} className="px-4 py-4 sm:px-6 hover:bg-gray-50">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{application.jobTitle}</div>
                                                <div className="text-sm text-gray-500">{application.company}</div>
                                                <div className="text-sm text-gray-500">
                                                    Applied on {new Date(application.appliedDate).toLocaleDateString()}
                                                </div>
                                            </div>
                                            <div className="flex items-center space-x-4">
                                                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                                                    application.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                                    'bg-gray-100 text-gray-800'
                                                }`}>
                                                    {application.status}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                            {applications.length === 0 && (
                                <div className="text-center py-12">
                                    <p className="text-gray-500">You haven't applied to any jobs yet.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Profile Tab */}
                {activeTab === 'profile' && (
                    <div className="px-4 py-6 sm:px-0">
                        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                            <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                                <h3 className="text-lg leading-6 font-medium text-gray-900">Profile Information</h3>
                                <p className="mt-1 max-w-2xl text-sm text-gray-500">
                                    Personal details and preferences.
                                </p>
                            </div>
                            <div className="px-4 py-5 sm:p-6">
                                <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Full Name</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userProfile?.fullName || user?.displayName || 'Not provided'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Email</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{user?.email}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Desired Job Title</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userProfile?.desiredJobTitle || 'Not specified'}</dd>
                                    </div>
                                    <div>
                                        <dt className="text-sm font-medium text-gray-500">Experience</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userProfile?.yearsOfExperience || 'Not specified'} years</dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Skills</dt>
                                        <dd className="mt-1 text-sm text-gray-900">
                                            {userProfile?.skills?.length > 0 ? (
                                                <div className="flex flex-wrap gap-2">
                                                    {userProfile.skills.map((skill, index) => (
                                                        <span key={index} className="inline-flex items-center px-2 py-1 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                                            {skill}
                                                        </span>
                                                    ))}
                                                </div>
                                            ) : (
                                                'No skills added'
                                            )}
                                        </dd>
                                    </div>
                                    <div className="sm:col-span-2">
                                        <dt className="text-sm font-medium text-gray-500">Education</dt>
                                        <dd className="mt-1 text-sm text-gray-900">{userProfile?.education || 'Not specified'}</dd>
                                    </div>
                                </dl>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default UserDashboard;