import React from 'react';
import { NavLink, useLocation } from 'react-router';
import {
    Users,
    Clock,
    Sparkles,
    UserCheck,
    X,
    UsersRound
} from 'lucide-react';
import { useSelector } from 'react-redux';

const NetworkSidebar = ({ onClose }) => {
    const location = useLocation();
    const { suggestedUsers, users, pendingRequests, connections } = useSelector((state) => state.network);

    const navItems = [
        {
            path: '/network',
            icon: UserCheck,
            label: 'My Connections',
            description: 'Manage your network',
            count: connections.length,
            end: true
        },
        {
            path: '/network/pending-connection',
            icon: Clock,
            label: 'Pending Invitations',
            description: 'Review requests',
            count: pendingRequests.length
        },
        {
            path: '/network/suggestion-connection',
            icon: Sparkles,
            label: 'Suggestions',
            description: 'People you may know',
            count: suggestedUsers.length
        },
        {
            path: '/network/all-user',
            icon: UsersRound,
            label: 'All Users',
            description: 'Browse all users',
            count: users.length
        }
    ];

    return (
        <div className="h-full flex flex-col">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <div>
                    <h1 className="text-xl font-bold text-gray-900">My Network</h1>
                    <p className="text-sm text-gray-600">Grow your connections</p>
                </div>
                {onClose && (
                    <button
                        onClick={onClose}
                        className="lg:hidden p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <X className="w-5 h-5" />
                    </button>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-2">
                <ul className="space-y-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = item.end
                            ? location.pathname === item.path
                            : location.pathname.startsWith(item.path);

                        return (
                            <li key={item.path}>
                                <NavLink
                                    to={item.path}
                                    end={item.end}
                                    onClick={onClose}
                                    className={`
                    flex items-center justify-between p-3 rounded-xl transition-all duration-200
                    ${isActive
                                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                                            : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
                                        }
                  `}
                                >
                                    <div className="flex items-center gap-2">
                                        <div className={`
                      p-2 rounded-lg
                      ${isActive ? 'bg-blue-100' : 'bg-gray-100'}
                    `}>
                                            <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                                        </div>
                                        <div className="text-left">
                                            <div className="font-medium text-sm">{item.label}</div>
                                            <div className="text-xs text-gray-500">{item.description}</div>
                                        </div>
                                    </div>
                                    <span className={`
                    px-2 py-1 rounded-full text-xs font-semibold min-w-8 text-center
                    ${isActive
                                            ? 'bg-blue-100 text-blue-700'
                                            : 'bg-gray-200 text-gray-700'
                                        }
                  `}>
                                        {item.count}
                                    </span>
                                </NavLink>
                            </li>
                        );
                    })}
                    {/* Footer Stats */}
                    <div className="p-4 border-t border-gray-200">
                        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                            <div className="flex items-center space-x-3">
                                <Users className="w-8 h-8 text-blue-600" />
                                <div>
                                    <div className="font-semibold text-sm text-gray-900">Network Stats</div>
                                    <div className="text-xs text-gray-600">
                                        {connections.length} connections • {pendingRequests.length} pending
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </nav>
        </div>
    );
};

export default NetworkSidebar;