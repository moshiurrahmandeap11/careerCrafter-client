import React from 'react';
import { Home, RefreshCw, AlertCircle, Search, WifiOff, Server } from 'lucide-react';
import { Link } from 'react-router';

const ErrorPage = ({ type = '404' }) => {
  const errorConfig = {
    '404': {
      icon: Search,
      title: 'Page not found',
      description: "The page you're looking for doesn't exist or has been moved.",
      color: 'blue'
    },
    '500': {
      icon: Server,
      title: 'Server error',
      description: 'Something went wrong on our end. Please try again later.',
      color: 'red'
    },
    'offline': {
      icon: WifiOff,
      title: 'No internet connection',
      description: 'Please check your internet connection and try again.',
      color: 'orange'
    },
    'generic': {
      icon: AlertCircle,
      title: 'Something went wrong',
      description: 'An unexpected error occurred. Please try again.',
      color: 'gray'
    }
  };

  const config = errorConfig[type] || errorConfig.generic;
  const IconComponent = config.icon;

  const colorClasses = {
    blue: 'bg-blue-100 text-blue-600',
    red: 'bg-red-100 text-red-600',
    orange: 'bg-orange-100 text-orange-600',
    gray: 'bg-gray-100 text-gray-600'
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="text-center max-w-md">
        {/* Icon */}
        <div className={`w-20 h-20 ${colorClasses[config.color]} rounded-full flex items-center justify-center mx-auto mb-6`}>
          <IconComponent className="w-10 h-10" />
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-900 mb-3">
          {config.title}
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-8">
          {config.description}
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {type !== 'offline' && (
            <button
              onClick={() => window.location.reload()}
              className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              <RefreshCw className="w-4 h-4" />
              Try Again
            </button>
          )}
          
          <Link
            to="/"
            className="flex items-center justify-center gap-2 border border-gray-300 text-gray-700 px-5 py-3 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <Home className="w-4 h-4" />
            Go Home
          </Link>
        </div>

        {/* Help Text */}
        <p className="text-sm text-gray-500 mt-6">
          Need help?{' '}
          <a href="/contact" className="text-blue-600 hover:underline">
            Contact support
          </a>
        </p>
      </div>
    </div>
  );
};

export default ErrorPage;