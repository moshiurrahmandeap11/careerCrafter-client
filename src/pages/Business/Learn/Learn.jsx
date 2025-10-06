import React, { useState, useEffect, useRef } from 'react';
import { BookOpen, MessageSquare, Target, TrendingUp, Award, Users, Send, Sparkles, Code, Briefcase, Brain, Loader2, Clock, CheckCircle } from 'lucide-react';

// ইউজার আইডি ম্যানেজমেন্ট ফাংশন
const getOrCreateUserId = () => {
  let userId = localStorage.getItem('career_crafter_user_id');
  if (!userId) {
    userId = 'user_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('career_crafter_user_id', userId);
  }
  return userId;
};

const Learn = () => {
    const [activeTab, setActiveTab] = useState('explore');
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTopic, setSelectedTopic] = useState(null);
    const [userStats, setUserStats] = useState(null);
    const [learningPaths, setLearningPaths] = useState([]);
    const chatEndRef = useRef(null);
    
    // ইউজার আইডি স্টেট
    const [userId, setUserId] = useState(null);
    
    const API_URL = 'http://localhost:3000/v1/learn';
    const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;

    useEffect(() => {
        const user = getOrCreateUserId();
        setUserId(user);
    }, []);

    useEffect(() => {
        if (userId) {
            fetchLearningPaths();
            fetchUserStats();
            loadChatHistory();
        }
    }, [userId]);

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const fetchLearningPaths = async () => {
        try {
            const response = await fetch(`${API_URL}/paths`);
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                setLearningPaths(data.data);
            } else {
                setLearningPaths(getDefaultPaths());
            }
        } catch (error) {
            console.error('Error fetching paths:', error);
            setLearningPaths(getDefaultPaths());
        }
    };

    const getDefaultPaths = () => [
        {
            _id: '1',
            title: 'Web Development',
            description: 'Master modern web technologies',
            category: 'development',
            courses: 156,
            enrolled: 2300,
            difficulty: 'intermediate'
        },
        {
            _id: '2',
            title: 'Data Science & AI',
            description: 'Learn machine learning and analytics',
            category: 'data-science',
            courses: 89,
            enrolled: 1800,
            difficulty: 'advanced'
        },
        {
            _id: '3',
            title: 'Business & Management',
            description: 'Develop leadership skills',
            category: 'business',
            courses: 124,
            enrolled: 3100,
            difficulty: 'beginner'
        },
        {
            _id: '4',
            title: 'Career Development',
            description: 'Advance your professional journey',
            category: 'career',
            courses: 67,
            enrolled: 2700,
            difficulty: 'beginner'
        }
    ];

    const fetchUserStats = async () => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${API_URL}/stats/${userId}`);
            const data = await response.json();
            
            if (data.success) {
                setUserStats(data.data);
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    const loadChatHistory = async () => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${API_URL}/chat/${userId}?limit=20`);
            const data = await response.json();
            
            if (data.success && data.data.length > 0) {
                const formattedMessages = data.data.map(msg => ({
                    role: msg.role,
                    content: msg.content
                }));
                setMessages(formattedMessages);
            }
        } catch (error) {
            console.error('Error loading chat history:', error);
        }
    };

    const saveChatMessage = async (role, content, topic = null) => {
        if (!userId) return;
        
        try {
            await fetch(`${API_URL}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userId, role, content, topic })
            });
        } catch (error) {
            console.error('Error saving chat:', error);
        }
    };

    const enrollInPath = async (pathId) => {
        if (!userId) return;
        
        try {
            const response = await fetch(`${API_URL}/enroll`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    userId,
                    itemId: pathId,
                    itemType: 'path'
                })
            });

            const data = await response.json();
            
            if (data.success) {
                fetchUserStats();
            }
        } catch (error) {
            console.error('Error enrolling:', error);
        }
    };

    const AVAILABLE_MODELS = [
        'qwen/qwen-2-7b-instruct:free',
        'meta-llama/llama-3.2-3b-instruct:free',
        'microsoft/phi-3-mini-128k-instruct:free',
        'nousresearch/hermes-3-llama-3.1-405b:free'
    ];

    const [currentModelIndex, setCurrentModelIndex] = useState(0);

    const sendMessageToAI = async (message) => {
        if (!userId) return;
        
        setIsLoading(true);
        
        const userMessage = { role: 'user', content: message };
        setMessages(prev => [...prev, userMessage]);
        
        await saveChatMessage('user', message, selectedTopic);

        const tryModel = async (modelIndex = 0) => {
            if (modelIndex >= AVAILABLE_MODELS.length) {
                throw new Error('All models failed. Please try again later.');
            }

            const model = AVAILABLE_MODELS[modelIndex];
            console.log(`Trying model: ${model}`);

            try {
                const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${OPENROUTER_API_KEY}`
                    },
                    body: JSON.stringify({
                        model: model,
                        messages: [
                            {
                                role: 'user',
                                content: `You are a helpful career and learning mentor on Career Crafter platform. Help with this query: ${message}`
                            }
                        ]
                    })
                });

                const data = await response.json();

                if (!response.ok) {
                    console.error(`Model ${model} failed:`, data);
                    return await tryModel(modelIndex + 1);
                }
                
                if (data.choices && data.choices[0] && data.choices[0].message) {
                    const aiResponse = data.choices[0].message.content;
                    setCurrentModelIndex(modelIndex);
                    return aiResponse;
                } else {
                    return await tryModel(modelIndex + 1);
                }
            } catch (error) {
                console.error(`Model ${model} error:`, error);
                return await tryModel(modelIndex + 1);
            }
        };

        try {
            const aiResponse = await tryModel(currentModelIndex);
            const assistantMessage = { role: 'assistant', content: aiResponse };
            
            setMessages(prev => [...prev, assistantMessage]);
            await saveChatMessage('assistant', aiResponse, selectedTopic);
        } catch (error) {
            console.error('All AI models failed:', error);
            const errorMsg = 'Sorry, I am unable to respond right now. Please try again in a moment.';
            const errorMessage = { role: 'assistant', content: errorMsg };
            
            setMessages(prev => [...prev, errorMessage]);
            await saveChatMessage('assistant', errorMsg, selectedTopic);
        } finally {
            setIsLoading(false);
            setInputMessage('');
        }
    };

    const handleSendMessage = () => {
        if (inputMessage.trim() && !isLoading) {
            sendMessageToAI(inputMessage);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSendMessage();
        }
    };

    const quickPrompts = [
        "How do I start learning web development?",
        "What skills are in demand for 2025?",
        "Create a 30-day learning plan for me",
        "How to improve my LinkedIn profile?"
    ];

    const getCategoryIcon = (category) => {
        const icons = {
            development: <Code className="w-6 h-6" />,
            'data-science': <Brain className="w-6 h-6" />,
            business: <Briefcase className="w-6 h-6" />,
            career: <TrendingUp className="w-6 h-6" />
        };
        return icons[category] || <BookOpen className="w-6 h-6" />;
    };

    const getCategoryColor = (category) => {
        const colors = {
            development: 'from-blue-500 to-cyan-500',
            'data-science': 'from-purple-500 to-pink-500',
            business: 'from-orange-500 to-red-500',
            career: 'from-green-500 to-teal-500'
        };
        return colors[category] || 'from-gray-500 to-gray-700';
    };

    const formatNumber = (num) => {
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        }
        return num;
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
            <div className="bg-white shadow-sm border-b sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-4 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                                <BookOpen className="w-6 h-6 text-white" />
                            </div>
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">Career Crafter</h1>
                                <p className="text-sm text-gray-500">Learn with AI</p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setActiveTab('explore')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === 'explore'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <BookOpen className="w-4 h-4 inline mr-2" />
                                Explore
                            </button>
                            <button
                                onClick={() => setActiveTab('mentor')}
                                className={`px-4 py-2 rounded-lg font-medium transition-all ${
                                    activeTab === 'mentor'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                <MessageSquare className="w-4 h-4 inline mr-2" />
                                AI Mentor
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                {activeTab === 'explore' ? (
                    <div className="space-y-8">
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
                            <div className="max-w-3xl">
                                <h2 className="text-4xl font-bold mb-4">Start Your Learning Journey</h2>
                                <p className="text-xl opacity-90 mb-6">
                                    Unlock your potential with AI-powered personalized learning paths
                                </p>
                                <button
                                    onClick={() => setActiveTab('mentor')}
                                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2"
                                >
                                    <Sparkles className="w-5 h-5" />
                                    Talk to AI Mentor
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            {[
                                { 
                                    icon: <Users />, 
                                    label: 'Your Enrollments', 
                                    value: userStats ? userStats.totalEnrolled : '0' 
                                },
                                { 
                                    icon: <CheckCircle />, 
                                    label: 'Completed', 
                                    value: userStats ? userStats.totalCompleted : '0' 
                                },
                                { 
                                    icon: <Clock />, 
                                    label: 'Time Spent', 
                                    value: userStats ? `${Math.floor(userStats.totalTimeSpent / 60)}h` : '0h' 
                                },
                                { 
                                    icon: <Award />, 
                                    label: 'Avg Score', 
                                    value: userStats ? `${userStats.averageScore}%` : '0%' 
                                }
                            ].map((stat, idx) => (
                                <div key={idx} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
                                    <div className="text-blue-600 mb-2">{stat.icon}</div>
                                    <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
                                    <div className="text-sm text-gray-600">{stat.label}</div>
                                </div>
                            ))}
                        </div>

                        <div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">Popular Learning Paths</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {learningPaths.map((path) => (
                                    <div
                                        key={path._id}
                                        className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                                        onClick={() => {
                                            setSelectedTopic(path.title);
                                            setActiveTab('mentor');
                                            setInputMessage(`I want to learn ${path.title}. Can you help me get started?`);
                                            enrollInPath(path._id);
                                        }}
                                    >
                                        <div className={`h-2 bg-gradient-to-r ${getCategoryColor(path.category)}`}></div>
                                        <div className="p-6">
                                            <div className="flex items-start gap-4">
                                                <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(path.category)} flex items-center justify-center text-white`}>
                                                    {getCategoryIcon(path.category)}
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                                                        {path.title}
                                                    </h4>
                                                    <p className="text-gray-600 mb-4">{path.description}</p>
                                                    <div className="flex gap-4 text-sm text-gray-500">
                                                        <span>{path.courses} courses</span>
                                                        <span>•</span>
                                                        <span>{formatNumber(path.enrolled)} enrolled</span>
                                                        <span>•</span>
                                                        <span className="capitalize">{path.difficulty}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h3 className="text-xl font-bold">AI Career Mentor</h3>
                                            <p className="text-sm opacity-90">Your personal learning guide</p>
                                        </div>
                                    </div>
                                    {messages.length > 0 && (
                                        <button
                                            onClick={async () => {
                                                if (!userId) return;
                                                try {
                                                    await fetch(`${API_URL}/chat/${userId}`, {
                                                        method: 'DELETE'
                                                    });
                                                    setMessages([]);
                                                    setSelectedTopic(null);
                                                } catch (error) {
                                                    console.error('Error clearing chat:', error);
                                                }
                                            }}
                                            className="text-sm bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-all"
                                        >
                                            Clear Chat
                                        </button>
                                    )}
                                </div>
                            </div>

                            <div className="h-96 overflow-y-auto p-6 space-y-4 bg-gray-50">
                                {messages.length === 0 ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <MessageSquare className="w-8 h-8 text-blue-600" />
                                        </div>
                                        <h4 className="text-lg font-semibold text-gray-900 mb-2">
                                            Start a conversation
                                        </h4>
                                        <p className="text-gray-600 mb-6">
                                            Ask me anything about learning, career development, or skill building
                                        </p>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-2xl mx-auto">
                                            {quickPrompts.map((prompt, idx) => (
                                                <button
                                                    key={idx}
                                                    onClick={() => {
                                                        setInputMessage(prompt);
                                                        setTimeout(() => handleSendMessage(), 100);
                                                    }}
                                                    className="text-left p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-sm"
                                                >
                                                    {prompt}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        {messages.map((msg, idx) => (
                                            <div
                                                key={idx}
                                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                            >
                                                <div
                                                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                                                        msg.role === 'user'
                                                            ? 'bg-blue-600 text-white'
                                                            : 'bg-white text-gray-900 border border-gray-200 shadow-sm'
                                                    }`}
                                                >
                                                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{msg.content}</p>
                                                </div>
                                            </div>
                                        ))}
                                        {isLoading && (
                                            <div className="flex justify-start">
                                                <div className="bg-white text-gray-900 border border-gray-200 rounded-2xl px-4 py-3 shadow-sm">
                                                    <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                                                </div>
                                            </div>
                                        )}
                                        <div ref={chatEndRef} />
                                    </>
                                )}
                            </div>

                            <div className="p-4 bg-white border-t border-gray-200">
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={inputMessage}
                                        onChange={(e) => setInputMessage(e.target.value)}
                                        onKeyPress={handleKeyPress}
                                        placeholder="Ask me anything about learning..."
                                        className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        disabled={isLoading}
                                    />
                                    <button
                                        onClick={handleSendMessage}
                                        disabled={isLoading || !inputMessage.trim()}
                                        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
                                    >
                                        {isLoading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Send className="w-5 h-5" />
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Learn;