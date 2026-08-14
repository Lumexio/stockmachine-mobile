import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';
import { http, HttpResponse } from 'msw';
import { server } from '../test-utils/msw-server';
import { useAuthStore } from './auth-store';
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from '@api/axios-client';

const mockSecureStoreMap = new Map<string, string>();

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(async (key: string) => mockSecureStoreMap.get(key) ?? null),
  setItemAsync: jest.fn(async (key: string, value: string) => {
    mockSecureStoreMap.set(key, value);
  }),
  deleteItemAsync: jest.fn(async (key: string) => {
    mockSecureStoreMap.delete(key);
  }),
}));

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Auth Store (useAuthStore)', () => {
  beforeEach(async () => {
    mockSecureStoreMap.clear();
    await AsyncStorage.clear();
    jest.clearAllMocks();

    useAuthStore.setState({
      user: null,
      isAuthenticated: false,
      hasSeenWelcome: false,
      isOffline: false,
      pendingInviteCode: null,
      currentLocationId: null,
      locations: [],
    });
  });

  test('should have initial state defaults', () => {
    const state = useAuthStore.getState();
    expect(state.user).toBeNull();
    expect(state.isAuthenticated).toBe(false);
    expect(state.hasSeenWelcome).toBe(false);
    expect(state.isOffline).toBe(false);
    expect(state.pendingInviteCode).toBeNull();
    expect(state.currentLocationId).toBeNull();
    expect(state.locations).toEqual([]);
  });

  describe('login', () => {
    test('successful login sets user, stores tokens in SecureStore, and updates state', async () => {
      const mockUser = {
        id: 1,
        name: 'Test User',
        email: 'test@example.com',
        role: 'admin',
        org_id: 10,
      };

      server.use(
        http.post('*/auth/login', () => {
          return HttpResponse.json({
            data: {
              access_token: 'access-123',
              refresh_token: 'refresh-456',
              user: mockUser,
            },
          });
        }),
        http.get('*/organizations/10/locations', () => {
          return HttpResponse.json({
            data: [{ id: 101, name: 'Main Location', org_id: 10 }],
          });
        })
      );

      await useAuthStore.getState().login('test@example.com', 'password123');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.isOffline).toBe(false);
      expect(state.user).toEqual(mockUser);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_KEY, 'access-123');
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(REFRESH_TOKEN_KEY, 'refresh-456');
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('sm_is_offline', 'false');
      expect(state.locations).toEqual([{ id: 101, name: 'Main Location', org_id: 10 }]);
      expect(state.currentLocationId).toBe(101);
    });

    test('failed login throws error and keeps state unauthenticated', async () => {
      server.use(
        http.post('*/auth/login', () => {
          return HttpResponse.json({ message: 'Invalid credentials' }, { status: 401 });
        })
      );

      await expect(
        useAuthStore.getState().login('test@example.com', 'wrongpassword')
      ).rejects.toThrow('Invalid credentials');

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
    });
  });

  describe('register', () => {
    test('successful registration sets tokens and authenticates user', async () => {
      const mockUser = {
        id: 2,
        name: 'New User',
        email: 'new@example.com',
        role: 'owner',
        org_id: 20,
      };

      server.use(
        http.post('*/auth/register', () => {
          return HttpResponse.json({
            data: {
              access_token: 'reg-access',
              refresh_token: 'reg-refresh',
              user: mockUser,
            },
          });
        }),
        http.get('*/organizations/20/locations', () => {
          return HttpResponse.json({ data: [] });
        })
      );

      await useAuthStore.getState().register({
        name: 'New User',
        email: 'new@example.com',
        password: 'password123',
        org_name: 'New Org',
      });

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(SecureStore.setItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_KEY, 'reg-access');
    });

    test('failed registration throws error', async () => {
      server.use(
        http.post('*/auth/register', () => {
          return HttpResponse.json({ message: 'Email already exists' }, { status: 400 });
        })
      );

      await expect(
        useAuthStore.getState().register({
          name: 'New User',
          email: 'existing@example.com',
          password: 'password123',
        })
      ).rejects.toThrow('Email already exists');
    });
  });

  describe('logout', () => {
    test('clears tokens, storage, and resets store state', async () => {
      mockSecureStoreMap.set(ACCESS_TOKEN_KEY, 'existing-token');
      useAuthStore.setState({
        user: { id: 1, name: 'User', email: 'u@example.com', role: 'admin', org_id: 1 },
        isAuthenticated: true,
        currentLocationId: 101,
        locations: [{ id: 101, name: 'Loc 1', org_id: 1 }],
      });

      server.use(
        http.post('*/auth/logout', () => {
          return HttpResponse.json({ success: true });
        })
      );

      await useAuthStore.getState().logout();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(state.currentLocationId).toBeNull();
      expect(state.locations).toEqual([]);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sm_local_locations');
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sm_current_loc_id');
    });
  });

  describe('offline & preference toggles', () => {
    test('setOffline updates state and AsyncStorage persistence', async () => {
      useAuthStore.getState().setOffline(true);
      expect(useAuthStore.getState().isOffline).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('sm_is_offline', 'true');

      useAuthStore.getState().setOffline(false);
      expect(useAuthStore.getState().isOffline).toBe(false);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('sm_is_offline', 'false');
    });

    test('setHasSeenWelcome updates state and AsyncStorage persistence', async () => {
      useAuthStore.getState().setHasSeenWelcome();
      expect(useAuthStore.getState().hasSeenWelcome).toBe(true);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('sm_has_seen_welcome', 'true');
    });

    test('addLocalLocation generates negative ID and updates state & storage', () => {
      useAuthStore.getState().addLocalLocation('Warehouse 1');

      const state = useAuthStore.getState();
      expect(state.locations.length).toBe(1);
      expect(state.locations[0].name).toBe('Warehouse 1');
      expect(state.locations[0].id).toBeLessThan(0);
      expect(state.currentLocationId).toBe(state.locations[0].id);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sm_local_locations',
        JSON.stringify(state.locations)
      );
      expect(AsyncStorage.setItem).toHaveBeenCalledWith(
        'sm_current_loc_id',
        String(state.locations[0].id)
      );
    });

    test('setCurrentLocationId sets state and updates storage', () => {
      useAuthStore.getState().setCurrentLocationId(42);
      expect(useAuthStore.getState().currentLocationId).toBe(42);
      expect(AsyncStorage.setItem).toHaveBeenCalledWith('sm_current_loc_id', '42');

      useAuthStore.getState().setCurrentLocationId(null);
      expect(useAuthStore.getState().currentLocationId).toBeNull();
      expect(AsyncStorage.removeItem).toHaveBeenCalledWith('sm_current_loc_id');
    });
  });

  describe('loadFromStorage', () => {
    test('restores preferences and authenticates when valid token exists', async () => {
      await AsyncStorage.setItem('sm_has_seen_welcome', 'true');
      await AsyncStorage.setItem('sm_is_offline', 'false');
      await AsyncStorage.setItem(
        'sm_local_locations',
        JSON.stringify([{ id: -1, name: 'Offline Shop', org_id: 0 }])
      );
      await AsyncStorage.setItem('sm_current_loc_id', '-1');
      mockSecureStoreMap.set(ACCESS_TOKEN_KEY, 'valid-token');

      const mockUser = {
        id: 5,
        name: 'Persisted User',
        email: 'p@example.com',
        role: 'user',
        org_id: 50,
      };

      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json({ data: mockUser });
        }),
        http.get('*/organizations/50/locations', () => {
          return HttpResponse.json({
            data: [{ id: 501, name: 'Org Loc', org_id: 50 }],
          });
        })
      );

      await useAuthStore.getState().loadFromStorage();

      const state = useAuthStore.getState();
      expect(state.hasSeenWelcome).toBe(true);
      expect(state.user).toEqual(mockUser);
      expect(state.isAuthenticated).toBe(true);
      expect(state.locations).toEqual([{ id: 501, name: 'Org Loc', org_id: 50 }]);
    });

    test('invalidates token on 401 response from /auth/me', async () => {
      mockSecureStoreMap.set(ACCESS_TOKEN_KEY, 'invalid-token');

      server.use(
        http.get('*/auth/me', () => {
          return HttpResponse.json({ message: 'Unauthorized' }, { status: 401 });
        })
      );

      await useAuthStore.getState().loadFromStorage();

      const state = useAuthStore.getState();
      expect(state.isAuthenticated).toBe(false);
      expect(state.user).toBeNull();
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(ACCESS_TOKEN_KEY);
      expect(SecureStore.deleteItemAsync).toHaveBeenCalledWith(REFRESH_TOKEN_KEY);
    });
  });
});
