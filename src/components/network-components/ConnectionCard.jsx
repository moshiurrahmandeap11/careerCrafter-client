import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  MessageCircle, 
  Users, 
  UserX, 
  Calendar,
  Mail,
  MoreHorizontal,
  Sparkles
} from 'lucide-react';

import Swal from 'sweetalert2';
import { useNavigate } from 'react-router';
import useAxiosSecure from '../../hooks/AxiosIntense/useAxiosSecure';
import useAuth from '../../hooks/UseAuth/useAuth';

const ConnectionCard = ({ connection, onRemove }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [profile, setProfile] = useState(null);
  const authUser = useAuth();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();

  const connectedUser = connection.connectedUser || {};
  const email = connectedUser.email || 
    (connection.user1 === authUser?.user?.email ? connection.user2 : connection.user1);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;
      try {
        const res = await axiosSecure.get(`/users/email/${email}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };
    fetchProfile();
  }, [email, axiosSecure]);

  const profileName = profile?.fullName || connectedUser.name || connectedUser.fullName || "User";
  const profileImage = profile?.profileImage || connectedUser.photo || connectedUser.profileImage;
  const profileRole = profile?.role || connectedUser.profession || connectedUser.role || "Professional";
  const profileTags = profile?.tags || connectedUser.skills || connectedUser.tags || [];
  const profileCompany = profile?.company || connectedUser.company || "";

  const getConnectedDate = () => {
    if (!connection.connectedAt) return "Recently";
    const connected = new Date(connection.connectedAt);
    const now = new Date();
    const diffTime = Math.abs(now - connected);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day ago";
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  };

  const handleRemoveConnection = async () => {
    if (!authUser?.user?.email) {
      Swal.fire({
        icon: "error",
        title: "Login Required",
        text: "Please login to manage connections",
        timer: 2000,
      });
      return;
    }

    setIsLoading(true);
    setShowMenu(false);

    try {
      const result = await Swal.fire({
        title: "Remove Connection?",
        text: `Remove ${profileName} from your connections?`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Remove",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        const res = await axiosSecure.delete(`/network/connections/${connection._id}`, {
          data: { userEmail: authUser.user.email },
        });

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Connection Removed!",
            text: `${profileName} has been removed from your connections.`,
            timer: 2000,
          });
          if (onRemove) onRemove(connection._id);
        }
      }
    } catch (error) {
      console.error("Remove connection error:", error);
      Swal.fire({
        icon: "error",
        title: "Failed to Remove",
        text: "Failed to remove connection",
        timer: 3000,
      });
    } finally {
      setIsLoading(false);
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
      sessionStorage.setItem("selectedConversation", JSON.stringify(conversationData));
      navigate("/messages");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200"
    >
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* User Info */}
      <div className="flex items-start gap-3 mb-3">
        <div className="relative">
          {profileImage ? (
            <img
              src={profileImage}
              alt={profileName}
              className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-xl bg-blue-500 flex items-center justify-center text-white font-semibold text-lg">
              {profileName.charAt(0).toUpperCase()}
            </div>
          )}
          {connection.online && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate">{profileName}</h3>
            {connection.online && <Sparkles className="w-3 h-3 text-green-500 flex-shrink-0" />}
          </div>
          
          <p className="text-gray-600 text-sm truncate">{profileRole}</p>
          {profileCompany && (
            <p className="text-gray-500 text-sm truncate">at {profileCompany}</p>
          )}
        </div>

        {/* Desktop Menu */}
        <div className="hidden sm:block relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg"
          >
            <MoreHorizontal className="w-4 h-4" />
          </button>

          {showMenu && (
            <div className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-32">
              <button
                onClick={() => handleSendMessage(email)}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Message</span>
              </button>
              <button
                onClick={handleRemoveConnection}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <UserX className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Connection Date */}
      <div className="flex items-center space-x-2 text-gray-500 text-xs mb-3">
        <Calendar className="w-3 h-3" />
        <span>Connected {getConnectedDate()}</span>
      </div>

      {/* Tags */}
      {profileTags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1">
            {profileTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100"
              >
                {tag}
              </span>
            ))}
            {profileTags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg">
                +{profileTags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mobile Action Buttons */}
      <div className="flex gap-2 pt-3 border-t border-gray-100 sm:hidden">
        <button
          onClick={() => handleSendMessage(email)}
          className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Message</span>
        </button>
        <button
          onClick={handleRemoveConnection}
          className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 flex items-center justify-center"
        >
          ×
        </button>
      </div>

      {/* Desktop Action Buttons */}
      <div className="hidden sm:flex gap-2 pt-3 border-t border-gray-100">
        <button
          onClick={() => handleSendMessage(email)}
          className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg font-medium hover:bg-blue-100 text-sm flex items-center justify-center space-x-1"
        >
          <MessageCircle className="w-3 h-3" />
          <span>Message</span>
        </button>
      </div>
    </motion.div>
  );
};

export default ConnectionCard;