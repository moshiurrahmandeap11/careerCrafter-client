import { motion } from 'framer-motion';
import { Bookmark } from 'lucide-react';

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

export const SavedJobCard = ({ job, onToggleSave }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
                <img
                    src={job.companyLogo}
                    alt={job.company}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{job.title}</h3>
                    <p className="text-gray-600">{job.company} · {job.location}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>{job.type}</span>
                        <span>{job.posted}</span>
                    </div>
                </div>
            </div>
            <button
                onClick={() => onToggleSave(job.id)}
                className="text-amber-500 hover:text-amber-600 transition-colors duration-200"
            >
                <Bookmark className="w-5 h-5 fill-current" />
            </button>
        </div>
        <div className="flex space-x-2">
            <motion.button
                className="flex-1 bg-blue-600 text-white py-2.5 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                Apply Now
            </motion.button>
            <motion.button
                className="flex-1 bg-gray-100 text-gray-700 py-2.5 px-4 rounded-lg font-semibold hover:bg-gray-200 transition-all duration-200 text-sm"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
            >
                View Details
            </motion.button>
        </div>
    </motion.div>
);