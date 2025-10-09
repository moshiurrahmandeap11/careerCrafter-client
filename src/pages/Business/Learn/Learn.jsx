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
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [userStats, setUserStats] = useState(null);
  const [learningPaths, setLearningPaths] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const chatEndRef = useRef(null);

  const [userId, setUserId] = useState(null);

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;

  // Groq models - fast and reliable
  const GROQ_MODELS = [
    "llama-3.1-8b-instant", // Very fast, good for quick responses
    "llama-3.3-70b-versatile", // High quality, slightly slower
    "mixtral-8x7b-32768", // Excellent for complex queries
    "gemma2-9b-it", // Good balanced model
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

  // Responsive handling
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
      console.error("Error fetching paths:", error);
      setLearningPaths(getDefaultPaths());
    }
  };

  const getDefaultPaths = () => [
    {
      _id: "1",
      title: "Web Development",
      description:
        "Master modern web technologies including React, Node.js, and full-stack development",
      category: "development",
      courses: 156,
      enrolled: 2300,
      difficulty: "intermediate",
      duration: "3-6 months",
    },
    {
      _id: "2",
      title: "Data Science & AI",
      description:
        "Learn machine learning, data analysis, and artificial intelligence fundamentals",
      category: "data-science",
      courses: 89,
      enrolled: 1800,
      difficulty: "advanced",
      duration: "4-8 months",
    },
    {
      _id: "3",
      title: "Business & Management",
      description:
        "Develop leadership, project management, and business strategy skills",
      category: "business",
      courses: 124,
      enrolled: 3100,
      difficulty: "beginner",
      duration: "2-4 months",
    },
    {
      _id: "4",
      title: "Career Development",
      description:
        "Master resume writing, interview skills, and professional networking",
      category: "career",
      courses: 67,
      enrolled: 2700,
      difficulty: "beginner",
      duration: "1-2 months",
    },
    {
      _id: "5",
      title: "Mobile Development",
      description: "Build iOS and Android apps with React Native and Flutter",
      category: "development",
      courses: 92,
      enrolled: 1500,
      difficulty: "intermediate",
      duration: "3-5 months",
    },
    {
      _id: "6",
      title: "Digital Marketing",
      description:
        "Learn SEO, social media marketing, and digital advertising strategies",
      category: "business",
      courses: 78,
      enrolled: 2200,
      difficulty: "beginner",
      duration: "2-3 months",
    },
  ];

  const fetchUserStats = async () => {
    if (!userId) return;

    try {
      const response = await axiosIntense.get(`/learn/stats/${userId}`);

      if (response.data.success) {
        setUserStats(response.data.data);
      } else {
        // Default stats if none found
        setUserStats({
          totalEnrolled: 0,
          totalCompleted: 0,
          totalTimeSpent: 0,
          averageScore: 0,
          learningStreak: 0,
        });
      }
    } catch (error) {
      console.error("Error fetching stats:", error);
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

  const saveChatMessage = async (role, content, topic = null) => {
    if (!userId) return;

    try {
      await axiosIntense.post("/learn/chat", {
        userId,
        role,
        content,
        topic,
        timestamp: new Date().toISOString(),
      });
    } catch (error) {
      console.error("Error saving chat:", error);
    }
  };

  const enrollInPath = async (pathId) => {
    if (!userId) return;

    try {
      const response = await axiosIntense.post("/learn/enroll", {
        userId,
        itemId: pathId,
        itemType: "path",
      });

      if (response.data.success) {
        fetchUserStats();
      }
    } catch (error) {
      console.error("Error enrolling:", error);
    }
  };

  const sendMessageToAI = async (message) => {
    if (!userId) return;

    setIsLoading(true);

    const userMessage = { role: "user", content: message };
    setMessages((prev) => [...prev, userMessage]);

    await saveChatMessage("user", message, selectedTopic);

    const tryGroqModel = async (modelIndex = 0) => {
      if (modelIndex >= GROQ_MODELS.length) {
        throw new Error(
          "All Groq models are currently unavailable. Please try again later."
        );
      }

      const model = GROQ_MODELS[modelIndex];
      console.log(`Trying Groq model: ${model}`);

      try {
        // Prepare conversation history (last 10 messages for context)
        const conversationHistory = [
          {
            role: "system",
            content: `You are CareerCrafter AI Mentor, an expert career advisor and learning companion. You help users with:
                        - Career guidance and planning
                        - Learning path recommendations
                        - Skill development strategies
                        - Interview preparation
                        - Resume and portfolio advice
                        - Professional networking tips
                        - Industry insights and trends
                        
                        Be supportive, practical, and actionable in your advice. Provide specific steps and resources when possible.
                        Keep responses clear and structured. If suggesting learning paths, break them into manageable steps.
                        Always maintain a positive and encouraging tone.`,
          },
          ...messages.slice(-10).map((msg) => ({
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
              max_tokens: 1024,
              top_p: 0.9,
              stream: false,
            }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          console.error(`Groq model ${model} failed:`, errorData);

          // If rate limited or model unavailable, try next model
          if (response.status === 429 || response.status === 503) {
            return await tryGroqModel(modelIndex + 1);
          }
          throw new Error(
            `Groq API error: ${errorData.error?.message || response.statusText}`
          );
        }

        const data = await response.json();

        if (data.choices && data.choices[0] && data.choices[0].message) {
          const aiResponse = data.choices[0].message.content;
          console.log(`Success with Groq model: ${model}`);
          return aiResponse;
        } else {
          throw new Error("Invalid response format from Groq API");
        }
      } catch (error) {
        console.error(`Groq model ${model} error:`, error);

        // If it's a network error or temporary issue, try next model
        if (modelIndex < GROQ_MODELS.length - 1) {
          console.log(`Trying next Groq model...`);
          return await tryGroqModel(modelIndex + 1);
        }
        throw error;
      }
    };

    try {
      const aiResponse = await tryGroqModel(0);
      const assistantMessage = { role: "assistant", content: aiResponse };

      setMessages((prev) => [...prev, assistantMessage]);
      await saveChatMessage("assistant", aiResponse, selectedTopic);
    } catch (error) {
      console.error("All Groq models failed:", error);

      const errorMessage = {
        role: "assistant",
        content: `I apologize, but I'm having trouble connecting right now. This could be due to high demand or temporary technical issues.

Here are some things you can try:
• Refresh the page and try again in a moment
• Check out our learning paths in the Explore tab
• Browse our curated resources for career development

In the meantime, you might find these resources helpful:
- FreeCodeCamp for web development
- Coursera for professional courses
- LinkedIn Learning for career skills

Please try again shortly!`,
      };

      setMessages((prev) => [...prev, errorMessage]);
      await saveChatMessage("assistant", errorMessage.content, selectedTopic);
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
      setSelectedTopic(null);
    } catch (error) {
      console.error("Error clearing chat:", error);
    }
  };

  const quickPrompts = [
    "How do I start learning web development in 2025?",
    "What are the most in-demand tech skills right now?",
    "Create a 30-day learning plan for data science",
    "How to transition from beginner to intermediate developer?",
    "Best ways to build a programming portfolio",
    "How to prepare for technical interviews?",
    "Career paths in artificial intelligence",
    "Tips for negotiating salary in tech jobs",
  ];

  const getCategoryIcon = (category) => {
    const icons = {
      development: <Code className="w-4 h-4 md:w-6 md:h-6" />,
      "data-science": <Brain className="w-4 h-4 md:w-6 md:h-6" />,
      business: <Briefcase className="w-4 h-4 md:w-6 md:h-6" />,
      career: <TrendingUp className="w-4 h-4 md:w-6 md:h-6" />,
      marketing: <Target className="w-4 h-4 md:w-6 md:h-6" />,
    };
    return icons[category] || <BookOpen className="w-4 h-4 md:w-6 md:h-6" />;
  };

  const getCategoryColor = (category) => {
    const colors = {
      development: "from-blue-500 to-cyan-500",
      "data-science": "from-purple-500 to-pink-500",
      business: "from-orange-500 to-red-500",
      career: "from-green-500 to-teal-500",
      marketing: "from-indigo-500 to-purple-500",
    };
    return colors[category] || "from-gray-500 to-gray-700";
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "k";
    }
    return num;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Helmet>
        <title>Free AI Career Mentor - Get Personalized Career Guidance</title>
        <meta
          name="description"
          content="Chat with our AI career mentor for free. Get personalized advice, career path recommendations, interview tips, and skill development guidance."
        />
        <meta
          name="keywords"
          content="AI career mentor, free career advice, career guidance, career counseling, AI coach, career development"
        />
        <link
          rel="canonical"
          href="https://careercrafter.moshiurrahman.online/ai-mentor"
        />
      </Helmet>
      {/* Header */}
      <div className="bg-white shadow-sm border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-3 md:px-4 py-3 md:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                <BookOpen className="w-4 h-4 md:w-6 md:h-6 text-white" />
              </div>
              <div>
                <Link
                  to={"/"}
                  className="text-lg md:text-2xl font-bold text-gray-900"
                >
                  Career Crafter
                </Link>
                <p className="text-xs md:text-sm text-gray-500">
                  Learn with AI
                </p>
              </div>
            </div>
            <div className="flex gap-1 md:gap-2">
              <button
                onClick={() => setActiveTab("explore")}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                  activeTab === "explore"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isMobile ? (
                  <BookOpen className="w-4 h-4" />
                ) : (
                  <>
                    <BookOpen className="w-4 h-4 inline mr-1 md:mr-2" />
                    Explore
                  </>
                )}
              </button>
              <button
                onClick={() => setActiveTab("mentor")}
                className={`px-3 py-1.5 md:px-4 md:py-2 rounded-lg font-medium transition-all text-sm md:text-base ${
                  activeTab === "mentor"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {isMobile ? (
                  <MessageSquare className="w-4 h-4" />
                ) : (
                  <>
                    <MessageSquare className="w-4 h-4 inline mr-1 md:mr-2" />
                    AI Mentor
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 md:px-4 py-4 md:py-8">
        {activeTab === "explore" ? (
          <div className="space-y-6 md:space-y-8">
            {/* Hero Section */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl md:rounded-2xl p-6 md:p-8 text-white">
              <div className="max-w-3xl">
                <h2 className="text-2xl md:text-4xl font-bold mb-3 md:mb-4">
                  Start Your Learning Journey
                </h2>
                <p className="text-base md:text-xl opacity-90 mb-4 md:mb-6">
                  Unlock your potential with AI-powered personalized learning
                  paths and instant career guidance
                </p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => setActiveTab("mentor")}
                    className="bg-white text-blue-600 px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:shadow-lg transition-all inline-flex items-center gap-2 text-sm md:text-base"
                  >
                    <Sparkles className="w-4 h-4 md:w-5 md:h-5" />
                    Talk to AI Mentor
                  </button>
                  <button className="bg-white/20 text-white px-4 py-2 md:px-6 md:py-3 rounded-lg font-semibold hover:bg-white/30 transition-all inline-flex items-center gap-2 text-sm md:text-base">
                    <TrendingUp className="w-4 h-4 md:w-5 md:h-5" />
                    View Progress
                  </button>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {[
                {
                  icon: <Users className="w-4 h-4 md:w-5 md:h-5" />,
                  label: "Enrollments",
                  value: userStats
                    ? formatNumber(userStats.totalEnrolled)
                    : "0",
                },
                {
                  icon: <CheckCircle className="w-4 h-4 md:w-5 md:h-5" />,
                  label: "Completed",
                  value: userStats
                    ? formatNumber(userStats.totalCompleted)
                    : "0",
                },
                {
                  icon: <Clock className="w-4 h-4 md:w-5 md:h-5" />,
                  label: "Time Spent",
                  value: userStats
                    ? `${Math.floor(userStats.totalTimeSpent / 60)}h`
                    : "0h",
                },
                {
                  icon: <Award className="w-4 h-4 md:w-5 md:h-5" />,
                  label: "Avg Score",
                  value: userStats ? `${userStats.averageScore}%` : "0%",
                },
              ].map((stat, idx) => (
                <div
                  key={idx}
                  className="bg-white rounded-lg md:rounded-xl p-4 md:p-6 shadow-sm border border-gray-100"
                >
                  <div className="text-blue-600 mb-1 md:mb-2">{stat.icon}</div>
                  <div className="text-lg md:text-2xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-xs md:text-sm text-gray-600">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Learning Paths */}
            <div>
              <div className="flex items-center justify-between mb-4 md:mb-6">
                <h3 className="text-xl md:text-2xl font-bold text-gray-900">
                  Popular Learning Paths
                </h3>
                <span className="text-sm text-gray-500">
                  {learningPaths.length} paths available
                </span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
                {learningPaths.map((path) => (
                  <div
                    key={path._id}
                    className="bg-white rounded-lg md:rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-all cursor-pointer group"
                    onClick={() => {
                      setSelectedTopic(path.title);
                      setActiveTab("mentor");
                      setInputMessage(
                        `I'm interested in learning ${path.title}. Can you create a personalized learning plan for me and suggest the best resources to get started?`
                      );
                    }}
                  >
                    <div
                      className={`h-1 md:h-2 bg-gradient-to-r ${getCategoryColor(
                        path.category
                      )}`}
                    ></div>
                    <div className="p-4 md:p-6">
                      <div className="flex items-start gap-3 md:gap-4">
                        <div
                          className={`w-8 h-8 md:w-12 md:h-12 rounded-lg bg-gradient-to-br ${getCategoryColor(
                            path.category
                          )} flex items-center justify-center text-white flex-shrink-0`}
                        >
                          {getCategoryIcon(path.category)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-base md:text-xl font-bold text-gray-900 mb-1 md:mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                            {path.title}
                          </h4>
                          <p className="text-sm md:text-base text-gray-600 mb-2 md:mb-4 line-clamp-2">
                            {path.description}
                          </p>
                          <div className="flex flex-wrap gap-2 md:gap-3 text-xs md:text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <BookOpen className="w-3 h-3" />
                              {path.courses} courses
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Users className="w-3 h-3" />
                              {formatNumber(path.enrolled)}
                            </span>
                            <span>•</span>
                            <span
                              className={`px-2 py-1 rounded-full text-xs capitalize ${
                                path.difficulty === "beginner"
                                  ? "bg-green-100 text-green-800"
                                  : path.difficulty === "intermediate"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {path.difficulty}
                            </span>
                          </div>
                          {path.duration && (
                            <div className="mt-2 text-xs text-blue-600 font-medium">
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
          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Chat Header */}
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-4 md:p-6 text-white">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 md:gap-3">
                    <div className="w-8 h-8 md:w-12 md:h-12 bg-white/20 rounded-full flex items-center justify-center">
                      <Sparkles className="w-4 h-4 md:w-6 md:h-6" />
                    </div>
                    <div>
                      <h3 className="text-lg md:text-xl font-bold">
                        AI Career Mentor
                      </h3>
                      <p className="text-xs md:text-sm opacity-90">
                        Powered by Career Crafter • Fast & Intelligent Responses
                      </p>
                    </div>
                  </div>
                  {messages.length > 0 && (
                    <button
                      onClick={clearChatHistory}
                      className="text-xs md:text-sm bg-white/20 hover:bg-white/30 px-3 py-1.5 md:px-4 md:py-2 rounded-lg transition-all"
                    >
                      {isMobile ? "Clear" : "Clear Chat"}
                    </button>
                  )}
                </div>
              </div>

              {/* Chat Messages */}
              <div className="h-80 md:h-96 overflow-y-auto p-4 md:p-6 space-y-3 md:space-y-4 bg-gray-50">
                {messages.length === 0 ? (
                  <div className="text-center py-8 md:py-12">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-4">
                      <MessageSquare className="w-6 h-6 md:w-8 md:h-8 text-blue-600" />
                    </div>
                    <h4 className="text-base md:text-lg font-semibold text-gray-900 mb-2">
                      Start a conversation with your AI Mentor
                    </h4>
                    <p className="text-sm md:text-base text-gray-600 mb-4 md:mb-6 max-w-md mx-auto">
                      Get instant career advice, learning recommendations, and
                      personalized guidance
                    </p>
                    <div className="grid grid-cols-1 gap-2 md:grid-cols-2 md:gap-3 max-w-2xl mx-auto">
                      {quickPrompts.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setInputMessage(prompt);
                            setTimeout(() => handleSendMessage(), 100);
                          }}
                          className="text-left p-2 md:p-3 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-sm transition-all text-xs md:text-sm hover:bg-blue-50"
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
                          className={`max-w-[85%] md:max-w-[80%] rounded-xl md:rounded-2xl px-3 py-2 md:px-4 md:py-3 ${
                            msg.role === "user"
                              ? "bg-blue-600 text-white"
                              : "bg-white text-gray-900 border border-gray-200 shadow-sm"
                          }`}
                        >
                          <p className="whitespace-pre-wrap text-xs md:text-sm leading-relaxed">
                            {msg.content}
                          </p>
                          {msg.timestamp && (
                            <div
                              className={`text-xs mt-2 ${
                                msg.role === "user"
                                  ? "text-blue-200"
                                  : "text-gray-400"
                              }`}
                            >
                              {new Date(msg.timestamp).toLocaleTimeString()}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                    {isLoading && (
                      <div className="flex justify-start">
                        <div className="bg-white text-gray-900 border border-gray-200 rounded-xl md:rounded-2xl px-4 py-3 shadow-sm flex items-center gap-2">
                          <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin text-blue-600" />
                          <span className="text-sm text-gray-600">
                            AI Mentor is thinking...
                          </span>
                        </div>
                      </div>
                    )}
                    <div ref={chatEndRef} />
                  </>
                )}
              </div>

              {/* Chat Input */}
              <div className="p-3 md:p-4 bg-white border-t border-gray-200">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask about career advice, learning paths, skills development..."
                    className="flex-1 px-3 py-2 md:px-4 md:py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm md:text-base"
                    disabled={isLoading}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={isLoading || !inputMessage.trim()}
                    className="px-3 py-2 md:px-6 md:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center min-w-[60px]"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 md:w-5 md:h-5 animate-spin" />
                    ) : (
                      <Send className="w-4 h-4 md:w-5 md:h-5" />
                    )}
                  </button>
                </div>
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Powered by Career Crafter • Fast responses • Expert career
                  guidance
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
