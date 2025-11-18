import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { isValidPassword, passwordsMatch } from '../../utils/validation';

const Signup = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    course: '',
    yearOfStudy: '',
    registrationNumber: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  
  const { signup } = useAuth();
  const navigate = useNavigate();

  const courses = [
    'Computer Science',
    'Information Technology',
    'Software Engineering',
    'Business Administration',
    'Business Computing',
    'Medicine and Surgery',
    'Nursing',
    'Education',
    'Agriculture',
    'Engineering',
    'Law',
    'Arts and Social Sciences',
    'Other'
  ];

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

    if (!formData.fullName.trim()) {
      setError('Full name is required');
      return;
    }

    if (!formData.email.endsWith('@kab.ac.ug')) {
      setError('Only @kab.ac.ug emails are allowed');
      return;
    }

    if (!formData.course) {
      setError('Please select your course');
      return;
    }

    if (!formData.yearOfStudy) {
      setError('Please select your year of study');
      return;
    }

    if (!isValidPassword(formData.password)) {
      setError('Password must be at least 6 characters');
      return;
    }

    if (!passwordsMatch(formData.password, formData.confirmPassword)) {
      setError('Passwords do not match');
      return;
    }

    if (!agreedToTerms) {
      setError('You must agree to the terms and conditions');
      return;
    }

    setLoading(true);

    try {
      await signup(
        formData.email, 
        formData.password,
        {
          fullName: formData.fullName.trim(),
          course: formData.course,
          yearOfStudy: formData.yearOfStudy,
          registrationNumber: formData.registrationNumber.trim() || 'Not provided yet'
        }
      );
      navigate('/verify-email');
    } catch (err) {
      if (err.message.includes('email-already-in-use')) {
        setError('This email is already registered. Please login instead.');
      } else if (err.message.includes('weak-password')) {
        setError('Password is too weak. Use at least 6 characters.');
      } else {
        setError(err.message || 'Failed to create account');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12" style={{ backgroundColor: '#e0e5ec' }}>
      {/* Signup Form Container - Neumorphism Style */}
      <div className="w-full max-w-3xl p-8 rounded-3xl animate-slide-up" style={{
        background: '#e0e5ec',
        boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff'
      }}>
        
        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-block mb-4">
            <div className="w-20 h-20 mx-auto rounded-full flex items-center justify-center" style={{
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff'
            }}>
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <h1 className="text-3xl font-bold mb-2" style={{ 
            background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            STUDENT REGISTRATION
          </h1>
          <p className="text-gray-600 text-sm">Create your account to vote</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-xl" style={{
            backgroundColor: '#e0e5ec',
            boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
          }}>
            <p className="text-red-600 text-sm font-medium text-center">{error}</p>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Full Name */}
          <div style={{
            padding: '12px 15px',
            borderRadius: '15px',
            background: '#e0e5ec',
            boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
          }}>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Full Name"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
              required
            />
          </div>

          {/* Email */}
          <div style={{
            padding: '12px 15px',
            borderRadius: '15px',
            background: '#e0e5ec',
            boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
          }}>
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

          {/* Course and Year Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{
              padding: '12px 15px',
              borderRadius: '15px',
              background: '#e0e5ec',
              boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
            }}>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-700"
                style={{ color: formData.course ? '#374151' : '#9ca3af' }}
                required
              >
                <option value="">Select Course</option>
                {courses.map((course) => (
                  <option key={course} value={course}>{course}</option>
                ))}
              </select>
            </div>

            <div style={{
              padding: '12px 15px',
              borderRadius: '15px',
              background: '#e0e5ec',
              boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
            }}>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full bg-transparent outline-none text-gray-700"
                style={{ color: formData.yearOfStudy ? '#374151' : '#9ca3af' }}
                required
              >
                <option value="">Select Year</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Year 5+">Year 5+</option>
              </select>
            </div>
          </div>

          {/* Registration Number */}
          <div style={{
            padding: '12px 15px',
            borderRadius: '15px',
            background: '#e0e5ec',
            boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
          }}>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="Registration Number (Optional)"
              className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
            />
          </div>

          {/* Password Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div style={{
              padding: '12px 15px',
              borderRadius: '15px',
              background: '#e0e5ec',
              boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
            }}>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                required
                minLength="6"
              />
            </div>

            <div style={{
              padding: '12px 15px',
              borderRadius: '15px',
              background: '#e0e5ec',
              boxShadow: 'inset 5px 5px 10px #b8bec5, inset -5px -5px 10px #ffffff'
            }}>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
                className="w-full bg-transparent outline-none text-gray-700 placeholder-gray-500"
                required
                minLength="6"
              />
            </div>
          </div>

          {/* Terms Checkbox */}
          <div className="flex items-start space-x-3 p-3 rounded-xl" style={{
            backgroundColor: '#e0e5ec',
            boxShadow: 'inset 3px 3px 6px #b8bec5, inset -3px -3px 6px #ffffff'
          }}>
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 w-5 h-5 cursor-pointer"
              style={{ accentColor: '#fbbf24' }}
              required
            />
            <label className="text-xs text-gray-600 cursor-pointer" onClick={() => setAgreedToTerms(!agreedToTerms)}>
              I confirm that I am a current Kabale University student and the information provided is accurate.
            </label>
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
            {loading ? 'Creating Account...' : 'CREATE ACCOUNT'}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600 text-sm">
            Already have an account?{' '}
            <Link to="/login" className="font-semibold hover:text-gold-700 transition-colors" style={{ color: '#d97706' }}>
              Login here
            </Link>
          </p>
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

export default Signup;