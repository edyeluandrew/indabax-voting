import React, { useRef } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import { Trophy, TrendingUp, Download } from 'lucide-react';
import { toPng } from 'html-to-image';
import { getCandidateById } from '../../config/positions';

const ResultsChart = ({ position, votes }) => {
  const chartRef = useRef();

  // Ensure votes is always an array and has valid structure
  const safeVotes = (() => {
    if (!votes) return [];
    if (!Array.isArray(votes)) return [];
    
    // Filter out invalid items and ensure count is a number
    return votes.filter(vote => 
      vote && 
      typeof vote === 'object' && 
      'candidateId' in vote && 
      'candidateName' in vote
    ).map(vote => ({
      ...vote,
      count: typeof vote.count === 'number' ? vote.count : 0,
      // Get candidate details including image
      candidateDetails: getCandidateById(vote.candidateId) || {
        name: vote.candidateName,
        image: null,
        bio: ''
      }
    }));
  })();

  // Calculate total votes and percentages safely
  const totalVotes = safeVotes.reduce((sum, vote) => sum + vote.count, 0);
  
  // Prepare data for pie chart
  const chartData = safeVotes.map(vote => ({
    name: vote.candidateName || 'Unknown Candidate',
    value: vote.count,
    percentage: totalVotes > 0 ? ((vote.count / totalVotes) * 100).toFixed(1) : 0,
    candidateDetails: vote.candidateDetails
  }));

  // Sort to find winner
  const sortedVotes = [...safeVotes].sort((a, b) => b.count - a.count);
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

  // Enhanced custom label for pie chart with better positioning
  const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percentage, index }) => {
    const RADIAN = Math.PI / 180;
    
    // For very small slices (less than 3%), don't show label at all
    if (percentage < 3) return null;

    // Adjust radius based on slice size
    const radius = innerRadius + (outerRadius - innerRadius) * (percentage < 10 ? 0.7 : 0.5);
    
    // Calculate position with better offset for small slices
    const x = cx + (radius + (percentage < 8 ? 10 : 0)) * Math.cos(-midAngle * RADIAN);
    const y = cy + (radius + (percentage < 8 ? 10 : 0)) * Math.sin(-midAngle * RADIAN);

    // Determine text anchor and dominant baseline based on angle
    const textAnchor = x > cx ? 'start' : 'end';
    const dominantBaseline = 'central';

    // For very small slices, use a callout line
    if (percentage < 8) {
      const endX = cx + (outerRadius + 15) * Math.cos(-midAngle * RADIAN);
      const endY = cy + (outerRadius + 15) * Math.sin(-midAngle * RADIAN);
      
      return (
        <g>
          {/* Callout line */}
          <line
            x1={x}
            y1={y}
            x2={endX}
            y2={endY}
            stroke={COLORS[index % COLORS.length]}
            strokeWidth={1}
          />
          {/* Percentage text */}
          <text 
            x={endX + (textAnchor === 'start' ? 5 : -5)} 
            y={endY} 
            fill={COLORS[index % COLORS.length]}
            textAnchor={textAnchor}
            dominantBaseline={dominantBaseline}
            className="font-bold text-xs"
            style={{
              filter: 'drop-shadow(1px 1px 2px rgba(0,0,0,0.3))'
            }}
          >
            {`${percentage}%`}
          </text>
        </g>
      );
    }

    // For medium slices, show label inside with background
    return (
      <g>
        {/* Background for better readability */}
        <rect
          x={x - 20}
          y={y - 8}
          width={40}
          height={16}
          fill="rgba(255, 255, 255, 0.9)"
          rx={4}
          ry={4}
        />
        {/* Percentage text */}
        <text 
          x={x} 
          y={y} 
          fill="#1f2937"
          textAnchor="middle"
          dominantBaseline="middle"
          className="font-bold text-xs"
        >
          {`${percentage}%`}
        </text>
      </g>
    );
  };

  // Custom legend formatter to show percentages
  const renderLegend = (value, entry, index) => {
    const percentage = chartData[index]?.percentage || 0;
    return (
      <span style={{ color: '#1f2937', fontSize: '12px', fontWeight: '600' }}>
        {value} ({percentage}%)
      </span>
    );
  };

  // Download chart as PNG
  const downloadChart = async () => {
    if (chartRef.current === null) {
      return;
    }

    try {
      const dataUrl = await toPng(chartRef.current, { 
        cacheBust: true,
        backgroundColor: '#e0e5ec',
        quality: 0.95,
        pixelRatio: 2
      });
      
      const link = document.createElement('a');
      link.download = `${position?.name || 'position'}_results.png`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Error downloading chart:', err);
    }
  };

  // Safe position name
  const positionName = position?.name || 'Unknown Position';

  return (
    <div 
      ref={chartRef}
      className="rounded-2xl p-6 animate-slide-up relative"
      style={{
        background: '#e0e5ec',
        boxShadow: '8px 8px 16px #b8bec5, -8px -8px 16px #ffffff'
      }}
    >
      {/* Download Button */}
      <button
        onClick={downloadChart}
        className="absolute top-4 right-4 flex items-center space-x-2 px-4 py-2 font-bold rounded-lg transform transition-all duration-300 z-10"
        style={{
          background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)',
          color: 'white',
          boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.boxShadow = 'inset 4px 4px 8px #1d4ed8, inset -4px -4px 8px #60a5fa';
          e.currentTarget.style.transform = 'scale(0.95)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.boxShadow = '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff';
          e.currentTarget.style.transform = 'scale(1)';
        }}
      >
        <Download className="w-4 h-4" />
        <span className="text-sm">Download</span>
      </button>

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
          {positionName}
        </h3>
        <p className="text-gray-600">Total Votes: <span className="font-semibold">{totalVotes}</span></p>
      </div>

      {safeVotes.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          <p>No votes recorded yet for this position</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pie Chart */}
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={320}>
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={renderCustomLabel}
                  outerRadius={110}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  paddingAngle={1} // Small gap between slices
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[index % COLORS.length]}
                      stroke="#e0e5ec"
                      strokeWidth={2}
                    />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{
                    background: '#e0e5ec',
                    border: 'none',
                    borderRadius: '12px',
                    boxShadow: '4px 4px 8px #b8bec5, -4px -4px 8px #ffffff',
                    fontSize: '14px',
                    fontWeight: '600'
                  }}
                  formatter={(value, name, props) => [
                    `${value} votes (${props.payload.percentage}%)`,
                    name
                  ]}
                  labelStyle={{
                    fontWeight: '700',
                    color: '#1f2937'
                  }}
                />
                <Legend 
                  formatter={renderLegend}
                  wrapperStyle={{
                    paddingTop: '20px',
                    fontSize: '12px'
                  }}
                  layout="horizontal"
                  verticalAlign="bottom"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Results List with Images */}
          <div className="space-y-3">
            {sortedVotes.map((vote, index) => {
              const percentage = totalVotes > 0 ? ((vote.count / totalVotes) * 100).toFixed(1) : 0;
              const isWinner = index === 0 && vote.count > 0;
              const candidateDetails = vote.candidateDetails;
              
              return (
                <div
                  key={vote.candidateId || index}
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
                      {/* Candidate Image */}
                      <div className="relative">
                        <div className={`
                          w-12 h-12 rounded-full overflow-hidden border-2 transition-all
                          ${isWinner ? 'border-yellow-500' : 'border-gray-300'}
                        `}>
                          {candidateDetails.image ? (
                            <img
                              src={candidateDetails.image}
                              alt={candidateDetails.name}
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                e.target.style.display = 'none';
                                e.target.nextSibling.style.display = 'flex';
                              }}
                            />
                          ) : null}
                          {/* Fallback Avatar */}
                          <div 
                            className={`
                              w-full h-full rounded-full flex items-center justify-center
                              ${isWinner 
                                ? 'bg-gradient-to-br from-yellow-400 to-yellow-600 text-white' 
                                : 'bg-gradient-to-br from-gray-400 to-gray-600 text-white'
                              }
                            `}
                            style={{ display: candidateDetails.image ? 'none' : 'flex' }}
                          >
                            <span className="text-lg font-bold">
                              {candidateDetails.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        {/* Winner Crown */}
                        {isWinner && (
                          <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-500 rounded-full flex items-center justify-center">
                            <Trophy className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </div>

                      <div className="min-w-0 flex-1">
                        <p className="font-bold text-gray-800 text-lg truncate">
                          {candidateDetails.name}
                        </p>
                        {isWinner && (
                          <span className="text-xs font-semibold" style={{ color: '#f59e0b' }}>
                            Leading
                          </span>
                        )}
                      </div>
                    </div>
                    
                    <div className="text-right flex-shrink-0 ml-2">
                      <p className="text-2xl font-bold" style={{ 
                        color: COLORS[index % COLORS.length] 
                      }}>
                        {vote.count}
                      </p>
                      <p className="text-sm text-gray-600 font-semibold">{percentage}%</p>
                    </div>
                  </div>
                  
                  {/* Progress Bar */}
                  <div 
                    className="h-2 rounded-full overflow-hidden mt-2"
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