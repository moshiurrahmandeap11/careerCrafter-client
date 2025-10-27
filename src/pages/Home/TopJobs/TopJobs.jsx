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
  TrendingUp
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
  const {user} = useAuth();

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

  // Calculate job match score based on user skills
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

  // Get top jobs based on skill match or top 5 jobs
  const topJobs = useMemo(() => {
    if (!jobs.length) return [];

    // Calculate match scores for all jobs
    const jobsWithScores = jobs.map(job => ({
      ...job,
      matchScore: calculateMatchScore(job)
    }));

    // Filter jobs with at least 30% match
    const matchedJobs = jobsWithScores
      .filter(job => job.matchScore >= 30)
      .sort((a, b) => b.matchScore - a.matchScore);

    // If we have matched jobs, return top 5 matched jobs
    if (matchedJobs.length > 0) {
      return matchedJobs.slice(0, 5);
    }

    // If no matches, return top 5 jobs by applications or featured
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
    if (score >= 80) return "text-green-600 bg-green-100";
    if (score >= 60) return "text-blue-600 bg-blue-100";
    if (score >= 40) return "text-yellow-600 bg-yellow-100";
    return "text-gray-600 bg-gray-100";
  };

  const getMatchIcon = (score) => {
    if (score >= 80) return <Zap className="w-3 h-3" />;
    if (score >= 60) return <TrendingUp className="w-3 h-3" />;
    if (score >= 40) return <Target className="w-3 h-3" />;
    return <Star className="w-3 h-3" />;
  };

  if (loading) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-gray-200 rounded-xl p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              </div>
              <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div className="text-center py-8">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Jobs</h3>
          <p className="text-gray-600 text-sm mb-4">{error}</p>
          <button
            onClick={fetchJobs}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            {topJobs.some(job => job.matchScore >= 30) 
              ? "Top Jobs For You" 
              : "Featured Jobs"
            }
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {topJobs.some(job => job.matchScore >= 30)
              ? "Based on your skills and experience"
              : "Popular opportunities you might like"
            }
          </p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{topJobs.length}</div>
          <div className="text-xs text-gray-500">Opportunities</div>
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
            className="border border-gray-200 rounded-xl p-4 hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer group"
            onClick={() => navigate(`/job/${job._id}`)}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-start gap-3 flex-1">
                {/* Company Logo */}
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  {job.image ? (
                    <img
                      src={job.image}
                      alt={job.company}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <Building className="w-6 h-6 text-blue-600" />
                  )}
                </div>

                {/* Job Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-gray-900 text-sm group-hover:text-blue-600 transition-colors line-clamp-1">
                    {job.title}
                  </h3>
                  <div className="flex items-center gap-1 text-gray-600 text-xs mt-1">
                    <Building className="w-3 h-3" />
                    <span className="line-clamp-1">{job.company || job.userName}</span>
                  </div>
                  
                  {/* Location and Date */}
                  <div className="flex items-center gap-3 text-gray-500 text-xs mt-2">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3" />
                      <span>{job.location || "Remote"}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(job.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Match Score */}
              {job.matchScore >= 30 && (
                <div className={`px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getMatchColor(job.matchScore)}`}>
                  {getMatchIcon(job.matchScore)}
                  <span>{Math.round(job.matchScore)}% Match</span>
                </div>
              )}
            </div>

            {/* Salary and Skills */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <DollarSign className="w-4 h-4 text-green-600" />
                <span className="font-semibold text-green-600 text-sm">
                  {formatSalary(job.salaryMin, job.salaryMax)}
                </span>
                <span className="text-gray-500 text-xs">/year</span>
              </div>

              {/* Top Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="flex gap-1">
                  {job.requiredSkills.slice(0, 2).map((skill, idx) => (
                    <span
                      key={idx}
                      className={`px-2 py-1 rounded text-xs border ${
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
                    <span className="px-2 py-1 rounded text-xs bg-gray-100 text-gray-500 border border-gray-200">
                      +{job.requiredSkills.length - 2}
                    </span>
                  )}
                </div>
              )}
            </div>

            {/* Job Type Badges */}
            <div className="flex flex-wrap gap-1 mt-3">
              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium border border-blue-200">
                {job.jobType?.replace("-", " ") || "Full-time"}
              </span>
              {job.workMode === "remote" && (
                <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium border border-green-200">
                  Remote
                </span>
              )}
              {(job.featured || job.applications > 10) && (
                <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded text-xs font-medium border border-yellow-200 flex items-center gap-1">
                  <Star className="w-3 h-3" />
                  Featured
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {topJobs.length === 0 && (
        <div className="text-center py-8">
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Briefcase className="w-6 h-6 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No Jobs Available</h3>
          <p className="text-gray-600 text-sm mb-4">
            There are currently no job opportunities matching your criteria.
          </p>
          <button
            onClick={() => navigate('/jobs')}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
          >
            Browse All Jobs
          </button>
        </div>
      )}

      {/* Footer CTA */}
      {topJobs.length > 0 && (
        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={() => navigate('/jobs')}
            className="w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2.5 rounded-xl text-sm font-medium transition-colors duration-200 flex items-center justify-center gap-2"
          >
            <TrendingUp className="w-4 h-4" />
            View All Job Opportunities
          </button>
        </div>
      )}
    </div>
  );
};

export default TopJobs;