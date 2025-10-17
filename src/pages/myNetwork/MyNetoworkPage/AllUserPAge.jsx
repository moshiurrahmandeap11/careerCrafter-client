import React, { useEffect } from "react";


import { useDispatch, useSelector } from "react-redux";
import { fetchAllConnectedUsers } from "../../../redux-slices/networkSlice";
import useAuth from "../../../hooks/UseAuth/useAuth";
import useAxiosSecure from "../../../hooks/AxiosIntense/useAxiosSecure";
import AlluserConnectionCard from "../../../components/network-components/AlluserConnectionCard";
import Loader from "../../../components/sharedItems/Loader/Loader";


const MyNetwork = () => {
    const { user } = useAuth()
  const dispatch = useDispatch();
  const axiosSecure=useAxiosSecure()
  const { isLoading, users, error } = useSelector((state) => state.network);

  useEffect(() => {
     if (user?.email) {
      dispatch(fetchAllConnectedUsers({email:user.email,axiosSecure}));
    }
  
  }, [dispatch,user?.email,axiosSecure]);
  

  if (isLoading) return <Loader></Loader>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">Browse all users and connect</h1>
      {users.length === 0 ? (
        <p>No connected users found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {users.map((user) => (
            <AlluserConnectionCard key={user._id} user={user}></AlluserConnectionCard>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyNetwork;
