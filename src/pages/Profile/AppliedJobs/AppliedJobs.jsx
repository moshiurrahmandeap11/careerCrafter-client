import React, { useState, useEffect } from 'react';
import { Link } from 'react-router';
import {
  Briefcase,
  Building,
  MapPin,
  Calendar,
  Clock,
  CheckCircle,
  XCircle,
  Clock4,
  Eye,
  DollarSign,
  Search,
  Filter
} from 'lucide-react';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';
import useAuth from '../../../hooks/UseAuth/useAuth';
import Loader from '../../../components/sharedItems/Loader/Loader';
import Swal from 'sweetalert2';

const AppliedJobs = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  useEffect(() => {
    if (user?.uid) {
      fetchApplications();
    }
  }, [user?.uid]);

  const fetchApplications = async () => {
    try {
      setLoading(true);
      const response = await axiosIntense.get(`/applications/user/${user.uid}`);

      if (response.data.success) {
        // Fetch job details for each application
        const applicationsWithDetails = await Promise.all(
          response.data.data.map(async (application) => {
            try {
              const jobResponse = await axiosIntense.get(`/jobs/${application.jobId}`);
              return {
                ...application,
                jobDetails: jobResponse.data.data || null
              };
            } catch (error) {
              console.error(`Error fetching job ${application.jobId}:`, error);
              return {
                ...application,
                jobDetails: null
              };
            }
          })
        );

        setApplications(applicationsWithDetails);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      Swal.fire({
        title: 'Error!',
        text: 'Failed to load your applications. Please try again.',
        icon: 'error',
        confirmButtonText: 'OK'
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock4 className="w-4 h-4 text-yellow-600" />;
      default:
        return <Clock4 className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
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

  // Filter applications based on search term and status
  const filteredApplications = applications.filter(application => {
    const matchesSearch = application.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.company?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    all: applications.length,
    pending: applications.filter(app => app.status === 'pending').length,
    approved: applications.filter(app => app.status === 'approved').length,
    rejected: applications.filter(app => app.status === 'rejected').length,
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8">
        <div className="flex items-center justify-center py-12">
          <Loader />
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-3">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div className="flex items-center space-x-3 mb-4 lg:mb-0">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Briefcase className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-gray-900">Applied Jobs</h2>
            <p className="text-gray-600 text-sm">
              {applications.length} job application{applications.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex flex-wrap gap-2">
          {[
            { key: 'all', label: 'All', count: statusCounts.all },
            { key: 'pending', label: 'Pending', count: statusCounts.pending },
            { key: 'approved', label: 'Approved', count: statusCounts.approved },
            { key: 'rejected', label: 'Rejected', count: statusCounts.rejected },
          ].map(({ key, label, count }) => (
            <button
              key={key}
              onClick={() => setStatusFilter(key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center space-x-1 ${statusFilter === key
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
            >
              <span>{label}</span>
              <span className={`px-1.5 py-0.5 rounded text-xs ${statusFilter === key ? 'bg-blue-500' : 'bg-gray-300'
                }`}>
                {count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Search Bar */}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search by job title or company..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
          />
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApplications.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Briefcase className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {applications.length === 0 ? 'No Applications Yet' : 'No Matching Applications'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {applications.length === 0
                ? "You haven't applied to any jobs yet. Start browsing opportunities and apply to your dream jobs!"
                : "No applications match your current search criteria. Try adjusting your filters."
              }
            </p>
            {applications.length === 0 && (
              <Link
                to="/jobs"
                className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200"
              >
                <Briefcase className="w-4 h-4" />
                <span>Browse Jobs</span>
              </Link>
            )}
          </div>
        ) : (
          filteredApplications.map((application) => (
            <div
              key={application._id}
              className="border border-gray-200 rounded-xl p-5 hover:border-gray-300 transition-all duration-200"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                {/* Job Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4 mb-3">
                    {application.jobDetails?.image && (
                      <img
                        src={application.jobDetails.image}
                        alt={application.company}
                        className="w-12 h-12 rounded-lg object-cover border border-gray-200"
                      />
                    )}
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 line-clamp-2">
                          {application.jobTitle}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusColor(application.status)}`}>
                            {getStatusIcon(application.status)}
                            <span className="ml-1 capitalize">{application.status}</span>
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-700 mb-3">
                        <Building className="w-4 h-4 mr-2 text-gray-500" />
                        <span className="font-medium">{application.company}</span>
                      </div>

                      {/* Job Meta */}
                      <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
                        {application.jobDetails?.location && (
                          <div className="flex items-center">
                            <MapPin className="w-4 h-4 mr-2 text-green-600" />
                            <span>{application.jobDetails.location}</span>
                          </div>
                        )}
                        {application.jobDetails?.salaryMin && application.jobDetails?.salaryMax && (
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-2 text-yellow-600" />
                            <span>
                              ${application.jobDetails.salaryMin.toLocaleString()} - ${application.jobDetails.salaryMax.toLocaleString()}
                            </span>
                          </div>
                        )}
                        {application.jobDetails?.jobType && (
                          <div className="flex items-center">
                            <Briefcase className="w-4 h-4 mr-2 text-blue-600" />
                            <span className="capitalize">{application.jobDetails.jobType.replace('-', ' ')}</span>
                          </div>
                        )}
                      </div>

                      {/* Application Date */}
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar className="w-4 h-4 mr-2" />
                        <span>Applied {getTimeAgo(application.appliedAt)}</span>
                        <span className="mx-2">•</span>
                        <Clock className="w-4 h-4 mr-2" />
                        <span>{formatDate(application.appliedAt)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-col gap-2 lg:w-48">
                  <Link
                    to={`/job/${application.jobId}`}
                    className="flex items-center justify-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 py-2 px-4 rounded-lg font-medium transition-all duration-200"
                  >
                    <Eye className="w-4 h-4" />
                    View Job
                  </Link>

                  {application.jobDetails && (
                    <div className="text-xs text-gray-500 text-center">
                      {application.jobDetails.views || 0} views • {application.jobDetails.applications || 0} applicants
                    </div>
                  )}
                </div>
              </div>

              {/* Application Notes (if any) */}
              {application.notes && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-sm text-gray-700">{application.notes}</p>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Stats Summary */}
      {applications.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gray-50 rounded-xl">
              <div className="text-2xl font-bold text-gray-900">{statusCounts.all}</div>
              <div className="text-sm text-gray-600">Total Applications</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-2xl font-bold text-yellow-700">{statusCounts.pending}</div>
              <div className="text-sm text-yellow-600">Pending</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-2xl font-bold text-green-700">{statusCounts.approved}</div>
              <div className="text-sm text-green-600">Approved</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-xl">
              <div className="text-2xl font-bold text-red-700">{statusCounts.rejected}</div>
              <div className="text-sm text-red-600">Rejected</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AppliedJobs;