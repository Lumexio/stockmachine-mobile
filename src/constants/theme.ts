export const Colors = {
  primary: '#E53935',
  primaryLight: '#FF6F60',
  primaryDark: '#AB000D',

  'default-light': {
    background: '#FFEBEE',
    surface: '#FFF5F5',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#757575',
    border: '#E0E0E0',
    icon: '#616161',
    statusBar: 'dark' as const,
  },
  'default-dark': {
    background: '#1A0F0D',
    surface: '#251412',
    card: '#2C1814',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#3A231F',
    icon: '#B0B0B0',
    statusBar: 'light' as const,
  },
  'electron-neon-light': {
    background: '#E0F7FA',
    surface: '#B2EBF2',
    card: '#FFFFFF',
    text: '#004D40',
    textSecondary: '#0077B6',
    border: '#80DEEA',
    icon: '#0077B6',
    statusBar: 'dark' as const,
  },
  'electron-neon-dark': {
    background: '#0A0F1D',
    surface: '#131B2E',
    card: '#1A243B',
    text: '#E0F7FA',
    textSecondary: '#00F5D4',
    border: '#1E2D4A',
    icon: '#00F5D4',
    statusBar: 'light' as const,
  },
  'tokyo-day': {
    background: '#E1E2E7',
    surface: '#D5D6DB',
    card: '#F2F3F7',
    text: '#3760BF',
    textSecondary: '#34548A',
    border: '#C4C5CB',
    icon: '#34548A',
    statusBar: 'dark' as const,
  },
  'tokyo-night': {
    background: '#1A1B26',
    surface: '#24283B',
    card: '#414868',
    text: '#C0CAF5',
    textSecondary: '#7AA2F7',
    border: '#383E5A',
    icon: '#7AA2F7',
    statusBar: 'light' as const,
  },
  'newspaper-light': {
    background: '#F4F4F0',
    surface: '#EAEAE4',
    card: '#FFFFFF',
    text: '#111111',
    textSecondary: '#555555',
    border: '#CCCCCC',
    icon: '#555555',
    statusBar: 'dark' as const,
  },
  'newspaper-dark': {
    background: '#121212',
    surface: '#1E1E1E',
    card: '#2A2A2A',
    text: '#EAEAEA',
    textSecondary: '#AAAAAA',
    border: '#333333',
    icon: '#AAAAAA',
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
