import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendEmailVerification
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import { isValidKabaleEmail, isAdminEmail } from '../utils/validation';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [hasVoted, setHasVoted] = useState(false);

  // Check if user has voted
  const checkVotingStatus = async (userId) => {
    try {
      const voterRef = doc(db, 'voters', userId);
      const voterSnap = await getDoc(voterRef);
      setHasVoted(voterSnap.exists());
    } catch (error) {
      console.error('Error checking voting status:', error);
    }
  };

  // Sign up function
  const signup = async (email, password) => {
    // Validate email domain
    if (!isValidKabaleEmail(email)) {
      throw new Error('Only @kab.ac.ug emails are allowed');
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    // Send verification email
    await sendEmailVerification(userCredential.user);
    
    return userCredential.user;
  };

  // Login function
  const login = async (email, password) => {
    // Validate email domain
    if (!isValidKabaleEmail(email)) {
      throw new Error('Only @kab.ac.ug emails are allowed');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    
    // Check voting status
    await checkVotingStatus(userCredential.user.uid);
    
    return userCredential.user;
  };

  // Logout function
  const logout = async () => {
    await signOut(auth);
    setHasVoted(false);
  };

  // Resend verification email
  const resendVerificationEmail = async () => {
    if (currentUser) {
      await sendEmailVerification(currentUser);
    }
  };

  // Mark user as voted
  const markAsVoted = async () => {
    if (currentUser) {
      const voterRef = doc(db, 'voters', currentUser.uid);
      await setDoc(voterRef, {
        email: currentUser.email,
        votedAt: new Date().toISOString(),
        hasVoted: true
      });
      setHasVoted(true);
    }
  };

  // Listen to auth state changes
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await checkVotingStatus(user.uid);
      } else {
        setHasVoted(false);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    hasVoted,
    isAdmin: currentUser ? isAdminEmail(currentUser.email) : false,
    signup,
    login,
    logout,
    resendVerificationEmail,
    markAsVoted,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;