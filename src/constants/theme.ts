export const Colors = {
  primary: '#F44336',
  primaryLight: '#EF5350',
  primaryDark: '#B71C1C',

  'default-light': {
    background: '#FAFAF8',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#1C1917',
    textSecondary: '#9E9E9E',
    border: '#E7E5E4',
    icon: '#9E9E9E',
    statusBar: 'dark' as const,
  },
  'default-dark': {
    background: '#0F172A',
    surface: '#1E293B',
    card: '#1E293B',
    text: '#F1F5F9',
    textSecondary: '#616161',
    border: '#334155',
    icon: '#616161',
    statusBar: 'light' as const,
  },
  'electron-neon-light': {
    background: '#E0F7FA',
    surface: '#FFFFFF',
    card: '#FFFFFF',
    text: '#004D40',
    textSecondary: '#0077B6',
    border: '#B2EBF2',
    icon: '#0077B6',
    statusBar: 'dark' as const,
  },
  'electron-neon-dark': {
    background: '#0A0F1D',
    surface: '#131B2E',
    card: '#131B2E',
    text: '#E0F7FA',
    textSecondary: '#7B2CBF',
    border: '#1E2D4A',
    icon: '#7B2CBF',
    statusBar: 'light' as const,
  },
  'tokyo-day': {
    background: '#E1E2E7',
    surface: '#F2F3F7',
    card: '#F2F3F7',
    text: '#3760BF',
    textSecondary: '#89DDF3',
    border: '#C4C5CB',
    icon: '#89DDF3',
    statusBar: 'dark' as const,
  },
  'tokyo-night': {
    background: '#1A1B26',
    surface: '#24283B',
    card: '#24283B',
    text: '#C0CAF5',
    textSecondary: '#565F89',
    border: '#383E5A',
    icon: '#565F89',
    statusBar: 'light' as const,
  },
  'newspaper-light': {
    background: '#F4F4F0',
    surface: '#FFFFFF',
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
    card: '#1E1E1E',
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

export const TOUCHABLE_SIZE = 44;

export const LOW_STOCK_THRESHOLD = 10;
