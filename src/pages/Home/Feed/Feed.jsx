import React, { useState, useEffect } from "react";
import {
  Briefcase,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Building,
  Award,
  FileText,
  ExternalLink,
  Zap,
  Users,
  Eye,
  MessageCircle,
} from "lucide-react";

import axiosIntense from "../../../hooks/AxiosIntense/axiosIntense";
import useAuth from "../../../hooks/UseAuth/useAuth";
import Loader from "../../../components/sharedItems/Loader/Loader";
import { useNavigate } from "react-router";
import { motion, AnimatePresence } from "framer-motion";

const Feed = () => {
  const { user } = useAuth();
  const [feedItems, setFeedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedProfile, setSelectedProfile] = useState(null);
  const navigate = useNavigate();
  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch jobs and users data in parallel
      const [jobsResponse, usersResponse] = await Promise.all([
        axiosIntense.get("/jobs"),
        axiosIntense.get("/users"),
      ]);

      const jobs = jobsResponse.data?.data || [];
      const users = usersResponse.data || [];

      // Extract hired posts from all users
      const allHiredPosts = users.flatMap((user) =>
        (user.hiredPosts || []).map((post) => ({
          ...post,
          type: "hired_post",
          user: {
            fullName: user.fullName,
            profileImage: user.profileImage,
            email: user.email,
            tags: user.tags || [],
            _id: user._id,
          },
        }))
      );

      // Format job posts
      const jobPosts = jobs.map((job) => ({
        ...job,
        type: "job_post",
      }));

      // Combine and shuffle all posts
      const allPosts = [...allHiredPosts, ...jobPosts];
      const shuffledPosts = shuffleArray(allPosts);

      setFeedItems(shuffledPosts);
    } catch (err) {
      console.error("Error fetching feed data:", err);
      setError("Failed to load feed data");
    } finally {
      setLoading(false);
    }
  };

  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatSalary = (min, max) => {
    if (!min && !max) return "Salary not specified";
    if (!max) return `$${min.toLocaleString()}+`;
    if (!min) return `Up to $${max.toLocaleString()}`;
    return `$${min.toLocaleString()} - $${max.toLocaleString()}`;
  };

  // Handle message button click
  const handleMessageClick = (postUser) => {
    // Store the user data in sessionStorage to use in MessagesPage
    const conversationData = {
      _id: postUser._id,
      fullName: postUser.fullName,
      email: postUser.email,
      profileImage: postUser.profileImage,
      tags: postUser.tags || [],
    };

    sessionStorage.setItem(
      "selectedConversation",
      JSON.stringify(conversationData)
    );

    // Navigate to messages page
    navigate("/messages");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-md w-full">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Feed Error
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchFeedData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50/60 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Opportunity Feed
          </h1>
          <p className="text-gray-600 text-lg">
            Discover jobs and connect with talented professionals
          </p>
        </div>

        {/* Feed Items */}
        <div className="space-y-6">
          {feedItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No Posts Yet
              </h2>
              <p className="text-gray-600 mb-6">
                Be the first to share a job opportunity or your professional
                journey
              </p>
            </div>
          ) : (
            feedItems.map((item, index) => (
              <div
                key={index}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-all duration-200"
              >
                {/* Job Post */}
                {item.type === "job_post" && (
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Company Image */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center overflow-hidden">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.company}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building className="w-8 h-8 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-3">
                          <div>
                            <h3 className="text-xl font-bold text-gray-900 mb-1">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-gray-600">
                              <div className="flex items-center space-x-1">
                                <Building className="w-4 h-4" />
                                <span className="text-sm">{item.company}</span>
                              </div>
                              {item.location && (
                                <div className="flex items-center space-x-1">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">
                                    {item.location}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                            Job Opportunity
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-3">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                          {(item.salaryMin || item.salaryMax) && (
                            <div className="flex items-center space-x-1">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-medium">
                                {formatSalary(item.salaryMin, item.salaryMax)}
                              </span>
                            </div>
                          )}

                          <div className="flex items-center space-x-1">
                            <Calendar className="w-4 h-4 text-blue-600" />
                            <span>Posted {formatDate(item.createdAt)}</span>
                          </div>

                          {item.applications !== undefined && (
                            <div className="flex items-center space-x-1">
                              <Users className="w-4 h-4 text-purple-600" />
                              <span>{item.applications} applications</span>
                            </div>
                          )}
                        </div>

                        <div className="flex flex-wrap gap-2 mt-4">
                          <button
                            onClick={() => navigate(`/job/${item._id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Apply Now</span>
                          </button>
                          <button
                            onClick={() => navigate(`/job/${item._id}`)}
                            className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Hired Post */}
                {item.type === "hired_post" && (
                  <div className="p-6">
                    {/* User Header */}
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="w-12 h-12 bg-blue-500 rounded-full flex items-center justify-center overflow-hidden">
                        {item.user?.profileImage ? (
                          <img
                            src={item.user.profileImage}
                            alt={item.user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg border-2 border-white shadow-sm">
                            {item.user.fullName
                              ? item.user.fullName.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">
                          {item.user?.fullName || "Anonymous User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Looking for opportunities •{" "}
                          {formatDate(item.timestamp)}
                        </p>
                      </div>
                      <div className="ml-auto bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium">
                        Seeking Work
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-4">
                      <p className="text-gray-800 whitespace-pre-line">
                        {item.content}
                      </p>
                    </div>

                    {/* Profile Data */}
                    {item.includeProfile && item.profileData && (
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200 mb-4">
                        <h4 className="font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                          <Award className="w-4 h-4 text-blue-600" />
                          <span>Professional Profile</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {item.profileData.desiredJobTitle && (
                            <div className="flex items-center space-x-2">
                              <Briefcase className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700">
                                <strong>Desired Role:</strong>{" "}
                                {item.profileData.desiredJobTitle}
                              </span>
                            </div>
                          )}

                          {item.profileData.currentJobTitle && (
                            <div className="flex items-center space-x-2">
                              <Building className="w-4 h-4 text-blue-600" />
                              <span className="text-gray-700">
                                <strong>Current Role:</strong>{" "}
                                {item.profileData.currentJobTitle}
                              </span>
                            </div>
                          )}

                          {item.profileData.location && (
                            <div className="flex items-center space-x-2">
                              <MapPin className="w-4 h-4 text-red-600" />
                              <span className="text-gray-700">
                                <strong>Location:</strong>{" "}
                                {item.profileData.location}
                              </span>
                            </div>
                          )}

                          {item.profileData.expectedSalary && (
                            <div className="flex items-center space-x-2">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="text-gray-700">
                                <strong>Expected Salary:</strong> $
                                {item.profileData.expectedSalary}
                              </span>
                            </div>
                          )}

                          {item.profileData.yearsOfExperience && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="w-4 h-4 text-purple-600" />
                              <span className="text-gray-700">
                                <strong>Experience:</strong>{" "}
                                {item.profileData.yearsOfExperience}
                              </span>
                            </div>
                          )}

                          {item.profileData.preferredJobType && (
                            <div className="flex items-center space-x-2">
                              <Briefcase className="w-4 h-4 text-orange-600" />
                              <span className="text-gray-700">
                                <strong>Job Type:</strong>{" "}
                                {item.profileData.preferredJobType}
                              </span>
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {item.profileData.skills &&
                          item.profileData.skills.length > 0 && (
                            <div className="mt-3">
                              <h5 className="font-medium text-gray-900 mb-2 text-sm">
                                Skills:
                              </h5>
                              <div className="flex flex-wrap gap-2">
                                {item.profileData.skills.map(
                                  (skill, skillIndex) => (
                                    <span
                                      key={skillIndex}
                                      className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                                    >
                                      {skill}
                                    </span>
                                  )
                                )}
                              </div>
                            </div>
                          )}

                        {/* Links */}
                        <div className="mt-3 flex flex-wrap gap-3">
                          {item.profileData.resumeLink && (
                            <a
                              href={item.profileData.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                              <FileText className="w-4 h-4" />
                              <span>View Resume</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}

                          {item.profileData.portfolio && (
                            <a
                              href={item.profileData.portfolio}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-1 text-green-600 hover:text-green-700 text-sm font-medium"
                            >
                              <Briefcase className="w-4 h-4" />
                              <span>Portfolio</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => handleMessageClick(item.user)}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2">
                        <Briefcase className="w-4 h-4" />
                        <span>Offer Job</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProfile(item.user);
                          setIsModalOpen(true);
                        }}
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Profile Modal */}
        <AnimatePresence mode="wait">
          {isModalOpen && selectedProfile && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 w-[90%] max-w-md relative"
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 120, damping: 15 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 bg-gray-100 px-3 py-[7px] hover:bg-gray-200 duration-200 rounded-full text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-20 h-20 rounded-full overflow-hidden mb-4 bg-gray-200">
                    {selectedProfile.profileImage ? (
                      <img
                        src={selectedProfile.profileImage}
                        alt={selectedProfile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-3xl border-2 border-white shadow-sm">
                        {selectedProfile.fullName
                          ? selectedProfile.fullName.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedProfile.fullName}
                  </h2>
                  <p className="text-gray-600 mb-3">{selectedProfile.email}</p>

                  {selectedProfile.tags && selectedProfile.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {selectedProfile.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-xs font-medium"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleMessageClick(selectedProfile)}
                    className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Message</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Load More (Optional) */}
        {feedItems.length > 0 && (
          <div className="text-center mt-8">
            <button
              onClick={fetchFeedData}
              className="bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-medium py-3 px-8 rounded-xl transition-all duration-200 flex items-center space-x-2 mx-auto shadow-sm hover:shadow-md"
            >
              <Zap className="w-5 h-5" />
              <span>Refresh Feed</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Feed;
