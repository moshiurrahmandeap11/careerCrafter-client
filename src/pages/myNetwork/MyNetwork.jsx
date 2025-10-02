import React, { useState, useEffect } from 'react';
import { 
  Search, 
  UserPlus, 
  Users,  
  Sparkles,
  Network,
  UserCheck,
  Clock,
  Settings,
  Menu,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ConnectionCard } from '../../components/network-components/ConnectionCard';
import { PendingCard } from '../../components/network-components/PendingCard';
import { SuggestionCard } from '../../components/network-components/SuggestionCard';
import { ReTitle } from 're-title';

const MyNetwork = () => {
  const [activeTab, setActiveTab] = useState('connections');
  const [searchTerm, setSearchTerm] = useState('');
  const [connections, setConnections] = useState([]);
  const [pendingInvitations, setPendingInvitations] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data from public folder
      const [connectionsResponse, pendingResponse, suggestionsResponse] = await Promise.all([
        fetch('/data/connections.json'),
        fetch('/data/pending-invitations.json'),
        fetch('/data/suggestions.json')
      ]);

      // Check if all responses are ok
      if (!connectionsResponse.ok || !pendingResponse.ok || !suggestionsResponse.ok) {
        throw new Error('Failed to fetch network data');
      }

      // Parse JSON responses
      const [connectionsData, pendingData, suggestionsData] = await Promise.all([
        connectionsResponse.json(),
        pendingResponse.json(),
        suggestionsResponse.json()
      ]);

      setConnections(connectionsData);
      setPendingInvitations(pendingData);
      setSuggestions(suggestionsData);

    } catch (error) {
      console.error('Error fetching network data:', error);
      setError('Failed to load network data. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setMobileMenuOpen(false);
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



  const tabVariants = {
    hidden: { x: -10, opacity: 0 },
    visible: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 20
      }
    },
    hover: {
      x: 4,
      backgroundColor: "rgba(59, 130, 246, 0.05)"
    },
    active: {
      x: 0,
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      borderLeftColor: "#3b82f6"
    }
  };

  const mobileMenuVariants = {
    closed: {
      x: "-100%",
      opacity: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      pointerEvents: "none"
    },
    open: {
      opacity: 1,
      pointerEvents: "auto"
    }
  };




  const tabs = [
    { id: 'connections', label: 'My Connections', count: connections.length, icon: UserCheck, description: 'Manage your professional network' },
    { id: 'pending', label: 'Pending Invitations', count: pendingInvitations.length, icon: Clock, description: 'Review connection requests' },
    { id: 'suggestions', label: 'Suggestions', count: suggestions.length, icon: Sparkles, description: 'People you may know' },
  ];

  // Mobile Menu Component
  const MobileMenu = () => (
    <AnimatePresence>
      {mobileMenuOpen && (
        <>
          {/* Overlay */}
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
            variants={overlayVariants}
            initial="closed"
            animate="open"
            exit="closed"
            onClick={() => setMobileMenuOpen(false)}
          />
          
          {/* Menu */}
          <motion.div
            className="fixed left-0 top-0 h-full w-80 bg-white z-50 lg:hidden shadow-xl"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-bold text-gray-900">Navigation</h2>
                <motion.button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <X className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

            <div className="p-4">
              {/* Search in Mobile Menu */}
              <div className="relative mb-6">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search network..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
              </div>

              {/* Tabs in Mobile Menu */}
              <motion.div 
                className="space-y-2"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {tabs.map((tab) => (
                  <motion.button
                    key={tab.id}
                    onClick={() => handleTabClick(tab.id)}
                    className={`w-full text-left p-4 rounded-xl border-l-4 transition-all duration-200 flex items-center justify-between group ${
                      activeTab === tab.id
                        ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                        : 'border-transparent text-gray-600 hover:bg-gray-50'
                    }`}
                    variants={tabVariants}
                    whileHover="hover"
                  >
                    <div className="flex items-center space-x-3">
                      <tab.icon className={`w-5 h-5 ${
                        activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                      }`} />
                      <div className="text-left">
                        <div className="font-semibold text-sm">{tab.label}</div>
                        <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
                      </div>
                    </div>
                    <div className={`px-2 py-1 text-xs rounded-full ${
                      activeTab === tab.id
                        ? 'bg-blue-100 text-blue-700'
                        : 'bg-gray-100 text-gray-600'
                    }`}>
                      {tab.count}
                    </div>
                  </motion.button>
                ))}
              </motion.div>
            </div>
          </motion.div>
        </>
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
            <Network className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Building your network...
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
            <Network className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Network Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button 
            onClick={fetchNetworkData}
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
      <ReTitle title='My Network'/>
      {/* Mobile Menu */}
      <MobileMenu />

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div 
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center justify-between mb-6 lg:mb-0">
              <div>
                <motion.h1 
                  className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 }}
                >
                  My Network
                </motion.h1>
                <motion.p 
                  className="text-lg text-gray-600 hidden sm:block"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.2 }}
                >
                  Grow and manage your professional connections
                </motion.p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <motion.button 
                className="hidden sm:flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                whileHover={{ scale: 1.05 }}
              >
                <Settings className="w-5 h-5" />
              </motion.button>
              <motion.button 
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 flex items-center space-x-2 shadow-sm"
                whileHover={{ 
                  scale: 1.05,
                  boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)"
                }}
                whileTap={{ scale: 0.95 }}
              >
                <UserPlus className="w-4 h-4" />
                <span className="hidden sm:inline">Connect</span>
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Two Column Layout */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Column - Tabs (Hidden on mobile) */}
          <motion.div 
            className="hidden lg:block lg:w-80 flex-shrink-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
          >
            {/* Search */}
            <div className="relative mb-6">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search network..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 shadow-sm"
              />
            </div>

            {/* Tabs Navigation */}
            <motion.div 
              className="space-y-2 sticky top-8"
              variants={containerVariants}
              initial="hidden"
              animate="visible"
            >
              {tabs.map((tab) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full text-left p-4 rounded-xl border-l-4 transition-all duration-200 flex items-center justify-between group ${
                    activeTab === tab.id
                      ? 'bg-blue-50 border-blue-500 text-blue-700 shadow-sm'
                      : 'border-transparent text-gray-600 hover:bg-gray-50'
                  }`}
                  variants={tabVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <div className="flex items-center space-x-3">
                    <tab.icon className={`w-5 h-5 ${
                      activeTab === tab.id ? 'text-blue-600' : 'text-gray-400'
                    }`} />
                    <div className="text-left">
                      <div className="font-semibold text-sm">{tab.label}</div>
                      <div className="text-xs text-gray-500 mt-0.5">{tab.description}</div>
                    </div>
                  </div>
                  <div className={`px-2 py-1 text-xs rounded-full ${
                    activeTab === tab.id
                      ? 'bg-blue-100 text-blue-700'
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {tab.count}
                  </div>
                </motion.button>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Column - Content */}
          <motion.div 
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
          >
            {/* Mobile Current Tab Indicator */}
            <div className="lg:hidden mb-6">
              <div className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-200 shadow-sm">
                <div>
                  <h2 className="text-xl font-bold text-gray-900">
                    {tabs.find(tab => tab.id === activeTab)?.label}
                  </h2>
                  <p className="text-gray-600 text-sm mt-1">
                    {tabs.find(tab => tab.id === activeTab)?.description}
                  </p>
                </div>
                <motion.button
                  onClick={() => setMobileMenuOpen(true)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Menu className="w-5 h-5 text-gray-600" />
                </motion.button>
              </div>
            </div>

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
                    className="grid md:grid-cols-2 xl:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {filteredConnections.map((connection, index) => (
                      <ConnectionCard key={connection.id} connection={connection} />
                    ))}
                  </motion.div>
                )}

                {activeTab === 'pending' && (
                  <motion.div 
                    className="grid grid-cols-1 md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {pendingInvitations.map((invitation, index) => (
                      <PendingCard key={invitation.id} invitation={invitation} />
                    ))}
                  </motion.div>
                )}

                {activeTab === 'suggestions' && (
                  <motion.div 
                    className="grid md:grid-cols-2 gap-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {suggestions.map((suggestion, index) => (
                      <SuggestionCard key={suggestion.id} suggestion={suggestion} />
                    ))}
                  </motion.div>
                )}

                {/* Empty state for no data */}
                {activeTab === 'connections' && connections.length === 0 && (
                  <motion.div 
                    className="text-center py-12 bg-white rounded-xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No connections yet</h3>
                    <p className="text-gray-600 mb-6">Start building your network by connecting with colleagues</p>
                    <button className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200">
                      Find Connections
                    </button>
                  </motion.div>
                )}

                {activeTab === 'pending' && pendingInvitations.length === 0 && (
                  <motion.div 
                    className="text-center py-12 bg-white rounded-xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No pending invitations</h3>
                    <p className="text-gray-600 mb-6">All connection requests have been handled</p>
                  </motion.div>
                )}

                {activeTab === 'suggestions' && suggestions.length === 0 && (
                  <motion.div 
                    className="text-center py-12 bg-white rounded-xl border border-gray-200"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <Sparkles className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No suggestions available</h3>
                    <p className="text-gray-600 mb-6">Check back later for new connection suggestions</p>
                  </motion.div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Empty State for search */}
            <AnimatePresence>
              {activeTab === 'connections' && filteredConnections.length === 0 && searchTerm && (
                <motion.div 
                  className="text-center py-12 bg-white rounded-xl border border-gray-200 mt-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">No connections found</h3>
                  <p className="text-gray-600 mb-6">Try adjusting your search criteria</p>
                  <button
                    onClick={() => setSearchTerm('')}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
                  >
                    Clear Search
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default MyNetwork;