import { create } from 'zustand';
import {
  Shelf,
  ShelfDto,
  getShelves,
  getShelfById,
  createShelf,
  updateShelf,
  deleteShelf,
} from '../api/shelves-api';

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

export const useShelvesStore = create<ShelvesState>((set) => ({
  shelves: [],
  selectedShelf: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const shelves = await getShelves();
      set({ shelves });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const shelf = await getShelfById(id);
      set({ selectedShelf: shelf });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  create: async (dto) => {
    const shelf = await createShelf(dto);
    set((s) => ({ shelves: [shelf, ...s.shelves] }));
  },

  update: async (id, dto) => {
    const shelf = await updateShelf(id, dto);
    set((s) => ({
      shelves: s.shelves.map((sh) => (sh.id === id ? shelf : sh)),
      selectedShelf: s.selectedShelf?.id === id ? shelf : s.selectedShelf,
    }));
  },

  remove: async (id) => {
    await deleteShelf(id);
    set((s) => ({
      shelves: s.shelves.filter((sh) => sh.id !== id),
      selectedShelf: s.selectedShelf?.id === id ? null : s.selectedShelf,
    }));
  },
}));
