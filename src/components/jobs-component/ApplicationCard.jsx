import { motion } from 'framer-motion'
import { ChevronRight } from 'lucide-react';

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



export const ApplicationCard = ({ application }) => (
    <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-white rounded-xl p-6 border border-gray-200 shadow-sm"
    >
        <div className="flex items-start justify-between mb-4">
            <div className="flex items-start space-x-4 flex-1">
                <img
                    src={application.companyLogo}
                    alt={application.company}
                    className="w-12 h-12 rounded-lg object-cover border-2 border-white shadow-sm"
                />
                <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-gray-900">{application.title}</h3>
                    <p className="text-gray-600">{application.company} · {application.location}</p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500 mt-1">
                        <span>Applied {application.appliedDate}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${application.status === 'In Review' ? 'bg-blue-100 text-blue-700' :
                                application.status === 'Interview' ? 'bg-amber-100 text-amber-700' :
                                    application.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-green-100 text-green-700'
                            }`}>
                            {application.status}
                        </span>
                    </div>
                </div>
            </div>
            <ChevronRight className="w-5 h-5 text-gray-400" />
        </div>
        {application.updates && application.updates.length > 0 && (
            <div className="bg-gray-50 rounded-lg p-3 text-sm text-gray-600">
                <strong>Latest update:</strong> {application.updates[0]}
            </div>
        )}
    </motion.div>
);