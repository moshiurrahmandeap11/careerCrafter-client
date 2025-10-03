import { motion } from "framer-motion";
import { Check } from "lucide-react";
import useAuth from "../../hooks/UseAuth/useAuth";

const messageVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      type: "spring",
      stiffness: 500,
      damping: 30,
    },
  },
};

export const MessageBubble = ({ message }) => {
  const {user} = useAuth()
  return (
    <motion.div
      variants={messageVariants}
      initial="hidden"
      animate="visible"
      className={`flex ${
        message.senderName !== user.displayName ? "justify-end" : "justify-start"
      } mb-4`}
    >
      <div
        className={`max-w-xs lg:max-w-md px-4 py-2 rounded-2xl ${
          message.senderName
            ? "bg-blue-600 text-white rounded-br-none"
            : "bg-gray-100 text-gray-900 rounded-bl-none"
        }`}
      >
        <p className="text-sm">{message.text}</p>
        <div
          className={`text-xs mt-1 flex items-center justify-end space-x-1 ${
            message.isSender ? "text-blue-200" : "text-gray-500"
          }`}
        >
          <span>
            {new Date(message.date).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </span>
          {message.isSender && message.read && <Check className="w-3 h-3" />}
        </div>
      </div>
    </motion.div>
  );
};
