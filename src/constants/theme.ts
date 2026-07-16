export const Colors = {
  primary: '#E53935',
  primaryLight: '#FF6F60',
  primaryDark: '#AB000D',

  light: {
    background: '#FFFFFF',
    surface: '#F5F5F5',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#757575',
    border: '#E0E0E0',
    icon: '#616161',
    statusBar: 'dark' as const,
  },
  dark: {
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2C2C2C',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#3A3A3A',
    icon: '#B0B0B0',
    statusBar: 'light' as const,
  },
} as const;

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 18,
  xl: 22,
  xxl: 28,
} as const;

export const BorderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 20,
  full: 9999,
} as const;

export const LOW_STOCK_THRESHOLD = 10;
