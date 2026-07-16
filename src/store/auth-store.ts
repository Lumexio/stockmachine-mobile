import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@api/axios-client';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api/v1';

export interface AuthUser {
  id: number;
  name: string;
  email: string;
  role: string;
  org_id: number | null;
}

interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (dto: {
    name: string;
    email: string;
    password: string;
    org_name?: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  loadFromStorage: () => Promise<void>;
}

const storeTokens = async (accessToken: string, refreshToken: string) => {
  await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, accessToken);
  await SecureStore.setItemAsync(REFRESH_TOKEN_KEY, refreshToken);
};

const clearTokens = async () => {
  await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
  await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isAuthenticated: false,

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
    set({ user: data.user, isAuthenticated: true });
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
    set({ user: data.user, isAuthenticated: true });
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
      set({ user: null, isAuthenticated: false });
    }
  },

  /** Restore session from SecureStore on app start. */
  loadFromStorage: async () => {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    if (!token) return;
    try {
      const res = await fetch(`${BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const { data } = await res.json();
        set({ user: data, isAuthenticated: true });
      } else {
        await clearTokens();
      }
    } catch {
      // Network unavailable — remain unauthenticated until next online check
    }
  },
}));
