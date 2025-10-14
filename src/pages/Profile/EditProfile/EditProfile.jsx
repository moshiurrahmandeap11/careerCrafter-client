import React, { useState, useEffect } from 'react';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';


const EditProfile = ({ profile, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        fullName: '',
        role: '',
        purpose: '',
        tags: [],
        sources: [],
        profileImage: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [newTag, setNewTag] = useState('');
    const [newSource, setNewSource] = useState('');
    const [imageFile, setImageFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [imageUploading, setImageUploading] = useState(false);

    // Load profile data into form
    useEffect(() => {
        if (profile) {
            setFormData({
                fullName: profile.fullName || '',
                role: profile.role || '',
                purpose: profile.purpose || '',
                tags: profile.tags || [],
                sources: profile.sources || [],
                profileImage: profile.profileImage || ''
            });
            // Set existing profile image as preview
            if (profile.profileImage) {
                setImagePreview(profile.profileImage);
            }
        }
    }, [profile]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                setError('Please select a valid image file (JPEG, PNG, GIF, or WebP)');
                return;
            }

            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError('Image size must be less than 5MB');
                return;
            }

            setImageFile(file);
            
            // Create preview
            const reader = new FileReader();
            reader.onload = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
            setError(null);
        }
    };

    const uploadImageToImgbb = async (file) => {
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://api.imgbb.com/1/upload?key=af5080f6264ea38c18a1cf186815b22f', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Image upload failed');
            }

            const data = await response.json();
            return data.data.url;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw new Error('Failed to upload image');
        }
    };

    const removeImage = () => {
        setImageFile(null);
        setImagePreview(profile?.profileImage || null);
        setFormData(prev => ({
            ...prev,
            profileImage: profile?.profileImage || ''
        }));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const addTag = () => {
        if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, newTag.trim()]
            }));
            setNewTag('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
    };

    const addSource = () => {
        if (newSource.trim() && !formData.sources.includes(newSource.trim())) {
            setFormData(prev => ({
                ...prev,
                sources: [...prev.sources, newSource.trim()]
            }));
            setNewSource('');
        }
    };

    const removeSource = (sourceToRemove) => {
        setFormData(prev => ({
            ...prev,
            sources: prev.sources.filter(source => source !== sourceToRemove)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setSuccess(false);

        try {
            let updatedFormData = { ...formData };

            // If there's a new image file, upload it first
            if (imageFile) {
                setImageUploading(true);
                try {
                    const imageUrl = await uploadImageToImgbb(imageFile);
                    updatedFormData.profileImage = imageUrl;
                } catch  {
                    throw new Error('Failed to upload image. Please try again.');
                } finally {
                    setImageUploading(false);
                }
            }

            await axiosIntense.patch(`/users/email/${profile.email}`, updatedFormData);
            setSuccess(true);
            setTimeout(() => {
                onUpdate(); // Refresh profile data
                onClose(); // Close modal
            }, 1500);
        } catch (err) {
            console.error('Error updating profile:', err);
            setError(err.message || 'Failed to update profile. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="text-red-400 mr-2">⚠️</div>
                        <p className="text-red-700 text-sm">{error}</p>
                    </div>
                </div>
            )}

            {success && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                    <div className="flex">
                        <div className="text-green-400 mr-2">✅</div>
                        <p className="text-green-700 text-sm">Profile updated successfully!</p>
                    </div>
                </div>
            )}

            {/* Profile Image */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Profile Image
                </label>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                    <div className="flex-shrink-0">
                        {imagePreview ? (
                            <div className="relative">
                                <img
                                    src={imagePreview}
                                    alt="Profile Preview"
                                    className="w-24 h-24 rounded-full object-cover border-2 border-gray-200"
                                />
                                <button
                                    type="button"
                                    onClick={removeImage}
                                    className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 hover:bg-red-600 rounded-full flex items-center justify-center text-white text-sm transition-colors duration-200"
                                >
                                    ×
                                </button>
                            </div>
                        ) : (
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200">
                                <span className="text-2xl text-gray-400">👤</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-red-50 file:text-red-700 hover:file:bg-red-100 file:cursor-pointer cursor-pointer"
                            disabled={imageUploading || loading}
                        />
                        <p className="text-xs text-gray-500 mt-1">
                            PNG, JPG, GIF or WebP up to 5MB
                        </p>
                        {imageUploading && (
                            <div className="flex items-center mt-2 text-sm text-blue-600">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Uploading image...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Full Name */}
            <div>
                <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-2">
                    Full Name
                </label>
                <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Enter your full name"
                />
            </div>

{/* Role */}
<div>
  <label
    htmlFor="role"
    className="block text-sm font-medium text-gray-700 mb-2"
  >
    Role <span className="text-gray-400 text-xs">(read-only)</span>
  </label>
  <select
    id="role"
    name="role"
    value={formData.role}
    disabled // 🔒 makes it uneditable
    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed"
  >
    <option value="free user">Free User</option>
    <option value="premium user">Premium User</option>
    <option value="pro user">Pro User</option>
  </select>
</div>


            {/* Purpose */}
            <div>
                <label htmlFor="purpose" className="block text-sm font-medium text-gray-700 mb-2">
                    Purpose
                </label>
                <select
                    id="purpose"
                    name="purpose"
                    value={formData.purpose}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                    <option value="">Select Purpose</option>
                    <option value="find_job">Find Job</option>
                    <option value="networking">Networking</option>
                    <option value="learning">Learning</option>
                    <option value="freelancing">Freelancing</option>
                </select>
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills & Tags
                </label>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Add a skill or tag"
                        />
                        <button
                            type="button"
                            onClick={addTag}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Add
                        </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                        {formData.tags.map((tag, index) => (
                            <span
                                key={index}
                                className="bg-red-50 text-red-700 px-3 py-1 rounded-full text-sm font-medium border border-red-200 flex items-center gap-2"
                            >
                                {tag}
                                <button
                                    type="button"
                                    onClick={() => removeTag(tag)}
                                    className="text-red-500 hover:text-red-700 text-xs"
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </div>
                </div>
            </div>

            {/* Sources */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Connected Sources
                </label>
                <div className="space-y-3">
                    <div className="flex gap-2">
                        <input
                            type="text"
                            value={newSource}
                            onChange={(e) => setNewSource(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSource())}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
                            placeholder="Add a source"
                        />
                        <button
                            type="button"
                            onClick={addSource}
                            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                        >
                            Add
                        </button>
                    </div>
                    <div className="space-y-2">
                        {formData.sources.map((source, index) => (
                            <div
                                key={index}
                                className="bg-gray-50 border border-gray-200 rounded-lg p-3 flex items-center justify-between"
                            >
                                <div className="flex items-center space-x-3">
                                    <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-medium text-sm">
                                            {source[0]?.toUpperCase()}
                                        </span>
                                    </div>
                                    <span className="text-gray-800">{source}</span>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSource(source)}
                                    className="text-red-500 hover:text-red-700 text-sm"
                                >
                                    Remove
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-gray-100">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2 px-4 rounded-lg transition-colors duration-200"
                    disabled={loading}
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white font-medium py-2 px-4 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Updating...
                        </>
                    ) : (
                        'Update Profile'
                    )}
                </button>
            </div>
        </form>
    );
};

export default EditProfile;