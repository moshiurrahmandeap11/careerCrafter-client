// components/messages-components/CallModal.jsx
import React from 'react';
import { motion } from 'framer-motion';
import { X, Mic, MicOff, Video, VideoOff, PhoneOff } from 'lucide-react';

export const CallModal = ({ 
  callType, 
  isIncoming, 
  callerInfo, 
  onAccept, 
  onReject, 
  onEndCall,
  localVideoRef,
  remoteVideoRef,
  localStream,
  remoteStream,
  isCallActive,
  onToggleAudio,
  onToggleVideo,
  isAudioMuted = false,
  isVideoOff = false
}) => {
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-90 z-50 flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Incoming Call Ringing */}
      {!isCallActive && isIncoming && (
        <motion.div
          className="bg-white rounded-2xl p-8 text-center max-w-md w-full mx-4"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full mx-auto mb-4 flex items-center justify-center">
            <img
              src={callerInfo.profileImage}
              alt={callerInfo.fullName}
              className="w-16 h-16 rounded-full object-cover border-2 border-white"
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Incoming {callType === 'video' ? 'Video' : 'Audio'} Call
          </h2>
          <p className="text-gray-600 mb-2">{callerInfo.fullName}</p>
          <p className="text-sm text-gray-500 mb-6">is calling you...</p>
          
          <div className="flex justify-center space-x-4">
            <motion.button
              onClick={onReject}
              className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <PhoneOff className="w-6 h-6" />
            </motion.button>
            <motion.button
              onClick={onAccept}
              className="w-14 h-14 bg-green-500 rounded-full flex items-center justify-center text-white hover:bg-green-600 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Video className="w-6 h-6" />
            </motion.button>
          </div>
        </motion.div>
      )}

      {/* Active Call */}
      {isCallActive && (
        <div className="w-full h-full relative">
          {/* Remote Video */}
          <video
            ref={remoteVideoRef}
            autoPlay
            playsInline
            className="w-full h-full object-cover"
          />
          
          {/* Local Video (Picture-in-Picture) */}
          {callType === 'video' && localStream && (
            <motion.div
              className="absolute top-4 right-4 w-48 h-32 bg-gray-900 rounded-lg overflow-hidden border-2 border-white shadow-lg"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
            >
              <video
                ref={localVideoRef}
                autoPlay
                playsInline
                muted
                className="w-full h-full object-cover"
              />
            </motion.div>
          )}

          {/* Call Controls */}
          <motion.div
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-4"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
          >
            {/* Toggle Audio */}
            <motion.button
              onClick={onToggleAudio}
              className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                isAudioMuted ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
              } text-white`}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              {isAudioMuted ? <MicOff className="w-6 h-6" /> : <Mic className="w-6 h-6" />}
            </motion.button>

            {/* End Call */}
            <motion.button
              onClick={onEndCall}
              className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <PhoneOff className="w-6 h-6" />
            </motion.button>

            {/* Toggle Video */}
            {callType === 'video' && (
              <motion.button
                onClick={onToggleVideo}
                className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-200 ${
                  isVideoOff ? 'bg-red-500' : 'bg-gray-700 hover:bg-gray-600'
                } text-white`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                {isVideoOff ? <VideoOff className="w-6 h-6" /> : <Video className="w-6 h-6" />}
              </motion.button>
            )}
          </motion.div>

          {/* Caller Info */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 text-white px-4 py-2 rounded-lg">
            <p className="font-semibold">{callerInfo.fullName}</p>
            <p className="text-sm text-gray-300">
              {callType === 'video' ? 'Video Call' : 'Audio Call'} • 00:00
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );
};