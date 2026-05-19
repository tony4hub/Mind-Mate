// MindMate color palette
export const colors = {
  // Backgrounds
  softGray: '#F5F5F5',
  softCream: '#FAF9F6',
  
  // Primary colors
  pastelBlue: '#B4D4E1',
  mintGreen: '#D4E8D4',
  warmSand: '#E8DCC4',
  
  // Accent
  softRed: '#F4A5A5',
  
  // Text
  darkGray: '#4A4A4A',
  mediumGray: '#6B6B6B',
} as const;

export type ColorKey = keyof typeof colors;
