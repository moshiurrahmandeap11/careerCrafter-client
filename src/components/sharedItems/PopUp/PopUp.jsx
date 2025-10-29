import React, { useState } from "react";
import { useNavigate } from "react-router";

const PopUp = () => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleGetStarted = () => {
    navigate("/auth/signin");
    setIsOpen(false)
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gradient-to-b from-black/70 to-black/30 backdrop-blur-md transition-opacity duration-300 ease-in-out">
      <div className="bg-white rounded-xl shadow-2xl overflow-hidden w-full max-w-5xl mx-4 transform transition-all duration-300 ease-out scale-100 hover:scale-[1.02] md:flex md:flex-row">
        {/* Close Button */}
        <button
          className="absolute cursor-pointer top-4 right-4 text-gray-600 hover:text-gray-900 text-3xl font-light transition-colors duration-200 z-10"
          onClick={() => setIsOpen(false)}
        >
          &times;
        </button>

        {/* Left Section - Text and Button */}
        <div className="p-6 md:p-10 flex-1 flex flex-col justify-between bg-gradient-to-br from-gray-50 to-white">
          <div>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight mb-6 leading-tight">
              Welcome to Career Crafter
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-8 leading-relaxed max-w-md">
              Unlock your potential with tailored career guidance, expert
              insights, and a thriving network of opportunities. Begin your
              transformative journey today!
            </p>
          </div>
          <button
            className="w-full cursor-pointer md:w-auto px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 text-base font-medium shadow-md hover:shadow-lg"
            onClick={handleGetStarted}
          >
            Get Started
          </button>
        </div>

        {/* Right Section - Video */}
        <div className="flex-1 relative min-h-[300px]">
          <video
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          >
            <source src="./headervideo.mp4" type="video/mp4" />
            <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
              <p className="text-gray-600 text-sm">Video not available</p>
            </div>
          </video>
        </div>
      </div>
    </div>
  );
};

export default PopUp;
