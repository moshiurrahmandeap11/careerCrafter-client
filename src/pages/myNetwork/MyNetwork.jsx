import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Mail, MoreHorizontal, Filter, X, Check, MessageCircle, Building, MapPin, Calendar } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const MyNetwork = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [connections, setConnections] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setIsVisible(true);
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      
      // Fetch all data in parallel
      const [connectionsRes, pendingRes, suggestionsRes] = await Promise.all([
        fetch('/mock-data/connections.json'),
        fetch('/mock-data/pending-invitations.json'),
        fetch('/mock-data/suggestions.json')
      ]);

      if (!connectionsRes.ok || !pendingRes.ok || !suggestionsRes.ok) {
        throw new Error('Failed to fetch network data');
      }

      const connectionsData = await connectionsRes.json();
      const pendingData = await pendingRes.json();
      const suggestionsData = await suggestionsRes.json();

      setConnections(connectionsData);
      setPendingInvitations(pendingData);
      setSuggestions(suggestionsData);
    } catch (error) {
      console.error('Error fetching network data:', error);
      // Fallback to empty arrays if fetch fails
      setConnections([]);
      setPendingInvitations([]);
      setSuggestions([]);
    } finally {
      setLoading(false);
    }
  };

  const filteredConnections = connections.filter(connection =>
    connection.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    connection.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
        stiffness: 100,
        damping: 12
      }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0, scale: 0.95 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    },
    hover: {
      y: -4,
      scale: 1.02,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: {
      scale: 0.98
    }
  };

  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 15
      }
    },
    hover: {
      scale: 1.05,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 10
      }
    }
  };

  const tabVariants = {
    hidden: { scale: 0.9, opacity: 0 },
    visible: {
      scale: 1,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      scale: 1.05,
      backgroundColor: "rgba(59, 130, 246, 0.1)"
    },
    active: {
      scale: 1,
      backgroundColor: "#ffffff"
    }
  };

  const NetworkStats = () => (
    <motion.div 
      className="grid grid-cols-3 gap-4 mb-8"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {[
        { icon: Users, count: connections.length, label: "Connections", color: "blue" },
        { icon: UserPlus, count: pendingInvitations.length, label: "Pending", color: "green" },
        { icon: Mail, count: suggestions.length, label: "Suggestions", color: "purple" }
      ].map((stat, index) => (
        <motion.div
          key={stat.label}
          className={`bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300`}
          variants={statsVariants}
          whileHover="hover"
          initial="hidden"
          animate="visible"
          transition={{ delay: index * 0.1 }}
        >
          <stat.icon className={`w-8 h-8 text-${stat.color}-600 mx-auto mb-2`} />
          <div className="text-2xl font-bold text-gray-900">{stat.count}</div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );

  const ConnectionCard = ({ connection, showActions = true }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group cursor-pointer"
    >
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <motion.img
            src={connection.avatar}
            alt={connection.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white group-hover:border-blue-200 transition-colors duration-300"
            whileHover={{ scale: 1.1, rotate: 2 }}
            transition={{ type: "spring", stiffness: 300 }}
          />
          <div className="flex-1 min-w-0">
            <motion.h3 
              className="text-lg font-semibold text-gray-900 truncate"
              whileHover={{ color: "#2563eb" }}
            >
              {connection.name}
            </motion.h3>
            <p className="text-gray-600 truncate">{connection.title}</p>
            <div className="flex items-center space-x-2 mt-1 text-sm text-gray-500">
              <Building className="w-4 h-4" />
              <span>{connection.company}</span>
              <MapPin className="w-4 h-4 ml-2" />
              <span>{connection.location}</span>
            </div>
            <div className="flex items-center mt-2 text-sm text-blue-600">
              <Users className="w-4 h-4 mr-1" />
              <span>{connection.mutual} mutual connections</span>
            </div>
            <motion.div 
              className="flex flex-wrap gap-2 mt-3"
              layout
            >
              {connection.tags.map((tag, index) => (
                <motion.span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ scale: 1.1, backgroundColor: "#dbeafe" }}
                >
                  {tag}
                </motion.span>
              ))}
            </motion.div>
          </div>
        </div>
        {showActions && (
          <motion.div 
            className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            initial={{ opacity: 0, x: 10 }}
            whileHover={{ opacity: 1, x: 0 }}
          >
            <motion.button 
              className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MessageCircle className="w-5 h-5" />
            </motion.button>
            <motion.button 
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <MoreHorizontal className="w-5 h-5" />
            </motion.button>
          </motion.div>
        )}
      </div>
      {showActions && (
        <motion.div 
          className="flex space-x-3 mt-4 pt-4 border-t border-gray-100"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ delay: 0.2 }}
        >
          <motion.button 
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2"
            whileHover={{ 
              scale: 1.02,
              boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
            }}
            whileTap={{ scale: 0.98 }}
          >
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </motion.button>
          <motion.button 
            className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
            whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
            whileTap={{ scale: 0.98 }}
          >
            View Profile
          </motion.button>
        </motion.div>
      )}
    </motion.div>
  );

  const PendingInvitationCard = ({ invitation }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <motion.img
          src={invitation.avatar}
          alt={invitation.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-white"
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{invitation.name}</h3>
          <p className="text-gray-600">{invitation.title} · {invitation.company}</p>
          <p className="text-sm text-gray-500 mt-1">{invitation.location}</p>
          <motion.p 
            className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            {invitation.message}
          </motion.p>
        </div>
      </div>
      <motion.div 
        className="flex space-x-3 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <motion.button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <Check className="w-4 h-4" />
          <span>Accept</span>
        </motion.button>
        <motion.button 
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
          whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
          whileTap={{ scale: 0.98 }}
        >
          Ignore
        </motion.button>
      </motion.div>
    </motion.div>
  );

  const SuggestionCard = ({ suggestion }) => (
    <motion.div
      variants={cardVariants}
      initial="hidden"
      animate="visible"
      whileHover="hover"
      whileTap="tap"
      className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300"
    >
      <div className="flex items-start space-x-4">
        <motion.img
          src={suggestion.avatar}
          alt={suggestion.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-white"
          whileHover={{ scale: 1.1, rotate: 2 }}
          transition={{ type: "spring", stiffness: 300 }}
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{suggestion.name}</h3>
          <p className="text-gray-600">{suggestion.title} · {suggestion.company}</p>
          <p className="text-sm text-gray-500 mt-1">{suggestion.location}</p>
          <div className="flex items-center mt-2 text-sm text-blue-600">
            <Users className="w-4 h-4 mr-1" />
            <span>{suggestion.mutual} mutual connections</span>
          </div>
        </div>
      </div>
      <motion.div 
        className="flex space-x-3 mt-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <motion.button 
          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2"
          whileHover={{ 
            scale: 1.02,
            boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
          }}
          whileTap={{ scale: 0.98 }}
        >
          <UserPlus className="w-4 h-4" />
          <span>Connect</span>
        </motion.button>
        <motion.button 
          className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
          whileHover={{ scale: 1.02, backgroundColor: "#e5e7eb" }}
          whileTap={{ scale: 0.98 }}
        >
          View Profile
        </motion.button>
      </motion.div>
    </motion.div>
  );

  if (loading) {
    return (
      <motion.div 
        className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <motion.div 
          className="text-center"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Loading your network...
          </motion.p>
        </motion.div>
      </motion.div>
    );
  }

  return (
    <motion.div 
      className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30"
          animate={{
            scale: [1.1, 1, 1.1],
            opacity: [0.3, 0.4, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1
          }}
        />
      </div>

      <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: "spring", stiffness: 100 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <motion.h1 
                className="text-4xl font-bold text-gray-900"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                My Network
              </motion.h1>
              <motion.p 
                className="text-lg text-gray-600 mt-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
              >
                Manage your professional connections
              </motion.p>
            </div>
            <motion.button 
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2"
              whileHover={{ 
                scale: 1.05,
                boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
              }}
              whileTap={{ scale: 0.95 }}
            >
              <UserPlus className="w-5 h-5" />
              <span>Add New</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Network Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <NetworkStats />
        </motion.div>

        {/* Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <motion.input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
                whileFocus={{ scale: 1.01 }}
              />
            </div>
            <motion.button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-sm"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-8"
        >
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-gray-200 shadow-sm inline-flex">
            {[
              { id: 'connections', label: 'Connections', count: connections.length },
              { id: 'pending', label: 'Pending', count: pendingInvitations.length },
              { id: 'suggestions', label: 'Suggestions', count: suggestions.length }
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                variants={tabVariants}
                initial="hidden"
                animate={activeTab === tab.id ? "active" : "visible"}
                whileHover="hover"
                whileTap="tap"
              >
                <span>{tab.label}</span>
                <motion.span 
                  className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  {tab.count}
                </motion.span>
              </motion.button>
            ))}
          </div>
        </motion.div>

        {/* Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === 'connections' && (
              <motion.div 
                className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {filteredConnections.map((connection, index) => (
                  <motion.div
                    key={connection.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <ConnectionCard connection={connection} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'pending' && (
              <motion.div 
                className="grid md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {pendingInvitations.map((invitation, index) => (
                  <motion.div
                    key={invitation.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <PendingInvitationCard invitation={invitation} />
                  </motion.div>
                ))}
              </motion.div>
            )}

            {activeTab === 'suggestions' && (
              <motion.div 
                className="grid md:grid-cols-2 gap-6"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={suggestion.id}
                    variants={itemVariants}
                    custom={index}
                  >
                    <SuggestionCard suggestion={suggestion} />
                  </motion.div>
                ))}
              </motion.div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Empty State */}
        <AnimatePresence>
          {activeTab === 'connections' && filteredConnections.length === 0 && (
            <motion.div 
              className="text-center py-12"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <motion.div
                animate={{ 
                  y: [0, -10, 0],
                  rotate: [0, 5, 0, -5, 0]
                }}
                transition={{ 
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              >
                <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No connections found</h3>
              <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
              <motion.button
                onClick={() => setSearchTerm('')}
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                Clear Search
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default MyNetwork;