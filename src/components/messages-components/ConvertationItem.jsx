import { motion } from "framer-motion";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 24,
    },
  },
};
export const ConversationItem = ({ conversation, isSelected, onClick }) => {
  return (
    <motion.div
      variants={itemVariants}
      className={`p-4 border-b border-gray-100 cursor-pointer transition-all duration-200 group ${
        isSelected
          ? "bg-blue-50 border-l-4 border-l-blue-500"
          : "hover:bg-gray-50"
      }`}
      onClick={onClick}
    >
      <div className="flex items-start space-x-3">
        <div className="relative">
          {conversation.profileImage ? (
            <img
              src={conversation.profileImage}
              alt={conversation.fullName}
              className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg border-2 border-white shadow-sm">
              {conversation.fullName
                ? conversation.fullName.charAt(0).toUpperCase()
                : "?"}
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h3
              className={`font-semibold truncate ${
                isSelected ? "text-blue-700" : "text-gray-900"
              }`}
            >
              {conversation.fullName}
            </h3>
          </div>

          <div className="flex items-center justify-between">
            <p
              className={`text-sm truncate ${
                conversation.unread
                  ? "font-semibold text-gray-900"
                  : "text-gray-600"
              }`}
            >
              {conversation.lastMessage || "No messages yet"}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
