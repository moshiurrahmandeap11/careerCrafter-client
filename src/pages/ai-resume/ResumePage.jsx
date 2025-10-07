import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    Sparkles,
    Edit3,
    BarChart3,

} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { CreateResumeSection } from '../../components/ResumeComponents/CreateResumeSection';
import { AnalyzeResumeSection } from '../../components/ResumeComponents/AnalyzeResumeSection';

// Import actions
import {
    setUploadedFile,
    setAtsScore,
    setSuggestions,
    setAnalyzing,
    setShowPreview
} from '../../redux-slices/resumeSlice';

// Import selectors
import {
    selectUploadedFile,
    selectAtsScore,
    selectSuggestions,
    selectAnalyzing,
    selectShowPreview,
    selectResumeData
} from '../../redux-selectors/resumeSelectors';

const ResumePage = () => {
    const dispatch = useDispatch();
    const [activeTab, setActiveTab] = React.useState('create');
    const fileInputRef = useRef(null);
    const resumePreviewRef = useRef(null);

    // Select data from Redux store
    const uploadedFile = useSelector(selectUploadedFile);
    const atsScore = useSelector(selectAtsScore);
    const suggestions = useSelector(selectSuggestions);
    const analyzing = useSelector(selectAnalyzing);
    const showPreview = useSelector(selectShowPreview);
    const resumeData = useSelector(selectResumeData);

    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            dispatch(setUploadedFile(file));
            analyzeResume(file);
        }
    };

    const analyzeResume = (file) => {
        dispatch(setAnalyzing(true));
        setTimeout(() => {
            const mockScore = Math.floor(Math.random() * 30) + 70;
            dispatch(setAtsScore(mockScore));
            dispatch(setSuggestions([
                {
                    type: 'critical',
                    title: 'Missing Keywords',
                    description: 'Add industry-specific keywords like "React", "Node.js", "AWS" to improve ATS matching.',
                    impact: 'high'
                },
                {
                    type: 'warning',
                    title: 'Improve Formatting',
                    description: 'Use standard section headers: "Work Experience" instead of "Professional Journey".',
                    impact: 'medium'
                },
                {
                    type: 'success',
                    title: 'Good Structure',
                    description: 'Your resume follows a clear, ATS-friendly structure.',
                    impact: 'positive'
                },
                {
                    type: 'warning',
                    title: 'Quantify Achievements',
                    description: 'Add numbers and metrics to demonstrate impact (e.g., "Increased sales by 25%").',
                    impact: 'medium'
                }
            ]));
            dispatch(setAnalyzing(false));
        }, 2000);
    };

    const downloadResumePDF = () => {
        const element = resumePreviewRef.current;
        const opt = {
            margin: 10,
            filename: `${resumeData.personalInfo.fullName || 'resume'}.pdf`,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2 },
            jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
        };

        html2pdf().set(opt).from(element).save();
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600';
        if (score >= 60) return 'text-yellow-600';
        return 'text-red-600';
    };

    const getScoreBgColor = (score) => {
        if (score >= 80) return 'from-green-500 to-emerald-600';
        if (score >= 60) return 'from-yellow-500 to-orange-600';
        return 'from-red-500 to-pink-600';
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                >
                    <motion.div
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-semibold mb-6"
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                    >
                        <Sparkles className="w-4 h-4" />
                        <span>AI-POWERED RESUME TOOLS</span>
                    </motion.div>

                    <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                        Build Your <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Perfect Resume</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Create ATS-friendly resumes or optimize your existing one with AI-powered suggestions and scoring.
                    </p>
                </motion.div>

                {/* Tab Navigation */}
                <motion.div
                    className="flex justify-center mb-8"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                >
                    <div className="bg-white p-1 rounded-xl border border-gray-200 shadow-sm inline-flex">
                        <button
                            onClick={() => setActiveTab('create')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${activeTab === 'create'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <Edit3 className="w-4 h-4" />
                            <span>Create Resume</span>
                        </button>
                        <button
                            onClick={() => setActiveTab('analyze')}
                            className={`px-6 py-3 rounded-lg font-semibold transition-all duration-200 flex items-center space-x-2 ${activeTab === 'analyze'
                                ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md'
                                : 'text-gray-600 hover:text-gray-900'
                                }`}
                        >
                            <BarChart3 className="w-4 h-4" />
                            <span>Analyze Resume</span>
                        </button>
                    </div>
                </motion.div>

                {/* Content */}
                <AnimatePresence mode="wait">
                    {activeTab === 'create' ? (
                        <motion.div
                            key="create"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: 20 }}
                        >
                            <CreateResumeSection
                                showPreview={showPreview}
                                setShowPreview={(value) => dispatch(setShowPreview(value))}
                                resumeData={resumeData}
                                downloadResumePDF={downloadResumePDF}
                                resumePreviewRef={resumePreviewRef}
                            />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="analyze"
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                        >
                            <AnalyzeResumeSection
                                uploadedFile={uploadedFile}
                                fileInputRef={fileInputRef}
                                handleFileUpload={handleFileUpload}
                                analyzing={analyzing}
                                atsScore={atsScore}
                                suggestions={suggestions}
                                getScoreColor={getScoreColor}
                                getScoreBgColor={getScoreBgColor}
                                onResetAnalysis={() => {
                                    dispatch(setUploadedFile(null));
                                    dispatch(setAtsScore(null));
                                }}
                            />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default ResumePage;