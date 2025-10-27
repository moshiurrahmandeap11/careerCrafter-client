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

    // Parse message content for links and format them
    const parseMessageContent = (content) => {
        if (!content) return null;

        // Pattern to match markdown links [text](url)
        const markdownLinkPattern = /\[([^\]]+)\]\(([^)]+)\)/g;
        
        // Pattern to match plain URLs
        const urlPattern = /(https?:\/\/[^\s]+)/g;
        
        const parts = [];
        let lastIndex = 0;
        let match;

        // First, handle markdown links
        const tempContent = content.replace(markdownLinkPattern, (fullMatch, text, url) => {
            return `__MDLINK__${text}__MDURL__${url}__ENDMDLINK__`;
        });

        // Split by markdown link placeholders
        const segments = tempContent.split(/(__MDLINK__.*?__ENDMDLINK__)/);
        
        segments.forEach((segment, index) => {
            if (segment.startsWith('__MDLINK__')) {
                // Extract markdown link
                const mdMatch = segment.match(/__MDLINK__(.*?)__MDURL__(.*?)__ENDMDLINK__/);
                if (mdMatch) {
                    const [, linkText, url] = mdMatch;
                    parts.push(
                        <a
                            key={`link-${index}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-700 transition-colors"
                        >
                            {linkText}
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    );
                }
            } else {
                // Handle plain text and URLs within this segment
                const textParts = [];
                let textLastIndex = 0;
                
                segment.replace(urlPattern, (urlMatch, url, offset) => {
                    // Add text before URL
                    if (offset > textLastIndex) {
                        textParts.push(segment.substring(textLastIndex, offset));
                    }
                    
                    // Add URL as link with shortened display
                    const displayUrl = url.length > 30 ? url.substring(0, 27) + '...' : url;
                    textParts.push(
                        <a
                            key={`url-${index}-${offset}`}
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-700 font-medium underline decoration-2 underline-offset-2 hover:decoration-blue-700 transition-colors break-all"
                        >
                            {displayUrl}
                            <svg className="w-3 h-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                        </a>
                    );
                    
                    textLastIndex = offset + urlMatch.length;
                    return urlMatch;
                });
                
                // Add remaining text
                if (textLastIndex < segment.length) {
                    textParts.push(segment.substring(textLastIndex));
                }
                
                parts.push(<span key={`text-${index}`}>{textParts}</span>);
            }
        });

        return <>{parts}</>;
    };

    if (chatLoading) {
        return (
            <div className="fixed inset-0 md:absolute md:bottom-20 md:right-0 md:top-auto md:left-auto w-full h-full md:w-[95vw] md:max-w-[450px] md:h-[600px] lg:h-[700px] bg-white md:rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-50">
                <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-5 md:rounded-t-2xl flex justify-between items-center">
                    <h3 className="text-white font-semibold text-lg md:text-xl">CareerCrafter AI Assistant</h3>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:bg-white hover:bg-opacity-20 w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 text-2xl font-light"
                    >
                        ×
                    </button>
                </div>
                <div className="flex-1 flex items-center justify-center bg-gray-50">
                    <div className="flex flex-col items-center space-y-4">
                        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                        <div className="text-gray-600 text-sm md:text-base">Getting things ready for you...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 md:absolute md:bottom-20 md:right-0 md:top-auto md:left-auto w-full h-full md:w-[95vw] md:max-w-[450px] md:h-[600px] lg:h-[700px] bg-white md:rounded-2xl shadow-2xl flex flex-col border border-gray-200 z-50">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-5 md:rounded-t-2xl flex justify-between items-center flex-shrink-0">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 md:w-12 md:h-12 bg-white rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-blue-600 font-bold text-base md:text-lg">AI</span>
                    </div>
                    <div className="min-w-0">
                        <h3 className="text-white font-semibold text-base md:text-lg truncate">Career Assistant</h3>
                        <p className="text-blue-100 text-xs md:text-sm">Online • Ready to help</p>
                    </div>
                </div>
                <div className="flex items-center space-x-2 flex-shrink-0">
                    <button 
                        onClick={clearChat} 
                        className="text-white hover:bg-white hover:bg-opacity-20 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-200"
                        title="Start new conversation"
                    >
                        <svg className="w-4 h-4 md:w-5 md:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                    </button>
                    <button 
                        onClick={onClose} 
                        className="text-white hover:bg-white hover:bg-opacity-20 w-9 h-9 md:w-10 md:h-10 rounded-full flex items-center justify-center transition-colors duration-200 text-2xl font-light"
                    >
                        ×
                    </button>
                </div>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-3 md:p-4 lg:p-5 space-y-3 md:space-y-4 bg-gradient-to-b from-gray-50 to-blue-50">
                {messages.map((message, index) => (
                    <div 
                        key={index} 
                        className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                    >
                        <div 
                            className={`max-w-[85%] md:max-w-[80%] rounded-2xl p-3 md:p-4 transition-all duration-300 ${
                                message.role === 'user' 
                                    ? 'bg-blue-500 text-white rounded-br-md shadow-lg hover:shadow-xl transform hover:scale-[1.02]' 
                                    : 'bg-white text-gray-800 border border-gray-100 rounded-bl-md shadow-md hover:shadow-lg transform hover:scale-[1.02]'
                            }`}
                        >
                            <div className="text-sm md:text-base leading-relaxed break-words">
                                {parseMessageContent(message.content)}
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
                        <div className="bg-white border border-gray-200 rounded-2xl rounded-bl-md p-3 md:p-4 shadow-md">
                            <div className="flex space-x-2 items-center">
                                <div className="flex space-x-1">
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                </div>
                                <span className="text-gray-500 text-xs md:text-sm ml-2">Thinking...</span>
                            </div>
                        </div>
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Quick Replies */}
            {messages.length <= 2 && (
                <div className="px-3 md:px-4 lg:px-5 py-2 md:py-3 bg-white border-t border-gray-200 flex-shrink-0">
                    <div className="flex flex-wrap gap-2">
                        {quickReplies.map((reply, index) => (
                            <button
                                key={index}
                                onClick={() => handleQuickReply(reply)}
                                className="px-3 py-2 text-xs md:text-sm bg-blue-50 text-blue-600 rounded-full border border-blue-200 hover:bg-blue-100 hover:border-blue-300 transition-colors duration-200 whitespace-nowrap flex-1 min-w-[120px] text-center"
                            >
                                {reply}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {/* Input Form */}
            <form onSubmit={sendMessage} className="p-3 md:p-4 lg:p-5 border-t border-gray-200 bg-white md:rounded-b-2xl flex-shrink-0">
                <div className="flex space-x-2 md:space-x-3">
                    <div className="flex-1 relative">
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Ask about jobs, careers, or hiring..."
                            disabled={loading}
                            className="w-full px-4 py-3 md:py-3.5 text-sm md:text-base border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100 transition-all duration-200"
                            onKeyPress={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                    e.preventDefault();
                                    sendMessage(e);
                                }
                            }}
                        />
                        {!inputMessage && (
                            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm hidden md:block">
                                ⏎
                            </div>
                        )}
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading || !inputMessage.trim()}
                        className="bg-blue-500 text-white w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 transform hover:scale-105 active:scale-95 shadow-md hover:shadow-lg flex-shrink-0"
                    >
                        {loading ? (
                            <div className="w-5 h-5 md:w-6 md:h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        ) : (
                            <svg className="w-5 h-5 md:w-6 md:h-6 transform rotate-90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        )}
                    </button>
                </div>
                <div className="text-xs md:text-sm text-gray-500 text-center mt-2">
                    CareerCrafter AI • Real-time job matching
                </div>
            </form>
        </div>
    );
};

export default AiChatBot;