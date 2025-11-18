import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Trophy, TrendingUp } from 'lucide-react';

const ResultsChart = ({ position, votes }) => {
  // Calculate total votes and percentages
  const totalVotes = votes.reduce((sum, vote) => sum + vote.count, 0);
  
  // Prepare data for pie chart
  const chartData = votes.map(vote => ({
    name: vote.candidateName,
    value: vote.count,
    percentage: totalVotes > 0 ? ((vote.count / totalVotes) * 100).toFixed(1) : 0
  }));

  // Sort to find winner
  const sortedVotes = [...votes].sort((a, b) => b.count - a.count);
  const winner = sortedVotes[0];

  // Colors for pie chart
  const COLORS = [
    '#fbbf24', // yellow
    '#a855f7', // purple
    '#3b82f6', // blue
    '#10b981', // green
    '#ef4444', // red
    '#ec4899', // pink
    '#f59e0b', // orange
    '#8b5cf6', // violet
  ];

  // Custom label for pie chart
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage }) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percentage < 5) return null; // Don't show label for small slices

    return (
      <text 
        x={x} 
        y={y} 
        fill="white" 
        textAnchor={x > cx ? 'start' : 'end'} 
        dominantBaseline="central"
        className="font-bold text-sm"
      >
        {`${percentage}%`}
      </text>
    );
  };

  return (
    <div 
      className="rounded-2xl p-6 animate-slide-up"
      style={{
        background: '#e0e5ec',
        boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
      }}
    >
      {/* Position Header */}
      <div className="mb-6">
        <h3 
          className="text-2xl font-bold mb-2"
          style={{ 
            background: 'linear-gradient(135deg, #fbbf24 0%, #a855f7 50%, #3b82f6 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}
        >
          {position.name}
        </h3>
        <p className="text-gray-600">Total Votes: <span className="font-semibold">{totalVotes}</span></p>
      </div>

      {votes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No votes recorded yet for this position</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: '#e0e5ec',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
                  }}
                  formatter={(value, name, props) => [
                    `${value} votes (${props.payload.percentage}%)`,
                    name
                  ]}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Results List */}
          <div className="space-y-3">
            {sortedVotes.map((vote, index) => {
              const percentage = totalVotes > 0 ? ((vote.count / totalVotes) * 100).toFixed(1) : 0;
              const isWinner = index === 0;
              
              return (
                <div
                  key={vote.candidateId}
                  className="rounded-xl p-4 transition-all duration-300"
                  style={{
                    background: '#e0e5ec',
                    boxShadow: isWinner 
                      ? '6px 6px 12px #b8bec5, -6px -6px 12px #ffffff, inset 2px 2px 4px rgba(251, 191, 36, 0.1)'
                      : 'inset 3px 3px 6px #b8bec5, inset -3px -3px 6px #ffffff'
                  }}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-3">
                      {isWinner && (
                        <div 
                          className="w-8 h-8 rounded-lg flex items-center justify-center"
                          style={{
                            background: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 100%)',
                            boxShadow: '2px 2px 4px #b8bec5'
                          }}
                        >
                          <Trophy className="w-4 h-4 text-white" />
                        </div>
                      )}
                      <div>
                        <p className="font-bold text-gray-800 text-lg">
                          {vote.candidateName}
                        </p>
                        {isWinner && (
                          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
                            Leading
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-2xl font-bold" style={{ 
                        color: COLORS[index % COLORS.length] 
                      }}>
                        {vote.count}
                      </p>
                      <p className="text-sm text-gray-600">{percentage}%</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{
                      background: '#e0e5ec',
                      boxShadow: 'inset 2px 2px 4px #b8bec5, inset -2px -2px 4px #ffffff'
                    }}
                  >
                    <div
                      className="h-full transition-all duration-500 rounded-full"
                      style={{
                        width: `${percentage}%`,
                        background: `linear-gradient(90deg, ${COLORS[index % COLORS.length]}, ${COLORS[(index + 1) % COLORS.length]})`,
                        boxShadow: `0 0 8px ${COLORS[index % COLORS.length]}`
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultsChart;