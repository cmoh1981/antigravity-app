/** @type {const} */
const themeColors = {
  // Primary - Calm blue for trust and wellness
  primary: { light: '#4A90D9', dark: '#5A9FE8' },
  
  // Background - Soft gray-blue for comfort
  background: { light: '#F5F7FA', dark: '#1C1C1E' },
  
  // Surface - Cards and elevated elements
  surface: { light: '#FFFFFF', dark: '#2C2C2E' },
  
  // Foreground - Primary text
  foreground: { light: '#1C1C1E', dark: '#F5F5F7' },
  
  // Muted - Secondary text
  muted: { light: '#8E8E93', dark: '#98989D' },
  
  // Border - Dividers and outlines
  border: { light: '#E5E7EB', dark: '#3A3A3C' },
  
  // Semantic colors
  success: { light: '#34C759', dark: '#30D158' },
  warning: { light: '#FF9500', dark: '#FFD60A' },
  error: { light: '#FF3B30', dark: '#FF453A' },
  
  // Category colors for exercise
  categoryPH: { light: '#9B59B6', dark: '#A569BD' },  // Purple - indoor calm
  categorySO: { light: '#F39C12', dark: '#F5B041' },  // Orange - sunny energy
  categoryMB: { light: '#3498DB', dark: '#5DADE2' },  // Blue - mental wellness
  categoryTF: { light: '#1ABC9C', dark: '#48C9B0' },  // Teal - adaptability
  
  // Mood colors
  moodGreat: { light: '#FFD93D', dark: '#FFE066' },
  moodGood: { light: '#6BCB77', dark: '#82D68A' },
  moodNeutral: { light: '#4D96FF', dark: '#6BA3FF' },
  moodBad: { light: '#FF6B6B', dark: '#FF8585' },
  moodTerrible: { light: '#C34A36', dark: '#D45D49' },
};

module.exports = { themeColors };
