import { motion } from 'framer-motion'
import { UserPlus, Users, Zap } from 'lucide-react';

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

export const SuggestionCard = ({ suggestion }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-3 flex-1">
                <img
                    src={suggestion.avatar}
                    alt={suggestion.name}
                    className="w-12 h-12 rounded-xl object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-gray-900">{suggestion.name}</h3>
                    <p className="text-gray-600 text-sm">{suggestion.title} · {suggestion.company}</p>
                    <p className="text-gray-500 text-xs mt-1">{suggestion.location}</p>
                </div>
            </div>
            <div className="flex items-center space-x-1 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg">
                <Zap className="w-3 h-3" />
                <span>{suggestion.score}%</span>
            </div>
        </div>

        <div className="text-xs text-gray-600 mb-3">
            <span className="font-medium">Why connect:</span> {suggestion.reason}
        </div>

        <div className="flex items-center text-xs text-gray-500 mb-4">
            <Users className="w-3 h-3 mr-1" />
            <span>{suggestion.mutual} mutual connections</span>
        </div>

        {suggestion.sharedSkills && (
            <div className="flex flex-wrap gap-1 mb-4">
                {suggestion.sharedSkills.map((skill, index) => (
                    <span
                        key={index}
                        className="px-2 py-1 bg-purple-50 text-purple-700 text-xs rounded-lg border border-purple-100"
                    >
                        {skill}
                    </span>
                ))}
            </div>
        )}

        <motion.button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm flex items-center justify-center space-x-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <UserPlus className="w-4 h-4" />
            <span>Connect</span>
        </motion.button>
    </motion.div>
);