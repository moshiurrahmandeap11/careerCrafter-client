import React, { useEffect, useState } from "react";
import axiosIntense from "../../../../hooks/AxiosIntense/axiosIntense";
import Loader from "../../../sharedItems/Loader/Loader";
import { MessageCircle, Users, Mail, Calendar, ArrowUpDown } from "lucide-react";

const Messages = () => {
  const [users, setUsers] = useState([]);  
  const [allMessages, setAllMessages] = useState([]);  
  const [userMessageStats, setUserMessageStats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [blockedCount, setBlockedCount] = useState(0);
  const [sortBy, setSortBy] = useState('messageCount');
  const [sortOrder, setSortOrder] = useState('desc');

  // Calculate user message statistics
  const calculateUserStats = (messages, users) => {
    const userStats = {};
    
    // Initialize all users with zero messages
    users.forEach(user => {
      userStats[user.email] = {
        email: user.email,
        fullName: user.fullName || user.email,
        messageCount: 0,
        lastMessageTime: null,
        conversations: new Set()
      };
    });

    // Count messages and track conversations
    messages.forEach(msg => {
      // Count for sender
      if (userStats[msg.fromEmail]) {
        userStats[msg.fromEmail].messageCount++;
        userStats[msg.fromEmail].conversations.add(msg.toEmail);
        if (!userStats[msg.fromEmail].lastMessageTime || new Date(msg.timestamp) > new Date(userStats[msg.fromEmail].lastMessageTime)) {
          userStats[msg.fromEmail].lastMessageTime = msg.timestamp;
        }
      }

      // Count for receiver (to track conversations)
      if (userStats[msg.toEmail]) {
        userStats[msg.toEmail].conversations.add(msg.fromEmail);
        if (!userStats[msg.toEmail].lastMessageTime || new Date(msg.timestamp) > new Date(userStats[msg.toEmail].lastMessageTime)) {
          userStats[msg.toEmail].lastMessageTime = msg.timestamp;
        }
      }
    });

    // Convert to array and calculate conversation counts
    const statsArray = Object.values(userStats).map(user => ({
      ...user,
      conversationCount: user.conversations.size,
      conversations: Array.from(user.conversations)
    }));

    return statsArray;
  };

  // Sort user stats
  const sortUserStats = (stats) => {
    return stats.sort((a, b) => {
      let aValue, bValue;
      
      switch (sortBy) {
        case 'name':
          aValue = a.fullName.toLowerCase();
          bValue = b.fullName.toLowerCase();
          break;
        case 'email':
          aValue = a.email.toLowerCase();
          bValue = b.email.toLowerCase();
          break;
        case 'conversations':
          aValue = a.conversationCount;
          bValue = b.conversationCount;
          break;
        case 'lastActivity':
          aValue = new Date(a.lastMessageTime || 0);
          bValue = new Date(b.lastMessageTime || 0);
          break;
        case 'messageCount':
        default:
          aValue = a.messageCount;
          bValue = b.messageCount;
      }

      if (sortOrder === 'asc') {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
      } else {
        return aValue > bValue ? -1 : aValue < bValue ? 1 : 0;
      }
    });
  };

  const handleSort = (column) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('desc');
    }
  };

  const cleanHistory = async () => {
    try {
      setLoading(true);
      const res = await axiosIntense.get("/messageUsers/allMessages");
      const { messages: cleanMessages = [], blockedCount: cleanBlockedCount = 0 } = res.data || {};
      setAllMessages(cleanMessages);
      
      const stats = calculateUserStats(cleanMessages, users);
      const sortedStats = sortUserStats(stats);
      setUserMessageStats(sortedStats);

      setBlockedCount(cleanBlockedCount);
      
      setLoading(false);
      alert(`History cleaned! Removed ${cleanBlockedCount} hate speech messages.`);  
    } catch (err) {
      console.error("Clean error:", err);
      setLoading(false);
      alert("Failed to clean history. Try again.");
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Fetch users
        const usersRes = await axiosIntense.get(`/messageUsers/usersEmail?email=dummy@example.com`);
        setUsers(usersRes.data || []);

        // Fetch messages
        const messagesRes = await axiosIntense.get("/messageUsers/allMessages");
        const { messages: fetchedMessages = [], blockedCount: fetchedBlockedCount = 0 } = messagesRes.data || {};
        setAllMessages(fetchedMessages);
        
        setBlockedCount(fetchedBlockedCount);

        // Calculate and set user statistics
        const stats = calculateUserStats(fetchedMessages, usersRes.data || []);
        const sortedStats = sortUserStats(stats);
        setUserMessageStats(sortedStats);

        setLoading(false);
      } catch (err) {
        console.error("Error fetching data:", err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Re-sort when sort criteria changes
  useEffect(() => {
    if (userMessageStats.length > 0) {
      const sortedStats = sortUserStats([...userMessageStats]);
      setUserMessageStats(sortedStats);
    }
  }, [sortBy, sortOrder]);

  if (loading) return <Loader />;

  const totalMessages = userMessageStats.reduce((sum, user) => sum + user.messageCount, 0);
  const activeUsers = userMessageStats.filter(user => user.messageCount > 0).length;
  const totalConversations = new Set(
    userMessageStats.flatMap(user => user.conversations)
  ).size;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-6 md:mb-8">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Messages Analytics
          </h1>
          <p className="text-gray-600">
            User messaging statistics and activity overview
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{users.length}</div>
                <div className="text-sm text-gray-600">Total Users</div>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{activeUsers}</div>
                <div className="text-sm text-gray-600">Active Messengers</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalMessages}</div>
                <div className="text-sm text-gray-600">Total Messages</div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                <MessageCircle className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold text-gray-900">{totalConversations}</div>
                <div className="text-sm text-gray-600">Active Conversations</div>
              </div>
            </div>
          </div>
        </div>

        {/* Control Panel */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">User Messaging Statistics</h3>
              <p className="text-gray-600">
                Blocked hate messages: <span className="font-semibold text-red-600">{blockedCount}</span>
              </p>
            </div>
            
            <button 
              onClick={cleanHistory}
              className="bg-red-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:opacity-50 whitespace-nowrap"
              disabled={loading}
            >
              {loading ? "Cleaning..." : "Clean Hate Speech"}
            </button>
          </div>
        </div>

        {/* User Message Statistics Table */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Desktop Table */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('name')}>
                    <div className="flex items-center space-x-1">
                      <span>User</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('email')}>
                    <div className="flex items-center space-x-1">
                      <span>Email</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('messageCount')}>
                    <div className="flex items-center space-x-1">
                      <span>Messages Sent</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('conversations')}>
                    <div className="flex items-center space-x-1">
                      <span>Conversations</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                      onClick={() => handleSort('lastActivity')}>
                    <div className="flex items-center space-x-1">
                      <span>Last Activity</span>
                      <ArrowUpDown className="w-4 h-4" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {userMessageStats.map((user) => (
                  <tr key={user.email} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="text-sm font-semibold text-gray-900">
                        {user.fullName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-600">{user.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <MessageCircle className="w-4 h-4 text-blue-500" />
                        <span className="text-sm font-medium text-gray-900">
                          {user.messageCount}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 font-medium">
                        {user.conversationCount}
                      </div>
                      {user.conversationCount > 0 && (
                        <div className="text-xs text-gray-500 mt-1">
                          {user.conversations.slice(0, 2).join(', ')}
                          {user.conversationCount > 2 && ` +${user.conversationCount - 2} more`}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <div className="text-sm text-gray-600">
                          {user.lastMessageTime 
                            ? new Date(user.lastMessageTime).toLocaleDateString()
                            : 'No activity'
                          }
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile Cards */}
          <div className="lg:hidden">
            {userMessageStats.map((user) => (
              <div key={user.email} className="border-b border-gray-200 p-4 last:border-b-0">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold text-gray-900">
                      {user.fullName}
                    </div>
                    <div className="text-xs text-gray-600">{user.email}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900">
                      {user.messageCount} messages
                    </div>
                    <div className="text-xs text-gray-500">
                      {user.conversationCount} conversations
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-3 h-3" />
                    <span>
                      {user.lastMessageTime 
                        ? new Date(user.lastMessageTime).toLocaleDateString()
                        : 'No activity'
                      }
                    </span>
                  </div>
                  {user.conversationCount > 0 && (
                    <div className="text-xs text-gray-500">
                      Active in {user.conversationCount} chats
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Empty State */}
          {userMessageStats.length === 0 && (
            <div className="text-center py-12">
              <MessageCircle className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No messaging data</h3>
              <p className="text-gray-600">No users have sent messages yet</p>
            </div>
          )}
        </div>

        {/* Summary */}
        <div className="text-center text-sm text-gray-500 mt-4">
          Showing {userMessageStats.length} users • {totalMessages} total messages • {totalConversations} conversations
        </div>
      </div>
    </div>
  );
};

export default Messages;