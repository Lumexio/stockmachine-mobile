import { create } from 'zustand';
import {
  getDashboardSummary,
  getDashboardMovements,
  getDashboardTopProducts,
  DashboardSummary,
  MovementData,
  TopProduct,
} from '../api/dashboard-api';

interface DashboardState {
  summary: DashboardSummary | null;
  movements: MovementData[];
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
}

export const useDashboardStore = create<DashboardState>((set) => ({
  summary: null,
  movements: [],
  topProducts: [],
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const [summary, movements, topProducts] = await Promise.all([
        getDashboardSummary(),
        getDashboardMovements(),
        getDashboardTopProducts(),
      ]);
      set({ summary, movements, topProducts });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },
}));
