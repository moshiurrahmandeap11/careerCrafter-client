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
  Link
} from 'lucide-react';

import Swal from 'sweetalert2';
import useAuth from '../../hooks/UseAuth/useAuth';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';

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
                confirmButtonText: 'OK'
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
                        resumeLink: profile.resumeLink, // Added resume link
                        portfolio: profile.portfolio // Added portfolio link
                    }
                } : {})
            };

            // Get current posts array or initialize empty array
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
                    confirmButtonText: 'Great!'
                });
                
                setPostData({ content: '', includeProfile: false });
                setIncludeHiredData(false);
                setShowModal(false);
                fetchUserProfile(); // Refresh profile data
            }
        } catch (error) {
            console.error('Error creating post:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to create post. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-2">Hired Posts</h1>
                <p className="text-gray-600">
                    Share your job search journey and connect with opportunities
                </p>
            </div>

            {/* Create Post Section */}
            <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-8">
                <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center flex-shrink-0">
                        {profile?.profileImage ? (
                            <img 
                                src={profile.profileImage} 
                                alt={profile.fullName}
                                className="w-full h-full object-cover rounded-xl"
                            />
                        ) : (
                            <User className="w-6 h-6 text-white" />
                        )}
                    </div>
                    
                    <div className="flex-1">
                        {/* Input Field */}
                        <div 
                            onClick={handleInputClick}
                            className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-2xl p-4 cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 mb-4"
                        >
                            <div className="flex items-center space-x-3 text-gray-500">
                                <Edit3 className="w-5 h-5" />
                                <span className="text-lg">Share your job search update...</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Post Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        {/* Modal Header */}
                        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-gray-900">Create Post</h2>
                            <button 
                                onClick={() => setShowModal(false)}
                                className="w-8 h-8 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-all duration-200"
                            >
                                <X className="w-5 h-5 text-gray-600" />
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div className="p-6">
                            <form onSubmit={handlePostSubmit}>
                                {/* User Info */}
                                <div className="flex items-center space-x-3 mb-6">
                                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                                        {profile?.profileImage ? (
                                            <img 
                                                src={profile.profileImage} 
                                                alt={profile.fullName}
                                                className="w-full h-full object-cover rounded-xl"
                                            />
                                        ) : (
                                            <User className="w-6 h-6 text-white" />
                                        )}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">
                                            {profile?.fullName || 'You'}
                                        </p>
                                        <p className="text-sm text-gray-500">Posting to Hired Feed</p>
                                    </div>
                                </div>

                                {/* Content Textarea */}
                                <div className="mb-6">
                                    <textarea
                                        value={postData.content}
                                        onChange={(e) => setPostData({ ...postData, content: e.target.value })}
                                        placeholder="Share your job search journey, achievements, or what you're looking for..."
                                        rows={6}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                                    />
                                </div>

                                {/* Include Hired Data Toggle */}
                                <div className="bg-gray-50 rounded-2xl p-4 mb-6">
                                    <div className="flex items-center justify-between">
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 mb-1">
                                                Include Job Preferences & Links
                                            </h3>
                                            <p className="text-sm text-gray-600">
                                                Attach your job preferences, resume and portfolio links from your Get Hired profile to this post
                                            </p>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => setIncludeHiredData(!includeHiredData)}
                                            className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                                                includeHiredData ? 'bg-blue-600' : 'bg-gray-200'
                                            }`}
                                        >
                                            <span
                                                className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                                                    includeHiredData ? 'translate-x-5' : 'translate-x-0'
                                                }`}
                                            />
                                        </button>
                                    </div>

                                    {/* Preview of included data */}
                                    {includeHiredData && profile && (
                                        <div className="mt-4 p-4 bg-white rounded-xl border border-gray-200">
                                            <h4 className="font-semibold text-gray-900 mb-3 text-sm">
                                                Included Information:
                                            </h4>
                                            <div className="space-y-2 text-sm text-gray-600">
                                                {profile.desiredJobTitle && (
                                                    <p>• Desired Role: {profile.desiredJobTitle}</p>
                                                )}
                                                {profile.currentJobTitle && (
                                                    <p>• Current Role: {profile.currentJobTitle}</p>
                                                )}
                                                {profile.location && (
                                                    <p>• Location: {profile.location}</p>
                                                )}
                                                {profile.expectedSalary && (
                                                    <p>• Expected Salary: ${profile.expectedSalary}</p>
                                                )}
                                                {profile.yearsOfExperience && (
                                                    <p>• Experience: {profile.yearsOfExperience}</p>
                                                )}
                                                {profile.resumeLink && (
                                                    <div className="flex items-center space-x-2">
                                                        <FileText className="w-3 h-3 text-blue-600" />
                                                        <span>Resume: Available</span>
                                                    </div>
                                                )}
                                                {profile.portfolio && (
                                                    <div className="flex items-center space-x-2">
                                                        <Globe className="w-3 h-3 text-green-600" />
                                                        <span>Portfolio: Available</span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {/* Submit Button */}
                                <div className="flex items-center justify-between">
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="px-6 py-3 border border-gray-300 text-gray-700 rounded-xl font-medium hover:bg-gray-50 transition-all duration-200"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={loading || !postData.content.trim()}
                                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {loading ? (
                                            <>
                                                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                                <span>Posting...</span>
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5" />
                                                <span>Post to Hired</span>
                                            </>
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Empty State - Only show if there are no posts */}
            {(!profile?.hiredPosts || profile.hiredPosts.length === 0) && (
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-12 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <FileText className="w-10 h-10 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">No Posts Yet</h3>
                    <p className="text-gray-600 mb-6">
                        Share your job search journey to connect with opportunities and employers
                    </p>
                    <button 
                        onClick={handleInputClick}
                        className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto shadow-lg hover:shadow-xl"
                    >
                        <Plus className="w-5 h-5" />
                        <span>Create Your First Post</span>
                    </button>
                </div>
            )}
        </div>
    );
};

export default HiredPost;