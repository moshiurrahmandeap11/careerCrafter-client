// MessagesPage.jsx (updated)
import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  MessageCircle,
  Send,
  Paperclip,
  Smile,
  Video,
  Phone,
  Info,
  ArrowLeft,
} from "lucide-react";
import { motion } from "framer-motion";
import { MessageBubble } from "../../components/messages-components/MessageBubble";
import { ConversationItem } from "../../components/messages-components/ConvertationItem";
import { ReTitle } from "re-title";

// Redux imports
import {
  fetchConversations,
  sendMessage,
  setSearchTerm,
  setSelectedConversation,
  setMobileView,
  markConversationAsRead,
  clearError,
} from "../../redux-slices/messagesSlice";
import {
  selectConversations,
  selectSelectedConversation,
  selectSearchTerm,
  selectLoading,
  selectError,
  selectMobileView,
  selectSendingMessage,
  selectFilteredConversations,
  selectUnreadCount,
} from "../../redux-selectors/messagesSelectors";
import useAuth from "../../hooks/UseAuth/useAuth";
import axiosIntense from "../../hooks/AxiosIntense/axiosIntense";
import { io } from "socket.io-client";
import { connectWS } from "../../hooks/connect";
import { CallModal } from "../../components/CallModal/CallModal";
import { useWebRTC } from "../../hooks/useWebRTC/useWebRTC";

