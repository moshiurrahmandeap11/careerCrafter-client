import React, { useState, useEffect, useRef } from "react";
import {
  BookOpen,
  MessageSquare,
  Target,
  TrendingUp,
  Award,
  Users,
  Send,
  Sparkles,
  Code,
  Briefcase,
  Brain,
  Loader2,
  Clock,
  CheckCircle,
  Home,
} from "lucide-react";
import axiosIntense from "../../../hooks/AxiosIntense/axiosIntense";
import { Link } from "react-router";
import { Helmet } from "react-helmet-async";

const getOrCreateUserId = () => {
  let userId = localStorage.getItem("career_crafter_user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("career_crafter_user_id", userId);
  }
  return userId;
};

const Learn = () => {
  const [activeTab, setActiveTab] = useState("explore");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userStats, setUserStats] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const chatEndRef = useRef(null);
  const [userId, setUserId] = useState(null);

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  const GROQ_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];

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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const fetchLearningPaths = async () => {
    try {
      const response = await axiosIntense.get("/learn/paths");
      if (response.data.success && response.data.data.length > 0) {
        setLearningPaths(response.data.data);
      } else {
        setLearningPaths(getDefaultPaths());
      }
    } catch (error) {
      setLearningPaths(getDefaultPaths());
    }
  };

  const getDefaultPaths = () => [
    {
      _id: "1",
      title: "Web Development",
      description: "Learn HTML, CSS, JavaScript and modern frameworks",
      category: "development",
      courses: 45,
      enrolled: 1200,
      difficulty: "beginner",
      duration: "4 months",
    },
    {
      _id: "2",
      title: "Data Science",
      description: "Python, machine learning and data analysis",
      category: "data-science",
      courses: 32,
      enrolled: 800,
      difficulty: "intermediate",
      duration: "6 months",
    },
    {
      _id: "3",
      title: "Business Skills",
      description: "Management, marketing and leadership",
      category: "business",
      courses: 28,
      enrolled: 1500,
      difficulty: "beginner",
      duration: "3 months",
    },
    {
      _id: "4",
      title: "Career Growth",
      description: "Interview prep and professional development",
      category: "career",
      courses: 18,
      enrolled: 900,
      difficulty: "beginner",
      duration: "2 months",
    },
    {
      _id: "5",
      title: "Mobile Apps",
      description: "Build iOS and Android applications",
      category: "development",
      courses: 25,
      enrolled: 600,
      difficulty: "intermediate",
      duration: "5 months",
    },
    {
      _id: "6",
      title: "Digital Marketing",
      description: "SEO, social media and online advertising",
      category: "business",
      courses: 22,
      enrolled: 1100,
      difficulty: "beginner",
      duration: "3 months",
    },
  ];

  const fetchUserStats = async () => {
    if (!userId) return;

    try {
      const response = await axiosIntense.get(`/learn/stats/${userId}`);
      if (response.data.success) {
        setUserStats(response.data.data);
      } else {
        setUserStats({
          totalEnrolled: 0,
          totalCompleted: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          learningStreak: 0,
        });
      }
    } catch (error) {
      setUserStats({
        totalEnrolled: 0,
        totalCompleted: 0,
        totalTimeSpent: 0,
        averageScore: 0,
        learningStreak: 0,
      });
    }
  };

  const loadChatHistory = async () => {
    if (!userId) return;

    try {
      const response = await axiosIntense.get(`/learn/chat/${userId}?limit=20`);
      if (response.data.success && response.data.data.length > 0) {
        const formattedMessages = response.data.data.map((msg) => ({
          role: msg.role,
          content: msg.content,
          timestamp: msg.timestamp,
        }));
        setMessages(formattedMessages);
      }
    } catch (error) {
      console.error("Error loading chat history:", error);
    }
  };

  const saveChatMessage = async (role, content) => {
    if (!userId) return;

    try {
      await axiosIntense.post("/learn/chat", {
        userId,
        role,
        content,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const sendMessageToAI = async (message) => {
    if (!userId) return;

    setIsLoading(true);

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);
    await saveChatMessage("user", message);

    const tryGroqModel = async (modelIndex = 0) => {
      if (modelIndex >= GROQ_MODELS.length) {
        throw new Error("Service is busy. Please try again in a moment.");
      }

      const model = GROQ_MODELS[modelIndex];

      try {
        const conversationHistory = [
          {
            role: "system",
            content: `You are a helpful career advisor. Give practical, actionable advice about careers, learning, and skills. Keep responses clear and focused.`,
          },
          ...messages.slice(-8).map((msg) => ({
            role: msg.role,
            content: msg.content,
          })),
          {
            role: "user",
            content: message,
          },
        ];

        const response = await fetch(
          "https://api.groq.com/openai/v1/chat/completions",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${GROQ_API_KEY}`,
            },
            body: JSON.stringify({
              model: model,
              messages: conversationHistory,
              temperature: 0.7,
              max_tokens: 800,
              top_p: 0.9,
              stream: false,
            }),
          }
        );

        if (!response.ok) {
          if (response.status === 429 || response.status === 503) {
            return await tryGroqModel(modelIndex + 1);
          }
          throw new Error("Network error");
        }

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
          return data.choices[0].message.content;
        } else {
          throw new Error("Invalid response");
        }
      } catch (error) {
        if (modelIndex < GROQ_MODELS.length - 1) {
          return await tryGroqModel(modelIndex + 1);
        }
        throw error;
      }
    };

    try {
      const aiResponse = await tryGroqModel(0);
      const assistantMessage = { role: "assistant", content: aiResponse };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveChatMessage("assistant", aiResponse);
    } catch (error) {
      const errorMessage = {
        role: "assistant",
        content: `I'm having trouble connecting right now. Please try again in a moment.

You can also:
• Check the learning paths below
• Refresh the page
• Try a shorter question

I'll be ready to help when you try again!`,
      };

      setMessages((prev) => [...prev, errorMessage]);
      await saveChatMessage("assistant", errorMessage.content);
    } finally {
      setIsLoading(false);
      setInputMessage("");
    }
  };

  const handleSendMessage = () => {
    if (inputMessage.trim() && !isLoading) {
      sendMessageToAI(inputMessage);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChatHistory = async () => {
    if (!userId) return;
    try {
      await axiosIntense.delete(`/learn/chat/${userId}`);
      setMessages([]);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const quickPrompts = [
    "How to start learning web development?",
    "Best way to prepare for interviews?",
    "What skills are in demand now?",
    "Create a 30-day learning plan",
    "How to build a good portfolio?",
    "Career change advice",
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      development: <Code className="w-5 h-5" />,
      "data-science": <Brain className="w-5 h-5" />,
      business: <Briefcase className="w-5 h-5" />,
      career: <TrendingUp className="w-5 h-5" />,
    };
    return icons[category] || <BookOpen className="w-5 h-5" />;
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Helmet>
        <title>Learn & Grow - Career Crafter</title>
        <meta
          name="description"
          content="Learn new skills with AI-powered guidance and curated learning paths"
        />
      </Helmet>
      
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Link 
                to="/" 
                className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
              >
                <Home className="w-5 h-5" />
              </Link>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900">
                  Career Crafter
                </h1>
                <p className="text-xs text-gray-500">
                  Learn
                </p>
              </div>
            </div>
            
            {/* Mobile Tabs */}
            {isMobile ? (
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("explore")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "explore"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveTab("mentor")}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "mentor"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MessageSquare className="w-4 h-4" />
                </button>
              </div>
            ) : (
              /* Desktop Tabs */
              <div className="flex gap-1 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setActiveTab("explore")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "explore"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <BookOpen className="w-4 h-4 inline mr-2" />
                  Explore
                </button>
                <button
                  onClick={() => setActiveTab("mentor")}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    activeTab === "mentor"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <MessageSquare className="w-4 h-4 inline mr-2" />
                  AI Mentor
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-6">
        {activeTab === "explore" ? (
          <div className="space-y-6">
            {/* Hero */}
            <div className="bg-blue-600 rounded-xl p-6 text-white">
              <div className="max-w-2xl">
                <h2 className="text-2xl font-bold mb-3">
                  Start Learning Today
                </h2>
                <p className="text-blue-100 mb-4">
                  Build skills with guided paths and AI support
                </p>
                <button
                  onClick={() => setActiveTab("mentor")}
                  className="bg-white text-blue-600 px-5 py-2.5 rounded-lg font-semibold hover:bg-gray-100 transition-colors inline-flex items-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  Ask AI Mentor
                </button>
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {[
                {
                  icon: <Users className="w-4 h-4" />,
                  label: "Enrolled",
                  value: userStats ? formatNumber(userStats.totalEnrolled) : "0",
                },
                {
                  icon: <CheckCircle className="w-4 h-4" />,
                  label: "Completed",
                  value: userStats ? formatNumber(userStats.totalCompleted) : "0",
                },
                {
                  icon: <Clock className="w-4 h-4" />,
                  label: "Time Spent",
                  value: userStats ? `${Math.floor(userStats.totalTimeSpent / 60)}h` : "0h",
                },
                {
                  icon: <Award className="w-4 h-4" />,
                  label: "Avg Score",
                  value: userStats ? `${userStats.averageScore}%` : "0%",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg p-4 border border-gray-200"
                >
                  <div className="text-blue-600 mb-1">{stat.icon}</div>
                  <div className="text-lg font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Paths */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900">
                  Learning Paths
                </h3>
                <span className="text-sm text-gray-500">
                  {learningPaths.length} available
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {learningPaths.map((path) => (
                  <div
                    key={path._id}
                    className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-all cursor-pointer"
                    onClick={() => {
                      setActiveTab("mentor");
                      setInputMessage(`Tell me about ${path.title} and how to get started`);
                    }}
                  >
                    <div className="p-5">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center text-blue-600 flex-shrink-0">
                          {getCategoryIcon(path.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-bold text-gray-900 mb-1">
                            {path.title}
                          </h4>
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {path.description}
                          </p>
                          <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {path.courses} courses
                            </span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {formatNumber(path.enrolled)}
                            </span>
                            <span className={`px-1.5 py-0.5 rounded text-xs ${
                              path.difficulty === "beginner"
                                ? "bg-green-100 text-green-800"
                                : path.difficulty === "intermediate"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-100 text-red-800"
                            }`}>
                              {path.difficulty}
                            </span>
                          </div>
                          {path.duration && (
                            <div className="mt-2 text-sm text-blue-600 font-medium">
                              {path.duration}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          /* Chat Interface */
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-blue-600 p-4 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="font-bold">
                        AI Career Mentor
                      </h3>
                      <p className="text-xs text-blue-100">
                        Get career advice and learning guidance
                      </p>
                    </div>
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={clearChatHistory}
                      className="text-xs bg-white/20 hover:bg-white/30 px-3 py-1 rounded transition-colors"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-80 md:h-96 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <MessageSquare className="w-6 h-6 text-blue-600" />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">
                      Ask me anything about careers
                    </h4>
                    <p className="text-sm text-gray-600 mb-4">
                      I can help with learning paths, skills, and career advice
                    </p>
                    <div className="grid grid-cols-1 gap-2 max-w-md mx-auto">
                      {quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputMessage(prompt);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                          className="text-left p-2 bg-white rounded border border-gray-200 hover:border-blue-300 transition-all text-sm hover:bg-blue-50"
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
                        className={`flex ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div
                          className={`max-w-[85%] rounded-lg px-3 py-2 ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 border border-gray-200"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-sm">
                            {msg.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border border-gray-200 rounded-lg px-3 py-2 flex items-center gap-2">
                          <Loader2 className="w-4 h-4 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">
                            Thinking...
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about careers, skills, learning..."
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 text-sm"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4" />
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