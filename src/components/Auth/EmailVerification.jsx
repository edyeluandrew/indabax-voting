import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import Navbar from '../Shared/Navbar';

const VerifyEmail = () => {
  const { currentUser, reloadUser, resendVerificationEmail, logout } = useAuth();
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState('');
  const [checking, setChecking] = useState(false);
  const navigate = useNavigate();

  // Check on mount if user is already verified
  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    // If already verified, go to voting page
    if (currentUser.emailVerified) {
      navigate('/vote');
    }
  }, [currentUser, navigate]);

  const handleResend = async () => {
    setResending(true);
    setMessage('');
    
    try {
      await resendVerificationEmail();
      setMessage('📧 Verification email sent! Please check your inbox and spam folder.');
    } catch (error) {
      setMessage('❌ Failed to send email. Please try again.');
    } finally {
      setResending(false);
    }
  };

  const handleManualCheck = async () => {
    setChecking(true);
    setMessage('🔄 Checking verification status...');
    
    try {
      const isVerified = await reloadUser();
      
      if (isVerified) {
        setMessage('✅ Email verified! Redirecting...');
        setTimeout(() => {
          navigate('/vote');
        }, 1500);
      } else {
        setMessage('❌ Email not verified yet. Please check your inbox and click the verification link.');
      }
    } catch (error) {
      console.error('Verification check error:', error);
      setMessage('❌ Error checking verification. Please try again.');
    } finally {
      setChecking(false);
    }
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
          <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            
            {/* Checking indicator */}
            {checking && (
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center animate-pulse">
                <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </div>

          <h2 className="text-3xl font-bold gradient-text mb-4">
            Verify Your Email
          </h2>
          
          <p className="text-gray-600 mb-4">
            We've sent a verification email to:
          </p>
          
          <p className="text-purple-600 font-semibold text-lg mb-6">
            {currentUser?.email}
          </p>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 text-left">
            <p className="text-sm text-blue-800">
              <span className="font-semibold">📋 Next Steps:</span>
              <br />
              1. Check your inbox (and spam folder)
              <br />
              2. Click the verification link in the email
              <br />
              3. Come back here and click "I've Verified - Check Now"
            </p>
          </div>

          {/* Status Messages */}
          {message && (
            <div className={`p-4 rounded-lg mb-4 animate-slide-up ${
              message.includes('Failed') || message.includes('not verified')
                ? 'bg-red-50 text-red-700 border-l-4 border-red-500' 
                : message.includes('verified')
                ? 'bg-green-50 text-green-700 border-l-4 border-green-500'
                : 'bg-blue-50 text-blue-700 border-l-4 border-blue-500'
            }`}>
              <p className="font-medium">{message}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleManualCheck}
              disabled={checking}
              className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {checking ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Checking...
                </span>
              ) : (
                "✅ I've Verified - Check Now"
              )}
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-3 bg-white border-2 border-purple-600 text-purple-600 font-bold rounded-lg hover:bg-purple-50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resending ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Sending...
                </span>
              ) : (
                '📧 Resend Verification Email'
              )}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-all duration-300"
            >
              🚪 Logout
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-xs text-gray-500">
            <p>Didn't receive the email? Check your spam folder or click resend.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VerifyEmail;