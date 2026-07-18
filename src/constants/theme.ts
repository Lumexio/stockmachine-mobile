export const Colors = {
  primary: '#E53935',
  primaryLight: '#FF6F60',
  primaryDark: '#AB000D',

  light: {
    background: '#FFEBEE',
    surface: '#FFF5F5',
    card: '#FFFFFF',
    text: '#1A1A1A',
    textSecondary: '#757575',
    border: '#E0E0E0',
    icon: '#616161',
    statusBar: 'dark' as const,
  },
  dark: {
    background: '#1A0F0D',
    surface: '#251412',
    card: '#2C1814',
    text: '#FFFFFF',
    textSecondary: '#B0B0B0',
    border: '#3A231F',
    icon: '#B0B0B0',
    statusBar: 'light' as const,
  },
  electric: {
    background: '#0B001A',
    surface: '#100026',
    card: '#170033',
    text: '#FFFFFF',
    textSecondary: '#9D00FF',
    border: '#3C0080',
    icon: '#9D00FF',
    statusBar: 'light' as const,
  },
  tokyo: {
    background: '#1a1b26',
    surface: '#1f2335',
    card: '#24283b',
    text: '#a9b1d6',
    textSecondary: '#7aa2f7',
    border: '#383e5a',
    icon: '#7aa2f7',
    statusBar: 'light' as const,
  },
  newspaper: {
    background: '#f4ecd8',
    surface: '#ebdcb9',
    card: '#fbf7eb',
    text: '#111111',
    textSecondary: '#555555',
    border: '#d2c4a3',
    icon: '#555555',
    statusBar: 'dark' as const,
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
