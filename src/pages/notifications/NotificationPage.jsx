import React, { useState, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bell,
  MessageCircle,
  User,
  Users,
  Briefcase,
  Check,
  Trash2,
  Settings,
  Filter,
  Search,
  Clock,
  Mail,
  UserPlus,
  ThumbsUp,
  Share2,
} from "lucide-react";
import { ReTitle } from "re-title";

// Redux imports
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  clearAllNotifications,
  setNotificationFilter,
} from "../../redux-slices/notificationsSlice";
import {
  selectNotifications,
  selectUnreadCount,
  selectLoading,
  selectError,
  selectFilter,
} from "../../redux-selectors/notificationsSelectors";
import useAuth from "../../hooks/UseAuth/useAuth";



const NotificationPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();

  // Selectors
  const notifications = useSelector(selectNotifications);
  const unreadCount = useSelector(selectUnreadCount);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const filter = useSelector(selectFilter);

  const [searchTerm, setSearchTerm] = useState("");

  // Fetch notifications
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchNotifications(user.email));
    }
  }, [dispatch, user?.email]);

  // Real-time updates - poll every 30 seconds
  useEffect(() => {
    if (!user?.email) return;

    const interval = setInterval(() => {
      dispatch(fetchNotifications(user.email));
    }, 30000);

    return () => clearInterval(interval);
  }, [dispatch, user?.email]);

  // Filter notifications based on search and filter
  const filteredNotifications = notifications.filter((notification) => {
    const matchesSearch = notification.message
      .toLowerCase()
      .includes(searchTerm.toLowerCase()) ||
      notification.senderName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase());

    const matchesFilter = 
      filter === 'all' ? true :
      filter === 'unread' ? !notification.isRead :
      filter === 'messages' ? notification.type === 'message' :
      filter === 'network' ? ['connection_request', 'connection_accepted'].includes(notification.type) :
      filter === 'jobs' ? ['job_match', 'application_update'].includes(notification.type) :
      true;

    return matchesSearch && matchesFilter;
  });

  // Handlers
  const handleMarkAsRead = useCallback((notificationId) => {
    dispatch(markNotificationAsRead(notificationId));
  }, [dispatch]);

  const handleMarkAllAsRead = useCallback(() => {
    if (user?.email) {
      dispatch(markAllNotificationsAsRead(user.email));
    }
  }, [dispatch, user?.email]);

  const handleDeleteNotification = useCallback((notificationId) => {
    dispatch(deleteNotification(notificationId));
  }, [dispatch]);

  const handleClearAll = useCallback(() => {
    if (user?.email) {
      dispatch(clearAllNotifications(user.email));
    }
  }, [dispatch, user?.email]);

  const handleFilterChange = useCallback((newFilter) => {
    dispatch(setNotificationFilter(newFilter));
  }, [dispatch]);

  const handleNotificationClick = useCallback(async (notification) => {
    // Mark as read when clicked
    if (!notification.isRead) {
      handleMarkAsRead(notification._id);
    }

    // Handle different notification types
    switch (notification.type) {
      case 'message':
        // Navigate to messages page with the specific conversation
        window.location.href = `/messages`;
        break;
      case 'connection_request':
        // Navigate to network page
        window.location.href = `/network`;
        break;
      case 'job_match':
        // Navigate to jobs page
        window.location.href = `/jobs`;
        break;
      default:
        // Default behavior - just mark as read
        break;
    }
  }, [handleMarkAsRead]);

  // Notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case 'message':
        return <MessageCircle className="w-5 h-5 text-blue-600" />;
      case 'connection_request':
        return <UserPlus className="w-5 h-5 text-green-600" />;
      case 'connection_accepted':
        return <Users className="w-5 h-5 text-green-600" />;
      case 'job_match':
        return <Briefcase className="w-5 h-5 text-purple-600" />;
      case 'application_update':
        return <ThumbsUp className="w-5 h-5 text-amber-600" />;
      case 'system':
        return <Bell className="w-5 h-5 text-gray-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  // Notification background color based on type
  const getNotificationBgColor = (type) => {
    switch (type) {
      case 'message':
        return 'bg-blue-50 border-blue-200';
      case 'connection_request':
        return 'bg-green-50 border-green-200';
      case 'connection_accepted':
        return 'bg-green-50 border-green-200';
      case 'job_match':
        return 'bg-purple-50 border-purple-200';
      case 'application_update':
        return 'bg-amber-50 border-amber-200';
      case 'system':
        return 'bg-gray-50 border-gray-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  // Format timestamp
  const formatTime = (timestamp) => {
    const now = new Date();
    const notificationTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now - notificationTime) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h ago`;
    return notificationTime.toLocaleDateString();
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity },
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <Bell className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Loading your notifications...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <Bell className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Notifications Error
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={() => dispatch(fetchNotifications(user?.email))}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ReTitle
        title={`Notifications${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
      />

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Notifications{unreadCount > 0 && ` (${unreadCount})`}
              </h1>
              <p className="text-lg text-gray-600">
                Stay updated with your latest activities
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-3">
              {unreadCount > 0 && (
                <motion.button
                  onClick={handleMarkAllAsRead}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check className="w-4 h-4" />
                  <span>Mark all as read</span>
                </motion.button>
              )}
              
              {notifications.length > 0 && (
                <motion.button
                  onClick={handleClearAll}
                  className="bg-red-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-red-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Trash2 className="w-4 h-4" />
                  <span>Clear all</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6">
            {/* Search and Filter Bar */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              {/* Search */}
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2">
                {[
                  { key: 'all', label: 'All', icon: Bell },
                  { key: 'unread', label: 'Unread', icon: Mail },
                  { key: 'messages', label: 'Messages', icon: MessageCircle },
                  { key: 'network', label: 'Network', icon: Users },
                  { key: 'jobs', label: 'Jobs', icon: Briefcase },
                ].map((filterItem) => (
                  <motion.button
                    key={filterItem.key}
                    onClick={() => handleFilterChange(filterItem.key)}
                    className={`flex items-center space-x-2 px-4 py-2.5 rounded-lg font-medium transition-all duration-200 ${
                      filter === filterItem.key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <filterItem.icon className="w-4 h-4" />
                    <span>{filterItem.label}</span>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Notifications List */}
            <div className="space-y-4">
              <AnimatePresence>
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification, index) => (
                    <motion.div
                      key={notification._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 cursor-pointer hover:shadow-md ${
                        notification.isRead 
                          ? getNotificationBgColor(notification.type) 
                          : `${getNotificationBgColor(notification.type).replace('50', '100')} border-l-4 border-l-blue-500`
                      }`}
                      onClick={() => handleNotificationClick(notification)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-4 flex-1">
                          {/* Icon */}
                          <div className="flex-shrink-0 mt-1">
                            {getNotificationIcon(notification.type)}
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center space-x-2 mb-1">
                              {notification.senderImage && (
                                <img
                                  src={notification.senderImage}
                                  alt={notification.senderName}
                                  className="w-6 h-6 rounded-full object-cover"
                                />
                              )}
                              <p className="text-sm font-semibold text-gray-900">
                                {notification.senderName || 'Career Crafter'}
                              </p>
                              {!notification.isRead && (
                                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                              )}
                            </div>
                            
                            <p className="text-gray-700 mb-2">
                              {notification.message}
                            </p>
                            
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              <div className="flex items-center space-x-1">
                                <Clock className="w-3 h-3" />
                                <span>{formatTime(notification.timestamp)}</span>
                              </div>
                              <span className="capitalize">{notification.type.replace('_', ' ')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex items-center space-x-2 ml-4">
                          {!notification.isRead && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleMarkAsRead(notification._id);
                              }}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              title="Mark as read"
                            >
                              <Check className="w-4 h-4" />
                            </motion.button>
                          )}
                          
                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteNotification(notification._id);
                            }}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            title="Delete notification"
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-12"
                  >
                    <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm || filter !== 'all' 
                        ? "No notifications found" 
                        : "No notifications yet"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {searchTerm || filter !== 'all'
                        ? "Try adjusting your search or filter"
                        : "Your notifications will appear here"}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;