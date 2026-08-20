import AsyncStorage from '@react-native-async-storage/async-storage';
import { http, HttpResponse } from 'msw';
import { server } from '../test-utils/msw-server';
import { useSyncStore } from './sync-store';

jest.mock('@react-native-async-storage/async-storage', () =>
  require('@react-native-async-storage/async-storage/jest/async-storage-mock')
);

describe('Sync Store (useSyncStore)', () => {
  beforeEach(async () => {
    await AsyncStorage.clear();
    jest.clearAllMocks();

    useSyncStore.setState({
      queue: [],
      idMap: {},
      isSyncing: false,
      isOnline: true,
    });
  });

  test('should initialize with empty queue and idMap', () => {
    const state = useSyncStore.getState();
    expect(state.queue).toEqual([]);
    expect(state.idMap).toEqual({});
    expect(state.isSyncing).toBe(false);
    expect(state.isOnline).toBe(true);
  });

  describe('queue and idMap operations', () => {
    test('enqueueOperation adds operation to queue with unique id', async () => {
      const opId = await useSyncStore.getState().enqueueOperation({
        operation: 'create',
        endpoint: 'products',
        payload: { name: 'Local Product' },
        localId: -1,
      });

      expect(opId).toBeDefined();
      const state = useSyncStore.getState();
      expect(state.queue.length).toBe(1);
      expect(state.queue[0]).toEqual({
        id: opId,
        operation: 'create',
        endpoint: 'products',
        payload: { name: 'Local Product' },
        localId: -1,
      });
    });

    test('dequeueOperation removes operation from queue by id', async () => {
      const opId1 = await useSyncStore.getState().enqueueOperation({
        operation: 'create',
        endpoint: 'products',
        payload: { name: 'P1' },
      });
      const opId2 = await useSyncStore.getState().enqueueOperation({
        operation: 'create',
        endpoint: 'products',
        payload: { name: 'P2' },
      });

      expect(useSyncStore.getState().queue.length).toBe(2);

      useSyncStore.getState().dequeueOperation(opId1);
      const state = useSyncStore.getState();
      expect(state.queue.length).toBe(1);
      expect(state.queue[0].id).toBe(opId2);
    });

    test('saveIdMap and getIdMap store and retrieve local-to-backend ID mappings', () => {
      useSyncStore.getState().saveIdMap('categories', -10, 501);
      useSyncStore.getState().saveIdMap('products', -1, 1001);

      expect(useSyncStore.getState().getIdMap('categories', -10)).toBe(501);
      expect(useSyncStore.getState().getIdMap('products', -1)).toBe(1001);
      expect(useSyncStore.getState().getIdMap('categories', -999)).toBeNull();

      useSyncStore.getState().clearAllIdMaps();
      expect(useSyncStore.getState().getIdMap('categories', -10)).toBeNull();
      expect(useSyncStore.getState().idMap).toEqual({});
    });
  });

  describe('runSync execution & ID remapping', () => {
    test('replays create operation, remaps local ID to backend ID, and saves to idMap', async () => {
      let createdPayload: any = null;

      server.use(
        http.post('*/products', async ({ request }) => {
          createdPayload = await request.json();
          return HttpResponse.json({
            data: { id: 888, ...createdPayload },
          });
        })
      );

      await useSyncStore.getState().enqueueOperation({
        operation: 'create',
        endpoint: 'products',
        payload: { name: 'New Offline Widget', price: 20, _unsynced: true },
        localId: -100,
      });

      await useSyncStore.getState().runSync();

      const state = useSyncStore.getState();
      expect(state.queue.length).toBe(0);
      expect(state.idMap['products']?.[-100]).toBe(888);
      expect(createdPayload).toEqual({ name: 'New Offline Widget', price: 20 });
    });

    test('replays update operation resolving foreign keys from idMap', async () => {
      let updatedPayload: any = null;
      let targetId: string | null = null;

      useSyncStore.getState().saveIdMap('products', -1, 100);
      useSyncStore.getState().saveIdMap('categories', -5, 20);

      server.use(
        http.put('*/products/*', async ({ request }) => {
          const parts = request.url.split('/');
          targetId = parts[parts.length - 1];
          updatedPayload = await request.json();
          return HttpResponse.json({ data: { id: 100, ...updatedPayload } });
        })
      );

      await useSyncStore.getState().enqueueOperation({
        operation: 'update',
        endpoint: 'products',
        payload: { id: -1, name: 'Updated Widget', category_id: -5, _unsynced: true },
      });

      await useSyncStore.getState().runSync();

      expect(useSyncStore.getState().queue.length).toBe(0);
      expect(targetId).toBe('100');
      expect(updatedPayload).toEqual({ id: -1, name: 'Updated Widget', category_id: 20 });
    });

    test('replays delete operation resolving local ID to backend ID', async () => {
      let deletedId: string | null = null;

      useSyncStore.getState().saveIdMap('products', -2, 200);

      server.use(
        http.delete('*/products/*', ({ request }) => {
          const parts = request.url.split('/');
          deletedId = parts[parts.length - 1];
          return HttpResponse.json({ success: true });
        })
      );

      await useSyncStore.getState().enqueueOperation({
        operation: 'delete',
        endpoint: 'products',
        payload: { id: -2 },
      });

      await useSyncStore.getState().runSync();

      expect(useSyncStore.getState().queue.length).toBe(0);
      expect(deletedId).toBe('200');
    });

    test('replays stock entry and withdrawal operations', async () => {
      const movements: Array<{ endpoint: string; id: string; type: string; body: any }> = [];

      useSyncStore.getState().saveIdMap('products', -3, 300);

      server.use(
        http.post('*/products/*/entry', async ({ request }) => {
          const parts = request.url.split('/');
          const id = parts[parts.length - 2];
          movements.push({
            endpoint: 'products',
            id,
            type: 'entry',
            body: await request.json(),
          });
          return HttpResponse.json({ success: true });
        }),
        http.post('*/products/*/withdrawal', async ({ request }) => {
          const parts = request.url.split('/');
          const id = parts[parts.length - 2];
          movements.push({
            endpoint: 'products',
            id,
            type: 'withdrawal',
            body: await request.json(),
          });
          return HttpResponse.json({ success: true });
        })
      );

      await useSyncStore.getState().enqueueOperation({
        operation: 'entry',
        endpoint: 'products',
        payload: { id: -3, quantity: 25, notes: 'Restock' },
      });

      await useSyncStore.getState().enqueueOperation({
        operation: 'withdrawal',
        endpoint: 'products',
        payload: { id: -3, quantity: 5, notes: 'Sale' },
      });

      await useSyncStore.getState().runSync();

      expect(useSyncStore.getState().queue.length).toBe(0);
      expect(movements).toHaveLength(2);
      expect(movements[0]).toEqual({
        endpoint: 'products',
        id: '300',
        type: 'entry',
        body: { quantity: 25, notes: 'Restock' },
      });
      expect(movements[1]).toEqual({
        endpoint: 'products',
        id: '300',
        type: 'withdrawal',
        body: { quantity: 5, notes: 'Sale' },
      });
    });

    test('stops replaying queue on network disconnect to preserve FIFO order', async () => {
      server.use(
        http.post('*/products', () => {
          return HttpResponse.error();
        })
      );

      await useSyncStore.getState().enqueueOperation({
        operation: 'create',
        endpoint: 'products',
        payload: { name: 'Failed Product' },
      });
      await useSyncStore.getState().enqueueOperation({
        operation: 'create',
        endpoint: 'products',
        payload: { name: 'Subsequent Product' },
      });

      await useSyncStore.getState().runSync();

      const state = useSyncStore.getState();
      expect(state.isOnline).toBe(false);
      expect(state.queue.length).toBe(2);
    });

    test('drops operation on 400 validation error to avoid poison pill blocking queue', async () => {
      server.use(
        http.post('*/products', () => {
          return HttpResponse.json({ message: 'Validation failed' }, { status: 400 });
        }),
        http.delete('*/categories/*', () => {
          return HttpResponse.json({ success: true });
        })
      );

      await useSyncStore.getState().enqueueOperation({
        operation: 'create',
        endpoint: 'products',
        payload: { invalid: 'data' },
      });
      await useSyncStore.getState().enqueueOperation({
        operation: 'delete',
        endpoint: 'categories',
        payload: { id: 50 },
      });

      await useSyncStore.getState().runSync();

      expect(useSyncStore.getState().queue.length).toBe(0);
    });
  });
});
