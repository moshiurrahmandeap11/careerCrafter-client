import React, { useState } from 'react';
import { Outlet } from 'react-router';
import NetworkSidebar from '../../components/network-components/NetworkSidebar';
import NetworkMobileHeader from '../../components/network-components/NetworkMobileHeader';

const MyNetwork = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen md:w-11/12 mx-auto md:px-4 w-full">
      {/* Mobile Header with Tabs */}
      <NetworkMobileHeader onMenuClick={() => setMobileSidebarOpen(true)} />
      
      <div className="flex lg:pt-0"> {/* Increased padding for mobile to accommodate tabs */}
        {/* Sidebar - Hidden on mobile, visible on desktop */}
        <div className="hidden  lg:block lg:w-1/4 bg-white border-x border-gray-200">
          <NetworkSidebar />
        </div>
        
        {/* Main Content */}
        <div className="flex-1 min-h-screen">
          <div className="p-4 lg:p-6">
            <Outlet />
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {mobileSidebarOpen && (
        <div className="lg:hidden">
          <div 
            className="fixed inset-0 bg-black bg-opacity-50 z-40"
            onClick={() => setMobileSidebarOpen(false)}
          />
          <div className="fixed top-0 left-0 h-full w-64 bg-white z-50 transform transition-transform">
            <NetworkSidebar onClose={() => setMobileSidebarOpen(false)} />
          </div>
        </div>
      )}
    </div>
  );
};

export default MyNetwork;