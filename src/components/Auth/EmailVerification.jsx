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

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

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
      <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#e0e5ec' }}>
        <div 
          className="max-w-md w-full p-8 rounded-3xl text-center animate-slide-up"
          style={{
            background: '#e0e5ec',
            boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff'
          }}
        >
          {/* Email Icon */}
          <div className="relative inline-block mb-6">
            <div 
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
              }}
            >
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            {/* Checking indicator */}
            {checking && (
              <div 
                className="absolute -top-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center animate-pulse"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  boxShadow: '2px 2px 4px #b8bec5, -2px -2px 4px #ffffff'
                }}
              >
                <svg className="w-4 h-4 text-white animate-spin" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              </div>
            )}
          </div>

          <h2 
            className="text-3xl font-bold mb-4"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Verify Your Email
          </h2>
          
          <p className="text-gray-600 mb-3 text-sm">
            We've sent a verification email to:
          </p>
          
          <div 
            className="px-4 py-2 rounded-xl mb-6 inline-block"
            style={{
              background: '#e0e5ec',
              boxShadow: 'inset 3px 3px 6px #b8bec5, inset -3px -3px 6px #ffffff'
            }}
          >
            <p className="text-amber-600 font-bold text-sm">
              {currentUser?.email}
            </p>
          </div>

          {/* Instructions */}
          <div 
            className="p-4 rounded-xl mb-6 text-left"
            style={{
              background: '#e0e5ec',
              boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
            }}
          >
            <p className="text-sm text-gray-700 leading-relaxed">
              <span className="font-bold text-amber-600">📋 Next Steps:</span>
              <br />
              <span className="block mt-2">1. Check your inbox (and spam folder)</span>
              <span className="block mt-1">2. Click the verification link in the email</span>
              <span className="block mt-1">3. Come back here and click "I've Verified"</span>
            </p>
          </div>

          {/* Status Messages */}
          {message && (
            <div 
              className="p-4 rounded-xl mb-4 animate-fade-in"
              style={{
                background: '#e0e5ec',
                boxShadow: message.includes('Failed') || message.includes('not verified')
                  ? 'inset 5px 5px 10px #dc2626, inset -5px -5px 10px #fca5a5'
                  : message.includes('verified')
                  ? 'inset 5px 5px 10px #10b981, inset -5px -5px 10px #6ee7b7'
                  : 'inset 5px 5px 10px #3b82f6, inset -5px -5px 10px #93c5fd'
              }}
            >
              <p className={`font-medium text-sm ${
                message.includes('Failed') || message.includes('not verified')
                  ? 'text-red-700'
                  : message.includes('verified')
                  ? 'text-green-700'
                  : 'text-blue-700'
              }`}>
                {message}
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleManualCheck}
              disabled={checking}
              className="w-full py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50"
              style={{
                background: checking 
                  ? '#e0e5ec'
                  : 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                color: 'white',
                boxShadow: checking
                  ? 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
                  : '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
              }}
              onMouseEnter={(e) => {
                if (!checking) {
                  e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #d97706, inset -5px -5px 10px #fcd34d';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }
              }}
              onMouseLeave={(e) => {
                if (!checking) {
                  e.currentTarget.style.boxShadow = '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {checking ? '🔄 Checking...' : "✅ I've Verified - Check Now"}
            </button>

            <button
              onClick={handleResend}
              disabled={resending}
              className="w-full py-3 rounded-xl font-bold transition-all duration-300 disabled:opacity-50"
              style={{
                background: '#e0e5ec',
                color: '#d97706',
                boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
              }}
              onMouseEnter={(e) => {
                if (!resending) {
                  e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }
              }}
              onMouseLeave={(e) => {
                if (!resending) {
                  e.currentTarget.style.boxShadow = '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {resending ? '📧 Sending...' : '📧 Resend Verification Email'}
            </button>

            <button
              onClick={handleLogout}
              className="w-full py-3 rounded-xl font-medium transition-all duration-300"
              style={{
                background: '#e0e5ec',
                color: '#6b7280',
                boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff';
                e.currentTarget.style.transform = 'scale(0.98)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.boxShadow = '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff';
                e.currentTarget.style.transform = 'scale(1)';
              }}
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

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
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

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default VerifyEmail;