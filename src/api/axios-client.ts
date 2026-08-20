import * as SecureStore from 'expo-secure-store';
import { useAuthStore } from '@store/auth-store';

export const ACCESS_TOKEN_KEY = 'sm_access_token';
export const REFRESH_TOKEN_KEY = 'sm_refresh_token';

const BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'https://api.stockmachine.online/api/v1';

let isRefreshing = false;
let refreshSubscribers: Array<(token: string) => void> = [];

function subscribeTokenRefresh(cb: (token: string) => void) {
  refreshSubscribers.push(cb);
}

function onRefreshed(token: string) {
  refreshSubscribers.forEach((cb) => cb(token));
  refreshSubscribers = [];
}

async function fetchWithInterceptor(url: string, options: RequestInit = {}, retry = false): Promise<any> {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  const locationId = useAuthStore.getState().currentLocationId;
  
  const headers = new Headers(options.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);
  if (locationId) headers.set('X-Location-Id', locationId.toString());

  const config: RequestInit = { ...options, headers };
  
  let response = await fetch(`${BASE_URL}${url}`, config);
  
  if (response.status === 401 && !retry) {
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        subscribeTokenRefresh(async (newToken) => {
          headers.set('Authorization', `Bearer ${newToken}`);
          try {
            const res = await fetch(`${BASE_URL}${url}`, { ...config, headers });
            if (!res.ok) throw res;
            resolve({ data: await res.json().catch(() => null) });
          } catch (err) {
            reject(err);
          }
        });
      });
    }
    
    isRefreshing = true;
    try {
      const refreshToken = await SecureStore.getItemAsync(REFRESH_TOKEN_KEY);
      if (!refreshToken) throw new Error('No refresh token');
      
      const refreshRes = await fetch(`${BASE_URL}/auth/refresh`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: refreshToken })
      });
      
      if (!refreshRes.ok) throw new Error('Refresh failed');
      const { data } = await refreshRes.json();
      const newAccessToken = data.access_token;
      
      await SecureStore.setItemAsync(ACCESS_TOKEN_KEY, newAccessToken);
      onRefreshed(newAccessToken);
      
      headers.set('Authorization', `Bearer ${newAccessToken}`);
      response = await fetch(`${BASE_URL}${url}`, { ...config, headers });
    } catch (err) {
      await SecureStore.deleteItemAsync(ACCESS_TOKEN_KEY);
      await SecureStore.deleteItemAsync(REFRESH_TOKEN_KEY);
      throw err;
    } finally {
      isRefreshing = false;
    }
  }
  
  if (!response.ok) {
    const error: any = new Error('Request failed');
    error.response = { status: response.status, data: await response.json().catch(() => null) };
    throw error;
  }
  
  const data = await response.json().catch(() => null);
  return { data };
}

export const apiClient = {
  defaults: { baseURL: BASE_URL },
  get: (url: string, config?: any) => fetchWithInterceptor(url, { method: 'GET', ...config }),
  post: (url: string, data?: any, config?: any) => fetchWithInterceptor(url, { method: 'POST', body: JSON.stringify(data), ...config }),
  put: (url: string, data?: any, config?: any) => fetchWithInterceptor(url, { method: 'PUT', body: JSON.stringify(data), ...config }),
  patch: (url: string, data?: any, config?: any) => fetchWithInterceptor(url, { method: 'PATCH', body: JSON.stringify(data), ...config }),
  delete: (url: string, config?: any) => fetchWithInterceptor(url, { method: 'DELETE', ...config })
};
