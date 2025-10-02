import { motion } from 'framer-motion'
import { Building, MessageCircle, MoreHorizontal, Sparkles, Users } from 'lucide-react';


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

export const ConnectionCard = ({ connection }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
                <div className="relative">
                    <img
                        src={connection.avatar}
                        alt={connection.name}
                        className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    {connection.online && (
                        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                        <h3 className="font-semibold text-gray-900 truncate">{connection.name}</h3>
                        {connection.online && (
                            <Sparkles className="w-3 h-3 text-green-500" />
                        )}
                    </div>
                    <p className="text-gray-600 text-sm truncate">{connection.title}</p>
                    <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                        <Building className="w-3 h-3" />
                        <span className="truncate">{connection.company}</span>
                    </div>
                </div>
            </div>
            <motion.button
                className="opacity-0 group-hover:opacity-100 p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-lg transition-all duration-200"
                whileHover={{ scale: 1.1 }}
            >
                <MoreHorizontal className="w-4 h-4" />
            </motion.button>
        </div>

        <div className="flex flex-wrap gap-1 mb-3">
            {connection.tags?.slice(0, 3).map((tag, index) => (
                <span
                    key={index}
                    className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg border border-blue-100"
                >
                    {tag}
                </span>
            ))}
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-1">
                <Users className="w-3 h-3" />
                <span>{connection.mutual} mutual</span>
            </div>
            <span className="text-gray-400">{connection.connectedDate}</span>
        </div>

        <div className="flex space-x-2 mt-4 pt-4 border-t border-gray-100">
            <motion.button
                className="flex-1 bg-blue-50 text-blue-700 py-2 px-3 rounded-lg font-medium hover:bg-blue-100 transition-all duration-200 text-sm flex items-center justify-center space-x-1"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <MessageCircle className="w-3 h-3" />
                <span>Message</span>
            </motion.button>
            <motion.button
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-3 rounded-lg font-medium hover:bg-gray-200 transition-all duration-200 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                View Profile
            </motion.button>
        </div>
    </motion.div>
);