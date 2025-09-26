import React from 'react';

const Loader = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50">
      <div className="relative flex items-center justify-center">
        {/* Spinner */}
        <div className="w-16 h-16 border-4 border-t-blue-600 border-gray-200 rounded-full animate-spin"></div>
        {/* CC Text */}
        <span className="absolute text-2xl font-bold text-gray-800 tracking-tight">
          CC
        </span>
      </div>
    </div>
  );
};

export default Loader;