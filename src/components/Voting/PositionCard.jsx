import React from 'react';

const PositionCard = ({ position, selectedCandidate, onSelectCandidate }) => {
  return (
    <div className="glass-effect rounded-xl p-6 border border-gold-300/30 animate-slide-up backdrop-blur-xl shadow-gold">
      {/* Position Title */}
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-gold rounded-full flex items-center justify-center mr-4 flex-shrink-0 shadow-gold">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
        </div>
        <div>
          <h2 className="text-2xl font-bold gradient-text">
            {position.title}
          </h2>
          <p className="text-sm text-white/70">
            Select one candidate
          </p>
        </div>
      </div>

      {/* Candidates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {position.candidates.map((candidate) => {
          const isSelected = selectedCandidate === candidate;
          
          return (
            <button
              key={candidate}
              onClick={() => onSelectCandidate(position.id, candidate)}
              className={`
                relative p-5 rounded-xl transition-all duration-300 transform
                ${isSelected 
                  ? 'bg-gradient-gold border-2 border-gold-400 shadow-glow-gold scale-105' 
                  : 'glass-effect border border-white/20 hover:border-gold-300/50 hover:scale-102'
                }
              `}
            >
              {/* Candidate Content */}
              <div className="flex items-center space-x-4">
                {/* Avatar */}
                <div className={`
                  w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 transition-all
                  ${isSelected 
                    ? 'bg-white text-gold-600' 
                    : 'bg-gradient-to-br from-gold-400/30 to-royal-400/30 text-white'
                  }
                `}>
                  <span className="text-2xl font-bold">
                    {candidate.charAt(0).toUpperCase()}
                  </span>
                </div>

                {/* Candidate Name */}
                <div className="flex-1 text-left">
                  <p className={`
                    font-bold text-lg
                    ${isSelected ? 'text-white' : 'text-white/90'}
                  `}>
                    {candidate}
                  </p>
                  {isSelected && (
                    <p className="text-sm text-white/80 font-medium">
                      ✓ Selected
                    </p>
                  )}
                </div>

                {/* Checkmark Icon */}
                {isSelected && (
                  <div className="absolute top-3 right-3">
                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-5 h-5 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>

              {/* Hover Effect Indicator */}
              {!isSelected && (
                <div className="absolute inset-0 rounded-xl border-2 border-gold-400/0 hover:border-gold-400/50 transition-all pointer-events-none"></div>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection Status */}
      {selectedCandidate && (
        <div className="mt-4 p-3 glass-effect rounded-lg border border-green-400/30 animate-slide-up">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-white/90 font-medium">
              You selected: <span className="text-gold-300 font-bold">{selectedCandidate}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionCard;