import React from 'react';

const EmptyState = ({ icon, title, description, action }) => {
  return (
    <div className="text-center py-16 bg-white rounded-xl border-2 border-dashed border-gray-300">
      <div className="flex justify-center mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500 max-w-md mx-auto mb-6">{description}</p>
      {action && <div>{action}</div>}
    </div>
  );
};

export default EmptyState;