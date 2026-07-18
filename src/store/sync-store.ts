import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { apiClient } from '@api/axios-client';

export interface OfflineOperation {
  id: string; // unique operation UUID
  operation: 'create' | 'update' | 'delete' | 'entry' | 'withdrawal';
  endpoint: string; // e.g. 'products', 'categories', 'shelves', 'racks'
  payload: any;
  localId?: number;
}

interface SyncState {
  queue: OfflineOperation[];
  idMap: Record<string, Record<number, number>>; // endpoint -> Record<localId, backendId>
  isSyncing: boolean;
  isOnline: boolean;
  
  enqueueOperation: (op: Omit<OfflineOperation, 'id'>) => Promise<string>;
  dequeueOperation: (id: string) => void;
  saveIdMap: (endpoint: string, localId: number, backendId: number) => void;
  getIdMap: (endpoint: string, localId: number) => number | null;
  clearAllIdMaps: () => void;
  setOnline: (online: boolean) => void;
  checkConnection: () => Promise<boolean>;
  runSync: () => Promise<void>;
}

export const useSyncStore = create<SyncState>()(
  persist(
    (set, get) => ({
      queue: [],
      idMap: {},
      isSyncing: false,
      isOnline: true,

      enqueueOperation: async (op) => {
        const id = Math.random().toString(36).substring(7) + '-' + Date.now();
        set((s) => ({
          queue: [...s.queue, { ...op, id }],
        }));
        return id;
      },

      dequeueOperation: (id) => {
        set((s) => ({
          queue: s.queue.filter((item) => item.id !== id),
        }));
      },

      saveIdMap: (endpoint, localId, backendId) => {
        set((s) => {
          const endpointMap = s.idMap[endpoint] || {};
          return {
            idMap: {
              ...s.idMap,
              [endpoint]: {
                ...endpointMap,
                [localId]: backendId,
              },
            },
          };
        });
      },

      getIdMap: (endpoint, localId) => {
        const endpointMap = get().idMap[endpoint];
        if (!endpointMap) return null;
        return endpointMap[localId] ?? null;
      },

      clearAllIdMaps: () => {
        set({ idMap: {} });
      },

      setOnline: (online) => {
        set({ isOnline: online });
        if (online) {
          get().runSync();
        }
      },

      checkConnection: async () => {
        try {
          const res = await fetch(`${apiClient.defaults.baseURL}/auth/me`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });
          const online = res.status === 401 || res.status === 403 || res.ok;
          const wasOffline = !get().isOnline;
          set({ isOnline: online });
          if (online && wasOffline) {
            get().runSync();
          }
          return online;
        } catch {
          set({ isOnline: false });
          return false;
        }
      },

      runSync: async () => {
        const { queue, isSyncing, dequeueOperation, saveIdMap, idMap } = get();
        if (isSyncing || queue.length === 0) return;
        
        set({ isSyncing: true });

        // helper to resolve local FK values to backend IDs
        const resolveId = (endpoint: string, id: any): any => {
          if (id === null || id === undefined) return id;
          const mapped = idMap[endpoint]?.[Number(id)];
          return mapped ?? id;
        };

        const resolvePayloadIds = (endpoint: string, payload: any) => {
          const res = { ...payload };
          // Map FK ids
          if (res.category_id !== undefined) res.category_id = resolveId('categories', res.category_id);
          if (res.shelve_id !== undefined) res.shelve_id = resolveId('shelves', res.shelve_id);
          if (res.rack_id !== undefined) res.rack_id = resolveId('racks', res.rack_id);
          return res;
        };

        try {
          for (const op of queue) {
            const { id: queueId, operation, endpoint, payload, localId } = op;
            
            try {
              if (operation === 'create') {
                const body = resolvePayloadIds(endpoint, payload);
                const { _unsynced, id, ...cleanBody } = body;
                const res = await apiClient.post(`/${endpoint}`, cleanBody);
                const backendId = res.data?.data?.id ?? res.data?.id;
                
                if (backendId && localId) {
                  saveIdMap(endpoint, localId, backendId);
                }
              } else if (operation === 'update') {
                const body = resolvePayloadIds(endpoint, payload);
                const backendId = resolveId(endpoint, body.id);
                const { _unsynced, ...cleanBody } = body;
                await apiClient.put(`/${endpoint}/${backendId}`, cleanBody);
              } else if (operation === 'delete') {
                const backendId = resolveId(endpoint, payload.id);
                await apiClient.delete(`/${endpoint}/${backendId}`);
              } else if (operation === 'entry' || operation === 'withdrawal') {
                const backendId = resolveId(endpoint, payload.id);
                await apiClient.post(`/${endpoint}/${backendId}/${operation}`, {
                  quantity: payload.quantity,
                  notes: payload.notes,
                });
              }

              // Operation successfully synced
              dequeueOperation(queueId);
            } catch (err: any) {
              // Network error? Stop replaying remaining queue to maintain FIFO order
              if (!err.response) {
                set({ isOnline: false });
                break;
              }
              // Validation/business logic error? Dequeue to unblock other operations
              dequeueOperation(queueId);
            }
          }
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: 'sm_sync_queue',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        queue: state.queue,
        idMap: state.idMap,
      }),
    }
  )
);
