import React from "react";
import { useNavigate } from "react-router";
import { Briefcase, GraduationCap, FilePlus2 } from "lucide-react";

const Business = () => {
  const navigate = useNavigate();

  const options = [
    {
      title: "Hire Talent",
      desc: "Find qualified professionals ready to join your team",
      icon: <Briefcase className="w-9 h-9" />,
      route: "/cc/hire",
    },
    {
      title: "Team Training",
      desc: "Develop skills with expert-led learning programs",
      icon: <GraduationCap className="w-9 h-9" />,
      route: "/cc/learn",
    },
    {
      title: "Post Job",
      desc: "Share opportunities and find the right candidates",
      icon: <FilePlus2 className="w-9 h-9" />,
      route: "/cc/post",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
      <div className="w-full max-w-6xl">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
            Career Crafter for Business
          </h1>
          <p className="text-gray-600 text-sm sm:text-base max-w-2xl mx-auto">
            Everything you need to build and grow your team - hiring, training, and management in one place
          </p>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 sm:gap-6">
          {options.map((opt, index) => (
            <button
              key={index}
              onClick={() => navigate(opt.route)}
              className="bg-white rounded-xl p-5 sm:p-6 text-left w-full border border-gray-200 hover:border-indigo-300 hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            >
              <div className="text-indigo-600 mb-4 flex justify-center sm:justify-start">
                {opt.icon}
              </div>
              <h3 className="font-semibold text-gray-900 text-lg mb-2">
                {opt.title}
              </h3>
              <p className="text-gray-600 text-sm leading-relaxed">
                {opt.desc}
              </p>
            </button>
          ))}
        </div>

        {/* Additional Info */}
        <div className="text-center mt-12">
          <p className="text-gray-500 text-sm">
            Need help? <button className="text-indigo-600 hover:text-indigo-700 font-medium">Contact our team</button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Business;