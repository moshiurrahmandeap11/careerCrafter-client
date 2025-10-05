import React, { useState, useEffect } from 'react';
import { Menu, Bell } from 'lucide-react';
import Sidebar from '../Sidebar/Sidebar';
import MainContent from '../MainContent/MainContent';


const AdminDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [activeRoute, setActiveRoute] = useState(() => {
    return window.dashboardRoute || 'dashboard';
  });

  useEffect(() => {
    window.dashboardRoute = activeRoute;
  }, [activeRoute]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
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
              className="lg:hidden text-slate-600 hover:text-slate-900"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-xl font-semibold text-slate-800">Admin Panel</h2>
          </div>
          
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold text-white cursor-pointer">
              A
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