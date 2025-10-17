import React, { useState } from "react";
import useAuth from "../../hooks/UseAuth/useAuth";

import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { removeUser } from "../../redux-slices/networkSlice";
import MainButton from "../sharedItems/MainButton/MainButton";
import useAxiosSecure from "../../hooks/AxiosIntense/useAxiosSecure";


const AlluserConnectionCard = ({ user }) => {
  const {
    fullName,
    email,
    profileImage,
    role,
    tags,
    planName,
    isPremium,
    _id
  } = user;

  const authUser = useAuth();
  const senderEmail = authUser?.user?.email;
  const axiosPublic = useAxiosSecure();
  const dispatch = useDispatch();

  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

const handleConnect = async (receiverEmail) => {
    if (!senderEmail) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            timer: 2000,
            timerProgressBar: true,
            text: 'Please log in to send connection requests!',
            showConfirmButton: false
        });
    }

    if (senderEmail === receiverEmail) {
        return Swal.fire({
            icon: 'error',
            title: 'Oops...',
            timer: 2000,
            timerProgressBar: true,
            text: 'You cannot connect with yourself!',
            showConfirmButton: false
        });
    }

    setIsLoading(true);

    try {
        console.log('Sending connection request...', {
            senderEmail,
            receiverEmail
        });

        const res = await axiosPublic.post("/network/send-connect-request", {
            senderEmail,
            receiverEmail,
        });

        console.log('Connection request response:', res.data);

        if (res.data.success) {
            setIsConnected(true);
            
            // Remove user from Redux store after successful connection
            dispatch(removeUser(email));
            
            Swal.fire({
                icon: 'success',
                title: 'Request Sent!',
                timer: 2000,
                timerProgressBar: true,
                text: `${res.data.message}`,
                showConfirmButton: false
            });
        } else {
            // Handle specific error messages
            let errorMessage = res.data.message;
            if (errorMessage.includes('already exists')) {
                errorMessage = 'You have already sent a connection request to this user. Please wait for their response.';
            }
            
            Swal.fire({
                icon: 'error',
                title: 'Request Failed',
                timer: 3000,
                timerProgressBar: true,
                text: errorMessage,
                showConfirmButton: true
            });
        }
    } catch (error) {
        console.error("Send connect error:", error);
        
        let errorMessage = 'Failed to send connection request';
        
        if (error.response) {
            errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            
            // Handle specific error cases
            if (errorMessage.includes('already exists')) {
                errorMessage = 'Connection already exists or pending. You cannot send another request.';
            } else if (error.response.status === 404) {
                errorMessage = 'User not found. Please check the email address.';
            }
        } else if (error.request) {
            errorMessage = 'No response from server. Please check your connection.';
        } else {
            errorMessage = error.message || 'Unknown error occurred';
        }

        Swal.fire({
            icon: 'error',
            title: 'Request Failed',
            timer: 3000,
            timerProgressBar: true,
            text: errorMessage,
            showConfirmButton: true
        });
    } finally {
        setIsLoading(false);
    }
};

  return (
    <div className="bg-white shadow-md rounded-xl p-5 flex flex-col md:flex-row items-center justify-between transition-all duration-200 border border-gray-100 hover:shadow-lg">
      {/* Left side */}
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative">
          <img
            src={profileImage || "https://i.postimg.cc/85JwcYck/boy.png"}
            alt={fullName}
            className="w-16 h-16 rounded-xl border border-blue-300 object-cover"
          />
          {isPremium && (
            <div className="absolute -top-1 -right-1 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-0.5 rounded-md">
              {planName}
            </div>
          )}
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {fullName}
          </h2>
          <p className="text-gray-500 text-sm mt-1">{email}</p>
          <p className="text-blue-500 text-sm capitalize font-medium mt-1">
            {role}
          </p>

          {tags && tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-2">
              {tags.slice(0, 3).map((tag, index) => (
                <span
                  key={index}
                  className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-md"
                >
                  {tag}
                </span>
              ))}
              {tags.length > 3 && (
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded-md">
                  +{tags.length - 3} more
                </span>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Right side buttons */}
      <div className="flex flex-row gap-2 mt-4 md:mt-0 w-full md:w-auto">
        <MainButton 
          onClick={() => handleConnect(email)}
          disabled={isConnected || isLoading}
          className={` ${
            isConnected 
              ? 'bg-green-500 text-white cursor-default' 
              : isLoading
              ? 'bg-gray-400 text-white cursor-not-allowed'
              : 'bg-blue-500 text-white hover:bg-blue-600'
          }`}
        >
          {isLoading ? 'Sending...' : isConnected ? 'Request Sent' : 'Connect'}
        </MainButton>
        <button className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium">
          View Profile
        </button>
      </div>
    </div>
  );
};

export default AlluserConnectionCard;