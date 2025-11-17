import { useState, useEffect } from 'react';
import { collection, doc, getDoc, setDoc, onSnapshot, increment } from 'firebase/firestore';
import { db } from '../config/firebase';
import { getAllPositions } from '../config/positions';

export const useVotes = () => {
  const [votes, setVotes] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
      const positions = getAllPositions();

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
        }
      }

      return { success: true };
    } catch (err) {
      console.error('Error submitting votes:', err);
      setError(err.message);
      return { success: false, error: err.message };
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

  return {
    votes,
    loading,
    error,
    submitVotes,
    getPositionVotes,
    getTotalVotes
  };
};

export default useVotes;