const MessagesPage = () => {
  const { user, loading: emailLoading } = useAuth();
  const socket = useRef(null);
  const dispatch = useDispatch();

  // Selectors
  const conversations = useSelector(selectConversations);
  const selectedConversation = useSelector(selectSelectedConversation);
  const searchTerm = useSelector(selectSearchTerm);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const mobileView = useSelector(selectMobileView);
  const sendingMessage = useSelector(selectSendingMessage);
  const filteredConversations = useSelector(selectFilteredConversations);
  const unreadCount = useSelector(selectUnreadCount);
  const [lastMessages, setLastMessages] = useState({});
  const [newMessage, setNewMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [allUser, setAllUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");
  // Call States
  const [callState, setCallState] = useState({
    isCallActive: false,
    isIncomingCall: false,
    isOutgoingCall: false,
    callType: null, // 'video' or 'audio'
    callerInfo: null,
    isAudioMuted: false,
    isVideoOff: false,
  });

  // WebRTC Hook
  const webrtc = useWebRTC();

  // Fetch messages function
  const fetchMessages = async (friendEmail) => {
    if (!user?.email) {
      console.warn("fetchMessages aborted: user.email not ready yet");
      return;
    }
    if (!friendEmail) {
      console.warn("fetchMessages aborted: friendEmail is missing");
      return;
    }

    try {
      const url = `/messageUsers/messages?userEmail=${encodeURIComponent(
        user.email
      )}&friendEmail=${encodeURIComponent(friendEmail)}`;

      const res = await axiosIntense.get(url);
      const payload = res.data;
      const chats = Array.isArray(payload)
        ? payload
        : payload.data || payload.chats || [];

      setMessages(chats || []);
    } catch (err) {
      console.error(
        "Error fetching messages:",
        err?.response?.status,
        err?.response?.data || err.message
      );
    }
  };

  const fetchLastMessage = async (friendEmail) => {
    if (!user?.email) return;

    try {
      const res = await axiosIntense.get("/messageUsers/last-message", {
        params: {
          userEmail: user.email,
          friendEmail: friendEmail,
        },
      });

      if (res.data.length > 0) {
        const lastMsg = res.data[0];
        setLastMessages((prev) => ({
          ...prev,
          [friendEmail]: lastMsg.message,
        }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!allUser) return;

    allUser.forEach((userObj) => {
      fetchLastMessage(userObj.email);
    });
  }, [allUser]);

  // Socket event handlers for calls
  useEffect(() => {
    if (!socket.current) return;

    // Handle incoming call
    socket.current.on("incoming-call", async (data) => {
      const { from, callType, offer } = {
        from: data.callerInfo,
        callType: data.callType,
        offer: data.offer,
      };

      setCallState({
        isCallActive: false,
        isIncomingCall: true,
        isOutgoingCall: false,
        callType,
        callerInfo: from,
        isAudioMuted: false,
        isVideoOff: false,
      });

      // Initialize peer connection for incoming call
      webrtc.initializePeerConnection();
    });

    // Handle call accepted
    socket.current.on("call-accepted", async (data) => {
      const { answer } = data;
      await webrtc.handleAnswer(answer);
      setCallState((prev) => ({
        ...prev,
        isCallActive: true,
        isOutgoingCall: false,
      }));
    });

    // Handle call rejected
    socket.current.on("call-rejected", () => {
      webrtc.stopCall();
      setCallState({
        isCallActive: false,
        isIncomingCall: false,
        isOutgoingCall: false,
        callType: null,
        callerInfo: null,
        isAudioMuted: false,
        isVideoOff: false,
      });
    });

    // Handle ICE candidates
    socket.current.on("ice-candidate", (data) => {
      webrtc.handleIceCandidate(data.candidate);
    });

    // Handle call ended
    socket.current.on("call-ended", () => {
      webrtc.stopCall();
      setCallState({
        isCallActive: false,
        isIncomingCall: false,
        isOutgoingCall: false,
        callType: null,
        callerInfo: null,
        isAudioMuted: false,
        isVideoOff: false,
      });
    });

    return () => {
      socket.current?.off("incoming-call");
      socket.current?.off("call-accepted");
      socket.current?.off("call-rejected");
      socket.current?.off("ice-candidate");
      socket.current?.off("call-ended");
    };
  }, [webrtc]);

  // Set socket in WebRTC hook
  useEffect(() => {
    webrtc.setSocket(socket.current);
  }, [socket.current, webrtc]);

  // Auto-select conversation from Feed
  useEffect(() => {
    const storedConversation = sessionStorage.getItem("selectedConversation");
    if (storedConversation && allUser) {
      const conversationData = JSON.parse(storedConversation);

      const existingConversation = allUser?.find(
        (user) => user.email === conversationData.email
      );

      if (existingConversation) {
        handleConversationSelect(existingConversation);
      } else {
        const newConversation = {
          _id: conversationData._id,
          fullName: conversationData.fullName,
          email: conversationData.email,
          profileImage: conversationData.profileImage,
          tags: conversationData.tags || [],
        };

        setAllUser((prev) => [...(prev || []), newConversation]);
        handleConversationSelect(newConversation);
      }

      sessionStorage.removeItem("selectedConversation");
    }
  }, [allUser, dispatch]);

  useEffect(() => {
    socket.current = connectWS();
    socket.current.on("connect", () => {
      if (user?.email) {
        socket.current.emit("joinRoom", user.email);
      }

      socket.current.on("privateMessage", (msg) => {
        if (
          (msg.senderEmail === user.email &&
            msg.receiverEmail === selectedConversation?.email) ||
          (msg.senderEmail === selectedConversation?.email &&
            msg.receiverEmail === user.email)
        ) {
          setMessages((prev) => [...prev, msg]);
        }
      });
      socket.current.on("chatMessage", (msg) => {
        setMessages((prev) => [...prev, msg]);
      });
    });

    return () => {
      socket.current?.off("privateMessage");
      socket.current?.off("chatMessage");
    };
  }, [dispatch, user, selectedConversation?.email]);

  useEffect(() => {
    dispatch(fetchConversations());

    if (!user?.email) return;
    const fetchUser = async () => {
      try {
        const res = await axiosIntense.get(
          `/messageUsers/connected-users?email=${user?.email}`
        );
        setAllUser(res.data.connectedUsers);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUser();
  }, [dispatch, user]);

  // Call Functions
  const startCall = async (type) => {
    if (!selectedConversation) return;

    try {
      webrtc.initializePeerConnection();
      await webrtc.startLocalStream(type);

      const offer = await webrtc.createOffer();

      setCallState({
        isCallActive: false,
        isIncomingCall: false,
        isOutgoingCall: true,
        callType: type,
        callerInfo: selectedConversation,
        isAudioMuted: false,
        isVideoOff: false,
      });

      // Send call offer to the other user
      socket.current.emit("start-call", {
        to: selectedConversation.email,
        from: {
          email: user.email,
          fullName: user.displayName || user.email,
          profileImage:
            user.photoURL || "https://i.postimg.cc/85JwcYck/boy.png",
        },
        callType: type,
        offer: offer,
      });
    } catch (error) {
      console.error("Error starting call:", error);
      alert(
        "Failed to start call. Please check your camera and microphone permissions."
      );
    }
  };

  const acceptCall = async () => {
    try {
      await webrtc.startLocalStream(callState.callType);
      const answer = await webrtc.createAnswer();

      socket.current.emit("accept-call", {
        to: callState.callerInfo.email,
        answer: answer,
      });

      setCallState((prev) => ({
        ...prev,
        isCallActive: true,
        isIncomingCall: false,
      }));
    } catch (error) {
      console.error("Error accepting call:", error);
      rejectCall();
    }
  };

  const rejectCall = () => {
    if (callState.isIncomingCall) {
      socket.current.emit("reject-call", {
        to: callState.callerInfo.email,
      });
    }

    webrtc.stopCall();
    setCallState({
      isCallActive: false,
      isIncomingCall: false,
      isOutgoingCall: false,
      callType: null,
      callerInfo: null,
      isAudioMuted: false,
      isVideoOff: false,
    });
  };

  const endCall = () => {
    socket.current.emit("end-call", {
      to: callState.callerInfo.email,
    });

    webrtc.stopCall();
    setCallState({
      isCallActive: false,
      isIncomingCall: false,
      isOutgoingCall: false,
      callType: null,
      callerInfo: null,
      isAudioMuted: false,
      isVideoOff: false,
    });
  };

  const toggleAudio = () => {
    if (webrtc.localStream) {
      const audioTracks = webrtc.localStream.getAudioTracks();
      audioTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setCallState((prev) => ({
        ...prev,
        isAudioMuted: !prev.isAudioMuted,
      }));
    }
  };

  const toggleVideo = () => {
    if (webrtc.localStream) {
      const videoTracks = webrtc.localStream.getVideoTracks();
      videoTracks.forEach((track) => {
        track.enabled = !track.enabled;
      });
      setCallState((prev) => ({
        ...prev,
        isVideoOff: !prev.isVideoOff,
      }));
    }
  };

  // Rest of your existing functions (handleSearchChange, handleConversationSelect, handleSendMessage, etc.)
  const handleSearchChange = (term) => {
    dispatch(setSearchTerm(term));
  };

  const handleConversationSelect = (conversation) => {
    dispatch(setSelectedConversation(conversation));
    dispatch(setMobileView("chat"));
    fetchMessages(conversation.email);

    if (conversation.unread > 0) {
      dispatch(markConversationAsRead(conversation.id));
    }
  };

  const handleSendMessage = async () => {
    const text = newMessage.trim();
    if (!text) return;

    dispatch({ type: "messages/setSendingMessage", payload: true });

    try {
      const msg = {
        fromEmail: user?.email,
        toEmail: selectedConversation?.email,
        message: text,
        timestamp: new Date(),
      };

      await axiosIntense.post("/messageUsers/messages", {
        fromEmail: msg.fromEmail,
        toEmail: msg.toEmail,
        message: text,
      });

      socket.current.emit("privateMessage", {
        senderEmail: user?.email,
        receiverEmail: selectedConversation?.email,
        text: text,
        timestamp: msg.timestamp,
      });

      setNewMessage("");
      // setMessages((m) => [...m, msg]);
      setErrorMessage("");
    } catch (err) {
      if (err.response?.status === 403) {
        const hateError =
          err.response.data.error || "Message blocked: Inappropriate content";
        setErrorMessage(hateError);

        setTimeout(() => setErrorMessage(""), 5000);
      } else {
        console.error("Send error:", err);
        setErrorMessage("Failed to send message. Try again.");
        setTimeout(() => setErrorMessage(""), 5000);
      }
    } finally {
      dispatch({ type: "messages/setSendingMessage", payload: false });
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleBackToList = () => {
    dispatch(setMobileView("list"));
  };

  const handleRetry = () => {
    dispatch(clearError());
    dispatch(fetchConversations());
  };

  // --- Animations ---
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  // --- UI Loading States ---
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <motion.div
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: { duration: 2, repeat: Infinity, ease: "linear" },
              scale: { duration: 1, repeat: Infinity },
            }}
            className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center"
          >
            <MessageCircle className="w-8 h-8 text-white" />
          </motion.div>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-gray-600"
          >
            Loading your messages...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <motion.div
          className="text-center bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="w-16 h-16 bg-red-100 rounded-full mx-auto mb-4 flex items-center justify-center">
            <MessageCircle className="w-8 h-8 text-red-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Messages Error
          </h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={handleRetry}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      <ReTitle
        title={`Messages${unreadCount > 0 ? ` (${unreadCount})` : ""}`}
      />

      {/* Call Modal */}
      {(callState.isIncomingCall ||
        callState.isOutgoingCall ||
        callState.isCallActive) && (
        <CallModal
          callType={callState.callType}
          isIncoming={callState.isIncomingCall}
          callerInfo={callState.callerInfo}
          onAccept={acceptCall}
          onReject={rejectCall}
          onEndCall={endCall}
          localVideoRef={webrtc.localVideoRef}
          remoteVideoRef={webrtc.remoteVideoRef}
          localStream={webrtc.localStream}
          remoteStream={webrtc.remoteStream}
          isCallActive={callState.isCallActive}
          onToggleAudio={toggleAudio}
          onToggleVideo={toggleVideo}
          isAudioMuted={callState.isAudioMuted}
          isVideoOff={callState.isVideoOff}
        />
      )}

      <div className="w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Messages{unreadCount > 0 && ` (${unreadCount})`}
              </h1>
              <p className="text-lg text-gray-600">
                Connect and collaborate with your network
              </p>
            </div>
            <motion.button
              className="bg-blue-600 text-white px-4 py-2.5 rounded-lg font-semibold hover:bg-blue-700 transition-all duration-200 flex items-center space-x-2 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <MessageCircle className="w-4 h-4" />
              <span className="hidden sm:inline">New Message</span>
            </motion.button>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="flex h-[600px]">
            {/* Conversations List */}
            <motion.div
              className={`w-full lg:w-96 border-r border-gray-200 flex flex-col ${
                mobileView === "chat" ? "hidden lg:flex" : "flex"
              }`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {/* Search */}
              <div className="p-4 border-b border-gray-200">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search messages..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
              </div>

              {/* Conversations */}
              <div className="flex-1 overflow-y-auto">
                <motion.div
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {(allUser || [])
                    ?.filter((user) =>
                      user.fullName
                        .toLowerCase()
                        .includes(searchTerm.toLowerCase())
                    )
                    .map((conversation) => (
                      <ConversationItem
                        key={conversation._id}
                        conversation={{
                          ...conversation,
                          lastMessage: lastMessages[conversation.email] || "",
                        }}
                        isSelected={
                          selectedConversation?._id === conversation._id
                        }
                        onClick={() => handleConversationSelect(conversation)}
                      />
                    ))}
                </motion.div>

                {allUser?.length === 0 && (
                  <motion.div
                    className="text-center py-12"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {searchTerm
                        ? "No conversations found"
                        : "No connections yet"}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {searchTerm
                        ? "Try adjusting your search"
                        : "Start connecting with people to begin chatting!"}
                    </p>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* Chat Area */}
            <motion.div
              className={`flex-1 flex flex-col ${
                mobileView === "list" ? "hidden lg:flex" : "flex"
              }`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              {selectedConversation ? (
                <>
                  {/* Chat Header */}
                  <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <button
                        onClick={handleBackToList}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                      >
                        <ArrowLeft className="w-5 h-5 text-gray-600" />
                      </button>
                      <div className="flex items-center space-x-3">
                        <div className="relative flex-shrink-0">
                          {selectedConversation.profileImage ? (
                            <img
                              src={selectedConversation.profileImage}
                              alt={selectedConversation.fullName}
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center text-white font-semibold text-lg border-2 border-white shadow-sm">
                              {selectedConversation.fullName
                                ? selectedConversation.fullName
                                    .charAt(0)
                                    .toUpperCase()
                                : "?"}
                            </div>
                          )}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {selectedConversation.fullName}
                          </h3>
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {selectedConversation.tags?.join(" | ") ||
                              "Active now"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {/* Video Call Button */}
                      <motion.button
                        onClick={() => startCall("video")}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        title="Video Call"
                      >
                        <Video className="w-5 h-5" />
                      </motion.button>

                      {/* Audio Call Button */}
                      <motion.button
                        onClick={() => startCall("audio")}
                        className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        title="Audio Call"
                      >
                        <Phone className="w-5 h-5" />
                      </motion.button>

                      <motion.button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                      >
                        <Info className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                    <motion.div
                      variants={containerVariants}
                      initial="hidden"
                      animate="visible"
                      className="space-y-1"
                    >
                      {messages?.map((message, index) => (
                        <MessageBubble key={index} message={message} />
                      ))}
                    </motion.div>

                    {messages.length === 0 && (
                      <div className="flex flex-col items-center justify-center h-full text-gray-500">
                        <MessageCircle className="w-16 h-16 mb-4 text-gray-300" />
                        <p className="text-lg font-medium mb-2">
                          No messages yet
                        </p>
                        <p className="text-sm">
                          Start a conversation with{" "}
                          {selectedConversation.fullName}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Message Input */}
                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-center space-x-2">
                      <motion.button
                        className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all duration-200"
                        whileHover={{ scale: 1.1 }}
                        disabled={sendingMessage}
                      >
                        <Paperclip className="w-5 h-5" />
                      </motion.button>
                      <div className="flex-1 relative">
                        <textarea
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          placeholder="Type a message..."
                          rows="1"
                          className="w-full px-4 py-3 pr-12 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                          disabled={sendingMessage}
                        />
                        <motion.button
                          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-blue-600 transition-colors duration-200"
                          whileHover={{ scale: 1.1 }}
                          disabled={sendingMessage}
                        >
                          <Smile className="w-5 h-5" />
                        </motion.button>
                      </div>
                      <motion.button
                        onClick={handleSendMessage}
                        disabled={!newMessage.trim() || sendingMessage}
                        className={`p-3 rounded-lg transition-all duration-200 ${
                          newMessage.trim() && !sendingMessage
                            ? "bg-blue-600 text-white hover:bg-blue-700"
                            : "bg-gray-100 text-gray-400 cursor-not-allowed"
                        }`}
                        whileHover={
                          newMessage.trim() && !sendingMessage
                            ? { scale: 1.05 }
                            : {}
                        }
                        whileTap={
                          newMessage.trim() && !sendingMessage
                            ? { scale: 0.95 }
                            : {}
                        }
                      >
                        {sendingMessage ? (
                          <motion.div
                            animate={{ rotate: 360 }}
                            transition={{
                              duration: 1,
                              repeat: Infinity,
                              ease: "linear",
                            }}
                            className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                          />
                        ) : (
                          <Send className="w-5 h-5" />
                        )}
                      </motion.button>
                    </div>

                    {errorMessage && (
                      <motion.p
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="mt-2 text-sm text-red-600 px-2 animate-pulse"
                      >
                        {errorMessage}
                      </motion.p>
                    )}
                  </div>
                </>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                  >
                    <MessageCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      Select a conversation
                    </h3>
                    <p className="text-gray-600">
                      Choose a conversation from the list to start messaging
                    </p>
                  </motion.div>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MessagesPage;
