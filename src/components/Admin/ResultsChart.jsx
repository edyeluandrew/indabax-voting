import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell } from 'recharts';

const ResultsChart = ({ position, votes }) => {
  // Colors for bars
  const COLORS = ['#8b5cf6', '#3b82f6', '#06b6d4', '#10b981', '#f59e0b', '#ef4444'];

  // Prepare data for chart
  const chartData = position.candidates.map((candidate, index) => ({
    name: candidate,
    votes: votes[candidate] || 0,
    color: COLORS[index % COLORS.length]
  }));

  // Calculate total votes for this position
  const totalVotes = chartData.reduce((sum, item) => sum + item.votes, 0);

  // Find winner (candidate with most votes)
  const winner = chartData.reduce((max, item) => 
    item.votes > max.votes ? item : max
  , { votes: 0 });

  // Custom tooltip
  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const percentage = totalVotes > 0 ? ((data.votes / totalVotes) * 100).toFixed(1) : 0;
      
      return (
        <div className="bg-white p-4 rounded-lg shadow-xl border-2 border-purple-200">
          <p className="font-bold text-gray-800">{data.name}</p>
          <p className="text-purple-600 font-semibold">{data.votes} votes</p>
          <p className="text-sm text-gray-600">{percentage}% of total</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 animate-slide-up">
      {/* Position Header */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-2xl font-bold text-gray-800">{position.title}</h3>
          <span className="px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white font-bold rounded-full text-sm">
            {totalVotes} Total Votes
          </span>
        </div>
        <div className="h-1 w-full bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
      </div>

      {/* Winner Announcement */}
      {totalVotes > 0 && winner.votes > 0 && (
        <div className="mb-6 p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-l-4 border-green-500 rounded-lg">
          <p className="text-sm text-green-700 font-medium mb-1">🏆 Current Leader</p>
          <p className="text-lg font-bold text-green-800">{winner.name}</p>
          <p className="text-sm text-green-600">
            {winner.votes} votes ({((winner.votes / totalVotes) * 100).toFixed(1)}%)
          </p>
        </div>
      )}

      {/* Bar Chart */}
      {totalVotes > 0 ? (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis 
              dataKey="name" 
              angle={-45} 
              textAnchor="end" 
              height={100}
              tick={{ fill: '#4b5563', fontSize: 12 }}
            />
            <YAxis 
              tick={{ fill: '#4b5563' }}
              label={{ value: 'Votes', angle: -90, position: 'insideLeft', fill: '#4b5563' }}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="votes" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-64 flex items-center justify-center bg-gray-50 rounded-lg">
          <div className="text-center">
            <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="text-gray-500 font-medium">No votes yet for this position</p>
          </div>
        </div>
      )}

      {/* Detailed Vote Breakdown */}
      <div className="mt-6 space-y-2">
        <h4 className="text-sm font-bold text-gray-700 mb-3">Detailed Breakdown:</h4>
        {chartData.map((item, index) => {
          const percentage = totalVotes > 0 ? ((item.votes / totalVotes) * 100).toFixed(1) : 0;
          
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
              <div className="flex items-center space-x-3">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: item.color }}
                ></div>
                <span className="font-medium text-gray-700 text-sm">{item.name}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{percentage}%</span>
                <span className="font-bold text-purple-600">{item.votes}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ResultsChart;