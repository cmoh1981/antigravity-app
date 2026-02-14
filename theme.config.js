/** @type {const} */
const themeColors = {
  // Primary - Warm orange-gold matching the app icon
  primary: { light: '#E8853D', dark: '#F09A56' },
  
  // Background - Clean warm white / deep dark
  background: { light: '#FAFAF8', dark: '#141416' },
  
  // Surface - Cards and elevated elements
  surface: { light: '#FFFFFF', dark: '#1E1E22' },
  
  // Foreground - Primary text
  foreground: { light: '#1A1A1A', dark: '#F5F5F3' },
  
  // Muted - Secondary text
  muted: { light: '#8C8C8C', dark: '#9A9A9E' },
  
  // Border - Dividers and outlines
  border: { light: '#EEEEEA', dark: '#2E2E32' },
  
  // Semantic colors
  success: { light: '#34C759', dark: '#30D158' },
  warning: { light: '#FF9F0A', dark: '#FFD60A' },
  error: { light: '#FF3B30', dark: '#FF453A' },
  
  // Category colors for exercise
  categoryPH: { light: '#8B5CF6', dark: '#A78BFA' },  // Purple - indoor calm
  categorySO: { light: '#F59E0B', dark: '#FBBF24' },  // Amber - sunny energy
  categoryMB: { light: '#3B82F6', dark: '#60A5FA' },  // Blue - mental wellness
  categoryTF: { light: '#10B981', dark: '#34D399' },  // Emerald - adaptability
  
  // Mood colors
  moodGreat: { light: '#FFD93D', dark: '#FFE066' },
  moodGood: { light: '#6BCB77', dark: '#82D68A' },
  moodNeutral: { light: '#4D96FF', dark: '#6BA3FF' },
  moodBad: { light: '#FF6B6B', dark: '#FF8585' },
  moodTerrible: { light: '#C34A36', dark: '#D45D49' },

  // Accent colors for premium feel
  accent: { light: '#FF6B35', dark: '#FF8A5C' },
  highlight: { light: '#FFF3E0', dark: '#2A2018' },
};

module.exports = { themeColors };
