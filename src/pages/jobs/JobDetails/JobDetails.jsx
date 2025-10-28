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
    Heart,
    Share2,
    Bookmark,
    Users,
    Award,
    Star
} from 'lucide-react';
import Swal from 'sweetalert2';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';
import useAuth from '../../../hooks/UseAuth/useAuth';
import Loader from '../../../components/sharedItems/Loader/Loader';
import MainButton from '../../../components/sharedItems/MainButton/MainButton';

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
    }, [id]);

    useEffect(() => {
        if (job) {
            fetchSimilarJobs();
        }
    }, [job]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosIntense.get(`/jobs/${id}`);
            if (response.data.success) {
                setJob(response.data.data);
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
                        confirmButtonText: 'Browse Jobs'
                    });
                    navigate('/jobs');
                }
            } catch {
                Swal.fire({
                    title: 'Connection Error!',
                    text: 'Failed to load job details. Please check your connection.',
                    icon: 'error',
                    confirmButtonText: 'OK'
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
                showConfirmButton: false
            });
        } else {
            newSavedJobs = [...savedJobs, id];
            setSaved(true);
            Swal.fire({
                title: 'Saved!',
                text: 'Job added to saved items',
                icon: 'success',
                timer: 1500,
                showConfirmButton: false
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
                    cancelButtonText: 'Later'
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
                userName: user.displayName,
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
                    confirmButtonText: 'OK'
                });
                setJob(prevJob => ({
                    ...prevJob,
                    applications: (prevJob.applications || 0) + 1
                }))
                navigate('/profile')
            }
        } catch (error) {
            console.error('Error applying for job:', error);
            Swal.fire({
                title: 'Application Failed!',
                text: error.response?.data?.message || 'Failed to submit application. Please try again.',
                icon: 'error',
                confirmButtonText: 'OK'
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
                showConfirmButton: false
            });
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
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

    if (loading) {
        return <Loader />;
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-white flex items-center justify-center p-4">
                <div className="text-center bg-white p-6 rounded-lg border border-gray-300 max-w-md w-full">
                    <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Briefcase className="w-6 h-6 text-red-600" />
                    </div>
                    <h2 className="text-xl font-bold text-gray-900 mb-2">Job Not Found</h2>
                    <p className="text-gray-600 mb-4">The job you're looking for doesn't exist.</p>
                    <button
                        onClick={() => navigate('/jobs')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                    >
                        Browse Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                {/* Back Button */}
                <button
                    onClick={() => navigate('/jobs')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Jobs
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Job Header Card */}
                        <div className="bg-white rounded-lg border border-gray-300 p-6">
                            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                                <div className="flex-1">
                                    <div className="flex items-start gap-4 mb-4">
                                        {job.image && (
                                            <img
                                                src={job.image}
                                                alt={job.company}
                                                className="w-12 h-12 rounded-lg object-cover border border-gray-300"
                                            />
                                        )}
                                        <div className="flex-1">
                                            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                                                {job.title}
                                            </h1>
                                            <div className="flex items-center gap-2 text-gray-700 mb-3">
                                                <Building className="w-4 h-4" />
                                                <span className="font-medium">{job.company || 'Unknown Company'}</span>
                                                {job.featured && (
                                                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                                                        <Star className="w-3 h-3" />
                                                        Featured
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Job Meta Information */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                                        {job.location && (
                                            <div className="flex items-center text-gray-600">
                                                <MapPin className="w-4 h-4 mr-2 text-green-600" />
                                                <span>{job.location}</span>
                                            </div>
                                        )}
                                        {(job.salaryMin || job.salaryMax) && (
                                            <div className="flex items-center text-gray-600">
                                                <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                                                <span className="font-semibold">
                                                    ${job.salaryMin?.toLocaleString() || 'N/A'} - ${job.salaryMax?.toLocaleString() || 'N/A'}
                                                </span>
                                            </div>
                                        )}
                                        {job.jobType && (
                                            <div className="flex items-center text-gray-600">
                                                <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                                                <span className="capitalize">{job.jobType.replace('-', ' ')}</span>
                                            </div>
                                        )}
                                        {job.experienceLevel && (
                                            <div className="flex items-center text-gray-600">
                                                <Award className="w-4 h-4 mr-2 text-purple-600" />
                                                <span className="capitalize">{job.experienceLevel} Level</span>
                                            </div>
                                        )}
                                    </div>

                                    {/* Stats */}
                                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
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
                                <div className="mt-6 lg:mt-0 lg:ml-6 flex flex-col gap-3 w-full lg:w-48">
                                    <MainButton
                                        onClick={handleApply}
                                        disabled={applying || !user}
                                        className="flex items-center justify-center gap-2"
                                    >
                                        {applying ? (
                                            <>
                                                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                                Applying...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4" />
                                                Apply Now
                                            </>
                                        )}
                                    </MainButton>

                                    <div className="flex gap-2">
                                        <button
                                            onClick={toggleSaveJob}
                                            className={`flex-1 py-2 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 text-sm ${saved
                                                    ? 'bg-red-100 text-red-700 border border-red-300'
                                                    : 'bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200'
                                                }`}
                                        >
                                            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
                                            {saved ? 'Saved' : 'Save'}
                                        </button>

                                        <button
                                            onClick={shareJob}
                                            className="flex-1 py-2 rounded-lg font-medium transition-colors bg-gray-100 text-gray-700 border border-gray-300 hover:bg-gray-200 flex items-center justify-center gap-2 text-sm"
                                        >
                                            <Share2 className="w-4 h-4" />
                                            Share
                                        </button>
                                    </div>

                                    {!user && (
                                        <p className="text-xs text-gray-500 text-center">
                                            Please login to apply for this position
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Tabs Content */}
                        <div className="bg-white rounded-lg border border-gray-300">
                            {/* Tabs Navigation */}
                            <div className="border-b border-gray-300">
                                <nav className="flex overflow-x-auto">
                                    {['description', 'requirements', 'skills', 'benefits'].map((tab) => (
                                        <button
                                            key={tab}
                                            onClick={() => setActiveTab(tab)}
                                            className={`flex items-center gap-2 px-4 py-3 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${activeTab === tab
                                                    ? 'border-blue-600 text-blue-600'
                                                    : 'border-transparent text-gray-600 hover:text-gray-900'
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
                            <div className="p-6">
                                {activeTab === 'description' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Job Description</h3>
                                        <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                            {job.description || 'No description provided.'}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'requirements' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Requirements & Qualifications</h3>
                                        <ul className="text-gray-700 space-y-2">
                                            {job.requirements ? (
                                                job.requirements.split('\n').map((req, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 bg-blue-600 rounded-full mt-2 flex-shrink-0" />
                                                        <span>{req}</span>
                                                    </li>
                                                ))
                                            ) : job.educationLevel ? (
                                                <li className="flex items-center gap-3 text-gray-700">
                                                    <GraduationCap className="w-4 h-4 text-blue-600 flex-shrink-0" />
                                                    <span>Education: {job.educationLevel}</span>
                                                </li>
                                            ) : (
                                                <li className="text-gray-500">No specific requirements listed.</li>
                                            )}
                                        </ul>
                                    </div>
                                )}

                                {activeTab === 'skills' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Skills & Technologies</h3>
                                        <div className="flex flex-wrap gap-2">
                                            {job.requiredSkills && job.requiredSkills.length > 0 ? (
                                                job.requiredSkills.map((skill, index) => (
                                                    <span
                                                        key={index}
                                                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded text-sm font-medium border border-blue-200"
                                                    >
                                                        {skill}
                                                    </span>
                                                ))
                                            ) : (
                                                <p className="text-gray-500">No specific skills listed.</p>
                                            )}
                                        </div>
                                    </div>
                                )}

                                {activeTab === 'benefits' && (
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Benefits & Perks</h3>
                                        <ul className="text-gray-700 space-y-2">
                                            {job.benefits ? (
                                                job.benefits.split('\n').map((benefit, index) => (
                                                    <li key={index} className="flex items-start gap-3">
                                                        <div className="w-1.5 h-1.5 bg-green-600 rounded-full mt-2 flex-shrink-0" />
                                                        <span>{benefit}</span>
                                                    </li>
                                                ))
                                            ) : (
                                                <li className="text-gray-500">No benefits information provided.</li>
                                            )}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Job Information */}
                        <div className="bg-white rounded-lg border border-gray-300 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                <User className="w-5 h-5 text-blue-600" />
                                Job Information
                            </h3>

                            <div className="space-y-4">
                                <div>
                                    <p className="text-sm text-gray-600">Posted by</p>
                                    <p className="text-gray-900 font-medium">{job.userName}</p>
                                </div>

                                <div>
                                    <p className="text-sm text-gray-600">Posted on</p>
                                    <p className="text-gray-900">{formatDate(job.createdAt)}</p>
                                </div>

                                {job.updatedAt && (
                                    <div>
                                        <p className="text-sm text-gray-600">Last updated</p>
                                        <p className="text-gray-900">{formatDate(job.updatedAt)}</p>
                                    </div>
                                )}

                                <div>
                                    <p className="text-sm text-gray-600">Status</p>
                                    <span className={`inline-flex items-center px-2 py-1 rounded text-xs font-medium ${job.status === 'active'
                                            ? 'bg-green-100 text-green-800 border border-green-200'
                                            : 'bg-gray-100 text-gray-800 border border-gray-200'
                                        }`}>
                                        {job.status || 'active'}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Similar Jobs */}
                        {similarJobs.length > 0 && (
                            <div className="bg-white rounded-lg border border-gray-300 p-6">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                                    <Briefcase className="w-5 h-5 text-purple-600" />
                                    Similar Jobs
                                </h3>

                                <div className="space-y-4">
                                    {similarJobs.map((similarJob) => (
                                        <div
                                            key={similarJob._id}
                                            className="p-4 rounded-lg bg-gray-50 border border-gray-200 hover:border-gray-300 transition-colors cursor-pointer"
                                            onClick={() => navigate(`/job/${similarJob._id}`)}
                                        >
                                            <h4 className="text-gray-900 font-medium mb-1 line-clamp-2">
                                                {similarJob.title}
                                            </h4>
                                            <p className="text-blue-600 text-sm mb-2">{similarJob.company}</p>
                                            <div className="flex items-center justify-between text-xs text-gray-500">
                                                <span>{similarJob.location}</span>
                                                <span>${similarJob.salaryMin?.toLocaleString()}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Apply */}
                        <div className="bg-blue-50 rounded-lg border border-blue-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">Ready to Apply?</h3>
                            <p className="text-blue-700 text-sm mb-4">
                                Don't miss this opportunity! Submit your application now.
                            </p>
                            <MainButton
                                onClick={handleApply}
                                disabled={applying || !user}
                                className="w-full flex items-center justify-center gap-2"
                            >
                                <CheckCircle className="w-4 h-4" />
                                {applying ? 'Applying...' : 'Quick Apply'}
                            </MainButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;