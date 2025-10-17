import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion } from 'framer-motion';
import { 
  Users, 
  Clock, 
  Search, 
  Filter,
  Mail,
  UserCheck,
  UserX
} from 'lucide-react';






import useAuth from '../../../hooks/UseAuth/useAuth';
import useAxiosSecure from '../../../hooks/AxiosIntense/useAxiosSecure';
import { fetchPendingRequests, removePendingRequest } from '../../../redux-slices/networkSlice';
import { clearError } from '../../../redux-slices/messagesSlice';
import { PendingCard } from '../../../components/network-components/PendingCard';
import Loader from '../../../components/sharedItems/Loader/Loader';
import EmptyState from './EmptyState/EmptyState';

const PendingConnectPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const axiosSecure = useAxiosSecure();
  const { pendingRequests, isLoading, error, isActionLoading } = useSelector((state) => state.network);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sortBy, setSortBy] = useState('recent'); // recent, oldest, name

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchPendingRequests({ email: user.email, axiosSecure }));
    }
  }, [dispatch, user?.email, axiosSecure]);

  useEffect(() => {
    // Filter and sort requests
    let results = pendingRequests;
    
    // Search filter
    if (searchTerm) {
      results = results.filter(request => 
        request.senderDetails?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.senderDetails?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        request.senderDetails?.profession?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Sort
    results = [...results].sort((a, b) => {
      switch (sortBy) {
        case 'recent':
          return new Date(b.createdAt) - new Date(a.createdAt);
        case 'oldest':
          return new Date(a.createdAt) - new Date(b.createdAt);
        case 'name':
          return (a.senderDetails?.name || '').localeCompare(b.senderDetails?.name || '');
        default:
          return 0;
      }
    });
    
    setFilteredRequests(results);
  }, [pendingRequests, searchTerm, sortBy]);

  const handleRequestUpdate = (requestId, action) => {
    dispatch(removePendingRequest(requestId));
  };

  const handleRetry = () => {
    dispatch(clearError());
    if (user?.email) {
      dispatch(fetchPendingRequests({ email: user.email, axiosSecure }));
    }
  };

  const getDaysAgo = (date) => {
    const today = new Date();
    const requestDate = new Date(date);
    const diffTime = Math.abs(today - requestDate);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStats = () => {
    const total = pendingRequests.length;
    const today = new Date();
    const last7Days = pendingRequests.filter(req => 
      getDaysAgo(req.createdAt) <= 7
    ).length;
    const last30Days = pendingRequests.filter(req => 
      getDaysAgo(req.createdAt) <= 30
    ).length;

    return { total, last7Days, last30Days };
  };

  const stats = getStats();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Loader />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <UserX className="w-16 h-16 text-red-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-red-800 mb-2">Failed to Load Requests</h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={handleRetry}
              className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-6 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Mail className="w-8 h-8 text-blue-600" />
                Connection Requests
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your incoming connection requests
              </p>
            </div>
            
            <div className="flex items-center gap-4 mt-4 md:mt-0">
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-900">{stats.total}</div>
                <div className="text-sm text-gray-500">Total Requests</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
        >
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Requests</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
              </div>
              <Users className="w-8 h-8 text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last 7 Days</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.last7Days}</p>
              </div>
              <Clock className="w-8 h-8 text-green-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Last 30 Days</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{stats.last30Days}</p>
              </div>
              <UserCheck className="w-8 h-8 text-purple-500" />
            </div>
          </div>
        </motion.div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8"
        >
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search Input */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search by name, email, or profession..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <Filter className="text-gray-400 w-5 h-5" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="border border-gray-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="recent">Most Recent</option>
                <option value="oldest">Oldest First</option>
                <option value="name">By Name</option>
              </select>
            </div>
          </div>
        </motion.div>

        {/* Requests List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {filteredRequests.length === 0 ? (
            <EmptyState
              icon={<Mail className="w-16 h-16 text-gray-400" />}
              title={
                pendingRequests.length === 0 
                  ? "No Pending Requests" 
                  : "No Matching Requests"
              }
              description={
                pendingRequests.length === 0
                  ? "When you receive connection requests, they will appear here."
                  : "Try adjusting your search or filter to find what you're looking for."
              }
              action={
                pendingRequests.length === 0 ? null : (
                  <button
                    onClick={() => {
                      setSearchTerm('');
                      setSortBy('recent');
                    }}
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Clear Filters
                  </button>
                )
              }
            />
          ) : (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Pending Requests ({filteredRequests.length})
                </h2>
                {isActionLoading && (
                  <div className="flex items-center gap-2 text-sm text-gray-500">
                    <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                    Processing...
                  </div>
                )}
              </div>

              <div className="grid gap-6">
                {filteredRequests.map((request, index) => (
                  <motion.div
                    key={request._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <PendingCard 
                      invitation={request} 
                      onUpdate={handleRequestUpdate}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          )}
        </motion.div>

        {/* Tips Section */}
        {filteredRequests.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mt-12 bg-blue-50 border border-blue-200 rounded-xl p-6"
          >
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
              💡 Connection Tips
            </h3>
            <ul className="text-blue-800 space-y-1 text-sm">
              <li>• Accept requests from people you know and trust</li>
              <li>• Review profiles before accepting connections</li>
              <li>• Ignore requests that seem suspicious or irrelevant</li>
              <li>• Building a quality network is better than having many connections</li>
            </ul>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default PendingConnectPage;