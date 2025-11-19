import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(formData.email, formData.password);
      
      // Redirect based on user type
      if (formData.email === '2023akcs4987gf@kab.ac.ug') {
        navigate('/admin/dashboard');
      } else {
        navigate('/verify-email');
      }
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: '#e0e5ec' }}>
      {/* Login Form Container - Neumorphism Style */}
      <div className="w-full max-w-md p-8 rounded-3xl animate-slide-up" style={{
        background: '#e0e5ec',
        boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff'
      }}>
        
        {/* Header with Icon */}
        <div className="text-center mb-8">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
            }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            WELCOME BACK
          </h1>
          <p className="text-gray-600 text-sm">Login to cast your vote</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-3 rounded-xl animate-slide-up" style={{
            backgroundColor: '#e0e5ec',
            boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
          }}>
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Input */}
          <div style={{
            padding: '12px 15px',
            borderRadius: '15px',
            background: '#e0e5ec',
            boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
          }}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" style={{ color: '#9ca3af' }} fill="currentColor" viewBox="0 0 20 20">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="yourname@kab.ac.ug"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Password Input */}
          <div style={{
            padding: '12px 15px',
            borderRadius: '15px',
            background: '#e0e5ec',
            boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
          }}>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-3" style={{ color: '#9ca3af' }} fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl font-bold text-lg transition-all duration-300 disabled:opacity-50"
            style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              color: 'white',
              boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #d97706, inset -5px -5px 10px #fcd34d';
                e.currentTarget.style.transform = 'scale(0.98)';
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                e.currentTarget.style.boxShadow = '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff';
                e.currentTarget.style.transform = 'scale(1)';
              }
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                LOGGING IN...
              </span>
            ) : (
              'LOGIN'
            )}
          </button>
        </form>

        {/* Signup Link */}
        <div className="mt-8 text-center">
          <p className="text-gray-600 text-sm">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold hover:text-gold-700 transition-colors" style={{ color: '#d97706' }}>
              Sign up here
            </Link>
          </p>
        </div>

        {/* Admin Badge */}
        <div className="mt-6 p-3 rounded-xl" style={{
          backgroundColor: '#e0e5ec',
          boxShadow: 'inset 3px 3px 6px #b8bec5, inset -3px -3px 6px #ffffff'
        }}>
          <div className="flex items-center justify-center">
            <svg className="w-4 h-4 mr-2" style={{ color: '#fbbf24' }} fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z" clipRule="evenodd" />
            </svg>
            <p className="text-xs text-gray-700">
              <span className="font-semibold">Admin Access:</span> Use authorized credentials
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
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
      `}</style>
    </div>
  );
};

export default Login;