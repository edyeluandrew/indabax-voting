import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useVotes } from '../../hooks/useVotes';
import { getAllPositions } from '../../config/positions';
import Navbar from '../Shared/Navbar';
import PositionCard from './PositionCard';
import LoadingSpinner from '../Shared/LoadingSpinner';

const VotingPage = () => {
  const { currentUser, hasVoted, markAsVoted } = useAuth();
  const { submitVotes } = useVotes();
  const navigate = useNavigate();
  
  const [selectedVotes, setSelectedVotes] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const positions = getAllPositions();

  // Check if email is verified
  useEffect(() => {
    if (!currentUser?.emailVerified) {
      navigate('/verify-email');
    }
  }, [currentUser, navigate]);

  // Check if already voted
  useEffect(() => {
    if (hasVoted) {
      navigate('/success');
    }
  }, [hasVoted, navigate]);

  // Handle candidate selection
  const handleSelectCandidate = (positionId, candidate) => {
    setSelectedVotes(prev => ({
      ...prev,
      [positionId]: candidate
    }));
    setError('');
  };

  // Check if all positions have selections
  const allPositionsSelected = () => {
    return positions.every(position => selectedVotes[position.id]);
  };

  // Calculate progress
  const getProgress = () => {
    const selected = Object.keys(selectedVotes).length;
    const total = positions.length;
    return Math.round((selected / total) * 100);
  };

  // Handle vote submission
  const handleSubmit = async () => {
    // Validate all positions selected
    if (!allPositionsSelected()) {
      setError('Please select a candidate for all positions before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      // Submit votes to Firestore
      const result = await submitVotes(selectedVotes);
      
      if (result.success) {
        // Mark user as voted
        await markAsVoted();
        
        // Redirect to success page
        navigate('/success');
      } else {
        setError(result.error || 'Failed to submit votes. Please try again.');
      }
    } catch (err) {
      setError('An error occurred while submitting your vote. Please try again.');
      console.error('Vote submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              Cast Your Vote
            </h1>
            <p className="text-gray-600 text-lg">
              Select one candidate for each position below
            </p>
          </div>

          {/* Progress Bar */}
          <div className="bg-white rounded-xl shadow-lg p-6 mb-8 animate-slide-up">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-gray-700">
                Voting Progress
              </span>
              <span className="text-sm font-bold text-purple-600">
                {Object.keys(selectedVotes).length} / {positions.length} positions
              </span>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-purple-600 to-blue-600 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-gray-500 mt-2 text-center">
              {getProgress() === 100 ? '✓ All positions selected! Ready to submit.' : 'Please complete all positions'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-lg animate-slide-up">
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          )}

          {/* Position Cards */}
          <div className="space-y-6 mb-8">
            {positions.map((position, index) => (
              <PositionCard
                key={position.id}
                position={position}
                selectedCandidate={selectedVotes[position.id]}
                onSelectCandidate={handleSelectCandidate}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-4 bg-white rounded-xl shadow-2xl p-6 border-2 border-purple-200 animate-slide-up">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-lg font-bold text-gray-800">
                  Ready to submit your vote?
                </p>
                <p className="text-sm text-gray-600">
                  {allPositionsSelected() 
                    ? 'All positions selected. Click submit below.' 
                    : `Please select ${positions.length - Object.keys(selectedVotes).length} more position(s)`
                  }
                </p>
              </div>

              <button
                onClick={handleSubmit}
                disabled={!allPositionsSelected() || submitting}
                className={`px-8 py-4 rounded-lg font-bold text-white text-lg transform transition-all duration-300 ${
                  allPositionsSelected() && !submitting
                    ? 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 hover:scale-105 shadow-lg cursor-pointer'
                    : 'bg-gray-400 cursor-not-allowed opacity-50'
                }`}
              >
                {submitting ? (
                  <span className="flex items-center">
                    <svg className="animate-spin h-5 w-5 mr-3" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </span>
                ) : (
                  '🗳️ Submit My Vote'
                )}
              </button>
            </div>
          </div>

          {/* Important Notice */}
          <div className="mt-6 bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <span className="font-bold">⚠️ Important:</span> Once you submit your vote, you cannot change it. Please review your selections carefully before submitting.
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingPage;