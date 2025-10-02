import React, { useState, useEffect } from 'react';
import {
  Search,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Video,
  Phone,
  Info,
  ArrowLeft,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { MessageBubble } from '../../components/messages-components/MessageBubble';
import { ConversationItem } from '../../components/messages-components/ConvertationItem';
import { ReTitle } from 're-title';


const MessagesPage = () => {
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mobileView, setMobileView] = useState('list');

  useEffect(() => {
    fetchMessagesData();
  }, []);

  const fetchMessagesData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/data/conversations.json');
      if (!response.ok) {
        throw new Error('Failed to fetch messages data');
      }

      const conversationsData = await response.json();
      setConversations(conversationsData);

    } catch (error) {
      console.error('Error fetching messages data:', error);
      setError('Failed to load messages. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredConversations = conversations.filter(conversation =>
    conversation.user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.user.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conversation.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedConversation.id) {
        const newMsg = {
          id: Date.now(),
          content: newMessage,
          timestamp: new Date().toISOString(),
          isSender: true,
          read: true
        };
        return {
          ...conv,
          lastMessage: newMessage,
          lastMessageTime: 'Just now',
          messages: [...conv.messages, newMsg]
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedConversation(updatedConversations.find(conv => conv.id === selectedConversation.id));
    setNewMessage('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

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
            <MessageCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Loading your messages...
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
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">Messages Error</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={fetchMessagesData}
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
      <ReTitle title='Messages'/>
      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">Messages</h1>
              <p className="text-lg text-gray-600">Connect and collaborate with your network</p>
            </div>
            <motion.button
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Message</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <motion.div
              className={`w-full lg:w-96 border-r border-gray-200 flex flex-col ${mobileView === 'chat' ? 'hidden lg:flex' : 'flex'
                }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Search Bar */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {filteredConversations.map((conversation) => (
                    <ConversationItem
                      key={conversation.id}
                      conversation={conversation}
                      isSelected={selectedConversation?.id === conversation.id}
                      onClick={() => {
                        setSelectedConversation(conversation);
                        setMobileView('chat');
                      }}
                    />
                  ))}
                </motion.div>

                {filteredConversations.length === 0 && (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm ? 'No conversations found' : 'No messages yet'}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {searchTerm ? 'Try adjusting your search' : 'Start a conversation with your connections'}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              className={`flex-1 flex flex-col ${mobileView === 'list' ? 'hidden lg:flex' : 'flex'
                }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={() => setMobileView('list')}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <div className="flex items-center space-x-3">
                        <div className="relative">
                          <img
                            src={selectedConversation.user.avatar}
                            alt={selectedConversation.user.name}
                            className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                          {selectedConversation.user.online && (
                            <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{selectedConversation.user.name}</h3>
                          <p className="text-sm text-gray-600">{selectedConversation.user.title}</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Video className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Phone className="w-5 h-5" />
                      </motion.button>
                      <motion.button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Info className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-1"
                    >
                      {selectedConversation.messages.map((message) => (
                        <MessageBubble key={message.id} message={message} />
                      ))}
                    </motion.div>
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Paperclip className="w-5 h-5" />
                      </motion.button>
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          rows="1"
                          className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                        />
                        <motion.button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                        >
                          <Smile className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <motion.button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim()}
                        className={`p-3 rounded-lg transition-all duration-200 ${newMessage.trim()
                            ? 'bg-blue-600 text-white hover:bg-blue-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          }`}
                        whileHover={newMessage.trim() ? { scale: 1.05 } : {}}
                        whileTap={newMessage.trim() ? { scale: 0.95 } : {}}
                      >
                        <Send className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
                    <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;