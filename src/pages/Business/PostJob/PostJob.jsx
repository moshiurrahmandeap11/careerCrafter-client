import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, DollarSign, Briefcase, FileText, Image as ImageIcon, Building } from 'lucide-react';
import useAuth from '../../../hooks/UseAuth/useAuth';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';

const PostJob = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('post');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    
    // Form state
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        salaryMin: '',
        salaryMax: '',
        image: ''
    });

    const [editingJob, setEditingJob] = useState(null);

    useEffect(() => {
        if (user) {
            fetchJobs();
        }
    }, [user]);

    const fetchJobs = async () => {
        try {
            const response = await axiosIntense.get(`/jobs/user/${user.uid}`);
            if (response.data.success) {
                setJobs(response.data.data);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
        }
    };

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        setImageUploading(true);
        const formData = new FormData();
        formData.append('image', file);

        try {
            const response = await fetch('https://api.imgbb.com/1/upload?key=af5080f6264ea38c18a1cf186815b22f', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();
            if (data.success) {
                setFormData(prev => ({ ...prev, image: data.data.url }));
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        } finally {
            setImageUploading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) {
            alert('Please login to post a job');
            return;
        }

        // Validation
        if (!formData.company.trim()) {
            alert('Company name is required');
            return;
        }

        if (parseInt(formData.salaryMin) > parseInt(formData.salaryMax)) {
            alert('Minimum salary cannot be greater than maximum salary');
            return;
        }

        setLoading(true);
        try {
            const jobData = {
                ...formData,
                userId: user.uid,
                userName: user.displayName || user.email,
                salaryMin: parseInt(formData.salaryMin),
                salaryMax: parseInt(formData.salaryMax),
                company: formData.company.trim()
            };

            if (editingJob) {
                // Update job
                const response = await axiosIntense.put(`/jobs/${editingJob._id}`, jobData);
                if (response.data.success) {
                    setJobs(jobs.map(job => job._id === editingJob._id ? response.data.data : job));
                    resetForm();
                }
            } else {
                // Create new job
                const response = await axiosIntense.post('/jobs', jobData);
                if (response.data.success) {
                    setJobs([...jobs, response.data.data]);
                    resetForm();
                }
            }
        } catch (error) {
            console.error('Error posting job:', error);
            alert(error.response?.data?.message || 'Error posting job');
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (job) => {
        setEditingJob(job);
        setFormData({
            title: job.title,
            description: job.description,
            company: job.company || '',
            salaryMin: job.salaryMin.toString(),
            salaryMax: job.salaryMax.toString(),
            image: job.image
        });
        setActiveTab('post');
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            const response = await axiosIntense.delete(`/jobs/${jobId}`);
            if (response.data.success) {
                setJobs(jobs.filter(job => job._id !== jobId));
            }
        } catch (error) {
            console.error('Error deleting job:', error);
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            company: '',
            salaryMin: '',
            salaryMax: '',
            image: ''
        });
        setEditingJob(null);
    };

    const formatSalary = (min, max) => {
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">Authentication Required</h2>
                    <p className="text-gray-600">Please login to post and manage jobs</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                        Job Management
                    </h1>
                    <p className="text-lg text-gray-600 max-w-2xl mx-auto">
                        Post new job opportunities and manage your existing listings
                    </p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                                <Briefcase className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{jobs.length}</div>
                                <div className="text-sm text-gray-600">Total Jobs</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                                <Eye className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {jobs.filter(job => job.status === 'active').length}
                                </div>
                                <div className="text-sm text-gray-600">Active</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                                <Edit className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {jobs.filter(job => job.status === 'draft').length}
                                </div>
                                <div className="text-sm text-gray-600">Drafts</div>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-200">
                        <div className="flex items-center">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                                <Building className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">
                                    {[...new Set(jobs.map(job => job.company))].length}
                                </div>
                                <div className="text-sm text-gray-600">Companies</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
                    <div className="border-b border-gray-200">
                        <nav className="flex -mb-px">
                            <button
                                onClick={() => setActiveTab('post')}
                                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                                    activeTab === 'post'
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Plus className="w-4 h-4 inline mr-2" />
                                {editingJob ? 'Edit Job' : 'Post New Job'}
                            </button>
                            <button
                                onClick={() => setActiveTab('manage')}
                                className={`flex-1 py-4 px-6 text-center font-medium text-sm ${
                                    activeTab === 'manage'
                                        ? 'border-b-2 border-blue-500 text-blue-600'
                                        : 'text-gray-500 hover:text-gray-700'
                                }`}
                            >
                                <Briefcase className="w-4 h-4 inline mr-2" />
                                Manage Jobs ({jobs.length})
                            </button>
                        </nav>
                    </div>

                    <div className="p-6">
                        {activeTab === 'post' ? (
                            <div className="max-w-2xl mx-auto">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Company Name */}
                                    <div>
                                        <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-2">
                                            Company Name *
                                        </label>
                                        <input
                                            type="text"
                                            id="company"
                                            required
                                            value={formData.company}
                                            onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Google, Microsoft, Apple"
                                        />
                                    </div>

                                    {/* Title */}
                                    <div>
                                        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Title *
                                        </label>
                                        <input
                                            type="text"
                                            id="title"
                                            required
                                            value={formData.title}
                                            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="e.g., Senior Frontend Developer"
                                        />
                                    </div>

                                    {/* Description */}
                                    <div>
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Description *
                                        </label>
                                        <textarea
                                            id="description"
                                            required
                                            rows={6}
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe the job responsibilities, requirements, and benefits..."
                                        />
                                    </div>

                                    {/* Salary Range */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <label htmlFor="salaryMin" className="block text-sm font-medium text-gray-700 mb-2">
                                                Minimum Salary ($) *
                                            </label>
                                            <input
                                                type="number"
                                                id="salaryMin"
                                                required
                                                min="0"
                                                value={formData.salaryMin}
                                                onChange={(e) => setFormData(prev => ({ ...prev, salaryMin: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="50000"
                                            />
                                        </div>
                                        <div>
                                            <label htmlFor="salaryMax" className="block text-sm font-medium text-gray-700 mb-2">
                                                Maximum Salary ($) *
                                            </label>
                                            <input
                                                type="number"
                                                id="salaryMax"
                                                required
                                                min="0"
                                                value={formData.salaryMax}
                                                onChange={(e) => setFormData(prev => ({ ...prev, salaryMax: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="80000"
                                            />
                                        </div>
                                    </div>

                                    {/* Image Upload */}
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Image
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {imageUploading ? (
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    ) : formData.image ? (
                                                        <img src={formData.image} alt="Preview" className="h-16 w-16 object-cover rounded" />
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                                                            <p className="text-sm text-gray-500">Click to upload image</p>
                                                        </>
                                                    )}
                                                </div>
                                                <input
                                                    type="file"
                                                    className="hidden"
                                                    accept="image/*"
                                                    onChange={handleImageUpload}
                                                />
                                            </label>
                                        </div>
                                    </div>

                                    {/* Submit Buttons */}
                                    <div className="flex gap-4 pt-4">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {loading ? 'Posting...' : editingJob ? 'Update Job' : 'Post Job'}
                                        </button>
                                        {editingJob && (
                                            <button
                                                type="button"
                                                onClick={resetForm}
                                                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                                            >
                                                Cancel
                                            </button>
                                        )}
                                    </div>
                                </form>
                            </div>
                        ) : (
                            <div>
                                {jobs.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs posted yet</h3>
                                        <p className="text-gray-600 mb-6">Start by posting your first job opportunity</p>
                                        <button
                                            onClick={() => setActiveTab('post')}
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                                        >
                                            <Plus className="w-4 h-4 inline mr-2" />
                                            Post First Job
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {jobs.map((job) => (
                                            <div key={job._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                                {job.image && (
                                                    <img 
                                                        src={job.image} 
                                                        alt={job.title}
                                                        className="w-full h-48 object-cover rounded-t-lg"
                                                    />
                                                )}
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-2">
                                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1">
                                                            {job.title}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ml-2 ${
                                                            job.status === 'active' 
                                                                ? 'bg-green-100 text-green-800'
                                                                : 'bg-gray-100 text-gray-800'
                                                        }`}>
                                                            {job.status}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                                        <Building className="w-4 h-4 mr-1" />
                                                        <span className="font-medium">{job.company}</span>
                                                    </div>
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                        {job.description}
                                                    </p>
                                                    <div className="flex items-center justify-between mb-4">
                                                        <span className="text-lg font-bold text-green-600">
                                                            {formatSalary(job.salaryMin, job.salaryMax)}
                                                        </span>
                                                        <div className="text-xs text-gray-500">
                                                            {job.applications || 0} applications
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(job)}
                                                            className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center"
                                                        >
                                                            <Edit className="w-4 h-4 mr-1" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(job._id)}
                                                            className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-red-700 transition-colors flex items-center justify-center"
                                                        >
                                                            <Trash2 className="w-4 h-4 mr-1" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PostJob;