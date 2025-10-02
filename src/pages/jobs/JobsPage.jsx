import React, { useState, useEffect } from 'react';
import { 
  Search, 
  MapPin, 
  Briefcase, 
  Bookmark,
  Filter,
  Heart,
  Target,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApplicationCard } from '../../components/jobs-component/ApplicationCard';
import { JobCard } from '../../components/jobs-component/JobCard';
import { SavedJobCard } from '../../components/jobs-component/SavedJobCard';

const JobsPage = () => {
  const [activeTab, setActiveTab] = useState('recommended');
  const [searchTerm, setSearchTerm] = useState('');
  const [location, setLocation] = useState('');
  const [jobs, setJobs] = useState([]);
  const [savedJobs, setSavedJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchJobsData();
  }, []);

  const fetchJobsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from public folder
      const [jobsResponse, savedResponse, applicationsResponse] = await Promise.all([
        fetch('/data/jobs.json'),
        fetch('/data/saved-jobs.json'),
        fetch('/data/applications.json')
      ]);

      if (!jobsResponse.ok || !savedResponse.ok || !applicationsResponse.ok) {
        throw new Error('Failed to fetch jobs data');
      }

      const [jobsData, savedData, applicationsData] = await Promise.all([
        jobsResponse.json(),
        savedResponse.json(),
        applicationsResponse.json()
      ]);

      setJobs(jobsData);
      setSavedJobs(savedData);
      setApplications(applicationsData);

    } catch (error) {
      console.error('Error fetching jobs data:', error);
      setError('Failed to load jobs data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };



  const filteredJobs = jobs.filter(job =>
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const tabVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      x: 4,
      backgroundColor: "rgba(59, 130, 246, 0.05)"
    },
    active: {
      x: 0,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderLeftColor: "#3b82f6"
    }
  };

  const mobileMenuVariants = {
    closed: {
      x: '-100%',
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };


  const tabs = [
    { id: 'recommended', label: 'Recommended', count: jobs.length, icon: Target, description: 'Jobs matching your profile' },
    { id: 'saved', label: 'Saved Jobs', count: savedJobs.length, icon: Bookmark, description: 'Your bookmarked positions' },
    { id: 'applications', label: 'My Applications', count: applications.length, icon: Heart, description: 'Track your applications' },
  ];

  const TabNavigation = () => (
    <motion.div 
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm lg:sticky lg:top-35"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.4 }}
    >
      <div className="space-y-2">
        {tabs.map((tab) => (
          <motion.button
            key={tab.id}
            onClick={() => {
              setActiveTab(tab.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full text-left p-4 rounded-xl border-l-4 transition-all duration-200 flex items-center justify-between group ${
              activeTab === tab.id
                ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                : 'border-transparent text-gray-600 hover:bg-gray-50'
            }`}
            variants={tabVariants}
            whileHover="hover"
          >
            <div className="flex items-center space-x-3">
              <tab.icon className={`w-5 h-5 ${
                activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
              }`} />
              <div className="text-left">
                <div className="font-semibold text-sm">{tab.label}</div>
                <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
              </div>
            </div>
            <div className={`px-2 py-1 text-xs rounded-full ${
              activeTab === tab.id
                ? 'bg-blue-100 text-blue-700'
                : 'bg-gray-100 text-gray-600'
            }`}>
              {tab.count}
            </div>
          </motion.button>
        ))}
      </div>
    </motion.div>
  );

  const MobileMenuButton = () => (
    <motion.button
      onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
      className="lg:hidden bg-white p-3 rounded-xl border border-gray-200 shadow-sm"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {isMobileMenuOpen ? (
        <X className="w-6 h-6 text-gray-600" />
      ) : (
        <Menu className="w-6 h-6 text-gray-600" />
      )}
    </motion.button>
  );

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
            Finding your dream jobs...
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Jobs Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button 
            onClick={fetchJobsData}
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
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between">
              <div>
                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  Find Your Dream Job
                </motion.h1>
                <motion.p 
                  className="text-lg text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Discover opportunities that match your skills and aspirations
                </motion.p>
              </div>
              <MobileMenuButton />
            </div>
          </div>
        </motion.div>

        {/* Search Bar */}
        <motion.div 
          className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Job title, skills, or company"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
            </div>
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
            <div className="flex space-x-3">
              <motion.button 
                className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter className="w-4 h-4" />
                <span>Filters</span>
              </motion.button>
              <motion.button 
                className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Search Jobs
              </motion.button>
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Mobile Menu Overlay */}
          <AnimatePresence>
            {isMobileMenuOpen && (
              <>
                <motion.div
                  className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                />
                <motion.div
                  className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden shadow-xl"
                  variants={mobileMenuVariants}
                  initial="closed"
                  animate="open"
                  exit="closed"
                >
                  <div className="p-6 h-full overflow-y-auto">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
                      <button 
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <X className="w-5 h-5 text-gray-600" />
                      </button>
                    </div>
                    <TabNavigation />
                  </div>
                </motion.div>
              </>
            )}
          </AnimatePresence>

          {/* Left Column - Tabs Navigation (Desktop) */}
          <div className="hidden lg:block lg:w-80 flex-shrink-0">
            <TabNavigation />
          </div>

          {/* Right Column - Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
              >
                {activeTab === 'recommended' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Recommended for You
                      </h2>
                      <span className="text-gray-500">{jobs.length} jobs</span>
                    </div>
                    <motion.div 
                      className="grid gap-6"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {filteredJobs.map((job) => (
                        <JobCard key={job.id} job={job} />
                      ))}
                    </motion.div>
                  </>
                )}

                {activeTab === 'saved' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        Saved Jobs
                      </h2>
                      <span className="text-gray-500">{savedJobs.length} saved</span>
                    </div>
                    <motion.div 
                      className="grid gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {savedJobs.map((job) => (
                        <SavedJobCard key={job.id} job={job} />
                      ))}
                    </motion.div>
                  </>
                )}

                {activeTab === 'applications' && (
                  <>
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-2xl font-bold text-gray-900">
                        My Applications
                      </h2>
                      <span className="text-gray-500">{applications.length} applications</span>
                    </div>
                    <motion.div 
                      className="grid gap-4"
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                    >
                      {applications.map((application) => (
                        <ApplicationCard key={application.id} application={application} />
                      ))}
                    </motion.div>
                  </>
                )}

                {/* Empty states */}
                {activeTab === 'recommended' && jobs.length === 0 && (
                  <motion.div 
                    className="text-center py-12 bg-white rounded-xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Briefcase className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No jobs found</h3>
                    <p className="text-gray-600 mb-6">Try adjusting your search criteria or check back later</p>
                  </motion.div>
                )}

                {activeTab === 'saved' && savedJobs.length === 0 && (
                  <motion.div 
                    className="text-center py-12 bg-white rounded-xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Bookmark className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No saved jobs</h3>
                    <p className="text-gray-600 mb-6">Start saving jobs that interest you</p>
                  </motion.div>
                )}

                {activeTab === 'applications' && applications.length === 0 && (
                  <motion.div 
                    className="text-center py-12 bg-white rounded-xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No applications yet</h3>
                    <p className="text-gray-600 mb-6">Start applying to jobs to track your progress</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default JobsPage;