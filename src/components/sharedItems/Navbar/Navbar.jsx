import React from 'react';
import { Search, Home, Users, Briefcase, MessageCircle, Bell, User, Building, Crown } from 'lucide-react';
import Logo from '../Logo/Logo';
// import useAuth from '../../../hooks/UseAuth/useAuth';
import Loader from '../Loader/Loader';

const useAuth = () => {
  return {
    user: {
      name: 'John Doe',
      profilePicture: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80'
    },
    loading: false
  };
};

const Navbar = () => {
  const { user, loading } = useAuth();

  if(loading){
    return <Loader></Loader>
  }

  return (
    <>
      {/* Desktop/Tablet Navbar */}
      <nav className="hidden md:flex max-w-9/12 mx-auto items-center justify-between px-6 py-4 bg-white border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
        {/* Left Side - Logo & Search */}
        <div className="flex items-center space-x-6 flex-1 max-w-lg">
          <div className="flex-shrink-0 flex items-center gap-3">
            <Logo />
            <h1 className='font-bold text-2xl text-gray-800 tracking-tight'>Career Crafter</h1>
          </div>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search for jobs, people, or companies..."
              className="w-full pl-12 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
            />
          </div>
        </div>

        {/* Right Side - Navigation Items, Business & Premium */}
        <div className="flex items-center space-x-8 flex-1 justify-end">
          <NavItem label="Home" active />
          <NavItem label="My Network" />
          <NavItem label="Jobs" />
          <NavItem label="Messages" />
          <NavItem label="Notifications" />
          
          {/* Profile */}
          <div className="flex flex-col items-center space-y-1 cursor-pointer group transition-all duration-200">
            <div className="relative">
              {loading ? (
                <div className="w-7 h-7 bg-gray-300 rounded-full animate-pulse"></div>
              ) : user ? (
                <img
                  src={user.profilePicture}
                  alt={user.name}
                  className="w-7 h-7 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-200"
                />
              ) : (
                <User className="w-7 h-7 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              )}
            </div>
            <span className="text-xs text-gray-600 group-hover:text-blue-600 transition-colors duration-200 font-medium">
              Profile
            </span>
          </div>

          <div className="w-px h-8 bg-gray-200"></div>
          <NavItem label="Business" />
          <div className="flex flex-col items-center space-y-1 cursor-pointer group transition-all duration-200">
            <div className="relative">
              <Crown className="w-6 h-6 text-amber-500 group-hover:text-amber-600 transition-colors duration-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-pulse"></div>
            </div>
            <span className="text-xs text-amber-600 group-hover:text-amber-700 transition-colors duration-200 font-semibold">
              Premium
            </span>
          </div>
        </div>
      </nav>

      {/* Mobile Navbar */}
      <div className="md:hidden">
        {/* Top Bar */}
        <nav className="flex items-center justify-between px-4 py-3 bg-white shadow-md border-b border-gray-100 sticky top-0 z-50 backdrop-blur-sm">
          {/* Logo */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <Logo />
            <h1 className='font-bold text-lg text-gray-800'>CC</h1>
          </div>

          {/* Search Box */}
          <div className="relative flex-1 mx-4 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent focus:bg-white transition-all duration-200 text-sm"
            />
          </div>

          {/* Messages */}
          <div className="flex flex-col items-center cursor-pointer group flex-shrink-0">
            <div className="relative">
              <MessageCircle className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
              <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
            </div>
          </div>
        </nav>

        {/* Bottom Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-2 py-2 z-50 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-around">
            <MobileNavItem icon={Home} active />
            <MobileNavItem icon={Users} />
            <MobileNavItem icon={Briefcase} />
            <MobileNavItem icon={Bell} />
            
            {/* Mobile Profile */}
            <div className="flex flex-col items-center space-y-1 cursor-pointer group px-2 py-1 transition-all duration-200">
              <div className="relative">
                {loading ? (
                  <div className="w-6 h-6 bg-gray-300 rounded-full animate-pulse"></div>
                ) : user ? (
                  <img
                    src={user.profilePicture}
                    alt={user.name}
                    className="w-6 h-6 rounded-full object-cover border-2 border-transparent group-hover:border-blue-500 transition-all duration-200"
                  />
                ) : (
                  <User className="w-6 h-6 text-gray-600 group-hover:text-blue-600 transition-colors duration-200" />
                )}
              </div>
            </div>
          </div>
        </nav>

        {/* Spacer for bottom navigation */}
        <div className="h-20"></div>
      </div>
    </>
  );
};

// Desktop Navigation Item Component
const NavItem = ({ label, active = false }) => (
  <div className={`cursor-pointer group relative transition-all duration-200 hover:scale-105 ${
    active ? 'text-blue-600' : 'text-gray-600'
  }`}>
    <span className={`text-base transition-colors duration-200 font-medium ${
      active ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
    }`}>
      {label}
    </span>
    {active && (
      <div className="absolute -bottom-2 left-0 right-0 h-0.5 bg-blue-600 rounded-full"></div>
    )}
  </div>
);

// Mobile Navigation Item Component
const MobileNavItem = ({ icon: Icon, active = false }) => (
  <div className={`flex flex-col items-center cursor-pointer group px-3 py-2 rounded-lg transition-all duration-200 hover:bg-gray-50 ${
    active ? 'text-blue-600 bg-blue-50' : 'text-gray-600'
  }`}>
    <div className="relative">
      <Icon className={`w-6 h-6 transition-colors duration-200 ${
        active ? 'text-blue-600' : 'text-gray-600 group-hover:text-blue-600'
      }`} />
      {Icon === Bell && (
        <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
      )}
    </div>
  </div>
);

export default Navbar;