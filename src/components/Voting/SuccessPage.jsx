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
      
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 animate-fade-in">
        <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 max-w-2xl w-full text-center animate-slide-up">
          {/* Success Icon */}
          <div className="w-24 h-24 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
            <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          {/* Success Message */}
          <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
            Vote Submitted!
          </h1>
          
          <p className="text-gray-600 text-lg mb-8">
            Thank you for participating in the IndabaX Club elections.
          </p>

          {/* Vote Details */}
          <div className="bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl p-6 mb-8">
            <div className="space-y-3 text-left">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Voter Email:</span>
                <span className="text-purple-700 font-bold">{currentUser?.email}</span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Status:</span>
                <span className="px-3 py-1 bg-green-100 text-green-700 font-bold rounded-full text-sm">
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
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg text-left">
              <h3 className="font-bold text-blue-800 mb-2">✓ Your Vote is Secure</h3>
              <p className="text-sm text-blue-700">
                Your vote has been encrypted and stored securely. It cannot be changed or deleted.
              </p>
            </div>

            <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-lg text-left">
              <h3 className="font-bold text-purple-800 mb-2">✓ Anonymous Voting</h3>
              <p className="text-sm text-purple-700">
                Your vote is completely anonymous. No one can see who you voted for.
              </p>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border-2 border-yellow-300 rounded-xl p-6 mb-8">
            <h3 className="text-lg font-bold text-gray-800 mb-3">📋 What Happens Next?</h3>
            <ul className="text-left text-sm text-gray-700 space-y-2">
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">1.</span>
                <span>Results will be announced by the election committee</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">2.</span>
                <span>Watch out for official announcements on club channels</span>
              </li>
              <li className="flex items-start">
                <span className="text-green-500 font-bold mr-2">3.</span>
                <span>Congratulate the winners and support your new leaders!</span>
              </li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleLogout}
              className="w-full py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold text-lg rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              Logout
            </button>

            <p className="text-sm text-gray-500">
              You can safely close this window now.
            </p>
          </div>

          {/* Footer Message */}
          <div className="mt-8 pt-6 border-t-2 border-gray-200">
            <p className="text-gray-600 font-medium">
              Thank you for being part of IndabaX Club! 🎉
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default SuccessPage;