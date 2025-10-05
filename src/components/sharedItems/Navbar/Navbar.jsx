import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { Search, Home, Users, Briefcase, MessageCircle, Bell, User, Building, Crown, Menu, X, FileText, Sparkles, Target, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Loader from '../Loader/Loader';
import useAuth from '../../../hooks/UseAuth/useAuth';

import Swal from 'sweetalert2';
import axiosIntense from '../../../hooks/AxiosIntense/axiosIntense';

const Navbar = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeNav, setActiveNav] = useState('Home');
  const [showSearch, setShowSearch] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [logoData, setLogoData] = useState(null);
  const [logoLoading, setLogoLoading] = useState(true);

  const avatar = "https://i.postimg.cc/0y6myZrg/businessman-character-avatar-isolated-24877-60111.avif";

  // Fetch logo from API
  useEffect(() => {
    const fetchLogo = async () => {
      try {
        const response = await axiosIntense.get('/logo');
        setLogoData(response.data);
      } catch (error) {
        console.error('Failed to fetch logo:', error);
        // Use default if logo fetch fails
        setLogoData({ type: 'text', text: 'CC' });
      } finally {
        setLogoLoading(false);
      }
    };

    fetchLogo();
  }, []);

  // Logo Component based on type
  const LogoComponent = useCallback(() => {
    if (logoLoading) {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg animate-pulse" />
      );
    }

    if (!logoData) {
      return (
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
          <span className="text-white font-bold text-lg">CC</span>
        </div>
      );
    }

    switch (logoData.type) {
      case 'text':
        return (
          <div className="px-3 py-2 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg">
            <span className="text-white font-bold text-lg">{logoData.text}</span>
          </div>
        );
      
      case 'image':
        return (
          <img 
            src={logoData.imageUrl} 
            alt="Logo" 
            className="w-10 h-10 object-contain rounded-lg"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40"><rect fill="%234F46E5" width="40" height="40" rx="8"/><text x="20" y="26" font-size="16" fill="white" text-anchor="middle" font-weight="bold">CC</text></svg>';
            }}
          />
        );
      
      case 'image-text':
        return (
          <div className="flex items-center gap-2">
            <img 
              src={logoData.imageUrl} 
              alt="Logo" 
              className="w-10 h-10 object-contain rounded-lg"
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <span className="text-xl font-bold text-gray-900">{logoData.text}</span>
          </div>
        );
      
      default:
        return (
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">CC</span>
          </div>
        );
    }
  }, [logoData, logoLoading]);

  // Animation variants - memoized
  const containerVariants = useMemo(() => ({
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  }), []);

  const itemVariants = useMemo(() => ({
    hidden: { y: -20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 300, damping: 24 }
    }
  }), []);

  // Set active nav based on current route
  useEffect(() => {
    const path = location.pathname;
    const navMap = {
      '/': 'Home',
      '/network': 'My Network',
      '/jobs': 'Jobs',
      '/messages': 'Messages',
      '/notifications': 'Notifications',
      '/profile': 'Profile',
      '/ai-resume': 'AI Resume',
      '/ai-job-match': 'AI Job Match',
      '/ai-coach': 'AI Coach',
      '/business': 'Business',
      '/premium': 'Premium'
    };

    const matchedNav = Object.entries(navMap).find(([route]) => path.includes(route));
    if (matchedNav) {
      setActiveNav(matchedNav[1]);
    }
  }, [location.pathname]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setShowSearch(false);
  }, [location.pathname]);

  const handleProfileClick = useCallback(() => {
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
  }, [user, navigate]);

  const handleNavClick = useCallback((navItem) => {
    setActiveNav(navItem);
    setIsMobileMenuOpen(false);

    const routeMap = {
      'Home': '/',
      'My Network': '/network',
      'Network': '/network',
      'Jobs': '/jobs',
      'Messages': '/messages',
      'Notifications': '/notifications',
      'Business': '/business',
      'Premium': '/premium',
      'AI Resume': '/ai-resume',
      'AI Job Match': '/ai-job-match',
      'AI Coach': '/ai-coach'
    };

    const route = routeMap[navItem];
    if (route) {
      navigate(route);
    }
  }, [navigate]);

  const handleSearch = useCallback((e) => {
    if (e.key === 'Enter' && searchValue.trim()) {
      console.log('Searching for:', searchValue);
      navigate(`/search?q=${encodeURIComponent(searchValue)}`);
      setShowSearch(false);
    }
  }, [searchValue, navigate]);

  // Main navigation items - memoized
  const mainNavItems = useMemo(() => [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'My Network', icon: Users, path: '/network' },
    { label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { label: 'Messages', icon: MessageCircle, path: '/messages', notification: true },
    { label: 'Notifications', icon: Bell, path: '/notifications', notification: true },
  ], []);

  const aiNavItems = useMemo(() => [
    { label: 'AI Resume', icon: FileText, path: '/ai-resume', premium: true },
    { label: 'AI Job Match', icon: Target, path: '/ai-job-match', premium: true },
    { label: 'AI Coach', icon: Bot, path: '/ai-coach', premium: true },
  ], []);

  const additionalMenuItems = useMemo(() => [
    { label: 'Business', icon: Building, path: '/business' },
    { label: 'Premium', icon: Crown, path: '/premium', premium: true },
  ], []);

  const mobileBottomNavItems = useMemo(() => [
    { label: 'Home', icon: Home, path: '/' },
    { label: 'Network', icon: Users, path: '/network' },
    { label: 'Jobs', icon: Briefcase, path: '/jobs' },
    { label: 'Messages', icon: MessageCircle, path: '/messages', notification: true },
  ], []);

  if (loading) {
    return <Loader />;
  }

  return (
    <>
      {/* Desktop & Tablet Navbar */}
      <motion.nav 
        initial="hidden"
        animate="visible"
        variants={containerVariants}
        className="hidden lg:block w-full transition-all duration-300 bg-white shadow-lg border-b border-gray-200/50 sticky top-0 z-50"
      >
        {/* First Row */}
        <motion.div variants={itemVariants} className="border-b border-gray-100">
          <div className="mx-auto w-11/12 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-16">
              {/* Logo */}
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex items-center space-x-3 cursor-pointer group"
                onClick={() => handleNavClick('Home')}
              >
                <LogoComponent />

              </motion.div>

              {/* Search Bar */}
              <motion.div variants={itemVariants} className="flex-1 max-w-2xl mx-8">
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

              {/* Actions */}
              <motion.div variants={itemVariants} className="flex items-center space-x-4">
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
                    <Crown className="w-5 h-5 text-amber-500 group-hover:text-amber-600" />
                    <span className={`text-sm font-semibold ${activeNav === 'Premium' ? 'text-amber-700' : 'text-amber-600'}`}>
                      Premium
                    </span>
                  </motion.div>
                </div>

                {/* Profile */}
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-blue-50"
                  onClick={handleProfileClick}
                >
                  {user ? (
                    <img
                      src={user.profilePicture || avatar}
                      alt={user.name || 'User'}
                      className="w-8 h-8 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                  <span className={`text-sm font-medium ${activeNav === 'Profile' ? 'text-blue-600' : 'text-gray-700'}`}>
                    Profile
                  </span>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </motion.div>

        {/* Second Row - Navigation */}
        <motion.div variants={itemVariants} className="bg-white">
          <div className="w-11/12 mx-auto pb-5 px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-12">
              <div className="flex items-center space-x-1">
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
              </div>

              <div className="flex items-center space-x-1">
                <div className="flex items-center space-x-2 mr-4 px-3 py-1 bg-gradient-to-r from-purple-50 to-blue-50 rounded-full border border-purple-200">
                  <Sparkles className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-semibold text-purple-700">AI Tools</span>
                </div>
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
              </div>
            </div>
          </div>
        </motion.div>
      </motion.nav>

      {/* Mobile Top Bar */}
      <nav className="lg:hidden w-full bg-white shadow-lg border-b border-gray-200 sticky top-0 z-50">
        <div className="px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 flex-1">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>

              <div className="flex items-center space-x-2 cursor-pointer" onClick={() => handleNavClick('Home')}>
                <LogoComponent />
                <h1 className="font-bold text-lg text-gray-900">Career Crafter</h1>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <button onClick={() => setShowSearch(!showSearch)} className="p-2 rounded-lg hover:bg-gray-100">
                <Search className="w-5 h-5" />
              </button>

              <button className="relative p-2 rounded-lg hover:bg-gray-100" onClick={() => handleNavClick('Notifications')}>
                <Bell className="w-5 h-5" />
                <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />
              </button>
            </div>
          </div>

          {showSearch && (
            <div className="mt-3">
              <input
                type="text"
                placeholder="Search..."
                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                autoFocus
                onKeyPress={handleSearch}
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
              />
            </div>
          )}
        </div>

        {/* Mobile Sidebar */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={() => setIsMobileMenuOpen(false)} />
              <div className="fixed left-0 top-0 bottom-0 w-80 bg-white shadow-xl z-50">
                <div className="p-6 border-b">
                  <div className="flex items-center space-x-3">
                    <LogoComponent />
                    <h1 className="font-bold text-xl">Career Crafter</h1>
                  </div>
                </div>

                <div className="p-4 space-y-2 overflow-y-auto max-h-[calc(100vh-100px)]">
                  {/* Profile Section */}
                  <div className="flex items-center space-x-3 p-4 rounded-lg cursor-pointer hover:bg-blue-50 border" onClick={handleProfileClick}>
                    {user ? (
                      <img src={user.profilePicture || avatar} alt={user.name} className="w-12 h-12 rounded-full object-cover" />
                    ) : (
                      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
                        <User className="w-6 h-6" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold">{user ? user.name : 'Guest User'}</h3>
                      <p className="text-sm text-gray-600">{user ? 'View profile' : 'Login'}</p>
                    </div>
                  </div>

                  {/* AI Tools */}
                  <div className="pt-4">
                    <div className="flex items-center space-x-2 px-4 mb-3">
                      <Sparkles className="w-5 h-5 text-purple-600" />
                      <span className="font-semibold text-purple-700">AI Tools</span>
                    </div>
                    {aiNavItems.map((item) => (
                      <MobileNavItem key={item.label} {...item} active={activeNav === item.label} onClick={() => handleNavClick(item.label)} />
                    ))}
                  </div>

                  {/* More */}
                  <div className="pt-4">
                    <div className="px-4 mb-3">
                      <span className="font-semibold text-gray-700">More</span>
                    </div>
                    {additionalMenuItems.map((item) => (
                      <MobileNavItem key={item.label} {...item} active={activeNav === item.label} onClick={() => handleNavClick(item.label)} />
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}
        </AnimatePresence>
      </nav>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t z-40 shadow-2xl">
        <div className="flex items-center justify-around px-2 py-2">
          {mobileBottomNavItems.map((item) => (
            <MobileBottomNavItem
              key={item.label}
              icon={item.icon}
              label={item.label}
              active={activeNav === item.label}
              onClick={() => handleNavClick(item.label)}
              hasNotification={item.notification}
            />
          ))}
        </div>
      </nav>
    </>
  );
};

// NavItem Component
const NavItem = ({ label, icon: Icon, active, onClick, hasNotification, premium }) => (
  <div
    className={`flex flex-col items-center cursor-pointer p-3 rounded-xl min-w-20 ${
      active ? (premium ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50') : 
      (premium ? 'text-amber-600 hover:bg-amber-50' : 'text-gray-600 hover:bg-gray-50')
    }`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="w-5 h-5" />
      {hasNotification && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
    </div>
    <span className="text-xs mt-1 font-medium">{label}</span>
  </div>
);

// Mobile Nav Items
const MobileNavItem = ({ label, icon: Icon, active, onClick, premium }) => (
  <div
    className={`flex items-center space-x-4 p-4 rounded-xl cursor-pointer ${
      active ? (premium ? 'text-amber-600 bg-amber-50' : 'text-blue-600 bg-blue-50') :
      (premium ? 'text-amber-600 hover:bg-amber-50' : 'hover:bg-gray-50')
    }`}
    onClick={onClick}
  >
    <Icon className="w-6 h-6" />
    <span className="font-medium">{label}</span>
  </div>
);

const MobileBottomNavItem = ({ icon: Icon, label, active, onClick, hasNotification }) => (
  <button
    className={`flex flex-col items-center p-2 rounded-xl flex-1 ${active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}
    onClick={onClick}
  >
    <div className="relative">
      <Icon className="w-5 h-5" />
      {hasNotification && <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full" />}
    </div>
    <span className="text-xs mt-1">{label}</span>
  </button>
);

export default Navbar;