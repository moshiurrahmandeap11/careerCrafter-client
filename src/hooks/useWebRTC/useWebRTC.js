// hooks/useWebRTC.js
import { useState, useRef, useEffect } from 'react';

export const useWebRTC = () => {
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);
  const [isCallActive, setIsCallActive] = useState(false);
  const [callType, setCallType] = useState(null); // 'video' or 'audio'
  
  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);
  const peerConnection = useRef(null);
  const socket = useRef(null);

  // ICE Servers configuration
  const iceServers = {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  };

  const initializePeerConnection = () => {
    peerConnection.current = new RTCPeerConnection(iceServers);

    // Handle remote stream
    peerConnection.current.ontrack = (event) => {
      setRemoteStream(event.streams[0]);
      if (remoteVideoRef.current) {
        remoteVideoRef.current.srcObject = event.streams[0];
      }
    };

    // Handle ICE candidates
    peerConnection.current.onicecandidate = (event) => {
      if (event.candidate && socket.current) {
        socket.current.emit('ice-candidate', {
          candidate: event.candidate,
          target: remoteUserEmail
        });
      }
    };
  };

  const startLocalStream = async (type = 'video') => {
    try {
      const constraints = {
        video: type === 'video' ? true : false,
        audio: true
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      setLocalStream(stream);
      
      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      // Add tracks to peer connection
      stream.getTracks().forEach(track => {
        peerConnection.current.addTrack(track, stream);
      });

      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  const createOffer = async () => {
    try {
      const offer = await peerConnection.current.createOffer();
      await peerConnection.current.setLocalDescription(offer);
      return offer;
    } catch (error) {
      console.error('Error creating offer:', error);
      throw error;
    }
  };

  const createAnswer = async () => {
    try {
      const answer = await peerConnection.current.createAnswer();
      await peerConnection.current.setLocalDescription(answer);
      return answer;
    } catch (error) {
      console.error('Error creating answer:', error);
      throw error;
    }
  };

  const handleAnswer = async (answer) => {
    try {
      await peerConnection.current.setRemoteDescription(answer);
    } catch (error) {
      console.error('Error setting remote description:', error);
      throw error;
    }
  };

  const handleOffer = async (offer) => {
    try {
      await peerConnection.current.setRemoteDescription(offer);
      const answer = await createAnswer();
      return answer;
    } catch (error) {
      console.error('Error handling offer:', error);
      throw error;
    }
  };

  const handleIceCandidate = async (candidate) => {
    try {
      await peerConnection.current.addIceCandidate(candidate);
    } catch (error) {
      console.error('Error adding ICE candidate:', error);
    }
  };

  const stopCall = () => {
    if (localStream) {
      localStream.getTracks().forEach(track => track.stop());
      setLocalStream(null);
    }
    if (remoteStream) {
      setRemoteStream(null);
    }
    if (peerConnection.current) {
      peerConnection.current.close();
      peerConnection.current = null;
    }
    setIsCallActive(false);
    setCallType(null);
  };

  useEffect(() => {
    return () => {
      stopCall();
    };
  }, []);

  return {
    localStream,
    remoteStream,
    isCallActive,
    callType,
    localVideoRef,
    remoteVideoRef,
    initializePeerConnection,
    startLocalStream,
    createOffer,
    createAnswer,
    handleOffer,
    handleAnswer,
    handleIceCandidate,
    stopCall,
    setIsCallActive,
    setCallType,
    setSocket: (sock) => { socket.current = sock; }
  };
};