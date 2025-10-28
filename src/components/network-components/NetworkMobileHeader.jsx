import React from 'react';
import { Menu, Users, Clock, Sparkles, UserCheck, UsersRound } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router';

const NetworkMobileHeader = ({ onMenuClick }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { pendingRequests, suggestedUsers, users, connections } = useSelector((state) => state.network);

  const tabs = [
    {
      id: 'connections',
      path: '/network',
      icon: UserCheck,
      label: 'Connections',
      count: connections.length,
      exact: true
    },
    {
      id: 'pending',
      path: '/network/pending-connection',
      icon: Clock,
      label: 'Pending',
      count: pendingRequests.length
    },
    {
      id: 'suggestions',
      path: '/network/suggestion-connection',
      icon: Sparkles,
      label: 'Suggestions',
      count: suggestedUsers.length
    },
    {
      id: 'all-users',
      path: '/network/all-user',
      icon: UsersRound,
      label: 'All Users',
      count: users.length
    }
  ];

  const getActiveTab = () => {
    return tabs.find(tab => 
      tab.exact 
        ? location.pathname === tab.path
        : location.pathname.startsWith(tab.path)
    ) || tabs[0];
  };

  const activeTab = getActiveTab();

  const handleTabClick = (tab) => {
    navigate(tab.path);
  };

  return (
    <div className="lg:hidden bg-white border-b border-gray-200 z-30 shadow-sm">
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 border-b border-gray-100">
        <div className="flex items-center space-x-2">
          <Users className="w-6 h-6 text-blue-600" />
          <h1 className="text-xl font-bold text-gray-900">Network</h1>
        </div>
        
        <div className="w-10">
          {connections.length > 0 && (
            <div className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-semibold">
              {connections.length}
            </div>
          )}
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center justify-between px-4 py-2 bg-gray-50">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = tab.exact 
            ? location.pathname === tab.path
            : location.pathname.startsWith(tab.path);

          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab)}
              className={`
                flex flex-col items-center justify-center p-2 rounded-lg transition-all duration-200 relative
                ${isActive 
                  ? 'bg-white text-blue-600 shadow-sm' 
                  : 'text-gray-600 hover:text-gray-900 hover:bg-white'
                }
              `}
            >
              {/* Icon with badge */}
              <div className="relative">
                <Icon className="w-5 h-5" />
                {tab.count > 0 && (
                  <span className={`
                    absolute -top-2 -right-2 text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold
                    ${isActive 
                      ? 'bg-blue-500 text-white' 
                      : 'bg-red-500 text-white'
                    }
                  `}>
                    {tab.count > 9 ? '9+' : tab.count}
                  </span>
                )}
              </div>
              
              {/* Label */}
              <span className="text-xs font-medium mt-1">{tab.label}</span>
              
              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default NetworkMobileHeader;