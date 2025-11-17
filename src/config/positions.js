// All positions and candidates for IndabaX Elections
export const POSITIONS_DATA = {
  president: {
    id: 'president',
    title: 'PRESIDENT',
    candidates: ['KADDUMA COSMAS ALLAN']
  },
  vice_president: {
    id: 'vice_president',
    title: 'VICE PRESIDENT',
    candidates: ['AMUTUHAIRE TRACY']
  },
  technical_lead: {
    id: 'technical_lead',
    title: 'TECHNICAL LEAD',
    candidates: ['ALOUZIOUS MUHEREZA']
  },
  secretary: {
    id: 'secretary',
    title: 'SECRETARY',
    candidates: ['KUKUNDA LINNET']
  },
  treasurer: {
    id: 'treasurer',
    title: 'TREASURER',
    candidates: ['UWAMAHORO RETICIA']
  },
  graphics_design_lead: {
    id: 'graphics_design_lead',
    title: 'GRAPHICS DESIGN LEAD',
    candidates: [
      'NDYAMUHAKHI BRIAN',
      'AKUGIZIBWE ADOLFU',
      'KASHTA FRANK'
    ]
  },
  social_media_manager: {
    id: 'social_media_manager',
    title: 'SOCIAL MEDIA MANAGER',
    candidates: [
      'AINEMUKAMA JOHN ROCKEY',
      'AHUMUZA JOHN BAPTIST'
    ]
  },
  event_manager: {
    id: 'event_manager',
    title: 'EVENT MANAGER',
    candidates: ['ARYATUHA KENNETH']
  },
  speaker: {
    id: 'speaker',
    title: 'SPEAKER',
    candidates: ['NAMANJE SANDRA']
  },
  women_in_tech_rep: {
    id: 'women_in_tech_rep',
    title: 'WOMEN IN TECH REP',
    candidates: ['MUHOOZI TRACY']
  },
  data_science_rep: {
    id: 'data_science_rep',
    title: 'DATA SCIENCE AND STATISTICS REP',
    candidates: ['DEUS NIYIGABA']
  },
  year_one_rep: {
    id: 'year_one_rep',
    title: 'YEAR ONE REP',
    candidates: [
      'ENGOLE MORIS',
      'NASASIIRA EUNICE',
      'BWAMBALE DANIEL PRAISE',
      'AMUTUSIMIIRE SHARON',
      'KEMIGISHA MARION',
      'NAMARA ONAN'
    ]
  },
  year_two_rep: {
    id: 'year_two_rep',
    title: 'YEAR TWO REP',
    candidates: ['RUKUNDO EDRINE']
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