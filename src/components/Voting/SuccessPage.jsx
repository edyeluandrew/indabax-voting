import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Shared/Navbar';

const SuccessPage = () => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen flex items-center justify-center p-4 animate-fade-in" style={{ backgroundColor: '#e0e5ec' }}>
        <div 
          className="p-8 md:p-12 max-w-2xl w-full rounded-3xl text-center animate-slide-up"
          style={{
            background: '#e0e5ec',
            boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff'
          }}
        >
          {/* Success Icon */}
          <div 
            className="w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow"
            style={{
              background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
              boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
            }}
          >
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 
            className="text-4xl md:text-5xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Vote Submitted!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Thank you for participating in the IndabaX Club elections.
          </p>

          {/* Vote Details */}
          <div 
            className="p-6 rounded-xl mb-8"
            style={{
              background: '#e0e5ec',
              boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
            }}
          >
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Voter Email:</span>
                <span className="text-amber-600 font-bold text-sm">{currentUser?.email}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Status:</span>
                <span 
                  className="px-3 py-1 rounded-full text-sm font-bold"
                  style={{
                    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                    color: 'white',
                    boxShadow: '2px 2px 4px #b8bec5, -2px -2px 4px #ffffff'
                  }}
                >
                  ✓ RECORDED
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Timestamp:</span>
                <span className="text-gray-600 font-mono text-sm">
                  {new Date().toLocaleString()}
                </span>
              </div>
            </div>
          </div>

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-4 mb-8">
            <div 
              className="p-4 rounded-xl text-left"
              style={{
                background: '#e0e5ec',
                boxShadow: 'inset 3px 3px 6px #b8bec5, inset -3px -3px 6px #ffffff'
              }}
            >
              <h3 className="font-bold text-blue-700 mb-2">✓ Your Vote is Secure</h3>
              <p className="text-sm text-gray-700">
                Your vote has been encrypted and stored securely. It cannot be changed or deleted.
              </p>
            </div>

            <div 
              className="p-4 rounded-xl text-left"
              style={{
                background: '#e0e5ec',
                boxShadow: 'inset 3px 3px 6px #b8bec5, inset -3px -3px 6px #ffffff'
              }}
            >
              <h3 className="font-bold text-purple-700 mb-2">✓ Anonymous Voting</h3>
              <p className="text-sm text-gray-700">
                Your vote is completely anonymous. No one can see who you voted for.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div 
            className="p-6 rounded-xl mb-8"
            style={{
              background: '#e0e5ec',
              boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
            }}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-3">📋 What Happens Next?</h3>
            <ul className="text-left text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">1.</span>
                <span>Results will be announced by the election committee</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">2.</span>
                <span>Watch out for official announcements on club channels</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-600 font-bold mr-2">3.</span>
                <span>Congratulate the winners and support your new leaders!</span>
              </li>
            </ul>
          </div>

          {/* Action Button */}
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: 'white',
                boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #d97706, inset -5px -5px 10px #fcd34d';
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
            >
              Logout
            </button>

            <p className="text-sm text-gray-500">
              You can safely close this window now.
            </p>
          </div>

          {/* Footer Message */}
          <div className="mt-8 pt-6" style={{ borderTop: '2px solid #d1d5db' }}>
            <p className="text-gray-600 font-medium">
              Thank you for being part of IndabaX Club! 🎉
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-bounce-slow {
          animation: bounceSlow 2s ease-in-out infinite;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }

        @keyframes bounceSlow {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-10px);
          }
        }
      `}</style>
    </>
  );
};

export default SuccessPage;