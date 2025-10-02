import { motion } from 'framer-motion'
import { Check, Users } from 'lucide-react';


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
export const PendingCard = ({ invitation }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-start space-x-3 mb-4">
            <img
                src={invitation.avatar}
                alt={invitation.name}
                className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
            />
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{invitation.name}</h3>
                <p className="text-gray-600 text-sm">{invitation.title} · {invitation.company}</p>
                <p className="text-gray-500 text-xs mt-1">{invitation.location}</p>
                <div className="flex items-center space-x-2 mt-1 text-xs text-blue-600">
                    <Users className="w-3 h-3" />
                    <span>{invitation.mutualConnections} mutual connections</span>
                </div>
            </div>
            <div className="text-xs text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                {invitation.daysAgo}d ago
            </div>
        </div>

        <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg mb-4 italic border border-gray-100">
            "{invitation.message}"
        </p>

        <div className="flex space-x-2">
            <motion.button
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 text-sm flex items-center justify-center space-x-2"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                <Check className="w-4 h-4" />
                <span>Accept</span>
            </motion.button>
            <motion.button
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                Ignore
            </motion.button>
        </div>
    </motion.div>
);