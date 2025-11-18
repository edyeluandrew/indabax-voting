import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useVotes } from '../../hooks/useVotes';
import { getAllPositions } from '../../config/positions';
import Navbar from '../Shared/Navbar';
import PositionCard from './PositionCard';
import LoadingSpinner from '../Shared/LoadingSpinner';

const VotingPage = () => {
  const { currentUser } = useAuth();
  const { submitVotes, hasVoted } = useVotes();
  const navigate = useNavigate();
  
  const [selectedVotes, setSelectedVotes] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const positions = getAllPositions();

  useEffect(() => {
    if (!currentUser) {
      navigate('/login');
      return;
    }

    if (!currentUser.emailVerified) {
      navigate('/verify-email');
      return;
    }

    if (!currentUser.email?.endsWith('@kab.ac.ug')) {
      alert('Only Kabale University students can vote');
      navigate('/');
      return;
    }
  }, [currentUser, navigate]);

  useEffect(() => {
    if (hasVoted) {
      navigate('/success');
    }
  }, [hasVoted, navigate]);

  const handleSelectCandidate = (positionId, candidate) => {
    setSelectedVotes(prev => ({
      ...prev,
      [positionId]: candidate
    }));
    setError('');
  };

  const allPositionsSelected = () => {
    return positions.every(position => selectedVotes[position.id]);
  };

  const getProgress = () => {
    const selected = Object.keys(selectedVotes).length;
    const total = positions.length;
    return Math.round((selected / total) * 100);
  };

  const handleSubmit = async () => {
    if (!allPositionsSelected()) {
      setError('Please select a candidate for all positions before submitting');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    setSubmitting(true);
    setError('');

    try {
      const result = await submitVotes(selectedVotes);
      
      if (result.success) {
        navigate('/success');
      } else {
        setError(result.error || 'Failed to submit votes. Please try again.');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setSubmitting(false);
    }
  };

  if (!currentUser) {
    return <LoadingSpinner />;
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-dark py-8 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block mb-4">
              <div className="w-20 h-20 mx-auto bg-gradient-gold rounded-full flex items-center justify-center glow-gold shadow-glow-gold float-animation">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                </svg>
              </div>
            </div>
            <h1 className="text-5xl font-bold gradient-text mb-4">
              Cast Your Vote
            </h1>
            <p className="text-white/80 text-lg">
              Select one candidate for each position below
            </p>
            <p className="text-sm text-gold-300 mt-2">
              Voting as: <span className="font-semibold">{currentUser?.email}</span>
            </p>
          </div>

          {/* Progress Bar */}
          <div className="glass-effect rounded-xl shadow-gold p-6 mb-8 animate-slide-up border border-gold-300/30">
            <div className="flex justify-between items-center mb-3">
              <span className="text-sm font-semibold text-white/90">
                Voting Progress
              </span>
              <span className="text-sm font-bold text-gold-400">
                {Object.keys(selectedVotes).length} / {positions.length} positions
              </span>
            </div>
            
            <div className="w-full bg-white/10 rounded-full h-3 overflow-hidden backdrop-blur-sm">
              <div 
                className="h-full bg-gradient-gold transition-all duration-500 ease-out rounded-full shimmer"
                style={{ width: `${getProgress()}%` }}
              ></div>
            </div>
            
            <p className="text-xs text-white/70 mt-2 text-center">
              {getProgress() === 100 ? '✓ All positions selected! Ready to submit.' : 'Please complete all positions'}
            </p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="glass-effect rounded-xl p-4 mb-6 border-l-4 border-red-400 animate-slide-up">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-red-400 mr-3 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <div>
                  <p className="text-red-300 font-medium">{error}</p>
                  <p className="text-red-400 text-sm mt-1">
                    If this problem persists, please contact the administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Position Cards */}
          <div className="space-y-6 mb-8">
            {positions.map((position) => (
              <PositionCard
                key={position.id}
                position={position}
                selectedCandidate={selectedVotes[position.id]}
                onSelectCandidate={handleSelectCandidate}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="sticky bottom-4 glass-effect rounded-xl shadow-glow-gold p-6 border-2 border-gold-300/50 animate-slide-up backdrop-blur-xl">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="text-center md:text-left">
                <p className="text-lg font-bold text-white">
                  Ready to submit your vote?
                </p>
                <p className="text-sm text-white/70">
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
                    ? 'bg-gradient-gold hover:shadow-glow-gold hover:scale-105 shadow-gold cursor-pointer'
                    : 'bg-gray-600/50 cursor-not-allowed opacity-50'
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
          <div className="mt-6 glass-effect rounded-lg p-4 border-l-4 border-gold-400">
            <div className="flex items-start">
              <svg className="w-5 h-5 text-gold-400 mr-3 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-white/80">
                <span className="font-bold text-gold-300">⚠️ Important:</span> Once you submit your vote, you cannot change it. Please review your selections carefully before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default VotingPage;