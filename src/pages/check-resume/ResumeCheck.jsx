import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Sparkles, AlertCircle, CheckCircle, X, Download, RefreshCw, Target, BarChart3, Lightbulb, Search } from 'lucide-react';

// Redux actions and selectors
import {
    setUploadedFile,
    setJobDescription,
    clearAnalysis,
    analyzeResume,
    hideToast
} from '../../redux-slices/resumeCheckSlice';

import {
    selectUploadedFile,
    selectAnalysis,
    selectIsAnalyzing,
    selectAnalysisError,
    selectJobDescription,
    selectToast,
    selectAtsScore,
    selectOverallScore,
    selectCategoryScores,
    selectStrengths,
    selectImprovements,
    selectKeywordAnalysis,
    selectAiSuggestions,
    selectHasAnalysis,
    selectCanAnalyze
} from '../../redux-selectors/resumeCheckSelectors';
import { ReTitle } from 're-title';

const ResumeCheck = () => {
    const dispatch = useDispatch();
    const [localFile, setLocalFile] = useState(null);

    // Select data from Redux store
    const uploadedFile = useSelector(selectUploadedFile);
    const analysis = useSelector(selectAnalysis);
    const isAnalyzing = useSelector(selectIsAnalyzing);
    const analysisError = useSelector(selectAnalysisError);
    const jobDescription = useSelector(selectJobDescription);
    const toast = useSelector(selectToast);
    const hasAnalysis = useSelector(selectHasAnalysis);
    const canAnalyze = useSelector(selectCanAnalyze);

    // Scores
    const atsScore = useSelector(selectAtsScore);
    const overallScore = useSelector(selectOverallScore);
    const categoryScores = useSelector(selectCategoryScores);
    const strengths = useSelector(selectStrengths);
    const improvements = useSelector(selectImprovements);
    const keywordAnalysis = useSelector(selectKeywordAnalysis);
    const aiSuggestions = useSelector(selectAiSuggestions);

    // Auto-hide toast
    useEffect(() => {
        if (toast.show) {
            const timer = setTimeout(() => {
                dispatch(hideToast());
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [toast.show, dispatch]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['application/pdf', 'text/plain'];
            if (!allowedTypes.includes(file.type)) {
                dispatch({
                    type: 'resumeCheck/showToast',
                    payload: {
                        message: 'Please upload a PDF or text file',
                        type: 'error'
                    }
                });
                return;
            }

            // Check file size (5MB max)
            if (file.size > 5 * 1024 * 1024) {
                dispatch({
                    type: 'resumeCheck/showToast',
                    payload: {
                        message: 'File size must be less than 5MB',
                        type: 'error'
                    }
                });
                return;
            }

            setLocalFile(file); // Store actual File object locally
            // Store only metadata in Redux
            dispatch(setUploadedFile(file));
        }
    };

    const handleAnalyzeResume = () => {
        if (localFile) {
            dispatch(analyzeResume({ file: localFile, jobDescription }));
        }
    };

    const handleClearAll = () => {
        setLocalFile(null);
        dispatch(clearAnalysis());
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'text-green-600 bg-green-50 border-green-200';
        if (score >= 60) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
        return 'text-red-600 bg-red-50 border-red-200';
    };

    const getScoreVariant = (score) => {
        if (score >= 80) return 'success';
        if (score >= 60) return 'warning';
        return 'error';
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 12
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-8">
            <ReTitle title='Check Resume'/>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Toast Notification */}
                <AnimatePresence>
                    {toast.show && (
                        <motion.div
                            initial={{ opacity: 0, y: -50, scale: 0.3 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: -50, scale: 0.5 }}
                            className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-6 py-3 rounded-xl shadow-lg ${toast.type === 'error'
                                    ? 'bg-red-500 text-white'
                                    : toast.type === 'warning'
                                        ? 'bg-yellow-500 text-white'
                                        : 'bg-green-500 text-white'
                                }`}
                        >
                            <div className="flex items-center space-x-2">
                                {toast.type === 'error' ? (
                                    <X className="w-5 h-5" />
                                ) : toast.type === 'warning' ? (
                                    <AlertCircle className="w-5 h-5" />
                                ) : (
                                    <CheckCircle className="w-5 h-5" />
                                )}
                                <span className="font-medium">{toast.message}</span>
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Header */}
                <motion.div
                    className="text-center mb-12"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6 }}
                >
                    <motion.div
                        className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2 shadow-sm mb-6"
                        whileHover={{ scale: 1.05 }}
                    >
                        <Sparkles className="w-4 h-4 text-amber-600" />
                        <span className="text-sm font-semibold text-amber-700">AI-Powered Resume Analysis</span>
                    </motion.div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mb-4">
                        Resume ATS
                        <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            Scanner & Checker
                        </span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                        Get instant AI-powered feedback on your resume's ATS compatibility and improvement suggestions.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-8">
                    {/* Left Side - Upload & Analysis Form */}
                    <motion.div
                        className="space-y-6"
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                    >
                        {/* Upload Section */}
                        <motion.div
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                            variants={itemVariants}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Upload className="w-5 h-5 text-blue-600" />
                                <span>Upload Your Resume</span>
                            </h3>

                            <div className="border-2 border-dashed border-gray-300 rounded-2xl p-8 text-center hover:border-blue-400 transition-colors duration-200">
                                <input
                                    type="file"
                                    id="resume-upload"
                                    accept=".pdf,.txt"
                                    onChange={handleFileUpload}
                                    className="hidden"
                                />
                                <label
                                    htmlFor="resume-upload"
                                    className="cursor-pointer block"
                                >
                                    <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-600 mb-2">
                                        <span className="font-semibold text-blue-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        PDF or TXT files (Max 5MB)
                                    </p>
                                </label>
                            </div>

                            {uploadedFile && (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="mt-4 p-4 bg-green-50 border border-green-200 rounded-xl flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <FileText className="w-5 h-5 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900">{uploadedFile.name}</p>
                                            <p className="text-sm text-green-600">
                                                {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={handleClearAll}
                                        className="text-red-500 hover:text-red-700"
                                    >
                                        <X className="w-4 h-4" />
                                    </button>
                                </motion.div>
                            )}
                        </motion.div>

                        {/* Job Description Section */}
                        <motion.div
                            className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                            variants={itemVariants}
                        >
                            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                <Target className="w-5 h-5 text-purple-600" />
                                <span>Target Job Description (Optional)</span>
                            </h3>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => dispatch(setJobDescription(e.target.value))}
                                placeholder="Paste the job description here to get tailored analysis and keyword matching..."
                                rows={6}
                                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 resize-none"
                            />
                            <p className="text-sm text-gray-500 mt-2">
                                Adding a job description helps us provide more specific keyword and skill matching.
                            </p>
                        </motion.div>

                        {/* Action Button */}
                        <motion.button
                            onClick={handleAnalyzeResume}
                            disabled={!localFile || isAnalyzing}
                            variants={itemVariants}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl font-semibold flex items-center justify-center space-x-3 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all duration-200"
                            whileHover={!isAnalyzing && localFile ? { scale: 1.02 } : {}}
                            whileTap={!isAnalyzing && localFile ? { scale: 0.98 } : {}}
                        >
                            {isAnalyzing ? (
                                <>
                                    <motion.div
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                        className="w-6 h-6 border-2 border-white border-t-transparent rounded-full"
                                    />
                                    <span>Analyzing Resume...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="w-6 h-6" />
                                    <span>Analyze My Resume</span>
                                </>
                            )}
                        </motion.button>

                        {analysisError && (
                            <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="p-4 bg-red-50 border border-red-200 rounded-xl"
                            >
                                <div className="flex items-center space-x-2 text-red-700">
                                    <AlertCircle className="w-5 h-5" />
                                    <span className="font-medium">Analysis Error: {analysisError}</span>
                                </div>
                            </motion.div>
                        )}
                    </motion.div>

                    {/* Right Side - Results */}
                    <div className="space-y-6">
                        {hasAnalysis ? (
                            <motion.div
                                className="space-y-6"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                            >
                                {/* Score Overview */}
                                <motion.div
                                    className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                                    variants={containerVariants}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <div className="flex justify-between items-start mb-6">
                                        <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                                        <button
                                            onClick={handleClearAll}
                                            className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                                        >
                                            <RefreshCw className="w-5 h-5" />
                                        </button>
                                    </div>

                                    {/* Main Scores */}
                                    <div className="grid grid-cols-2 gap-4 mb-6">
                                        <div className={`border-2 rounded-2xl p-4 text-center ${getScoreColor(atsScore)}`}>
                                            <div className="text-2xl font-bold mb-1">{atsScore}</div>
                                            <div className="text-sm font-medium">ATS Score</div>
                                            <div className="text-xs mt-1">Compatibility</div>
                                        </div>
                                        <div className={`border-2 rounded-2xl p-4 text-center ${getScoreColor(overallScore)}`}>
                                            <div className="text-2xl font-bold mb-1">{overallScore}</div>
                                            <div className="text-sm font-medium">Overall Score</div>
                                            <div className="text-xs mt-1">Quality</div>
                                        </div>
                                    </div>

                                    {/* Category Scores */}
                                    <div className="grid grid-cols-2 gap-3">
                                        {Object.entries(categoryScores).map(([category, score]) => (
                                            <div key={category} className="text-center">
                                                <div className="text-sm font-medium text-gray-700 capitalize mb-1">
                                                    {category}
                                                </div>
                                                <div className={`text-lg font-bold ${getScoreColor(score).split(' ')[0]}`}>
                                                    {score}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </motion.div>

                                {/* Summary */}
                                {analysis.summary && (
                                    <motion.div
                                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                            <span>AI Summary</span>
                                        </h3>
                                        <p className="text-gray-700 leading-relaxed">{analysis.summary}</p>
                                    </motion.div>
                                )}

                                {/* Strengths */}
                                {strengths.length > 0 && (
                                    <motion.div
                                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span>Strengths</span>
                                        </h3>
                                        <ul className="space-y-2">
                                            {strengths.map((strength, index) => (
                                                <li key={index} className="flex items-start space-x-2 text-green-700">
                                                    <CheckCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {/* Improvements */}
                                {improvements.length > 0 && (
                                    <motion.div
                                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                                            <span>Areas for Improvement</span>
                                        </h3>
                                        <ul className="space-y-2">
                                            {improvements.map((improvement, index) => (
                                                <li key={index} className="flex items-start space-x-2 text-yellow-700">
                                                    <AlertCircle className="w-4 h-4 mt-1 flex-shrink-0" />
                                                    <span>{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}

                                {/* Keyword Analysis */}
                                {keywordAnalysis && (
                                    <motion.div
                                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                            <Search className="w-5 h-5 text-purple-600" />
                                            <span>Keyword Analysis</span>
                                        </h3>

                                        {keywordAnalysis.foundKeywords && keywordAnalysis.foundKeywords.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-green-700 mb-2">Found Keywords</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {keywordAnalysis.foundKeywords.slice(0, 10).map((keyword, index) => (
                                                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded-lg text-sm">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {keywordAnalysis.missingKeywords && keywordAnalysis.missingKeywords.length > 0 && (
                                            <div className="mb-4">
                                                <h4 className="font-medium text-red-700 mb-2">Missing Keywords</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {keywordAnalysis.missingKeywords.slice(0, 10).map((keyword, index) => (
                                                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded-lg text-sm">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {keywordAnalysis.recommendedKeywords && keywordAnalysis.recommendedKeywords.length > 0 && (
                                            <div>
                                                <h4 className="font-medium text-blue-700 mb-2">Recommended Keywords</h4>
                                                <div className="flex flex-wrap gap-2">
                                                    {keywordAnalysis.recommendedKeywords.slice(0, 10).map((keyword, index) => (
                                                        <span key={index} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-lg text-sm">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </motion.div>
                                )}

                                {/* Detailed Analysis */}
                                {analysis.analysisDetails && (
                                    <motion.div
                                        className="bg-white rounded-3xl shadow-xl border border-gray-100 p-6"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                            <span>Detailed Analysis</span>
                                        </h3>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className={`p-3 rounded-xl ${analysis.analysisDetails.hasQuantifiableAchievements
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                <div className="text-sm font-medium">Quantifiable Achievements</div>
                                                <div className="text-xs">
                                                    {analysis.analysisDetails.hasQuantifiableAchievements ? '✓ Present' : '✗ Missing'}
                                                </div>
                                            </div>

                                            <div className={`p-3 rounded-xl ${analysis.analysisDetails.hasActionVerbs
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                <div className="text-sm font-medium">Action Verbs</div>
                                                <div className="text-xs">
                                                    {analysis.analysisDetails.hasActionVerbs ? '✓ Good usage' : '✗ Needs improvement'}
                                                </div>
                                            </div>

                                            <div className={`p-3 rounded-xl ${analysis.analysisDetails.contactInfoComplete
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                                }`}>
                                                <div className="text-sm font-medium">Contact Info</div>
                                                <div className="text-xs">
                                                    {analysis.analysisDetails.contactInfoComplete ? '✓ Complete' : '✗ Incomplete'}
                                                </div>
                                            </div>

                                            <div className="p-3 rounded-xl bg-blue-50 text-blue-700 border border-blue-200">
                                                <div className="text-sm font-medium">Sections Found</div>
                                                <div className="text-xs">
                                                    {analysis.analysisDetails.sectionsPresent.length} essential sections
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}

                                {/* AI Suggestions */}
                                {aiSuggestions.length > 0 && (
                                    <motion.div
                                        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-3xl border border-blue-100 p-6"
                                        variants={itemVariants}
                                    >
                                        <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center space-x-2">
                                            <Lightbulb className="w-5 h-5 text-amber-600" />
                                            <span>AI Suggestions</span>
                                        </h3>
                                        <ul className="space-y-3">
                                            {aiSuggestions.map((suggestion, index) => (
                                                <li key={index} className="flex items-start space-x-3">
                                                    <Sparkles className="w-4 h-4 text-amber-500 mt-1 flex-shrink-0" />
                                                    <span className="text-gray-700">{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </motion.div>
                                )}
                            </motion.div>
                        ) : (
                            /* Empty State */
                            <motion.div
                                className="bg-white rounded-3xl shadow-xl border border-gray-100 p-8 text-center"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.2 }}
                            >
                                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Analysis Yet
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Upload your resume and click "Analyze My Resume" to get started with AI-powered resume analysis.
                                </p>
                                <div className="flex items-center justify-center space-x-2 text-sm text-gray-500">
                                    <Sparkles className="w-4 h-4" />
                                    <span>Get instant ATS score and improvement suggestions</span>
                                </div>
                            </motion.div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeCheck;