import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot, increment } from 'firebase/firestore';
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

  // Listen to real-time vote updates - COMPATIBLE VERSION
  useEffect(() => {
    const positions = getAllPositions();
    const unsubscribers = [];

    positions.forEach(position => {
      // Try both data structures for compatibility
      const voteRef = doc(db, 'votes', position.id);
      
      const unsubscribe = onSnapshot(voteRef, 
        (docSnap) => {
          if (docSnap.exists()) {
            const voteData = docSnap.data();
            
            // Convert the object format to array format for ResultsChart
            const positionVotes = [];
            
            Object.entries(voteData).forEach(([candidateName, count]) => {
              // Skip metadata fields
              if (candidateName !== 'votedAt' && candidateName !== 'email' && candidateName !== 'userId') {
                positionVotes.push({
                  candidateId: candidateName.replace(/\s+/g, '-').toLowerCase(),
                  candidateName: candidateName,
                  count: count || 0
                });
              }
            });

            setVotes(prev => ({
              ...prev,
              [position.id]: positionVotes
            }));
          } else {
            // If document doesn't exist, set empty array
            setVotes(prev => ({
              ...prev,
              [position.id]: []
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

  // Submit votes for all positions - COMPATIBLE VERSION
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
      await auth.currentUser.getIdToken(true);
      
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

      // Update votes for each position using the original structure
      for (const position of positions) {
        const candidate = selectedVotes[position.id];
        
        if (candidate) {
          const voteRef = doc(db, 'votes', position.id);
          const voteSnap = await getDoc(voteRef);

          if (voteSnap.exists()) {
            // Increment existing candidate vote using the original structure
            await setDoc(voteRef, {
              [candidate.name]: increment(1)
            }, { merge: true });
          } else {
            // Create new vote document using the original structure
            await setDoc(voteRef, {
              [candidate.name]: 1
            });
          }

          votedPositions.push(position.id);
        }
      }

      // Mark user as having voted
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

  // Get votes for a specific position - SAFE VERSION
  const getPositionVotes = (positionId) => {
    const positionVotes = votes[positionId];
    
    // Ensure we always return an array
    if (!positionVotes) return [];
    if (!Array.isArray(positionVotes)) return [];
    
    return positionVotes;
  };

  // Get total votes across all positions - SAFE VERSION
  const getTotalVotes = () => {
    let total = 0;
    Object.values(votes).forEach(positionVotes => {
      // Ensure positionVotes is an array before using forEach
      if (Array.isArray(positionVotes)) {
        positionVotes.forEach(candidate => {
          total += candidate.count || 0;
        });
      }
    });
    return total;
  };

  // Get winner for a specific position - SAFE VERSION
  const getPositionWinner = (positionId) => {
    const positionVotes = getPositionVotes(positionId);
    if (positionVotes.length === 0) return null;

    let winner = positionVotes[0];
    positionVotes.forEach(candidate => {
      if (candidate.count > winner.count) {
        winner = candidate;
      }
    });

    return winner;
  };

  // Add refresh function for manual updates
  const refreshVotes = async () => {
    setLoading(true);
    // The real-time listener will automatically update
    setTimeout(() => setLoading(false), 1000);
  };

  return {
    votes,
    loading,
    error,
    hasVoted,
    submitVotes,
    getPositionVotes,
    getTotalVotes,
    getPositionWinner,
    refreshVotes
  };
};

export default useVotes;