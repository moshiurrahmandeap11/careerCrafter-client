import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllConnectedUsers } from "../../../redux-slices/networkSlice";
import useAuth from "../../../hooks/UseAuth/useAuth";
import useAxiosSecure from "../../../hooks/AxiosIntense/useAxiosSecure";
import AlluserConnectionCard from "../../../components/network-components/AlluserConnectionCard";
import Loader from "../../../components/sharedItems/Loader/Loader";

const MyNetwork = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const axiosSecure = useAxiosSecure();
  const { isLoading, users, error } = useSelector((state) => state.network);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchAllConnectedUsers({ email: user.email, axiosSecure }));
    }
  }, [dispatch, user?.email, axiosSecure]);

  if (isLoading) return <Loader />;

  if (error) return (
    <div className="p-4">
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
        <p>Error: {error}</p>
        <button 
          onClick={() => dispatch(fetchAllConnectedUsers({ email: user.email, axiosSecure }))}
          className="mt-2 bg-red-600 text-white px-3 py-1 rounded text-sm"
        >
          Try Again
        </button>
      </div>
    </div>
  );

  return (
    <div className="p-4 max-w-7xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Browse All Users</h1>
        <p className="text-gray-600">
          Discover and connect with professionals in your network
        </p>
        <div className="mt-2 text-sm text-gray-500">
          Showing {users.length} users
        </div>
      </div>

      {users.length === 0 ? (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-xl font-semibold text-gray-600 mb-2">No users found</h3>
          <p className="text-gray-500">
            There are no more users to connect with at the moment.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {users.map((user) => (
            <AlluserConnectionCard key={user._id} user={user} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyNetwork;