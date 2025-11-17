import React from 'react';

const PositionCard = ({ position, selectedCandidate, onSelectCandidate }) => {
  const { id, title, candidates } = position;

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 hover:shadow-2xl transition-all duration-300 card-hover animate-slide-up">
      {/* Position Title */}
      <div className="mb-6">
        <h3 className="text-2xl font-bold text-gray-800 mb-2">{title}</h3>
        <div className="h-1 w-20 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full"></div>
      </div>

      {/* Candidates List */}
      <div className="space-y-3">
        {candidates.map((candidate, index) => {
          const isSelected = selectedCandidate === candidate;
          
          return (
            <button
              key={index}
              onClick={() => onSelectCandidate(id, candidate)}
              className={`w-full p-4 rounded-lg border-2 transition-all duration-300 text-left ${
                isSelected
                  ? 'border-purple-600 bg-gradient-to-r from-purple-50 to-blue-50 shadow-lg transform scale-105'
                  : 'border-gray-200 hover:border-purple-300 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {/* Radio Button */}
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all ${
                    isSelected ? 'border-purple-600 bg-purple-600' : 'border-gray-300'
                  }`}>
                    {isSelected && (
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    )}
                  </div>
                  
                  {/* Candidate Name */}
                  <span className={`font-semibold ${
                    isSelected ? 'text-purple-700' : 'text-gray-700'
                  }`}>
                    {candidate}
                  </span>
                </div>

                {/* Selected Badge */}
                {isSelected && (
                  <span className="px-3 py-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs font-bold rounded-full">
                    SELECTED
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Selection Status */}
      {selectedCandidate ? (
        <div className="mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-lg">
          <p className="text-sm text-green-700 font-medium">
            ✓ You selected: <span className="font-bold">{selectedCandidate}</span>
          </p>
        </div>
      ) : (
        <div className="mt-4 p-3 bg-yellow-50 border-l-4 border-yellow-500 rounded-lg">
          <p className="text-sm text-yellow-700 font-medium">
            ⚠ Please select a candidate for this position
          </p>
        </div>
      )}
    </div>
  );
};

export default PositionCard;