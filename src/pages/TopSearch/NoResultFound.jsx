import React, { useContext } from "react";
import { Search, User } from "lucide-react";
import { useNavigate } from "react-router";
import { AuthContext } from "../../contexts/AuthContexts/AuthContexts";

const NoResultFound = () => {
  const navigate = useNavigate();
  const {  searchTopic } = useContext(AuthContext);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-[70vh] p-6">
      {/* Icon Section */}
      <div className="relative mb-6">
        <div className="bg-indigo-100 rounded-full p-6 shadow-sm">
          <Search className="text-indigo-600 w-12 h-12" />
        </div>
        <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow">
          <User className="text-indigo-500 w-5 h-5" />
        </div>
      </div>

      {/* Text Section */}
      <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-3">
        No Results Found
      </h2>
      <p className="text-gray-500 max-w-md mb-6 text-sm md:text-base">
        We couldn’t find any users matching 
        <span className="font-medium text-indigo-600"> “{searchTopic}”</span>.
        <br className="hidden sm:block" />
        Try searching with a different keyword or check your spelling.
      </p>

      {/* Button */}
      <button
        onClick={() => navigate("/")}
        className="bg-indigo-600 text-white px-6 py-2.5 rounded-full shadow-md hover:bg-indigo-700 active:scale-95 transition duration-200"
      >
        Go Back Home
      </button>
    </div>
  );
};

export default NoResultFound;
