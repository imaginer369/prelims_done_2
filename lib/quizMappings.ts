// Difficulty and Topic mappings for quiz queries
// Use these mappings to convert user selections to integer codes for database queries

export const difficultyMap = {
  Mix: null, // null means any difficulty
  Easy: 0,
  Medium: 1,
  Hard: 2,
  "Super Hard": 3,
};

export const topicMap = {
  All: null, // null means any topic
  "Current Events of National and International Importance": 0,
  "History of India and Indian National Movement": 1,
  "Indian and World Geography - Physical, Social, Economic Geography of India and the World": 2,
  "Indian Polity and Governance - Constitution, Political System, Panchayati Raj, Public Policy, Rights Issues, etc.": 3,
  "Economic and Social Development - Sustainable Development, Poverty, Inclusion, Demographics, Social Sector Initiatives, etc.": 4,
  "General Issues on Environmental Ecology, Bio-diversity and Climate Change - that do not require subject specialization": 5,
  "General Science": 6,
};
