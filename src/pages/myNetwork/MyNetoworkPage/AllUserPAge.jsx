import React, { useEffect } from "react";


import { useDispatch, useSelector } from "react-redux";
import { fetchAllConnectedUsers } from "../../../redux-slices/networkSlice";
import useAuth from "../../../hooks/UseAuth/useAuth";
import useAxiosSecure from "../../../hooks/AxiosIntense/useAxiosSecure";


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
  console.log(user?.email,users)

  if (isLoading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-3">All Connected Users</h1>
      {users.length === 0 ? (
        <p>No connected users found.</p>
      ) : (
        <ul className="space-y-2">
          {users.map((user) => (
            <li
              key={user._id}
              className="p-3 border rounded-md shadow-sm hover:bg-gray-50"
            >
              <h2 className="font-semibold">{user.name}</h2>
              <p>{user.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyNetwork;
