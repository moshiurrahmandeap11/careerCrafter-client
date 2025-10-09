import React, { useEffect, useState, useMemo } from "react";
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
  MapPinIcon,
  Star,
  Users,
  Zap,
  TrendingUp,
  Eye,
  Share2,
  BookOpen,
  Target,
  ChevronDown,
  X,
  Sparkles,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";

const JobsPage = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [location, setLocation] = useState("");
  const [salaryFilter, setSalaryFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [jobTypeFilter, setJobTypeFilter] = useState("");
  const [experienceFilter, setExperienceFilter] = useState("");
  const [industryFilter, setIndustryFilter] = useState("");
  const [savedJobs, setSavedJobs] = useState([]);
  const [appliedJobs, setAppliedJobs] = useState([]);
  const [activeTab, setActiveTab] = useState("all");
  const [sortBy, setSortBy] = useState("newest");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // 'grid' or 'list'
  const [selectedJob, setSelectedJob] = useState(null);
  const navigate = useNavigate();

  // Industry options
  const industryOptions = [
    "technology",
    "healthcare",
    "finance",
    "education",
    "manufacturing",
    "retail",
    "hospitality",
    "construction",
    "transportation",
    "energy",
    "entertainment",
    "marketing",
    "sales",
    "design",
    "human-resources",
  ];

  useEffect(() => {
    fetchJobs();
    fetchSavedJobs();
    fetchAppliedJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [
    jobs,
    searchTerm,
    location,
    salaryFilter,
    dateFilter,
    jobTypeFilter,
    experienceFilter,
    industryFilter,
    activeTab,
    sortBy,
  ]);

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosIntense.get("/jobs");
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const fetchSavedJobs = async () => {
    try {
      const saved = JSON.parse(localStorage.getItem("savedJobs") || "[]");
      setSavedJobs(saved);
    } catch (error) {
      console.error("Error fetching saved jobs:", error);
    }
  };

  const fetchAppliedJobs = async () => {
    try {
      const applied = JSON.parse(localStorage.getItem("appliedJobs") || "[]");
      setAppliedJobs(applied);
    } catch (error) {
      console.error("Error fetching applied jobs:", error);
    }
  };

  const filterJobs = () => {
    let filtered = [...jobs];

    // Search filter
    if (searchTerm) {
      filtered = filtered.filter(
        (job) =>
          job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.company?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          job.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (job.requiredSkills || []).some((skill) =>
            skill.toLowerCase().includes(searchTerm.toLowerCase())
          )
      );
    }

    // Location filter
    if (location) {
      filtered = filtered.filter((job) =>
        job.location?.toLowerCase().includes(location.toLowerCase())
      );
    }

    // Salary filter
    if (salaryFilter) {
      filtered = filtered.filter((job) => {
        const avgSalary = (job.salaryMin + job.salaryMax) / 2;
        switch (salaryFilter) {
          case "under-50k":
            return avgSalary < 50000;
          case "50k-100k":
            return avgSalary >= 50000 && avgSalary <= 100000;
          case "100k-150k":
            return avgSalary > 100000 && avgSalary <= 150000;
          case "over-150k":
            return avgSalary > 150000;
          default:
            return true;
        }
      });
    }

    // Date filter
    if (dateFilter) {
      const now = new Date();
      filtered = filtered.filter((job) => {
        const jobDate = new Date(job.createdAt);
        const diffTime = Math.abs(now - jobDate);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        switch (dateFilter) {
          case "24h":
            return diffDays <= 1;
          case "7d":
            return diffDays <= 7;
          case "30d":
            return diffDays <= 30;
          default:
            return true;
        }
      });
    }

    // Job Type filter
    if (jobTypeFilter) {
      filtered = filtered.filter((job) => job.jobType === jobTypeFilter);
    }

    // Experience filter
    if (experienceFilter) {
      filtered = filtered.filter(
        (job) => job.experienceLevel === experienceFilter
      );
    }

    // Industry filter
    if (industryFilter) {
      filtered = filtered.filter((job) => job.industry === industryFilter);
    }

    // Tab filter
    if (activeTab === "saved") {
      filtered = filtered.filter((job) => savedJobs.includes(job._id));
    } else if (activeTab === "applied") {
      filtered = filtered.filter((job) => appliedJobs.includes(job._id));
    } else if (activeTab === "featured") {
      filtered = filtered.filter(
        (job) => job.featured || job.applications > 10
      );
    }

    // Sort jobs
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "newest":
          return new Date(b.createdAt) - new Date(a.createdAt);
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "salary-high":
          return (
            (b.salaryMax + b.salaryMin) / 2 - (a.salaryMax + a.salaryMin) / 2
          );
        case "salary-low":
          return (
            (a.salaryMax + a.salaryMin) / 2 - (b.salaryMax + b.salaryMin) / 2
          );
        case "applications":
          return (b.applications || 0) - (a.applications || 0);
        default:
          return 0;
      }
    });

    setFilteredJobs(filtered);
  };

  const toggleSaveJob = (jobId, e) => {
    if (e) e.stopPropagation();
    const newSavedJobs = savedJobs.includes(jobId)
      ? savedJobs.filter((id) => id !== jobId)
      : [...savedJobs, jobId];

    setSavedJobs(newSavedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(newSavedJobs));
  };

  const handleApply = (jobId, e) => {
    if (e) e.stopPropagation();
    const newAppliedJobs = [...appliedJobs, jobId];
    setAppliedJobs(newAppliedJobs);
    localStorage.setItem("appliedJobs", JSON.stringify(newAppliedJobs));
    // Navigate to job details or show success message
    navigate(`/job/${jobId}`);
  };

  const formatSalary = (min, max) => {
    return `$${min?.toLocaleString() || "0"} - $${
      max?.toLocaleString() || "0"
    }`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return "Today";
    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const clearFilters = () => {
    setSearchTerm("");
    setLocation("");
    setSalaryFilter("");
    setDateFilter("");
    setJobTypeFilter("");
    setExperienceFilter("");
    setIndustryFilter("");
  };

  const getJobTypeColor = (type) => {
    const colors = {
      "full-time": "bg-green-100 text-green-800",
      "part-time": "bg-blue-100 text-blue-800",
      contract: "bg-orange-100 text-orange-800",
      freelance: "bg-purple-100 text-purple-800",
      internship: "bg-pink-100 text-pink-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  const getExperienceColor = (level) => {
    const colors = {
      entry: "bg-green-100 text-green-800",
      mid: "bg-blue-100 text-blue-800",
      senior: "bg-purple-100 text-purple-800",
      executive: "bg-red-100 text-red-800",
    };
    return colors[level] || "bg-gray-100 text-gray-800";
  };

  // Memoized job statistics
  const jobStats = useMemo(() => {
    const totalJobs = jobs.length;
    const featuredJobs = jobs.filter(
      (job) => job.featured || job.applications > 10
    ).length;
    const remoteJobs = jobs.filter((job) => job.workMode === "remote").length;
    const highSalaryJobs = jobs.filter(
      (job) => (job.salaryMin + job.salaryMax) / 2 > 100000
    ).length;

    return { totalJobs, featuredJobs, remoteJobs, highSalaryJobs };
  }, [jobs]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity },
            }}
            className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center shadow-lg"
          >
            <Briefcase className="w-10 h-10 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600 text-lg font-medium"
          >
            Discovering amazing opportunities...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center bg-white p-8 rounded-2xl shadow-lg border border-gray-200 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Briefcase className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Jobs
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={fetchJobs}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50">
      <Helmet>
        <title>Browse Jobs - AI-Powered Job Matching | Career Crafter</title>
        <meta
          name="description"
          content="Discover thousands of job opportunities with AI-powered matching. Find remote jobs, on-site positions, and freelance work tailored to your skills."
        />
        <meta
          name="keywords"
          content="job search, AI job matching, remote jobs, hiring, career opportunities, job listings"
        />
        <link
          rel="canonical"
          href="https://careercrafter.moshiurrahman.online/jobs"
        />
      </Helmet>
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header with Stats */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="text-center mb-8">
            <motion.h1
              className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              Discover Your Next Career Move
            </motion.h1>
            <motion.p
              className="text-xl text-gray-600 max-w-3xl mx-auto"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              Explore {jobs.length} curated opportunities from top companies
              worldwide
            </motion.p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <motion.div
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 text-center"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                <Briefcase className="w-6 h-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {jobStats.totalJobs}
              </div>
              <div className="text-sm text-gray-600">Total Jobs</div>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 text-center"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                <Star className="w-6 h-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {jobStats.featuredJobs}
              </div>
              <div className="text-sm text-gray-600">Featured</div>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 text-center"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-green-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                <MapPin className="w-6 h-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {jobStats.remoteJobs}
              </div>
              <div className="text-sm text-gray-600">Remote</div>
            </motion.div>

            <motion.div
              className="bg-white p-4 rounded-2xl shadow-sm border border-gray-200 text-center"
              whileHover={{ scale: 1.05, y: -2 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl mx-auto mb-2 flex items-center justify-center">
                <DollarSign className="w-6 h-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">
                {jobStats.highSalaryJobs}
              </div>
              <div className="text-sm text-gray-600">High Paying</div>
            </motion.div>
          </div>
        </motion.div>

        {/* Enhanced Search and Filters */}
        <motion.div
          className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Job title, company, skills, or keywords..."
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

            {/* Advanced Filters Toggle */}
            <div className="flex gap-2">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
                <option value="salary-high">Salary: High to Low</option>
                <option value="salary-low">Salary: Low to High</option>
                <option value="applications">Most Popular</option>
              </select>

              <motion.button
                onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                className={`px-4 py-3 rounded-xl border transition-all duration-200 flex items-center gap-2 ${
                  showAdvancedFilters
                    ? "bg-blue-600 text-white border-blue-600"
                    : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                }`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-4 h-4" />
                <span className="hidden sm:inline">Filters</span>
              </motion.button>
            </div>
          </div>

          {/* Advanced Filters */}
          <AnimatePresence>
            {showAdvancedFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200"
              >
                {/* Salary Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Salary Range
                  </label>
                  <select
                    value={salaryFilter}
                    onChange={(e) => setSalaryFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Salaries</option>
                    <option value="under-50k">Under $50k</option>
                    <option value="50k-100k">$50k - $100k</option>
                    <option value="100k-150k">$100k - $150k</option>
                    <option value="over-150k">Over $150k</option>
                  </select>
                </div>

                {/* Job Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Job Type
                  </label>
                  <select
                    value={jobTypeFilter}
                    onChange={(e) => setJobTypeFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Types</option>
                    <option value="full-time">Full Time</option>
                    <option value="part-time">Part Time</option>
                    <option value="contract">Contract</option>
                    <option value="freelance">Freelance</option>
                    <option value="internship">Internship</option>
                  </select>
                </div>

                {/* Experience Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Experience Level
                  </label>
                  <select
                    value={experienceFilter}
                    onChange={(e) => setExperienceFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Levels</option>
                    <option value="entry">Entry Level</option>
                    <option value="mid">Mid Level</option>
                    <option value="senior">Senior Level</option>
                    <option value="executive">Executive</option>
                  </select>
                </div>

                {/* Industry Filter */}
                <div className="md:col-span-3">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Industry
                  </label>
                  <select
                    value={industryFilter}
                    onChange={(e) => setIndustryFilter(e.target.value)}
                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">All Industries</option>
                    {industryOptions.map((industry) => (
                      <option key={industry} value={industry}>
                        {industry.charAt(0).toUpperCase() +
                          industry.slice(1).replace("-", " ")}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Filters */}
          <div className="flex flex-wrap items-center justify-between gap-4 mt-4">
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Search: {searchTerm}
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 hover:text-blue-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {location && (
                <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Location: {location}
                  <button
                    onClick={() => setLocation("")}
                    className="ml-2 hover:text-green-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {salaryFilter && (
                <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Salary: {salaryFilter}
                  <button
                    onClick={() => setSalaryFilter("")}
                    className="ml-2 hover:text-purple-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {jobTypeFilter && (
                <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Type: {jobTypeFilter}
                  <button
                    onClick={() => setJobTypeFilter("")}
                    className="ml-2 hover:text-orange-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {experienceFilter && (
                <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Experience: {experienceFilter}
                  <button
                    onClick={() => setExperienceFilter("")}
                    className="ml-2 hover:text-red-600"
                  >
                    ×
                  </button>
                </span>
              )}
              {industryFilter && (
                <span className="bg-indigo-100 text-indigo-800 px-3 py-1 rounded-full text-sm flex items-center">
                  Industry: {industryFilter}
                  <button
                    onClick={() => setIndustryFilter("")}
                    className="ml-2 hover:text-indigo-600"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>

            {(searchTerm ||
              location ||
              salaryFilter ||
              jobTypeFilter ||
              experienceFilter ||
              industryFilter) && (
              <button
                onClick={clearFilters}
                className="text-gray-600 hover:text-gray-800 text-sm font-medium transition-colors duration-200 flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear All
              </button>
            )}
          </div>
        </motion.div>

        {/* Enhanced Tabs and View Controls */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
          <div className="flex border-b border-gray-200 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="w-4 h-4" />
              All Jobs ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === "featured"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Star className="w-4 h-4" />
              Featured ({jobStats.featuredJobs})
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === "saved"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bookmark className="w-4 h-4" />
              Saved ({savedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab("applied")}
              className={`px-4 py-3 font-medium text-sm border-b-2 transition-all duration-200 whitespace-nowrap flex items-center gap-2 ${
                activeTab === "applied"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Target className="w-4 h-4" />
              Applied ({appliedJobs.length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-2 bg-white rounded-xl p-1 border border-gray-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "grid"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
                <div className="bg-current rounded-sm"></div>
              </div>
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-all duration-200 ${
                viewMode === "list"
                  ? "bg-blue-600 text-white"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <div className="w-4 h-4 flex flex-col gap-0.5">
                <div className="bg-current h-1 rounded-sm"></div>
                <div className="bg-current h-1 rounded-sm"></div>
                <div className="bg-current h-1 rounded-sm"></div>
              </div>
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="flex items-center justify-between mb-6">
          <p className="text-gray-600">
            Showing{" "}
            <span className="font-semibold text-gray-900">
              {filteredJobs.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-gray-900">{jobs.length}</span>{" "}
            jobs
            {searchTerm && ` for "${searchTerm}"`}
          </p>

          {filteredJobs.length > 0 && (
            <div className="flex items-center gap-2 text-sm text-gray-600">
              <Sparkles className="w-4 h-4" />
              <span>Sorted by {sortBy.replace("-", " ")}</span>
            </div>
          )}
        </div>

        {/* Jobs Grid/List */}
        <motion.div
          className={`grid gap-6 ${
            viewMode === "grid"
              ? "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3"
              : "grid-cols-1"
          }`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          layout
        >
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-2xl overflow-hidden border border-gray-200 hover:shadow-xl transition-all duration-300 group cursor-pointer ${
                  viewMode === "list" ? "flex" : ""
                }`}
                onClick={() => navigate(`/job/${job._id}`)}
              >
                {/* Job Image/Featured Badge */}
                <div
                  className={`relative ${
                    viewMode === "list" ? "w-32 flex-shrink-0" : ""
                  }`}
                >
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.title}
                      className={`w-full object-cover ${
                        viewMode === "list" ? "h-32" : "h-48"
                      } group-hover:scale-105 transition-transform duration-300`}
                    />
                  ) : (
                    <div
                      className={`bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center ${
                        viewMode === "list" ? "h-32" : "h-48"
                      }`}
                    >
                      <Building className="w-8 h-8 text-white opacity-80" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {(job.featured || job.applications > 10) && (
                    <div className="absolute top-3 left-3 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-2 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={(e) => toggleSaveJob(job._id, e)}
                    className={`absolute top-3 right-3 p-2 rounded-full transition-all duration-200 ${
                      savedJobs.includes(job._id)
                        ? "bg-red-500 text-white shadow-lg"
                        : "bg-white/90 text-gray-600 hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <Bookmark
                      className={`w-4 h-4 ${
                        savedJobs.includes(job._id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Job Content */}
                <div className="p-6 flex-1">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="text-xl font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
                            <Building className="w-4 h-4" />
                            <span className="font-medium">
                              {job.company || job.userName}
                            </span>
                            {job.verified && (
                              <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                                <Zap className="w-2 h-2 text-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Job Meta */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getJobTypeColor(
                            job.jobType
                          )}`}
                        >
                          {job.jobType?.replace("-", " ") || "Full-time"}
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getExperienceColor(
                            job.experienceLevel
                          )}`}
                        >
                          {job.experienceLevel || "Mid Level"}
                        </span>
                        {job.workMode === "remote" && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            Remote
                          </span>
                        )}
                        {job.industry && (
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                            {job.industry}
                          </span>
                        )}
                      </div>

                      {/* Location and Date */}
                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                        {job.applications > 0 && (
                          <div className="flex items-center gap-1">
                            <Users className="w-4 h-4" />
                            <span>{job.applications} applicants</span>
                          </div>
                        )}
                      </div>

                      {/* Salary */}
                      <div className="flex items-center gap-2 mb-4">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-600 text-lg">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="text-sm text-gray-500">/ year</span>
                      </div>

                      {/* Description */}
                      <p className="text-gray-600 line-clamp-2 mb-4 text-sm">
                        {job.description}
                      </p>

                      {/* Skills */}
                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="mb-4">
                          <div className="flex flex-wrap gap-1">
                            {job.requiredSkills
                              .slice(0, 4)
                              .map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                                >
                                  {skill}
                                </span>
                              ))}
                            {job.requiredSkills.length > 4 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                                +{job.requiredSkills.length - 4} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-200">
                      <motion.button
                        onClick={(e) => handleApply(job._id, e)}
                        className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md flex items-center justify-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Target className="w-4 h-4" />
                        {appliedJobs.includes(job._id)
                          ? "Applied"
                          : "Apply Now"}
                      </motion.button>

                      <motion.button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/job/${job._id}`);
                        }}
                        className="px-4 py-3 border border-gray-300 text-gray-700 rounded-xl font-semibold hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Eye className="w-4 h-4" />
                        Details
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        {/* Enhanced Empty State */}
        {filteredJobs.length === 0 && (
          <motion.div
            className="text-center py-20 bg-white rounded-2xl border border-gray-200 shadow-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="w-24 h-24 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full mx-auto mb-6 flex items-center justify-center">
              <Search className="w-10 h-10 text-blue-600" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3">
              {activeTab === "saved"
                ? "No Saved Jobs Yet"
                : activeTab === "applied"
                ? "No Applications Yet"
                : activeTab === "featured"
                ? "No Featured Jobs"
                : "No Jobs Found"}
            </h3>
            <p className="text-gray-600 mb-8 max-w-md mx-auto text-lg">
              {activeTab === "saved"
                ? "Start building your collection by saving jobs that catch your eye."
                : activeTab === "applied"
                ? "Apply to jobs that match your skills and interests."
                : activeTab === "featured"
                ? "Check back later for featured opportunities."
                : "Try adjusting your search criteria or explore different filters."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {activeTab === "saved" ? (
                <motion.button
                  onClick={() => setActiveTab("all")}
                  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Explore Jobs
                </motion.button>
              ) : (
                <>
                  <motion.button
                    onClick={clearFilters}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-md"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Clear All Filters
                  </motion.button>
                  <motion.button
                    onClick={() => setShowAdvancedFilters(true)}
                    className="bg-white text-gray-700 px-8 py-3 rounded-xl font-semibold border border-gray-300 hover:bg-gray-50 transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Adjust Filters
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;
