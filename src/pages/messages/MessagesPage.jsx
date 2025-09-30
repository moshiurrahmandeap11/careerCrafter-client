import React, { useState, useEffect, useRef } from 'react';
import { Search, MoreHorizontal, Send, Paperclip, Smile, Video, Phone, Info, ArrowLeft, UserPlus, Filter, Calendar, MapPin, Building } from 'lucide-react';

const MessagesPage = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChat, setSelectedChat] = useState(null);
  const [messageInput, setMessageInput] = useState('');
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    setIsVisible(true);
    fetchConversations();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [selectedChat]);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await fetch('/mock-data/conversations.json');
      if (!response.ok) throw new Error('Failed to fetch conversations');
      const data = await response.json();
      setConversations(data);
      if (data.length > 0) {
        setSelectedChat(data[0]);
      }
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setConversations([]);
    } finally {
      setLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const sendMessage = () => {
    if (!messageInput.trim() || !selectedChat) return;

    const newMessage = {
      id: Date.now(),
      text: messageInput,
      timestamp: new Date().toISOString(),
      isSender: true,
      status: 'sent'
    };

    const updatedConversations = conversations.map(conv => {
      if (conv.id === selectedChat.id) {
        return {
          ...conv,
          messages: [...conv.messages, newMessage],
          lastMessage: messageInput,
          timestamp: new Date().toISOString()
        };
      }
      return conv;
    });

    setConversations(updatedConversations);
    setSelectedChat(updatedConversations.find(conv => conv.id === selectedChat.id));
    setMessageInput('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  const filteredConversations = conversations.filter(conv =>
    conv.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    conv.lastMessage.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const ConversationList = () => (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full overflow-hidden flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Messages</h2>
          <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
            <UserPlus className="w-5 h-5" />
          </button>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search messages..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200"
          />
        </div>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.map((conversation) => (
          <div
            key={conversation.id}
            onClick={() => setSelectedChat(conversation)}
            className={`p-4 border-b border-gray-50 cursor-pointer transition-all duration-200 hover:bg-gray-50 ${
              selectedChat?.id === conversation.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
            }`}
          >
            <div className="flex items-start space-x-3">
              <div className="relative">
                <img
                  src={conversation.avatar}
                  alt={conversation.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white"
                />
                {conversation.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-semibold text-gray-900 truncate">{conversation.name}</h3>
                  <span className="text-xs text-gray-500">
                    {new Date(conversation.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <p className="text-sm text-gray-600 truncate">{conversation.lastMessage}</p>
                <div className="flex items-center mt-1 text-xs text-gray-500">
                  <Building className="w-3 h-3 mr-1" />
                  <span>{conversation.company}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const ChatWindow = () => {
    if (!selectedChat) {
      return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex items-center justify-center">
          <div className="text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Send className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a conversation</h3>
            <p className="text-gray-600">Choose a conversation from the list to start messaging</p>
          </div>
        </div>
      );
    }

    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm h-full flex flex-col">
        {/* Chat Header */}
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={() => setSelectedChat(null)}
                className="lg:hidden p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              <div className="relative">
                <img
                  src={selectedChat.avatar}
                  alt={selectedChat.name}
                  className="w-12 h-12 rounded-2xl object-cover border-2 border-white"
                />
                {selectedChat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                )}
              </div>
              <div>
                <h2 className="font-semibold text-gray-900">{selectedChat.name}</h2>
                <p className="text-sm text-gray-600 flex items-center">
                  <Building className="w-4 h-4 mr-1" />
                  {selectedChat.company} · {selectedChat.title}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                <Video className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                <Phone className="w-5 h-5" />
              </button>
              <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
                <Info className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <div className="space-y-4">
            {selectedChat.messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isSender ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-3 rounded-2xl ${
                    message.isSender
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                      : 'bg-white text-gray-900 border border-gray-200 rounded-bl-none shadow-sm'
                  }`}
                >
                  <p className="text-sm">{message.text}</p>
                  <div className={`text-xs mt-1 ${
                    message.isSender ? 'text-blue-100' : 'text-gray-500'
                  }`}>
                    {new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Message Input */}
        <div className="p-6 border-t border-gray-100">
          <div className="flex items-end space-x-3">
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
              <Paperclip className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-200">
              <Smile className="w-5 h-5" />
            </button>
            <div className="flex-1 bg-gray-50 border border-gray-200 rounded-xl focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500 transition-all duration-200">
              <textarea
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                rows="1"
                className="w-full px-4 py-3 bg-transparent border-none focus:outline-none resize-none text-gray-900 placeholder-gray-500"
              />
            </div>
            <button
              onClick={sendMessage}
              disabled={!messageInput.trim()}
              className={`p-3 rounded-xl font-semibold transition-all duration-200 ${
                messageInput.trim()
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading messages...</p>
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
              <h1 className="text-4xl font-bold text-gray-900">Messaging</h1>
              <p className="text-lg text-gray-600 mt-2">Connect with your professional network</p>
            </div>
            <button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
              <Send className="w-5 h-5" />
              <span>New Message</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className={`transition-all duration-700 transform ${
          isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
        }`} style={{ transitionDelay: '200ms' }}>
          <div className="grid lg:grid-cols-4 gap-6 h-[calc(100vh-200px)]">
            {/* Conversation List - Hidden on mobile when chat is selected */}
            <div className={`lg:col-span-1 ${
              selectedChat ? 'hidden lg:block' : 'block'
            }`}>
              <ConversationList />
            </div>
            
            {/* Chat Window */}
            <div className={`lg:col-span-3 ${
              selectedChat ? 'block' : 'hidden lg:block'
            }`}>
              <ChatWindow />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;