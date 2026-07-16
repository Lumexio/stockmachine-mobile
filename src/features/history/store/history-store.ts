import { create } from 'zustand';
import {
  HistoryRecord,
  EntityType,
  OperationType,
  getHistory,
} from '../api/history-api';

const PAGE_LIMIT = 20;

interface HistoryState {
  items: HistoryRecord[];
  loading: boolean;
  error: string | null;
  page: number;
  total: number;
  entityTypeFilter: EntityType | undefined;
  operationFilter: OperationType | undefined;
  fetchPage: (page?: number) => Promise<void>;
  setEntityTypeFilter: (value: EntityType | undefined) => void;
  setOperationFilter: (value: OperationType | undefined) => void;
  reset: () => void;
}

export const useHistoryStore = create<HistoryState>((set, get) => ({
  items: [],
  loading: false,
  error: null,
  page: 1,
  total: 0,
  entityTypeFilter: undefined,
  operationFilter: undefined,

  fetchPage: async (page = 1) => {
    const { entityTypeFilter, operationFilter } = get();
    set({ loading: true, error: null });
    try {
      const result = await getHistory({
        entity_type: entityTypeFilter,
        operation: operationFilter,
        page,
        limit: PAGE_LIMIT,
      });
      set((s) => ({
        items: page === 1 ? result.items : [...s.items, ...result.items],
        total: result.total,
        page,
      }));
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  setEntityTypeFilter: (value) => {
    set({ entityTypeFilter: value, items: [], page: 1 });
    get().fetchPage(1);
  },

  setOperationFilter: (value) => {
    set({ operationFilter: value, items: [], page: 1 });
    get().fetchPage(1);
  },

  reset: () => {
    set({
      items: [],
      page: 1,
      total: 0,
      entityTypeFilter: undefined,
      operationFilter: undefined,
    });
  },
}));
