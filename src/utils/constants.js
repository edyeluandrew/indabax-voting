// Application constants

// Admin email
export const ADMIN_EMAIL = '2023akcs4987gf@kab.ac.ug';

// Email domain
export const ALLOWED_EMAIL_DOMAIN = '@kab.ac.ug';

// Routes
export const ROUTES = {
  HOME: '/',
  SIGNUP: '/signup',
  LOGIN: '/login',
  VERIFY_EMAIL: '/verify-email',
  VOTING: '/vote',
  SUCCESS: '/success',
  ADMIN_LOGIN: '/admin/login',
  ADMIN_DASHBOARD: '/admin/dashboard'
};

// Error messages
export const ERROR_MESSAGES = {
  INVALID_EMAIL_DOMAIN: 'Only @kab.ac.ug emails are allowed',
  INVALID_PASSWORD_LENGTH: 'Password must be at least 6 characters',
  PASSWORDS_DO_NOT_MATCH: 'Passwords do not match',
  INVALID_CREDENTIALS: 'Invalid email or password',
  INVALID_ADMIN_CREDENTIALS: 'Invalid admin credentials',
  EMAIL_NOT_VERIFIED: 'Please verify your email before voting',
  ALREADY_VOTED: 'You have already cast your vote',
  NETWORK_ERROR: 'Network error. Please check your connection and try again',
  GENERIC_ERROR: 'An error occurred. Please try again'
};

// Success messages
export const SUCCESS_MESSAGES = {
  SIGNUP_SUCCESS: 'Account created successfully! Please verify your email',
  LOGIN_SUCCESS: 'Logged in successfully',
  VOTE_SUCCESS: 'Your vote has been recorded successfully!',
  EMAIL_VERIFICATION_SENT: 'Verification email sent. Please check your inbox'
};

// Color scheme
export const COLORS = {
  PRIMARY: '#8b5cf6',
  SECONDARY: '#3b82f6',
  SUCCESS: '#10b981',
  ERROR: '#ef4444',
  WARNING: '#f59e0b',
  INFO: '#06b6d4'
};