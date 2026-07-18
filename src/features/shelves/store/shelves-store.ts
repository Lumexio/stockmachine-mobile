import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Shelf,
  ShelfDto,
  getShelves,
  getShelfById,
} from '../api/shelves-api';
import { useSyncStore } from '../../../store/sync-store';

interface ShelvesState {
  shelves: Shelf[];
  selectedShelf: Shelf | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (dto: ShelfDto) => Promise<void>;
  update: (id: number, dto: Partial<ShelfDto>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useShelvesStore = create<ShelvesState>()(
  persist(
    (set, get) => ({
      shelves: [],
      selectedShelf: null,
      loading: false,
      error: null,

      fetchAll: async () => {
        set({ loading: true, error: null });
        try {
          const remoteShelves = await getShelves();
          set({ shelves: remoteShelves });
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
          const shelf = await getShelfById(id);
          set({ selectedShelf: shelf });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          const cached = get().shelves.find((s) => s.id === id);
          if (cached) {
            set({ selectedShelf: cached });
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
        const newShelf: Shelf = {
          id: localId,
          name: dto.name,
          org_id: 0,
          location_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _unsynced: true,
        } as any;

        set((s) => ({ shelves: [newShelf, ...s.shelves] }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'create',
          endpoint: 'shelves',
          payload: newShelf,
          localId,
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      update: async (id, dto) => {
        set((s) => {
          const updated = s.shelves.map((sh) => {
            if (sh.id === id) {
              return { ...sh, ...dto, updated_at: new Date().toISOString(), _unsynced: true };
            }
            return sh;
          });
          const selected = s.selectedShelf?.id === id
            ? { ...s.selectedShelf, ...dto, updated_at: new Date().toISOString(), _unsynced: true }
            : s.selectedShelf;
          return { shelves: updated, selectedShelf: selected };
        });

        const currentItem = get().shelves.find((sh) => sh.id === id);
        if (currentItem) {
          await useSyncStore.getState().enqueueOperation({
            operation: 'update',
            endpoint: 'shelves',
            payload: currentItem,
          });
        }

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      remove: async (id) => {
        set((s) => ({
          shelves: s.shelves.filter((sh) => sh.id !== id),
          selectedShelf: s.selectedShelf?.id === id ? null : s.selectedShelf,
        }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'delete',
          endpoint: 'shelves',
          payload: { id },
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },
    }),
    {
      name: 'sm_shelves_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        shelves: state.shelves,
      }),
    }
  )
);
