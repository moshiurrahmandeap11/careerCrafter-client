import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { io } from 'socket.io-client';
import { 
  Bell, 
  Check, 
  Filter,
  Search,
  Settings,
  X,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { NotificationItem } from '../../components/notification-components/NotificationItem';
import { ReTitle } from 're-title';

// Import actions and selectors
import {
  fetchNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  deleteNotification,
  addNotification,
  setActiveFilter,
  setSearchTerm,
  setShowSettings,
  setShowMobileFilters,
  toggleNotificationSetting,
  clearError
} from '../../redux-slices/notificationsSlice';
import {
  selectNotifications,
  selectNotificationsLoading,
  selectNotificationsError,
  selectActiveFilter,
  selectSearchTerm,
  selectShowSettings,
  selectShowMobileFilters,
  selectNotificationSettings,
  selectUnreadCount,
  selectFilteredNotifications,
  selectFilters
} from '../../redux-selectors/notificationsSelectors';

const NotificationPage = () => {
  const dispatch = useDispatch();
  
  // Selectors
  const notifications = useSelector(selectNotifications);
  const loading = useSelector(selectNotificationsLoading);
  const error = useSelector(selectNotificationsError);
  const activeFilter = useSelector(selectActiveFilter);
  const searchTerm = useSelector(selectSearchTerm);
  const showSettings = useSelector(selectShowSettings);
  const showMobileFilters = useSelector(selectShowMobileFilters);
  const notificationSettings = useSelector(selectNotificationSettings);
  const unreadCount = useSelector(selectUnreadCount);
  const filteredNotifications = useSelector(selectFilteredNotifications);
  const filters = useSelector(selectFilters);

  // Socket.IO for real-time notifications
  useEffect(() => {
    const socket = io('http://localhost:3000'); 
    const userEmail = localStorage.getItem('userEmail'); 

    if (userEmail) {
      socket.emit('joinRoom', userEmail); 
    }

    socket.on('newNotification', (notif) => {
      dispatch(addNotification(notif));
    });

    socket.on('notificationUpdated', () => dispatch(fetchNotifications()));
    socket.on('notificationsMarkedAllRead', () => dispatch(fetchNotifications()));
    socket.on('notificationDeleted', () => dispatch(fetchNotifications()));

    return () => {
      socket.disconnect();
    };
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  // Handlers
  const handleMarkAsRead = (id) => dispatch(markNotificationAsRead(id));
  const handleMarkAllAsRead = () => dispatch(markAllNotificationsAsRead());
  const handleDeleteNotification = (id) => dispatch(deleteNotification(id));
  const handleSetActiveFilter = (filter) => dispatch(setActiveFilter(filter));
  const handleSetSearchTerm = (term) => dispatch(setSearchTerm(term));
  const handleSetShowSettings = (show) => dispatch(setShowSettings(show));
  const handleSetShowMobileFilters = (show) => dispatch(setShowMobileFilters(show));
  const handleToggleNotificationSetting = (setting) => dispatch(toggleNotificationSetting(setting));
  const handleClearError = () => dispatch(clearError());
  const handleRetry = () => dispatch(fetchNotifications());

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
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
          onClick={() => handleSetShowMobileFilters(false)}
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
                  onClick={() => handleSetShowMobileFilters(false)}
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
                  onChange={(e) => handleSetSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
              </div>

              {/* Filters */}
              <motion.div className="space-y-2" variants={containerVariants} initial="hidden" animate="visible">
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Filter By</h3>
                </div>
                
                {filters.map((filter) => (
                  <motion.button
                    key={filter.id}
                    onClick={() => { handleSetActiveFilter(filter.id); handleSetShowMobileFilters(false); }}
                    className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${
                      activeFilter === filter.id ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    whileHover={{ x: 4 }}
                  >
                    <span className="font-medium text-sm">{filter.label}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      activeFilter === filter.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'
                    }`}>{filter.count}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <motion.div className="text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <motion.div
          animate={{ rotate: 360, scale: [1, 1.1, 1] }}
          transition={{ rotate: { duration: 2, repeat: Infinity, ease: "linear" }, scale: { duration: 1, repeat: Infinity } }}
          className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
        >
          <Bell className="w-8 h-8 text-white" />
        </motion.div>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="text-gray-600">
          Loading your notifications...
        </motion.p>
      </motion.div>
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
      <motion.div className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
          <Bell className="w-8 h-8 text-red-600" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Notification Error</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <motion.button 
          onClick={handleRetry}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Try Again
        </motion.button>
      </motion.div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ReTitle title='Notifications'/>
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div className="mb-8" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center space-x-4 mb-6 lg:mb-0">
              <div className="p-3 bg-blue-600 rounded-xl shadow-sm">
                <Bell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Notifications</h1>
                <p className="text-lg text-gray-600">{unreadCount} unread of {notifications.length} total</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <motion.button onClick={() => handleSetShowMobileFilters(true)} className="lg:hidden bg-blue-600 text-white p-3 rounded-xl shadow-sm hover:bg-blue-700 transition-colors duration-200" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Filter className="w-5 h-5" />
              </motion.button>

              <motion.button onClick={() => handleSetShowSettings(true)} className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200 p-2 hover:bg-gray-100 rounded-lg" whileHover={{ scale: 1.05 }}>
                <Settings className="w-5 h-5" />
              </motion.button>

              {unreadCount > 0 && (
                <motion.button onClick={handleMarkAllAsRead} className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm" whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
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
          <motion.div className="hidden lg:block lg:w-80 flex-shrink-0" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className="sticky top-18">
              {/* Search */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search notifications..."
                  value={searchTerm}
                  onChange={(e) => handleSetSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
                />
              </div>

              {/* Filters */}
              <motion.div className="space-y-2 bg-white rounded-xl border border-gray-200 p-4 shadow-sm" variants={containerVariants} initial="hidden" animate="visible">
                <div className="flex items-center space-x-2 mb-4">
                  <Filter className="w-4 h-4 text-gray-400" />
                  <h3 className="font-semibold text-gray-900">Filters</h3>
                </div>

                {filters.map((filter) => (
                  <motion.button key={filter.id} onClick={() => handleSetActiveFilter(filter.id)} className={`w-full text-left p-3 rounded-lg transition-all duration-200 flex items-center justify-between group ${activeFilter === filter.id ? 'bg-blue-50 text-blue-700 shadow-sm' : 'text-gray-600 hover:bg-gray-50'}`} whileHover={{ x: 4 }}>
                    <span className="font-medium text-sm">{filter.label}</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${activeFilter === filter.id ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-600'}`}>{filter.count}</span>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>

          {/* Right Column - Notifications */}
          <motion.div className="flex-1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.4 }}>
            {/* Active Filter Display (Mobile) */}
            <div className="lg:hidden mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">
                  Active filter: <span className="font-semibold capitalize">{activeFilter}</span>
                </span>
                <button onClick={() => handleSetShowMobileFilters(true)} className="text-blue-600 text-sm font-medium flex items-center space-x-1">
                  <Filter className="w-4 h-4" />
                  <span>Change</span>
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <motion.div className="space-y-4" variants={containerVariants} initial="hidden" animate="visible">
              {filteredNotifications.map((notification) => (
                <NotificationItem
                  key={notification._id}
                  notification={notification}
                  onMarkAsRead={handleMarkAsRead}
                  onDelete={handleDeleteNotification}
                />
              ))}
            </motion.div>

            {/* Empty State */}
            {filteredNotifications.length === 0 && (
              <motion.div className="text-center py-16 bg-white rounded-xl border border-gray-200" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                <Bell className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {searchTerm ? 'No notifications found' : 'No notifications'}
                </h3>
                <p className="text-gray-600 mb-6">
                  {searchTerm ? 'Try adjusting your search terms' : "You're all caught up! New notifications will appear here."}
                </p>
                {searchTerm && (
                  <button onClick={() => handleSetSearchTerm('')} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200">
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
            onClick={() => handleSetShowSettings(false)}
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
                <button onClick={() => handleSetShowSettings(false)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-4">
                {Object.entries(notificationSettings).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').toLowerCase()}
                    </span>
                    <button onClick={() => handleToggleNotificationSetting(key)} className={`w-12 h-6 rounded-full transition-colors duration-200 ${value ? 'bg-blue-600' : 'bg-gray-300'}`}>
                      <div className={`w-4 h-4 bg-white rounded-full transform transition-transform duration-200 ${value ? 'translate-x-6' : 'translate-x-1'}`} />
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
