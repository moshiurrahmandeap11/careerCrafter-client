import React, { useState, useEffect, useCallback } from "react";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import { useNavigate } from "react-router";
import useAuth from "../../hooks/UseAuth/useAuth";

const AiJobMatch = () => {
  const { user } = useAuth();
  const email = user?.email;

  const [userProfile, setUserProfile] = useState(null);
  const [jobs, setJobs] = useState([]);
  const [matchedJobs, setMatchedJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [dataLoading, setDataLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState("profile");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  // Fetch user profile
  const fetchUserProfile = useCallback(async () => {
    if (!email) return;

    try {
      const response = await axiosIntense.get(`/users/email/${email}`);
      if (response.data) {
        setUserProfile(response.data);
        setError("");
      } else {
        setError("User profile not found");
      }
    } catch (err) {
      console.error("Error fetching user profile:", err);
      setError("Failed to load user profile. Please refresh the page.");
    }
  }, [email]);

  // Fetch jobs
  const fetchJobs = useCallback(async () => {
    try {
      const response = await axiosIntense.get("/jobs");
      if (response.data.success) {
        setJobs(response.data.data);
      }
    } catch (err) {
      console.error("Error fetching jobs:", err);
    }
  }, []);

  // Initial data load
  useEffect(() => {
    const loadData = async () => {
      if (email) {
        setDataLoading(true);
        await Promise.all([fetchUserProfile(), fetchJobs()]);
        setDataLoading(false);
      }
    };
    loadData();
  }, [email, fetchUserProfile, fetchJobs]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Handle job matching
  const handleJobMatch = async () => {
    if (!userProfile?._id) {
      setError("User profile not loaded properly. Please refresh the page.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccessMessage("");

    try {
      const response = await axiosIntense.post("/ai-jobs/match", {
        userId: userProfile._id,
      });

      if (response.data.success) {
        const matches = response.data.data.matches || [];
        setMatchedJobs(matches);
        setActiveTab("results");

        if (matches.length > 0) {
          setSuccessMessage(`Found ${matches.length} job matches for you!`);
        } else {
          setError("No matching jobs found. Try updating your profile.");
        }
      } else {
        setError(response.data.message || "Matching failed. Please try again.");
      }
    } catch (err) {
      console.error("Job matching error:", err);
      setError(
        err.response?.data?.message ||
        "Failed to perform job matching. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  // Helper functions
  const getUserExperience = () => {
    if (!userProfile?.tags) return "Not specified";
    const experienceTags = userProfile.tags.filter(
      (tag) =>
        typeof tag === "string" &&
        (tag.includes("Developer") ||
          tag.includes("Engineer") ||
          tag.includes("Designer") ||
          tag.includes("Manager"))
    );
    return experienceTags.length > 0
      ? experienceTags.join(", ")
      : "Not specified";
  };

  const getUserSkills = () => {
    if (!userProfile?.tags) return [];
    return userProfile.tags.filter(
      (tag) =>
        typeof tag === "string" &&
        !(
          tag.includes("Developer") ||
          tag.includes("Engineer") ||
          tag.includes("Designer") ||
          tag.includes("Manager")
        )
    );
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "bg-green-500";
    if (score >= 70) return "bg-blue-500";
    if (score >= 60) return "bg-yellow-500";
    return "bg-red-500";
  };

  const getScoreBadge = (score) => {
    if (score >= 80)
      return { text: "Excellent Match", color: "text-green-700 bg-green-100" };
    if (score >= 70)
      return { text: "Good Match", color: "text-blue-700 bg-blue-100" };
    if (score >= 60)
      return { text: "Fair Match", color: "text-yellow-700 bg-yellow-100" };
    return { text: "Basic Match", color: "text-gray-700 bg-gray-100" };
  };

  // Action handlers
  const handleApply = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  const handleSaveJob = (jobId) => {
    setSuccessMessage("Job saved to favorites!");
    setTimeout(() => setSuccessMessage(""), 3000);
  };

  const handleViewDetails = (jobId) => {
    navigate(`/job/${jobId}`);
  };

  // Loading state
  if (dataLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">
            Loading Your Profile
          </h2>
          <p className="text-gray-600">Preparing job matching system...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error && !userProfile) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <div className="bg-white rounded-lg border border-gray-300 p-6">
            <div className="text-red-500 text-4xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Unable to Load Profile
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <div className="space-y-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium"
              >
                Refresh Page
              </button>
              <button
                onClick={fetchUserProfile}
                className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-300 font-medium"
              >
                Retry Loading
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white py-6">
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            Job Matching
          </h1>
          <p className="text-gray-600">Find jobs that match your profile</p>
        </div>

        {/* Success Message */}
        {successMessage && (
          <div className="max-w-3xl mx-auto mb-6">
            <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
              <div className="flex items-center">
                <span className="text-green-500 mr-2">✓</span>
                <p className="text-green-800 text-sm">{successMessage}</p>
              </div>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Left Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* Profile Header */}
              <div className="bg-blue-600 p-4 text-white">
                <div className="flex flex-col items-center text-center">
                  <div className="relative mb-3">
                    <img
                      src={userProfile?.profileImage || "/default-avatar.png"}
                      alt={userProfile?.fullName}
                      className="w-20 h-20 rounded-full border-2 border-white object-cover"
                      onError={(e) => {
                        e.target.src =
                          "https://ui-avatars.com/api/?name=" +
                          encodeURIComponent(userProfile?.fullName || "User") +
                          "&size=80&background=3B82F6&color=fff";
                      }}
                    />
                  </div>
                  <h2 className="text-lg font-bold mb-1">
                    {userProfile?.fullName || "User"}
                  </h2>
                  <span className="bg-white/20 text-white px-3 py-1 rounded-full text-xs font-medium">
                    {userProfile?.roleType === "premium"
                      ? "Premium Member"
                      : "Standard Member"}
                  </span>
                </div>
              </div>

              {/* Profile Details */}
              <div className="p-4">
                <div className="space-y-2 mb-4">
                  <ProfileItem label="Experience" value={getUserExperience()} />
                  <ProfileItem
                    label="Location"
                    value={userProfile?.preferredLocation || "Not specified"}
                  />
                  <ProfileItem
                    label="Expected Salary"
                    value={`$${userProfile?.expectedSalary || "0"}/month`}
                  />
                </div>

                {/* Skills */}
                {getUserSkills().length > 0 && (
                  <div className="mb-4">
                    <h3 className="font-bold text-gray-900 mb-2 text-sm">
                      Skills
                    </h3>
                    <div className="flex flex-wrap gap-1">
                      {getUserSkills()
                        .slice(0, 6)
                        .map((skill, index) => (
                          <span
                            key={index}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs border border-blue-200"
                          >
                            {skill}
                          </span>
                        ))}
                    </div>
                  </div>
                )}

                {/* Match Button */}
                <button
                  onClick={handleJobMatch}
                  disabled={loading}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      <span>Analyzing...</span>
                    </>
                  ) : (
                    <>
                      <span>Find Matches</span>
                    </>
                  )}
                </button>

                <p className="text-xs text-gray-500 text-center mt-2">
                  Uses 1 AI credit per search
                </p>
              </div>
            </div>
          </div>

          {/* Right Side - Results */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
              {/* Tabs */}
              <div className="flex border-b border-gray-300">
                <TabButton
                  active={activeTab === "profile"}
                  onClick={() => setActiveTab("profile")}
                  label="Overview"
                />
                <TabButton
                  active={activeTab === "results"}
                  onClick={() => setActiveTab("results")}
                  label="Matches"
                  badge={matchedJobs.length > 0 ? matchedJobs.length : null}
                />
              </div>

              {/* Tab Content */}
              <div className="p-4">
                {activeTab === "profile" && <ProfileOverviewTab />}
                {activeTab === "results" && (
                  <ResultsTab
                    error={error}
                    loading={loading}
                    matchedJobs={matchedJobs}
                    jobs={jobs}
                    getScoreColor={getScoreColor}
                    getScoreBadge={getScoreBadge}
                    handleApply={handleApply}
                    handleSaveJob={handleSaveJob}
                    handleViewDetails={handleViewDetails}
                    handleJobMatch={handleJobMatch}
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Components
const ProfileItem = ({ label, value }) => (
  <div className="flex items-center justify-between py-1">
    <span className="text-gray-600 text-xs">{label}</span>
    <span className="text-gray-900 font-medium text-xs text-right">
      {value}
    </span>
  </div>
);

const TabButton = ({ active, onClick, label, badge }) => (
  <button
    onClick={onClick}
    className={`flex-1 py-3 px-4 text-center font-medium text-sm transition-colors flex items-center justify-center gap-2 ${active
        ? "text-blue-600 bg-white border-b-2 border-blue-600"
        : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
      }`}
  >
    <span>{label}</span>
    {badge !== null && (
      <span
        className={`px-2 py-0.5 rounded-full text-xs ${active ? "bg-blue-100 text-blue-600" : "bg-gray-200 text-gray-600"
          }`}
      >
        {badge}
      </span>
    )}
  </button>
);

const ProfileOverviewTab = () => (
  <div className="space-y-6">
    <div>
      <h3 className="text-xl font-bold text-gray-900 mb-3">
        Welcome to Job Matching
      </h3>
      <p className="text-gray-600 text-sm">
        Our system will analyze your profile and find suitable jobs for you.
        Click "Find Matches" to get started!
      </p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <FeatureCard
        title="Skills Match"
        description="Match your skills with job requirements"
      />
      <FeatureCard
        title="Salary Fit"
        description="Find jobs within your expected salary range"
      />
      <FeatureCard
        title="Location Match"
        description="Match with jobs in your preferred location"
      />
    </div>
  </div>
);

const FeatureCard = ({ title, description }) => (
  <div className="bg-gray-50 border border-gray-200 p-4 rounded-lg">
    <h4 className="font-bold text-gray-900 mb-2 text-sm">{title}</h4>
    <p className="text-gray-600 text-xs">{description}</p>
  </div>
);

const ResultsTab = ({
  error,
  loading,
  matchedJobs,
  jobs,
  getScoreColor,
  getScoreBadge,
  handleApply,
  handleSaveJob,
  handleViewDetails,
  handleJobMatch,
}) => (
  <div className="space-y-4">
    {error && (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        <div className="flex items-center">
          <span className="mr-2">⚠️</span>
          <span className="text-sm">{error}</span>
        </div>
      </div>
    )}

    {loading ? (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h3 className="text-lg font-bold text-gray-900 mb-2">
          Analyzing Your Profile
        </h3>
        <p className="text-gray-600 text-sm">
          Finding the best opportunities...
        </p>
      </div>
    ) : matchedJobs.length > 0 ? (
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 bg-blue-50 p-4 rounded-lg border border-blue-200">
          <div>
            <h3 className="text-lg font-bold text-gray-900 mb-1">
              Found {matchedJobs.length} Job{" "}
              {matchedJobs.length === 1 ? "Match" : "Matches"}
            </h3>
            <p className="text-gray-600 text-sm">
              Sorted by compatibility score
            </p>
          </div>
          <button
            onClick={handleJobMatch}
            className="bg-white text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-50 transition-colors border border-blue-200 text-sm"
          >
            Refresh
          </button>
        </div>

        {matchedJobs.map((match, index) => {
          const job = jobs.find((j) => j._id === match.jobId);
          if (!job) return null;

          const badge = getScoreBadge(match.matchScore);

          return (
            <div
              key={index}
              className="border border-gray-300 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
            >
              {/* Job Header */}
              <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-4 gap-3">
                <div className="flex-1">
                  <div className="flex items-start gap-3 mb-2">
                    <div className="w-12 h-12 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                      {job.company.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1 hover:text-blue-600 transition-colors cursor-pointer">
                        {job.title}
                      </h3>
                      <p className="text-blue-600 font-medium text-sm">
                        {job.company}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-medium">
                      ${job.salaryMin?.toLocaleString()} - $
                      {job.salaryMax?.toLocaleString()}
                    </span>
                    <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-medium capitalize">
                      {job.jobType || "Full-time"}
                    </span>
                    <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-medium">
                      {job.location || "Remote"}
                    </span>
                  </div>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div
                    className={`${getScoreColor(
                      match.matchScore
                    )} text-white px-4 py-2 rounded-lg font-bold text-lg`}
                  >
                    {match.matchScore}%
                  </div>
                  <span
                    className={`${badge.color} px-2 py-1 rounded text-xs font-medium`}
                  >
                    {badge.text}
                  </span>
                </div>
              </div>

              {/* Job Description */}
              <div className="mb-4">
                <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                  {job.description}
                </p>
              </div>

              {/* Required Skills */}
              {job.requiredSkills && job.requiredSkills.length > 0 && (
                <div className="mb-4">
                  <h4 className="font-bold text-gray-900 mb-2 text-sm">
                    Required Skills
                  </h4>
                  <div className="flex flex-wrap gap-1">
                    {job.requiredSkills.slice(0, 6).map((skill, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col md:flex-row gap-2 pt-4 border-t border-gray-200">
                <button
                  onClick={() => handleApply(job._id)}
                  className="flex-1 sm:flex-none bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Apply Now
                </button>
                <button
                  onClick={() => handleSaveJob(job._id)}
                  className="flex-1 sm:flex-none bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Save
                </button>
                <button
                  onClick={() => handleViewDetails(job._id)}
                  className="flex-1 sm:flex-none bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors text-sm"
                >
                  Details
                </button>
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="text-center py-8">
        <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
          <span className="text-4xl text-gray-400">🔍</span>
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">No Matches Yet</h3>
        <p className="text-gray-600 text-sm mb-6 max-w-md mx-auto">
          Click the "Find Matches" button to start discovering jobs that match
          your profile.
        </p>
        <button
          onClick={handleJobMatch}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
        >
          Start Matching Now
        </button>
      </div>
    )}
  </div>
);

export default AiJobMatch;
