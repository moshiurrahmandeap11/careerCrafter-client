import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Search, Home, Users, Briefcase, MessageCircle, Bell, User, Building, Crown, Menu, X, FileText, Sparkles, Target, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from '../Logo/Logo';
import Loader from '../Loader/Loader';
import useAuth from '../../../hooks/UseAuth/useAuth';
import Swal from 'sweetalert2';

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const avatar = "https://i.postimg.cc/0y6myZrg/businessman-character-avatar-isolated-24877-60111.avif";

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
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
        damping: 24
      }
    }
  };

  const mobileMenuVariants = {
    closed: {
      x: "-100%",
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    },
    open: {
      x: 0,
      transition: {
        type: "spring",
        stiffness: 400,
        damping: 40
      }
    }
  };

  const overlayVariants = {
    closed: {
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    open: {
      opacity: 1,
      transition: {
        duration: 0.2
      }
    }
  };

  const searchVariants = {
    collapsed: {
      width: 0,
      opacity: 0,
      transition: {
        duration: 0.2
      }
    },
    expanded: {
      width: "100%",
      opacity: 1,
      transition: {
        duration: 0.3
      }
    }
  };

  // Set active nav based on current route
  useEffect(() => {
    const path = location.pathname;
    if (path === '/') setActiveNav('Home');
    else if (path.includes('network')) setActiveNav('My Network');
    else if (path.includes('jobs')) setActiveNav('Jobs');
    else if (path.includes('messages')) setActiveNav('Messages');
    else if (path.includes('notifications')) setActiveNav('Notifications');
    else if (path.includes('profile')) setActiveNav('Profile');
    else if (path.includes('ai-resume')) setActiveNav('AI Resume');
    else if (path.includes('ai-job-match')) setActiveNav('AI Job Match');
    else if (path.includes('ai-coach')) setActiveNav('AI Coach');
    else if (path.includes('business')) setActiveNav('Business');
    else if (path.includes('premium')) setActiveNav('Premium');
  }, [location]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSearch(false);
  }, [location]);

  if (loading) {
    return <Loader />;
  }

  const handleProfileClick = () => {
    if (user) {
      navigate('/profile');
      setActiveNav('Profile');
    } else {
      Swal.fire({
        title: 'Login Required',
        text: 'You need to login first',
        icon: 'warning',
        showCancelButton: false,
        confirmButtonText: 'Login',
        confirmButtonColor: '#dc2626',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/auth/signin');
        }
      });
    }
  };

  const handleNavClick = (navItem) => {
    setActiveNav(navItem);
    setIsMobileMenuOpen(false);

    switch (navItem) {
      case 'Home':
        navigate('/');
        break;
      case 'My Network':
      case 'Network':
        navigate('/network');
        break;
      case 'Jobs':
        navigate('/jobs');
        break;
      case 'Messages':
        navigate('/messages');
        break;
      case 'Notifications':
        navigate('/notifications');
        break;
      case 'Business':
        navigate('/business');
        break;
      case 'Premium':
        navigate('/premium');
        break;
      case 'AI Resume':
        navigate('/ai-resume');
        break;
      case 'AI Job Match':
        navigate('/ai-job-match');
        break;
      case 'AI Coach':
        navigate('/ai-coach');
        break;
      default:
        break;
    }
  };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      // Implement search functionality
      console.log('Searching for:', searchValue);
      setShowSearch(false);
    }
  };

  // Main navigation items
  const mainNavItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'My Network', icon: Users, path: '/network' },
    { label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { label: 'Messages', icon: MessageCircle, path: '/messages', notification: true },
    { label: 'Notifications', icon: Bell, path: '/notifications', notification: true },
  ];

  // AI features navigation
  const aiNavItems = [
    { label: 'AI Resume', icon: FileText, path: '/ai-resume', premium: true },
    { label: 'AI Job Match', icon: Target, path: '/ai-job-match', premium: true },
    { label: 'AI Coach', icon: Bot, path: '/ai-coach', premium: true },
  ];

  // Additional menu items for mobile sidebar
  const additionalMenuItems = [
    { label: 'Business', icon: Building, path: '/business' },
    { label: 'Premium', icon: Crown, path: '/premium', premium: true },
  ];

  // Mobile bottom navigation - All items except Notifications
  const mobileBottomNavItems = [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Network', icon: Users, path: '/network' },
    { label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { label: 'Messages', icon: MessageCircle, path: '/messages', notification: true },
  ];

  return (
    <>
      {/* Desktop & Tablet Navbar - Double Row Layout */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className={`hidden lg:block w-full transition-all duration-300 bg-white shadow-lg border-b border-gray-200/50 sticky top-0 z-50`}
      >
        {/* First Row - Logo, Search & Main Actions */}
        <motion.div variants={itemVariants} className="border-b border-gray-100">
          <div className="mx-auto w-11/12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Left Section - Logo */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-8 flex-shrink-0"
              >
                <div
                  className="flex items-center space-x-3 cursor-pointer group"
                  onClick={() => handleNavClick('Home')}
                >
                  <Logo />
                  <h1 className="font-bold text-2xl text-gray-900 tracking-tight group-hover:text-blue-600 transition-colors duration-200">
                    Career Crafter
                  </h1>
                </div>
              </motion.div>

              {/* Search Bar */}
              <motion.div 
                variants={itemVariants}
                className="flex-1 max-w-2xl mx-8"
              >
                <div className="relative">
                  <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <motion.input
                    whileFocus={{ scale: 1.02 }}
                    type="text"
                    placeholder="Search for jobs, people, or companies..."
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm hover:bg-gray-100"
                    onKeyPress={handleSearch}
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </div>
              </motion.div>

              {/* Right Section - Actions */}
              <motion.div variants={itemVariants} className="flex items-center space-x-4 flex-shrink-0">
                {/* Business & Premium */}
                <div className="flex items-center space-x-3">
                  <NavItem
                    label="Business"
                    icon={Building}
                    active={activeNav === 'Business'}
                    onClick={() => handleNavClick('Business')}
                  />

                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 cursor-pointer group p-2 rounded-lg hover:bg-amber-50 transition-colors duration-200"
                    onClick={() => handleNavClick('Premium')}
                  >
                    <div className="relative">
                      <Crown className="w-5 h-5 text-amber-500 group-hover:text-amber-600 transition-colors duration-200" />
                      <motion.div 
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full"
                      ></motion.div>
                    </div>
                    <span className={`text-sm font-semibold transition-colors duration-200 ${activeNav === 'Premium' ? 'text-amber-700' : 'text-amber-600 group-hover:text-amber-700'
                      }`}>
                      Premium
                    </span>
                  </motion.div>
                </div>

                {/* Profile */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50 transition-colors duration-200"
                  onClick={handleProfileClick}
                >
                  <div className="relative">
                    {user ? (
                      <motion.img
                        whileHover={{ rotate: 5 }}
                        src={user.profilePicture || avatar}
                        alt={user.name}
                        className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-200"
                      />
                    ) : (
                      <motion.div 
                        whileHover={{ rotate: 5 }}
                        className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center border-2 border-transparent group-hover:border-blue-500 transition-all duration-200"
                      >
                        <User className="w-5 h-5 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                      </motion.div>
                    )}
                  </div>
                  <span className={`text-sm font-medium transition-colors duration-200 ${activeNav === 'Profile'
                      ? 'text-blue-600'
                      : 'text-gray-700 group-hover:text-blue-600'
                    }`}>
                    Profile
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Second Row - Navigation & AI Features */}
        <motion.div variants={itemVariants} className="bg-white">
          <div className="w-11/12 mx-auto pb-5 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              {/* Main Navigation */}
              <motion.div 
                className="flex items-center space-x-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                {mainNavItems.map((item) => (
                  <NavItem
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    active={activeNav === item.label}
                    onClick={() => handleNavClick(item.label)}
                    hasNotification={item.notification}
                  />
                ))}
              </motion.div>

              {/* AI Features Navigation */}
              <motion.div 
                className="flex items-center space-x-1"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center space-x-2 mr-4 px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200"
                >
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                  >
                    <Sparkles className="w-4 h-4 text-purple-600" />
                  </motion.div>
                  <span className="text-sm font-semibold text-purple-700">AI Tools</span>
                </motion.div>
                {aiNavItems.map((item) => (
                  <NavItem
                    key={item.label}
                    label={item.label}
                    icon={item.icon}
                    active={activeNav === item.label}
                    onClick={() => handleNavClick(item.label)}
                    premium={item.premium}
                  />
                ))}
              </motion.div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Top Bar */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`lg:hidden w-full transition-all duration-300 bg-white shadow-lg border-b border-gray-200/50 sticky top-0 z-50`}
      >
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left: Menu Button & Logo */}
            <div className="flex items-center space-x-3 flex-1">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 flex-shrink-0"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6 text-gray-700" />
                ) : (
                  <Menu className="w-6 h-6 text-gray-700" />
                )}
              </motion.button>

              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-2 cursor-pointer flex-shrink-0"
                onClick={() => handleNavClick('Home')}
              >
                <Logo />
                <h1 className="font-bold text-lg text-gray-900">Career Crafter</h1>
              </motion.div>
            </div>

            {/* Right: Search & Notifications */}
            <div className="flex items-center space-x-3">
              {/* Search Toggle */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowSearch(!showSearch)}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              >
                <Search className="w-5 h-5 text-gray-700" />
              </motion.button>

              {/* Notifications */}
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="relative p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                onClick={() => handleNavClick('Notifications')}
              >
                <Bell className="w-5 h-5 text-gray-700" />
                <motion.div 
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
                ></motion.div>
              </motion.button>
            </div>
          </div>

          {/* Mobile Search Bar - Toggle */}
          <AnimatePresence>
            {showSearch && (
              <motion.div
                initial="collapsed"
                animate="expanded"
                exit="collapsed"
                variants={searchVariants}
                className="mt-3 relative overflow-hidden"
              >
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search jobs, people, companies..."
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
                  autoFocus
                  onKeyPress={handleSearch}
                  value={searchValue}
                  onChange={(e) => setSearchValue(e.target.value)}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Mobile Side Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                variants={overlayVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed inset-0 z-50 bg-black bg-opacity-50"
                onClick={() => setIsMobileMenuOpen(false)}
              />
              <motion.div
                variants={mobileMenuVariants}
                initial="closed"
                animate="open"
                exit="closed"
                className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6 border-b border-gray-200">
                  <div className="flex items-center space-x-3">
                    <Logo />
                    <h1 className="font-bold text-xl text-gray-900">Career Crafter</h1>
                  </div>
                </div>

                <motion.div 
                  className="p-4 space-y-2 max-h-[calc(100vh-100px)] overflow-y-auto"
                  variants={containerVariants}
                  initial="hidden"
                  animate="visible"
                >
                  {/* User Profile Section */}
                  <motion.div
                    variants={itemVariants}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer hover:bg-blue-50 transition-colors duration-200 border border-gray-100"
                    onClick={handleProfileClick}
                  >
                    <div className="relative">
                      {user ? (
                        <motion.img
                          whileHover={{ rotate: 5 }}
                          src={user.profilePicture || avatar}
                          alt={user.name}
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-500"
                        />
                      ) : (
                        <motion.div 
                          whileHover={{ rotate: 5 }}
                          className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center border-2 border-blue-500"
                        >
                          <User className="w-6 h-6 text-gray-600" />
                        </motion.div>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {user ? user.name : 'Guest User'}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {user ? 'View your profile' : 'Login to your account'}
                      </p>
                    </div>
                  </motion.div>

                  {/* AI Features Section */}
                  <motion.div variants={itemVariants} className="pt-4 pb-2">
                    <div className="flex items-center space-x-2 px-4 mb-3">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Sparkles className="w-5 h-5 text-purple-600" />
                      </motion.div>
                      <span className="font-semibold text-purple-700">AI Career Tools</span>
                    </div>
                    {aiNavItems.map((item, index) => (
                      <MobileNavItem
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        active={activeNav === item.label}
                        onClick={() => handleNavClick(item.label)}
                        premium={item.premium}
                        index={index}
                      />
                    ))}
                  </motion.div>

                  {/* Additional Menu Items */}
                  <motion.div variants={itemVariants} className="pt-4 pb-2">
                    <div className="px-4 mb-3">
                      <span className="font-semibold text-gray-700">More</span>
                    </div>
                    {additionalMenuItems.map((item, index) => (
                      <MobileNavItem
                        key={item.label}
                        label={item.label}
                        icon={item.icon}
                        active={activeNav === item.label}
                        onClick={() => handleNavClick(item.label)}
                        premium={item.premium}
                        index={index + aiNavItems.length}
                      />
                    ))}
                  </motion.div>
                </motion.div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Mobile Bottom Navigation - All items except Notifications */}
      <motion.nav 
        initial={{ y: 100 }}
        animate={{ y: 0 }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-40 shadow-2xl backdrop-blur-sm"
      >
        <div className="flex items-center justify-around px-2 py-2">
          {mobileBottomNavItems.map((item, index) => (
            <MobileBottomNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.label}
              onClick={() => handleNavClick(item.label)}
              hasNotification={item.notification}
              index={index}
            />
          ))}
        </div>
      </motion.nav>
    </>
  );
};

// Desktop Navigation Item Component
const NavItem = ({ label, icon: Icon, active = false, onClick, hasNotification = false, premium = false }) => (
  <motion.div
    whileHover={{ scale: 1.05, y: -2 }}
    whileTap={{ scale: 0.95 }}
    className={`flex flex-col items-center cursor-pointer group relative p-3 rounded-xl transition-all duration-200 min-w-20 ${active
        ? premium
          ? 'text-amber-600 bg-amber-50'
          : 'text-blue-600 bg-blue-50'
        : premium
          ? 'text-amber-600 hover:text-amber-700 hover:bg-amber-50'
          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
      }`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="w-5 h-5" />
      {hasNotification && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
        ></motion.div>
      )}
      {premium && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"
        ></motion.div>
      )}
    </div>
    <span className="font-medium text-xs mt-1">{label}</span>
    {active && (
      <motion.div 
        layoutId="activeNavIndicator"
        className={`absolute -bottom-1 left-3 right-3 h-0.5 rounded-full ${premium ? 'bg-amber-600' : 'bg-blue-600'
          }`}
      ></motion.div>
    )}
  </motion.div>
);

// Mobile Menu Item Component
const MobileNavItem = ({ label, icon: Icon, active = false, onClick, hasNotification = false, premium = false, index = 0 }) => (
  <motion.div
    variants={{
      hidden: { x: -50, opacity: 0 },
      visible: {
        x: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 24,
          delay: index * 0.1
        }
      }
    }}
    whileHover={{ scale: 1.02, x: 5 }}
    whileTap={{ scale: 0.98 }}
    className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer transition-all duration-200 ${active
        ? premium
          ? 'text-amber-600 bg-amber-50 border border-amber-100'
          : 'text-blue-600 bg-blue-50 border border-blue-100'
        : premium
          ? 'text-amber-600 hover:bg-amber-50 border border-amber-100'
          : 'text-gray-700 hover:bg-gray-50 border border-transparent'
      }`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="w-6 h-6" />
      {hasNotification && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-white"
        ></motion.div>
      )}
      {premium && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-3 h-3 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full border-2 border-white"
        ></motion.div>
      )}
    </div>
    <span className={`font-medium text-lg ${premium ? 'font-semibold' : ''}`}>
      {label}
    </span>
    {active && (
      <motion.div 
        layoutId="mobileActiveIndicator"
        className={`ml-auto w-2 h-2 rounded-full ${premium ? 'bg-amber-600' : 'bg-blue-600'
          }`}
      ></motion.div>
    )}
  </motion.div>
);

// Mobile Bottom Navigation Item Component
const MobileBottomNavItem = ({ icon: Icon, label, active = false, onClick, hasNotification = false, index = 0 }) => (
  <motion.button
    variants={{
      hidden: { y: 50, opacity: 0 },
      visible: {
        y: 0,
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 24,
          delay: index * 0.1
        }
      }
    }}
    whileHover={{ scale: 1.1, y: -2 }}
    whileTap={{ scale: 0.9 }}
    className={`flex flex-col items-center cursor-pointer group p-2 rounded-xl transition-all duration-200 flex-1 max-w-20 ${active
        ? 'text-blue-600 bg-blue-50'
        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
      }`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="w-5 h-5" />
      {hasNotification && (
        <motion.div 
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"
        ></motion.div>
      )}
    </div>
    <span className="text-xs font-medium mt-1">{label}</span>
    {active && (
      <motion.div 
        layoutId="bottomNavIndicator"
        className="absolute -bottom-1 left-3 right-3 h-0.5 bg-blue-600 rounded-full"
      ></motion.div>
    )}
  </motion.button>
);

export default Navbar;