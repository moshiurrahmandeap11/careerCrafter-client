import React, { useState, useEffect } from 'react';
import {
    Edit3,
    Send,
    User,
    Briefcase,
    MapPin,
    DollarSign,
    Award,
    X,
    Plus,
    FileText,
    Globe,
    Calendar
} from 'lucide-react';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/UseAuth/useAuth';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';
import MainButton from '../sharedItems/MainButton/MainButton';

const HiredPost = () => {
    const { user } = useAuth();
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [profile, setProfile] = useState(null);
    const [includeHiredData, setIncludeHiredData] = useState(false);

    const [postData, setPostData] = useState({
        content: '',
        includeProfile: false
    });

    useEffect(() => {
        if (user?.email) {
            fetchUserProfile();
        }
    }, [user?.email]);

    const fetchUserProfile = async () => {
        try {
            const response = await axiosIntense.get(`/users/email/${user.email}`);
            if (response.data) {
                setProfile(response.data);
            }
        } catch (error) {
            console.error('Error fetching profile:', error);
        }
    };

    const handleInputClick = () => {
        setShowModal(true);
    };

    const handlePostSubmit = async (e) => {
        e.preventDefault();
        if (!postData.content.trim()) {
            Swal.fire({
                title: 'Empty Post!',
                text: 'Please write something to post',
                icon: 'warning',
                confirmButtonText: 'OK',
                background: '#f8fafc',
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
            return;
        }

        setLoading(true);
        try {
            const postToSave = {
                content: postData.content,
                includeProfile: includeHiredData,
                timestamp: new Date().toISOString(),
                ...(includeHiredData && profile ? {
                    profileData: {
                        fullName: profile.fullName,
                        desiredJobTitle: profile.desiredJobTitle,
                        currentJobTitle: profile.currentJobTitle,
                        location: profile.location,
                        expectedSalary: profile.expectedSalary,
                        skills: profile.skills,
                        yearsOfExperience: profile.yearsOfExperience,
                        preferredJobType: profile.preferredJobType,
                        resumeLink: profile.resumeLink,
                        portfolio: profile.portfolio
                    }
                } : {})
            };

            const currentPosts = profile?.hiredPosts || [];
            const updatedPosts = [...currentPosts, postToSave];

            const response = await axiosIntense.patch(`/users/email/${user.email}`, {
                hiredPosts: updatedPosts
            });

            if (response.data) {
                Swal.fire({
                    title: 'Success!',
                    text: 'Your post has been published successfully!',
                    icon: 'success',
                    confirmButtonText: 'Great!',
                    background: '#f8fafc',
                    customClass: {
                        popup: 'rounded-2xl'
                    }
                });

                setPostData({ content: '', includeProfile: false });
                setIncludeHiredData(false);
                setShowModal(false);
                fetchUserProfile();
            }
        } catch (error) {
            console.error('Error creating post:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create post. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                background: '#f8fafc',
                customClass: {
                    popup: 'rounded-2xl'
                }
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto p-6">
            {/* Header */}
            <div className="mb-8 text-center">
                <h1 className="text-3xl font-bold text-gray-900 mb-3">Updates!</h1>
                <p className="text-gray-600 text-lg">
                    Share your professional journey and connect with opportunities
                </p>
            </div>

            {/* Create Post Section */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-6 mb-8 hover:shadow-xl transition-all duration-300">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        {profile?.profileImage ? (
                            <img
                                src={profile.profileImage}
                                alt={profile.fullName}
                                className="w-full h-full object-cover rounded-2xl"
                            />
                        ) : (
                            <User className="w-6 h-6 text-white" />
                        )}
                    </div>

                    <div className="flex-1">
                        {/* Input Field */}
                        <div
                            onClick={handleInputClick}
                            className="bg-white border-2 border-dashed border-gray-300 rounded-2xl p-2 cursor-pointer hover:border-blue-400 hover:bg-blue-50/50 transition-all duration-300 mb-4 group"
                        >
                            <div className="flex items-center space-x-4 text-gray-500 group-hover:text-blue-600 transition-colors">
                                <Edit3 className="w-6 h-6" />
                                <span className="text-xs font-medium">Share your career update...</span>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Quick Stats */}
                <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex  flex-col space-x-4">
                        <span>Your posts: {profile?.hiredPosts?.length || 0}</span>

                        <span>Last update: {profile?.hiredPosts?.length ? 'Recent' : 'Never'}</span>
                    </div>
                    <button
                        onClick={handleInputClick}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                    >
                        Create Post
                    </button>
                </div>
            </div>

            {/* Create Post Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 bg-opacity-50 z-50 flex items-center justify-center p-4 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between rounded-t-2xl">
                            <h2 className="text-2xl font-bold text-gray-900">Create Career Update</h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200 hover:scale-110"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <form onSubmit={handlePostSubmit}>
                                {/* User Info */}
                                <div className="flex items-center space-x-4 mb-6 p-4 bg-gray-50 rounded-2xl">
                                    <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                                        {profile?.profileImage ? (
                                            <img
                                                src={profile.profileImage}
                                                alt={profile.fullName}
                                                className="w-full h-full object-cover rounded-2xl"
                                            />
                                        ) : (
                                            <User className="w-7 h-7 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900 text-lg">
                                            {profile?.fullName || 'You'}
                                        </p>
                                        <p className="text-sm text-gray-500">Posting to Career Network</p>
                                    </div>
                                </div>

                                {/* Content Textarea */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-700 mb-3">
                                        What's new in your career?
                                    </label>
                                    <textarea
                                        value={postData.content}
                                        onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                                        placeholder="Share your job search progress, career achievements, skills you're learning, or opportunities you're seeking..."
                                        rows={6}
                                        className="w-full px-4 py-4 border border-gray-300 rounded-2xl focus:outline-none focus:ring-3 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 resize-none text-lg shadow-sm"
                                    />
                                    <div className="flex justify-between items-center mt-2 text-sm text-gray-500">
                                        <span>This will be visible to employers and your network</span>
                                        <span>{postData.content.length}/500</span>
                                    </div>
                                </div>

                                {/* Include Hired Data Toggle */}
                                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 mb-6 border border-blue-100">
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-2 text-lg flex items-center gap-2">
                                                <Award className="w-5 h-5 text-blue-600" />
                                                Include Professional Profile
                                            </h3>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                Attach your job preferences, resume, and portfolio links to help employers discover you
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIncludeHiredData(!includeHiredData)}
                                            className={`relative inline-flex h-7 w-12 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-3 focus:ring-blue-500/20 ${includeHiredData ? 'bg-blue-600' : 'bg-gray-200'
                                                }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-6 w-6 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${includeHiredData ? 'translate-x-5' : 'translate-x-0'
                                                    }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Preview of included data */}
                                    {includeHiredData && profile && (
                                        <div className="mt-4 p-4 bg-white rounded-xl border border-blue-200">
                                            <h4 className="font-semibold text-gray-900 mb-3 text-sm flex items-center gap-2">
                                                📋 Included Information
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                                                {profile.desiredJobTitle && (
                                                    <div className="flex items-center space-x-2">
                                                        <Briefcase className="w-4 h-4 text-green-600" />
                                                        <span>Desired: {profile.desiredJobTitle}</span>
                                                    </div>
                                                )}
                                                {profile.currentJobTitle && (
                                                    <div className="flex items-center space-x-2">
                                                        <Briefcase className="w-4 h-4 text-blue-600" />
                                                        <span>Current: {profile.currentJobTitle}</span>
                                                    </div>
                                                )}
                                                {profile.location && (
                                                    <div className="flex items-center space-x-2">
                                                        <MapPin className="w-4 h-4 text-red-600" />
                                                        <span>Location: {profile.location}</span>
                                                    </div>
                                                )}
                                                {profile.expectedSalary && (
                                                    <div className="flex items-center space-x-2">
                                                        <DollarSign className="w-4 h-4 text-green-600" />
                                                        <span>Salary: ${profile.expectedSalary}</span>
                                                    </div>
                                                )}
                                                {profile.resumeLink && (
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="w-4 h-4 text-blue-600" />
                                                        <span>Resume Available</span>
                                                    </div>
                                                )}
                                                {profile.portfolio && (
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className="w-4 h-4 text-green-600" />
                                                        <span>Portfolio Available</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-8 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200 shadow-sm hover:shadow-md"
                                    >
                                        Cancel
                                    </button>
                                    <MainButton
                                        type="submit"
                                        disabled={loading || !postData.content.trim()}
                                        className="px-8 py-3 rounded-xl font-medium flex items-center space-x-3 shadow-lg hover:shadow-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Publishing...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                <span>Publish Update</span>
                                            </>
                                        )}
                                    </MainButton>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State */}
            {(!profile?.hiredPosts || profile.hiredPosts.length === 0) && (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="w-24 h-24 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <Edit3 className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-semibold text-gray-800 mb-3">Share Your Journey</h3>
                    <p className="text-gray-600 mb-8 text-lg max-w-md mx-auto leading-relaxed">
                        Start building your professional presence by sharing your career updates, achievements, and what you're looking for.
                    </p>
                    <MainButton
                        onClick={handleInputClick}
                        className="px-8 py-4 rounded-2xl font-medium flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl transition-all duration-300"
                    >
                        <Plus className="w-5 h-5" />
                        <span className="text-lg">Create Your First Update</span>
                    </MainButton>
                </div>
            )}

            {/* Existing Posts Preview */}
            {profile?.hiredPosts && profile.hiredPosts.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-xl font-semibold text-gray-900 mb-6">Your Recent Updates</h3>
                    <div className="grid gap-4">
                        {profile.hiredPosts.slice(0, 3).map((post, index) => (
                            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                                            <Calendar className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-gray-900">{profile.fullName}</p>
                                            <p className="text-sm text-gray-500">
                                                {new Date(post.timestamp).toLocaleDateString('en-US', {
                                                    year: 'numeric',
                                                    month: 'short',
                                                    day: 'numeric'
                                                })}
                                            </p>
                                        </div>
                                    </div>
                                    {post.includeProfile && (
                                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-xs font-medium">
                                            Profile Included
                                        </span>
                                    )}
                                </div>
                                <p className="text-gray-700 whitespace-pre-line leading-relaxed">
                                    {post.content.length > 150 ? post.content.substring(0, 150) + '...' : post.content}
                                </p>
                            </div>
                        ))}
                    </div>
                    {profile.hiredPosts.length > 3 && (
                        <div className="text-center mt-6">
                            <button className="text-blue-600 hover:text-blue-700 font-medium">
                                View All Updates ({profile.hiredPosts.length})
                            </button>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default HiredPost;