import React, { useState, useEffect } from 'react';
import { Eye, Trash2, User, Building, FileText, Calendar, Search, ChevronLeft, ChevronRight, Mail, CheckCircle, XCircle, Clock4, Filter } from 'lucide-react';
import Swal from 'sweetalert2';
import axiosIntense from '../../../../hooks/AxiosIntense/axiosIntense';

const ApplicationsAdmin = () => {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [currentPage, setCurrentPage] = useState(1);
    const [totalApplications, setTotalApplications] = useState(0);
    const applicationsPerPage = 10;

    useEffect(() => {
        fetchApplications();
    }, [currentPage, searchTerm, statusFilter]);

    const fetchApplications = async () => {
        try {
            setLoading(true);
            const response = await axiosIntense.get('/applications');
            if (response.data.success) {
                let filteredApplications = response.data.data;

                // Apply search filter
                if (searchTerm) {
                    filteredApplications = filteredApplications.filter(app =>
                        app.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase()) ||
                        app.company.toLowerCase().includes(searchTerm.toLowerCase())
                    );
                }

                // Apply status filter
                if (statusFilter !== 'all') {
                    filteredApplications = filteredApplications.filter(app => app.status === statusFilter);
                }

                setApplications(filteredApplications);
                setTotalApplications(filteredApplications.length);
            }
        } catch (error) {
            console.error('Error fetching applications:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to load applications',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        } finally {
            setLoading(false);
        }
    };

  const handleDelete = async (applicationId, userName) => {
    const result = await Swal.fire({
        title: 'Are you sure?',
        text: `Do you want to delete application from ${userName}?`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#dc2626',
        cancelButtonColor: '#6b7280',
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
        try {
            // 🔥 Actual DELETE request to backend
            const response = await axiosIntense.delete(`/applications/${applicationId}`);

            if (response.data.success) {
                // Remove from local state
                setApplications(prev => prev.filter(app => app._id !== applicationId));
                setTotalApplications(prev => prev - 1);

                Swal.fire({
                    title: 'Deleted!',
                    text: 'Application has been deleted successfully.',
                    icon: 'success',
                    confirmButtonText: 'OK'
                });
            } else {
                throw new Error(response.data.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error deleting application:', error);
            Swal.fire({
                title: 'Error!',
                text: 'Failed to delete application from database.',
                icon: 'error',
                confirmButtonText: 'OK'
            });
        }
    }
};


    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'approved':
                return <CheckCircle className="w-4 h-4 text-green-500" />;
            case 'rejected':
                return <XCircle className="w-4 h-4 text-red-500" />;
            case 'pending':
                return <Clock4 className="w-4 h-4 text-yellow-500" />;
            default:
                return <Clock4 className="w-4 h-4 text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'approved':
                return 'bg-green-100 text-green-800';
            case 'rejected':
                return 'bg-red-100 text-red-800';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case 'approved':
                return 'Approved';
            case 'rejected':
                return 'Rejected';
            case 'pending':
                return 'Pending';
            default:
                return status;
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(1);
        fetchApplications();
    };

    const handlePageChange = (page) => {
        setCurrentPage(page);
    };

    const renderPagination = () => {
        const totalPages = Math.ceil(totalApplications / applicationsPerPage);
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

    // Calculate paginated applications
    const paginatedApplications = applications.slice(
        (currentPage - 1) * applicationsPerPage,
        currentPage * applicationsPerPage
    );

    const statusCounts = {
        all: applications.length,
        pending: applications.filter(app => app.status === 'pending').length,
        approved: applications.filter(app => app.status === 'approved').length,
        rejected: applications.filter(app => app.status === 'rejected').length
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
                        Applications Management
                    </h1>
                    <p className="text-gray-600">
                        View and manage all job applications in the system
                    </p>
                </div>

                {/* Stats and Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 md:p-6 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
                        <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">{statusCounts.all}</div>
                            <div className="text-sm text-blue-600">Total</div>
                        </div>
                        <div className="bg-yellow-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-yellow-600">{statusCounts.pending}</div>
                            <div className="text-sm text-yellow-600">Pending</div>
                        </div>
                        <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">{statusCounts.approved}</div>
                            <div className="text-sm text-green-600">Approved</div>
                        </div>
                        <div className="bg-red-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-red-600">{statusCounts.rejected}</div>
                            <div className="text-sm text-red-600">Rejected</div>
                        </div>
                        <div className="bg-purple-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-purple-600">{applications.length}</div>
                            <div className="text-sm text-purple-600">Filtered</div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                        <form onSubmit={handleSearch} className="flex-1 max-w-md">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                                <input
                                    type="text"
                                    placeholder="Search by name, email, job title, or company..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                />
                            </div>
                        </form>

                        <div className="flex items-center space-x-4">
                            <Filter className="w-4 h-4 text-gray-400" />
                            <select
                                value={statusFilter}
                                onChange={(e) => setStatusFilter(e.target.value)}
                                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="approved">Approved</option>
                                <option value="rejected">Rejected</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Applications Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    {/* Desktop Table */}
                    <div className="hidden lg:block overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applicant
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Job Details
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Applied Date
                                    </th>
                                    <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {paginatedApplications.map((application) => (
                                    <tr key={application._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-3">
                                                <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                                    <User className="w-5 h-5 text-blue-600" />
                                                </div>
                                                <div>
                                                    <div className="text-sm font-semibold text-gray-900">
                                                        {application.userName}
                                                    </div>
                                                    <div className="flex items-center space-x-1 text-sm text-gray-600">
                                                        <Mail className="w-3 h-3" />
                                                        <span>{application.userEmail}</span>
                                                    </div>
                                                    <div className="text-xs text-gray-500 mt-1">
                                                        ID: {application.userId.slice(0, 8)}...
                                                    </div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="space-y-2">
                                                <div className="flex items-center space-x-2">
                                                    <Building className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm font-medium text-gray-900">
                                                        {application.company}
                                                    </span>
                                                </div>
                                                <div className="flex items-center space-x-2">
                                                    <FileText className="w-4 h-4 text-gray-400" />
                                                    <span className="text-sm text-gray-700">
                                                        {application.jobTitle}
                                                    </span>
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    Job ID: {application.jobId.slice(0, 8)}...
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                {getStatusIcon(application.status)}
                                                <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                                    {getStatusText(application.status)}
                                                </span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <Calendar className="w-4 h-4 text-gray-400" />
                                                <div className="text-sm text-gray-600">
                                                    <div>{formatDate(application.appliedAt)}</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center space-x-2">
                                                <button
                                                    onClick={() => handleDelete(application._id, application.userName)}
                                                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                                    title="Delete Application"
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
                        {paginatedApplications.map((application) => (
                            <div key={application._id} className="border-b border-gray-200 p-4 last:border-b-0">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                                            <User className="w-4 h-4 text-blue-600" />
                                        </div>
                                        <div>
                                            <div className="text-sm font-semibold text-gray-900">
                                                {application.userName}
                                            </div>
                                            <div className="text-xs text-gray-600">
                                                {application.userEmail}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        {getStatusIcon(application.status)}
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                                            {getStatusText(application.status)}
                                        </span>
                                    </div>
                                </div>

                                <div className="space-y-2 mb-3">
                                    <div className="flex items-center space-x-2">
                                        <Building className="w-3 h-3 text-gray-400" />
                                        <span className="text-sm font-medium text-gray-900">
                                            {application.company}
                                        </span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <FileText className="w-3 h-3 text-gray-400" />
                                        <span className="text-sm text-gray-700">
                                            {application.jobTitle}
                                        </span>
                                    </div>
                                </div>

                                <div className="flex items-center justify-between text-xs text-gray-500">
                                    <div className="flex items-center space-x-1">
                                        <Calendar className="w-3 h-3" />
                                        <span>{formatDate(application.appliedAt)}</span>
                                    </div>
                                    <button
                                        onClick={() => handleDelete(application._id, application.userName)}
                                        className="p-1 text-red-600 hover:bg-red-50 rounded transition-colors"
                                    >
                                        <Trash2 className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Empty State */}
                    {paginatedApplications.length === 0 && (
                        <div className="text-center py-12">
                            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No applications found</h3>
                            <p className="text-gray-600">
                                {searchTerm || statusFilter !== 'all' ? 'Try adjusting your search or filters' : 'No applications have been submitted yet'}
                            </p>
                        </div>
                    )}
                </div>

                {/* Pagination */}
                {Math.ceil(totalApplications / applicationsPerPage) > 1 && renderPagination()}

                {/* Page Info */}
                <div className="text-center text-sm text-gray-500 mt-4">
                    Showing {paginatedApplications.length} of {totalApplications} applications
                </div>
            </div>
        </div>
    );
};

export default ApplicationsAdmin;