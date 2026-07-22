import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import * as SecureStore from 'expo-secure-store';

export const ACCESS_TOKEN_KEY = 'sm_access_token';
export const REFRESH_TOKEN_KEY = 'sm_refresh_token';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.stockmachine.online/api/v1';

export const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 15_000,
});

import { useAuthStore } from '@store/auth-store';

/** Attach Bearer token to every request */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    const locationId = useAuthStore.getState().currentLocationId;
    if (locationId) {
      config.headers['X-Location-Id'] = locationId.toString();
    }
    return config;
  },
);

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

/** 401 interceptor: attempt one refresh then retry, else redirect to Login */
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & {
      _retry?: boolean;
    };

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(apiClient(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token');

      const { data } = await axios.post<{ data: { access_token: string } }>(
        `${BASE_URL}/auth/refresh`,
        { refresh_token: refreshToken },
      );

      const newAccessToken = data.data.access_token;
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);
      onRefreshed(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return apiClient(originalRequest);
    } catch {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      // Navigation to Login is handled by the auth store listener
      return Promise.reject(error);
    } finally {
      isRefreshing = false;
    }
  },
);
