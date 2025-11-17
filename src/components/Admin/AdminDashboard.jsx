import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { useVotes } from '../../hooks/useVotes';
import { getAllPositions } from '../../config/positions';
import { collection, query, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import Navbar from '../Shared/Navbar';
import ResultsChart from './ResultsChart';
import LoadingSpinner from '../Shared/LoadingSpinner';

const AdminDashboard = () => {
  const { votes, loading: votesLoading, getPositionVotes, getTotalVotes } = useVotes();
  const { currentUser } = useAuth();
  const [totalVoters, setTotalVoters] = useState(0);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const positions = getAllPositions();

  // Fetch total number of voters
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
  }, [votes]); // Re-fetch when votes change

  // Update last update time
  useEffect(() => {
    setLastUpdate(new Date());
  }, [votes]);

  if (votesLoading) {
    return <LoadingSpinner message="Loading election results..." />;
  }

  return (
    <>
      <Navbar />
      
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8 animate-fade-in">
            <h1 className="text-4xl md:text-5xl font-bold gradient-text mb-4">
              📊 Admin Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Real-time election results for IndabaX Club
            </p>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {/* Total Voters */}
            <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">Total Voters</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <p className="text-4xl font-bold">{totalVoters}</p>
              <p className="text-sm opacity-75 mt-1">People have voted</p>
            </div>

            {/* Total Votes Cast */}
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">Total Votes</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <p className="text-4xl font-bold">{getTotalVotes()}</p>
              <p className="text-sm opacity-75 mt-1">Across all positions</p>
            </div>

            {/* Total Positions */}
            <div className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-xl shadow-lg p-6 text-white transform hover:scale-105 transition-all duration-300 animate-slide-up">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold opacity-90">Positions</h3>
                <svg className="w-8 h-8 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-4xl font-bold">{positions.length}</p>
              <p className="text-sm opacity-75 mt-1">Leadership roles</p>
            </div>
          </div>

          {/* Last Update Time */}
          <div className="bg-white rounded-xl shadow-lg p-4 mb-8 flex items-center justify-between animate-slide-up">
            <div className="flex items-center space-x-3">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-gray-700 font-medium">Live Updates</span>
            </div>
            <span className="text-gray-600 text-sm">
              Last updated: {lastUpdate.toLocaleTimeString()}
            </span>
          </div>

          {/* Admin Info Banner */}
          <div className="bg-gradient-to-r from-purple-100 to-blue-100 border-2 border-purple-300 rounded-xl p-4 mb-8 animate-slide-up">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-blue-500 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <div>
                <p className="font-semibold text-gray-800">Logged in as Admin</p>
                <p className="text-sm text-gray-600">{currentUser?.email}</p>
              </div>
            </div>
          </div>

          {/* Position Results */}
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 animate-fade-in">
              Results by Position
            </h2>

            {positions.map((position, index) => (
              <ResultsChart
                key={position.id}
                position={position}
                votes={getPositionVotes(position.id)}
              />
            ))}
          </div>

          {/* Export Options (Future Enhancement) */}
          <div className="mt-12 bg-white rounded-xl shadow-lg p-6 text-center animate-slide-up">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Export Results</h3>
            <p className="text-gray-600 mb-4">Download election results for official records</p>
            <div className="flex flex-wrap justify-center gap-4">
              <button className="px-6 py-3 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold rounded-lg hover:from-green-600 hover:to-emerald-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                📊 Export as PDF
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold rounded-lg hover:from-blue-600 hover:to-cyan-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                📑 Export as Excel
              </button>
              <button className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold rounded-lg hover:from-purple-600 hover:to-pink-600 transform hover:scale-105 transition-all duration-300 shadow-lg">
                📄 Export as CSV
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-4">Note: Export functionality coming soon</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;