import React, { useState, useEffect } from 'react';
import { Search, Play, Star, Users, Award, TrendingUp, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router';
import MainButton from '../../../components/sharedItems/MainButton/MainButton';

const Hero = () => {
  const navigate = useNavigate();

  // Stats data
  const stats = [
    { number: '50K+', label: 'Jobs Available', icon: TrendingUp },
    { number: '10K+', label: 'Companies Hiring', icon: Users },
    { number: '95%', label: 'Success Rate', icon: Award },
    { number: '4.9/5', label: 'User Rating', icon: Star },
  ];

  // Original sponsor logos - high quality brands
  const sponsors = [
    { 
      name: 'Google', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/2/2f/Google_2015_logo.svg/800px-Google_2015_logo.svg.png' 
    },
    { 
      name: 'Microsoft', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/96/Microsoft_logo_%282012%29.svg/1024px-Microsoft_logo_%282012%29.svg.png' 
    },
    { 
      name: 'Amazon', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Amazon_logo.svg/1024px-Amazon_logo.svg.png' 
    },
    { 
      name: 'Apple', 
      logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/fa/Apple_logo_black.svg/800px-Apple_logo_black.svg.png' 
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-white">
      {/* Main Content */}
      <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            
            {/* Simple Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gray-100 border border-gray-200 rounded-full px-4 py-2"
              variants={itemVariants}
            >
              <span className="text-sm font-medium text-gray-700">Trusted Career Platform</span>
            </motion.div>

            {/* Main Heading */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                Find Your
                <span className="block text-blue-600">
                  Dream Career
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                Discover opportunities, connect with professionals, and build a career that inspires you.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4" variants={containerVariants}>
              {stats.map((stat) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={stat.label}
                    className="text-center p-3 rounded-lg bg-gray-50 border border-gray-200"
                    variants={itemVariants}
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-lg font-bold text-gray-900">{stat.number}</div>
                    <div className="text-xs text-gray-600">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Search Bar */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  className="w-full pl-12 pr-32 py-4 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                />
                <MainButton 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold flex items-center space-x-2 hover:bg-blue-700 transition-colors"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </MainButton>
              </div>

              {/* Quick Actions */}
              <div className="flex flex-wrap gap-3">
                <MainButton onClick={() => navigate('/mock-interview')} 
                >
                  <span>Mock Interview</span>
                </MainButton>
                <MainButton onClick={() => navigate("/create-resume")}
                >
                  <span>Create Resume</span>
                </MainButton>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Visual Content */}
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            
            {/* Main Image Container */}
            <div className="relative">
              {/* Simple Card */}
              <div className="absolute -top-4 -left-4 bg-white rounded-lg p-3 shadow-lg border border-gray-200 z-20">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">+25% Growth</div>
                    <div className="text-xs text-gray-600">This month</div>
                  </div>
                </div>
              </div>

              {/* Main Hero Image */}
              <div className="relative rounded-xl overflow-hidden shadow-lg border border-gray-200">
                <img
                  src="https://i.postimg.cc/t4qcPNXx/image.jpg"
                  alt="Professionals networking and collaborating"
                  className="w-full h-auto object-cover"
                />
                
                {/* Simple Badge */}
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-lg text-sm font-semibold">
                  New
                </div>
              </div>

              {/* Bottom Card */}
              <div className="absolute -bottom-4 -right-4 bg-white rounded-lg p-3 shadow-lg border border-gray-200 z-20">
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <div 
                        key={i} 
                        className="w-6 h-6 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center"
                      >
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
          </motion.div>
        </motion.div>
      </div>

      {/* Sponsors Section */}
      <div className="bg-gray-50 border-t border-gray-200 py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-6 lg:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p className="text-sm font-medium text-gray-500 uppercase tracking-wider">
              Trusted by leading companies
            </p>
          </motion.div>
          
          <div className="relative overflow-hidden">
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10"></div>
            
            {/* Infinite Scrolling Sponsor Logos */}
            <motion.div 
              className="flex space-x-12 lg:space-x-16"
              animate={{ 
                x: [0, -1200],
              }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 40,
                  ease: "linear",
                }
              }}
            >
              {/* Double the sponsors for seamless looping */}
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <motion.div
                  key={`${sponsor.name}-${index}`}
                  className="flex-shrink-0 flex items-center justify-center opacity-70 hover:opacity-100 transition-opacity duration-300"
                  whileHover={{ 
                    scale: 1.05,
                    transition: { duration: 0.2 }
                  }}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-8 lg:h-10 object-contain max-w-[120px] lg:max-w-[150px]"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;