import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router"; 
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense"; 
import Loader from "../../components/sharedItems/Loader/Loader";
import useAuth from "../../hooks/UseAuth/useAuth";

const Tags = () => {
  const navigate = useNavigate();
  const [selectedTags, setSelectedTags] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const { user, loading } = useAuth();
  const [checkingUser, setCheckingUser] = useState(true); // user check loading

  const email = user?.email;

  
  useEffect(() => {
    const checkUserTags = async () => {
      if (!email) return;
      try {
        const res = await axiosIntense.get(`/v1/users/email/${email}`);
        if (res.data?.tags?.length > 0) {
          navigate("/auth/what-to-do", { replace: true });
        }
      } catch (err) {
        console.error("Error checking user tags:", err.response?.data || err.message);
      } finally {
        setCheckingUser(false);
      }
    };

    checkUserTags();
  }, [email, navigate]);

  const developerTags = [
    "MERN Stack Developer",
    "Full Stack Developer",
    "Frontend Developer",
    "Backend Developer",
    "React Developer",
    "Node.js Developer",
    "JavaScript Developer",
    "Python Developer",
    "Java Developer",
    "PHP Developer",
    "Angular Developer",
    "Vue.js Developer",
    "Mobile App Developer",
    "React Native Developer",
    "Flutter Developer",
    "iOS Developer",
    "Android Developer",
    "DevOps Engineer",
    "Software Engineer",
    "Web Developer",
    "UI/UX Developer",
    "WordPress Developer",
    "Laravel Developer",
    "Django Developer",
    "Express.js Developer",
    "MongoDB Developer",
    "MySQL Developer",
    "PostgreSQL Developer",
    "AWS Developer",
    "Cloud Developer",
    "API Developer",
    "GraphQL Developer",
    "TypeScript Developer",
    "Next.js Developer",
    "Nuxt.js Developer",
    ".NET Developer",
    "C# Developer",
    "Ruby on Rails Developer",
    "Go Developer",
    "Rust Developer",
  ];

  const handleTagSelect = (tag) => {
    if (selectedTags.includes(tag)) {
      setSelectedTags(selectedTags.filter((item) => item !== tag));
    } else if (selectedTags.length < 5) {
      setSelectedTags([...selectedTags, tag]);
    }
  };

  const handleSubmit = async () => {
    if (selectedTags.length === 0) {
      alert("Please select at least one tag");
      return;
    }
    setIsLoading(true);

    try {
      const response = await axiosIntense.patch(`/v1/users/email/${email}`, {
        tags: selectedTags,
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/what-to-do");
      }
    } catch (error) {
      console.error("Error submitting tags:", error.response?.data || error.message);
      alert("Failed to save tags. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (loading || checkingUser) return <Loader />;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8 pt-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-4">
            Choose Your Developer Tags
          </h1>
          <p className="text-gray-400 text-lg mb-2">
            Select up to 5 tags that best describe your skills and interests
          </p>
          <p className="text-sm text-gray-500">{selectedTags.length}/5 selected</p>
        </div>

        {/* Tags Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-8">
          {developerTags.map((tag) => {
            const isSelected = selectedTags.includes(tag);
            const isDisabled = !isSelected && selectedTags.length >= 5;

            return (
              <button
                key={tag}
                onClick={() => handleTagSelect(tag)}
                disabled={isDisabled}
                className={`
                  p-3 rounded-lg border-2 text-sm font-medium transition-all duration-200
                  ${
                    isSelected
                      ? "bg-blue-600 border-blue-500 text-white shadow-lg scale-105"
                      : isDisabled
                      ? "bg-gray-800 border-gray-700 text-gray-500 cursor-not-allowed"
                      : "bg-gray-800 border-gray-600 text-gray-300 hover:bg-gray-700 hover:border-gray-500 hover:scale-105 cursor-pointer"
                  }
                `}
              >
                {tag}
              </button>
            );
          })}
        </div>

        {/* Selected Tags Display */}
        {selectedTags.length > 0 && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Selected Tags:</h3>
            <div className="flex flex-wrap gap-2">
              {selectedTags.map((tag) => (
                <span
                  key={tag}
                  className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    onClick={() => handleTagSelect(tag)}
                    className="text-blue-200 hover:text-white"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Next Button */}
        <div className="flex justify-center pb-8">
          <button
            onClick={handleSubmit}
            disabled={selectedTags.length === 0 || isLoading}
            className={`
              px-8 py-3 rounded-lg font-semibold text-lg transition-all duration-200
              ${
                selectedTags.length === 0
                  ? "bg-gray-700 text-gray-500 cursor-not-allowed"
                  : isLoading
                  ? "bg-blue-500 text-white cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 cursor-pointer"
              }
            `}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Saving...
              </div>
            ) : (
              "Next"
            )}
          </button>
        </div>

        {/* Instructions */}
        <div className="text-center text-gray-500 text-sm">
          <p>💡 Tip: Choose tags that represent your main skills and career goals</p>
        </div>
      </div>
    </div>
  );
};

export default Tags;
