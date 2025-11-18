import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Vote, CheckCircle2, AlertCircle, Send, User, Award } from 'lucide-react';
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
      <div style={{
        minHeight: '100vh',
        backgroundColor: '#e0e5ec',
        paddingTop: '80px',
        paddingBottom: '40px'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px'
        }}>
          {/* Header */}
          <div style={{
            background: '#e0e5ec',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '30px',
            boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'inline-block',
              marginBottom: '20px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '5px 5px 10px #b8bec5, -5px -5px 10px #ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto'
              }}>
                <Vote size={40} color="white" strokeWidth={2.5} />
              </div>
            </div>

            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              marginBottom: '12px'
            }}>
              Cast Your Vote
            </h1>
            <p style={{
              fontSize: '1.1rem',
              color: '#64748b',
              marginBottom: '20px',
              fontWeight: '500'
            }}>
              Select one candidate for each position below
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              background: '#e0e5ec',
              borderRadius: '12px',
              padding: '12px 24px',
              boxShadow: 'inset 4px 4px 8px #b8bec5, inset -4px -4px 8px #ffffff'
            }}>
              <User size={18} color="#f59e0b" />
              <span style={{
                fontSize: '0.95rem',
                color: '#1e293b',
                fontWeight: '700'
              }}>
                {currentUser?.email}
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div style={{
            background: '#e0e5ec',
            borderRadius: '20px',
            padding: '30px',
            marginBottom: '30px',
            boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Award size={24} color="#f59e0b" strokeWidth={2.5} />
                <h3 style={{
                  fontSize: '1.3rem',
                  fontWeight: '700',
                  color: '#1e293b',
                  margin: 0
                }}>
                  Voting Progress
                </h3>
              </div>
              <div style={{
                background: getProgress() === 100
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                color: 'white',
                padding: '8px 16px',
                borderRadius: '10px',
                fontWeight: '700',
                fontSize: '0.95rem',
                boxShadow: '3px 3px 6px #b8bec5, -3px -3px 6px #ffffff'
              }}>
                {Object.keys(selectedVotes).length} / {positions.length}
              </div>
            </div>
            
            {/* Progress Bar */}
            <div style={{
              background: '#e0e5ec',
              borderRadius: '16px',
              padding: '8px',
              boxShadow: 'inset 4px 4px 8px #b8bec5, inset -4px -4px 8px #ffffff',
              marginBottom: '20px'
            }}>
              <div style={{
                height: '24px',
                background: getProgress() === 100 
                  ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                  : 'linear-gradient(90deg, #fbbf24 0%, #f59e0b 100%)',
                borderRadius: '12px',
                width: `${getProgress()}%`,
                transition: 'width 0.3s ease',
                boxShadow: getProgress() === 100
                  ? '0 2px 8px rgba(16, 185, 129, 0.4)'
                  : '0 2px 8px rgba(251, 191, 36, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'flex-end',
                paddingRight: '8px'
              }}>
                {getProgress() > 15 && (
                  <span style={{
                    color: 'white',
                    fontSize: '0.75rem',
                    fontWeight: '700'
                  }}>
                    {getProgress()}%
                  </span>
                )}
              </div>
            </div>

            {/* Selected Candidates Pills */}
            {Object.keys(selectedVotes).length > 0 && (
              <div style={{
                marginTop: '20px'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  marginBottom: '12px'
                }}>
                  <CheckCircle2 size={18} color="#10b981" strokeWidth={2.5} />
                  <p style={{
                    fontSize: '0.9rem',
                    color: '#475569',
                    fontWeight: '600',
                    margin: 0
                  }}>
                    Your Selections:
                  </p>
                </div>
                <div style={{
                  display: 'flex',
                  flexWrap: 'wrap',
                  gap: '10px'
                }}>
                  {Object.entries(selectedVotes).map(([positionId, candidate]) => {
                    const position = positions.find(p => p.id === positionId);
                    return (
                      <div
                        key={positionId}
                        style={{
                          background: '#e0e5ec',
                          borderRadius: '12px',
                          padding: '10px 16px',
                          boxShadow: 'inset 3px 3px 6px #b8bec5, inset -3px -3px 6px #ffffff',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        <div style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        }} />
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: '600',
                          color: '#1e293b'
                        }}>
                          {position?.title}:
                        </span>
                        <span style={{
                          fontSize: '0.85rem',
                          fontWeight: '700',
                          background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                          WebkitBackgroundClip: 'text',
                          WebkitTextFillColor: 'transparent'
                        }}>
                          {candidate.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
            
            <div style={{
              marginTop: '16px',
              padding: '12px',
              background: getProgress() === 100 ? '#d1fae5' : '#fee2e2',
              borderRadius: '10px',
              boxShadow: 'inset 2px 2px 4px rgba(0,0,0,0.05)'
            }}>
              <p style={{
                fontSize: '0.9rem',
                color: getProgress() === 100 ? '#065f46' : '#991b1b',
                textAlign: 'center',
                margin: 0,
                fontWeight: '700',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
              }}>
                {getProgress() === 100 ? (
                  <>
                    <CheckCircle2 size={18} strokeWidth={2.5} />
                    All positions selected! Ready to submit.
                  </>
                ) : (
                  <>
                    <AlertCircle size={18} strokeWidth={2.5} />
                    Please complete {positions.length - Object.keys(selectedVotes).length} more position(s)
                  </>
                )}
              </p>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div style={{
              background: '#e0e5ec',
              borderRadius: '16px',
              padding: '20px',
              marginBottom: '30px',
              boxShadow: 'inset 5px 5px 10px #dc2626, inset -5px -5px 10px #fca5a5',
              border: '2px solid #ef4444'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <AlertCircle size={24} color="#dc2626" strokeWidth={2.5} />
                <div style={{ flex: 1 }}>
                  <p style={{
                    color: '#991b1b',
                    fontWeight: '700',
                    margin: '0 0 8px 0',
                    fontSize: '1rem'
                  }}>
                    {error}
                  </p>
                  <p style={{
                    color: '#dc2626',
                    fontSize: '0.875rem',
                    margin: 0,
                    fontWeight: '500'
                  }}>
                    If this problem persists, please contact the administrator.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Position Cards */}
          <div style={{
            display: 'grid',
            gap: '24px',
            marginBottom: '30px'
          }}>
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
          <div style={{
            background: '#e0e5ec',
            borderRadius: '20px',
            padding: '40px',
            marginBottom: '30px',
            boxShadow: '10px 10px 20px #b8bec5, -10px -10px 20px #ffffff',
            textAlign: 'center'
          }}>
            <h3 style={{
              fontSize: '1.5rem',
              fontWeight: '700',
              color: '#1e293b',
              marginBottom: '12px'
            }}>
              Ready to submit your vote?
            </h3>
            <p style={{
              fontSize: '1rem',
              color: allPositionsSelected() ? '#059669' : '#ef4444',
              marginBottom: '24px',
              fontWeight: '700'
            }}>
              {allPositionsSelected() 
                ? 'All positions selected. Click submit below.' 
                : `Please select ${positions.length - Object.keys(selectedVotes).length} more position(s)`}
            </p>
            
            <button
              onClick={handleSubmit}
              disabled={!allPositionsSelected() || submitting}
              style={{
                background: allPositionsSelected() && !submitting
                  ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                  : '#cbd5e1',
                color: 'white',
                border: 'none',
                borderRadius: '16px',
                padding: '18px 48px',
                fontSize: '1.1rem',
                fontWeight: '700',
                cursor: allPositionsSelected() && !submitting ? 'pointer' : 'not-allowed',
                boxShadow: allPositionsSelected() && !submitting
                  ? '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
                  : 'inset 4px 4px 8px #b8bec5, inset -4px -4px 8px #ffffff',
                transition: 'all 0.3s ease',
                opacity: allPositionsSelected() && !submitting ? 1 : 0.6,
                transform: 'scale(1)',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '10px'
              }}
              onMouseEnter={(e) => {
                if (allPositionsSelected() && !submitting) {
                  e.currentTarget.style.boxShadow = 'inset 5px 5px 10px #059669, inset -5px -5px 10px #34d399';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }
              }}
              onMouseLeave={(e) => {
                if (allPositionsSelected() && !submitting) {
                  e.currentTarget.style.boxShadow = '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }
              }}
            >
              {submitting ? (
                <>
                  <span style={{
                    display: 'inline-block',
                    width: '18px',
                    height: '18px',
                    border: '3px solid rgba(255,255,255,0.3)',
                    borderTopColor: 'white',
                    borderRadius: '50%',
                    animation: 'spin 0.8s linear infinite'
                  }} />
                  Submitting...
                </>
              ) : (
                <>
                  <Send size={20} strokeWidth={2.5} />
                  Submit My Vote
                </>
              )}
            </button>
          </div>

          {/* Important Notice */}
          <div style={{
            background: '#e0e5ec',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: 'inset 5px 5px 10px #f59e0b, inset -5px -5px 10px #fcd34d',
            border: '2px solid #fbbf24',
            textAlign: 'center'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px'
            }}>
              <AlertCircle size={20} color="#92400e" strokeWidth={2.5} />
              <p style={{
                color: '#92400e',
                fontSize: '0.95rem',
                fontWeight: '700',
                margin: 0,
                lineHeight: '1.6'
              }}>
                <strong>Important:</strong> Once you submit your vote, you cannot change it. 
                Please review your selections carefully before submitting.
              </p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </>
  );
};

export default VotingPage;