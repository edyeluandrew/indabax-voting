// Email validation
export const isValidKabaleEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._-]+@kab\.ac\.ug$/;
  return emailRegex.test(email);
};

// Password validation
export const isValidPassword = (password) => {
  return password && password.length >= 6;
};

// Check if passwords match
export const passwordsMatch = (password, confirmPassword) => {
  return password === confirmPassword;
};

// Check if user is admin
export const isAdminEmail = (email) => {
  return email === process.env.REACT_APP_ADMIN_EMAIL || email === '2023akcs4987gf@kab.ac.ug';
};

// Validate admin credentials
export const validateAdminCredentials = (email, password) => {
  return email === '2023akcs4987gf@kab.ac.ug' && password === 'Andrew@4987';
};

// Format candidate name for database key
export const formatCandidateKey = (name) => {
  return name.toUpperCase().replace(/\s+/g, '_');
};

// Format candidate name for display
export const formatCandidateDisplay = (name) => {
  return name.split('_').map(word => 
    word.charAt(0) + word.slice(1).toLowerCase()
  ).join(' ');
};