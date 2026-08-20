import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Colors } from '@constants/theme';

export type ColorScheme =
  | 'default-light'
  | 'default-dark'
  | 'electron-neon-light'
  | 'electron-neon-dark'
  | 'tokyo-day'
  | 'tokyo-night'
  | 'newspaper-light'
  | 'newspaper-dark';

export const SCHEME_PAIRS: Record<ColorScheme, ColorScheme> = {
  'default-light': 'default-dark',
  'default-dark': 'default-light',
  'electron-neon-light': 'electron-neon-dark',
  'electron-neon-dark': 'electron-neon-light',
  'tokyo-day': 'tokyo-night',
  'tokyo-night': 'tokyo-day',
  'newspaper-light': 'newspaper-dark',
  'newspaper-dark': 'newspaper-light',
};

export interface ColorSchemeConfig {
  background: string;
  surface: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
  icon: string;
  statusBar: 'light' | 'dark';
}

const THEME_KEY = 'sm_theme';

interface ThemeState {
  scheme: ColorScheme;
  colors: ColorSchemeConfig;
  isDarkActive: boolean;
  setScheme: (scheme: ColorScheme) => void;
  toggle: () => void;
  loadSaved: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  scheme: 'default-light',
  colors: Colors['default-light'],
  isDarkActive: false,

  setScheme: (scheme) => {
    AsyncStorage.setItem(THEME_KEY, scheme).catch(() => null);
    const isDark = scheme.endsWith('-dark') || scheme === 'tokyo-night';
    set({ scheme, colors: Colors[scheme], isDarkActive: isDark });
  },

  toggle: () => {
    const current = get().scheme;
    const next = SCHEME_PAIRS[current] || 'default-dark';
    const isDark = next.endsWith('-dark') || next === 'tokyo-night';
    AsyncStorage.setItem(THEME_KEY, next).catch(() => null);
    set({ scheme: next, colors: Colors[next], isDarkActive: isDark });
  },

  loadSaved: async () => {
    try {
      const saved = (await AsyncStorage.getItem(THEME_KEY)) as ColorScheme | null;
      if (saved && saved in Colors) {
        const isDark = saved.endsWith('-dark') || saved === 'tokyo-night';
        set({ scheme: saved, colors: Colors[saved], isDarkActive: isDark });
      }
    } catch {
      // keep default
    }
  },
}));
