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

    // Validation
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
      // Pass all profile data to signup function
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
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-700 flex items-center justify-center p-4 py-12 animate-fade-in">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-2xl w-full transform hover:scale-[1.02] transition-all duration-300 animate-slide-up">
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold gradient-text mb-2">
            IndabaX Elections
          </h1>
          <p className="text-gray-600 font-medium">Student Registration</p>
        </div>

        {/* Info Banner */}
        <div className="mb-6 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <p className="text-sm text-blue-800">
            <span className="font-semibold">Important:</span> Only Kabale University students with valid @kab.ac.ug email addresses can register. You'll need to verify your email to vote.
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-slide-up">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              University Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="yourname@kab.ac.ug"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
              required
            />
            <p className="text-xs text-gray-500 mt-1">Must be your official Kabale University email</p>
          </div>

          {/* Course and Year in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Course */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Course/Program <span className="text-red-500">*</span>
              </label>
              <select
                name="course"
                value={formData.course}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Select course</option>
                {courses.map((course) => (
                  <option key={course} value={course}>
                    {course}
                  </option>
                ))}
              </select>
            </div>

            {/* Year of Study */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Year of Study <span className="text-red-500">*</span>
              </label>
              <select
                name="yearOfStudy"
                value={formData.yearOfStudy}
                onChange={handleChange}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                required
              >
                <option value="">Select year</option>
                <option value="Year 1">Year 1</option>
                <option value="Year 2">Year 2</option>
                <option value="Year 3">Year 3</option>
                <option value="Year 4">Year 4</option>
                <option value="Year 5+">Year 5+</option>
              </select>
            </div>
          </div>

          {/* Registration Number (Optional) */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Student Registration Number (Optional)
            </label>
            <input
              type="text"
              name="registrationNumber"
              value={formData.registrationNumber}
              onChange={handleChange}
              placeholder="e.g., 2023/AKCS/4987/GF (if available)"
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
            />
            <p className="text-xs text-gray-500 mt-1">Leave blank if you haven't received your ID yet</p>
          </div>

          {/* Password Fields in Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="At least 6 characters"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                required
                minLength="6"
              />
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter password"
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-purple-500 focus:outline-none transition-colors"
                required
                minLength="6"
              />
            </div>
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start space-x-3 p-4 bg-gray-50 rounded-lg">
            <input
              type="checkbox"
              checked={agreedToTerms}
              onChange={(e) => setAgreedToTerms(e.target.checked)}
              className="mt-1 h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
              required
            />
            <label className="text-sm text-gray-700">
              I confirm that I am a current Kabale University student and the information provided is accurate. I understand that providing false information may result in account suspension.
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-bold rounded-lg hover:from-purple-700 hover:to-blue-700 transform hover:scale-105 transition-all duration-300 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating Account...
              </span>
            ) : (
              'Create Account'
            )}
          </button>
        </form>

        {/* Login Link */}
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-purple-600 font-semibold hover:text-purple-800 transition-colors">
              Login here
            </Link>
          </p>
        </div>

        {/* Security Note */}
        <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
          <p className="text-xs text-green-800 text-center">
            🔒 Your data is secure. Only verified students can vote.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;