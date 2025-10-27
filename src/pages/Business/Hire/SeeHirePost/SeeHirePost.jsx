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

const SeeHirePost = () => {
  const axiosPublic = axiosIntense;
  const [allPosts, setAllPosts] = useState([]);

  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [recent, setRecent] = useState(false);
  const [type, setType] = useState("");

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
  const handleSeeProfile = (userId) => {
    console.log(`Navigating to user profile ID: ${userId}`);
    // In a real app, this would be a navigation: navigate(`/profile/${userId}`);
  };

  const handleMessage = (email) => {
    console.log(`Opening chat/message with: ${email}`);
    // In a real app, this would open a chat interface
  };

  const handleHired = (postId) => {
    console.log(`'Hired' button clicked for post ID: ${postId}`);
    // In a real app, this would likely trigger a modal or an API call to mark the post as filled/hired
  };

  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      {/* --- */}

      {/* 🔍 Filter Controls */}
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

      {/* 📋 Post List (One-Column) */}
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
              <div className="flex justify-between items-start mb-4">
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
                <div className="text-right">
                  <div className="flex items-center justify-end gap-3">
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
              <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                <p className="text-xs text-gray-400">
                  🕓 Posted on: {new Date(post.date).toLocaleString()}
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => handleSeeProfile(post.userId)} // Assuming 'userId' exists
                    className="flex items-center gap-2 bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                  >
                    <FaUserCircle /> See Profile
                  </button>

                  {/* Message Button */}
                  <button
                    onClick={() => handleMessage(post.email)}
                    className="flex items-center gap-2 bg-indigo-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-600 transition"
                  >
                    <FaPaperPlane /> Message
                  </button>

                  {/* Hired Button (Conditional/Admin/Poster Only) */}
                  <button
                    onClick={() => handleHired(post._id)}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-600 transition"
                  >
                    <FaCheckCircle /> Hired
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SeeHirePost;
