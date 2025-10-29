import React, { useEffect, useState } from "react";
import axiosIntense from "../../../../hooks/AxiosIntense/axiosIntense";
import {
  FaMapMarkerAlt,
  FaEnvelope,
  FaUserTie,
  FaMoneyBillWave,
  FaLaptopCode,
  FaUserCircle,
  FaPaperPlane,
  FaCheckCircle,
} from "react-icons/fa";
import useAxiosSecure from "../../../../hooks/AxiosIntense/useAxiosSecure";
import { useNavigate } from "react-router";
import HireButton from "../../../../components/HireButton/HireButton";

const SeeHirePost = () => {
  const axiosPublic = axiosIntense;
  const [allPosts, setAllPosts] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [recent, setRecent] = useState(false);
  const [type, setType] = useState("");
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  // Fetch posts whenever filters change
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axiosPublic.get("/hired-post/allpost", {
          params: { search, location, recent, type },
        });
        setAllPosts(res.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
      }
    };
    fetchPosts();
  }, [axiosPublic, search, location, recent, type]);

  // Placeholder functions for button actions
  const handleSeeProfile = async (email) => {
    try {
      const res = await axiosSecure.get(
        `/hired-post/get-profile?email=${email}`
      );
      const userData = res.data.profileData;
      setSelectedUser(userData);
      setIsModalOpen(true);
    } catch (error) {
      console.error("Error fetching profile:", error);
    }
  };

  const handleSendMessage = async (email) => {
    try {
      const res = await axiosSecure.get(`network/get-profile?email=${email}`);
      const redirect = res.data.profileData;
      const conversationData = {
        _id: redirect._id,
        fullName: redirect.fullName,
        email: redirect.email,
        profileImage: redirect.profileImage,
        tags: redirect.tags || [],
      };
      sessionStorage.setItem(
        "selectedConversation",
        JSON.stringify(conversationData)
      );
      navigate("/messages");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleHired = (postId) => {
    console.log(`'Hired' button clicked for post ID: ${postId}`);
    // In a real app, this would likely trigger a modal or an API call to mark the post as filled/hired
  };

  return (
    <div className="md:max-w-4xl w-full mx-auto  py-8 md:px-4">
      {/* --- */}

      {/*  Filter Controls */}
      <div className="flex flex-col md:flex-row gap-3 mb-10 items-center justify-between p-4 bg-gray-50 rounded-lg shadow-sm">
        <input
          type="text"
          placeholder="Search by title or description"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-1/3 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
        />

        <input
          type="text"
          placeholder="Filter by location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-1/4 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
        />

        <select
          value={type}
          onChange={(e) => setType(e.target.value)}
          className="border border-gray-300 px-4 py-2 rounded-lg w-full md:w-1/4 bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-150"
        >
          <option value="">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Remote">Remote</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </select>

        <label className="flex items-center gap-2 text-sm text-gray-700 w-full md:w-auto justify-start md:justify-center">
          <input
            type="checkbox"
            checked={recent}
            onChange={(e) => setRecent(e.target.checked)}
            className="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          Recent (24h)
        </label>
      </div>

      {/* --- */}

      {/*  Post List (One-Column) */}
      {allPosts.length === 0 ? (
        <p className="text-center text-lg text-gray-500 mt-12">
          No posts match your current filters. Try broadening your search!
        </p>
      ) : (
        // Changed to a single column list
        <div className="space-y-6">
          {allPosts.map((post) => (
            <div
              key={post._id}
              className="border border-gray-200 shadow-lg rounded-xl p-6 bg-white hover:shadow-xl transition duration-300 ease-in-out"
            >
              {/* Post Header and User Info */}
              <div className="flex md:flex-row flex-col justify-between items-start mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-indigo-600 mb-1">
                    {post.title}
                  </h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2">
                    <FaMapMarkerAlt className="text-indigo-500" /> Location:{" "}
                    {post.location}
                  </p>
                </div>
                {/* User Info on the right */}
                <div className="md:text-right text-start">
                  <div className="flex flex-col md:flex-row md:items-center items-start justify-end gap-3">
                    <div className="text-sm">
                      <h4 className="font-semibold text-gray-800">
                        {post.name}
                      </h4>
                      <p className="text-xs text-gray-500 flex items-center justify-end gap-1">
                        <FaEnvelope className="text-indigo-500" /> {post.email}
                      </p>
                    </div>
                    <img
                      src={post.photo}
                      alt={post.name}
                      className="w-12 h-12 rounded-full border-2 border-indigo-200 object-cover"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
                          post.name
                        )}&background=random`;
                      }}
                    />
                  </div>
                </div>
              </div>

              <hr className="my-4 border-gray-100" />

              {/* Post Details */}
              <p className="text-gray-700 mb-5 leading-relaxed">
                {post.description}
              </p>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm text-gray-600 mb-6">
                <p className="flex items-center gap-2 font-medium">
                  <FaUserTie className="text-indigo-500" /> Type: {post.type}
                </p>
                <p className="flex items-center gap-2 font-medium">
                  <FaMoneyBillWave className="text-green-500" /> Salary:{" "}
                  {post.salary}
                </p>
                <p className="col-span-2 flex items-center gap-2 font-medium">
                  <FaLaptopCode className="text-indigo-500" /> Skills:{" "}
                  {post.skills}
                </p>
              </div>

              {/* 3 Action Buttons */}
              <div className="flex md:flex-row flex-col items-start gap-4 justify-between md:items-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  🕓 Posted on: {new Date(post.date).toLocaleString()}
                </p>

                <div className="flex md:flex-row flex-col gap-3 ">
                  <button
                    onClick={() => handleSeeProfile(post.email)}
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    <FaUserCircle /> See Profile
                  </button>

                  {/* Message Button */}
                  <button
                    onClick={() => handleSendMessage(post.email)}
                    className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
                  >
                    <FaPaperPlane /> Message
                  </button>

                  {/* Hired Button (Conditional/Admin/Poster Only) */}
                  <HireButton
                    email={post.email}
                    name={post.name}
                  ></HireButton>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* --- Profile Modal --- */}
      {isModalOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white w-11/12 md:w-2/3 rounded-2xl shadow-2xl p-6 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-xl"
            >
              ✕
            </button>

            {/* Profile Header */}
            <div className="flex flex-col items-center text-center space-y-4">
              <img
                src={
                  selectedUser.profileImage ||
                  `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    selectedUser.fullName
                  )}`
                }
                alt={selectedUser.fullName}
                className="w-24 h-24 rounded-full border-4 border-indigo-100 object-cover shadow-md"
              />

              <h2 className="text-2xl font-bold text-indigo-600">
                {selectedUser.fullName}
              </h2>
              <p className="text-gray-500 flex items-center gap-2 text-sm">
                <FaEnvelope className="text-indigo-500" /> {selectedUser.email}
              </p>

              {selectedUser.isPremium ? (
                <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">
                  🌟 Premium Member ({selectedUser.currentPlan})
                </span>
              ) : (
                <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm">
                  Free User
                </span>
              )}
            </div>

            {/* Divider */}
            <hr className="my-6 border-gray-200" />

            {/* Basic Info Section */}
            <div className="grid md:grid-cols-2 gap-4 text-gray-700 mb-6">
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                  Basic Information
                </h3>
                <p>
                  <strong>Role:</strong> {selectedUser.role || "N/A"}
                </p>
                <p>
                  <strong>Purpose:</strong>{" "}
                  {selectedUser.purpose?.replace("_", " ") || "N/A"}
                </p>
                <p>
                  <strong>Joined:</strong>{" "}
                  {new Date(selectedUser.createdAt).toLocaleDateString()}
                </p>
                <p>
                  <strong>Connections:</strong>{" "}
                  {selectedUser.connectionsCount || 0}
                </p>
                <p>
                  <strong>Source:</strong>{" "}
                  {selectedUser.sources?.join(", ") || "N/A"}
                </p>
              </div>

              {/* Skills & Tags */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                <h3 className="text-lg font-semibold text-indigo-600 mb-2">
                  Expertise & Tags
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedUser.tags?.length ? (
                    selectedUser.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="bg-indigo-100 text-indigo-700 px-2 py-1 rounded-full text-xs font-medium"
                      >
                        {tag}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No tags available</p>
                  )}
                </div>
              </div>
            </div>

            {/* Premium Section */}
            {selectedUser.isPremium && (
              <div className="bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 rounded-xl p-4 mb-6">
                <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                  💎 Subscription Details
                </h3>
                <div className="grid md:grid-cols-2 gap-3 text-sm text-gray-700">
                  <p>
                    <strong>Current Plan:</strong> {selectedUser.planName}
                  </p>
                  <p>
                    <strong>Billing Cycle:</strong> {selectedUser.billingCycle}
                  </p>
                  <p>
                    <strong>Credits:</strong>{" "}
                    {selectedUser.aiCredits?.toLocaleString()} AI credits
                  </p>
                  <p>
                    <strong>Status:</strong>{" "}
                    <span
                      className={`${
                        selectedUser.subscriptionStatus === "active"
                          ? "text-green-600"
                          : "text-red-500"
                      } font-medium`}
                    >
                      {selectedUser.subscriptionStatus}
                    </span>
                  </p>
                  <p>
                    <strong>Premium Since:</strong>{" "}
                    {new Date(selectedUser.premiumSince).toLocaleString()}
                  </p>
                  <p>
                    <strong>Last Payment:</strong>{" "}
                    {new Date(selectedUser.lastPaymentDate).toLocaleString()}
                  </p>
                </div>
              </div>
            )}

            {/* Payment History */}
            {selectedUser.payments?.length > 0 && (
              <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">
                <h3 className="text-lg font-semibold text-indigo-600 mb-3">
                  💳 Payment History
                </h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-gray-700">
                    <thead>
                      <tr className="bg-gray-100 text-gray-600 text-left">
                        <th className="px-3 py-2">Transaction ID</th>
                        <th className="px-3 py-2">Amount ($)</th>
                        <th className="px-3 py-2">Plan</th>
                        <th className="px-3 py-2">Status</th>
                        <th className="px-3 py-2">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedUser.payments.map((pay, i) => (
                        <tr
                          key={i}
                          className="border-b border-gray-100 hover:bg-gray-50 transition"
                        >
                          <td className="px-3 py-2 font-mono">
                            {pay.transactionId}
                          </td>
                          <td className="px-3 py-2">{pay.amount}</td>
                          <td className="px-3 py-2">{pay.planName}</td>
                          <td
                            className={`px-3 py-2 font-medium ${
                              pay.status === "completed"
                                ? "text-green-600"
                                : "text-red-500"
                            }`}
                          >
                            {pay.status}
                          </td>
                          <td className="px-3 py-2">
                            {new Date(pay.createdAt).toLocaleString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default SeeHirePost;
