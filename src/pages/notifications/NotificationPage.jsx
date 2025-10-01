import React, { useState, useEffect } from 'react';
import { 
  Bell, 
  Check, 
  MoreHorizontal, 
  UserPlus, 
  MessageCircle, 
  ThumbsUp, 
  Share2, 
  Users,
  Calendar,
  Award,
  Eye,
  EyeOff,
  Filter,
  Search,
  Settings,
  Mail,
  Clock,
  Sparkles,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState({
    messages: true,
    connectionRequests: true,
    reactions: true,
    mentions: true,
    jobAlerts: true,
    recommendations: true
  });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await fetch('/data/notifications.json');
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }
      
      const data = await response.json();
      setNotifications(data);
      setUnreadCount(data.filter(notification => !notification.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = (id) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id ? { ...notification, read: true } : notification
      )
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
    setUnreadCount(0);
  };

  const deleteNotification = (id) => {
    const notification = notifications.find(n => n.id === id);
    if (notification && !notification.read) {
      setUnreadCount(prev => Math.max(0, prev - 1));
    }
    setNotifications(prev => prev.filter(notification => notification.id !== id));
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesFilter = activeFilter === 'all' || 
      (activeFilter === 'unread' && !notification.read) ||
      notification.type === activeFilter;
    
    const matchesSearch = searchTerm === '' || 
      notification.senderName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesFilter && matchesSearch;
  });

  const filters = [
    { id: 'all', label: 'All', count: notifications.length },
    { id: 'unread', label: 'Unread', count: unreadCount },
    { id: 'connection', label: 'Connections', count: notifications.filter(n => n.type === 'connection').length },
    { id: 'reaction', label: 'Reactions', count: notifications.filter(n => n.type === 'reaction').length },
    { id: 'message', label: 'Messages', count: notifications.filter(n => n.type === 'message').length },
    { id: 'job', label: 'Jobs', count: notifications.filter(n => n.type === 'job').length }
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -2,
      backgroundColor: "rgba(249, 250, 251, 1)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    }
  };

  const NotificationIcon = ({ type, priority }) => {
    const getIconProps = () => {
      switch (type) {
        case 'connection':
          return { icon: UserPlus, color: 'text-blue-600', bgColor: 'bg-blue-50' };
        case 'reaction':
          return { icon: ThumbsUp, color: 'text-green-600', bgColor: 'bg-green-50' };
        case 'message':
          return { icon: MessageCircle, color: 'text-purple-600', bgColor: 'bg-purple-50' };
        case 'mention':
          return { icon: Share2, color: 'text-orange-600', bgColor: 'bg-orange-50' };
        case 'job':
          return { icon: Award, color: 'text-amber-600', bgColor: 'bg-amber-50' };
        case 'recommendation':
          return { icon: Users, color: 'text-indigo-600', bgColor: 'bg-indigo-50' };
        default:
          return { icon: Bell, color: 'text-gray-600', bgColor: 'bg-gray-50' };
      }
    };

    const { icon: Icon, color, bgColor } = getIconProps();
    
    return (
      <div className={`p-2 rounded-lg ${bgColor} ${color} relative`}>
        <Icon className="w-4 h-4" />
        {priority === 'high' && (
          <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
        )}
      </div>
    );
  };

  const NotificationItem = ({ notification }) => (
    <motion.div
      variants={itemVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      className={`p-4 rounded-xl border transition-all duration-300 ${
        notification.read 
          ? 'bg-white border-gray-200' 
          : 'bg-blue-50 border-blue-200 shadow-sm'
      }`}
    >
      <div className="flex items-start space-x-3">
        {/* Avatar */}
        <div className="relative">
          <img
            src={notification.senderAvatar}
            alt={notification.senderName}
            className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
          />
          <div className="absolute -bottom-1 -right-1">
            <NotificationIcon type={notification.type} priority={notification.priority} />
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1">
              <p className="text-gray-900 text-sm leading-relaxed">
                <span className="font-semibold">{notification.senderName}</span>
                {' '}{notification.message}
              </p>
              
              {notification.postPreview && (
                <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                  <p className="text-gray-600 text-sm italic">"{notification.postPreview}"</p>
                </div>
              )}
              
              {notification.mutualConnections && (
                <div className="flex items-center space-x-1 mt-2 text-xs text-blue-600">
                  <Users className="w-3 h-3" />
                  <span>{notification.mutualConnections} mutual connections</span>
                </div>
              )}
            </div>

            {/* Time and Actions */}
            <div className="flex items-start space-x-2 ml-2">
              <span className="text-xs text-gray-500 whitespace-nowrap">
                {notification.time}
              </span>
              <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                {!notification.read && (
                  <motion.button
                    onClick={() => markAsRead(notification.id)}
                    className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <Check className="w-3 h-3" />
                  </motion.button>
                )}
                <motion.button
                  onClick={() => deleteNotification(notification.id)}
                  className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-3 h-3" />
                </motion.button>
              </div>
            </div>
          </div>

          {/* Actions */}
          {notification.actions && (
            <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
              {notification.actions.includes('accept') && (
                <motion.button
                  className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Accept
                </motion.button>
              )}
              {notification.actions.includes('reply') && (
                <motion.button
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Reply
                </motion.button>
              )}
              {notification.actions.includes('view') && (
                <motion.button
                  className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View Post
                </motion.button>
              )}
              {notification.actions.includes('apply') && (
                <motion.button
                  className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Apply Now
                </motion.button>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );

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
              scale: [1, 1.1, 1]
            }}
            transition={{ 
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity }
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
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Notification Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button 
            onClick={fetchNotifications}
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
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-6 lg:mb-0">
              <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                  Notifications
                </h1>
                <p className="text-lg text-gray-600">
                  {unreadCount} unread of {notifications.length} total
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button 
                onClick={() => setShowSettings(true)}
                className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              
              {unreadCount > 0 && (
                <motion.button 
                  onClick={markAllAsRead}
                  className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Check className="w-4 h-4" />
                  <span>Mark all as read</span>
                </motion.button>
              )}
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Filters */}
          <motion.div 
            className="lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search notifications..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Filters */}
            <motion.div 
              className="space-y-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              <div className="flex items-center space-x-2 mb-4">
                <Filter className="w-4 h-4 text-gray-400" />
                <h3 className="font-semibold text-gray-900">Filters</h3>
              </div>
              
              {filters.map((filter) => (
                <motion.button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                    activeFilter === filter.id
                      ? 'bg-blue-50 text-blue-700 shadow-sm'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  <span className="font-medium text-sm">{filter.label}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    activeFilter === filter.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {filter.count}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Notifications */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Notifications List */}
            <motion.div 
              className="space-y-4"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {filteredNotifications.map((notification) => (
                <NotificationItem 
                  key={notification.id} 
                  notification={notification} 
                />
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <motion.div 
                className="text-center py-16 bg-white rounded-xl border border-gray-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No notifications found' : 'No notifications'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm 
                    ? 'Try adjusting your search terms' 
                    : "You're all caught up! New notifications will appear here."}
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
                  >
                    Clear Search
                  </button>
                )}
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setShowSettings(false)}
          >
            <motion.div
              className="bg-white rounded-2xl p-6 w-full max-w-md"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Notification Settings</h3>
                <button
                  onClick={() => setShowSettings(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              
              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <button
                      onClick={() => setNotificationSettings(prev => ({
                        ...prev,
                        [key]: !value
                      }))}
                      className={`w-12 h-6 rounded-full transition-colors duration-200 ${
                        value ? 'bg-blue-600' : 'bg-gray-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${
                          value ? 'translate-x-7' : 'translate-x-1'
                        }`}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationPage;