import { motion } from 'framer-motion'
import { Check, Users, X } from 'lucide-react';
import { useState } from 'react';
import useAuth from '../../hooks/UseAuth/useAuth';
import useAxiosSecure from '../../hooks/AxiosIntense/useAxiosSecure';
import Swal from 'sweetalert2';
import MainButton from '../sharedItems/MainButton/MainButton';

const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
        y: 0,
        opacity: 1,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24
        }
    },
    hover: {
        y: -2,
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17
        }
    }
};

// Real time calculation function
const getTimeAgo = (dateString) => {
    if (!dateString) return 'Recently';
    
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now - date;
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    
    if (diffInSeconds < 60) {
        return 'Just now';
    } else if (diffInMinutes < 60) {
        return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
    } else if (diffInHours < 24) {
        return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
    } else if (diffInDays === 1) {
        return '1 day ago';
    } else if (diffInDays < 7) {
        return `${diffInDays} days ago`;
    } else if (diffInDays < 30) {
        const weeks = Math.floor(diffInDays / 7);
        return `${weeks} week${weeks > 1 ? 's' : ''} ago`;
    } else {
        const months = Math.floor(diffInDays / 30);
        return `${months} month${months > 1 ? 's' : ''} ago`;
    }
};

export const PendingCard = ({ invitation, onUpdate }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [action, setAction] = useState(null); // 'accept' or 'ignore'
    const authUser = useAuth();
    
    const axiosSecure = useAxiosSecure();

    const handleAccept = async () => {
        if (!authUser?.user?.email) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Required',
                text: 'Please login to accept connection requests',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        if (!axiosSecure || typeof axiosSecure.post !== 'function') {
            console.error('Axios instance is not properly initialized');
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please try again later',
                timer: 3000,
                showConfirmButton: true
            });
            return;
        }

        setIsLoading(true);
        setAction('accept');

        try {
            const res = await axiosSecure.post('/network/accept-request', {
                requestId: invitation._id,
                senderEmail: invitation.senderEmail,
                receiverEmail: authUser.user.email
            });

            if (res.data.success) {
                Swal.fire({
                    icon: 'success',
                    title: 'Connection Accepted!',
                    text: `You are now connected with ${invitation.senderDetails?.name || invitation.senderEmail}`,
                    timer: 2000,
                    showConfirmButton: false
                });
                
                if (onUpdate) {
                    onUpdate(invitation._id, 'accepted');
                }
            } else {
                throw new Error(res.data.message || 'Failed to accept request');
            }
        } catch (error) {
            console.error('Accept connection error:', error);
            
            let errorMessage = 'Failed to accept connection request';
            
            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message || 'Unknown error occurred';
            }

            Swal.fire({
                icon: 'error',
                title: 'Failed to Accept',
                text: errorMessage,
                timer: 4000,
                showConfirmButton: true
            });
        } finally {
            setIsLoading(false);
            setAction(null);
        }
    };

    const handleIgnore = async () => {
        if (!authUser?.user?.email) {
            Swal.fire({
                icon: 'error',
                title: 'Authentication Required',
                text: 'Please login to manage connection requests',
                timer: 2000,
                showConfirmButton: false
            });
            return;
        }

        if (!axiosSecure || typeof axiosSecure.post !== 'function') {
            console.error('Axios instance is not properly initialized');
            Swal.fire({
                icon: 'error',
                title: 'Network Error',
                text: 'Please try again later',
                timer: 3000,
                showConfirmButton: true
            });
            return;
        }

        setIsLoading(true);
        setAction('ignore');

        try {
            const res = await axiosSecure.post('/network/ignore-request', {
                requestId: invitation._id,
                senderEmail: invitation.senderEmail,
                receiverEmail: authUser.user.email
            });

            if (res.data.success) {
                Swal.fire({
                    icon: 'info',
                    title: 'Request Ignored',
                    text: 'Connection request has been ignored',
                    timer: 2000,
                    showConfirmButton: false
                });
                
                if (onUpdate) {
                    onUpdate(invitation._id, 'ignored');
                }
            } else {
                throw new Error(res.data.message || 'Failed to ignore request');
            }
        } catch (error) {
            console.error('Ignore connection error:', error);
            
            let errorMessage = 'Failed to ignore connection request';
            
            if (error.response) {
                errorMessage = error.response.data?.message || `Server error: ${error.response.status}`;
            } else if (error.request) {
                errorMessage = 'No response from server. Please check your connection.';
            } else {
                errorMessage = error.message || 'Unknown error occurred';
            }

            Swal.fire({
                icon: 'error',
                title: 'Failed to Ignore',
                text: errorMessage,
                timer: 4000,
                showConfirmButton: true
            });
        } finally {
            setIsLoading(false);
            setAction(null);
        }
    };

    // Get sender details
    const senderDetails = invitation.senderDetails || {};
    const avatar = senderDetails.photo || senderDetails.profileImage || '/default-avatar.png';
    const name = senderDetails.name || senderDetails.fullName || invitation.senderEmail;
    const title = senderDetails.profession || senderDetails.role || 'Professional';
    const company = senderDetails.company || '';

    return (
        <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            whileHover="hover"
            className="bg-white rounded-xl p-3 md:p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
        >
            <div className="flex items-start mb-4 flex-col md:flex-row md:justify-between">
                <div className="">
                    <h3 className="font-semibold text-xs text-gray-900">{name}</h3>
                    <p className="text-gray-600 text-sm">
                        {title}{company && ` · ${company}`}
                    </p>
                </div>
                <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                    {getTimeAgo(invitation.createdAt)}
                </div>
            </div>

            {invitation.message && (
                <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4 italic border border-gray-100">
                    "{invitation.message}"
                </p>
            )}

            <div className="flex space-x-2">
                <MainButton
                    onClick={handleAccept}
                    disabled={isLoading && action === 'accept'}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 text-sm flex items-center justify-center space-x-2 ${
                        isLoading && action === 'accept' 
                            ? 'bg-blue-400 text-white cursor-not-allowed' 
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                    }`}
                >
                    {isLoading && action === 'accept' ? (
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                        <Check className="w-4 h-4" />
                    )}
                    <span>
                        {isLoading && action === 'accept' ? 'Accepting...' : 'Accept'}
                    </span>
                </MainButton>
                
                <button
                    onClick={handleIgnore}
                    disabled={isLoading && action === 'ignore'}
                    className={`flex-1 py-2.5 px-4 rounded-lg font-semibold transition-all duration-200 text-sm ${
                        isLoading && action === 'ignore'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                >
                    {isLoading && action === 'ignore' ? 'Ignoring...' : 'Ignore'}
                </button>
            </div>
        </motion.div>
    );
};