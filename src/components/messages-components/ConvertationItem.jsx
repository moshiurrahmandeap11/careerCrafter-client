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
export const ConversationItem = ({ conversation, isSelected, onClick }) => (
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
        <img
          src={conversation.profileImage}
          alt={conversation.fullName}
          className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
        />
        {/* {conversation.user.online && (
          <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
        )} */}
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
          {/* <span className="text-xs text-gray-500 whitespace-nowrap">
            {conversation?.lastMessageTime}
          </span> */}
        </div>
        {/* 
        <p className="text-sm text-gray-600 truncate mb-1">
          {conversation.user.title} · {conversation.user.company}
        </p> */}

        <div className="flex items-center justify-between">
          {/* <p
            className={`text-sm truncate ${
              conversation.unread
                ? "font-semibold text-gray-900"
                : "text-gray-600"
            }`}
          >
            {conversation.lastMessage}
          </p> */}
          {/* {conversation.unread && (
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-blue-600 font-medium">
                {conversation.unread}
              </span>
            </div>
          )} */}
        </div>
      </div>
    </div>
  </motion.div>
);
