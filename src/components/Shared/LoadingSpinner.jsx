import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700">
      <div className={`${sizeClasses[size]} border-4 border-white border-t-transparent rounded-full animate-spin`}></div>
      {message && (
        <p className="mt-4 text-white text-lg font-medium animate-pulse">{message}</p>
      )}
    </div>
  );
};

export default LoadingSpinner;