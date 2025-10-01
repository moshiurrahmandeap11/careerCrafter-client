import React, { useState, useEffect } from 'react';
import { Search, MapPin, Building2, Clock, DollarSign, Bookmark, Share2, Users, TrendingUp, Filter, ChevronDown, ChevronRight, Briefcase, Star, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

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

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const cardVariants = {
  hidden: { y: 20, opacity: 0, scale: 0.95 },
  visible: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  },
  hover: {
    y: -4,
    scale: 1.02,
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 17
    }
  },
  tap: {
    scale: 0.98
  }
};

const filterVariants = {
  hidden: { x: -20, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 12
    }
  }
};

const pulseVariants = {
  animate: {
    scale: [1, 1.05, 1],
    opacity: [0.2, 0.3, 0.2],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

const JobsPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [savedJobs, setSavedJobs] = useState(new Set());
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Mock job data
  const jobs = [
    {
      id: 1,
      title: 'Senior Frontend Developer',
      company: 'TechCorp',
      logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
      location: 'San Francisco, CA',
      type: 'Full-time',
      remote: true,
      salary: '$120,000 - $150,000',
      posted: '2 hours ago',
      applicants: 24,
      easyApply: true,
      skills: ['React', 'TypeScript', 'Next.js', 'Tailwind'],
      description: 'We are looking for a skilled Frontend Developer to join our dynamic team...',
      featured: true,
      promoted: true
    },
    {
      id: 2,
      title: 'Full Stack Engineer',
      company: 'InnovateLabs',
      logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
      location: 'New York, NY',
      type: 'Full-time',
      remote: true,
      salary: '$130,000 - $160,000',
      posted: '1 day ago',
      applicants: 42,
      easyApply: true,
      skills: ['React', 'Node.js', 'Python', 'AWS'],
      description: 'Join our innovative team to build cutting-edge web applications...',
      featured: true,
      promoted: false
    },
    {
      id: 3,
      title: 'UX/UI Designer',
      company: 'DreamJobs',
      logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
      location: 'Remote',
      type: 'Contract',
      remote: true,
      salary: '$90,000 - $110,000',
      posted: '3 days ago',
      applicants: 18,
      easyApply: false,
      skills: ['Figma', 'Sketch', 'Adobe XD', 'Prototyping'],
      description: 'Looking for a creative UX/UI designer to transform user experiences...',
      featured: false,
      promoted: true
    },
    {
      id: 4,
      title: 'DevOps Engineer',
      company: 'FutureWorks',
      logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
      location: 'Austin, TX',
      type: 'Full-time',
      remote: false,
      salary: '$110,000 - $140,000',
      posted: '1 week ago',
      applicants: 31,
      easyApply: true,
      skills: ['Docker', 'Kubernetes', 'CI/CD', 'Linux'],
      description: 'Seeking experienced DevOps engineer to optimize our infrastructure...',
      featured: false,
      promoted: false
    },
    {
      id: 5,
      title: 'Product Manager',
      company: 'CareerBoost',
      logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png',
      location: 'Chicago, IL',
      type: 'Full-time',
      remote: true,
      salary: '$140,000 - $170,000',
      posted: '2 days ago',
      applicants: 28,
      easyApply: false,
      skills: ['Product Strategy', 'Agile', 'Data Analysis', 'Leadership'],
      description: 'Lead product development and strategy for our growing platform...',
      featured: true,
      promoted: true
    }
  ];

  // Recommended companies
  const companies = [
    { name: 'Google', jobs: 42, logo: '🏢' },
    { name: 'Microsoft', jobs: 38, logo: '🏢' },
    { name: 'Amazon', jobs: 56, logo: '🏢' },
    { name: 'Netflix', jobs: 23, logo: '🏢' }
  ];

  const toggleSaveJob = (jobId) => {
    setSavedJobs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  const filters = [
    { id: 'all', label: 'All Jobs', count: jobs.length },
    { id: 'remote', label: 'Remote', count: jobs.filter(job => job.remote).length },
    { id: 'featured', label: 'Featured', count: jobs.filter(job => job.featured).length },
    { id: 'easy-apply', label: 'Easy Apply', count: jobs.filter(job => job.easyApply).length }
  ];

  const filteredJobs = activeFilter === 'all' 
    ? jobs 
    : jobs.filter(job => {
        switch (activeFilter) {
          case 'remote': return job.remote;
          case 'featured': return job.featured;
          case 'easy-apply': return job.easyApply;
          default: return true;
        }
      });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 mb-20 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          variants={pulseVariants}
          animate="animate"
          className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
        />
        <motion.div
          variants={pulseVariants}
          animate="animate"
          initial={{ scale: 1, opacity: 0.2 }}
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20"
          style={{ animationDelay: '2s' }}
        />
      </div>

      <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <motion.h1 
                className="text-3xl lg:text-4xl font-bold text-gray-900"
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1, duration: 0.6 }}
              >
                Find Your
                <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"> Dream Job</span>
              </motion.h1>
              <motion.p 
                className="text-gray-600 mt-2"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                Discover opportunities that match your skills and aspirations
              </motion.p>
            </div>
            <motion.div 
              className="flex items-center space-x-3"
              initial={{ x: 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.6 }}
            >
              <div className="bg-white rounded-xl px-4 py-2 border border-gray-200 shadow-sm">
                <span className="text-sm text-gray-600">👋 Hello,</span>
                <span className="font-semibold text-gray-900 ml-2">John Doe</span>
              </div>
            </motion.div>
          </div>

          {/* Search Bar */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for jobs, companies, or skills..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <div className="flex-1 relative">
                <MapPin className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  value={locationQuery}
                  onChange={(e) => setLocationQuery(e.target.value)}
                  placeholder="Location"
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              >
                <Search className="w-5 h-5" />
                <span>Search</span>
              </motion.button>
            </div>
          </motion.div>
        </motion.div>

        <motion.div 
          className="grid lg:grid-cols-4 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Left Sidebar - Filters */}
          <div className="lg:col-span-1 space-y-6">
            {/* Quick Filters */}
            <motion.div variants={filterVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                <Filter className="w-5 h-5 mr-2" />
                Quick Filters
              </h3>
              <div className="space-y-2">
                {filters.map((filter, index) => (
                  <motion.button
                    key={filter.id}
                    variants={itemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    onClick={() => setActiveFilter(filter.id)}
                    className={`w-full flex items-center justify-between p-3 rounded-xl transition-all duration-200 ${
                      activeFilter === filter.id
                        ? 'bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 text-blue-700'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <span className="font-medium">{filter.label}</span>
                    <span className="bg-gray-200 text-gray-600 px-2 py-1 rounded-full text-xs font-semibold">
                      {filter.count}
                    </span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Recommended Companies */}
            <motion.div variants={itemVariants} className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <h3 className="font-semibold text-gray-900 mb-4">Recommended Companies</h3>
              <div className="space-y-3">
                {companies.map((company, index) => (
                  <motion.div
                    key={company.name}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-200 cursor-pointer"
                    whileHover={{ x: 4 }}
                  >
                    <div className="flex items-center space-x-3">
                      <motion.div 
                        className="w-10 h-10 bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg flex items-center justify-center text-lg"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        {company.logo}
                      </motion.div>
                      <div>
                        <div className="font-semibold text-gray-900">{company.name}</div>
                        <div className="text-sm text-gray-600">{company.jobs} jobs</div>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* AI Recommendations */}
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              whileHover={{ y: -2 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center space-x-2 mb-3">
                <motion.div
                  animate={{ rotate: [0, 10, -10, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                >
                  <Sparkles className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold">AI Career Match</span>
              </div>
              <p className="text-blue-100 text-sm mb-4">
                Our AI found 12 jobs that perfectly match your profile and preferences.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-blue-600 py-2 rounded-xl font-semibold hover:bg-blue-50 transition-colors duration-200"
              >
                View Matches
              </motion.button>
            </motion.div>
          </div>

          {/* Main Content - Job Listings */}
          <div className="lg:col-span-2 space-y-6">
            {/* Jobs Count */}
            <motion.div 
              variants={itemVariants}
              className="flex items-center justify-between"
            >
              <h2 className="text-xl font-semibold text-gray-900">
                {filteredJobs.length} Jobs Found
              </h2>
              <div className="flex items-center space-x-2 text-gray-600">
                <span className="text-sm">Sorted by:</span>
                <select className="bg-transparent border-none focus:outline-none text-gray-900 font-medium">
                  <option>Most Relevant</option>
                  <option>Most Recent</option>
                  <option>Salary: High to Low</option>
                </select>
              </div>
            </motion.div>

            {/* Job Listings */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredJobs.map((job, index) => (
                  <motion.div
                    key={job.id}
                    variants={cardVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    whileHover="hover"
                    whileTap="tap"
                    transition={{ delay: index * 0.1 }}
                    className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 group cursor-pointer"
                  >
                    
                    {/* Job Header */}
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-start space-x-4">
                        <motion.div 
                          className="w-12 h-12 bg-gradient-to-r from-blue-100 to-purple-100 rounded-xl flex items-center justify-center"
                          whileHover={{ rotate: [0, -10, 10, 0] }}
                          transition={{ duration: 0.5 }}
                        >
                          <Building2 className="w-6 h-6 text-blue-600" />
                        </motion.div>
                        <div>
                          <h3 className="font-semibold text-gray-900 text-lg group-hover:text-blue-600 transition-colors duration-200">
                            {job.title}
                          </h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="font-medium text-gray-700">{job.company}</span>
                            {job.promoted && (
                              <motion.span 
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                className="bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-1 rounded-full text-xs font-semibold flex items-center"
                              >
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Promoted
                              </motion.span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            toggleSaveJob(job.id);
                          }}
                          className={`p-2 rounded-lg transition-all duration-200 ${
                            savedJobs.has(job.id)
                              ? 'bg-amber-50 text-amber-600'
                              : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                          }`}
                        >
                          <Bookmark className={`w-5 h-5 ${savedJobs.has(job.id) ? 'fill-current' : ''}`} />
                        </motion.button>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors duration-200"
                        >
                          <Share2 className="w-5 h-5" />
                        </motion.button>
                      </div>
                    </div>

                    {/* Job Details */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="w-4 h-4 mr-2" />
                        <span className="text-sm">{job.location}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="w-4 h-4 mr-2" />
                        <span className="text-sm">{job.type}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <DollarSign className="w-4 h-4 mr-2" />
                        <span className="text-sm">{job.salary}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="w-4 h-4 mr-2" />
                        <span className="text-sm">{job.applicants} applicants</span>
                      </div>
                    </div>

                    {/* Skills */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      {job.skills.map((skill, skillIndex) => (
                        <motion.span
                          key={skill}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: 0.6 + skillIndex * 0.1 }}
                          className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm font-medium"
                          whileHover={{ scale: 1.05, backgroundColor: "#dbeafe" }}
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>

                    {/* Job Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {job.description}
                    </p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-sm text-gray-500">{job.posted}</span>
                      <div className="flex space-x-3">
                        {job.easyApply ? (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-green-600 to-blue-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                          >
                            Easy Apply
                          </motion.button>
                        ) : (
                          <motion.button 
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                          >
                            Apply Now
                          </motion.button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>

          {/* Right Sidebar - Additional Info */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Profile Completion */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Profile Strength</h3>
              <div className="space-y-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Complete your profile</span>
                  <span className="font-semibold text-blue-600">75%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 1, delay: 0.5 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 h-2 rounded-full"
                  />
                </div>
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                >
                  Complete Profile
                </motion.button>
              </div>
            </motion.div>

            {/* Job Alerts */}
            <motion.div 
              variants={itemVariants}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
            >
              <h3 className="font-semibold text-gray-900 mb-4">Job Alerts</h3>
              <div className="space-y-3">
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-blue-50 rounded-xl border border-blue-200"
                >
                  <div className="font-semibold text-blue-900">Frontend Developer</div>
                  <div className="text-sm text-blue-700">San Francisco, CA • 12 new jobs</div>
                </motion.div>
                <motion.div 
                  whileHover={{ scale: 1.02 }}
                  className="p-3 bg-purple-50 rounded-xl border border-purple-200"
                >
                  <div className="font-semibold text-purple-900">UX Designer</div>
                  <div className="text-sm text-purple-700">Remote • 8 new jobs</div>
                </motion.div>
              </div>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full mt-4 border border-gray-300 text-gray-700 py-2 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200"
              >
                Create Alert
              </motion.button>
            </motion.div>

            {/* Premium Banner */}
            <motion.div 
              variants={itemVariants}
              whileHover={{ y: -2, scale: 1.01 }}
              className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-6 text-white"
            >
              <div className="flex items-center space-x-2 mb-3">
                <motion.div
                  animate={{ rotate: [0, 15, 0] }}
                  transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                >
                  <Star className="w-5 h-5" />
                </motion.div>
                <span className="font-semibold">Go Premium</span>
              </div>
              <p className="text-amber-100 text-sm mb-4">
                Get noticed by recruiters and access exclusive job opportunities.
              </p>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full bg-white text-amber-600 py-2 rounded-xl font-semibold hover:bg-amber-50 transition-colors duration-200"
              >
                Try Free for 1 Month
              </motion.button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JobsPage;