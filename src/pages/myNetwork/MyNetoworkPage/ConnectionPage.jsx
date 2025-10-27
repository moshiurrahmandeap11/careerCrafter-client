import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserConnections,
  removeConnectionLocal,
} from "../../../redux-slices/networkSlice"; // removeConnectionLocal ব্যবহার করুন
import { Users, Search } from "lucide-react";
import useAuth from "../../../hooks/UseAuth/useAuth";
import useAxiosSecure from "../../../hooks/AxiosIntense/useAxiosSecure";
import { ConnectionCard } from "../../../components/network-components/ConnectionCard";
import Loader from "../../../components/sharedItems/Loader/Loader";
import EmptyState from "./EmptyState/EmptyState";

const ConnectionsPage = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const axiosSecure = useAxiosSecure();
  const { connections, isLoading, error } = useSelector(
    (state) => state.network
  );

  const [searchTerm, setSearchTerm] = useState("");
  const [filteredConnections, setFilteredConnections] = useState([]);
  useEffect(() => {
    if (user?.email) {
      dispatch(fetchUserConnections({ email: user.email, axiosSecure }));
    }
  }, [dispatch, user?.email, axiosSecure]);

  useEffect(() => {
    // Filter connections based on search
    let results = connections;

    if (searchTerm) {
      results = results.filter((connection) => {
        const connectedUser = connection.connectedUser || {};
        const name = connectedUser.name || connectedUser.fullName || "";
        const profession = connectedUser.profession || "";
        const company = connectedUser.company || "";

        return (
          name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          profession.toLowerCase().includes(searchTerm.toLowerCase()) ||
          company.toLowerCase().includes(searchTerm.toLowerCase())
        );
      });
    }

    setFilteredConnections(results);
  }, [connections, searchTerm]);

  const handleRemoveConnection = (connectionId) => {
    // সরাসরি local state থেকে remove করুন
    dispatch(removeConnectionLocal(connectionId));
  };

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 pt-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
            <h2 className="text-xl font-semibold text-red-800 mb-2">
              Failed to Load Connections
            </h2>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() =>
                dispatch(
                  fetchUserConnections({ email: user.email, axiosSecure })
                )
              }
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
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <Users className="w-8 h-8 text-blue-600" />
                My Connections
              </h1>
              <p className="text-gray-600 mt-2">
                Manage your professional network
              </p>
            </div>
            <div className="mt-4 md:mt-0 text-right">
              <div className="text-2xl font-bold text-gray-900">
                {connections.length}
              </div>
              <div className="text-sm text-gray-500">Total Connections</div>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm mb-8">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search connections by name, profession, or company..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Connections Grid */}
        {filteredConnections.length === 0 ? (
          <EmptyState
            icon={<Users className="w-16 h-16 text-gray-400" />}
            title={
              connections.length === 0
                ? "No Connections Yet"
                : "No Matching Connections"
            }
            description={
              connections.length === 0
                ? "Start building your network by connecting with other professionals."
                : "Try adjusting your search to find what you're looking for."
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredConnections.map((connection, index) => (
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
