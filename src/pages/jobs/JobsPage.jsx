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
  Star,
  Users,
  Zap,
  TrendingUp,
  Eye,
  Target,
  ChevronDown,
  X,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import { useNavigate } from "react-router";
import { Helmet } from "react-helmet-async";
import Loader from "../../components/sharedItems/Loader/Loader";

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
  const [viewMode, setViewMode] = useState("grid");
  const navigate = useNavigate();

  // Industry options
  const industryOptions = [
    "Technology",
    "Healthcare",
    "Finance",
    "Education",
    "Manufacturing",
    "Retail",
    "Hospitality",
    "Construction",
    "Transportation",
    "Energy",
    "Entertainment",
    "Marketing",
    "Sales",
    "Design",
    "Human Resources",
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
      "full-time": "bg-green-100 text-green-800 border border-green-200",
      "part-time": "bg-blue-100 text-blue-800 border border-blue-200",
      contract: "bg-orange-100 text-orange-800 border border-orange-200",
      freelance: "bg-purple-100 text-purple-800 border border-purple-200",
      internship: "bg-pink-100 text-pink-800 border border-pink-200",
    };
    return colors[type] || "bg-gray-100 text-gray-800 border border-gray-200";
  };

  const getExperienceColor = (level) => {
    const colors = {
      entry: "bg-green-100 text-green-800 border border-green-200",
      mid: "bg-blue-100 text-blue-800 border border-blue-200",
      senior: "bg-purple-100 text-purple-800 border border-purple-200",
      executive: "bg-red-100 text-red-800 border border-red-200",
    };
    return colors[level] || "bg-gray-100 text-gray-800 border border-gray-200";
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
    return <Loader />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center bg-white p-6 rounded-lg border border-gray-300 max-w-md w-full">
          <div className="w-12 h-12 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Briefcase className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Error Loading Jobs
          </h3>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={fetchJobs}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 w-full"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white max-w-6xl mx-auto lg:px-3">
      <Helmet>
        <title>Browse Jobs - Career Crafter</title>
        <meta
          name="description"
          content="Discover job opportunities from top companies. Find remote jobs, on-site positions, and freelance work."
        />
      </Helmet>

      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-6">
        {/* Header */}
        <div className="mb-6">
          <div className="text-center mb-6">
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-3">
              Find Your Next Job
            </h1>
            <p className="text-gray-600 text-sm sm:text-base">
              Explore {jobs.length} opportunities from top companies
            </p>
          </div>

        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-lg p-4 border border-gray-300 mb-6">
          <div className="space-y-4">
            {/* Search Row */}
            <div className="grid grid-cols-1 lg:grid-cols-6 gap-3">
              <div className="lg:col-span-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Job title, company, or keywords..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <input
                    type="text"
                    placeholder="Location"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                  />
                </div>
              </div>

              <div className="flex gap-2">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                >
                  <option value="newest">Newest</option>
                  <option value="oldest">Oldest</option>
                  <option value="salary-high">Salary: High to Low</option>
                  <option value="salary-low">Salary: Low to High</option>
                  <option value="applications">Most Popular</option>
                </select>

                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`px-3 py-2 rounded-lg border transition-colors duration-200 flex items-center gap-1 text-sm ${
                    showAdvancedFilters
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <Filter className="w-4 h-4" />
                  <span className="hidden sm:inline">Filters</span>
                </button>
              </div>
            </div>

            {/* Advanced Filters */}
            <AnimatePresence>
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="grid grid-cols-2  lg:grid-cols-4 gap-3 pt-4 border-t border-gray-200"
                >
                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Salary
                    </label>
                    <select
                      value={salaryFilter}
                      onChange={(e) => setSalaryFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">All Salaries</option>
                      <option value="under-50k">Under $50k</option>
                      <option value="50k-100k">$50k - $100k</option>
                      <option value="100k-150k">$100k - $150k</option>
                      <option value="over-150k">Over $150k</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Job Type
                    </label>
                    <select
                      value={jobTypeFilter}
                      onChange={(e) => setJobTypeFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">All Types</option>
                      <option value="full-time">Full Time</option>
                      <option value="part-time">Part Time</option>
                      <option value="contract">Contract</option>
                      <option value="freelance">Freelance</option>
                      <option value="internship">Internship</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Experience
                    </label>
                    <select
                      value={experienceFilter}
                      onChange={(e) => setExperienceFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">All Levels</option>
                      <option value="entry">Entry Level</option>
                      <option value="mid">Mid Level</option>
                      <option value="senior">Senior Level</option>
                      <option value="executive">Executive</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-gray-700 mb-1">
                      Industry
                    </label>
                    <select
                      value={industryFilter}
                      onChange={(e) => setIndustryFilter(e.target.value)}
                      className="w-full px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
                    >
                      <option value="">All Industries</option>
                      {industryOptions.map((industry) => (
                        <option key={industry} value={industry.toLowerCase()}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Active Filters */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1">
                {searchTerm && (
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs flex items-center">
                    Search: {searchTerm}
                    <button
                      onClick={() => setSearchTerm("")}
                      className="ml-1 hover:text-blue-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {location && (
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs flex items-center">
                    Location: {location}
                    <button
                      onClick={() => setLocation("")}
                      className="ml-1 hover:text-green-600"
                    >
                      ×
                    </button>
                  </span>
                )}
                {salaryFilter && (
                  <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs flex items-center">
                    Salary: {salaryFilter}
                    <button
                      onClick={() => setSalaryFilter("")}
                      className="ml-1 hover:text-purple-600"
                    >
                      ×
                    </button>
                  </span>
                )}
              </div>

              {(searchTerm || location || salaryFilter || jobTypeFilter || experienceFilter || industryFilter) && (
                <button
                  onClick={clearFilters}
                  className="text-gray-600 hover:text-gray-800 text-xs font-medium transition-colors duration-200 flex items-center gap-1"
                >
                  <X className="w-3 h-3" />
                  Clear All
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs and View Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
          <div className="flex border-b border-gray-300 overflow-x-auto">
            <button
              onClick={() => setActiveTab("all")}
              className={`px-3 py-2 font-medium text-xs border-b-2 transition-colors duration-200 whitespace-nowrap flex items-center gap-1 ${
                activeTab === "all"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Briefcase className="w-3 h-3" />
              All ({jobs.length})
            </button>
            <button
              onClick={() => setActiveTab("featured")}
              className={`px-3 py-2 font-medium text-xs border-b-2 transition-colors duration-200 whitespace-nowrap flex items-center gap-1 ${
                activeTab === "featured"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Star className="w-3 h-3" />
              Featured ({jobStats.featuredJobs})
            </button>
            <button
              onClick={() => setActiveTab("saved")}
              className={`px-3 py-2 font-medium text-xs border-b-2 transition-colors duration-200 whitespace-nowrap flex items-center gap-1 ${
                activeTab === "saved"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Bookmark className="w-3 h-3" />
              Saved ({savedJobs.length})
            </button>
            <button
              onClick={() => setActiveTab("applied")}
              className={`px-3 py-2 font-medium text-xs border-b-2 transition-colors duration-200 whitespace-nowrap flex items-center gap-1 ${
                activeTab === "applied"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Target className="w-3 h-3" />
              Applied ({appliedJobs.length})
            </button>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-1 rounded transition-colors duration-200 ${
                viewMode === "grid"
                  ? "bg-white text-gray-900 shadow-sm"
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
              className={`p-1 rounded transition-colors duration-200 ${
                viewMode === "list"
                  ? "bg-white text-gray-900 shadow-sm"
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
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-600 text-sm">
            Showing <span className="font-semibold text-gray-900">{filteredJobs.length}</span> of{" "}
            <span className="font-semibold text-gray-900">{jobs.length}</span> jobs
            {searchTerm && ` for "${searchTerm}"`}
          </p>
        </div>

        {/* Jobs Grid/List */}
        <div className={`grid gap-4 ${
          viewMode === "grid"
            ? "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            : "grid-cols-1"
        }`}>
          <AnimatePresence>
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                className={`bg-white rounded-lg border border-gray-300 hover:shadow-md transition-shadow duration-200 cursor-pointer ${
                  viewMode === "list" ? "flex flex-col sm:flex-row" : ""
                }`}
                onClick={() => navigate(`/job/${job._id}`)}
              >
                {/* Job Image/Featured Badge */}
                <div className={`relative ${viewMode === "list" ? "sm:w-32 flex-shrink-0" : ""}`}>
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.title}
                      className={`w-full object-cover ${
                        viewMode === "list" ? "sm:h-32 h-40" : "h-40"
                      }`}
                    />
                  ) : (
                    <div
                      className={`bg-blue-100 flex items-center justify-center ${
                        viewMode === "list" ? "sm:h-32 h-40" : "h-40"
                      }`}
                    >
                      <Building className="w-8 h-8 text-blue-600" />
                    </div>
                  )}

                  {/* Featured Badge */}
                  {(job.featured || job.applications > 10) && (
                    <div className="absolute top-2 left-2 bg-yellow-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                      <Star className="w-3 h-3" />
                      Featured
                    </div>
                  )}

                  {/* Save Button */}
                  <button
                    onClick={(e) => toggleSaveJob(job._id, e)}
                    className={`absolute top-2 right-2 p-1 rounded transition-colors duration-200 ${
                      savedJobs.includes(job._id)
                        ? "bg-red-500 text-white"
                        : "bg-white/80 text-gray-600 hover:bg-white hover:text-red-500"
                    }`}
                  >
                    <Bookmark
                      className={`w-3 h-3 ${
                        savedJobs.includes(job._id) ? "fill-current" : ""
                      }`}
                    />
                  </button>
                </div>

                {/* Job Content */}
                <div className="p-4 flex-1">
                  <div className="flex flex-col h-full">
                    {/* Header */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h3 className="font-bold text-gray-900 mb-1 line-clamp-2 hover:text-blue-600 transition-colors text-sm sm:text-base">
                            {job.title}
                          </h3>
                          <div className="flex items-center gap-1 text-gray-600 mb-2 text-xs">
                            <Building className="w-3 h-3" />
                            <span className="font-medium">
                              {job.company || job.userName}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Job Meta */}
                      <div className="flex flex-wrap gap-1 mb-3">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getJobTypeColor(
                            job.jobType
                          )}`}
                        >
                          {job.jobType?.replace("-", " ") || "Full-time"}
                        </span>
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getExperienceColor(
                            job.experienceLevel
                          )}`}
                        >
                          {job.experienceLevel || "Mid Level"}
                        </span>
                        {job.workMode === "remote" && (
                          <span className="px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800 border border-green-200">
                            Remote
                          </span>
                        )}
                      </div>

                      {/* Location and Date */}
                      <div className="flex flex-wrap items-center gap-3 text-gray-600 mb-3 text-xs">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" />
                          <span>{job.location || "Remote"}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          <span>{formatDate(job.createdAt)}</span>
                        </div>
                      </div>

                      {/* Salary */}
                      <div className="flex items-center gap-1 mb-3">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="font-bold text-green-600 text-sm">
                          {formatSalary(job.salaryMin, job.salaryMax)}
                        </span>
                        <span className="text-xs text-gray-500">/ year</span>
                      </div>

                      {/* Skills */}
                      {job.requiredSkills && job.requiredSkills.length > 0 && (
                        <div className="mb-3">
                          <div className="flex flex-wrap gap-1">
                            {job.requiredSkills
                              .slice(0, 3)
                              .map((skill, idx) => (
                                <span
                                  key={idx}
                                  className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-100"
                                >
                                  {skill}
                                </span>
                              ))}
                            {job.requiredSkills.length > 3 && (
                              <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs border border-gray-200">
                                +{job.requiredSkills.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
                      <button
                        onClick={(e) => handleApply(job._id, e)}
                        className="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
                      >
                        <Target className="w-3 h-3" />
                        {appliedJobs.includes(job._id) ? "Applied" : "Apply Now"}
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          navigate(`/job/${job._id}`);
                        }}
                        className="px-3 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-1 text-sm"
                      >
                        <Eye className="w-3 h-3" />
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Empty State */}
        {filteredJobs.length === 0 && (
          <div className="text-center py-12 bg-white rounded-lg border border-gray-300">
            <div className="w-16 h-16 bg-blue-100 rounded-full mx-auto mb-4 flex items-center justify-center">
              <Search className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              {activeTab === "saved"
                ? "No Saved Jobs"
                : activeTab === "applied"
                ? "No Applications"
                : activeTab === "featured"
                ? "No Featured Jobs"
                : "No Jobs Found"}
            </h3>
            <p className="text-gray-600 mb-6 max-w-sm mx-auto text-sm">
              {activeTab === "saved"
                ? "Save jobs that interest you to find them easily later."
                : activeTab === "applied"
                ? "Apply to jobs to see them here."
                : activeTab === "featured"
                ? "Check back later for featured opportunities."
                : "Try adjusting your search or filters to find more jobs."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              {activeTab === "saved" ? (
                <button
                  onClick={() => setActiveTab("all")}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                >
                  Browse Jobs
                </button>
              ) : (
                <div className="flex gap-3 justify-center flex-col md:flex-row px-3">
                  <button
                    onClick={clearFilters}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700 transition-colors duration-200"
                  >
                    Clear Filters
                  </button>
                  <button
                    onClick={() => setShowAdvancedFilters(true)}
                    className="bg-white text-gray-700 px-6 py-2 rounded-lg font-medium border border-gray-300 hover:bg-gray-50 transition-colors duration-200"
                  >
                    Adjust Filters
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default JobsPage;