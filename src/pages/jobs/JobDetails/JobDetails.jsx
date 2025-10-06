import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router';
import { ArrowLeft, MapPin, DollarSign, Clock, User, Building, Eye, FileText, CheckCircle } from 'lucide-react';
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

    useEffect(() => {
        fetchJobDetails();
    }, [id]);

    const fetchJobDetails = async () => {
        try {
            setLoading(true);
            const response = await axiosIntense.get(`/jobs/${id}`);
            setJob(response.data.data);
        } catch (error) {
            console.error('Error fetching job details:', error);
            try {
                const jobsResponse = await axiosIntense.get('/jobs');
                const foundJob = jobsResponse.data.data.find(j => j._id === id);
                if (foundJob) {
                    setJob(foundJob);
                } else {
                    Swal.fire({
                        title: 'Error!',
                        text: 'Job not found',
                        icon: 'error',
                        confirmButtonText: 'OK'
                    });
                    navigate('/jobs');
                }
            } catch {
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to load job details',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
                navigate('/jobs');
            }
        } finally {
            setLoading(false);
        }
    };

const handleApply = async () => {
    try {
        setApplying(true);
        
        // Check if user is logged in using useAuth
        if (!user) {
            Swal.fire({
                title: 'Login Required',
                text: 'Please login to apply for this job',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Login',
                cancelButtonText: 'Cancel'
            }).then((result) => {
                if (result.isConfirmed) {
                    navigate('/auth/signin');
                }
            });
            return;
        }

        // Apply for the job with user data from useAuth
        const applicationData = {
            jobId: id,
            userId: user.uid,
            userEmail: user.email,
            userName: user.displayName || user.email,
            jobTitle: job.title,
            company: job.company || 'Unknown Company',
            status: 'pending'
        };

        // ✅ সঠিক এন্ডপয়েন্ট ব্যবহার করুন
        const response = await axiosIntense.post('/applications', applicationData);
        
        if (response.data.success) {
            Swal.fire({
                title: 'Success!',
                text: 'Application submitted successfully!',
                icon: 'success',
                confirmButtonText: 'OK'
            });
            
            // Update job applications count locally
            setJob(prevJob => ({
                ...prevJob,
                applications: (prevJob.applications || 0) + 1
            }));
        }
    } catch (error) {
        console.error('Error applying for job:', error);
        Swal.fire({
            title: 'Error!',
            text: error.response?.data?.message || 'Failed to apply for job',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    } finally {
        setApplying(false);
    }
};

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!job) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h2>
                    <button 
                        onClick={() => navigate('/jobs')}
                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Back to Jobs
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Button */}
                <button 
                    onClick={() => navigate('/jobs')}
                    className="flex items-center text-blue-600 hover:text-blue-700 mb-6 transition-colors"
                >
                    <ArrowLeft className="w-5 h-5 mr-2" />
                    Back to Jobs
                </button>

                {/* Job Details Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Job Header */}
                    <div className="p-6 border-b border-gray-200">
                        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {job.title}
                                </h1>
                                
                                <div className="flex flex-wrap items-center gap-4 text-gray-600 mb-4">
                                    <div className="flex items-center">
                                        <Building className="w-4 h-4 mr-2" />
                                        <span>{job.company || 'Unknown Company'}</span>
                                    </div>
                                    {job.location && (
                                        <div className="flex items-center">
                                            <MapPin className="w-4 h-4 mr-2" />
                                            <span>{job.location}</span>
                                        </div>
                                    )}
                                    {(job.salaryMin || job.salaryMax) && (
                                        <div className="flex items-center">
                                            <DollarSign className="w-4 h-4 mr-2" />
                                            <span>
                                                ${job.salaryMin || 'N/A'} - ${job.salaryMax || 'N/A'}
                                            </span>
                                        </div>
                                    )}
                                </div>

                                <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                                    <div className="flex items-center">
                                        <Clock className="w-4 h-4 mr-2" />
                                        <span>Posted {formatDate(job.createdAt)}</span>
                                    </div>
                                    <div className="flex items-center">
                                        <Eye className="w-4 h-4 mr-2" />
                                        <span>{job.views || 0} views</span>
                                    </div>
                                    <div className="flex items-center">
                                        <User className="w-4 h-4 mr-2" />
                                        <span>{job.applications || 0} applications</span>
                                    </div>
                                </div>
                            </div>

                            {/* Apply Button */}
                            <div className="mt-4 lg:mt-0 lg:ml-6">
                                <button
                                    onClick={handleApply}
                                    disabled={applying || !user}
                                    className="w-full lg:w-auto bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                                >
                                    {applying ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                            Applying...
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle className="w-5 h-5 mr-2" />
                                            Submit Application
                                        </>
                                    )}
                                </button>
                                {!user && (
                                    <p className="text-xs text-gray-500 mt-2 text-center">
                                        Please login to apply
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Job Description */}
                    <div className="p-6">
                        <div className="prose max-w-none">
                            <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                                <FileText className="w-5 h-5 mr-2" />
                                Job Description
                            </h3>
                            <div className="text-gray-700 leading-relaxed whitespace-pre-line">
                                {job.description || 'No description provided.'}
                            </div>
                        </div>

                        {/* Additional Job Information */}
                        {(job.requirements || job.benefits || job.skills) && (
                            <div className="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                                {job.requirements && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Requirements</h4>
                                        <ul className="text-gray-700 list-disc list-inside space-y-1">
                                            {job.requirements.split('\n').map((req, index) => (
                                                <li key={index}>{req}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {job.benefits && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Benefits</h4>
                                        <ul className="text-gray-700 list-disc list-inside space-y-1">
                                            {job.benefits.split('\n').map((benefit, index) => (
                                                <li key={index}>{benefit}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {job.skills && (
                                    <div>
                                        <h4 className="font-semibold text-gray-900 mb-2">Skills Required</h4>
                                        <div className="flex flex-wrap gap-2">
                                            {job.skills.split(',').map((skill, index) => (
                                                <span 
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium"
                                                >
                                                    {skill.trim()}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Posted By */}
                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">
                                    Posted by: <span className="font-medium text-gray-900">{job.userName}</span>
                                </p>
                                <p className="text-xs text-gray-500">
                                    Last updated: {formatDate(job.updatedAt)}
                                </p>
                            </div>
                            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                                job.status === 'active' 
                                    ? 'bg-green-100 text-green-800' 
                                    : 'bg-gray-100 text-gray-800'
                            }`}>
                                {job.status || 'active'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobDetails;