import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useVotes } from '../../hooks/useVotes';
import { getAllPositions } from '../../config/positions';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { 
  BarChart3, 
  Users, 
  CheckSquare, 
  Briefcase, 
  Radio, 
  Lock, 
  FileText, 
  Download,
  FileSpreadsheet,
  FileBarChart
} from 'lucide-react';
import Navbar from '../Shared/Navbar';
import ResultsChart from './ResultsChart';
import LoadingSpinner from '../Shared/LoadingSpinner';

const AdminDashboard = () => {
  const { votes, loading: votesLoading, getPositionVotes, getTotalVotes } = useVotes();
  const { currentUser } = useAuth();
  const [totalVoters, setTotalVoters] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const positions = getAllPositions();

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const votersRef = collection(db, 'voters');
        const votersQuery = query(votersRef);
        const votersSnap = await getDocs(votersQuery);
        setTotalVoters(votersSnap.size);
      } catch (error) {
        console.error('Error fetching voters:', error);
      }
    };

    fetchVoters();
  }, [votes]);

  useEffect(() => {
    setLastUpdate(new Date());
  }, [votes]);

  // Export functions
  const exportToPDF = () => {
    const content = generateExportContent();
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IndabaX_Election_Results_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToExcel = () => {
    const csv = generateCSVContent();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IndabaX_Election_Results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToCSV = () => {
    const csv = generateCSVContent();
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `IndabaX_Election_Results_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateExportContent = () => {
    let content = 'INDABAX CLUB ELECTION RESULTS\n';
    content += '=================================\n\n';
    content += `Generated: ${new Date().toLocaleString()}\n`;
    content += `Total Voters: ${totalVoters}\n`;
    content += `Total Votes Cast: ${getTotalVotes()}\n`;
    content += `Total Positions: ${positions.length}\n\n`;
    
    positions.forEach(position => {
      const positionVotes = getPositionVotes(position.id);
      content += `\n${position.name.toUpperCase()}\n`;
      content += '-'.repeat(position.name.length) + '\n';
      
      if (positionVotes && positionVotes.length > 0) {
        positionVotes.forEach((vote, index) => {
          content += `${index + 1}. ${vote.candidateName}: ${vote.count} votes\n`;
        });
      } else {
        content += 'No votes recorded\n';
      }
    });
    
    return content;
  };

  const generateCSVContent = () => {
    let csv = 'Position,Candidate,Votes,Percentage\n';
    
    positions.forEach(position => {
      const positionVotes = getPositionVotes(position.id);
      const total = positionVotes.reduce((sum, v) => sum + v.count, 0);
      
      if (positionVotes && positionVotes.length > 0) {
        positionVotes.forEach(vote => {
          const percentage = total > 0 ? ((vote.count / total) * 100).toFixed(2) : '0.00';
          csv += `"${position.name}","${vote.candidateName}",${vote.count},${percentage}%\n`;
        });
      }
    });
    
    return csv;
  };

  if (votesLoading) {
    return <LoadingSpinner message="Loading election results..." />;
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen py-8 px-4" style={{ backgroundColor: '#e0e5ec' }}>
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <div className="inline-block mb-4">
              <div className="w-24 h-24 mx-auto rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
              }}>
                <BarChart3 className="w-12 h-12 text-white" />
              </div>
            </div>
            <h1 className="text-5xl font-bold mb-4" style={{ 
              background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              ADMIN DASHBOARD
            </h1>
            <p className="text-gray-600 text-lg">
              Real-time election results for IndabaX Club
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Voters */}
            <div className="rounded-2xl p-6 animate-slide-up" style={{
              background: '#e0e5ec',
              boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
            }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Total Voters</h3>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                }}>
                  <Users className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold" style={{ color: '#f59e0b' }}>{totalVoters}</p>
              <p className="text-sm text-gray-500 mt-1">Students have voted</p>
            </div>

            {/* Total Votes */}
            <div className="rounded-2xl p-6 animate-slide-up" style={{
              background: '#e0e5ec',
              boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
            }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Total Votes</h3>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                }}>
                  <CheckSquare className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold" style={{ color: '#a855f7' }}>{getTotalVotes()}</p>
              <p className="text-sm text-gray-500 mt-1">Across all positions</p>
            </div>

            {/* Total Positions */}
            <div className="rounded-2xl p-6 animate-slide-up" style={{
              background: '#e0e5ec',
              boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
            }}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-700">Positions</h3>
                <div className="w-12 h-12 rounded-full flex items-center justify-center" style={{
                  background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
                  boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                }}>
                  <Briefcase className="w-6 h-6 text-white" />
                </div>
              </div>
              <p className="text-4xl font-bold" style={{ color: '#3b82f6' }}>{positions.length}</p>
              <p className="text-sm text-gray-500 mt-1">Leadership roles</p>
            </div>
          </div>

          {/* Live Status */}
          <div className="rounded-xl p-4 mb-8 flex items-center justify-between animate-slide-up" style={{
            background: '#e0e5ec',
            boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
          }}>
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 rounded-full animate-pulse" style={{
                backgroundColor: '#10b981',
                boxShadow: '0 0 10px #10b981'
              }}></div>
              <Radio className="w-5 h-5 text-green-500" />
              <span className="text-gray-700 font-medium">Live Updates Active</span>
            </div>
            <span className="text-gray-500 text-sm">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>

          {/* Admin Info */}
          <div className="rounded-xl p-4 mb-8 animate-slide-up" style={{
            background: '#e0e5ec',
            boxShadow: '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff'
          }}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{
                background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
              }}>
                <Lock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-700">Logged in as Admin</p>
                <p className="text-sm" style={{ color: '#f59e0b' }}>{currentUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Position Results */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold mb-6 animate-fade-in" style={{ 
              background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Results by Position
            </h2>

            {positions.map((position) => (
              <ResultsChart
                key={position.id}
                position={position}
                votes={getPositionVotes(position.id)}
              />
            ))}
          </div>

          {/* Export Options */}
          <div className="mt-12 rounded-xl p-6 text-center animate-slide-up" style={{
            background: '#e0e5ec',
            boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
          }}>
            <h3 className="text-xl font-bold mb-4" style={{ 
              background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>Export Results</h3>
            <p className="text-gray-600 mb-4">Download election results for official records</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button 
                onClick={exportToPDF}
                className="flex items-center space-x-2 px-6 py-3 font-bold rounded-lg transform transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                  color: 'white',
                  boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #047857, inset -4px -4px 8px #34d399';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FileText className="w-5 h-5" />
                <span>Export as TXT</span>
              </button>
              <button 
                onClick={exportToExcel}
                className="flex items-center space-x-2 px-6 py-3 font-bold rounded-lg transform transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                  color: 'white',
                  boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #d97706, inset -4px -4px 8px #fcd34d';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <FileSpreadsheet className="w-5 h-5" />
                <span>Export as CSV</span>
              </button>
              <button 
                onClick={exportToCSV}
                className="flex items-center space-x-2 px-6 py-3 font-bold rounded-lg transform transition-all duration-300"
                style={{
                  background: 'linear-gradient(135deg, #a855f7 0%, #7c3aed 100%)',
                  color: 'white',
                  boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #6d28d9, inset -4px -4px 8px #c084fc';
                  e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.boxShadow = '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff';
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Download className="w-5 h-5" />
                <span>Quick Download</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .animate-fade-in {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slide-up {
          animation: slideUp 0.6s ease-out;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>
    </>
  );
};

export default AdminDashboard;