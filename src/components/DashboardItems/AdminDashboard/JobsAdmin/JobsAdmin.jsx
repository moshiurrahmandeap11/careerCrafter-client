import React, { useState, useEffect } from 'react';
import { Eye, Trash2, Building, User, DollarSign, FileText, Calendar, Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';
import axiosIntense from '../../../../hooks/AxiosIntense/axiosIntense';


const JobsAdmin = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalJobs, setTotalJobs] = useState(0);
    const jobsPerPage = 10;

    useEffect(() => {
        fetchJobs();
    }, [currentPage, searchTerm]);

    const fetchJobs = async () => {
        try {
            setLoading(true);
            const response = await axiosIntense.get(`/jobs?page=${currentPage}&limit=${jobsPerPage}&search=${searchTerm}`);
            if (response.data.success) {
                setJobs(response.data.data);
                setTotalPages(response.data.pagination.total);
                setTotalJobs(response.data.pagination.totalJobs);
            }
        } catch (error) {
            console.error('Error fetching jobs:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load jobs',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (jobId, jobTitle) => {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: `Do you want to delete "${jobTitle}"?`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#dc2626',
            cancelButtonColor: '#6b7280',
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'Cancel'
        });

        if (result.isConfirmed) {
            try {
                const response = await axiosIntense.delete(`/jobs/${jobId}`);
                if (response.data.success) {
                    Swal.fire({
                        title: 'Deleted!',
                        text: 'Job has been deleted successfully.',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                    fetchJobs();
                }
            } catch (error) {
                console.error('Error deleting job:', error);
                Swal.fire({
                    title: 'Error!',
                    text: 'Failed to delete job',
                    icon: 'error',
                    confirmButtonText: 'OK'
                });
            }
        }
    };

    const handleView = (jobId) => {
        navigate(`/job/${jobId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const formatSalary = (min, max) => {
        if (!min && !max) return 'Not specified';
        if (!min) return `Up to $${max.toLocaleString()}`;
        if (!max) return `From $${min.toLocaleString()}`;
        return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchJobs();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(
                <button
                    key={i}
                    onClick={() => handlePageChange(i)}
                    className={`px-3 py-1 rounded-lg ${
                        currentPage === i
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    } transition-colors`}
                >
                    {i}
                </button>
            );
        }

        return (
            <div className="flex items-center justify-center space-x-2 mt-6">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                </button>
                
                {pages}
                
                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-4 h-4" />
                </button>
            </div>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="mb-6 md:mb-8">
                    <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                        Jobs Management
                    </h1>
                    <p className="text-gray-600">
                        Manage all job listings in the system
                    </p>
                </div>

                {/* Stats and Search */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <div className="flex items-center space-x-4">
                            <div className="bg-blue-100 p-3 rounded-lg">
                                <Building className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-gray-900">{totalJobs}</div>
                                <div className="text-sm text-gray-600">Total Jobs</div>
                            </div>
                        </div>

                        <form onSubmit={handleSearch} className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search jobs by title or description..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </form>
                    </div>
                </div>

                {/* Jobs Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Company & Poster
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Salary & Stats
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {jobs.map((job) => (
                                    <tr key={job._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-start space-x-3">
                                                {job.image && (
                                                    <img
                                                        src={job.image}
                                                        alt={job.title}
                                                        className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                                    />
                                                )}
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                        {job.title}
                                                    </h3>
                                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                                                        {job.description}
                                                    </p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <Building className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {job.company || 'N/A'}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-2">
                                                <User className="w-4 h-4 text-gray-400" />
                                                <span className="text-sm text-gray-600">
                                                    {job.userName}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2 mb-2">
                                                <DollarSign className="w-4 h-4 text-green-500" />
                                                <span className="text-sm font-medium text-gray-900">
                                                    {formatSalary(job.salaryMin, job.salaryMax)}
                                                </span>
                                            </div>
                                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                                                <span className="flex items-center space-x-1">
                                                    <Eye className="w-3 h-3" />
                                                    <span>{job.views || 0} views</span>
                                                </span>
                                                <span className="flex items-center space-x-1">
                                                    <FileText className="w-3 h-3" />
                                                    <span>{job.applications || 0} apps</span>
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div className="text-sm text-gray-600">
                                                    <div>{formatDate(job.createdAt)}</div>
                                                    <div className="text-xs text-gray-500">Created</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleView(job._id)}
                                                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                                    title="View Job"
                                                >
                                                    <Eye className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(job._id, job.title)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Job"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Cards */}
                    <div className="lg:hidden">
                        {jobs.map((job) => (
                            <div key={job._id} className="border-b border-gray-200 p-4 last:border-b-0">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-start space-x-3 flex-1">
                                        {job.image && (
                                            <img
                                                src={job.image}
                                                alt={job.title}
                                                className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                                            />
                                        )}
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-gray-900 truncate">
                                                {job.title}
                                            </h3>
                                            <div className="flex items-center space-x-2 mt-1">
                                                <Building className="w-3 h-3 text-gray-400" />
                                                <span className="text-xs text-gray-600">
                                                    {job.company || 'N/A'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-1">
                                        <button
                                            onClick={() => handleView(job._id)}
                                            className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                                        >
                                            <Eye className="w-4 h-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(job._id, job.title)}
                                            className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>

                                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                                    {job.description}
                                </p>

                                <div className="grid grid-cols-2 gap-4 text-xs">
                                    <div>
                                        <div className="flex items-center space-x-1 mb-1">
                                            <DollarSign className="w-3 h-3 text-green-500" />
                                            <span className="font-medium">Salary</span>
                                        </div>
                                        <div className="text-gray-600">
                                            {formatSalary(job.salaryMin, job.salaryMax)}
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex items-center space-x-1 mb-1">
                                            <User className="w-3 h-3 text-gray-400" />
                                            <span className="font-medium">Posted by</span>
                                        </div>
                                        <div className="text-gray-600 truncate">
                                            {job.userName}
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                                        <span className="flex items-center space-x-1">
                                            <Eye className="w-3 h-3" />
                                            <span>{job.views || 0}</span>
                                        </span>
                                        <span className="flex items-center space-x-1">
                                            <FileText className="w-3 h-3" />
                                            <span>{job.applications || 0}</span>
                                        </span>
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {formatDate(job.createdAt)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {jobs.length === 0 && (
                        <div className="text-center py-12">
                            <Building className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No jobs found</h3>
                            <p className="text-gray-600">
                                {searchTerm ? 'Try adjusting your search terms' : 'No jobs have been posted yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && renderPagination()}

                {/* Page Info */}
                <div className="text-center text-sm text-gray-500 mt-4">
                    Showing {jobs.length} of {totalJobs} jobs
                </div>
            </div>
        </div>
    );
};

export default JobsAdmin;