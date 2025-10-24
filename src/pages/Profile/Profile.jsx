import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/UseAuth/useAuth';
import Loader from '../../components/sharedItems/Loader/Loader';
import { Link, useNavigate } from 'react-router';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';

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
  Sparkles,
  Award,
  Briefcase,
  Eye,
  Trash2,
  FileText,
  MapPin,
  DollarSign,
  Building
} from 'lucide-react';
import Swal from 'sweetalert2';
import EditProfile from './EditProfile/EditProfile';

const Profile = () => {
    const { user, loading, userLogOut } = useAuth();
    const [profile, setProfile] = useState(null);
    const [profileLoading, setProfileLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showPostModal, setShowPostModal] = useState(false);
    const [selectedPost, setSelectedPost] = useState(null);
    const [editPostData, setEditPostData] = useState(null);
    const navigate = useNavigate();

    console.log(profile);

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
            
            if (response.data && response.data._id) {
                setProfile(response.data);
            } else {
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

    const handleGetHired = () => {
        navigate('/profile/hired');
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
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

    // Post Management Functions
    const handleViewPost = (post) => {
        setSelectedPost(post);
        setShowPostModal(true);
    };

    const handleEditPost = (post) => {
        setEditPostData(post);
        setShowPostModal(true);
    };

    const handleDeletePost = async (postIndex) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: "This cannot be undone!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const updatedPosts = profile.hiredPosts.filter((_, index) => index !== postIndex);
                await axiosIntense.patch(`/users/email/${user.email}`, {
                    hiredPosts: updatedPosts
                });
                
                Swal.fire({
                    title: 'Deleted!',
                    text: 'Your post has been deleted.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
                
                fetchProfile(); // Refresh profile data
            } catch (error) {
                console.error('Error deleting post:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete post. Please try again.',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleUpdatePost = async (e) => {
        e.preventDefault();
        if (!editPostData.content.trim()) {
            Swal.fire({
                title: 'Empty Post!',
                text: 'Please write something',
                icon: 'warning',
                confirmButtonText: 'OK'
            });
            return;
        }

        try {
            const updatedPosts = profile.hiredPosts.map((post, index) => 
                index === editPostData.index ? {
                    ...editPostData,
                    index: undefined // Remove index before saving
                } : post
            );

            await axiosIntense.patch(`/users/email/${user.email}`, {
                hiredPosts: updatedPosts
            });

            Swal.fire({
                title: 'Success!',
                text: 'Your post has been successfully updated!',
                icon: 'success',
                confirmButtonText: 'Great!'
            });

            setShowPostModal(false);
            setEditPostData(null);
            fetchProfile(); // Refresh profile data
        } catch (error) {
            console.error('Error updating post:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to update post. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
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
                                                src={profile?.profileImage} 
                                                alt={profile?.fullName || 'User'}
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
                                    onClick={handleGetHired}
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                                >
                                    <Award className="w-4 h-4" />
                                    <span>Get Hired</span>
                                </button>
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

                                {/* Posts Table Section */}
                                {profile.hiredPosts && profile.hiredPosts.length > 0 && (
                                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                                        <div className="flex items-center justify-between mb-6">
                                            <h3 className="text-lg font-semibold text-gray-900">Your Hired Posts</h3>
                                            <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                                                {profile.hiredPosts.length} Posts
                                            </span>
                                        </div>
                                        
                                        <div className="overflow-x-auto">
                                            <table className="w-full">
                                                <thead>
                                                    <tr className="border-b border-gray-200">
                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Content</th>
                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Date</th>
                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Profile Data</th>
                                                        <th className="text-left py-3 px-4 text-sm font-semibold text-gray-700">Actions</th>
                                                    </tr>
                                                </thead>
                                                <tbody className="divide-y divide-gray-100">
                                                    {profile.hiredPosts.slice().reverse().map((post, index) => {
                                                        const originalIndex = profile.hiredPosts.length - 1 - index;
                                                        return (
                                                            <tr key={originalIndex} className="hover:bg-gray-50 transition-colors duration-150">
                                                                <td className="py-4 px-4">
                                                                    <div className="max-w-xs">
                                                                        <p className="text-sm text-gray-800 line-clamp-2">
                                                                            {post.content}
                                                                        </p>
                                                                    </div>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <p className="text-sm text-gray-600">
                                                                        {formatDate(post.timestamp)}
                                                                    </p>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                                        post.includeProfile 
                                                                            ? 'bg-green-100 text-green-800' 
                                                                            : 'bg-gray-100 text-gray-800'
                                                                    }`}>
                                                                        {post.includeProfile ? 'Included' : 'Not Included'}
                                                                    </span>
                                                                </td>
                                                                <td className="py-4 px-4">
                                                                    <div className="flex items-center space-x-2">
                                                                        <button
                                                                            onClick={() => handleViewPost({...post, index: originalIndex})}
                                                                            className="w-8 h-8 bg-blue-50 hover:bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                                                            title="View Post"
                                                                        >
                                                                            <Eye className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleEditPost({...post, index: originalIndex})}
                                                                            className="w-8 h-8 bg-green-50 hover:bg-green-100 text-green-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                                                            title="Edit Post"
                                                                        >
                                                                            <Edit3 className="w-4 h-4" />
                                                                        </button>
                                                                        <button
                                                                            onClick={() => handleDeletePost(originalIndex)}
                                                                            className="w-8 h-8 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg flex items-center justify-center transition-colors duration-200"
                                                                            title="Delete Post"
                                                                        >
                                                                            <Trash2 className="w-4 h-4" />
                                                                        </button>
                                                                    </div>
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                                </tbody>
                                            </table>
                                        </div>
                                    </div>
                                )}

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
                                                <p className="text-sm text-gray-500">Member Since</p>
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
                                        <button 
                                            onClick={handleGetHired}
                                            className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200 text-left"
                                        >
                                            <Award className="w-5 h-5 text-green-600" />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Get Hired</p>
                                                <p className="text-gray-500 text-xs">Find your dream job</p>
                                            </div>
                                        </button>

                                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200 text-left">
                                            <Settings className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Settings</p>
                                                <p className="text-gray-500 text-xs">Account preferences</p>
                                            </div>
                                        </button>
                                        
                                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200 text-left">
                                            <BarChart3 className="w-5 h-5 text-gray-600" />
                                            <div>
                                                <p className="font-medium text-gray-900 text-sm">Analytics</p>
                                                <p className="text-gray-500 text-xs">View activity statistics</p>
                                            </div>
                                        </button>
                                        
                                        <button className="w-full flex items-center space-x-3 p-3 rounded-xl border border-gray-200 hover:border-orange-300 hover:bg-orange-50 transition-all duration-200 text-left">
                                            <Target className="w-5 h-5 text-gray-600" />
                                            <Link to={'/skill-gap-analysis'}>
                                                <p className="font-medium text-gray-900 text-sm">Skill Gap</p>
                                                <p className="text-gray-500 text-xs">Set your objectives</p>
                                            </Link>
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

            {/* Post View/Edit Modal */}
            {showPostModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-800">
                                {editPostData ? 'Edit Post' : 'View Post'}
                            </h2>
                            <button 
                                onClick={() => {
                                    setShowPostModal(false);
                                    setEditPostData(null);
                                    setSelectedPost(null);
                                }}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200"
                            >
                                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </button>
                        </div>
                        <div className="p-6">
                            {editPostData ? (
                                // Edit Form
                                <form onSubmit={handleUpdatePost}>
                                    <div className="mb-6">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Post Content
                                        </label>
                                        <textarea
                                            value={editPostData.content}
                                            onChange={(e) => setEditPostData({...editPostData, content: e.target.value})}
                                            rows={6}
                                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                            placeholder="Share your job search journey..."
                                        />
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowPostModal(false);
                                                setEditPostData(null);
                                            }}
                                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-xl transition-all duration-200"
                                        >
                                            Update Post
                                        </button>
                                    </div>
                                </form>
                            ) : (
                                // View Mode
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-sm font-medium text-gray-700 mb-2">Content</h3>
                                        <p className="text-gray-800 bg-gray-50 rounded-xl p-4 whitespace-pre-line">
                                            {selectedPost?.content}
                                        </p>
                                    </div>
                                    
                                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                                        <Calendar className="w-4 h-4" />
                                        <span>Posted on {formatDate(selectedPost?.timestamp)}</span>
                                    </div>

                                    {selectedPost?.includeProfile && selectedPost.profileData && (
                                        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
                                            <h4 className="font-semibold text-blue-900 mb-3 flex items-center space-x-2">
                                                <Briefcase className="w-4 h-4" />
                                                <span>Included Profile Information</span>
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                                {selectedPost.profileData.desiredJobTitle && (
                                                    <div className="flex items-center space-x-2">
                                                        <Award className="w-4 h-4 text-green-600" />
                                                        <span className="text-gray-700">
                                                            <strong>Desired Position:</strong> {selectedPost.profileData.desiredJobTitle}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedPost.profileData.currentJobTitle && (
                                                    <div className="flex items-center space-x-2">
                                                        <Building className="w-4 h-4 text-blue-600" />
                                                        <span className="text-gray-700">
                                                            <strong>Current Position:</strong> {selectedPost.profileData.currentJobTitle}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedPost.profileData.location && (
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="w-4 h-4 text-red-600" />
                                                        <span className="text-gray-700">
                                                            <strong>Location:</strong> {selectedPost.profileData.location}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedPost.profileData.expectedSalary && (
                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                        <span className="text-gray-700">
                                                            <strong>Expected Salary:</strong> ${selectedPost.profileData.expectedSalary}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedPost.profileData.yearsOfExperience && (
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="w-4 h-4 text-purple-600" />
                                                        <span className="text-gray-700">
                                                            <strong>Experience:</strong> {selectedPost.profileData.yearsOfExperience}
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedPost.profileData.resumeLink && (
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        <span className="text-gray-700">
                                                            <strong>Resume:</strong> Available
                                                        </span>
                                                    </div>
                                                )}
                                                {selectedPost.profileData.portfolio && (
                                                    <div className="flex items-center space-x-2">
                                                        <Briefcase className="w-4 h-4 text-orange-600" />
                                                        <span className="text-gray-700">
                                                            <strong>Portfolio:</strong> Available
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => {
                                                setShowPostModal(false);
                                                setSelectedPost(null);
                                            }}
                                            className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-medium transition-all duration-200"
                                        >
                                            Close
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Profile;