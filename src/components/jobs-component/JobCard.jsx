import { motion } from 'framer-motion';
import { Bookmark, Briefcase, Building, Clock, DollarSign, MapPin, Share2, Star, Users, Zap } from 'lucide-react';

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

export const JobCard = ({ job, onToggleSave }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        whileHover="hover"
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 group"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
                <div className="relative">
                    <img
                        src={job.companyLogo}
                        alt={job.company}
                        className="w-14 h-14 rounded-xl object-cover border-2 border-white shadow-sm"
                    />
                    {job.featured && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-amber-500 rounded-full border-2 border-white flex items-center justify-center">
                            <Star className="w-2.5 h-2.5 text-white" />
                        </div>
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-bold text-gray-900 text-lg">{job.title}</h3>
                        {job.urgent && (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full font-medium">
                                Urgent
                            </span>
                        )}
                    </div>
                    <div className="flex items-center space-x-3 text-gray-600 mb-2">
                        <div className="flex items-center space-x-1">
                            <Building className="w-4 h-4" />
                            <span className="font-medium">{job.company}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <MapPin className="w-4 h-4" />
                            <span>{job.location}</span>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                            <Briefcase className="w-4 h-4" />
                            <span>{job.type}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            <Clock className="w-4 h-4" />
                            <span>{job.posted}</span>
                        </div>
                        {job.salary && (
                            <div className="flex items-center space-x-1">
                                <DollarSign className="w-4 h-4" />
                                <span>{job.salary}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <motion.button
                onClick={() => onToggleSave(job.id)}
                className={`p-2 rounded-lg transition-all duration-200 ${job.saved
                        ? 'text-amber-500 bg-amber-50 hover:bg-amber-100'
                        : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                    }`}
                whileHover={{ scale: 1.1 }}
            >
                <Bookmark className={`w-5 h-5 ${job.saved ? 'fill-current' : ''}`} />
            </motion.button>
        </div>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">{job.description}</p>

        <div className="flex flex-wrap gap-2 mb-4">
            {job.skills.slice(0, 4).map((skill, index) => (
                <span
                    key={index}
                    className="px-3 py-1 bg-blue-50 text-blue-700 text-sm rounded-lg border border-blue-100 font-medium"
                >
                    {skill}
                </span>
            ))}
            {job.skills.length > 4 && (
                <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-lg">
                    +{job.skills.length - 4} more
                </span>
            )}
        </div>

        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2 text-sm text-gray-500">
                <Users className="w-4 h-4" />
                <span>{job.applicants} applicants</span>
                {job.easyApply && (
                    <span className="flex items-center space-x-1 text-green-600">
                        <Zap className="w-4 h-4" />
                        <span>Easy Apply</span>
                    </span>
                )}
            </div>
            <div className="flex space-x-2">
                <motion.button
                    className="px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-all duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                >
                    <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 text-sm"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                >
                    Apply Now
                </motion.button>
            </div>
        </div>
    </motion.div>
);