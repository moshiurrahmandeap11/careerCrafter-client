import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Upload, FileText, AlertCircle, CheckCircle, X, Download, RefreshCw, Target, BarChart3, Lightbulb, Search } from 'lucide-react';

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

            setLocalFile(file);
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

    return (
        <div className="min-h-screen bg-white py-6">
            <ReTitle title='Check Resume'/>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Toast Notification */}
                {toast.show && (
                    <div className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 px-4 py-2 rounded-lg text-sm ${
                        toast.type === 'error' ? 'bg-red-500 text-white' : 'bg-green-500 text-white'
                    }`}>
                        <div className="flex items-center gap-2">
                            {toast.type === 'error' ? <X className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                            <span>{toast.message}</span>
                        </div>
                    </div>
                )}

                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                        Resume Checker
                    </h1>
                    <p className="text-gray-600">
                        Get feedback on your resume's ATS compatibility
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Left Side - Upload & Analysis Form */}
                    <div className="space-y-6">
                        {/* Upload Section */}
                        <div className="bg-white rounded-lg border border-gray-300 p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-blue-600" />
                                <span>Upload Your Resume</span>
                            </h3>

                            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
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
                                    <FileText className="w-10 h-10 text-gray-400 mx-auto mb-3" />
                                    <p className="text-gray-600 mb-1">
                                        <span className="font-medium text-blue-600">Click to upload</span> or drag and drop
                                    </p>
                                    <p className="text-sm text-gray-500">
                                        PDF or TXT files (Max 5MB)
                                    </p>
                                </label>
                            </div>

                            {uploadedFile && (
                                <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <FileText className="w-4 h-4 text-green-600" />
                                        <div>
                                            <p className="font-medium text-green-900 text-sm">{uploadedFile.name}</p>
                                            <p className="text-xs text-green-600">
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
                                </div>
                            )}
                        </div>

                        {/* Job Description Section */}
                        <div className="bg-white rounded-lg border border-gray-300 p-4">
                            <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center gap-2">
                                <Target className="w-5 h-5 text-purple-600" />
                                <span>Target Job Description (Optional)</span>
                            </h3>

                            <textarea
                                value={jobDescription}
                                onChange={(e) => dispatch(setJobDescription(e.target.value))}
                                placeholder="Paste the job description here for better analysis..."
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 resize-none text-sm"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Adding a job description helps with keyword matching.
                            </p>
                        </div>

                        {/* Action Button */}
                        <button
                            onClick={handleAnalyzeResume}
                            disabled={!localFile || isAnalyzing}
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
                        >
                            {isAnalyzing ? (
                                <>
                                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                    <span>Analyzing...</span>
                                </>
                            ) : (
                                <>
                                    <Search className="w-5 h-5" />
                                    <span>Analyze Resume</span>
                                </>
                            )}
                        </button>

                        {analysisError && (
                            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                                <div className="flex items-center gap-2 text-red-700">
                                    <AlertCircle className="w-4 h-4" />
                                    <span className="text-sm font-medium">Error: {analysisError}</span>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Right Side - Results */}
                    <div className="space-y-6">
                        {hasAnalysis ? (
                            <div className="space-y-6">
                                {/* Score Overview */}
                                <div className="bg-white rounded-lg border border-gray-300 p-4">
                                    <div className="flex justify-between items-start mb-4">
                                        <h3 className="text-lg font-semibold text-gray-900">Analysis Results</h3>
                                        <button
                                            onClick={handleClearAll}
                                            className="text-gray-500 hover:text-gray-700"
                                        >
                                            <RefreshCw className="w-4 h-4" />
                                        </button>
                                    </div>

                                    {/* Main Scores */}
                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        <div className={`border-2 rounded-lg p-3 text-center ${getScoreColor(atsScore)}`}>
                                            <div className="text-xl font-bold mb-1">{atsScore}</div>
                                            <div className="text-sm font-medium">ATS Score</div>
                                        </div>
                                        <div className={`border-2 rounded-lg p-3 text-center ${getScoreColor(overallScore)}`}>
                                            <div className="text-xl font-bold mb-1">{overallScore}</div>
                                            <div className="text-sm font-medium">Overall Score</div>
                                        </div>
                                    </div>

                                    {/* Category Scores */}
                                    <div className="grid grid-cols-2 gap-2">
                                        {Object.entries(categoryScores).map(([category, score]) => (
                                            <div key={category} className="text-center">
                                                <div className="text-xs font-medium text-gray-700 capitalize mb-1">
                                                    {category}
                                                </div>
                                                <div className={`text-sm font-bold ${getScoreColor(score).split(' ')[0]}`}>
                                                    {score}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Summary */}
                                {analysis.summary && (
                                    <div className="bg-white rounded-lg border border-gray-300 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                            <span>Summary</span>
                                        </h3>
                                        <p className="text-gray-700 text-sm">{analysis.summary}</p>
                                    </div>
                                )}

                                {/* Strengths */}
                                {strengths.length > 0 && (
                                    <div className="bg-white rounded-lg border border-gray-300 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <span>Strengths</span>
                                        </h3>
                                        <ul className="space-y-1">
                                            {strengths.map((strength, index) => (
                                                <li key={index} className="flex items-start gap-2 text-green-700 text-sm">
                                                    <CheckCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span>{strength}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Improvements */}
                                {improvements.length > 0 && (
                                    <div className="bg-white rounded-lg border border-gray-300 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <AlertCircle className="w-5 h-5 text-yellow-600" />
                                            <span>Areas for Improvement</span>
                                        </h3>
                                        <ul className="space-y-1">
                                            {improvements.map((improvement, index) => (
                                                <li key={index} className="flex items-start gap-2 text-yellow-700 text-sm">
                                                    <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
                                                    <span>{improvement}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Keyword Analysis */}
                                {keywordAnalysis && (
                                    <div className="bg-white rounded-lg border border-gray-300 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <Search className="w-5 h-5 text-purple-600" />
                                            <span>Keyword Analysis</span>
                                        </h3>

                                        {keywordAnalysis.foundKeywords && keywordAnalysis.foundKeywords.length > 0 && (
                                            <div className="mb-3">
                                                <h4 className="font-medium text-green-700 text-sm mb-1">Found Keywords</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {keywordAnalysis.foundKeywords.slice(0, 8).map((keyword, index) => (
                                                        <span key={index} className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}

                                        {keywordAnalysis.missingKeywords && keywordAnalysis.missingKeywords.length > 0 && (
                                            <div className="mb-3">
                                                <h4 className="font-medium text-red-700 text-sm mb-1">Missing Keywords</h4>
                                                <div className="flex flex-wrap gap-1">
                                                    {keywordAnalysis.missingKeywords.slice(0, 8).map((keyword, index) => (
                                                        <span key={index} className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs">
                                                            {keyword}
                                                        </span>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}

                                {/* Detailed Analysis */}
                                {analysis.analysisDetails && (
                                    <div className="bg-white rounded-lg border border-gray-300 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <BarChart3 className="w-5 h-5 text-blue-600" />
                                            <span>Details</span>
                                        </h3>

                                        <div className="grid grid-cols-2 gap-2">
                                            <div className={`p-2 rounded-lg text-xs ${
                                                analysis.analysisDetails.hasQuantifiableAchievements
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                <div className="font-medium">Achievements</div>
                                                <div>{analysis.analysisDetails.hasQuantifiableAchievements ? 'Good' : 'Needs work'}</div>
                                            </div>

                                            <div className={`p-2 rounded-lg text-xs ${
                                                analysis.analysisDetails.hasActionVerbs
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                <div className="font-medium">Action Verbs</div>
                                                <div>{analysis.analysisDetails.hasActionVerbs ? 'Good' : 'Needs work'}</div>
                                            </div>

                                            <div className={`p-2 rounded-lg text-xs ${
                                                analysis.analysisDetails.contactInfoComplete
                                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                                    : 'bg-red-50 text-red-700 border border-red-200'
                                            }`}>
                                                <div className="font-medium">Contact Info</div>
                                                <div>{analysis.analysisDetails.contactInfoComplete ? 'Complete' : 'Incomplete'}</div>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* AI Suggestions */}
                                {aiSuggestions.length > 0 && (
                                    <div className="bg-blue-50 rounded-lg border border-blue-200 p-4">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2 flex items-center gap-2">
                                            <Lightbulb className="w-5 h-5 text-blue-600" />
                                            <span>Suggestions</span>
                                        </h3>
                                        <ul className="space-y-2">
                                            {aiSuggestions.map((suggestion, index) => (
                                                <li key={index} className="flex items-start gap-2 text-gray-700 text-sm">
                                                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-1.5 flex-shrink-0" />
                                                    <span>{suggestion}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        ) : (
                            /* Empty State */
                            <div className="bg-white rounded-lg border border-gray-300 p-6 text-center">
                                <FileText className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                    No Analysis Yet
                                </h3>
                                <p className="text-gray-600 text-sm mb-3">
                                    Upload your resume to get started with resume analysis.
                                </p>
                                <div className="flex items-center justify-center gap-1 text-xs text-gray-500">
                                    <span>Get ATS score and improvement suggestions</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResumeCheck;