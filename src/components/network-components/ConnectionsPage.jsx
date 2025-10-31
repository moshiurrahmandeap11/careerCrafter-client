import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Users, Search, Filter } from 'lucide-react';
import { fetchUserConnections, removeConnectionLocal } from '../../redux-slices/networkSlice';
import useAuth from '../../hooks/UseAuth/useAuth';
import useAxiosSecure from '../../hooks/AxiosIntense/useAxiosSecure';
import ConnectionCard from './ConnectionCard';
import Loader from '../sharedItems/Loader/Loader';


const ConnectionsPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const axiosSecure = useAxiosSecure();
  const { connections, isLoading, error } = useSelector((state) => state.network);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredConnections, setFilteredConnections] = useState([]);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserConnections({ email: user.email, axiosSecure }));
    }
  }, [dispatch, user?.email, axiosSecure]);

  useEffect(() => {
    const results = connections.filter((connection) => {
      const connectedUser = connection.connectedUser || {};
      const name = connectedUser.name || connectedUser.fullName || '';
      const profession = connectedUser.profession || '';
      const company = connectedUser.company || '';

      return (
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        company.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
    setFilteredConnections(results);
  }, [connections, searchTerm]);

  const handleRemoveConnection = (connectionId) => {
    dispatch(removeConnectionLocal(connectionId));
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Failed to Load Connections
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => dispatch(fetchUserConnections({ email: user.email, axiosSecure }))}
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
    <div className="min-h-screen bg-gray-50 py-6">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                My Connections
              </h1>
              <p className="text-gray-600 mt-2 text-sm">
                Manage your professional network
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <div className="text-xl md:text-2xl font-bold text-gray-900">
                {connections.length}
              </div>
              <div className="text-sm text-gray-500">Total Connections</div>
            </div>
          </div>
        </div>

        {/* Connections Grid */}
        {filteredConnections.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-xl border-2 border-dashed border-gray-300">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              {connections.length === 0 ? "No Connections Yet" : "No Matching Connections"}
            </h3>
            <p className="text-gray-500 max-w-md mx-auto">
              {connections.length === 0
                ? "Start building your network by connecting with other professionals."
                : "Try adjusting your search to find what you're looking for."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            {filteredConnections.map((connection) => (
              <ConnectionCard
                key={connection._id}
                connection={connection}
                onRemove={handleRemoveConnection}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConnectionsPage;