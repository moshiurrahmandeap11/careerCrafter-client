import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Clock3, Sparkles, UserCheck, UsersRound } from "lucide-react";

const RandomNetwork = () => {
  const { suggestedUsers, users, connections, pendingRequests } = useSelector((state) => state.network);
  const [randomUsers, setRandomUsers] = useState([]);
  const [displayType, setDisplayType] = useState("");

  useEffect(() => {
    // Randomly select which type of network data to display
    const types = ["connections", "suggestions", "pending", "allUsers"];
    const randomType = types[Math.floor(Math.random() * types.length)];
    setDisplayType(randomType);

    let usersToShow = [];
    
    switch (randomType) {
      case "connections":
        usersToShow = connections.slice(0, 6); // Show first 6 connections
        break;
      case "suggestions":
        usersToShow = suggestedUsers.slice(0, 6); // Show first 6 suggestions
        break;
      case "pending":
        usersToShow = pendingRequests.slice(0, 6); // Show first 6 pending requests
        break;
      case "allUsers":
        usersToShow = users.slice(0, 6); // Show first 6 all users
        break;
      default:
        usersToShow = users.slice(0, 6);
    }

    // Shuffle the array for more randomness
    setRandomUsers(usersToShow.sort(() => Math.random() - 0.5));
  }, [connections, suggestedUsers, pendingRequests, users]);

  const getDisplayTitle = () => {
    switch (displayType) {
      case "connections":
        return "Your Connections";
      case "suggestions":
        return "Suggested for You";
      case "pending":
        return "Pending Connections";
      case "allUsers":
        return "People You May Know";
      default:
        return "Network";
    }
  };

  const getDisplayIcon = () => {
    switch (displayType) {
      case "connections":
        return <UserCheck className="text-blue-600" size={20} />;
      case "suggestions":
        return <Sparkles className="text-purple-600" size={20} />;
      case "pending":
        return <Clock3 className="text-orange-600" size={20} />;
      case "allUsers":
        return <UsersRound className="text-green-600" size={20} />;
      default:
        return <UsersRound className="text-gray-600" size={20} />;
    }
  };

  const getDisplayCount = () => {
    switch (displayType) {
      case "connections":
        return connections.length;
      case "suggestions":
        return suggestedUsers.length;
      case "pending":
        return pendingRequests.length;
      case "allUsers":
        return users.length;
      default:
        return 0;
    }
  };

  if (randomUsers.length === 0) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 text-center">
          <p className="text-gray-500">No network suggestions available at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center gap-3">
            {getDisplayIcon()}
            <div>
              <h2 className="text-xl font-bold text-gray-800">{getDisplayTitle()}</h2>
              <p className="text-sm text-gray-600">
                {displayType === "connections" && "People in your professional network"}
                {displayType === "suggestions" && "Based on your profile and interests"}
                {displayType === "pending" && "Connection requests waiting for your response"}
                {displayType === "allUsers" && "Expand your professional network"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              {getDisplayCount()} total
            </span>
          </div>
        </div>
      </div>

      {/* Users Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-6">
        {randomUsers.map((user, index) => (
          <div key={user._id || user.email || index} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 p-6">
            {/* User Avatar and Basic Info */}
            <div className="flex items-center gap-4 mb-4">
              <img
                src={user.photo || user.profileImage || user.senderDetails?.photo || "/default-avatar.png"}
                alt={user.name || user.fullName || user.senderDetails?.name || "User"}
                className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 truncate">
                  {user.name || user.fullName || user.senderDetails?.name || "Unknown User"}
                </h3>
                <p className="text-sm text-gray-600 truncate">
                  {user.profession || user.senderDetails?.profession || "Professional"}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {user.purpose || user.senderDetails?.purpose || "Career Growth"}
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {displayType === "pending" ? (
                <>
                  <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                    Accept
                  </button>
                  <button className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition-colors text-sm font-medium">
                    Ignore
                  </button>
                </>
              ) : (
                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                  Connect
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* View All Button */}
      <div className="text-center mt-8">
        <button className="bg-white border border-blue-600 text-blue-600 py-3 px-8 rounded-lg hover:bg-blue-50 transition-colors font-medium">
          View All {getDisplayTitle()}
        </button>
      </div>
    </div>
  );
};

export default RandomNetwork;