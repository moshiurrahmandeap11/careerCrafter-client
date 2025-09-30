import React, { useState, useEffect } from 'react';
import { Search, UserPlus, Users, Mail, MoreHorizontal, Filter, X, Check, MessageCircle, Building, MapPin, Calendar } from 'lucide-react';

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

  const NetworkStats = () => (
    <div className="grid grid-cols-3 gap-4 mb-8">
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <Users className="w-8 h-8 text-blue-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">{connections.length}</div>
        <div className="text-sm text-gray-600">Connections</div>
      </div>
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <UserPlus className="w-8 h-8 text-green-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">{pendingInvitations.length}</div>
        <div className="text-sm text-gray-600">Pending</div>
      </div>
      <div className="bg-white rounded-2xl p-6 text-center border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
        <Mail className="w-8 h-8 text-purple-600 mx-auto mb-2" />
        <div className="text-2xl font-bold text-gray-900">{suggestions.length}</div>
        <div className="text-sm text-gray-600">Suggestions</div>
      </div>
    </div>
  );

  const ConnectionCard = ({ connection, showActions = true }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 group">
      <div className="flex items-start justify-between">
        <div className="flex items-start space-x-4">
          <img
            src={connection.avatar}
            alt={connection.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-white group-hover:border-blue-200 transition-colors duration-300"
          />
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-gray-900 truncate">{connection.name}</h3>
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
            <div className="flex flex-wrap gap-2 mt-3">
              {connection.tags.map((tag, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
        {showActions && (
          <div className="flex items-center space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
              <MessageCircle className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-xl transition-all duration-200">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
        )}
      </div>
      {showActions && (
        <div className="flex space-x-3 mt-4 pt-4 border-t border-gray-100">
          <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2">
            <MessageCircle className="w-4 h-4" />
            <span>Message</span>
          </button>
          <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm">
            View Profile
          </button>
        </div>
      )}
    </div>
  );

  const PendingInvitationCard = ({ invitation }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start space-x-4">
        <img
          src={invitation.avatar}
          alt={invitation.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-white"
        />
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900">{invitation.name}</h3>
          <p className="text-gray-600">{invitation.title} · {invitation.company}</p>
          <p className="text-sm text-gray-500 mt-1">{invitation.location}</p>
          <p className="text-sm text-gray-600 mt-2 bg-gray-50 p-3 rounded-xl">{invitation.message}</p>
        </div>
      </div>
      <div className="flex space-x-3 mt-4">
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2">
          <Check className="w-4 h-4" />
          <span>Accept</span>
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm">
          Ignore
        </button>
      </div>
    </div>
  );

  const SuggestionCard = ({ suggestion }) => (
    <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-start space-x-4">
        <img
          src={suggestion.avatar}
          alt={suggestion.name}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-white"
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
      <div className="flex space-x-3 mt-4">
        <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2">
          <UserPlus className="w-4 h-4" />
          <span>Connect</span>
        </button>
        <button className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-xl font-semibold hover:bg-gray-200 transition-all duration-200 text-sm">
          View Profile
        </button>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your network...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
      </div>

      <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className={`mb-8 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900">My Network</h1>
              <p className="text-lg text-gray-600 mt-2">Manage your professional connections</p>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
              <UserPlus className="w-5 h-5" />
              <span>Add New</span>
            </button>
          </div>
        </div>

        {/* Network Stats */}
        <div className={`mb-8 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} style={{ transitionDelay: '100ms' }}>
          <NetworkStats />
        </div>

        {/* Search and Filters */}
        <div className={`mb-8 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} style={{ transitionDelay: '200ms' }}>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1 max-w-2xl">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search connections..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 shadow-sm"
              />
            </div>
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center space-x-2 bg-white border border-gray-200 rounded-2xl px-4 py-3 text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 shadow-sm"
            >
              <Filter className="w-5 h-5" />
              <span>Filters</span>
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className={`mb-8 transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} style={{ transitionDelay: '300ms' }}>
          <div className="flex space-x-1 bg-white/50 backdrop-blur-sm rounded-2xl p-1 border border-gray-200 shadow-sm inline-flex">
            {[
              { id: 'connections', label: 'Connections', count: connections.length },
              { id: 'pending', label: 'Pending', count: pendingInvitations.length },
              { id: 'suggestions', label: 'Suggestions', count: suggestions.length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className={`transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} style={{ transitionDelay: '400ms' }}>
          {activeTab === 'connections' && (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredConnections.map((connection) => (
                <ConnectionCard key={connection.id} connection={connection} />
              ))}
            </div>
          )}

          {activeTab === 'pending' && (
            <div className="grid md:grid-cols-2 gap-6">
              {pendingInvitations.map((invitation) => (
                <PendingInvitationCard key={invitation.id} invitation={invitation} />
              ))}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="grid md:grid-cols-2 gap-6">
              {suggestions.map((suggestion) => (
                <SuggestionCard key={suggestion.id} suggestion={suggestion} />
              ))}
            </div>
          )}
        </div>

        {/* Empty State */}
        {activeTab === 'connections' && filteredConnections.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-24 h-24 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No connections found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your search or filters</p>
            <button
              onClick={() => setSearchTerm('')}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200"
            >
              Clear Search
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNetwork;