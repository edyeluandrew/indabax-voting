import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, onSnapshot, increment } from 'firebase/firestore';
import { db, auth } from '../config/firebase';
import { getAllPositions } from '../config/positions';

export const useVotes = () => {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasVoted, setHasVoted] = useState(false);

  // Check if current user has voted
  useEffect(() => {
    const checkVotingStatus = async () => {
      if (auth.currentUser) {
        try {
          const voterRef = doc(db, 'voters', auth.currentUser.uid);
          const voterSnap = await getDoc(voterRef);
          setHasVoted(voterSnap.exists());
        } catch (err) {
          console.error('Error checking voting status:', err);
        }
      }
    };

    checkVotingStatus();
  }, []);

  // Listen to real-time vote updates
  useEffect(() => {
    const positions = getAllPositions();
    const unsubscribers = [];

    positions.forEach(position => {
      const voteRef = doc(db, 'votes', position.id);
      
      const unsubscribe = onSnapshot(voteRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            setVotes(prev => ({
              ...prev,
              [position.id]: docSnap.data()
            }));
          }
          setLoading(false);
        },
        (err) => {
          console.error(`Error listening to ${position.id}:`, err);
          setError(err.message);
          setLoading(false);
        }
      );

      unsubscribers.push(unsubscribe);
    });

    // Cleanup function
    return () => {
      unsubscribers.forEach(unsub => unsub());
    };
  }, []);

  // Submit votes for all positions
  const submitVotes = async (selectedVotes) => {
    try {
      // Ensure user is authenticated
      if (!auth.currentUser) {
        return { 
          success: false, 
          error: 'You must be logged in to vote.' 
        };
      }

      // CRITICAL FIX: Force token refresh to get latest email_verified status
      await auth.currentUser.reload();
      const idTokenResult = await auth.currentUser.getIdToken(true); // Force refresh
      
      const userId = auth.currentUser.uid;
      const userEmail = auth.currentUser.email;

      // Check if user's email is verified
      if (!auth.currentUser.emailVerified) {
        return { 
          success: false, 
          error: 'Please verify your email before voting. Check your inbox and click the verification link.' 
        };
      }

      // Check if user has @kab.ac.ug email
      if (!userEmail || !userEmail.endsWith('@kab.ac.ug')) {
        return { 
          success: false, 
          error: 'Only Kabale University students can vote. You must use your @kab.ac.ug email address.' 
        };
      }

      // First, check if user has already voted
      const voterRef = doc(db, 'voters', userId);
      const voterSnap = await getDoc(voterRef);

      if (voterSnap.exists()) {
        return { 
          success: false, 
          error: 'You have already voted. Each student can only vote once.' 
        };
      }

      const positions = getAllPositions();
      const votedPositions = [];

      // Update votes for each position
      for (const position of positions) {
        const candidateName = selectedVotes[position.id];
        
        if (candidateName) {
          const voteRef = doc(db, 'votes', position.id);
          const voteSnap = await getDoc(voteRef);

          if (voteSnap.exists()) {
            // Increment existing candidate vote
            await setDoc(voteRef, {
              [candidateName]: increment(1)
            }, { merge: true });
          } else {
            // Create new vote document
            await setDoc(voteRef, {
              [candidateName]: 1
            });
          }

          votedPositions.push(position.id);
        }
      }

      // Mark user as having voted (CRITICAL - prevents double voting)
      await setDoc(voterRef, {
        votedAt: new Date().toISOString(),
        email: userEmail,
        userId: userId,
        positions: votedPositions,
        totalVotes: votedPositions.length
      });

      // Update local state
      setHasVoted(true);

      return { 
        success: true,
        message: 'Your votes have been submitted successfully!' 
      };
    } catch (err) {
      console.error('Error submitting votes:', err);
      setError(err.message);
      
      // Provide more specific error messages
      let errorMessage = 'Failed to submit votes. ';
      
      if (err.code === 'permission-denied') {
        errorMessage = 'Permission denied. Please make sure:\n' +
                      '1. Your email is verified (check your inbox)\n' +
                      '2. You are using a @kab.ac.ug email address\n' +
                      '3. You have not voted before\n\n' +
                      'If you just verified your email, try logging out and back in.';
      } else if (err.code === 'unavailable') {
        errorMessage += 'Network error. Please check your connection and try again.';
      } else {
        errorMessage += err.message;
      }
      
      return { 
        success: false, 
        error: errorMessage 
      };
    }
  };

  // Get votes for a specific position
  const getPositionVotes = (positionId) => {
    return votes[positionId] || {};
  };

  // Get total votes across all positions
  const getTotalVotes = () => {
    let total = 0;
    Object.values(votes).forEach(positionVotes => {
      Object.values(positionVotes).forEach(count => {
        total += count;
      });
    });
    return total;
  };

  // Get winner for a specific position
  const getPositionWinner = (positionId) => {
    const positionVotes = votes[positionId] || {};
    let winner = null;
    let maxVotes = 0;

    Object.entries(positionVotes).forEach(([candidate, voteCount]) => {
      if (voteCount > maxVotes) {
        maxVotes = voteCount;
        winner = candidate;
      }
    });

    return { candidate: winner, votes: maxVotes };
  };

  return {
    votes,
    loading,
    error,
    hasVoted,
    submitVotes,
    getPositionVotes,
    getTotalVotes,
    getPositionWinner
  };
};

export default useVotes;