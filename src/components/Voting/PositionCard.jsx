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

      {/* Candidates Grid - Updated to show larger images */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {position.candidates.map((candidate) => {
          const isSelected = selectedCandidate && selectedCandidate.id === candidate.id;
          
          return (
            <button
              key={candidate.id}
              onClick={() => onSelectCandidate(position.id, candidate)}
              className={`
                relative rounded-xl transition-all duration-300 transform
                ${isSelected 
                  ? 'bg-gradient-gold border-2 border-gold-400 shadow-glow-gold scale-105' 
                  : 'glass-effect border border-white/20 hover:border-gold-300/50 hover:scale-102'
                }
              `}
            >
              {/* Candidate Card Layout - Vertical with image on top */}
              <div className="flex flex-col items-center space-y-4 p-6">
                {/* Candidate Image - LARGER */}
                <div className="relative flex-shrink-0">
                  <div className={`
                    w-32 h-32 rounded-full overflow-hidden border-4 transition-all flex items-center justify-center
                    ${isSelected ? 'border-white shadow-lg' : 'border-gold-400/50 shadow-md'}
                  `}>
                    <img
                      src={candidate.image}
                      alt={candidate.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        // Fallback to initials if image fails to load
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback Avatar */}
                    <div 
                      className={`
                        w-full h-full rounded-full flex items-center justify-center
                        ${isSelected 
                          ? 'bg-white text-gold-600' 
                          : 'bg-gradient-to-br from-gold-400/30 to-royal-400/30 text-white'
                        }
                      `}
                      style={{ display: 'none' }}
                    >
                      <span className="text-5xl font-bold">
                        {candidate.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  {/* Online Indicator */}
                  <div className="absolute bottom-2 right-2 w-4 h-4 bg-green-400 rounded-full border-2 border-white shadow-lg"></div>
                </div>

                {/* Candidate Name and Bio */}
                <div className="flex-1 text-center min-w-0">
                  <p className={`
                    font-bold text-xl truncate
                    ${isSelected ? 'text-white' : 'text-white/90'}
                  `}>
                    {candidate.name}
                  </p>
                  <p className={`
                    text-sm truncate mt-1
                    ${isSelected ? 'text-white/80' : 'text-white/60'}
                  `}>
                    {candidate.bio}
                  </p>
                  {isSelected && (
                    <p className="text-sm text-white/80 font-medium mt-3">
                      ✓ Selected
                    </p>
                  )}
                </div>

                {/* Checkmark Icon */}
                {isSelected && (
                  <div className="absolute top-4 right-4">
                    <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg">
                      <svg className="w-6 h-6 text-gold-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        <div className="mt-6 p-4 glass-effect rounded-lg border border-green-400/30 animate-slide-up">
          <div className="flex items-center justify-center">
            <svg className="w-5 h-5 text-green-400 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="text-sm text-white/90 font-medium">
              You selected: <span className="text-gold-300 font-bold">{selectedCandidate.name}</span>
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PositionCard;