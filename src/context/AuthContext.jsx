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
      return voterSnap.exists();
    } catch (error) {
      console.error('Error checking voting status:', error);
      return false;
    }
  };

  // UPDATED: Sign up function with profile data
  const signup = async (email, password, profileData) => {
    if (!isValidKabaleEmail(email)) {
      throw new Error('Only @kab.ac.ug emails are allowed');
    }

    // Create Firebase Auth account
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    // Save user profile to Firestore
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: email,
        fullName: profileData.fullName,
        course: profileData.course,
        yearOfStudy: profileData.yearOfStudy,
        registrationNumber: profileData.registrationNumber,
        createdAt: new Date().toISOString(),
        emailVerified: false,
        accountStatus: 'active' // Can be: active, suspended, flagged
      });
    } catch (error) {
      console.error('Error saving user profile:', error);
      // Don't throw error here - user is already created in Firebase Auth
    }
    
    // Send verification email and KEEP USER LOGGED IN
    await sendEmailVerification(user);
    
    return user;
  };

  // Login function
  const login = async (email, password) => {
    if (!isValidKabaleEmail(email)) {
      throw new Error('Only @kab.ac.ug emails are allowed');
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
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

  // FIXED: Reload user to check verification status
  const reloadUser = async () => {
    try {
      if (auth.currentUser) {
        // Use auth.currentUser instead of currentUser from state
        await auth.currentUser.reload();
        
        // Force token refresh to get updated email_verified claim
        await auth.currentUser.getIdToken(true);
        
        // Update state with fresh user data
        setCurrentUser({ ...auth.currentUser });
        
        // Update Firestore profile if email is now verified
        if (auth.currentUser.emailVerified) {
          try {
            await setDoc(doc(db, 'users', auth.currentUser.uid), {
              emailVerified: true,
              verifiedAt: new Date().toISOString()
            }, { merge: true });
          } catch (error) {
            console.error('Error updating verification status:', error);
          }
        }
        
        return auth.currentUser.emailVerified;
      }
      return false;
    } catch (error) {
      console.error('Error reloading user:', error);
      return false;
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

  // Get user profile
  const getUserProfile = async (userId) => {
    try {
      const userRef = doc(db, 'users', userId);
      const userSnap = await getDoc(userRef);
      if (userSnap.exists()) {
        return userSnap.data();
      }
      return null;
    } catch (error) {
      console.error('Error getting user profile:', error);
      return null;
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
    reloadUser,
    markAsVoted,
    getUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthContext;