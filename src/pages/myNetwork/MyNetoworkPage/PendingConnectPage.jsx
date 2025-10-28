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

// Real time calculation function for stats
const getTimeAgo = (dateString) => {
    if (!dateString) return 0;
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
    return diffInDays;
};

const PendingConnectPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const axiosSecure = useAxiosSecure();
  const { pendingRequests, isLoading, error, isActionLoading } = useSelector((state) => state.network);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredRequests, setFilteredRequests] = useState([]);
  const [sortBy, setSortBy] = useState('recent');
  const [currentTime, setCurrentTime] = useState(new Date()); // For real-time updates

  // Update time every minute for real-time display
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(interval);
  }, []);

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
  }, [pendingRequests, searchTerm, sortBy, currentTime]); // Add currentTime to dependencies

  const handleRequestUpdate = (requestId, action) => {
    dispatch(removePendingRequest(requestId));
  };

  const handleRetry = () => {
    dispatch(clearError());
    if (user?.email) {
      dispatch(fetchPendingRequests({ email: user.email, axiosSecure }));
    }
  };

  const getStats = () => {
    const total = pendingRequests.length;
    const today = new Date();
    
    const last7Days = pendingRequests.filter(req => {
      const daysAgo = getTimeAgo(req.createdAt);
      return daysAgo <= 7;
    }).length;

    const last30Days = pendingRequests.filter(req => {
      const daysAgo = getTimeAgo(req.createdAt);
      return daysAgo <= 30;
    }).length;

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