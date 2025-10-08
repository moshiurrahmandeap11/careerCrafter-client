import { motion } from "framer-motion"
import { AlertCircle, CheckCircle, Download, Sparkles, TrendingUp, Upload, Wand2, X } from "lucide-react";

export const AnalyzeResumeSection = ({
    uploadedFile,
    fileInputRef,
    handleFileUpload,
    analyzing,
    atsScore,
    suggestions,
    getScoreColor,
    getScoreBgColor,
    onResetAnalysis
}) => {
    return (
        <div className="max-w-5xl mx-auto">
            {!uploadedFile ? (
                <motion.div
                    className="bg-white rounded-2xl p-12 shadow-lg border-2 border-dashed border-gray-300 text-center"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                >
                    <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mx-auto mb-6 flex items-center justify-center">
                        <Upload className="w-10 h-10 text-white" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 mb-3">Upload Your Resume</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">
                        Get instant ATS score and actionable suggestions to improve your resume
                    </p>

                    <input
                        ref={fileInputRef}
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleFileUpload}
                        className="hidden"
                    />

                    <motion.button
                        onClick={() => fileInputRef.current?.click()}
                        className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 inline-flex items-center space-x-2"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        <Upload className="w-5 h-5" />
                        <span>Choose File</span>
                    </motion.button>

                    <p className="text-sm text-gray-500 mt-4">
                        Supports PDF, DOC, DOCX • Max 5MB
                    </p>
                </motion.div>
            ) : analyzing ? (
                <motion.div
                    className="bg-white rounded-2xl p-12 shadow-lg text-center"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                >
                    <motion.div
                        animate={{
                            rotate: 360,
                            scale: [1, 1.1, 1]
                        }}
                        transition={{
                            rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                            scale: { duration: 1, repeat: Infinity }
                        }}
                        className="w-20 h-20 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mx-auto mb-6 flex items-center justify-center"
                    >
                        <Sparkles className="w-10 h-10 text-white" />
                    </motion.div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-2">Analyzing Your Resume</h3>
                    <p className="text-gray-600">AI is reviewing your resume for ATS compatibility...</p>
                </motion.div>
            ) : (
                <div className="space-y-6">
                    {/* Score Card */}
                    <motion.div
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                    >
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900 mb-2">ATS Compatibility Score</h2>
                                <p className="text-gray-600">Based on {uploadedFile?.name}</p>
                            </div>
                            <button
                                onClick={onResetAnalysis}
                                className="text-gray-500 hover:text-gray-700"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="grid md:grid-cols-3 gap-6">
                            {/* Score Display */}
                            <div className="md:col-span-1">
                                <div className={`relative w-40 h-40 mx-auto bg-gradient-to-r ${getScoreBgColor(atsScore)} rounded-full flex items-center justify-center`}>
                                    <div className="absolute inset-2 bg-white rounded-full flex items-center justify-center">
                                        <div className="text-center">
                                            <div className={`text-4xl font-bold ${getScoreColor(atsScore)}`}>
                                                {atsScore}
                                            </div>
                                            <div className="text-sm text-gray-600">/ 100</div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Score Breakdown */}
                            <div className="md:col-span-2 space-y-4">
                                {[
                                    { label: 'Keywords Match', score: 85, color: 'bg-green-500' },
                                    { label: 'Formatting', score: 72, color: 'bg-yellow-500' },
                                    { label: 'Section Headers', score: 90, color: 'bg-green-500' },
                                    { label: 'Contact Info', score: 65, color: 'bg-orange-500' }
                                ].map((item, index) => (
                                    <div key={index}>
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="text-sm font-medium text-gray-700">{item.label}</span>
                                            <span className="text-sm font-bold text-gray-900">{item.score}%</span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-2">
                                            <motion.div
                                                className={`h-2 rounded-full ${item.color}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${item.score}%` }}
                                                transition={{ duration: 1, delay: index * 0.1 }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>

                    {/* Suggestions */}
                    <motion.div
                        className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center">
                            <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                            Improvement Suggestions
                        </h3>

                        <div className="space-y-4">
                            {suggestions.map((suggestion, index) => (
                                <motion.div
                                    key={index}
                                    className={`p-4 rounded-xl border-l-4 ${suggestion.type === 'critical'
                                        ? 'bg-red-50 border-red-500'
                                        : suggestion.type === 'warning'
                                            ? 'bg-yellow-50 border-yellow-500'
                                            : 'bg-green-50 border-green-500'
                                        }`}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                >
                                    <div className="flex items-start space-x-3">
                                        {suggestion.type === 'critical' ? (
                                            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
                                        ) : suggestion.type === 'warning' ? (
                                            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                                        ) : (
                                            <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                                        )}
                                        <div className="flex-1">
                                            <h4 className="font-semibold text-gray-900 mb-1">{suggestion.title}</h4>
                                            <p className="text-sm text-gray-600">{suggestion.description}</p>
                                            {suggestion.impact !== 'positive' && (
                                                <span className={`inline-block mt-2 text-xs font-medium px-2 py-1 rounded-full ${suggestion.impact === 'high'
                                                    ? 'bg-red-100 text-red-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {suggestion.impact === 'high' ? 'High Impact' : 'Medium Impact'}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Action Buttons */}
                    <div className="flex space-x-4">
                        <motion.button
                            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Wand2 className="w-5 h-5" />
                            <span>Auto-Optimize Resume</span>
                        </motion.button>
                        <motion.button
                            className="flex-1 bg-white border-2 border-blue-600 text-blue-600 py-4 rounded-xl font-semibold hover:bg-blue-50 transition-all duration-200 flex items-center justify-center space-x-2"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <Download className="w-5 h-5" />
                            <span>Download Report</span>
                        </motion.button>
                    </div>
                </div>
            )}
        </div>
    );
};