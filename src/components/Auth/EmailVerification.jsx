import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Shared/Navbar';

const EmailVerification = () => {
  const { currentUser, resendVerificationEmail, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Check if email is verified
    if (currentUser?.emailVerified) {
      navigate('/vote');
    }
  }, [currentUser, navigate]);

  const handleResend = async () => {
    setResending(true);
    setMessage('');
    
    try {
      await resendVerificationEmail();
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to send email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full text-center animate-slide-up">
          {/* Email Icon */}
          <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>

          <h2 className="text-3xl font-bold gradient-text mb-4">
            Verify Your Email
          </h2>
          
          <p className="text-gray-600 mb-6">
            We've sent a verification email to:
          </p>
          
          <p className="text-purple-600 font-semibold text-lg mb-6">
            {currentUser?.email}
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">Next Steps:</span>
              <br />
              1. Check your inbox (and spam folder)
              <br />
              2. Click the verification link in the email
              <br />
              3. Come back here and click "I've Verified"
            </p>
          </div>

          {message && (
            <div className={`p-4 rounded-lg mb-4 ${
              message.includes('Failed') 
                ? 'bg-red-50 text-red-700 border-l-4 border-red-500' 
                : 'bg-green-50 text-green-700 border-l-4 border-green-500'
            }`}>
              <p className="font-medium">{message}</p>
            </div>
          )}

          <div className="space-y-3">
            <button
              onClick={handleRefresh}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg"
            >
              I've Verified My Email
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-3 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all duration-300 disabled:opacity-50"
            >
              {resending ? 'Sending...' : 'Resend Verification Email'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmailVerification;