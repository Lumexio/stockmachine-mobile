import { create } from 'zustand';
import {
  Rack,
  RackDto,
  getRacks,
  getRackById,
  createRack,
  updateRack,
  deleteRack,
} from '../api/racks-api';

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

export const useRacksStore = create<RacksState>((set) => ({
  racks: [],
  selectedRack: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const racks = await getRacks();
      set({ racks });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const rack = await getRackById(id);
      set({ selectedRack: rack });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  create: async (dto) => {
    const rack = await createRack(dto);
    set((s) => ({ racks: [rack, ...s.racks] }));
  },

  update: async (id, dto) => {
    const rack = await updateRack(id, dto);
    set((s) => ({
      racks: s.racks.map((r) => (r.id === id ? rack : r)),
      selectedRack: s.selectedRack?.id === id ? rack : s.selectedRack,
    }));
  },

  remove: async (id) => {
    await deleteRack(id);
    set((s) => ({
      racks: s.racks.filter((r) => r.id !== id),
      selectedRack: s.selectedRack?.id === id ? null : s.selectedRack,
    }));
  },
}));
