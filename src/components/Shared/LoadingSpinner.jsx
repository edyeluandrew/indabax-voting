import React from 'react';

const LoadingSpinner = ({ size = 'md', message = 'Loading...' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen" style={{ backgroundColor: '#e0e5ec' }}>
      {/* Spinner Container with Neumorphism */}
      <div 
        className={`${sizeClasses[size]} rounded-full flex items-center justify-center animate-spin-slow`}
        style={{
          background: '#e0e5ec',
          boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff'
        }}
      >
        {/* Inner Spinning Circle */}
        <div 
          className="w-3/4 h-3/4 rounded-full"
          style={{
            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
            boxShadow: 'inset 3px 3px 6px #d97706, inset -3px -3px 6px #fcd34d'
          }}
        />
      </div>
      
      {/* Loading Message */}
      {message && (
        <div 
          className="mt-6 px-6 py-3 rounded-xl animate-pulse"
          style={{
            background: '#e0e5ec',
            boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
          }}
        >
          <p 
            className="text-lg font-bold"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            {message}
          </p>
        </div>
      )}

      <style jsx>{`
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        .animate-spin-slow {
          animation: spin-slow 2s linear infinite;
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;