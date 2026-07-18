import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Colors } from '@constants/theme';

export type ColorScheme = 'light' | 'dark' | 'electric' | 'tokyo' | 'newspaper';

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
  setScheme: (scheme: ColorScheme) => void;
  toggle: () => void;
  loadSaved: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  scheme: 'light',
  colors: Colors.light,

  setScheme: (scheme) => {
    AsyncStorage.setItem(THEME_KEY, scheme).catch(() => null);
    set({ scheme, colors: Colors[scheme] });
  },

  toggle: () => {
    const current = get().scheme;
    const next: ColorScheme = current === 'light' ? 'dark' : 'light';
    AsyncStorage.setItem(THEME_KEY, next).catch(() => null);
    set({ scheme: next, colors: Colors[next] });
  },

  loadSaved: async () => {
    try {
      const saved = (await AsyncStorage.getItem(THEME_KEY)) as ColorScheme | null;
      if (
        saved === 'light' ||
        saved === 'dark' ||
        saved === 'electric' ||
        saved === 'tokyo' ||
        saved === 'newspaper'
      ) {
        set({ scheme: saved, colors: Colors[saved] });
      }
    } catch {
      // keep default
    }
  },
}));
