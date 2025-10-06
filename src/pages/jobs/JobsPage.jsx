import React, { useEffect, useState } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Bookmark,
  Filter,
  Heart,
  Calendar,
  DollarSign,
  Building,
  Clock,
  MapPinIcon
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import axiosIntense from '../../hooks/AxiosIntense/axiosIntense';


const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [salaryFilter, setSalaryFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');
  const [savedJobs, setSavedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [jobs, searchTerm, location, salaryFilter, dateFilter, activeTab]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosIntense.get('/jobs');
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setError('Failed to load jobs. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      // This would typically come from your backend based on user ID
      const saved = JSON.parse(localStorage.getItem('savedJobs') || '[]');
      setSavedJobs(saved);
    } catch (error) {
      console.error('Error fetching saved jobs:', error);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.userName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Location filter
    if (location) {
      filtered = filtered.filter(job => 
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Salary filter
    if (salaryFilter) {
      filtered = filtered.filter(job => {
        const avgSalary = (job.salaryMin + job.salaryMax) / 2;
        switch (salaryFilter) {
          case 'under-50k':
            return avgSalary < 50000;
          case '50k-100k':
            return avgSalary >= 50000 && avgSalary <= 100000;
          case '100k-150k':
            return avgSalary > 100000 && avgSalary <= 150000;
          case 'over-150k':
            return avgSalary > 150000;
          default:
            return true;
        }
      });
    }

    // Date filter
    if (dateFilter) {
      const now = new Date();
      filtered = filtered.filter(job => {
        const jobDate = new Date(job.createdAt);
        const diffTime = Math.abs(now - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case '24h':
            return diffDays <= 1;
          case '7d':
            return diffDays <= 7;
          case '30d':
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Tab filter
    if (activeTab === 'saved') {
      filtered = filtered.filter(job => savedJobs.includes(job._id));
    }

    setFilteredJobs(filtered);
  };

  const toggleSaveJob = (jobId) => {
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter(id => id !== jobId)
      : [...savedJobs, jobId];
    
    setSavedJobs(newSavedJobs);
    localStorage.setItem('savedJobs', JSON.stringify(newSavedJobs));
  };

  const formatSalary = (min, max) => {
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const clearFilters = () => {
    setSearchTerm('');
    setLocation('');
    setSalaryFilter('');
    setDateFilter('');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{ 
              rotate: 360,
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Briefcase className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Loading job opportunities...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div 
          className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Jobs</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button 
            onClick={fetchJobs}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center">
            <motion.h1 
              className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Find Your Dream Job
            </motion.h1>
            <motion.p 
              className="text-lg text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Discover {jobs.length} opportunities from various companies and industries
            </motion.p>
          </div>
        </motion.div>

        {/* Search and Filters */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, company, or keywords"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>
            </div>

            {/* Salary Filter */}
            <div>
              <select
                value={salaryFilter}
                onChange={(e) => setSalaryFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">All Salaries</option>
                <option value="under-50k">Under $50k</option>
                <option value="50k-100k">$50k - $100k</option>
                <option value="100k-150k">$100k - $150k</option>
                <option value="over-150k">Over $150k</option>
              </select>
            </div>

            {/* Date Filter */}
            <div>
              <select
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Any Time</option>
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last Week</option>
                <option value="30d">Last Month</option>
              </select>
            </div>
          </div>

          {/* Active Filters and Clear */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Search: {searchTerm}
                  <button onClick={() => setSearchTerm('')} className="ml-2 hover:text-blue-600">×</button>
                </span>
              )}
              {location && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Location: {location}
                  <button onClick={() => setLocation('')} className="ml-2 hover:text-green-600">×</button>
                </span>
              )}
              {salaryFilter && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Salary: {salaryFilter}
                  <button onClick={() => setSalaryFilter('')} className="ml-2 hover:text-purple-600">×</button>
                </span>
              )}
              {dateFilter && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Posted: {dateFilter}
                  <button onClick={() => setDateFilter('')} className="ml-2 hover:text-orange-600">×</button>
                </span>
              )}
            </div>

            {(searchTerm || location || salaryFilter || dateFilter) && (
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        </motion.div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200 mb-6 overflow-x-auto">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap ${
              activeTab === 'all'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            All Jobs ({jobs.length})
          </button>
          <button
            onClick={() => setActiveTab('saved')}
            className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
              activeTab === 'saved'
                ? 'border-blue-500 text-blue-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            <Bookmark className="w-4 h-4" />
            Saved Jobs ({savedJobs.length})
          </button>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing {filteredJobs.length} of {jobs.length} jobs
          </p>
        </div>

        {/* Jobs Grid */}
        <motion.div 
          className="grid gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          {filteredJobs.map((job, index) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-start gap-6">
                {/* Job Image */}
                {job.image && (
                  <div className="flex-shrink-0">
                    <img 
                      src={job.image} 
                      alt={job.title}
                      className="w-16 h-16 lg:w-20 lg:h-20 object-cover rounded-xl"
                    />
                  </div>
                )}

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-900 mb-2 line-clamp-2">
                        {job.title}
                      </h3>
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-3">
                        <div className="flex items-center gap-1">
                          <Building className="w-4 h-4" />
                          <span>Posted by {job.userName}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <DollarSign className="w-4 h-4" />
                          <span className="font-semibold text-green-600">
                            {formatSalary(job.salaryMin, job.salaryMax)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Save Button */}
                    <button
                      onClick={() => toggleSaveJob(job._id)}
                      className={`p-3 rounded-xl transition-all duration-200 flex-shrink-0 ${
                        savedJobs.includes(job._id)
                          ? 'bg-red-50 text-red-600 hover:bg-red-100'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                    >
                      <Bookmark 
                        className={`w-5 h-5 ${savedJobs.includes(job._id) ? 'fill-current' : ''}`} 
                      />
                    </button>
                  </div>

                  {/* Job Description */}
                  <p className="text-gray-600 line-clamp-3 mb-4">
                    {job.description}
                  </p>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                    >
                      Apply Now
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <motion.div 
            className="text-center py-16 bg-white rounded-2xl border border-gray-200"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Briefcase className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <h3 className="text-2xl font-semibold text-gray-900 mb-2">
              {activeTab === 'saved' ? 'No Saved Jobs' : 'No Jobs Found'}
            </h3>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {activeTab === 'saved' 
                ? 'Start saving jobs that interest you by clicking the bookmark icon.'
                : 'Try adjusting your search criteria or check back later for new opportunities.'
              }
            </p>
            {activeTab === 'saved' ? (
              <motion.button
                onClick={() => setActiveTab('all')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Browse All Jobs
              </motion.button>
            ) : (
              <motion.button
                onClick={clearFilters}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Filters
              </motion.button>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;