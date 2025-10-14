import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Users, 
  Briefcase, 
  FileText, 
  Settings, 
  X,
  TrendingUp,
  MessageSquare,
  ChevronDown,
  ChevronRight,
  Globe,
  Users2,
  AmpersandIcon,
  MessagesSquareIcon
} from 'lucide-react';
import { Link } from 'react-router';
import useAuth from '../../../hooks/UseAuth/useAuth';

const Sidebar = ({ isOpen, toggleSidebar, activeRoute, setActiveRoute }) => {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const {user} = useAuth();

  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'users', label: 'Users', icon: Users, hasSubmenu: true, submenu: [
      { id: "all-users", label: "All Users", icon: Users2},
      { id: "admins", label: "Admins", icon: AmpersandIcon},
    ] },
    { id: 'jobs', label: 'Jobs', icon: Briefcase },
    { id: 'applications', label: 'Applications', icon: FileText },
    { id: 'messages', label: 'Messages', icon: MessageSquare, hasSubmenu: true, submenu: [
      { id: "messages", label: "All Messages", icon: MessagesSquareIcon,}
    ] },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      hasSubmenu: true,
      submenu: [
        { id: 'site-settings', label: 'Site Settings', icon: Globe }
      ]
    },
  ];

  const handleMenuClick = (item) => {
    if (item.hasSubmenu) {
      setSettingsOpen(!settingsOpen);
    } else {
      setActiveRoute(item.id);
      if (window.innerWidth < 1024) toggleSidebar();
    }
  };

  const handleSubmenuClick = (submenuId) => {
    setActiveRoute(submenuId);
    if (window.innerWidth < 1024) toggleSidebar();
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`
          fixed top-0 left-0 h-full bg-gradient-to-b from-slate-900 to-slate-800 
          text-white z-50 transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
          lg:translate-x-0 lg:static w-64 shadow-2xl
        `}
      >
        {/* Logo & Close Button */}
        <div className="flex items-center justify-between p-6 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Briefcase className="w-6 h-6" />
            </div>
            <Link to={"/"} className="font-bold text-xl">Career Crafter</Link>
          </div>
          <button 
            onClick={toggleSidebar}
            className="lg:hidden text-slate-400 hover:text-white"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Menu Items */}
        <nav className="p-4 space-y-2 overflow-y-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeRoute === item.id;
            
            return (
              <div key={item.id}>
                <button
                  onClick={() => handleMenuClick(item)}
                  className={`
                    w-full flex items-center gap-3 px-4 py-3 rounded-lg
                    transition-all duration-200 group
                    ${isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 shadow-lg' 
                      : 'hover:bg-slate-700/50'
                    }
                  `}
                >
                  <Icon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                  <span className={`flex-1 text-left font-medium ${isActive ? 'text-white' : 'text-slate-300'}`}>
                    {item.label}
                  </span>
                  {item.hasSubmenu && (
                    settingsOpen ? 
                      <ChevronDown className="w-4 h-4 text-slate-400" /> : 
                      <ChevronRight className="w-4 h-4 text-slate-400" />
                  )}
                </button>

                {/* Submenu */}
                {item.hasSubmenu && settingsOpen && (
                  <div className="ml-4 mt-1 space-y-1">
                    {item.submenu.map((subItem) => {
                      const SubIcon = subItem.icon;
                      const isSubActive = activeRoute === subItem.id;
                      
                      return (
                        <button
                          key={subItem.id}
                          onClick={() => handleSubmenuClick(subItem.id)}
                          className={`
                            w-full flex items-center gap-3 px-4 py-2 rounded-lg
                            transition-all duration-200 group
                            ${isSubActive 
                              ? 'bg-gradient-to-r from-blue-500 to-purple-500 shadow-md' 
                              : 'hover:bg-slate-700/30'
                            }
                          `}
                        >
                          <SubIcon className={`w-4 h-4 ${isSubActive ? 'text-white' : 'text-slate-400 group-hover:text-white'}`} />
                          <span className={`text-sm font-medium ${isSubActive ? 'text-white' : 'text-slate-300'}`}>
                            {subItem.label}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-slate-700">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center font-bold">
              A
            </div>
            <div>
              <p className="font-medium text-sm">{user?.displayName || 'Career Crafter'}</p>
              <p className="text-xs text-slate-400">{user?.email || 'admin@careercrafter.com'}</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;