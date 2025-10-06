import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth/useAuth';
import Loader from '../../components/sharedItems/Loader/Loader';
import { useNavigate } from 'react-router';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';
import EditProfile from './EditProfile/EditProfile';
import { 
  User, 
  Mail, 
  Calendar, 
  Tag, 
  Users, 
  Crown, 
  Zap, 
  Settings, 
  BarChart3, 
  Target,
  LogOut,
  Edit3,
  Sparkles
} from 'lucide-react';

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

            
            // ✅ FIX: Check if response.data exists directly (without success property)
            if (response.data && response.data._id) {
                setProfile(response.data); // ✅ Use response.data directly
                console.log(response.data);

            } else {
                console.warn('No valid profile data found in response');
                setError('Profile data not found or invalid');
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
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
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
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">
                    <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <User className="w-8 h-8 text-red-600" />
                    </div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Profile Error</h2>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <button 
                        onClick={fetchProfile}
                        className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <>
            <div className="min-h-screen bg-gray-50/60">
                {/* Header */}
                <div className="bg-white border-b border-gray-100">
                    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                            <div className="flex items-center space-x-4">
                                <div className="relative">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-sm">
                                        {profile?.profileImage ? (
                                            <img 
                                                src={profile.profileImage} 
                                                alt={profile.fullName || 'User'}
                                                className="w-full h-full object-cover rounded-xl"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className={`w-full h-full rounded-xl flex items-center justify-center ${profile?.profileImage ? 'hidden' : 'flex'}`}>
                                            <User className="w-6 h-6 text-white" />
                                        </div>
                                    </div>
                                    {profile?.isPremium && (
                                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                                            <Crown className="w-3 h-3 text-white fill-current" />
                                        </div>
                                    )}
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
                                    <p className="text-gray-500 text-sm">Manage your account settings</p>
                                </div>
                            </div>
                            <div className="flex items-center space-x-3">
                                <button 
                                    onClick={() => setShowEditModal(true)}
                                    className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                                >
                                    <Edit3 className="w-4 h-4" />
                                    <span>Edit Profile</span>
                                </button>
                                <button 
                                    onClick={handleLogOut}
                                    className="bg-white border border-gray-200 hover:border-red-200 hover:bg-red-50 text-red-600 font-medium py-2.5 px-4 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                                >
                                    <LogOut className="w-4 h-4" />
                                    <span>Logout</span>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {profile ? (
                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                            {/* Left Column - Profile Info */}
                            <div className="lg:col-span-2 space-y-6">
                                {/* Profile Card */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
                                        <div className="relative">
                                            <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg overflow-hidden">
                                                {profile.profileImage ? (
                                                    <img 
                                                        src={profile.profileImage} 
                                                        alt={profile.fullName || 'User'}
                                                        className="w-full h-full object-cover"
                                                        onError={(e) => {
                                                            e.target.style.display = 'none';
                                                            e.target.nextSibling.style.display = 'flex';
                                                        }}
                                                    />
                                                ) : null}
                                                <div className={`w-full h-full rounded-2xl flex items-center justify-center ${profile.profileImage ? 'hidden' : 'flex'}`}>
                                                    <User className="w-8 h-8 text-white" />
                                                </div>
                                            </div>
                                            {profile.isPremium && (
                                                <div className="absolute -top-2 -right-2 w-6 h-6 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                                                    <Crown className="w-3 h-3 text-white fill-current" />
                                                </div>
                                            )}
                                        </div>
                                        
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                                                <div>
                                                    <h2 className="text-2xl font-bold text-gray-900 mb-1">
                                                        {profile.fullName || 'No Name'}
                                                    </h2>
                                                    <div className="flex items-center space-x-2 text-gray-600">
                                                        <Mail className="w-4 h-4" />
                                                        <span className="text-sm">{profile.email || 'No Email'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex flex-wrap gap-2">
                                                    {profile.role && (
                                                        <span className={`px-3 py-1.5 rounded-full text-xs font-semibold flex items-center space-x-1 ${
                                                            profile.role === 'premium user' 
                                                                ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white'
                                                                : 'bg-blue-100 text-blue-700'
                                                        }`}>
                                                            <Crown className="w-3 h-3" />
                                                            <span>{profile.role}</span>
                                                        </span>
                                                    )}
                                                    {profile.purpose && (
                                                        <span className="bg-blue-50 text-blue-700 border border-blue-200 px-3 py-1.5 rounded-full text-xs font-medium flex items-center space-x-1">
                                                            <span className="text-sm">{getPurposeIcon(profile.purpose)}</span>
                                                            <span>{profile.purpose.replace('_', ' ')}</span>
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                                                <Zap className="w-5 h-5 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {profile.aiCredits ? profile.aiCredits.toLocaleString() : '0'}
                                                </p>
                                                <p className="text-sm text-gray-500">AI Credits</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                                                <Calendar className="w-5 h-5 text-green-600" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-semibold text-gray-900">
                                                    {formatDate(profile.createdAt)}
                                                </p>
                                                <p className="text-sm text-gray-500">Member since</p>
                                            </div>
                                        </div>
                                    </div>
                                    
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
                                        <div className="flex items-center space-x-3">
                                            <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                                                <Users className="w-5 h-5 text-purple-600" />
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900">
                                                    {profile.sources?.length || 0}
                                                </p>
                                                <p className="text-sm text-gray-500">Sources</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Skills Section */}
                                {profile.tags && profile.tags.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Tag className="w-5 h-5 text-gray-700" />
                                            <h3 className="font-semibold text-gray-900">Skills & Expertise</h3>
                                        </div>
                                        <div className="flex flex-wrap gap-2">
                                            {profile.tags.map((tag, index) => (
                                                <span 
                                                    key={index}
                                                    className="bg-gray-50 text-gray-700 px-3 py-2 rounded-xl text-sm font-medium border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {/* Sources Section */}
                                {profile.sources && profile.sources.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center space-x-2 mb-4">
                                            <Users className="w-5 h-5 text-gray-700" />
                                            <h3 className="font-semibold text-gray-900">Connected Sources</h3>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                            {profile.sources.map((source, index) => (
                                                <div 
                                                    key={index}
                                                    className="flex items-center space-x-3 p-3 bg-gray-50 rounded-xl border border-gray-200 hover:bg-gray-100 transition-all duration-200"
                                                >
                                                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                                                        <span className="text-white font-medium text-xs">
                                                            {source[0]?.toUpperCase()}
                                                        </span>
                                                    </div>
                                                    <span className="font-medium text-gray-800 text-sm">{source}</span>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>

                            {/* Right Column - Actions */}
                            <div className="space-y-6">
                                {/* Quick Actions */}
                                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                    <h3 className="font-semibold text-gray-900 mb-4">Quick Actions</h3>
                                    <div className="space-y-3">
                                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left">
                                            <Settings className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Settings</p>
                                                <p className="text-gray-500 text-xs">Account preferences</p>
                                            </div>
                                        </button>
                                        
                                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left">
                                            <BarChart3 className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Analytics</p>
                                                <p className="text-gray-500 text-xs">View activity stats</p>
                                            </div>
                                        </button>
                                        
                                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
                                            <Target className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Goals</p>
                                                <p className="text-gray-500 text-xs">Set objectives</p>
                                            </div>
                                        </button>
                                    </div>
                                </div>

                                {/* Subscription Info */}
                                {profile.isPremium && (
                                    <div className="bg-gradient-to-br from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
                                        <div className="flex items-center space-x-2 mb-3">
                                            <Crown className="w-5 h-5" />
                                            <h3 className="font-semibold">Premium Member</h3>
                                        </div>
                                        <p className="text-amber-100 text-sm mb-4">
                                            Enjoy exclusive features and benefits with your {profile.planName} plan.
                                        </p>
                                        <div className="space-y-2 text-sm">
                                            <div className="flex justify-between">
                                                <span className="text-amber-100">Plan</span>
                                                <span className="font-medium">{profile.planName}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-amber-100">Billing</span>
                                                <span className="font-medium">{profile.billingCycle}</span>
                                            </div>
                                            <div className="flex justify-between">
                                                <span className="text-amber-100">Status</span>
                                                <span className="font-medium capitalize">{profile.subscriptionStatus}</span>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* AI Credits */}
                                <div className="bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg p-6 text-white">
                                    <div className="flex items-center space-x-2 mb-3">
                                        <Sparkles className="w-5 h-5" />
                                        <h3 className="font-semibold">AI Credits</h3>
                                    </div>
                                    <p className="text-blue-100 text-sm mb-4">
                                        Use your credits to access powerful AI features across the platform.
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-bold">
                                            {profile.aiCredits ? profile.aiCredits.toLocaleString() : '0'}
                                        </span>
                                        <button className="bg-white text-blue-600 px-4 py-2 rounded-xl font-medium text-sm hover:bg-blue-50 transition-colors duration-200">
                                            Get More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <User className="w-8 h-8 text-gray-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-800 mb-2">No Profile Found</h2>
                            <p className="text-gray-600 mb-6">We couldn't find your profile information</p>
                            <button 
                                onClick={fetchProfile}
                                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200"
                            >
                                Refresh Profile
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Edit Profile Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">Edit Profile</h2>
                            <button 
                                onClick={() => setShowEditModal(false)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200"
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