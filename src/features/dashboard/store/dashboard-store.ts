import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  getDashboardSummary,
  getDashboardMovements,
  getDashboardTopProducts,
  DashboardSummary,
  MovementData,
  TopProduct,
} from '../api/dashboard-api';
import { useSyncStore } from '../../../store/sync-store';

interface DashboardState {
  summary: DashboardSummary | null;
  movements: MovementData[];
  topProducts: TopProduct[];
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  updateOfflineSummary: (changes: Partial<DashboardSummary>) => void;
  addOfflineMovement: (date: string, type: 'entry' | 'withdrawal') => void;
}

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set, get) => ({
      summary: null,
      movements: [],
      topProducts: [],
      loading: false,
      error: null,

      updateOfflineSummary: (changes) => {
        set((s) => ({
          summary: {
            total_products: 0,
            total_stock: 0,
            total_value: 0,
            low_stock_count: 0,
            movements_today: 0,
            ...(s.summary || {}),
            ...changes,
          },
        }));
      },

      addOfflineMovement: (date, type) => {
        set((s) => {
          const movements = [...s.movements];
          const today = movements.find(m => m.date === date);
          if (today) {
            if (type === 'entry') today.entries += 1;
            if (type === 'withdrawal') today.withdrawals += 1;
          } else {
            movements.push({ date, entries: type === 'entry' ? 1 : 0, withdrawals: type === 'withdrawal' ? 1 : 0 });
          }
          return { movements };
        });
      },

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
}),
    {
      name: 'sm_dashboard_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        summary: state.summary,
        movements: state.movements,
        topProducts: state.topProducts,
      }),
    }
  )
);
