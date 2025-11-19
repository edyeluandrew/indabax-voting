import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Trash2, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';
import { 
  collection, 
  getDocs, 
  doc, 
  writeBatch
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Shared/Navbar';

const ClearDatabaseAdmin = () => {
  const [isClearing, setIsClearing] = useState(false);
  const [status, setStatus] = useState(null);
  const [stats, setStats] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  // Get counts before deletion
  const getCounts = async () => {
    try {
      const votersSnapshot = await getDocs(collection(db, 'voters'));
      const votesSnapshot = await getDocs(collection(db, 'votes'));
      
      return {
        voters: votersSnapshot.size,
        votes: votesSnapshot.size,
        total: votersSnapshot.size + votesSnapshot.size
      };
    } catch (error) {
      console.error('Error getting counts:', error);
      return null;
    }
  };

  // Clear all data
  const clearAllData = async () => {
    try {
      setIsClearing(true);
      setStatus({ type: 'loading', message: 'Counting records...' });

      // Get counts before deletion
      const counts = await getCounts();
      if (!counts) {
        throw new Error('Failed to get record counts');
      }

      setStatus({ type: 'loading', message: `Found ${counts.voters} voters and ${counts.votes} votes. Starting deletion...` });

      // Delete all voters
      if (counts.voters > 0) {
        setStatus({ type: 'loading', message: `Deleting ${counts.voters} voter records...` });
        const votersSnapshot = await getDocs(collection(db, 'voters'));
        const batch = writeBatch(db);
        let batchCount = 0;

        votersSnapshot.forEach((docSnap) => {
          batch.delete(doc(db, 'voters', docSnap.id));
          batchCount++;
          if (batchCount === 500) {
            batch.commit();
            batchCount = 0;
          }
        });

        if (batchCount > 0) {
          await batch.commit();
        }
      }

      // Delete all votes
      if (counts.votes > 0) {
        setStatus({ type: 'loading', message: `Deleting ${counts.votes} vote records...` });
        const votesSnapshot = await getDocs(collection(db, 'votes'));
        const batch = writeBatch(db);
        let batchCount = 0;

        votesSnapshot.forEach((docSnap) => {
          batch.delete(doc(db, 'votes', docSnap.id));
          batchCount++;
          if (batchCount === 500) {
            batch.commit();
            batchCount = 0;
          }
        });

        if (batchCount > 0) {
          await batch.commit();
        }
      }

      setStatus({
        type: 'success',
        message: `✓ Successfully deleted ${counts.voters} voters and ${counts.votes} votes! Database is now clean.`
      });
      setStats(counts);
      setConfirmDelete(false);
      setIsClearing(false);

    } catch (error) {
      console.error('Error clearing database:', error);
      setStatus({
        type: 'error',
        message: `✗ Error: ${error.message}`
      });
      setIsClearing(false);
    }
  };

  const handleClear = () => {
    if (confirmDelete) {
      clearAllData();
    } else {
      setConfirmDelete(true);
    }
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#e0e5ec' }}>
        <div className="max-w-2xl mx-auto">
          {/* Back Button */}
          <Link
            to="/admin/dashboard"
            className="inline-flex items-center space-x-2 mb-6 px-4 py-2 font-bold rounded-lg"
            style={{
              background: '#e0e5ec',
              color: '#1f2937',
              boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff',
              textDecoration: 'none'
            }}
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Back to Dashboard</span>
          </Link>

          {/* Header */}
          <div className="text-center mb-8">
            <div className="inline-block mb-4">
              <div 
                className="w-20 h-20 mx-auto rounded-full flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
                }}
              >
                <Trash2 className="w-10 h-10 text-white" />
              </div>
            </div>
            <h1 className="text-4xl font-bold mb-2 text-gray-800">Clear Database</h1>
            <p className="text-gray-600">Remove all test users and votes before deployment</p>
          </div>

          {/* Warning Box */}
          <div 
            className="rounded-2xl p-6 mb-6 border-2"
            style={{
              background: '#fee2e2',
              borderColor: '#fca5a5',
              boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
            }}
          >
            <div className="flex items-start space-x-3">
              <AlertTriangle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
              <div>
                <h3 className="font-bold text-red-800 mb-2">⚠️ WARNING</h3>
                <p className="text-red-700 text-sm mb-3">
                  This action will permanently delete all voter records and votes from the database. This action <span className="font-bold">CANNOT BE UNDONE</span>.
                </p>
                <ul className="text-red-700 text-sm space-y-1 ml-4 list-disc">
                  <li>All test voters will be deleted</li>
                  <li>All votes will be removed</li>
                  <li>The election will be reset to zero votes</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Status Messages */}
          {status && (
            <div 
              className="rounded-xl p-4 mb-6 flex items-start space-x-3"
              style={{
                background: status.type === 'error' ? '#fee2e2' : 
                           status.type === 'success' ? '#dcfce7' : 
                           '#fef3c7',
                boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
              }}
            >
              {status.type === 'error' ? (
                <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              ) : status.type === 'success' ? (
                <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              ) : (
                <div className="w-5 h-5 border-2 border-yellow-600 border-t-transparent rounded-full animate-spin flex-shrink-0 mt-0.5" />
              )}
              <p 
                className="text-sm font-medium"
                style={{
                  color: status.type === 'error' ? '#7f1d1d' :
                         status.type === 'success' ? '#166534' :
                         '#92400e'
                }}
              >
                {status.message}
              </p>
            </div>
          )}

          {/* Stats Display */}
          {stats && (
            <div className="grid grid-cols-3 gap-4 mb-6">
              <div 
                className="rounded-xl p-4 text-center"
                style={{
                  background: '#e0e5ec',
                  boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
                }}
              >
                <p className="text-2xl font-bold text-red-600">{stats.voters}</p>
                <p className="text-xs text-gray-600 mt-1">Voters Deleted</p>
              </div>
              <div 
                className="rounded-xl p-4 text-center"
                style={{
                  background: '#e0e5ec',
                  boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
                }}
              >
                <p className="text-2xl font-bold text-red-600">{stats.votes}</p>
                <p className="text-xs text-gray-600 mt-1">Votes Deleted</p>
              </div>
              <div 
                className="rounded-xl p-4 text-center"
                style={{
                  background: '#e0e5ec',
                  boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
                }}
              >
                <p className="text-2xl font-bold text-green-600">{stats.total}</p>
                <p className="text-xs text-gray-600 mt-1">Total Deleted</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-3">
            {!confirmDelete ? (
              <button
                onClick={handleClear}
                disabled={isClearing}
                className="w-full py-4 px-6 font-bold rounded-lg transform transition-all duration-300 text-white"
                style={{
                  background: isClearing ? '#9ca3af' : 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff',
                  cursor: isClearing ? 'not-allowed' : 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (!isClearing) {
                    e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #991b1b, inset -4px -4px 8px #fca5a5';
                    e.currentTarget.style.transform = 'scale(0.98)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isClearing) {
                    e.currentTarget.style.boxShadow = '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff';
                    e.currentTarget.style.transform = 'scale(1)';
                  }
                }}
              >
                {isClearing ? 'Clearing Database...' : 'Clear All Data'}
              </button>
            ) : (
              <>
                <div className="bg-red-50 border-2 border-red-300 rounded-xl p-4 text-center">
                  <p className="font-bold text-red-800 mb-3">Are you absolutely sure?</p>
                  <p className="text-red-700 text-sm mb-4">This will delete everything. This action cannot be reversed.</p>
                </div>
                <button
                  onClick={handleClear}
                  disabled={isClearing}
                  className="w-full py-4 px-6 font-bold rounded-lg transform transition-all duration-300 text-white"
                  style={{
                    background: 'linear-gradient(135deg, #dc2626 0%, #991b1b 100%)',
                    boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff',
                    cursor: isClearing ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isClearing) {
                      e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #7f1d1d, inset -4px -4px 8px #f87171';
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isClearing) {
                      e.currentTarget.style.boxShadow = '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  {isClearing ? 'Clearing...' : 'Yes, Delete Everything'}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  disabled={isClearing}
                  className="w-full py-4 px-6 font-bold rounded-lg transform transition-all duration-300"
                  style={{
                    background: '#e0e5ec',
                    color: '#1f2937',
                    boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff',
                    cursor: isClearing ? 'not-allowed' : 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    if (!isClearing) {
                      e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #b8bec5, inset -4px -4px 8px #ffffff';
                      e.currentTarget.style.transform = 'scale(0.98)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isClearing) {
                      e.currentTarget.style.boxShadow = '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff';
                      e.currentTarget.style.transform = 'scale(1)';
                    }
                  }}
                >
                  Cancel
                </button>
              </>
            )}
          </div>

          {/* Info Box */}
          <div 
            className="rounded-xl p-4 mt-8"
            style={{
              background: '#e0e5ec',
              boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
            }}
          >
            <h3 className="font-bold text-gray-800 mb-2">💡 What happens:</h3>
            <ul className="text-sm text-gray-700 space-y-1 ml-4 list-disc">
              <li>All voter documents in the 'voters' collection will be deleted</li>
              <li>All vote documents in the 'votes' collection will be deleted</li>
              <li>The dashboard will show 0 voters, 0 votes, and 0% for all positions</li>
              <li>Users will be able to vote fresh when deployment goes live</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ClearDatabaseAdmin;