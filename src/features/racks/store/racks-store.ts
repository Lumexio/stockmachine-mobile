import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Rack,
  RackDto,
  getRacks,
  getRackById,
} from '../api/racks-api';
import { useSyncStore } from '../../../store/sync-store';

interface RacksState {
  racks: Rack[];
  selectedRack: Rack | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (dto: RackDto) => Promise<void>;
  update: (id: number, dto: Partial<RackDto>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useRacksStore = create<RacksState>()(
  persist(
    (set, get) => ({
      racks: [],
      selectedRack: null,
      loading: false,
      error: null,

      fetchAll: async () => {
        set({ loading: true, error: null });
        try {
          const remoteRacks = await getRacks();
          set({ racks: remoteRacks });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Error' });
          useSyncStore.getState().checkConnection();
        } finally {
          set({ loading: false });
        }
      },

      fetchById: async (id) => {
        set({ loading: true, error: null });
        try {
          const rack = await getRackById(id);
          set({ selectedRack: rack });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          const cached = get().racks.find((r) => r.id === id);
          if (cached) {
            set({ selectedRack: cached });
          } else {
            set({ error: err instanceof Error ? err.message : 'Error' });
          }
          useSyncStore.getState().checkConnection();
        } finally {
          set({ loading: false });
        }
      },

      create: async (dto) => {
        const localId = Math.floor(Date.now() + Math.random() * 1000);
        const newRack: Rack = {
          id: localId,
          name: dto.name,
          shelve_id: dto.shelve_id,
          org_id: 0,
          location_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _unsynced: true,
        } as any;

        set((s) => ({ racks: [newRack, ...s.racks] }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'create',
          endpoint: 'racks',
          payload: newRack,
          localId,
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      update: async (id, dto) => {
        set((s) => {
          const updated = s.racks.map((r) => {
            if (r.id === id) {
              return { ...r, ...dto, updated_at: new Date().toISOString(), _unsynced: true };
            }
            return r;
          });
          const selected = s.selectedRack?.id === id
            ? { ...s.selectedRack, ...dto, updated_at: new Date().toISOString(), _unsynced: true }
            : s.selectedRack;
          return { racks: updated, selectedRack: selected };
        });

        const currentItem = get().racks.find((r) => r.id === id);
        if (currentItem) {
          await useSyncStore.getState().enqueueOperation({
            operation: 'update',
            endpoint: 'racks',
            payload: currentItem,
          });
        }

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      remove: async (id) => {
        set((s) => ({
          racks: s.racks.filter((r) => r.id !== id),
          selectedRack: s.selectedRack?.id === id ? null : s.selectedRack,
        }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'delete',
          endpoint: 'racks',
          payload: { id },
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },
    }),
    {
      name: 'sm_racks_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        racks: state.racks,
      }),
    }
  )
);
