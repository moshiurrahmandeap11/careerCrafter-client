import React, { useState, useEffect, useRef } from 'react';
import { Menu, User, LogOut, Settings } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';
import useAuth from '../../../hooks/UseAuth/useAuth';
import { useNavigate } from 'react-router';
import Swal from 'sweetalert2';

const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, userLogOut } = useAuth();
  const navigate = useNavigate();
  const dropdownRef = useRef(null);

  const [activeRoute, setActiveRoute] = useState(() => {
    return window.dashboardRoute || 'dashboard';
  });

  useEffect(() => {
    window.dashboardRoute = activeRoute;
  }, [activeRoute]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
  };

  const handleLogout = async () => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'You will be logged out from the admin panel',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc2626',
      cancelButtonColor: '#6b7280',
      confirmButtonText: 'Yes, logout!',
      cancelButtonText: 'Cancel'
    });

    if (result.isConfirmed) {
      try {
        await userLogOut();
        navigate('/');
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          confirmButtonText: 'OK'
        });
      } catch (error) {
        console.error('Logout error:', error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to logout. Please try again.',
          icon: 'error',
          confirmButtonText: 'OK'
        });
      }
    }
  };

  const getUserDisplayName = () => {
    return user?.displayName || user?.email?.split('@')[0] || 'Admin';
  };

  const getUserEmail = () => {
    return user?.email || 'admin@careercrafter.com';
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      <Sidebar 
        isOpen={isSidebarOpen} 
        toggleSidebar={toggleSidebar}
        activeRoute={activeRoute}
        setActiveRoute={setActiveRoute}
      />
      
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-slate-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={toggleSidebar}
              className="lg:hidden text-slate-600 hover:text-slate-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800">Admin Panel</h2>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Profile Dropdown */}
            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={toggleProfileDropdown}
                className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <div className="text-right hidden sm:block">
                  <div className="text-sm font-medium text-slate-800">
                    {getUserDisplayName()}
                  </div>
                  <div className="text-xs text-slate-500">
                    {getUserEmail()}
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-slate-200">
                  <img 
                    src="https://i.postimg.cc/ZR2VL7cY/Screenshot-2025-10-07-122734.png" 
                    alt="Admin Profile" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback if image fails to load
                      e.target.style.display = 'none';
                      e.target.nextSibling.style.display = 'flex';
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 hidden items-center justify-center font-bold text-white">
                    <User className="w-5 h-5" />
                  </div>
                </div>
              </button>

              {/* Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-white rounded-xl shadow-lg border border-slate-200 py-2 z-50">
                  {/* Profile Info */}
                  <div className="px-4 py-3 border-b border-slate-100">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-slate-200">
                        <img 
                          src="https://i.postimg.cc/ZR2VL7cY/Screenshot-2025-10-07-122734.png" 
                          alt="Admin Profile" 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-green-400 to-blue-500 hidden items-center justify-center font-bold text-white">
                          <User className="w-6 h-6" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-slate-900 truncate">
                          {getUserDisplayName()}
                        </div>
                        <div className="text-sm text-slate-600 truncate">
                          {getUserEmail()}
                        </div>
                        <div className="text-xs text-green-600 font-medium mt-1">
                          Administrator
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dropdown Items */}
                  <div className="py-1">
                    <button 
                      onClick={() => {
                        setActiveRoute('settings');
                        setIsProfileDropdownOpen(false);
                      }}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-slate-700 hover:bg-slate-50 transition-colors"
                    >
                      <Settings className="w-4 h-4" />
                      <span>Settings</span>
                    </button>
                    
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center space-x-3 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          <MainContent activeRoute={activeRoute} />
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;