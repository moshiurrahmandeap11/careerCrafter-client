import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";

import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import useAuth from "../../hooks/UseAuth/useAuth";
import Loader from "../../components/sharedItems/Loader/Loader";

const WhatToDo = () => {
  const navigate = useNavigate();
  const [selectedPurpose, setSelectedPurpose] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const email = user?.email;

  const purposes = [
    { id: "find_job", title: "Find a Job", description: "I'm looking for new job opportunities", icon: "💼", color: "blue" },
    { id: "career_growth", title: "Career Growth", description: "I want to advance in my current career", icon: "📈", color: "green" },
    { id: "skill_development", title: "Skill Development", description: "I want to learn new skills and technologies", icon: "🎓", color: "purple" },
    { id: "networking", title: "Professional Networking", description: "I want to connect with other professionals", icon: "🤝", color: "orange" },
    { id: "freelancing", title: "Start Freelancing", description: "I want to work as a freelancer", icon: "💻", color: "cyan" },
    { id: "startup", title: "Build a Startup", description: "I have ideas and want to build my own company", icon: "🚀", color: "red" },
    { id: "mentorship", title: "Get Mentorship", description: "I need guidance from experienced professionals", icon: "👨‍🏫", color: "indigo" },
    { id: "portfolio", title: "Build Portfolio", description: "I want to showcase my work and projects", icon: "🎨", color: "pink" },
    { id: "interview_prep", title: "Interview Preparation", description: "I need help preparing for technical interviews", icon: "🎯", color: "yellow" },
    { id: "career_change", title: "Career Change", description: "I want to switch to a different field", icon: "🔄", color: "teal" },
    { id: "salary_negotiation", title: "Salary Negotiation", description: "I want to learn how to negotiate better salary", icon: "💰", color: "emerald" },
    { id: "explore", title: "Just Exploring", description: "I'm exploring different career options", icon: "🔍", color: "gray" }
  ];

  const getColorClasses = (color, isSelected) => {
    const colorMap = {
      blue: isSelected ? "bg-blue-600 border-blue-500" : "bg-gray-800 border-gray-600 hover:bg-blue-900 hover:border-blue-500",
      green: isSelected ? "bg-green-600 border-green-500" : "bg-gray-800 border-gray-600 hover:bg-green-900 hover:border-green-500",
      purple: isSelected ? "bg-purple-600 border-purple-500" : "bg-gray-800 border-gray-600 hover:bg-purple-900 hover:border-purple-500",
      orange: isSelected ? "bg-orange-600 border-orange-500" : "bg-gray-800 border-gray-600 hover:bg-orange-900 hover:border-orange-500",
      cyan: isSelected ? "bg-cyan-600 border-cyan-500" : "bg-gray-800 border-gray-600 hover:bg-cyan-900 hover:border-cyan-500",
      red: isSelected ? "bg-red-600 border-red-500" : "bg-gray-800 border-gray-600 hover:bg-red-900 hover:border-red-500",
      indigo: isSelected ? "bg-indigo-600 border-indigo-500" : "bg-gray-800 border-gray-600 hover:bg-indigo-900 hover:border-indigo-500",
      pink: isSelected ? "bg-pink-600 border-pink-500" : "bg-gray-800 border-gray-600 hover:bg-pink-900 hover:border-pink-500",
      yellow: isSelected ? "bg-yellow-600 border-yellow-500" : "bg-gray-800 border-gray-600 hover:bg-yellow-900 hover:border-yellow-500",
      teal: isSelected ? "bg-teal-600 border-teal-500" : "bg-gray-800 border-gray-600 hover:bg-teal-900 hover:border-teal-500",
      emerald: isSelected ? "bg-emerald-600 border-emerald-500" : "bg-gray-800 border-gray-600 hover:bg-emerald-900 hover:border-emerald-500",
      gray: isSelected ? "bg-gray-600 border-gray-500" : "bg-gray-800 border-gray-600 hover:bg-gray-700 hover:border-gray-500"
    };
    return colorMap[color] || colorMap.gray;
  };

  const handlePurposeSelect = (purposeId) => {
    setSelectedPurpose(purposeId);
  };

  const handleSubmit = async () => {
    if (!selectedPurpose) {
      alert("Please select what you want to do");
      return;
    }
    setIsLoading(true);
    try {
      const response = await axiosIntense.patch(`/users/email/${email}`, { purpose: selectedPurpose });
      if (response.status === 200) {
        navigate("/profile");
      }
    } catch (error) {
      console.error("Error submitting purpose:", error.response?.data || error.message);
      alert("Failed to save your selection. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const selectedPurposeData = purposes.find((p) => p.id === selectedPurpose);


  useEffect(() => {
    const checkUserPurpose = async () => {
      if (!email) return;
      try {
        const res = await axiosIntense.get(`/users/email/${email}`);
        if (res?.data?.purpose) {
          navigate("/profile");
        }
      } catch (err) {
        console.error("Error checking user purpose:", err);
      }
    };
    checkUserPurpose();
  }, [email, navigate]);

  if (loading) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            What brings you to CareerCrafter?
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Tell us your main goal so we can personalize your experience
          </p>
        </div>

        {/* Purpose Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
          {purposes.map((purpose) => {
            const isSelected = selectedPurpose === purpose.id;
            return (
              <button
                key={purpose.id}
                onClick={() => handlePurposeSelect(purpose.id)}
                className={`
                  p-6 rounded-xl border-2 text-left transition-all duration-200 transform
                  ${getColorClasses(purpose.color, isSelected)}
                  ${isSelected ? "scale-105 shadow-lg" : "hover:scale-102 hover:shadow-md"}
                  cursor-pointer
                `}
              >
                <div className="text-4xl mb-3">{purpose.icon}</div>
                <h3 className="text-xl font-semibold mb-2 text-white">{purpose.title}</h3>
                <p className="text-gray-300 text-sm leading-relaxed">{purpose.description}</p>
              </button>
            );
          })}
        </div>

        {/* Selected Purpose Display */}
        {selectedPurposeData && (
          <div className="mb-8 p-6 bg-gray-800 rounded-lg border border-gray-700">
            <h3 className="text-lg font-semibold mb-3 text-green-400">✅ You selected:</h3>
            <div className="flex items-center gap-4">
              <span className="text-3xl">{selectedPurposeData.icon}</span>
              <div>
                <h4 className="text-xl font-semibold text-white">{selectedPurposeData.title}</h4>
                <p className="text-gray-400">{selectedPurposeData.description}</p>
              </div>
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleSubmit}
            disabled={!selectedPurpose || isLoading}
            className={`
              px-8 py-4 rounded-lg font-semibold text-lg transition-all duration-200
              ${
                !selectedPurpose
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : isLoading
                  ? "bg-blue-500 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 cursor-pointer shadow-lg"
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Setting up your profile...
              </div>
            ) : (
              "Complete Setup"
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-500 text-sm">
          <p>🎯 This helps us customize recommendations and content for you</p>
        </div>
      </div>
    </div>
  );
};

export default WhatToDo;
