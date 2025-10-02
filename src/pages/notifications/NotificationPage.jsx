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
  X,
  Menu
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem } from '../../components/notification-components/NotificationItem';
import { ReTitle } from 're-title';

const NotificationPage = () => {
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [showSettings, setShowSettings] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
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
      // Mock data since we don't have actual API
      const mockNotifications = [
        {
          id: 1,
          type: 'connection',
          senderName: 'Sarah Johnson',
          senderAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face',
          message: 'sent you a connection request',
          time: '2h ago',
          read: false,
          priority: 'high',
          actions: ['accept'],
          mutualConnections: 5
        },
        {
          id: 2,
          type: 'reaction',
          senderName: 'Mike Chen',
          senderAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
          message: 'liked your post',
          time: '4h ago',
          read: true,
          priority: 'medium',
          actions: ['view'],
          postPreview: 'Just launched our new product! Excited to share the journey...'
        },
        {
          id: 3,
          type: 'message',
          senderName: 'Emma Davis',
          senderAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
          message: 'sent you a message',
          time: '1d ago',
          read: false,
          priority: 'high',
          actions: ['reply']
        },
        {
          id: 4,
          type: 'job',
          senderName: 'TechCorp Inc',
          senderAvatar: 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=100&h=100&fit=crop&crop=face',
          message: 'has a new job opening that matches your profile',
          time: '2d ago',
          read: true,
          priority: 'medium',
          actions: ['apply']
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(notification => !notification.read).length);
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







  // Mobile Filters Component
  const MobileFilters = () => (
    <AnimatePresence>
      {showMobileFilters && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setShowMobileFilters(false)}
        >
          <motion.div
            className="absolute right-0 top-0 h-full w-80 bg-white shadow-xl"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6 h-full overflow-y-auto">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-bold text-gray-900">Filters</h3>
                <button
                  onClick={() => setShowMobileFilters(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

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
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Filter By</h3>
                </div>
                
                {filters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    onClick={() => {
                      setActiveFilter(filter.id);
                      setShowMobileFilters(false);
                    }}
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
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
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
      <ReTitle title='Notifications'/>
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
              {/* Mobile Filter Button */}
              <motion.button 
                onClick={() => setShowMobileFilters(true)}
                className="lg:hidden bg-blue-600 text-white p-3 rounded-xl shadow-sm hover:bg-blue-700 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter className="w-5 h-5" />
              </motion.button>

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
          {/* Left Column - Filters (Desktop) */}
          <motion.div 
            className="hidden lg:block lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="sticky top-18">
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
            </div>
          </motion.div>

          {/* Right Column - Notifications */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Active Filter Display (Mobile) */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Active filter: <span className="font-semibold capitalize">{activeFilter}</span>
                </span>
                <button
                  onClick={() => setShowMobileFilters(true)}
                  className="text-blue-600 text-sm font-medium flex items-center space-x-1"
                >
                  <Filter className="w-4 h-4" />
                  <span>Change</span>
                </button>
              </div>
            </div>

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

      {/* Mobile Filters Sidebar */}
      <MobileFilters />

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