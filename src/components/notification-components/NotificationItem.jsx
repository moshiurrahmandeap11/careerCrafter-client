import { motion } from 'framer-motion'
import { NotificationIcon } from './NotificationIcon';
import { Check, Users, X } from 'lucide-react';

const itemVariants = {
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
        backgroundColor: "rgba(249, 250, 251, 1)",
        transition: {
            type: "spring",
            stiffness: 400,
            damping: 17
        }
    }
};

export const NotificationItem = ({ notification }) => (
    <motion.div
        variants={itemVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className={`p-4 rounded-xl border transition-all duration-300 ${notification.read
            ? 'bg-white border-gray-200'
            : 'bg-blue-50 border-blue-200 shadow-sm'
            }`}
    >
        <div className="flex items-start space-x-3">
            {/* Avatar */}
            <div className="relative">
                <img
                    src={notification.senderAvatar}
                    alt={notification.senderName}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div className="absolute -bottom-1 -right-1">
                    <NotificationIcon type={notification.type} priority={notification.priority} />
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                        <p className="text-gray-900 text-sm leading-relaxed">
                            <span className="font-semibold">{notification.senderName}</span>
                            {' '}{notification.message}
                        </p>

                        {notification.postPreview && (
                            <div className="mt-2 p-3 bg-gray-50 rounded-lg border border-gray-200">
                                <p className="text-gray-600 text-sm italic">"{notification.postPreview}"</p>
                            </div>
                        )}

                        {notification.mutualConnections && (
                            <div className="flex items-center space-x-1 mt-2 text-xs text-blue-600">
                                <Users className="w-3 h-3" />
                                <span>{notification.mutualConnections} mutual connections</span>
                            </div>
                        )}
                    </div>

                    {/* Time and Actions */}
                    <div className="flex items-start space-x-2 ml-2">
                        <span className="text-xs text-gray-500 whitespace-nowrap">
                            {notification.time}
                        </span>
                        <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            {!notification.read && (
                                <motion.button
                                    onClick={() => markAsRead(notification.id)}
                                    className="p-1 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded transition-colors duration-200"
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                >
                                    <Check className="w-3 h-3" />
                                </motion.button>
                            )}
                            <motion.button
                                onClick={() => deleteNotification(notification.id)}
                                className="p-1 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors duration-200"
                                whileHover={{ scale: 1.1 }}
                                whileTap={{ scale: 0.9 }}
                            >
                                <X className="w-3 h-3" />
                            </motion.button>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                {notification.actions && (
                    <div className="flex items-center space-x-2 mt-3 pt-3 border-t border-gray-100">
                        {notification.actions.includes('accept') && (
                            <motion.button
                                className="px-3 py-1.5 bg-blue-600 text-white text-xs font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Accept
                            </motion.button>
                        )}
                        {notification.actions.includes('reply') && (
                            <motion.button
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Reply
                            </motion.button>
                        )}
                        {notification.actions.includes('view') && (
                            <motion.button
                                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-medium rounded-lg hover:bg-gray-200 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                View Post
                            </motion.button>
                        )}
                        {notification.actions.includes('apply') && (
                            <motion.button
                                className="px-3 py-1.5 bg-green-600 text-white text-xs font-medium rounded-lg hover:bg-green-700 transition-colors duration-200"
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                Apply Now
                            </motion.button>
                        )}
                    </div>
                )}
            </div>
        </div>
    </motion.div>
);