import { ArrowUp, Target, Zap } from 'lucide-react';
import React from 'react';
import { useNavigate } from 'react-router';

const Founder = () => {
    const navigate = useNavigate();
    const handleUnlock = () => {
        navigate("/premium")
    }
    return (
        <div className="min-h-screen bg-white py-16 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto text-center">
                
                {/* Top Text */}
                <div className="mb-12">
                    <p className="text-lg text-gray-600 font-medium mb-4">
                        If You're A Career Professional Earning Under $100K...
                    </p>
                </div>

                {/* Main Heading */}
                <div className="mb-16">
                    <h1 className="text-4xl md:text-6xl font-bold text-gray-900 leading-tight mb-6">
                        PROFESSIONALS WHO IGNORE
                        <br />
                        <span className="text-blue-600">THEIR CAREER GROWTH</span>
                        <br />
                        GET LEFT BEHIND
                    </h1>
                </div>

                {/* Bottom Section */}
                <div className="mt-20">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-8">
                        Master Your Career Growth
                    </h2>
                    
                    {/* CTA Button */}
                    <div className="mt-10">
                        <button onClick={handleUnlock} className="bg-blue-600 text-white px-12 py-4 rounded-lg text-xl font-semibold hover:bg-blue-700  shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-transform">
                            Unlock Your Potential
                        </button>
                    </div>

                    {/* Additional Info */}
                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-3xl mx-auto">
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 font-bold"><ArrowUp></ArrowUp></span>
                            </div>
                            <h3 className="font-semibold text-gray-900">Salary Boost</h3>
                            <p className="text-gray-600 text-sm mt-2">Increase your earning potential</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 font-bold"><Zap></Zap></span>
                            </div>
                            <h3 className="font-semibold text-gray-900">Fast Growth</h3>
                            <p className="text-gray-600 text-sm mt-2">Accelerate your career progression</p>
                        </div>
                        
                        <div className="text-center">
                            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <span className="text-blue-600 font-bold"><Target></Target></span>
                            </div>
                            <h3 className="font-semibold text-gray-900">Right Path</h3>
                            <p className="text-gray-600 text-sm mt-2">Find your ideal career direction</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Founder;