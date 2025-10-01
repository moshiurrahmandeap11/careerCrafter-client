import React, { useState, useEffect } from 'react';
import { Search, Play, Star, Users, Award, TrendingUp, Sparkles, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

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

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3
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

  const floatingCardVariants = {
    initial: { y: 0 },
    animate: {
      y: [-10, 10, -10],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  const imageHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      transition: {
        duration: 0.3,
        ease: "easeOut"
      }
    }
  };

  const buttonHoverVariants = {
    initial: { scale: 1 },
    hover: {
      scale: 1.05,
      boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.4)",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 17
      }
    },
    tap: { scale: 0.95 }
  };

  const gradientOrbVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.3, 0.5, 0.3],
      transition: {
        duration: 6,
        repeat: Infinity,
        ease: "easeInOut"
      }
    }
  };

  return (
    <div className="relative w-full min-h-screen overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated gradient orbs */}
        <motion.div
          className="absolute -top-20 -right-20 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl"
          variants={gradientOrbVariants}
          animate="animate"
        />
        <motion.div
          className="absolute -bottom-20 -left-20 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl"
          variants={gradientOrbVariants}
          animate="animate"
          initial={{ opacity: 0.3 }}
        />
        <motion.div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl"
          variants={gradientOrbVariants}
          animate="animate"
          initial={{ opacity: 0.2 }}
        />
        
        {/* Grid pattern */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(rgba(0,0,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-11/12 mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <motion.div 
          className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          
          {/* Left Column - Text Content */}
          <div className="space-y-8">
            
            {/* Premium Badge */}
            <motion.div 
              className="inline-flex items-center space-x-2 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-full px-4 py-2 shadow-sm"
              variants={itemVariants}
              whileHover={{ scale: 1.05 }}
            >
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span className="text-sm font-semibold text-amber-700">AI-Powered Career Platform</span>
              <motion.div 
                className="w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                animate={{ scale: [1, 1.5, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.div>

            {/* Main Heading */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 tracking-tight leading-tight">
                Craft Your
                <motion.span 
                  className="block bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                  animate={{ backgroundPosition: ['0%', '100%'] }}
                  transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                  style={{ 
                    backgroundSize: '200% 100%',
                    backgroundImage: 'linear-gradient(to right, #2563eb, #7c3aed, #2563eb)'
                  }}
                >
                  Dream Career
                </motion.span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl text-gray-600 leading-relaxed max-w-lg">
                Discover opportunities, connect with professionals, and build a career that inspires you with our AI-powered platform.
              </p>
            </motion.div>

            {/* Stats Grid */}
            <motion.div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-4" variants={containerVariants}>
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <motion.div 
                    key={stat.label}
                    className="text-center p-3 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-100 shadow-sm"
                    variants={itemVariants}
                    whileHover={{ 
                      scale: 1.05, 
                      y: -5,
                      boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)"
                    }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="flex justify-center mb-2">
                      <Icon className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="text-lg sm:text-xl font-bold text-gray-900">{stat.number}</div>
                    <div className="text-xs text-gray-600 font-medium">{stat.label}</div>
                  </motion.div>
                );
              })}
            </motion.div>

            {/* Search Bar */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <div className="relative max-w-xl">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <motion.input
                  type="text"
                  placeholder="Search for jobs, companies, or skills..."
                  className="w-full pl-12 pr-32 py-4 bg-white border border-gray-200 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 transition-all duration-200 text-lg shadow-lg"
                  whileFocus={{ scale: 1.02 }}
                />
                <motion.button 
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl font-semibold flex items-center space-x-2"
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <span>Search</span>
                  <ArrowRight className="w-4 h-4" />
                </motion.button>
              </div>

              {/* Quick Actions */}
              <motion.div className="flex flex-wrap gap-3" variants={itemVariants}>
                <motion.button 
                  className="inline-flex items-center space-x-2 bg-white border border-gray-200 rounded-xl px-4 py-2 text-sm font-medium text-gray-700"
                  whileHover={{ 
                    borderColor: "#3b82f6",
                    color: "#2563eb",
                    y: -2
                  }}
                  transition={{ type: "spring", stiffness: 400 }}
                >
                  <Play className="w-4 h-4" />
                  <span>Watch Demo</span>
                </motion.button>
                <motion.button 
                  className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl px-4 py-2 text-sm font-semibold"
                  variants={buttonHoverVariants}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Try AI Resume</span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* Right Column - Visual Content */}
          <motion.div 
            className="relative"
            variants={itemVariants}
          >
            
            {/* Main Image Container */}
            <div className="relative">
              {/* Floating Cards */}
              <motion.div 
                className="absolute -top-6 -left-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 transform rotate-3 z-20"
                variants={floatingCardVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.1, rotate: 0 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">+25% Growth</div>
                    <div className="text-xs text-gray-600">This month</div>
                  </div>
                </div>
              </motion.div>

              {/* Main Hero Image */}
              <motion.div 
                className="relative rounded-3xl overflow-hidden shadow-2xl border-8 border-white"
                variants={imageHoverVariants}
                initial="initial"
                whileHover="hover"
              >
                <img
                  src="https://i.postimg.cc/t4qcPNXx/image.jpg"
                  alt="Professionals networking and collaborating"
                  className="w-full h-auto object-cover"
                />
                
                {/* Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                
                {/* Floating AI Badge */}
                <motion.div 
                  className="absolute top-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-3 py-2 rounded-full text-sm font-semibold shadow-lg flex items-center space-x-1"
                  whileHover={{ scale: 1.1 }}
                  animate={{ 
                    boxShadow: [
                      "0 10px 25px -5px rgba(139, 92, 246, 0.4)",
                      "0 20px 40px -5px rgba(139, 92, 246, 0.6)",
                      "0 10px 25px -5px rgba(139, 92, 246, 0.4)"
                    ]
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>AI Powered</span>
                </motion.div>
              </motion.div>

              {/* Bottom Floating Card */}
              <motion.div 
                className="absolute -bottom-6 -right-6 bg-white rounded-2xl p-4 shadow-2xl border border-gray-100 transform -rotate-3 z-20"
                variants={floatingCardVariants}
                initial="initial"
                animate="animate"
                whileHover={{ scale: 1.1, rotate: 0 }}
              >
                <div className="flex items-center space-x-3">
                  <div className="flex -space-x-2">
                    {[1, 2, 3].map((i) => (
                      <motion.div 
                        key={i} 
                        className="w-8 h-8 bg-blue-100 rounded-full border-2 border-white flex items-center justify-center"
                        whileHover={{ scale: 1.2, zIndex: 10 }}
                        transition={{ type: "spring", stiffness: 400 }}
                      >
                        <Users className="w-3 h-3 text-blue-600" />
                      </motion.div>
                    ))}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-gray-900">5K+ Hired</div>
                    <div className="text-xs text-gray-600">This week</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </motion.div>
      </div>

      {/* Sponsors Section */}
      <motion.div 
        className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-gray-100 py-8 lg:py-12"
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            className="text-center mb-6 lg:mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            <p className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
              Trusted by leading companies
            </p>
          </motion.div>
          
          <div className="relative">
            {/* Gradient Fades */}
            <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-white to-transparent z-10"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-white to-transparent z-10"></div>
            
            {/* Scrolling Sponsor Logos */}
            <motion.div 
              className="flex space-x-12 lg:space-x-16"
              animate={{ x: [0, -1032] }}
              transition={{ 
                x: {
                  repeat: Infinity,
                  repeatType: "loop",
                  duration: 30,
                  ease: "linear",
                }
              }}
            >
              {[...sponsors, ...sponsors].map((sponsor, index) => (
                <motion.div
                  key={index}
                  className="flex-shrink-0 flex items-center justify-center opacity-60 grayscale"
                  whileHover={{ 
                    opacity: 1, 
                    grayscale: 0,
                    scale: 1.1,
                    transition: { duration: 0.2 }
                  }}
                >
                  <img
                    src={sponsor.logo}
                    alt={sponsor.name}
                    className="h-8 lg:h-10 object-contain filter brightness-0 invert-[0.3] hover:invert-0 transition-all duration-300"
                  />
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;