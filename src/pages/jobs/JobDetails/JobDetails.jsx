import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { 
  ArrowLeft, 
  MapPin, 
  DollarSign, 
  Clock, 
  User, 
  Building, 
  Eye, 
  FileText, 
  CheckCircle,
  Briefcase,
  GraduationCap,
  Code,
  Tag,
  Heart,
  Share2,
  Bookmark,
  Zap,
  Users,
  Calendar,
  Award,
  Star,
  ExternalLink
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Swal from 'sweetalert2';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';
import useAuth from '../../../hooks/UseAuth/useAuth';

const JobDetails = () => {
    const { id } = useParams();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [job, setJob] = useState(null);
    const [loading, setLoading] = useState(true);
    const [applying, setApplying] = useState(false);
    const [saved, setSaved] = useState(false);
    const [activeTab, setActiveTab] = useState('description');
    const [similarJobs, setSimilarJobs] = useState([]);

    useEffect(() => {
        fetchJobDetails();
        checkIfSaved();
        fetchSimilarJobs();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosIntense.get(`/jobs/${id}`);
            if (response.data.success) {
                setJob(response.data.data);
                // Increment view count
                await axiosIntense.patch(`/jobs/${id}/views`);
            }
        } catch (error) {
            console.error('Error fetching job details:', error);
            try {
                const jobsResponse = await axiosIntense.get('/jobs');
                const foundJob = jobsResponse.data.data.find(j => j._id === id);
                if (foundJob) {
                    setJob(foundJob);
                } else {
                    Swal.fire({
                        title: 'Job Not Found!',
                        text: 'The job you are looking for does not exist or has been removed.',
                        icon: 'error',
                        confirmButtonText: 'Browse Jobs',
                        background: '#1f2937',
                        color: 'white',
                        confirmButtonColor: '#3b82f6'
                    });
                    navigate('/jobs');
                }
            } catch {
                Swal.fire({
                    title: 'Connection Error!',
                    text: 'Failed to load job details. Please check your connection.',
                    icon: 'error',
                    confirmButtonText: 'OK',
                    background: '#1f2937',
                    color: 'white',
                    confirmButtonColor: '#3b82f6'
                });
                navigate('/jobs');
            }
        } finally {
            setLoading(false);
        }
    };

    const fetchSimilarJobs = async () => {
        try {
            const response = await axiosIntense.get('/jobs');
            if (response.data.success) {
                const similar = response.data.data
                    .filter(j => j._id !== id && j.industry === job?.industry)
                    .slice(0, 3);
                setSimilarJobs(similar);
            }
        } catch (error) {
            console.error('Error fetching similar jobs:', error);
        }
    };

    const checkIfSaved = () => {
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        setSaved(savedJobs.includes(id));
    };

    const toggleSaveJob = () => {
        const savedJobs = JSON.parse(localStorage.getItem('savedJobs') || '[]');
        let newSavedJobs;
        
        if (saved) {
            newSavedJobs = savedJobs.filter(jobId => jobId !== id);
            setSaved(false);
            Swal.fire({
                title: 'Removed!',
                text: 'Job removed from saved items',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1f2937',
                color: 'white'
            });
        } else {
            newSavedJobs = [...savedJobs, id];
            setSaved(true);
            Swal.fire({
                title: 'Saved!',
                text: 'Job added to saved items',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1f2937',
                color: 'white'
            });
        }
        
        localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
    };

    const handleApply = async () => {
        try {
            setApplying(true);
            
            if (!user) {
                Swal.fire({
                    title: 'Login Required',
                    text: 'Please login to apply for this job',
                    icon: 'warning',
                    showCancelButton: true,
                    confirmButtonText: 'Login Now',
                    cancelButtonText: 'Later',
                    background: '#1f2937',
                    color: 'white',
                    confirmButtonColor: '#3b82f6',
                    cancelButtonColor: '#6b7280'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/auth/signin');
                    }
                });
                return;
            }

            const applicationData = {
                jobId: id,
                userId: user.uid,
                userEmail: user.email,
                userName: user.displayName || user.email,
                jobTitle: job.title,
                company: job.company || 'Unknown Company',
                status: 'pending',
                appliedAt: new Date().toISOString()
            };

            const response = await axiosIntense.post('/applications', applicationData);
            
            if (response.data.success) {
                Swal.fire({
                    title: 'Application Submitted!',
                    text: 'Your application has been sent successfully. Good luck!',
                    icon: 'success',
                    confirmButtonText: 'View Applications',
                    showCancelButton: true,
                    cancelButtonText: 'Continue Browsing',
                    background: '#1f2937',
                    color: 'white',
                    confirmButtonColor: '#10b981',
                    cancelButtonColor: '#6b7280'
                }).then((result) => {
                    if (result.isConfirmed) {
                        navigate('/applications');
                    }
                });
                
                setJob(prevJob => ({
                    ...prevJob,
                    applications: (prevJob.applications || 0) + 1
                }));
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            Swal.fire({
                title: 'Application Failed!',
                text: error.response?.data?.message || 'Failed to submit application. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK',
                background: '#1f2937',
                color: 'white',
                confirmButtonColor: '#ef4444'
            });
        } finally {
            setApplying(false);
        }
    };

    const shareJob = () => {
        if (navigator.share) {
            navigator.share({
                title: job.title,
                text: `Check out this job opportunity: ${job.title} at ${job.company}`,
                url: window.location.href,
            });
        } else {
            navigator.clipboard.writeText(window.location.href);
            Swal.fire({
                title: 'Link Copied!',
                text: 'Job link copied to clipboard',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false,
                background: '#1f2937',
                color: 'white'
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const getTimeAgo = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 0) return 'Today';
        if (diffDays === 1) return '1 day ago';
        if (diffDays < 7) return `${diffDays} days ago`;
        if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
        return `${Math.ceil(diffDays / 30)} months ago`;
    };

    const getJobTypeColor = (type) => {
        const colors = {
            'full-time': 'bg-green-500',
            'part-time': 'bg-blue-500',
            'contract': 'bg-orange-500',
            'freelance': 'bg-purple-500',
            'internship': 'bg-pink-500'
        };
        return colors[type] || 'bg-gray-500';
    };

    const getExperienceColor = (level) => {
        const colors = {
            'entry': 'bg-green-500',
            'mid': 'bg-blue-500',
            'senior': 'bg-purple-500',
            'executive': 'bg-red-500'
        };
        return colors[level] || 'bg-gray-500';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
                <motion.div 
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        animate={{ 
                            rotate: 360,
                            scale: [1, 1.2, 1]
                        }}
                        transition={{ 
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1.5, repeat: Infinity }
                        }}
                        className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center shadow-lg"
                    >
                        <Briefcase className="w-8 h-8 text-white" />
                    </motion.div>
                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="text-gray-300 text-lg font-medium"
                    >
                        Loading job details...
                    </motion.p>
                </motion.div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex items-center justify-center">
                <motion.div 
                    className="text-center bg-gray-800/50 backdrop-blur-sm p-8 rounded-2xl border border-gray-700 max-w-md"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <div className="w-16 h-16 bg-red-500/20 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Briefcase className="w-8 h-8 text-red-400" />
                    </div>
                    <h2 className="text-2xl font-bold text-white mb-4">Job Not Found</h2>
                    <p className="text-gray-400 mb-6">The job you're looking for doesn't exist or has been removed.</p>
                    <motion.button 
                        onClick={() => navigate('/jobs')}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Browse Available Jobs
                    </motion.button>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Back Button */}
                <motion.button 
                    onClick={() => navigate('/jobs')}
                    className="flex items-center text-blue-400 hover:text-blue-300 mb-6 transition-colors group"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                >
                    <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to Jobs
                </motion.button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Job Header Card */}
                        <motion.div 
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <div className="p-6 lg:p-8">
                                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 mb-4">
                                            {job.image && (
                                                <img 
                                                    src={job.image} 
                                                    alt={job.company}
                                                    className="w-16 h-16 rounded-xl object-cover border-2 border-gray-600"
                                                />
                                            )}
                                            <div>
                                                <h1 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                                    {job.title}
                                                </h1>
                                                <div className="flex items-center gap-2 text-lg text-blue-300">
                                                    <Building className="w-5 h-5" />
                                                    <span className="font-semibold">{job.company || 'Unknown Company'}</span>
                                                    {job.featured && (
                                                        <span className="bg-yellow-500 text-yellow-900 px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1">
                                                            <Star className="w-3 h-3" />
                                                            Featured
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Job Meta Information */}
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
                                            {job.location && (
                                                <div className="flex items-center text-gray-300">
                                                    <MapPin className="w-4 h-4 mr-2 text-green-400" />
                                                    <span>{job.location}</span>
                                                </div>
                                            )}
                                            {(job.salaryMin || job.salaryMax) && (
                                                <div className="flex items-center text-gray-300">
                                                    <DollarSign className="w-4 h-4 mr-2 text-yellow-400" />
                                                    <span className="font-semibold text-white">
                                                        ${job.salaryMin?.toLocaleString() || 'N/A'} - ${job.salaryMax?.toLocaleString() || 'N/A'}
                                                    </span>
                                                </div>
                                            )}
                                            {job.jobType && (
                                                <div className="flex items-center text-gray-300">
                                                    <Briefcase className="w-4 h-4 mr-2 text-blue-400" />
                                                    <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                                                </div>
                                            )}
                                            {job.experienceLevel && (
                                                <div className="flex items-center text-gray-300">
                                                    <Award className="w-4 h-4 mr-2 text-purple-400" />
                                                    <span className="capitalize">{job.experienceLevel} Level</span>
                                                </div>
                                            )}
                                            {job.workMode && (
                                                <div className="flex items-center text-gray-300">
                                                    <Zap className="w-4 h-4 mr-2 text-orange-400" />
                                                    <span className="capitalize">{job.workMode}</span>
                                                </div>
                                            )}
                                            {job.industry && (
                                                <div className="flex items-center text-gray-300">
                                                    <Tag className="w-4 h-4 mr-2 text-indigo-400" />
                                                    <span className="capitalize">{job.industry}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Stats */}
                                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                                            <div className="flex items-center">
                                                <Clock className="w-4 h-4 mr-2" />
                                                <span>Posted {getTimeAgo(job.createdAt)}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Eye className="w-4 h-4 mr-2" />
                                                <span>{job.views || 0} views</span>
                                            </div>
                                            <div className="flex items-center">
                                                <Users className="w-4 h-4 mr-2" />
                                                <span>{job.applications || 0} applicants</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col gap-3">
                                        <motion.button
                                            onClick={handleApply}
                                            disabled={applying || !user}
                                            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-green-700 hover:to-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg flex items-center justify-center gap-2"
                                            whileHover={{ scale: applying ? 1 : 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                        >
                                            {applying ? (
                                                <>
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                                                    />
                                                    Applying...
                                                </>
                                            ) : (
                                                <>
                                                    <CheckCircle className="w-5 h-5" />
                                                    Apply Now
                                                </>
                                            )}
                                        </motion.button>

                                        <div className="flex gap-2">
                                            <motion.button
                                                onClick={toggleSaveJob}
                                                className={`flex-1 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center justify-center gap-2 ${
                                                    saved 
                                                        ? 'bg-red-500/20 text-red-400 border border-red-500/30' 
                                                        : 'bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-600/50'
                                                }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                                                {saved ? 'Saved' : 'Save'}
                                            </motion.button>

                                            <motion.button
                                                onClick={shareJob}
                                                className="flex-1 py-3 rounded-xl font-semibold transition-all duration-200 bg-gray-700/50 text-gray-300 border border-gray-600 hover:bg-gray-600/50 flex items-center justify-center gap-2"
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                <Share2 className="w-4 h-4" />
                                                Share
                                            </motion.button>
                                        </div>

                                        {!user && (
                                            <p className="text-xs text-gray-400 text-center">
                                                Please login to apply for this position
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Tabs Content */}
                        <motion.div 
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 overflow-hidden shadow-2xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            {/* Tabs Navigation */}
                            <div className="border-b border-gray-700">
                                <nav className="flex overflow-x-auto">
                                    {['description', 'requirements', 'skills', 'benefits'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap ${
                                                activeTab === tab
                                                    ? 'border-blue-500 text-blue-400'
                                                    : 'border-transparent text-gray-400 hover:text-gray-300'
                                            }`}
                                        >
                                            {tab === 'description' && <FileText className="w-4 h-4" />}
                                            {tab === 'requirements' && <GraduationCap className="w-4 h-4" />}
                                            {tab === 'skills' && <Code className="w-4 h-4" />}
                                            {tab === 'benefits' && <Heart className="w-4 h-4" />}
                                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                                        </button>
                                    ))}
                                </nav>
                            </div>

                            {/* Tab Content */}
                            <div className="p-6 lg:p-8">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={activeTab}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        {activeTab === 'description' && (
                                            <div className="prose prose-invert max-w-none">
                                                <h3 className="text-xl font-semibold text-white mb-4">Job Description</h3>
                                                <div className="text-gray-300 leading-relaxed whitespace-pre-line">
                                                    {job.description || 'No description provided.'}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'requirements' && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-4">Requirements & Qualifications</h3>
                                                <ul className="text-gray-300 space-y-3">
                                                    {job.requirements ? (
                                                        job.requirements.split('\n').map((req, index) => (
                                                            <li key={index} className="flex items-start gap-3">
                                                                <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                                                                <span>{req}</span>
                                                            </li>
                                                        ))
                                                    ) : job.educationLevel ? (
                                                        <li className="flex items-center gap-3 text-gray-300">
                                                            <GraduationCap className="w-5 h-5 text-blue-400 flex-shrink-0" />
                                                            <span>Education: {job.educationLevel}</span>
                                                        </li>
                                                    ) : (
                                                        <li className="text-gray-400">No specific requirements listed.</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}

                                        {activeTab === 'skills' && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-4">Skills & Technologies</h3>
                                                <div className="flex flex-wrap gap-3">
                                                    {job.requiredSkills && job.requiredSkills.length > 0 ? (
                                                        job.requiredSkills.map((skill, index) => (
                                                            <span 
                                                                key={index}
                                                                className="bg-blue-500/20 text-blue-300 px-4 py-2 rounded-xl text-sm font-medium border border-blue-500/30"
                                                            >
                                                                {skill}
                                                            </span>
                                                        ))
                                                    ) : (
                                                        <p className="text-gray-400">No specific skills listed.</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {activeTab === 'benefits' && (
                                            <div>
                                                <h3 className="text-xl font-semibold text-white mb-4">Benefits & Perks</h3>
                                                <ul className="text-gray-300 space-y-3">
                                                    {job.benefits ? (
                                                        job.benefits.split('\n').map((benefit, index) => (
                                                            <li key={index} className="flex items-start gap-3">
                                                                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 flex-shrink-0" />
                                                                <span>{benefit}</span>
                                                            </li>
                                                        ))
                                                    ) : (
                                                        <li className="text-gray-400">No benefits information provided.</li>
                                                    )}
                                                </ul>
                                            </div>
                                        )}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                        </motion.div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Company & Poster Info */}
                        <motion.div 
                            className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-2xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-400" />
                                Job Information
                            </h3>
                            
                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-400">Posted by</p>
                                    <p className="text-white font-medium">{job.userName}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-400">Posted on</p>
                                    <p className="text-white">{formatDate(job.createdAt)}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-400">Last updated</p>
                                    <p className="text-white">{formatDate(job.updatedAt)}</p>
                                </div>
                                
                                <div>
                                    <p className="text-sm text-gray-400">Status</p>
                                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                                        job.status === 'active' 
                                            ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                                            : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                                    }`}>
                                        {job.status || 'active'}
                                    </span>
                                </div>
                            </div>
                        </motion.div>

                        {/* Similar Jobs */}
                        {similarJobs.length > 0 && (
                            <motion.div 
                                className="bg-gray-800/50 backdrop-blur-sm rounded-2xl border border-gray-700 p-6 shadow-2xl"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.4 }}
                            >
                                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-purple-400" />
                                    Similar Jobs
                                </h3>
                                
                                <div className="space-y-4">
                                    {similarJobs.map((similarJob) => (
                                        <motion.div
                                            key={similarJob._id}
                                            className="p-4 rounded-xl bg-gray-700/30 border border-gray-600 hover:border-gray-500 transition-all duration-200 cursor-pointer"
                                            whileHover={{ scale: 1.02 }}
                                            onClick={() => navigate(`/job/${similarJob._id}`)}
                                        >
                                            <h4 className="text-white font-semibold mb-2 line-clamp-2">
                                                {similarJob.title}
                                            </h4>
                                            <p className="text-blue-300 text-sm mb-2">{similarJob.company}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-400">
                                                <span>{similarJob.location}</span>
                                                <span>${similarJob.salaryMin?.toLocaleString()}</span>
                                            </div>
                                        </motion.div>
                                    ))}
                                </div>
                            </motion.div>
                        )}

                        {/* Quick Actions */}
                        <motion.div 
                            className="bg-gradient-to-br from-blue-600/20 to-purple-600/20 backdrop-blur-sm rounded-2xl border border-blue-500/30 p-6 shadow-2xl"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.5 }}
                        >
                            <h3 className="text-lg font-semibold text-white mb-4">Ready to Apply?</h3>
                            <p className="text-blue-200 text-sm mb-4">
                                Don't miss this opportunity! Submit your application now.
                            </p>
                            <motion.button
                                onClick={handleApply}
                                disabled={applying || !user}
                                className="w-full bg-white text-blue-600 px-6 py-3 rounded-xl font-semibold hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
                                whileHover={{ scale: applying ? 1 : 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                <ExternalLink className="w-4 h-4" />
                                {applying ? 'Applying...' : 'Quick Apply'}
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;