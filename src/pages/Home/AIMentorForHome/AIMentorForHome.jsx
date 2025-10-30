import React, { useState, useEffect, useRef } from "react";
import {
  MessageSquare,
  Send,
  Sparkles,
  Loader2,
  Target,
  Briefcase,
  Search,
  Rocket,
  ArrowRight,
  X,
  Maximize2,
  User,
  Heart,
  BookOpen,
  TrendingUp,
  Zap
} from "lucide-react";
import Swal from "sweetalert2";
import axiosIntense from "../../../hooks/AxiosIntense/axiosIntense";
import useAuth from "../../../hooks/UseAuth/useAuth";

const getOrCreateUserId = () => {
  let userId = localStorage.getItem("career_crafter_user_id");
  if (!userId) {
    userId = "user_" + Math.random().toString(36).substr(2, 9);
    localStorage.setItem("career_crafter_user_id", userId);
  }
  return userId;
};

const AIMentorForHome = () => {
  const [showMentor, setShowMentor] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);
  const [userName, setUserName] = useState("");
  const chatEndRef = useRef(null);

  const { user } = useAuth();

  const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY;
  const GROQ_MODELS = [
    "llama-3.1-8b-instant",
    "llama-3.3-70b-versatile",
    "mixtral-8x7b-32768",
    "gemma2-9b-it",
  ];

  const motivationalMessages = [
    {
      title: "If You're Jobless Right Now",
      description: "Don't worry! Every successful career starts with a single step. Let's build your path together.",
      emoji: "💼",
      bgColor: "from-slate-600 to-slate-700",
      buttonColor: "from-emerald-500 to-emerald-600",
      icon: Briefcase
    },
    {
      title: "If You're Seeking Jobs Right Now",
      description: "The perfect opportunity is waiting for you. Let me help you stand out from the crowd.",
      emoji: "🎯",
      bgColor: "from-blue-600 to-indigo-700",
      buttonColor: "from-amber-500 to-amber-600",
      icon: Target
    },
    {
      title: "Can't Get Your Appropriate Job?",
      description: "Many face this challenge. With the right guidance, you'll find what you truly deserve.",
      emoji: "🚀",
      bgColor: "from-violet-600 to-purple-700",
      buttonColor: "from-cyan-500 to-cyan-600",
      icon: Rocket
    },
    {
      title: "Feeling Stuck in Your Career?",
      description: "It's time for a change. Let's discover new opportunities that match your skills.",
      emoji: "🌟",
      bgColor: "from-rose-600 to-pink-700",
      buttonColor: "from-lime-500 to-lime-600",
      icon: TrendingUp
    },
    {
      title: "Ready for Career Growth?",
      description: "Level up your career with personalized advice and actionable steps.",
      emoji: "📈",
      bgColor: "from-teal-600 to-cyan-700",
      buttonColor: "from-orange-500 to-orange-600",
      icon: Zap
    }
  ];

  const [currentMessage, setCurrentMessage] = useState(0);

  useEffect(() => {
    const user = getOrCreateUserId();
    setUserId(user);

    if (user?.displayName) {
      setUserName(user.displayName);
    } else {
      const storedName = localStorage.getItem("userName") || "Career Seeker";
      setUserName(storedName);
    }

    const interval = setInterval(() => {
      setCurrentMessage(prev => (prev + 1) % motivationalMessages.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [user]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleYesClick = () => {
    Swal.fire({
      title: '🎉 You Are in the Right Place!',
      html: `
        <div class="text-center">
          <div class="text-4xl mb-4">🌟</div>
          <p class="text-gray-700 mb-4">You're being redirected to our AI Career Mentor who will help you with your career challenges.</p>
          <p class="text-sm text-gray-500">Get personalized guidance from our AI assistant</p>
        </div>
      `,
      icon: 'success',
      confirmButtonText: 'Continue to AI Mentor',
      confirmButtonColor: '#4f46e5',
      background: '#f8fafc',
      customClass: {
        popup: 'rounded-2xl'
      }
    }).then((result) => {
      if (result.isConfirmed) {
        setShowMentor(true);
        if (messages.length === 0) {
          const greetingMessage = {
            role: "assistant",
            content: `Hello${userName ? ` ${userName}` : ''}! I'm your AI Career Mentor 🌟

I'm here to help you with:
• Career guidance and job search strategies
• Skill development and learning paths  
• Resume and interview preparation
• Career transition advice
• Professional growth opportunities

What career challenge can I help you with today?`
          };
          setMessages([greetingMessage]);
        }
      }
    });
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
            content: `You are a helpful, empathetic AI Career Mentor. Address the user as ${userName || 'there'}. Give practical, actionable career advice. Focus on:
- Job search strategies
- Skill development
- Career planning
- Interview preparation
- Professional growth
Keep responses encouraging, specific, and practical. Use emojis occasionally to make it friendly.`,
          },
          ...messages.slice(-6).map((msg) => ({
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
              max_tokens: 1000,
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
        content: `I'm experiencing high demand right now ${userName ? userName + '' : ''}. Please try again in a moment.

Meanwhile, you can:
• Check the quick tips below
• Refresh the page  
• Try asking a shorter question

I'm here to help with your career journey! 🚀`,
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

  const quickPrompts = [
    "Help me improve my resume",
    "What skills should I learn for tech jobs?",
    "How to prepare for interviews?",
    "Career change advice from marketing to tech",
    "Best way to search for remote jobs",
    "How to negotiate salary?",
  ];

  const clearChat = () => {
    setMessages([]);
    const greetingMessage = {
      role: "assistant",
      content: `Hello${userName ? ` ${userName}` : ''}! I'm your AI Career Mentor 🌟

I'm here to help you with:
• Career guidance and job search strategies
• Skill development and learning paths
• Resume and interview preparation  
• Career transition advice
• Professional growth opportunities

What career challenge can I help you with today?`
    };
    setMessages([greetingMessage]);
  };

  if (!showMentor) {
    const CurrentIcon = motivationalMessages[currentMessage].icon;

    return (
      <div className="p-3">
        {/* Motivational Section */}
        <div className={`bg-gradient-to-br ${motivationalMessages[currentMessage].bgColor} rounded-3xl p-8 md:p-12 text-white shadow-2xl transition-all duration-700 ease-in-out transform`}>
          <div className="text-center w-full mx-auto">
            {/* Welcome with user name */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                <User className="w-6 h-6 text-white" />
              </div>
              <div className="text-left">
                <p className="text-white/80 text-sm">Welcome back</p>
                <p className="font-semibold text-xl">{userName || "Career Seeker"}</p>
              </div>
            </div>
            <div className="flex justify-center item-center">
              <div className="text-6xl mb-6 animate-pulse">
                {motivationalMessages[currentMessage].emoji}
              </div>

              <div className="flex justify-center mb-6">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm">
                  <CurrentIcon className="w-8 h-8 text-white" />
                </div>
              </div>
            </div>

            <h2 className="text-2xl md:text-3xl font-bold mb-6 leading-tight">
              {motivationalMessages[currentMessage].title}
            </h2>
            <p className="text-md md:text-lg mb-8 opacity-95 leading-relaxed">
              {motivationalMessages[currentMessage].description}
            </p>

            <button
              onClick={handleYesClick}
              className={`bg-gradient-to-r ${motivationalMessages[currentMessage].buttonColor} text-white px-12 py-6 rounded-2xl font-bold text-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center gap-4 mx-auto group`}
            >
              <span className="text-xs md:text-sm">Yes, I Need Career Help!</span>
            </button>

            {/* Progress dots */}
            <div className="flex justify-center gap-2 mt-8">
              {motivationalMessages.map((_, index) => (
                <div
                  key={index}
                  className={`w-2 h-2 rounded-full transition-all duration-500 ${index === currentMessage ? 'bg-white w-6' : 'bg-white/40'
                    }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Trust Indicator */}
        <div className="text-center mt-8">
          <div className="inline-flex items-center gap-3 bg-white/80 backdrop-blur-sm px-6 py-3 rounded-2xl border border-gray-200 shadow-lg">
            <Heart className="w-5 h-5 text-rose-500 fill-current" />
            <span className="text-sm text-gray-600 font-medium">Trusted by thousands of job seekers worldwide</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full mx-auto bg-white rounded-3xl shadow-2xl border border-gray-100 transition-all duration-500 ease-out ${isExpanded ? 'fixed inset-6 z-50' : 'w-full p-3'
      }`}>
      {/* Chat Header */}
      <div className="bg-blue-500 p-6 text-white rounded-t-3xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm shadow-lg">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-xl">
                AI Career Mentor
              </h3>
              <p className="text-indigo-100 text-sm">
                Hello {userName || 'there'}! Ready to boost your career? 🚀
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-110"
              title={isExpanded ? "Minimize" : "Expand"}
            >
              <Maximize2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowMentor(false)}
              className="p-3 hover:bg-white/20 rounded-xl transition-all duration-200 backdrop-blur-sm hover:scale-110"
              title="Close"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Chat Messages */}
      <div className={`overflow-y-auto bg-gradient-to-b from-gray-50 to-gray-100/80 ${isExpanded ? 'h-[calc(100vh-14rem)]' : 'h-96 md:h-[32rem]'
        }`}>
        <div className="p-6 space-y-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"
                }`}
            >
              <div
                className={`max-w-[85%] rounded-3xl px-5 py-4 backdrop-blur-sm ${msg.role === "user"
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                  : "bg-white/90 text-gray-800 border border-white/50 shadow-lg"
                  }`}
              >
                <p className="whitespace-pre-wrap text-sm md:text-base leading-relaxed">
                  {msg.content}
                </p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-white/90 text-gray-800 border border-white/50 rounded-3xl px-5 py-4 flex items-center gap-4 backdrop-blur-sm shadow-lg">
                <Loader2 className="w-5 h-5 animate-spin text-indigo-600" />
                <span className="text-sm text-gray-600">
                  Thinking about your career question...
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Quick Prompts */}
      {messages.length <= 2 && (
        <div className="p-6 bg-white/80 backdrop-blur-sm border-t border-gray-200/50">
          <p className="text-sm text-gray-600 mb-4 text-center font-medium">
            Quick questions to get started:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {quickPrompts.map((prompt, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setInputMessage(prompt);
                  setTimeout(() => handleSendMessage(), 100);
                }}
                className="text-left p-4 bg-white rounded-2xl border border-gray-200/80 hover:border-indigo-300 hover:bg-indigo-50/50 transition-all duration-300 text-sm text-gray-700 hover:text-gray-900 shadow-sm hover:shadow-md hover:scale-105"
                disabled={isLoading}
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Chat Input */}
      <div className="p-6 bg-white/95 backdrop-blur-sm border-t border-gray-200/50 rounded-b-3xl">
        <div className="flex gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={`Ask about your career challenges ${userName ? userName + '' : ''}...`}
              className="w-full px-5 py-4 border border-gray-300/80 rounded-2xl focus:outline-none focus:ring-3 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm md:text-base bg-white/50 backdrop-blur-sm transition-all duration-300 shadow-sm"
              disabled={isLoading}
            />
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearChat}
              className="px-5 py-4 border border-gray-300/80 text-gray-700 rounded-2xl hover:bg-gray-50/80 transition-all duration-300 text-sm font-medium backdrop-blur-sm hover:shadow-lg hover:scale-105"
              title="Clear Chat"
            >
              Clear
            </button>
            <button
              onClick={handleSendMessage}
              disabled={isLoading || !inputMessage.trim()}
              className="px-6 py-4 bg-blue-400 text-white rounded-2xl hover:from-indigo-700 hover:to-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center justify-center gap-3 font-medium shadow-lg hover:shadow-xl hover:scale-105 disabled:hover:shadow-lg"
            >
              {isLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span className="hidden sm:inline">Send</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIMentorForHome;