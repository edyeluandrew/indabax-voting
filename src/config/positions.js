// All positions and candidates for IndabaX Elections with images
export const POSITIONS_DATA = {
  president: {
    id: 'president',
    title: 'PRESIDENT',
    candidates: [
      {
        id: 'kadduma-cosmas-allan',
        name: 'KADDUMA COSMAS ALLAN',
        image: '/images/candidates/kadduma-cosmas-allan.jpg',
        bio: 'Candidate for President'
      }
    ]
  },
  vice_president: {
    id: 'vice_president',
    title: 'VICE PRESIDENT',
    candidates: [
      {
        id: 'amutuhaire-tracy',
        name: 'AMUTUHAIRE TRACY',
        image: '/images/candidates/amutuhaire-tracy.jpg',
        bio: 'Candidate for Vice President'
      }
    ]
  },
  technical_lead: {
    id: 'technical_lead',
    title: 'TECHNICAL LEAD',
    candidates: [
      {
        id: 'alouzious-muhereza',
        name: 'ALOUZIOUS MUHEREZA',
        image: '/images/candidates/alouzious-muhereza.jpg',
        bio: 'Candidate for Technical Lead'
      }
    ]
  },
  secretary: {
    id: 'secretary',
    title: 'SECRETARY',
    candidates: [
      {
        id: 'kukunda-linnet',
        name: 'KUKUNDA LINNET',
        image: '/images/candidates/kukunda-linnet.jpg',
        bio: 'Candidate for Secretary'
      }
    ]
  },
  treasurer: {
    id: 'treasurer',
    title: 'TREASURER',
    candidates: [
      {
        id: 'uwamahoro-reticia',
        name: 'UWAMAHORO RETICIA',
        image: '/images/candidates/uwamahoro-reticia.jpg',
        bio: 'Candidate for Treasurer'
      }
    ]
  },
  graphics_design_lead: {
    id: 'graphics_design_lead',
    title: 'GRAPHICS DESIGN LEAD',
    candidates: [
      {
        id: 'ndyamuhakhi-brian',
        name: 'NDYAMUHAKHI BRIAN',
        image: '/images/candidates/ndyamuhakhi-brian.jpg',
        bio: 'Candidate for Graphics Design Lead'
      },
      {
        id: 'akugizibwe-adolfu',
        name: 'AKUGIZIBWE ADOLFU',
        image: '/images/candidates/akugizibwe-adolfu.jpg',
        bio: 'Candidate for Graphics Design Lead'
      },
      {
        id: 'kashta-frank',
        name: 'KASHTA FRANK',
        image: '/images/candidates/kashta-frank.jpg',
        bio: 'Candidate for Graphics Design Lead'
      }
    ]
  },
  social_media_manager: {
    id: 'social_media_manager',
    title: 'SOCIAL MEDIA MANAGER',
    candidates: [
      {
        id: 'ainemukama-john-rockey',
        name: 'AINEMUKAMA JOHN ROCKEY',
        image: '/images/candidates/ainemukama-john-rockey.jpg',
        bio: 'Candidate for Social Media Manager'
      },
      {
        id: 'ahumuza-john-baptist',
        name: 'AHUMUZA JOHN BAPTIST',
        image: '/images/candidates/ahumuza-john-baptist.jpg',
        bio: 'Candidate for Social Media Manager'
      }
    ]
  },
  event_manager: {
    id: 'event_manager',
    title: 'EVENT MANAGER',
    candidates: [
      {
        id: 'aryatuha-kenneth',
        name: 'ARYATUHA KENNETH',
        image: '/images/candidates/aryatuha-kenneth.jpg',
        bio: 'Candidate for Event Manager'
      }
    ]
  },
  speaker: {
    id: 'speaker',
    title: 'SPEAKER',
    candidates: [
      {
        id: 'namanje-sandra',
        name: 'NAMANJE SANDRA',
        image: '/images/candidates/namanje-sandra.jpg',
        bio: 'Candidate for Speaker'
      }
    ]
  },
  women_in_tech_rep: {
    id: 'women_in_tech_rep',
    title: 'WOMEN IN TECH REP',
    candidates: [
      {
        id: 'muhoozi-tracy',
        name: 'MUHOOZI TRACY',
        image: '/images/candidates/muhoozi-tracy.jpg',
        bio: 'Candidate for Women in Tech Rep'
      }
    ]
  },
  data_science_rep: {
    id: 'data_science_rep',
    title: 'DATA SCIENCE AND STATISTICS REP',
    candidates: [
      {
        id: 'deus-niyigaba',
        name: 'DEUS NIYIGABA',
        image: '/images/candidates/deus-niyigaba.jpg',
        bio: 'Candidate for Data Science and Statistics Rep'
      }
    ]
  },
  year_one_rep: {
    id: 'year_one_rep',
    title: 'YEAR ONE REP',
    candidates: [
      {
        id: 'engole-moris',
        name: 'ENGOLE MORIS',
        image: '/images/candidates/engole-moris.jpg',
        bio: 'Candidate for Year One Rep'
      },
      {
        id: 'nasasiira-eunice',
        name: 'NASASIIRA EUNICE',
        image: '/images/candidates/nasasiira-eunice.jpg',
        bio: 'Candidate for Year One Rep'
      },
      {
        id: 'bwambale-daniel-praise',
        name: 'BWAMBALE DANIEL PRAISE',
        image: '/images/candidates/bwambale-daniel-praise.jpg',
        bio: 'Candidate for Year One Rep'
      },
      {
        id: 'amutusimiire-sharon',
        name: 'AMUTUSIMIIRE SHARON',
        image: '/images/candidates/amutusimiire-sharon.jpg',
        bio: 'Candidate for Year One Rep'
      },
      {
        id: 'kemigisha-marion',
        name: 'KEMIGISHA MARION',
        image: '/images/candidates/kemigisha-marion.jpg',
        bio: 'Candidate for Year One Rep'
      },
      {
        id: 'namara-onan',
        name: 'NAMARA ONAN',
        image: '/images/candidates/namara-onan.jpg',
        bio: 'Candidate for Year One Rep'
      }
    ]
  },
  year_two_rep: {
    id: 'year_two_rep',
    title: 'YEAR TWO REP',
    candidates: [
      {
        id: 'rukundo-edrine',
        name: 'RUKUNDO EDRINE',
        image: '/images/candidates/rukundo-edrine.jpg',
        bio: 'Candidate for Year Two Rep'
      }
    ]
  }
};

// Get all positions as array
export const getAllPositions = () => {
  return Object.values(POSITIONS_DATA);
};

// Get position by ID
export const getPositionById = (id) => {
  return POSITIONS_DATA[id] || null;
};

// Get candidate by ID across all positions
export const getCandidateById = (candidateId) => {
  for (const position of Object.values(POSITIONS_DATA)) {
    const candidate = position.candidates.find(c => c.id === candidateId);
    if (candidate) return candidate;
  }
  return null;
};