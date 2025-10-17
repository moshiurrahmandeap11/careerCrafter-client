import React, { useState } from "react";
import useAuth from "../../hooks/UseAuth/useAuth";
import Swal from "sweetalert2";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import { User, Crown, Mail, ExternalLink } from 'lucide-react';

// Fallback Avatar Component
const FallbackAvatar = ({ name, className }) => {
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const getColor = (name) => {
        const colors = [
            'bg-blue-500', 'bg-green-500', 'bg-purple-500', 
            'bg-orange-500', 'bg-pink-500', 'bg-teal-500'
        ];
        const index = name.length % colors.length;
        return colors[index];
    };

    return (
        <div className={`${className} ${getColor(name)} rounded-xl flex items-center justify-center text-white font-semibold border border-blue-300`}>
            {getInitials(name)}
        </div>
    );
};

const SuggestionCard = ({ user }) => {
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
    const axiosPublic = axiosIntense;
    const [isConnected, setIsConnected] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [imageError, setImageError] = useState(false);

    const handleConnect = async (receiverEmail) => {
        if (!senderEmail) {
            return Swal.fire({
                icon: 'error',
                title: 'Login Required',
                text: 'Please log in to send connection requests!',
                timer: 2000,
                showConfirmButton: false
            });
        }

        if (senderEmail === receiverEmail) {
            return Swal.fire({
                icon: 'error',
                title: 'Not Allowed',
                text: 'You cannot connect with yourself!',
                timer: 2000,
                showConfirmButton: false
            });
        }

        setIsLoading(true);

        try {
            const res = await axiosPublic.post("/network/send-connect-request", {
                senderEmail,
                receiverEmail,
            });

            if (res.data.success) {
                setIsConnected(true);
                Swal.fire({
                    icon: 'success',
                    title: 'Request Sent!',
                    text: res.data.message,
                    timer: 2000,
                    showConfirmButton: false
                });
            } else {
                Swal.fire({
                    icon: 'error',
                    title: 'Failed',
                    text: res.data.message,
                    timer: 2000,
                    showConfirmButton: true
                });
            }
        } catch (error) {
            console.error("Send connect error:", error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.response?.data?.message || 'Failed to send connection request',
                timer: 2000,
                showConfirmButton: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const handleViewProfile = () => {
        Swal.fire({
            icon: 'info',
            title: 'View Profile',
            text: `View ${fullName}'s profile`,
            timer: 1500
        });
    };

    return (
        <div className="bg-white shadow-sm rounded-xl p-4 border border-gray-200 hover:shadow-md transition-all duration-200 w-full">
            {/* User Info Section */}
            <div className="flex flex-col sm:flex-row items-start gap-4 mb-4">
                {/* Avatar Section */}
                <div className="flex justify-center sm:justify-start relative">
                    {profileImage && !imageError ? (
                        <img
                            src={profileImage}
                            alt={fullName}
                            className="w-16 h-16 rounded-xl object-cover border border-blue-200"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <FallbackAvatar 
                            name={fullName} 
                            className="w-16 h-16 rounded-xl text-lg"
                        />
                    )}
                    
                    {isPremium && (
                        <div className="absolute -top-2 -right-2 bg-yellow-400 text-gray-900 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
                            <Crown className="w-3 h-3" />
                            <span className="hidden xs:inline">{planName}</span>
                        </div>
                    )}
                </div>

                {/* User Details */}
                <div className="flex-1 text-center sm:text-left">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 mb-2">
                        <h2 className="text-lg font-semibold text-gray-800 flex items-center justify-center sm:justify-start gap-2">
                            <User className="w-4 h-4 text-gray-500" />
                            {fullName}
                        </h2>
                    </div>
                    
                    <div className="space-y-1 mb-3">
                        <p className="text-gray-500 text-sm flex items-center justify-center sm:justify-start gap-2">
                            <Mail className="w-3 h-3" />
                            {email}
                        </p>
                        <p className="text-blue-500 text-sm capitalize font-medium">
                            {role || 'Professional'}
                        </p>
                    </div>

                    {/* Tags */}
                    {tags && tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 justify-center sm:justify-start">
                            {tags.slice(0, 3).map((tag, index) => (
                                <span
                                    key={index}
                                    className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-100"
                                >
                                    {tag}
                                </span>
                            ))}
                            {tags.length > 3 && (
                                <span className="text-xs bg-gray-50 text-gray-600 px-2 py-1 rounded-lg border border-gray-100">
                                    +{tags.length - 3} more
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col xs:flex-row gap-2 pt-4 border-t border-gray-100">
                <button 
                    onClick={() => handleConnect(email)}
                    disabled={isConnected || isLoading}
                    className={`
                        flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-all flex items-center justify-center gap-2
                        ${isConnected 
                            ? 'bg-green-500 text-white hover:bg-green-600' 
                            : isLoading
                            ? 'bg-gray-400 text-white cursor-not-allowed'
                            : 'bg-blue-500 text-white hover:bg-blue-600'
                        }
                    `}
                >
                    {isLoading ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            <span>Sending...</span>
                        </>
                    ) : isConnected ? (
                        <>
                            <div className="w-4 h-4 bg-white rounded-full flex items-center justify-center">
                                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            </div>
                            <span>Request Sent</span>
                        </>
                    ) : (
                        <>
                            <span>+</span>
                            <span>Connect</span>
                        </>
                    )}
                </button>
                
                <button 
                    onClick={handleViewProfile}
                    className="flex-1 py-2 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all text-sm font-medium flex items-center justify-center gap-2"
                >
                    <ExternalLink className="w-4 h-4" />
                    <span>Profile</span>
                </button>
            </div>
        </div>
    );
};

export default SuggestionCard;