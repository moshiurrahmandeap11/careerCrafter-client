import React from 'react';
import { useNavigate } from 'react-router';

const BuildFor = () => {
    const navigate = useNavigate();

    const handleStart = () => {
        navigate("/cc/learn")
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-6xl mx-auto">
                {/* Header Section */}
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
                        Who we're built for
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        AI-powered career solutions tailored for professionals and organizations
                    </p>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                    {/* Left Column - Industries */}
                    <div className="space-y-8">
                        {/* Featured Industries */}
                        <div className="space-y-6">
                            <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-blue-500">
                                <h3 className="text-2xl font-bold text-gray-900 mb-4">Job Seekers</h3>
                                <p className="text-gray-600">
                                    AI-powered resume optimization, personalized career recommendations, 
                                    and interview preparation for professionals at all levels.
                                </p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {['Career Changers', 'Students & Graduates', 'Tech Professionals', 'Remote Workers'].map((industry) => (
                                    <div key={industry} className="bg-white rounded-xl shadow-md p-5 hover:shadow-lg transition-shadow">
                                        <h4 className="font-semibold text-gray-900">{industry}</h4>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Other Industries */}
                        <div className="space-y-4">
                            <h3 className="text-xl font-semibold text-gray-900">Also perfect for</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                {['HR Departments', 'Recruitment Agencies', 'Career Coaches', 'Universities'].map((industry) => (
                                    <div key={industry} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                                        <span className="text-gray-800">{industry}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Feature Card */}
                    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md mx-auto">
                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-900">AI CAREER ASSISTANT</h2>
                            <p className="text-gray-500 mt-2">Smart career guidance powered by AI</p>
                        </div>

                        <div className="space-y-6">
                            <div className="border-b border-gray-200 pb-4">
                                <h3 className="font-semibold text-gray-900 mb-3">Premium Features</h3>
                                <div className="space-y-3">
                                    {[
                                        { name: 'AI Resume Builder', price: 'Professional' },
                                        { name: 'Career Path Analysis', price: 'Advanced' },
                                        { name: 'Interview Simulator', price: 'Premium' }
                                    ].map((feature, index) => (
                                        <div key={index} className="flex justify-between items-center">
                                            <span className="text-gray-700">{feature.name}</span>
                                            <span className="font-semibold text-blue-600">{feature.price}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="space-y-3">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Support:</span>
                                    <span className="font-medium">24/7 AI Assistant</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Updates:</span>
                                    <span className="font-medium">Real-time Market Data</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-600">Plan:</span>
                                    <span className="font-medium">Career Pro</span>
                                </div>
                                <div className="flex justify-between items-center text-lg font-bold">
                                    <span>Total:</span>
                                    <span className="text-blue-600">$19/mo</span>
                                </div>
                            </div>

                            <button onClick={handleStart} className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-md">
                                Start Career Journey
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default BuildFor;