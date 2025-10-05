import React, { useState, useEffect } from "react";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import Loader from "../../components/sharedItems/Loader/Loader";
import useAuth from "../../hooks/UseAuth/useAuth";
import { useNavigate } from "react-router";

const WhereListen = () => {
  const { user, loading } = useAuth();
  const [selectedSources, setSelectedSources] = useState([]);
  const [checkingUser, setCheckingUser] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUserSources = async () => {
      if (!user) return;

      try {
        const res = await axiosIntense.get(`/users/email/${user.email}`);
        if (res.data?.sources && res.data.sources.length > 0) {
          // Already selected before → redirect to /tags
          navigate("/auth/tags", { replace: true });
        } else {
          setCheckingUser(false);
        }
      } catch (error) {
        console.error("Error checking user sources:", error);
        setCheckingUser(false);
      }
    };

    checkUserSources();
  }, [user, navigate]);

  const sources = [
    "Friend",
    "Social Media",
    "Job Board",
    "Company Website",
    "Recruiter",
    "Other",
  ];

  const handleCheckboxChange = (source) => {
    setSelectedSources((prev) =>
      prev.includes(source)
        ? prev.filter((item) => item !== source)
        : [...prev, source]
    );
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosIntense.patch(`/users/email/${user.email}`, {
        sources: selectedSources,
      });

      if (response.status === 200 || response.status === 201) {
        navigate("/tags");
      } else {
        console.error("Failed to submit sources");
      }
    } catch (error) {
      console.error("Error submitting sources:", error.response?.data || error.message);
    }
  };

  if (loading || checkingUser) return <Loader />;

  return (
    <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
      <div className="bg-red-400/40 backdrop-blur-sm p-8 sm:p-10 md:p-12 rounded-xl shadow-2xl w-full max-w-lg">
        <h2 className="text-3xl sm:text-4xl font-bold mb-6 text-center text-white drop-shadow-md">
          How did you hear about CareerCrafter?
        </h2>

        <div className="space-y-4 flex flex-col">
          {sources.map((source) => (
            <label
              key={source}
              className="flex items-center space-x-3 bg-red-600/20 hover:bg-red-600/40 rounded-lg px-4 py-2 cursor-pointer transition-all duration-200"
            >
              <input
                type="checkbox"
                checked={selectedSources.includes(source)}
                onChange={() => handleCheckboxChange(source)}
                className="h-5 w-5 cursor-pointer accent-red-500"
              />
              <span className="text-white font-medium">{source}</span>
            </label>
          ))}
        </div>

        <button
          onClick={handleSubmit}
          className="mt-8 w-full bg-red-600 hover:bg-red-800 transition-colors duration-200 text-white py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default WhereListen;
