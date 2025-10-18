import React, { useState, useEffect, useRef } from 'react';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';
import useAuth from '../../../hooks/UseAuth/useAuth';

const AiChatBot = ({ onClose }) => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [loading, setLoading] = useState(false);
    const [chatLoading, setChatLoading] = useState(true);
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        if (user?.email) {
            loadChatHistory();
        }
    }, [user?.email]);

    const loadChatHistory = async () => {
        try {
            setChatLoading(true);
            const response = await axiosIntense.get(`/ai-chatbot/chat/${user.email}`);
            
            if (response.data.success) {
                setMessages(response.data.data.messages || []);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
            setMessages([{
                role: 'assistant',
                content: 'Hey there! 👋 I\'m your CareerCrafter AI assistant. I can help you find amazing job opportunities or connect you with great talent. What\'s on your mind today?',
                timestamp: new Date()
            }]);
        } finally {
            setChatLoading(false);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!inputMessage.trim() || loading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setLoading(true);

        // Add user message immediately
        const newUserMessage = {
            role: 'user',
            content: userMessage,
            timestamp: new Date()
        };
        setMessages(prev => [...prev, newUserMessage]);

        try {
            const response = await axiosIntense.post(`/ai-chatbot/chat/${user.email}/message`, {
                message: userMessage
            });
            
            if (response.data.success) {
                // Add AI response
                setMessages(prev => [...prev, response.data.data.assistantMessage]);
            } else {
                throw new Error(response.data.message);
            }
        } catch (error) {
            console.error('Error sending message:', error);
            // Add natural error message
            setMessages(prev => [...prev, {
                role: 'assistant',
                content: 'Oops! I ran into a small issue there. Could you try again? 😊',
                timestamp: new Date()
            }]);
        } finally {
            setLoading(false);
        }
    };

    const clearChat = async () => {
        try {
            await axiosIntense.delete(`/ai-chatbot/chat/${user.email}`);
            await loadChatHistory();
        } catch (error) {
            console.error('Error clearing chat:', error);
        }
    };

    // Quick reply suggestions
    const quickReplies = [
        "Find React jobs for me",
        "I need to hire a developer",
        "Career advice",
        "Update my profile"
    ];

    const handleQuickReply = (reply) => {
        setInputMessage(reply);
    };

    if (chatLoading) {
        return (
            <div className="w-full h-full bg-white rounded-lg shadow-lg flex flex-col border border-gray-200">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
                    <h3 className="text-white font-semibold text-lg">CareerCrafter AI Assistant</h3>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                        ×
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center space-y-3">
                        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-gray-600 text-sm">Getting things ready for you...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full h-full bg-white rounded-lg shadow-lg flex flex-col border border-gray-200">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                        <span className="text-blue-600 font-bold text-sm">AI</span>
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-lg">Career Assistant</h3>
                        <p className="text-blue-100 text-xs">Online • Ready to help</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <button 
                        onClick={clearChat} 
                        className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Start new conversation"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:bg-white hover:bg-opacity-20 w-8 h-8 rounded-full flex items-center justify-center transition-colors duration-200"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-blue-50">
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                        <div 
                            className={`max-w-[85%] rounded-2xl p-4 transition-all duration-300 ${
                                message.role === 'user' 
                                    ? 'bg-blue-500 text-white rounded-br-md shadow-lg hover:shadow-xl transform hover:scale-105' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-md hover:shadow-lg transform hover:scale-105'
                            }`}
                        >
                            <div className="text-sm whitespace-pre-wrap leading-relaxed">
                                {message.content}
                            </div>
                            <div 
                                className={`text-xs mt-2 ${
                                    message.role === 'user' ? 'text-blue-100' : 'text-gray-400'
                                }`}
                            >
                                {new Date(message.timestamp).toLocaleTimeString([], { 
                                    hour: '2-digit', 
                                    minute: '2-digit' 
                                })}
                            </div>
                        </div>
                    </div>
                ))}
                
                {loading && (
                    <div className="flex justify-start animate-pulse">
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-4 shadow-md">
                            <div className="flex space-x-2 items-center">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-gray-500 text-sm ml-2">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
                <div className="px-4 py-2 bg-white border-t border-gray-200">
                    <div className="flex flex-wrap gap-2">
                        {quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickReply(reply)}
                                className="px-3 py-2 text-xs bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-4 border-t border-gray-200 bg-white">
                <div className="flex space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask about jobs, careers, or hiring..."
                            disabled={loading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all duration-200"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(e);
                                }
                            }}
                        />
                        {!inputMessage && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                                ⏎
                            </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !inputMessage.trim()}
                        className="bg-blue-500 text-white w-12 h-12 rounded-2xl flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg"
                    >
                        {loading ? (
                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="text-xs text-gray-500 text-center mt-2">
                    CareerCrafter AI • Real-time job matching
                </div>
            </form>
        </div>
    );
};

export default AiChatBot;