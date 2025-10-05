import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth/useAuth';
import Loader from '../../components/sharedItems/Loader/Loader';
import { useNavigate } from 'react-router';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';
import EditProfile from './EditProfile/EditProfile';


const Profile = () => {
    const {user, loading, userLogOut} = useAuth();
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (user?.email) {
            fetchProfile();
        }
    }, [user?.email]);

    const fetchProfile = async () => {
        try {
            setProfileLoading(true);
            setError(null);
            const response = await axiosIntense.get(`/users/email/${user?.email}`);
            if (response.data) {
                setProfile(response.data);
            }
        } catch (err) {
            console.error('Error fetching profile:', err);
            setError('Failed to load profile data');
        } finally {
            setProfileLoading(false);
        }
    };

    const handleLogOut = () => {
        userLogOut();
        navigate("/");
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getRoleColor = (role) => {
        switch(role?.toLowerCase()) {
            case 'premium user': return 'bg-amber-100 text-amber-800 border-amber-200';
            case 'pro user': return 'bg-purple-100 text-purple-800 border-purple-200';
            case 'free user': return 'bg-gray-100 text-gray-800 border-gray-200';
            default: return 'bg-blue-100 text-blue-800 border-blue-200';
        }
    };

    const getPurposeIcon = (purpose) => {
        switch(purpose) {
            case 'find_job': return '💼';
            case 'networking': return '🌐';
            case 'learning': return '📚';
            case 'freelancing': return '💻';
            default: return '🎯';
        }
    };

    if (loading || profileLoading) {
        return <Loader />;
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-md w-full">
                    <div className="text-red-400 text-4xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Something went wrong</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={fetchProfile}
                        className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50">
                {/* Header Section */}
                <div className="bg-white shadow-sm border-b border-gray-100">
                    <div className="container mx-auto px-4 py-6">
                        <div className="flex flex-col sm:flex-row items-center justify-between">
                            <div className="flex items-center space-x-4 mb-4 sm:mb-0">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                        <span className="text-lg font-medium text-red-700">
                                            {profile?.fullName?.split(' ').map(n => n[0]).join('') || user?.email?.[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                </div>
                                <div>
                                    <h1 className="text-xl md:text-2xl font-semibold text-gray-800">Profile</h1>
                                    <p className="text-gray-500 text-sm">Manage your account</p>
                                </div>
                            </div>
                            <button 
                                onClick={handleLogOut}
                                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200 flex items-center space-x-2"
                            >
                                <span className="text-sm">🚪</span>
                                <span>Logout</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container mx-auto px-4 py-6">
                    <div className="max-w-4xl mx-auto">
                        {profile ? (
                            <>
                                {/* Profile Card */}
                                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                                    <div className="bg-gradient-to-r from-red-50 to-red-100 h-20 relative">
                                        <div className="absolute -bottom-8 left-6">
                                            <div className="relative">
                                                <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border-2 border-white overflow-hidden">
                                                    {profile.profileImage ? (
                                                        <img 
                                                            src={profile.profileImage} 
                                                            alt={profile.fullName}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    ) : (
                                                        <span className="text-xl font-medium text-red-700">
                                                            {profile.fullName?.split(' ').map(n => n[0]).join('')}
                                                        </span>
                                                    )}
                                                </div>
                                                <button 
                                                    onClick={() => setShowEditModal(true)}
                                                    className="absolute -bottom-1 -right-1 w-6 h-6 bg-red-600 hover:bg-red-700 rounded-full flex items-center justify-center shadow-sm transition-colors duration-200"
                                                >
                                                    <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="pt-12 pb-6 px-6">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
                                            <div className="mb-4 lg:mb-0">
                                                <h2 className="text-2xl font-semibold text-gray-800 mb-1">{profile.fullName}</h2>
                                                <p className="text-gray-600">{profile.email}</p>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                <span className={`${getRoleColor(profile.role)} px-3 py-1 rounded-full text-sm font-medium border`}>
                                                    {profile.role?.toUpperCase() || 'USER'}
                                                </span>
                                                <span className="bg-green-100 text-green-800 border-green-200 px-3 py-1 rounded-full text-sm font-medium border flex items-center space-x-1">
                                                    <span>{getPurposeIcon(profile.purpose)}</span>
                                                    <span>{profile.purpose?.replace('_', ' ').toUpperCase() || 'GENERAL'}</span>
                                                </span>
                                            </div>
                                        </div>

                                        {/* Stats Grid */}
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                                            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                                                <div className="text-blue-600 text-lg mb-1">📅</div>
                                                <h3 className="font-medium text-gray-800 mb-1">Joined</h3>
                                                <p className="text-gray-600 text-sm">{formatDate(profile.createdAt)}</p>
                                            </div>
                                            <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                                                <div className="text-green-600 text-lg mb-1">🏷️</div>
                                                <h3 className="font-medium text-gray-800 mb-1">Skills</h3>
                                                <p className="text-gray-600 text-sm">{profile.tags?.length || 0} Tags</p>
                                            </div>
                                            <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                                                <div className="text-purple-600 text-lg mb-1">🔗</div>
                                                <h3 className="font-medium text-gray-800 mb-1">Sources</h3>
                                                <p className="text-gray-600 text-sm">{profile.sources?.length || 0} Connected</p>
                                            </div>
                                        </div>

                                        {/* Skills Section */}
                                        {profile.tags && profile.tags.length > 0 && (
                                            <div className="mb-6">
                                                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                                                    <span className="mr-2">🎯</span>
                                                    Skills & Tags
                                                </h3>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.tags.map((tag, index) => (
                                                        <span 
                                                            key={index}
                                                            className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200 hover:bg-red-100 transition-colors duration-200"
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {/* Sources Section */}
                                        {profile.sources && profile.sources.length > 0 && (
                                            <div>
                                                <h3 className="font-medium text-gray-800 mb-3 flex items-center">
                                                    <span className="mr-2">🌐</span>
                                                    Connected Sources
                                                </h3>
                                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                                    {profile.sources.map((source, index) => (
                                                        <div 
                                                            key={index}
                                                            className="bg-gray-50 border border-gray-200 rounded-lg p-3 hover:bg-gray-100 transition-colors duration-200"
                                                        >
                                                            <div className="flex items-center space-x-3">
                                                                <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                                                    <span className="text-white font-medium text-sm">
                                                                        {source[0]?.toUpperCase()}
                                                                    </span>
                                                                </div>
                                                                <span className="font-medium text-gray-800 text-sm">{source}</span>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Action Cards */}
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="text-2xl mb-3">⚙️</div>
                                        <h3 className="font-medium text-gray-800 mb-1">Settings</h3>
                                        <p className="text-gray-600 text-sm mb-4">Manage account preferences</p>
                                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm w-full">
                                            Manage
                                        </button>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="text-2xl mb-3">📊</div>
                                        <h3 className="font-medium text-gray-800 mb-1">Analytics</h3>
                                        <p className="text-gray-600 text-sm mb-4">View activity statistics</p>
                                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm w-full">
                                            View Stats
                                        </button>
                                    </div>
                                    
                                    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-4 hover:shadow-md transition-shadow duration-200">
                                        <div className="text-2xl mb-3">🎯</div>
                                        <h3 className="font-medium text-gray-800 mb-1">Goals</h3>
                                        <p className="text-gray-600 text-sm mb-4">Set and track objectives</p>
                                        <button className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-3 rounded-lg transition-colors duration-200 text-sm w-full">
                                            Set Goals
                                        </button>
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
                                <div className="text-gray-300 text-4xl mb-4">👤</div>
                                <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Not Found</h2>
                                <p className="text-gray-600 mb-6">We couldn't find your profile data</p>
                                <button 
                                    onClick={fetchProfile}
                                    className="bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                                >
                                    Refresh Profile
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center justify-center transition-colors duration-200"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            <EditProfile 
                                profile={profile} 
                                onClose={() => setShowEditModal(false)}
                                onUpdate={fetchProfile}
                            />
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;