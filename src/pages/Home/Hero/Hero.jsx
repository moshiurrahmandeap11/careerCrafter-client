import React, { useState, useEffect } from 'react';
import { Search, Play, Star, Users, Award, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Stats data
  const stats = [
    { number: '50K+', label: 'Jobs Available', icon: TrendingUp },
    { number: '10K+', label: 'Companies Hiring', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '4.9/5', label: 'User Rating', icon: Star },
  ];

  // Sponsor logos
  const sponsors = [
    { name: 'TechCorp', logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png' },
    { name: 'InnovateLabs', logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png' },
    { name: 'FutureWorks', logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png' },
    { name: 'DreamJobs', logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png' },
    { name: 'CareerBoost', logo: 'https://i.postimg.cc/VkZCgzcZ/sponsor-rubber-stamp-red-sponsor-rubber-grunge-stamp-seal-illustration-free-vector-removebg-preview.png' },
  ];

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse delay-500"></div>
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          
          {/* Left Column - Text Content */}
          <div className={`space-y-8 transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`}>
            
            {/* Premium Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2 shadow-sm">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">AI-Powered Career Platform</span>
              <div className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>

            {/* Main Heading */}
            <div className="space-y-4">
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                Craft Your
                <span className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Dream Career
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
                Discover opportunities, connect with professionals, and build a career that inspires you with our AI-powered platform.
              </p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <div 
                    key={stat.label}
                    className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm hover:shadow-md transition-all duration-300 hover:scale-105"
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                  </div>
                );
              })}
            </div>

            {/* Search Bar */}
            <div className="space-y-4">
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg shadow-lg hover:shadow-xl"
                />
                <button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105 flex items-center space-x-2">
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700 hover:border-blue-500 hover:text-blue-600 transition-all duration-200 hover:shadow-md">
                  <Play className="w-4 h-4" />
                  <span>Watch Demo</span>
                </button>
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold hover:shadow-lg transition-all duration-200 hover:scale-105">
                  <Sparkles className="w-4 h-4" />
                  <span>Try AI Resume</span>
                </button>
              </div>
            </div>
          </div>

          {/* Right Column - Visual Content */}
          <div className={`relative transition-all duration-700 transform ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'
          }`} style={{ transitionDelay: '300ms' }}>
            
            {/* Main Image Container */}
            <div className="relative">
              {/* Floating Cards */}
              <div className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 transform rotate-3 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">+25% Growth</div>
                    <div className="text-xs text-gray-600">This month</div>
                  </div>
                </div>
              </div>

              {/* Main Hero Image */}
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white transform hover:scale-105 transition-transform duration-500">
                <img
                  src="https://i.postimg.cc/t4qcPNXx/image.jpg"
                  alt="Professionals networking and collaborating"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating AI Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1">
                  <Sparkles className="w-4 h-4" />
                  <span>AI Powered</span>
                </div>
              </div>

              {/* Bottom Floating Card */}
              <div className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 transform -rotate-3 z-20">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center">
                        <Users className="w-3 h-3 text-blue-600" />
                      </div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">5K+ Hired</div>
                    <div className="text-xs text-gray-600">This week</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sponsors Section */}
      <div className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-gray-100 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 lg:mb-8">
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Trusted by leading companies
            </p>
          </div>
          
          <div className="relative">
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            {/* Scrolling Sponsor Logos */}
            <div className="flex animate-scroll space-x-12 lg:space-x-16">
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center opacity-60 hover:opacity-100 transition-opacity duration-300 grayscale hover:grayscale-0"
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-8 lg:h-10 object-contain filter brightness-0 invert-[0.3] hover:invert-0 transition-all duration-300"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 30s linear infinite;
          display: flex;
          width: max-content;
        }
        
        @media (max-width: 768px) {
          .animate-scroll {
            animation: scroll 20s linear infinite;
          }
        }
        
        /* Pause animation on hover */
        .animate-scroll:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default Hero;