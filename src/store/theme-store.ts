import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { Colors } from '@constants/theme';

type ColorScheme = 'light' | 'dark';

const THEME_KEY = 'sm_theme';

interface ThemeState {
  scheme: ColorScheme;
  colors: typeof Colors.light;
  toggle: () => void;
  loadSaved: () => Promise<void>;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  scheme: 'light',
  colors: Colors.light,

  toggle: () => {
    const next: ColorScheme = get().scheme === 'light' ? 'dark' : 'light';
    AsyncStorage.setItem(THEME_KEY, next).catch(() => null);
    set({ scheme: next, colors: Colors[next] });
  },

  loadSaved: async () => {
    try {
      const saved = await AsyncStorage.getItem(THEME_KEY);
      if (saved === 'light' || saved === 'dark') {
        set({ scheme: saved, colors: Colors[saved] });
      }
    } catch {
      // keep default
    }
  },
}));
