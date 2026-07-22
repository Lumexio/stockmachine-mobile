import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@api/axios-client';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

const HAS_SEEN_WELCOME_KEY = 'sm_has_seen_welcome';
const IS_OFFLINE_KEY = 'sm_is_offline';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  org_id: number | null;
  photo_url?: string | null;
  account_type?: 'individual' | 'team';
  organization?: {
    plan_id: string;
  } | null;
}

export interface Location {
  id: number;
  name: string;
  org_id: number;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  hasSeenWelcome: boolean;
  isOffline: boolean;
  pendingInviteCode: string | null;
  currentLocationId: number | null;
  locations: Location[];
  login: (email: string, password: string) => Promise<void>;
  register: (dto: {
    name: string;
    email: string;
    password: string;
    org_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  setOffline: (offline: boolean) => void;
  setPendingInviteCode: (code: string | null) => void;
  processPendingInvite: (token: string) => Promise<void>;
  setHasSeenWelcome: () => void;
  loadFromStorage: () => Promise<void>;
  updateUser: (updates: Partial<AuthUser>) => void;
  setCurrentLocationId: (id: number | null) => void;
  fetchLocations: (token?: string) => Promise<void>;
}

const storeTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  isAuthenticated: false,
  hasSeenWelcome: false,
  isOffline: false,
  pendingInviteCode: null,
  currentLocationId: null,
  locations: [],

  setCurrentLocationId: (id) => set({ currentLocationId: id }),

  fetchLocations: async (tokenParam) => {
    const state = get();
    const token = tokenParam || (await SecureStore.getItemAsync(ACCESS_TOKEN_KEY));
    if (!token || !state.user?.org_id) return;
    try {
      const res = await fetch(`${BASE_URL}/organizations/${state.user.org_id}/locations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const { data } = await res.json();
        const locations = data || [];
        set({ locations });
        if (locations.length > 0 && !state.currentLocationId) {
          set({ currentLocationId: locations[0].id });
        }
      }
    } catch (e) {
      console.warn('Failed to fetch locations', e);
    }
  },

  setPendingInviteCode: (code) => set({ pendingInviteCode: code }),

  processPendingInvite: async (token: string) => {
    const { pendingInviteCode } = get();
    if (!pendingInviteCode) return;
    try {
      const res = await fetch(`${BASE_URL}/invitations/accept`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ code: pendingInviteCode })
      });
      if (res.ok) {
        set({ pendingInviteCode: null });
        const meRes = await fetch(`${BASE_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (meRes.ok) {
          const { data } = await meRes.json();
          set({ user: data });
        }
      }
    } catch (e) {
      console.warn('Failed to accept pending invite on mobile', e);
    }
  },

  login: async (email, password) => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string }).message ?? `HTTP ${res.status}`,
      );
    }
    const { data } = await res.json();
    await storeTokens(data.access_token, data.refresh_token);
    await AsyncStorage.setItem(IS_OFFLINE_KEY, 'false');
    set({ user: data.user, isAuthenticated: true, isOffline: false });
    await get().processPendingInvite(data.access_token);
    await get().fetchLocations(data.access_token);
  },

  register: async (dto) => {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(
        (err as { message?: string }).message ?? `HTTP ${res.status}`,
      );
    }
    const { data } = await res.json();
    await storeTokens(data.access_token, data.refresh_token);
    await AsyncStorage.setItem(IS_OFFLINE_KEY, 'false');
    set({ user: data.user, isAuthenticated: true, isOffline: false });
    await get().processPendingInvite(data.access_token);
    await get().fetchLocations(data.access_token);
  },

  logout: async () => {
    try {
      const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
      if (token) {
        await fetch(`${BASE_URL}/auth/logout`, {
          method: 'POST',
          headers: { Authorization: `Bearer ${token}` },
        });
      }
    } catch {
      // Best-effort server logout; always clear local tokens
    } finally {
      await clearTokens();
      await AsyncStorage.setItem(IS_OFFLINE_KEY, 'false');
      set({ user: null, isAuthenticated: false, isOffline: false, currentLocationId: null, locations: [] });
    }
  },

  setOffline: (offline) => {
    AsyncStorage.setItem(IS_OFFLINE_KEY, offline ? 'true' : 'false').catch(() => null);
    set({ isOffline: offline });
  },

  setHasSeenWelcome: () => {
    AsyncStorage.setItem(HAS_SEEN_WELCOME_KEY, 'true').catch(() => null);
    set({ hasSeenWelcome: true });
  },

  /** Restore session from SecureStore on app start. */
  loadFromStorage: async () => {
    try {
      // Load onboarding / offline preferences
      const seen = await AsyncStorage.getItem(HAS_SEEN_WELCOME_KEY);
      const offline = await AsyncStorage.getItem(IS_OFFLINE_KEY);
      
      set({
        hasSeenWelcome: seen === 'true',
        isOffline: offline === 'true',
      });
    } catch {
      // ignore preferences load failures
    }

    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        set({ user: data, isAuthenticated: true, isOffline: false });
        await get().fetchLocations(token);
      } else {
        await clearTokens();
      }
    } catch {
      // Network unavailable — remain unauthenticated until next online check
    }
  },

  updateUser: (updates) => set((state) => ({ user: state.user ? { ...state.user, ...updates } : null })),
}));
