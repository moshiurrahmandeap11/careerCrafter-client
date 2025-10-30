import React, { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Building,
  Clock,
  Star,
  Target,
  Zap,
  Award,
  TrendingUp,
  Eye,
  Bookmark
} from "lucide-react";
import { useNavigate } from "react-router";
import axiosIntense from "../../../hooks/AxiosIntense/axiosIntense";
import useAuth from "../../../hooks/UseAuth/useAuth";

const TopJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (user?.email) {
      fetchUserProfile();
      fetchJobs();
    }
  }, [user?.email]);

  const fetchUserProfile = async () => {
    try {
      const response = await axiosIntense.get(`/users/email/${user.email}`);
      if (response.data && response.data.tags) {
        setUserSkills(response.data.tags);
      }
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await axiosIntense.get("/jobs");
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching jobs:", error);
      setError("Failed to load jobs");
    } finally {
      setLoading(false);
    }
  };

  const calculateMatchScore = (job) => {
    if (!userSkills.length || !job.requiredSkills) return 0;

    const jobSkills = job.requiredSkills || [];
    const matchedSkills = jobSkills.filter(skill =>
      userSkills.some(userSkill =>
        userSkill.toLowerCase().includes(skill.toLowerCase()) ||
        skill.toLowerCase().includes(userSkill.toLowerCase())
      )
    );

    return (matchedSkills.length / jobSkills.length) * 100;
  };

  const topJobs = useMemo(() => {
    if (!jobs.length) return [];

    const jobsWithScores = jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job)
    }));

    const matchedJobs = jobsWithScores
      .filter(job => job.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);

    if (matchedJobs.length > 0) {
      return matchedJobs.slice(0, 5);
    }

    return jobsWithScores
      .sort((a, b) => (b.applications || 0) - (a.applications || 0))
      .slice(0, 5);
  }, [jobs, userSkills]);

  const formatSalary = (min, max) => {
    return `$${min?.toLocaleString() || "0"} - $${max?.toLocaleString() || "0"}`;
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

  const getMatchColor = (score) => {
    if (score >= 80) return "text-green-700 bg-green-100 border-green-200";
    if (score >= 60) return "text-blue-700 bg-blue-100 border-blue-200";
    if (score >= 40) return "text-yellow-700 bg-yellow-100 border-yellow-200";
    return "text-gray-700 bg-gray-100 border-gray-200";
  };

  const getMatchIcon = (score) => {
    if (score >= 80) return <Zap className="w-3 h-3" />;
    if (score >= 60) return <TrendingUp className="w-3 h-3" />;
    if (score >= 40) return <Target className="w-3 h-3" />;
    return <Star className="w-3 h-3" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-7 bg-gray-200 rounded w-1/3 mb-6"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-2xl p-5 mb-4">
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-gray-200 rounded-2xl"></div>
                <div className="flex-1">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Jobs</h3>
          <p className="text-gray-600 text-sm mb-6">{error}</p>
          <button
            onClick={fetchJobs}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <Award className="w-5 h-5 text-white" />
            </div>
            {topJobs.some(job => job.matchScore >= 30)
              ? "Top Jobs For You"
              : "Featured Jobs"
            }
          </h2>
          <p className="text-gray-600 text-sm mt-2">
            {topJobs.some(job => job.matchScore >= 30)
              ? "Curated based on your skills and experience"
              : "Popular opportunities you might like"
            }
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{topJobs.length}</div>
          <div className="text-xs text-gray-500 font-medium">Opportunities</div>
        </div>
      </div>

      {/* Jobs List */}
      <div className="space-y-4">
        {topJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-300 cursor-pointer group bg-gradient-to-br from-white to-gray-50/50"
            onClick={() => navigate(`/job/${job._id}`)}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-start gap-4 flex-1">
                {/* Company Logo */}
                <div className="w-14 h-14 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-300">
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.company}
                      className="w-full h-full object-cover rounded-2xl"
                    />
                  ) : (
                    <Building className="w-7 h-7 text-blue-600" />
                  )}
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-bold text-gray-900 text-lg group-hover:text-blue-600 transition-colors line-clamp-1 pr-4">
                      {job.title}
                    </h3>
                    <button className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 p-2 hover:bg-gray-100 rounded-lg">
                      <Bookmark className="w-4 h-4 text-gray-400 hover:text-blue-600" />
                    </button>
                  </div>
                  
                  <div className="flex items-center gap-2 text-gray-600 text-sm mb-3">
                    <Building className="w-4 h-4" />
                    <span className="line-clamp-1 font-medium">{job.company || job.userName}</span>
                  </div>

                  {/* Location and Date */}
                  <div className="flex items-center gap-4 text-gray-500 text-sm mb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      <span className="text-xs">{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      <span className="text-xs">{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Score */}
              {job.matchScore >= 30 && (
                <div className={`px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-2 border ${getMatchColor(job.matchScore)}`}>
                  {getMatchIcon(job.matchScore)}
                  <span>{Math.round(job.matchScore)}% Match</span>
                </div>
              )}
            </div>

            {/* Salary and Skills */}
            <div className="flex flex-col gap-4 mb-4">
              <div className="flex items-center gap-2 bg-green-50 px-3 py-2 rounded-lg border border-green-200">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-700 text-sm">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="text-green-600 text-xs">/year</span>
              </div>

              {/* Top Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="flex gap-2">
                  {job.requiredSkills.slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-3 py-1.5 rounded-lg text-xs border font-medium ${
                        userSkills.some(userSkill =>
                          userSkill.toLowerCase().includes(skill.toLowerCase()) ||
                          skill.toLowerCase().includes(userSkill.toLowerCase())
                        )
                          ? "bg-blue-50 text-blue-700 border-blue-200"
                          : "bg-gray-50 text-gray-600 border-gray-200"
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                  {job.requiredSkills.length > 2 && (
                    <span className="px-3 py-1.5 rounded-lg text-xs bg-gray-100 text-gray-500 border border-gray-200 font-medium">
                      +{job.requiredSkills.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Job Type Badges */}
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg text-xs font-medium border border-blue-200">
                {job.jobType?.replace("-", " ") || "Full-time"}
              </span>
              {job.workMode === "remote" && (
                <span className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg text-xs font-medium border border-green-200">
                  Remote
                </span>
              )}
              {(job.featured || job.applications > 10) && (
                <span className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg text-xs font-medium border border-yellow-200 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              )}
              {job.matchScore >= 70 && (
                <span className="px-3 py-1.5 bg-purple-100 text-purple-700 rounded-lg text-xs font-medium border border-purple-200 flex items-center gap-1">
                  <Zap className="w-3 h-3" />
                  Great Match
                </span>
              )}
            </div>

            {/* Quick Actions */}
            <div className="flex gap-2 mt-4 pt-4 border-t border-gray-100">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/job/${job._id}`);
                }}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
              >
                <Briefcase className="w-4 h-4" />
                Apply Now
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  navigate(`/job/${job._id}`);
                }}
                className="px-4 py-2.5 bg-white border border-gray-300 hover:border-gray-400 text-gray-700 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 shadow-sm hover:shadow-md"
              >
                <Eye className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {topJobs.length === 0 && (
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Briefcase className="w-8 h-8 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-3">No Jobs Available</h3>
          <p className="text-gray-600 text-sm mb-6 max-w-sm mx-auto">
            There are currently no job opportunities matching your criteria. Try adjusting your preferences or check back later.
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Browse All Jobs
          </button>
        </div>
      )}

      {/* Footer CTA */}
      {topJobs.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <button
            onClick={() => navigate('/jobs')}
            className="w-full bg-gradient-to-br from-gray-50 to-white hover:from-gray-100 hover:to-gray-50 text-gray-700 py-3.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center justify-center gap-3 border border-gray-200 hover:border-gray-300 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <TrendingUp className="w-5 h-5 text-blue-600" />
            <span className="font-semibold">View All Job Opportunities</span>
            <span className="bg-blue-600 text-white px-2 py-1 rounded-lg text-xs font-bold">
              {jobs.length}+
            </span>
          </button>
        </div>
      )}
    </div>
  );
};

export default TopJobs;