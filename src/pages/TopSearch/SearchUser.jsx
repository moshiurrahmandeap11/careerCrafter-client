import React, { useContext } from "react";
import { AuthContext } from "../../contexts/AuthContexts/AuthContexts";
import AlluserConnectionCard from "../../components/network-components/AlluserConnectionCard";
import { Link } from "react-router";

const SearchUser = () => {
  const { searchResult, searchTopic } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-50 px-4 sm:px-6 lg:px-8 py-10">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-8 text-center">
        <h1 className="text-2xl sm:text-3xl font-semibold text-gray-800">
          {searchResult?.length || 0} user
          {searchResult?.length > 1 ? "s" : ""} found for
          <span className="text-indigo-600 font-bold ml-2">
            "{searchTopic}"
          </span>
        </h1>
      </div>

      {/* User List Grid */}
      <div className="max-w-6xl mx-auto space-y-3">
        {searchResult && searchResult.length > 0 ? (
          searchResult.map((user) => (
            <div
              key={user._id}
              
            >
              <AlluserConnectionCard user={user} />
            </div>
          ))
        ) : (
          <div className="col-span-full text-center text-gray-600 text-lg">
            No users found for "{searchTopic}" 😔
          </div>
        )}
      </div>
      <div className="w-full flex items-center justify-center mt-16">
        <Link to={'/network/all-user'} className="w-full sm:w-auto bg-indigo-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-indigo-600 transition">See All Users</Link>
      </div>
    </div>
  );
};

export default SearchUser;
