import React, { useState, useRef, useEffect } from 'react';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';

const VideoInterview = () => {
  // State management
  const [sessionId, setSessionId] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [interviewStatus, setInterviewStatus] = useState('not-started');
  const [currentQuestion, setCurrentQuestion] = useState('');
  const [conversation, setConversation] = useState([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [finalFeedback, setFinalFeedback] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false
  });
  const [errors, setErrors] = useState({
    camera: '',
    microphone: '',
    general: ''
  });

  // Refs
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const speechSynthesisRef = useRef(null);
  const silenceTimerRef = useRef(null);

  // Interview configuration
  const [interviewConfig, setInterviewConfig] = useState({
    interviewType: 'technical',
    position: 'Software Engineer'
  });

  // Initialize on component mount
  useEffect(() => {
    // Check browser compatibility
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setErrors(prev => ({
        ...prev,
        general: 'Your browser does not support video recording. Please use Chrome, Firefox, or Edge.'
      }));
      return;
    }

    checkPermissions();
    initializeVideo();
    
    return () => {
      cleanupResources();
    };
  }, []);

  // Check camera and microphone permissions
  const checkPermissions = async () => {
    try {
      if (navigator.permissions && navigator.permissions.query) {
        const cameraPermission = await navigator.permissions.query({ name: 'camera' });
        const microphonePermission = await navigator.permissions.query({ name: 'microphone' });
        
        setPermissions({
          camera: cameraPermission.state === 'granted',
          microphone: microphonePermission.state === 'granted'
        });

        cameraPermission.onchange = () => {
          setPermissions(prev => ({ ...prev, camera: cameraPermission.state === 'granted' }));
        };

        microphonePermission.onchange = () => {
          setPermissions(prev => ({ ...prev, microphone: microphonePermission.state === 'granted' }));
        };
      }
    } catch (error) {
      console.warn('Permission API not supported:', error);
    }
  };

  // Initialize video stream with error handling
  const initializeVideo = async () => {
    try {
      setErrors(prev => ({ ...prev, camera: '', microphone: '', general: '' }));
      
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints = {
        video: { 
          width: { ideal: 1280 },
          height: { ideal: 720 },
          frameRate: { ideal: 30 }
        }, 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        }
      };

      console.log('Requesting media with constraints:', constraints);

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      
      // Check if we actually got tracks
      const videoTracks = stream.getVideoTracks();
      const audioTracks = stream.getAudioTracks();
      
      console.log('Media stream obtained:', {
        videoTracks: videoTracks.length,
        audioTracks: audioTracks.length,
        videoReady: videoTracks[0]?.readyState,
        audioReady: audioTracks[0]?.readyState
      });

      streamRef.current = stream;
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      // Update permissions state
      setPermissions({
        camera: videoTracks.length > 0 && videoTracks[0].readyState === 'live',
        microphone: audioTracks.length > 0 && audioTracks[0].readyState === 'live'
      });

    } catch (error) {
      console.error('Error accessing media devices:', error);
      handleMediaError(error);
    }
  };

  // Handle media errors
  const handleMediaError = (error) => {
    let errorMessage = '';
    
    switch (error.name) {
      case 'NotAllowedError':
        errorMessage = 'Camera/microphone access denied. Please allow permissions and refresh.';
        break;
      case 'NotFoundError':
        errorMessage = 'No camera/microphone found. Please check your device.';
        break;
      case 'NotSupportedError':
        errorMessage = 'Your browser does not support video recording.';
        break;
      case 'NotReadableError':
        errorMessage = 'Camera/microphone is in use by another application.';
        break;
      default:
        errorMessage = 'Cannot access camera/microphone. Please check permissions.';
    }

    if (error.name === 'NotAllowedError') {
      setErrors(prev => ({
        ...prev,
        camera: 'Camera access denied',
        microphone: 'Microphone access denied'
      }));
    } else if (error.name.includes('Video')) {
      setErrors(prev => ({ ...prev, camera: errorMessage }));
    } else {
      setErrors(prev => ({ ...prev, microphone: errorMessage }));
    }

    setErrors(prev => ({ ...prev, general: errorMessage }));
  };

  // Text-to-speech function
  const speakText = (text) => {
    if (!text || !window.speechSynthesis) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    return new Promise((resolve) => {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1;
      utterance.volume = 1;
      
      utterance.onstart = () => {
        setIsSpeaking(true);
        speechSynthesisRef.current = utterance;
      };
      
      utterance.onend = () => {
        setIsSpeaking(false);
        resolve();
      };
      
      utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event);
        setIsSpeaking(false);
        resolve();
      };

      window.speechSynthesis.speak(utterance);
    });
  };

  // Start interview session
  const startInterview = async () => {
    // Check permissions before starting
    if (!permissions.camera || !permissions.microphone) {
      setErrors(prev => ({
        ...prev,
        general: 'Please enable camera and microphone permissions to start the interview.'
      }));
      return;
    }

    setErrors(prev => ({ ...prev, general: '' }));
    setIsProcessing(true);

    try {
      const response = await axiosIntense.post('/live-interview/start-session', {
        userId: `user_${Date.now()}`,
        ...interviewConfig
      });

      if (response.data.success) {
        setSessionId(response.data.sessionId);
        setInterviewStatus('active');
        setCurrentQuestion(response.data.welcomeMessage);
        setConversation([{
          role: 'assistant',
          content: response.data.welcomeMessage,
          timestamp: new Date(),
          type: 'question'
        }]);

        // Speak the welcome message
        await speakText(response.data.welcomeMessage);
      }
    } catch (error) {
      console.error('Error starting interview:', error);
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.error || 'Failed to start interview. Please try again.'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Start recording audio
  const startRecording = () => {
    if (!streamRef.current) {
      setErrors(prev => ({ ...prev, general: 'No media stream available' }));
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }

    try {
      audioChunksRef.current = [];
      
      // Supported MIME types এর লিস্ট
      const mimeTypes = [
        'audio/webm;codecs=opus',
        'audio/webm',
        'audio/mp4',
        'audio/ogg;codecs=opus',
        'audio/wav'
      ];

      let selectedMimeType = '';
      
      // প্রথম supported MIME type select করুন
      for (const mimeType of mimeTypes) {
        if (MediaRecorder.isTypeSupported(mimeType)) {
          selectedMimeType = mimeType;
          break;
        }
      }

      // যদি কোন supported MIME type না থাকে, default options ব্যবহার করুন
      const options = selectedMimeType ? { mimeType: selectedMimeType } : {};

      console.log('Using MIME type:', selectedMimeType || 'default');

      mediaRecorderRef.current = new MediaRecorder(streamRef.current, options);

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          audioChunksRef.current.push(event.data);
        }
      };

      mediaRecorderRef.current.onstop = processAudioResponse;
      
      mediaRecorderRef.current.onerror = (event) => {
        console.error('MediaRecorder error:', event);
        setErrors(prev => ({ 
          ...prev, 
          general: `Recording failed: ${event.error?.message || 'Unknown error'}` 
        }));
        setIsRecording(false);
      };

      // Start recording with timeslice
      mediaRecorderRef.current.start(1000);
      setIsRecording(true);
      
      console.log('Recording started successfully');

      // Auto-stop after 2 minutes
      silenceTimerRef.current = setTimeout(() => {
        if (isRecording) {
          stopRecording();
        }
      }, 120000);

    } catch (error) {
      console.error('Error starting recording:', error);
      
      let errorMessage = 'Failed to start recording';
      if (error.name === 'NotSupportedError') {
        errorMessage = 'Your browser does not support audio recording. Please try Chrome, Firefox, or Edge.';
      } else if (error.name === 'InvalidStateError') {
        errorMessage = 'Media stream is not ready. Please refresh and try again.';
      }
      
      setErrors(prev => ({ 
        ...prev, 
        general: errorMessage 
      }));
      setIsRecording(false);
    }
  };

  // Stop recording
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      
      if (silenceTimerRef.current) {
        clearTimeout(silenceTimerRef.current);
      }
    }
  };

  // Process recorded audio
  const processAudioResponse = async () => {
    if (audioChunksRef.current.length === 0) {
      setIsProcessing(false);
      return;
    }

    setIsProcessing(true);
    setErrors(prev => ({ ...prev, general: '' }));

    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
      const audioUrl = URL.createObjectURL(audioBlob);
      const duration = Math.round(audioBlob.size / 16000); // Approximate duration

      // For now, we'll use a simulated transcription
      const simulatedResponse = await simulateSpeechToText(audioBlob);
      
      await sendTextResponse(simulatedResponse, duration, audioUrl);
      
    } catch (error) {
      console.error('Error processing audio:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Failed to process audio. Please try again.'
      }));
    } finally {
      setIsProcessing(false);
    }
  };

  // Simulate speech-to-text (replace with real API)
  const simulateSpeechToText = async (audioBlob) => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    return "This is a simulated transcription of your audio response. In a real implementation, this would be the actual text from speech-to-text service.";
  };

  // Send text response to backend
  const sendTextResponse = async (userResponse, audioDuration, audioUrl) => {
    try {
      const response = await axiosIntense.post('/live-interview/process-response', {
        sessionId,
        userResponse,
        audioDuration,
        userAudioUrl: audioUrl
      });

      if (response.data.success) {
        // Add user response to conversation
        setConversation(prev => [
          ...prev,
          { 
            role: 'user', 
            content: userResponse, 
            timestamp: new Date(),
            type: 'answer',
            audioUrl 
          },
          { 
            role: 'assistant', 
            content: response.data.aiResponse, 
            timestamp: new Date(),
            type: 'question'
          }
        ]);
        
        setCurrentQuestion(response.data.aiResponse);

        // Speak the AI response
        await speakText(response.data.aiResponse);

        if (response.data.shouldEnd) {
          await endInterview();
        }
      }
    } catch (error) {
      console.error('Error sending response:', error);
      setErrors(prev => ({
        ...prev,
        general: error.response?.data?.error || 'Failed to process response. Please try again.'
      }));
    }
  };

  // Manual text response (for testing/fallback)
  const manuallySendResponse = async () => {
    const response = prompt('Enter your response (for testing):');
    if (response) {
      setIsProcessing(true);
      await sendTextResponse(response, 0);
      setIsProcessing(false);
    }
  };

  // End interview
  const endInterview = async () => {
    try {
      const response = await axiosIntense.post('/live-interview/end-session', {
        sessionId,
        feedback: true
      });

      if (response.data.success) {
        setInterviewStatus('completed');
        setFinalFeedback(response.data.finalFeedback);
        
        // Stop any ongoing speech
        if (isSpeaking) {
          window.speechSynthesis.cancel();
        }
        
        cleanupResources();
      }
    } catch (error) {
      console.error('Error ending interview:', error);
      setErrors(prev => ({
        ...prev,
        general: 'Failed to end interview properly. Please try again.'
      }));
    }
  };

  // Force end interview
  const forceEndInterview = async () => {
    if (window.confirm('Are you sure you want to end the interview? Your progress will be saved.')) {
      await endInterview();
    }
  };

  // Cleanup resources
  const cleanupResources = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
    }
    
    if (silenceTimerRef.current) {
      clearTimeout(silenceTimerRef.current);
    }
    
    if (isSpeaking) {
      window.speechSynthesis.cancel();
    }
    
    audioChunksRef.current = [];
  };

  // Retry media permissions
  const retryMediaPermissions = async () => {
    setErrors(prev => ({ ...prev, camera: '', microphone: '', general: '' }));
    await initializeVideo();
  };

  // Format time
  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit',
      second: '2-digit'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            AI Video Interview
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Practice your interview skills with our AI-powered interview simulator. 
            Get real-time questions and feedback.
          </p>
        </div>

        {/* Error Display */}
        {errors.general && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-red-800">
                  {errors.general}
                </h3>
                {(errors.camera || errors.microphone) && (
                  <div className="mt-2 text-sm text-red-700">
                    <button
                      onClick={retryMediaPermissions}
                      className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                    >
                      Retry Permissions
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Permission Warnings */}
        {interviewStatus === 'not-started' && (!permissions.camera || !permissions.microphone) && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-yellow-800">
                  Required Permissions
                </h3>
                <div className="mt-2 text-sm text-yellow-700">
                  <ul className="list-disc list-inside space-y-1">
                    {!permissions.camera && <li>Camera access is required for video recording</li>}
                    {!permissions.microphone && <li>Microphone access is required for audio recording</li>}
                  </ul>
                  <button
                    onClick={retryMediaPermissions}
                    className="mt-2 bg-yellow-100 hover:bg-yellow-200 text-yellow-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                  >
                    Grant Permissions
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Interview Configuration */}
        {interviewStatus === 'not-started' && (
          <div className="bg-white rounded-2xl shadow-xl p-8 mb-8">
            <div className="max-w-2xl mx-auto">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                Interview Setup
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Interview Type
                  </label>
                  <select 
                    value={interviewConfig.interviewType}
                    onChange={(e) => setInterviewConfig(prev => ({
                      ...prev,
                      interviewType: e.target.value
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  >
                    <option value="technical">Technical Interview</option>
                    <option value="behavioral">Behavioral Interview</option>
                    <option value="mixed">Mixed Interview</option>
                    <option value="hr">HR Interview</option>
                    <option value="system-design">System Design</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-3">
                    Position
                  </label>
                  <input
                    type="text"
                    value={interviewConfig.position}
                    onChange={(e) => setInterviewConfig(prev => ({
                      ...prev,
                      position: e.target.value
                    }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="e.g., Frontend Developer, Data Scientist..."
                  />
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-2">What to expect:</h3>
                <ul className="text-blue-800 text-sm space-y-1">
                  <li>• 5-6 realistic interview questions</li>
                  <li>• AI voice will read questions aloud</li>
                  <li>• Record and transcribe your answers</li>
                  <li>• Get detailed feedback at the end</li>
                  <li>• Session duration: 15-20 minutes</li>
                </ul>
              </div>

              <button
                onClick={startInterview}
                disabled={isProcessing || (!permissions.camera && !permissions.microphone)}
                className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold py-4 px-6 rounded-lg transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg"
              >
                {isProcessing ? (
                  <div className="flex items-center justify-center">
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                    Starting Interview...
                  </div>
                ) : (
                  'Start Live Interview'
                )}
              </button>
            </div>
          </div>
        )}

        {/* Main Interview Interface */}
        {interviewStatus === 'active' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            
            {/* Video Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">Your Video</h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${permissions.camera ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Camera {permissions.camera ? 'On' : 'Off'}
                  </div>
                  <div className="flex items-center">
                    <div className={`w-2 h-2 rounded-full mr-2 ${permissions.microphone ? 'bg-green-500' : 'bg-red-500'}`}></div>
                    Microphone {permissions.microphone ? 'On' : 'Off'}
                  </div>
                </div>
              </div>

              {/* Video Feed */}
              <div className="relative bg-black rounded-xl overflow-hidden mb-6">
                <video
                  ref={videoRef}
                  autoPlay
                  muted
                  playsInline
                  className="w-full h-80 object-cover"
                />
                
                {/* Recording Indicator */}
                {isRecording && (
                  <div className="absolute top-4 left-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                      Recording...
                    </span>
                  </div>
                )}

                {/* AI Speaking Indicator */}
                {isSpeaking && (
                  <div className="absolute top-4 right-4 flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-white text-sm font-medium bg-black bg-opacity-50 px-2 py-1 rounded">
                      AI Speaking
                    </span>
                  </div>
                )}
              </div>

              {/* Recording Controls */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                {!isRecording ? (
                  <button
                    onClick={startRecording}
                    disabled={isProcessing || isSpeaking || !permissions.microphone}
                    className="flex items-center justify-center bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:cursor-not-allowed flex-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clipRule="evenodd" />
                    </svg>
                    Start Answering
                  </button>
                ) : (
                  <button
                    onClick={stopRecording}
                    className="flex items-center justify-center bg-gray-600 hover:bg-gray-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors flex-1"
                  >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                    Stop Recording
                  </button>
                )}
                
                <button
                  onClick={manuallySendResponse}
                  disabled={isProcessing || isRecording}
                  className="flex items-center justify-center bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-semibold py-3 px-8 rounded-lg transition-colors disabled:cursor-not-allowed flex-1"
                >
                  <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                  </svg>
                  Text Response
                </button>
              </div>

              {/* Processing Indicator */}
              {isProcessing && (
                <div className="mt-6 text-center">
                  <div className="inline-flex items-center justify-center px-4 py-2 bg-blue-100 text-blue-700 rounded-full">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                    Processing your response...
                  </div>
                </div>
              )}

              {/* End Interview Button */}
              <div className="mt-6 text-center">
                <button
                  onClick={forceEndInterview}
                  className="text-red-600 hover:text-red-700 font-medium text-sm"
                >
                  End Interview Early
                </button>
              </div>
            </div>

            {/* Conversation Section */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h2 className="text-xl font-bold text-gray-900 mb-6">Interview Conversation</h2>
              
              {/* Current Question */}
              <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-blue-900 mb-1">Current Question</h3>
                    <p className="text-gray-800 leading-relaxed">{currentQuestion}</p>
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                      </svg>
                      Listen carefully and respond
                    </div>
                  </div>
                </div>
              </div>

              {/* Conversation History */}
              <div className="h-96 overflow-y-auto space-y-4 pr-2">
                {conversation.map((message, index) => (
                  <div
                    key={index}
                    className={`flex space-x-3 ${
                      message.role === 'assistant' ? '' : 'flex-row-reverse space-x-reverse'
                    }`}
                  >
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'assistant' 
                        ? 'bg-blue-600' 
                        : 'bg-green-600'
                    }`}>
                      {message.role === 'assistant' ? (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    
                    <div className={`flex-1 max-w-[80%] ${
                      message.role === 'assistant' 
                        ? '' 
                        : 'text-right'
                    }`}>
                      <div className={`inline-block px-4 py-3 rounded-2xl ${
                        message.role === 'assistant' 
                          ? 'bg-gray-100 text-gray-800 rounded-tl-none' 
                          : 'bg-blue-600 text-white rounded-tr-none'
                      }`}>
                        <div className="text-sm leading-relaxed">{message.content}</div>
                        <div className={`text-xs mt-1 ${
                          message.role === 'assistant' ? 'text-gray-500' : 'text-blue-200'
                        }`}>
                          {formatTime(message.timestamp)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
                
                {conversation.length === 0 && (
                  <div className="text-center text-gray-500 py-8">
                    <svg className="w-12 h-12 mx-auto mb-3 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                    <p>Conversation will appear here</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Results Section */}
        {interviewStatus === 'completed' && (
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8 text-green-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-3xl font-bold text-green-600 mb-2">
                Interview Completed!
              </h2>
              <p className="text-gray-600">
                Thank you for completing the interview. Here's your feedback and conversation history.
              </p>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Conversation History */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Conversation History</h3>
                <div className="h-96 overflow-y-auto space-y-4 pr-2">
                  {conversation.map((message, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg ${
                        message.role === 'assistant' 
                          ? 'bg-gray-50 border border-gray-200' 
                          : 'bg-blue-50 border border-blue-200'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`text-sm font-medium ${
                          message.role === 'assistant' ? 'text-gray-700' : 'text-blue-700'
                        }`}>
                          {message.role === 'assistant' ? 'Interviewer' : 'You'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatTime(message.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-800 text-sm leading-relaxed">
                        {message.content}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* AI Feedback */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">AI Feedback</h3>
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 h-96 overflow-y-auto">
                  {finalFeedback ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="whitespace-pre-wrap text-gray-800 leading-relaxed">
                        {finalFeedback}
                      </div>
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-12">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-600 mx-auto mb-3"></div>
                      <p>Generating feedback...</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="text-center mt-8 pt-6 border-t border-gray-200">
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg transition-colors inline-flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Start New Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoInterview;