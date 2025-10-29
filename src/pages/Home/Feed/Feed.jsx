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
  Heart,
  Share2,
  Bookmark
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
  const [activeFilter, setActiveFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    fetchFeedData();
  }, []);

  const fetchFeedData = async () => {
    try {
      setLoading(true);
      setError(null);

      const [jobsResponse, usersResponse] = await Promise.all([
        axiosIntense.get("/jobs"),
        axiosIntense.get("/users"),
      ]);

      const jobs = jobsResponse.data?.data || [];
      const users = usersResponse.data || [];

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

      const jobPosts = jobs.map((job) => ({
        ...job,
        type: "job_post",
      }));

      const allPosts = [...allHiredPosts, ...jobPosts];
      const shuffledPosts = shuffleArray(allPosts);

      setFeedItems(shuffledPosts);
    } catch (err) {
      console.error("Error fetching feed data:", err);
      setError("Failed to load feed data. Please try again.");
    } finally {
      setLoading(false);
    }
  };

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
    if (!max) return `$${min?.toLocaleString() || '0'}+`;
    if (!min) return `Up to $${max?.toLocaleString() || '0'}`;
    return `$${min?.toLocaleString() || '0'} - $${max?.toLocaleString() || '0'}`;
  };

  const handleMessageClick = (postUser) => {
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
    navigate("/messages");
  };

  const filteredItems = feedItems.filter(item => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'jobs') return item.type === 'job_post';
    if (activeFilter === 'people') return item.type === 'hired_post';
    return true;
  });

  if (loading) {
    return (
      <div className="min-h-96 bg-white rounded-2xl flex items-center justify-center p-8">
        <div className="text-center">
          <Loader />
          <p className="text-gray-600 mt-4">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-96 bg-white rounded-2xl flex items-center justify-center p-8">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Zap className="w-8 h-8 text-red-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800 mb-2">Feed Error</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchFeedData}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-xl transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-4xl mx-auto p-6">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-3">Opportunity Feed</h1>
          <p className="text-gray-600 text-lg">
            Discover jobs and connect with talented professionals
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex justify-center mb-8">
          <div className="bg-white rounded-2xl p-2 shadow-sm border border-gray-200">
            <div className="flex space-x-1">
              {[
                { key: 'all', label: 'All', count: feedItems.length },
                { key: 'jobs', label: 'Jobs', count: feedItems.filter(item => item.type === 'job_post').length },
                { key: 'people', label: 'People', count: feedItems.filter(item => item.type === 'hired_post').length }
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => setActiveFilter(filter.key)}
                  className={`px-3 py-3 rounded-xl font-medium text-sm transition-all duration-200 ${
                    activeFilter === filter.key
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  {filter.label}
                  <span className="ml-2 text-xs opacity-80">({filter.count})</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Feed Items */}
        <div className="space-y-6">
          {filteredItems.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
              <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-10 h-10 text-gray-400" />
              </div>
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                No {activeFilter !== 'all' ? activeFilter : ''} Posts Yet
              </h2>
              <p className="text-gray-600 mb-6">
                {activeFilter === 'all' 
                  ? "Be the first to share a job opportunity"
                  : `No ${activeFilter} found matching your criteria`
                }
              </p>
            </div>
          ) : (
            filteredItems.map((item, index) => (
              <motion.div
                key={`${item.type}-${item._id || index}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all duration-300"
              >
                {/* Job Post */}
                {item.type === "job_post" && (
                  <div className="p-6">
                    <div className="flex flex-col sm:flex-row sm:items-start gap-4">
                      {/* Company Image */}
                      <div className="flex-shrink-0">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                          {item.image ? (
                            <img
                              src={item.image}
                              alt={item.company}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <Building className="w-7 h-7 text-white" />
                          )}
                        </div>
                      </div>

                      {/* Job Details */}
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 mb-4">
                          <div className="flex-1">
                            <h3 className="text-xl font-bold text-gray-900 mb-2 hover:text-blue-600 cursor-pointer transition-colors">
                              {item.title}
                            </h3>
                            <div className="flex items-center space-x-4 text-gray-600 mb-2">
                              <div className="flex items-center space-x-2">
                                <Building className="w-4 h-4" />
                                <span className="text-sm font-medium">{item.company}</span>
                              </div>
                              {item.location && (
                                <div className="flex items-center space-x-2">
                                  <MapPin className="w-4 h-4" />
                                  <span className="text-sm">{item.location}</span>
                                </div>
                              )}
                            </div>
                          </div>
                          <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>Job Opportunity</span>
                          </div>
                        </div>

                        <p className="text-gray-700 mb-4 line-clamp-2 leading-relaxed">
                          {item.description}
                        </p>

                        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-4">
                          {(item.salaryMin || item.salaryMax) && (
                            <div className="flex items-center space-x-1 bg-green-50 px-3 py-1 rounded-lg">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <span className="font-medium text-green-700">
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

                        {/* Skills Tags */}
                        {item.requiredSkills && item.requiredSkills.length > 0 && (
                          <div className="flex flex-wrap gap-2 mb-4">
                            {item.requiredSkills.slice(0, 4).map((skill, idx) => (
                              <span
                                key={idx}
                                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-lg text-xs font-medium border border-gray-200"
                              >
                                {skill}
                              </span>
                            ))}
                            {item.requiredSkills.length > 4 && (
                              <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-lg text-xs font-medium">
                                +{item.requiredSkills.length - 4} more
                              </span>
                            )}
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={() => navigate(`/job/${item._id}`)}
                            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                          >
                            <Briefcase className="w-4 h-4" />
                            <span>Apply Now</span>
                          </button>
                          <button
                            onClick={() => navigate(`/job/${item._id}`)}
                            className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                          >
                            <Eye className="w-4 h-4" />
                            <span>View Details</span>
                          </button>
                          <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                            <Bookmark className="w-4 h-4" />
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
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-14 h-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center overflow-hidden shadow-lg">
                        {item.user?.profileImage ? (
                          <img
                            src={item.user.profileImage}
                            alt={item.user.fullName}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center text-white font-semibold text-xl border-2 border-white shadow-lg">
                            {item.user.fullName
                              ? item.user.fullName.charAt(0).toUpperCase()
                              : "?"}
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-gray-900 text-lg">
                          {item.user?.fullName || "Anonymous User"}
                        </p>
                        <p className="text-sm text-gray-500">
                          Looking for opportunities • {formatDate(item.timestamp)}
                        </p>
                      </div>
                      <div className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
                        <User className="w-4 h-4" />
                        <span>Seeking Work</span>
                      </div>
                    </div>

                    {/* Post Content */}
                    <div className="mb-6">
                      <p className="text-gray-800 whitespace-pre-line leading-relaxed text-lg">
                        {item.content}
                      </p>
                    </div>

                    {/* Profile Data */}
                    {item.includeProfile && item.profileData && (
                      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5 border border-blue-200 mb-6">
                        <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2 text-lg">
                          <Award className="w-5 h-5 text-blue-600" />
                          <span>Professional Profile</span>
                        </h4>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                          {item.profileData.desiredJobTitle && (
                            <div className="flex items-center space-x-3">
                              <Briefcase className="w-4 h-4 text-green-600" />
                              <div>
                                <div className="text-xs text-gray-500">Desired Role</div>
                                <div className="font-medium text-gray-900">{item.profileData.desiredJobTitle}</div>
                              </div>
                            </div>
                          )}

                          {item.profileData.currentJobTitle && (
                            <div className="flex items-center space-x-3">
                              <Building className="w-4 h-4 text-blue-600" />
                              <div>
                                <div className="text-xs text-gray-500">Current Role</div>
                                <div className="font-medium text-gray-900">{item.profileData.currentJobTitle}</div>
                              </div>
                            </div>
                          )}

                          {item.profileData.location && (
                            <div className="flex items-center space-x-3">
                              <MapPin className="w-4 h-4 text-red-600" />
                              <div>
                                <div className="text-xs text-gray-500">Location</div>
                                <div className="font-medium text-gray-900">{item.profileData.location}</div>
                              </div>
                            </div>
                          )}

                          {item.profileData.expectedSalary && (
                            <div className="flex items-center space-x-3">
                              <DollarSign className="w-4 h-4 text-green-600" />
                              <div>
                                <div className="text-xs text-gray-500">Expected Salary</div>
                                <div className="font-medium text-gray-900">${item.profileData.expectedSalary}</div>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Skills */}
                        {item.profileData.skills && item.profileData.skills.length > 0 && (
                          <div className="mt-4">
                            <h5 className="font-medium text-gray-900 mb-3 text-sm">Skills & Expertise</h5>
                            <div className="flex flex-wrap gap-2">
                              {item.profileData.skills.map((skill, skillIndex) => (
                                <span
                                  key={skillIndex}
                                  className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200"
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Links */}
                        <div className="mt-4 flex flex-wrap gap-4">
                          {item.profileData.resumeLink && (
                            <a
                              href={item.profileData.resumeLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex items-center space-x-2 text-blue-600 hover:text-blue-700 text-sm font-medium bg-white px-3 py-2 rounded-lg border border-blue-200 hover:border-blue-300 transition-all duration-200"
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
                              className="flex items-center space-x-2 text-green-600 hover:text-green-700 text-sm font-medium bg-white px-3 py-2 rounded-lg border border-green-200 hover:border-green-300 transition-all duration-200"
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
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={() => handleMessageClick(item.user)}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>Message</span>
                      </button>
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl">
                        <Briefcase className="w-4 h-4" />
                        <span>Offer Job</span>
                      </button>
                      <button
                        onClick={() => {
                          setSelectedProfile(item.user);
                          setIsModalOpen(true);
                        }}
                        className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md"
                      >
                        <Eye className="w-4 h-4" />
                        <span>View Profile</span>
                      </button>
                      <button className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 px-4 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-sm hover:shadow-md">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>

        {/* Load More */}
        {filteredItems.length > 0 && (
          <div className="text-center mt-12">
            <button
              onClick={fetchFeedData}
              className="bg-white border border-gray-300 hover:border-gray-400 text-gray-700 font-medium py-3.5 px-8 rounded-xl transition-all duration-200 flex items-center space-x-3 mx-auto shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Zap className="w-5 h-5" />
              <span>Refresh Feed</span>
            </button>
          </div>
        )}

        {/* Profile Modal */}
        <AnimatePresence>
          {isModalOpen && selectedProfile && (
            <motion.div
              className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
            >
              <motion.div
                className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-md relative"
                initial={{ opacity: 0, scale: 0.8, y: -50 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: 50 }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="absolute top-4 right-4 bg-gray-100 hover:bg-gray-200 w-8 h-8 flex items-center justify-center rounded-full text-gray-500 hover:text-gray-700 transition-all duration-200 hover:scale-110"
                >
                  ✕
                </button>

                <div className="flex flex-col items-center text-center">
                  <div className="w-24 h-24 rounded-2xl overflow-hidden mb-4 bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg">
                    {selectedProfile.profileImage ? (
                      <img
                        src={selectedProfile.profileImage}
                        alt={selectedProfile.fullName}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-semibold text-3xl border-4 border-white shadow-lg">
                        {selectedProfile.fullName
                          ? selectedProfile.fullName.charAt(0).toUpperCase()
                          : "?"}
                      </div>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedProfile.fullName}
                  </h2>
                  <p className="text-gray-600 mb-4">{selectedProfile.email}</p>

                  {selectedProfile.tags && selectedProfile.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-6">
                      {selectedProfile.tags.slice(0, 4).map((tag, i) => (
                        <span
                          key={i}
                          className="bg-blue-100 text-blue-800 px-3 py-1.5 rounded-lg text-xs font-medium border border-blue-200"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <button
                    onClick={() => handleMessageClick(selectedProfile)}
                    className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-xl font-medium text-sm transition-all duration-200 flex items-center space-x-2 shadow-lg hover:shadow-xl w-full justify-center"
                  >
                    <MessageCircle className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default Feed;