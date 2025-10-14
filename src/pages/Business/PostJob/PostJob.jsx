import React, { useState, useEffect } from 'react';
import { Plus, Eye, Edit, Trash2, DollarSign, Briefcase, FileText, Image as ImageIcon, Building, MapPin, Clock, Users, GraduationCap, Code, Tag } from 'lucide-react';
import useAuth from '../../../hooks/UseAuth/useAuth';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';

const PostJob = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState('post');
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(false);
    const [imageUploading, setImageUploading] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    
    // Form state with AI-friendly fields
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        company: '',
        salaryMin: '',
        salaryMax: '',
        image: '',
        jobType: 'full-time',
        location: '',
        workMode: 'remote',
        experienceLevel: 'mid',
        educationLevel: 'bachelor',
        requiredSkills: [],
        preferredSkills: [],
        responsibilities: '',
        benefits: '',
        industry: 'technology',
        tags: []
    });

    const [skillInput, setSkillInput] = useState('');
    const [tagInput, setTagInput] = useState('');

    // Industry options for AI matching
    const industryOptions = [
        'technology', 'healthcare', 'finance', 'education', 'manufacturing',
        'retail', 'hospitality', 'construction', 'transportation', 'energy',
        'entertainment', 'marketing', 'sales', 'design', 'human-resources'
    ];

    const experienceLevels = [
        { value: 'entry', label: 'Entry Level (0-2 years)' },
        { value: 'mid', label: 'Mid Level (2-5 years)' },
        { value: 'senior', label: 'Senior Level (5-8 years)' },
        { value: 'executive', label: 'Executive (8+ years)' }
    ];

    const educationLevels = [
        { value: 'high-school', label: 'High School' },
        { value: 'associate', label: 'Associate Degree' },
        { value: 'bachelor', label: "Bachelor's Degree" },
        { value: 'master', label: "Master's Degree" },
        { value: 'doctorate', label: 'Doctorate' }
    ];

    const jobTypes = [
        { value: 'full-time', label: 'Full Time' },
        { value: 'part-time', label: 'Part Time' },
        { value: 'contract', label: 'Contract' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'internship', label: 'Internship' }
    ];

    const workModes = [
        { value: 'remote', label: 'Remote' },
        { value: 'hybrid', label: 'Hybrid' },
        { value: 'on-site', label: 'On-Site' }
    ];

    useEffect(() => {
        if (user) {
            fetchJobs();
        }
    }, [user]);

    const fetchJobs = async () => {
        try {
            console.log('Fetching jobs for user:', user.uid);
            const response = await axiosIntense.get(`/jobs/user/${user.uid}`);
            console.log('Jobs response:', response.data);
            
            if (response.data.success) {
                setJobs(response.data.data);
            } else {
                console.error('Failed to fetch jobs:', response.data.message);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            console.error('Error details:', error.response?.data);
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

    const addSkill = () => {
        if (skillInput.trim() && !formData.requiredSkills.includes(skillInput.trim())) {
            setFormData(prev => ({
                ...prev,
                requiredSkills: [...prev.requiredSkills, skillInput.trim()]
            }));
            setSkillInput('');
        }
    };

    const removeSkill = (skillToRemove) => {
        setFormData(prev => ({
            ...prev,
            requiredSkills: prev.requiredSkills.filter(skill => skill !== skillToRemove)
        }));
    };

    const addTag = () => {
        if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
            setFormData(prev => ({
                ...prev,
                tags: [...prev.tags, tagInput.trim()]
            }));
            setTagInput('');
        }
    };

    const removeTag = (tagToRemove) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.filter(tag => tag !== tagToRemove)
        }));
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
                company: formData.company.trim(),
                requiredSkills: formData.requiredSkills,
                preferredSkills: formData.preferredSkills,
                tags: formData.tags,
                aiCompatible: true,
                lastMatched: null,
                matchScore: 0
            };

            console.log('Submitting job data:', jobData);

            let response;
            if (editingJob) {
                response = await axiosIntense.put(`/jobs/${editingJob._id}`, jobData);
            } else {
                response = await axiosIntense.post('/jobs', jobData);
            }

            console.log('API Response:', response.data);

            if (response.data.success) {
                if (editingJob) {
                    setJobs(jobs.map(job => job._id === editingJob._id ? response.data.data : job));
                } else {
                    setJobs([...jobs, response.data.data]);
                }
                resetForm();
                alert(editingJob ? 'Job updated successfully!' : 'Job posted successfully!');
            } else {
                alert(response.data.message || 'Failed to post job');
            }
        } catch (error) {
            console.error('Error posting job:', error);
            console.error('Error response:', error.response?.data);
            alert(error.response?.data?.message || 'Error posting job. Please try again.');
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
            image: job.image,
            jobType: job.jobType || 'full-time',
            location: job.location || '',
            workMode: job.workMode || 'remote',
            experienceLevel: job.experienceLevel || 'mid',
            educationLevel: job.educationLevel || 'bachelor',
            requiredSkills: job.requiredSkills || [],
            preferredSkills: job.preferredSkills || [],
            responsibilities: job.responsibilities || '',
            benefits: job.benefits || '',
            industry: job.industry || 'technology',
            tags: job.tags || []
        });
        setActiveTab('post');
    };

    const handleDelete = async (jobId) => {
        if (!window.confirm('Are you sure you want to delete this job?')) return;

        try {
            const response = await axiosIntense.delete(`/jobs/${jobId}`);
            if (response.data.success) {
                setJobs(jobs.filter(job => job._id !== jobId));
                alert('Job deleted successfully!');
            }
        } catch (error) {
            console.error('Error deleting job:', error);
            alert('Error deleting job. Please try again.');
        }
    };

    const resetForm = () => {
        setFormData({
            title: '',
            description: '',
            company: '',
            salaryMin: '',
            salaryMax: '',
            image: '',
            jobType: 'full-time',
            location: '',
            workMode: 'remote',
            experienceLevel: 'mid',
            educationLevel: 'bachelor',
            requiredSkills: [],
            preferredSkills: [],
            responsibilities: '',
            benefits: '',
            industry: 'technology',
            tags: []
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
                            <div className="max-w-4xl mx-auto">
                                <form onSubmit={handleSubmit} className="space-y-8">
                                    {/* Basic Information Section */}
                                    <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                                        <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center">
                                            <Building className="w-5 h-5 mr-2" />
                                            Basic Information
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

                                            {/* Job Title */}
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
                                        </div>

                                        {/* Industry */}
                                        <div className="mt-4">
                                            <label htmlFor="industry" className="block text-sm font-medium text-gray-700 mb-2">
                                                Industry *
                                            </label>
                                            <select
                                                id="industry"
                                                required
                                                value={formData.industry}
                                                onChange={(e) => setFormData(prev => ({ ...prev, industry: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            >
                                                {industryOptions.map(industry => (
                                                    <option key={industry} value={industry}>
                                                        {industry.charAt(0).toUpperCase() + industry.slice(1).replace('-', ' ')}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>

                                    {/* Job Details Section */}
                                    <div className="bg-green-50 p-6 rounded-lg border border-green-200">
                                        <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center">
                                            <Briefcase className="w-5 h-5 mr-2" />
                                            Job Details
                                        </h3>
                                        
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Job Type */}
                                            <div>
                                                <label htmlFor="jobType" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Job Type *
                                                </label>
                                                <select
                                                    id="jobType"
                                                    required
                                                    value={formData.jobType}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, jobType: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {jobTypes.map(type => (
                                                        <option key={type.value} value={type.value}>
                                                            {type.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Work Mode */}
                                            <div>
                                                <label htmlFor="workMode" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Work Mode *
                                                </label>
                                                <select
                                                    id="workMode"
                                                    required
                                                    value={formData.workMode}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, workMode: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {workModes.map(mode => (
                                                        <option key={mode.value} value={mode.value}>
                                                            {mode.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                                            {/* Experience Level */}
                                            <div>
                                                <label htmlFor="experienceLevel" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Experience Level *
                                                </label>
                                                <select
                                                    id="experienceLevel"
                                                    required
                                                    value={formData.experienceLevel}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, experienceLevel: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {experienceLevels.map(level => (
                                                        <option key={level.value} value={level.value}>
                                                            {level.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>

                                            {/* Education Level */}
                                            <div>
                                                <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-2">
                                                    Education Requirement *
                                                </label>
                                                <select
                                                    id="educationLevel"
                                                    required
                                                    value={formData.educationLevel}
                                                    onChange={(e) => setFormData(prev => ({ ...prev, educationLevel: e.target.value }))}
                                                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                >
                                                    {educationLevels.map(edu => (
                                                        <option key={edu.value} value={edu.value}>
                                                            {edu.label}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>

                                        {/* Location */}
                                        <div>
                                            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                <MapPin className="w-4 h-4 mr-1" />
                                                Location *
                                            </label>
                                            <input
                                                type="text"
                                                id="location"
                                                required
                                                value={formData.location}
                                                onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                placeholder="e.g., New York, NY or Remote"
                                            />
                                        </div>
                                    </div>

                                    {/* Skills & Requirements Section */}
                                    <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
                                        <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center">
                                            <Code className="w-5 h-5 mr-2" />
                                            Skills & Requirements
                                        </h3>

                                        {/* Required Skills */}
                                        <div className="mb-6">
                                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                                Required Skills *
                                            </label>
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={skillInput}
                                                    onChange={(e) => setSkillInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g., React, Node.js, MongoDB"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addSkill}
                                                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.requiredSkills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {skill}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeSkill(skill)}
                                                            className="ml-2 text-blue-600 hover:text-blue-800"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Tags for AI Matching */}
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center">
                                                <Tag className="w-4 h-4 mr-1" />
                                                Job Tags (for better AI matching)
                                            </label>
                                            <div className="flex gap-2 mb-3">
                                                <input
                                                    type="text"
                                                    value={tagInput}
                                                    onChange={(e) => setTagInput(e.target.value)}
                                                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                                    placeholder="e.g., startup, agile, fintech, saas"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={addTag}
                                                    className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                                                >
                                                    Add
                                                </button>
                                            </div>
                                            <div className="flex flex-wrap gap-2">
                                                {formData.tags.map((tag, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center"
                                                    >
                                                        {tag}
                                                        <button
                                                            type="button"
                                                            onClick={() => removeTag(tag)}
                                                            className="ml-2 text-purple-600 hover:text-purple-800"
                                                        >
                                                            ×
                                                        </button>
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Description & Responsibilities */}
                                    <div className="bg-white p-6 rounded-lg border border-gray-200">
                                        <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Description & Responsibilities *
                                        </label>
                                        <textarea
                                            id="description"
                                            required
                                            rows={8}
                                            value={formData.description}
                                            onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Describe the job responsibilities, requirements, daily tasks, and what you'll be working on..."
                                        />
                                    </div>

                                    {/* Benefits */}
                                    <div className="bg-yellow-50 p-6 rounded-lg border border-yellow-200">
                                        <label htmlFor="benefits" className="block text-sm font-medium text-gray-700 mb-2">
                                            Benefits & Perks
                                        </label>
                                        <textarea
                                            id="benefits"
                                            rows={4}
                                            value={formData.benefits}
                                            onChange={(e) => setFormData(prev => ({ ...prev, benefits: e.target.value }))}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            placeholder="Health insurance, flexible hours, remote work, stock options, professional development, etc."
                                        />
                                    </div>

                                    {/* Salary Range */}
                                    <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                                        <h3 className="text-lg font-semibold text-red-900 mb-4 flex items-center">
                                            <DollarSign className="w-5 h-5 mr-2" />
                                            Salary Information
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                                    </div>

                                    {/* Image Upload */}
                                    <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Job Image
                                        </label>
                                        <div className="flex items-center justify-center w-full">
                                            <label className="flex flex-col items-center justify-center w-full h-40 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-white hover:bg-gray-50 transition-colors">
                                                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                                    {imageUploading ? (
                                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                                    ) : formData.image ? (
                                                        <div className="text-center">
                                                            <img src={formData.image} alt="Preview" className="h-20 w-20 object-cover rounded mx-auto mb-2" />
                                                            <p className="text-sm text-green-600">Image uploaded successfully</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <ImageIcon className="w-8 h-8 mb-2 text-gray-500" />
                                                            <p className="text-sm text-gray-500">Click to upload image</p>
                                                            <p className="text-xs text-gray-400">PNG, JPG, GIF up to 10MB</p>
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
                                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                                        <button
                                            type="submit"
                                            disabled={loading}
                                            className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                                    {editingJob ? 'Updating...' : 'Posting...'}
                                                </>
                                            ) : editingJob ? (
                                                <>
                                                    <Edit className="w-4 h-4 mr-2" />
                                                    Update Job
                                                </>
                                            ) : (
                                                <>
                                                    <Plus className="w-4 h-4 mr-2" />
                                                    Post Job
                                                </>
                                            )}
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
                                            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors flex items-center mx-auto"
                                        >
                                            <Plus className="w-4 h-4 mr-2" />
                                            Post First Job
                                        </button>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {jobs.map((job) => (
                                            <div key={job._id} className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden">
                                                {job.image && (
                                                    <img 
                                                        src={job.image} 
                                                        alt={job.title}
                                                        className="w-full h-48 object-cover"
                                                    />
                                                )}
                                                <div className="p-6">
                                                    <div className="flex items-start justify-between mb-3">
                                                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2 flex-1 mr-2">
                                                            {job.title}
                                                        </h3>
                                                        <span className={`px-2 py-1 rounded-full text-xs font-medium shrink-0 ${
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
                                                    
                                                    <div className="flex items-center text-sm text-gray-600 mb-3">
                                                        <MapPin className="w-4 h-4 mr-1" />
                                                        <span>{job.location}</span>
                                                    </div>
                                                    
                                                    <div className="flex items-center text-sm text-gray-600 mb-4">
                                                        <Briefcase className="w-4 h-4 mr-1" />
                                                        <span className="capitalize">{job.jobType?.replace('-', ' ')} • {job.workMode}</span>
                                                    </div>
                                                    
                                                    <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                                                        {job.description}
                                                    </p>
                                                    
                                                    <div className="flex flex-wrap gap-1 mb-4">
                                                        {job.requiredSkills?.slice(0, 3).map((skill, index) => (
                                                            <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                                                                {skill}
                                                            </span>
                                                        ))}
                                                        {job.requiredSkills?.length > 3 && (
                                                            <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                                                +{job.requiredSkills.length - 3} more
                                                            </span>
                                                        )}
                                                    </div>
                                                    
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