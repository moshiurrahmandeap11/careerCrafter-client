import React, { useEffect } from 'react';
import useAuth from '../../../hooks/UseAuth/useAuth';
import { useDispatch, useSelector } from 'react-redux';
import useAxiosSecure from '../../../hooks/AxiosIntense/useAxiosSecure';
import { fetchSuggestedUsers } from '../../../redux-slices/networkSlice';
import SuggestionCard from '../../../components/network-components/SuggestionCard';
import Loader from '../../../components/sharedItems/Loader/Loader'

const SuggetionConnectPage = () => {
  const { user } = useAuth()
  const dispatch = useDispatch();
  const axiosSecure = useAxiosSecure()
  const { isLoading, suggestedUsers, error } = useSelector((state) => state.network);

  useEffect(() => {
    if (user?.email) {
      dispatch(fetchSuggestedUsers({ email: user.email, axiosSecure }));
    }

  }, [dispatch, user?.email, axiosSecure]);

  if (isLoading) return <Loader></Loader>;
  if (error) return <p>Error: {error}</p>;
  return (
    <div className="">
      <h1 className="text-xl md:text-3xl font-bold mb-3">People you may know</h1>
      {suggestedUsers.length === 0 ? (
        <p>No connected users found.</p>
      ) : (
        <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {suggestedUsers.map((user) => (
            <SuggestionCard key={user._id} user={user}></SuggestionCard>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SuggetionConnectPage;