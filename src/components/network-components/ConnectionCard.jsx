import {
  Building,
  MessageCircle,
  MoreHorizontal,
  Sparkles,
  Users,
  UserX,
  Calendar,
  MapPin,
  Mail,
} from "lucide-react";
import { useEffect, useState } from "react";
import useAuth from "../../hooks/UseAuth/useAuth";
import useAxiosSecure from "../../hooks/AxiosIntense/useAxiosSecure"; // useAxiosSecure ব্যবহার করুন
import Swal from "sweetalert2";
import { motion, AnimatePresence } from "framer-motion";

const cardVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};

// Fallback Avatar Component
const FallbackAvatar = ({ name, className }) => {
  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const getColor = (name) => {
    const colors = [
      "bg-blue-500",
      "bg-green-500",
      "bg-purple-500",
      "bg-orange-500",
      "bg-pink-500",
      "bg-teal-500",
    ];
    const index = name.length % colors.length;
    return colors[index];
  };

  return (
    <div
      className={`${className} ${getColor(
        name
      )}  flex items-center justify-center text-white font-semibold border-2 border-white shadow-sm`}
    >
      {getInitials(name)}
    </div>
  );
};

export const ConnectionCard = ({ connection, onRemove }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [profile, setProfile] = useState(null);
  const authUser = useAuth();
  const axiosSecure = useAxiosSecure(); // useAxiosSecure ব্যবহার করুন
  const useremail = authUser?.user?.email;
  const [profileViewer, setProfileViewer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const connectedUser = connection.connectedUser || {};
  const avatar =
    connectedUser.photo ||
    connectedUser.profileImage ||
    connectedUser.profileImage;
  const name = connectedUser.name || connectedUser.fullName || "User";
  const title =
    connectedUser.profession || connectedUser.role || "Professional";
  const company = connectedUser.company || "";
  const location = connectedUser.location || "";
  const tags = connectedUser.skills || connectedUser.tags || [];
  const email =
    connectedUser.email ||
    (connection.user1 === authUser?.user?.email
      ? connection.user2
      : connection.user1);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!email) return;

      try {
        const res = await axiosSecure.get(`/users/email/${email}`);
        setProfile(res.data);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setProfile({
          fullName: name,
          profileImage: avatar,
          role: title,
          tags: tags,
          company: company,
          email: email,
        });
      }
    };

    fetchProfile();
  }, [email, name, avatar, title, tags, company, axiosSecure]);

  // প্রোফাইল ডাটা ব্যবহার করুন
  const profileName = profile?.fullName || name;
  const profileImage = profile?.profileImage || avatar;
  const profileRole = profile?.role || title;
  const profileTags = profile?.tags || tags;
  const profileCompany = profile?.company || company;
  const profileEmail = profile?.email || email;

  // Format connected date
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
        text: `Remove ${profileName} from your connections? You can send a new connection request later if needed.`,
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, Remove",
        cancelButtonText: "Cancel",
      });

      if (result.isConfirmed) {
        console.log("Removing connection:", connection._id);

        // Real API call
        const res = await axiosSecure.delete(
          `/network/connections/${connection._id}`,
          {
            data: { userEmail: authUser.user.email },
          }
        );

        console.log("Remove connection response:", res.data);

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Connection Removed!",
            text: `${profileName} has been removed from your connections. You can send a new connection request anytime.`,
            timer: 2000,
            showConfirmButton: false,
          });

          // Call parent to update the list
          if (onRemove) {
            onRemove(connection._id);
          }
        } else {
          throw new Error(res.data.message || "Failed to remove connection");
        }
      }
    } catch (error) {
      console.error("Remove connection error:", error);

      let errorMessage = "Failed to remove connection";

      if (error.response) {
        errorMessage =
          error.response.data?.message ||
          `Server error: ${error.response.status}`;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message || "Unknown error occurred";
      }

      Swal.fire({
        icon: "error",
        title: "Failed to Remove",
        text: errorMessage,
        timer: 3000,
        showConfirmButton: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendMessage = () => {
    Swal.fire({
      icon: "info",
      title: "Send Message",
      text: `Message ${profileName}`,
      timer: 1500,
    });
  };

  const handleViewProfile = async (email) => {
    const res = await axiosSecure.get(`network/get-profile?email=${email}`);
    setProfileViewer(res.data);
    setIsModalOpen(true);
  };
  console.log(profileViewer);
  const handleMenuAction = (action) => {
    setShowMenu(false);
    switch (action) {
      case "remove":
        handleRemoveConnection();
        break;
      case "message":
        handleSendMessage();
        break;
      case "profile":
        handleViewProfile();
        break;
      default:
        break;
    }
  };

  return (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 w-full"
    >
      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-80 rounded-xl flex items-center justify-center z-10">
          <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {/* User Info Section */}
      <div className="flex flex-col sm:flex-row items-start gap-3 mb-3">
        {/* Avatar Section */}
        <div className="flex justify-center sm:justify-start relative">
          {profileImage && !imageError ? (
            <img
              src={profileImage}
              alt={profileName}
              className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
              onError={() => setImageError(true)}
            />
          ) : (
            <FallbackAvatar
              name={profileName}
              className="w-14 h-14 rounded-xl text-base"
            />
          )}

          {connection.online && (
            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
          )}
        </div>

        {/* User Details */}
        <div className="flex-1 text-center sm:text-left min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
            <h3 className="font-semibold text-gray-900 truncate text-lg">
              {profileName}
            </h3>
            {connection.online && (
              <Sparkles className="w-3 h-3 text-green-500 flex-shrink-0" />
            )}
          </div>

          <div className="space-y-1">
            {profileRole && (
              <p className="text-gray-600 text-sm flex items-center justify-center sm:justify-start gap-2">
                <Building className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{profileRole}</span>
              </p>
            )}

            {profileCompany && (
              <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-2">
                <span className="truncate">at {profileCompany}</span>
              </p>
            )}

            {profileEmail && (
              <p className="text-gray-500 text-xs flex items-center justify-center sm:justify-start gap-2">
                <Mail className="w-3 h-3 flex-shrink-0" />
                <span className="truncate">{profileEmail}</span>
              </p>
            )}
          </div>
        </div>

        {/* More Options Menu - Desktop */}
        <div className="hidden sm:block relative">
          <motion.button
            className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
            whileHover={{ scale: 1.1 }}
            onClick={() => setShowMenu(!showMenu)}
            disabled={isLoading}
          >
            <MoreHorizontal className="w-4 h-4" />
          </motion.button>

          {showMenu && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="absolute right-0 top-8 bg-white border border-gray-200 rounded-lg shadow-lg py-1 z-20 min-w-32"
            >
              <button
                onClick={() => handleMenuAction("message")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <MessageCircle className="w-3 h-3" />
                <span>Message</span>
              </button>
              <button
                onClick={() => handleMenuAction("profile")}
                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2"
              >
                <Users className="w-3 h-3" />
                <span>Profile</span>
              </button>
              <div className="border-t border-gray-100 my-1"></div>
              <button
                onClick={() => handleMenuAction("remove")}
                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2"
              >
                <UserX className="w-3 h-3" />
                <span>Remove</span>
              </button>
            </motion.div>
          )}
        </div>
      </div>

      {/* Connection Date */}
      <div className="flex items-center justify-center sm:justify-start space-x-2 text-gray-500 text-xs mb-3">
        <Calendar className="w-3 h-3 flex-shrink-0" />
        <span>Connected {getConnectedDate()}</span>
      </div>

      {/* Tags/Skills */}
      {profileTags.length > 0 && (
        <div className="mb-3">
          <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
            {profileTags.slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100"
              >
                {tag}
              </span>
            ))}
            {profileTags.length > 3 && (
              <span className="px-2 py-1 bg-gray-50 text-gray-600 text-xs rounded-lg border border-gray-100">
                +{profileTags.length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Mutual Connections */}
      <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
        <div className="flex items-center space-x-1">
          <Users className="w-3 h-3" />
          <span>{connection.mutualConnections || 0} mutual</span>
        </div>
      </div>

      {/* Action Buttons - Mobile */}
      <div className="flex flex-col xs:flex-row gap-2 pt-3 border-t border-gray-100 sm:hidden">
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="flex-1 bg-blue-500 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-blue-600 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
        >
          <MessageCircle className="w-4 h-4" />
          <span>Message</span>
        </button>

        <div className="flex gap-2">
          <button
            onClick={handleViewProfile}
            disabled={isLoading}
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            <Users className="w-4 h-4" />
            <span>Profile</span>
          </button>

          <button
            onClick={handleRemoveConnection}
            disabled={isLoading}
            className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium hover:bg-red-600 transition-colors disabled:opacity-50 flex items-center justify-center"
            title="Remove Connection"
          >
            ×
          </button>
        </div>
      </div>

      {/* Action Buttons - Desktop */}
      <div className="hidden sm:flex space-x-2 pt-3 border-t border-gray-100">
        <button
          onClick={handleSendMessage}
          disabled={isLoading}
          className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg font-medium hover:bg-blue-100 transition-all duration-200 text-sm flex items-center justify-center space-x-1 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <MessageCircle className="w-3 h-3" />
          <span>Message</span>
        </button>
        <button
          onClick={() => {
            handleViewProfile(email);
          }}
          disabled={isLoading}
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          View Profile
        </button>
      </div>
      {/* Profile Modal */}
      <AnimatePresence mode="wait">
        {isModalOpen && profileViewer && (
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
                  {profileViewer.profileData.profileImage ? (
                    <img
                      src={profileViewer.profileData.profileImage}
                      alt={profileViewer.profileData.fullName}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <FallbackAvatar
                      name={profileViewer.profileData.fullName}
                      className="w-20 h-20 rounded-full text-2xl"
                    />
                  )}
                </div>
                <h2 className="text-xl font-bold text-gray-900 mb-1">
                  {profileViewer.profileData.fullName}
                </h2>
                <p className="text-gray-600 mb-3">
                  {profileViewer.profileData.email}
                </p>

                {profileViewer.profileData.tags &&
                  profileViewer.profileData.tags.length > 0 && (
                    <div className="flex flex-wrap justify-center gap-2 mb-4">
                      {profileViewer.profileData.tags.map((tag, i) => (
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
                  // onClick={() => handleMessageClick(selectedProfile)}
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
    </motion.div>
  );
};
