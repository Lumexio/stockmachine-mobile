import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Category,
  CategoryDto,
  getCategories,
  getCategoryById,
} from '../api/categories-api';
import { useSyncStore } from '../../../store/sync-store';

interface CategoriesState {
  categories: Category[];
  selectedCategory: Category | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (dto: CategoryDto) => Promise<void>;
  update: (id: number, dto: Partial<CategoryDto>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useCategoriesStore = create<CategoriesState>()(
  persist(
    (set, get) => ({
      categories: [],
      selectedCategory: null,
      loading: false,
      error: null,

      fetchAll: async () => {
        set({ loading: true, error: null });
        try {
          const remoteCategories = await getCategories();
          set({ categories: remoteCategories });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Error' });
          // If we fail to fetch, we fall back to the cached persisted categories.
          useSyncStore.getState().checkConnection();
        } finally {
          set({ loading: false });
        }
      },

      fetchById: async (id) => {
        set({ loading: true, error: null });
        try {
          const category = await getCategoryById(id);
          set({ selectedCategory: category });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          // Offline fallback: find in cached categories
          const cached = get().categories.find((c) => c.id === id);
          if (cached) {
            set({ selectedCategory: cached });
          } else {
            set({ error: err instanceof Error ? err.message : 'Error' });
          }
          useSyncStore.getState().checkConnection();
        } finally {
          set({ loading: false });
        }
      },

      create: async (dto) => {
        // Optimistic offline-first create
        const localId = Math.floor(Date.now() + Math.random() * 1000);
        const newCategory: Category = {
          id: localId,
          name: dto.name,
          description: dto.description ?? null,
          org_id: 0,
          location_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _unsynced: true,
        } as any;

        set((s) => ({ categories: [newCategory, ...s.categories] }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'create',
          endpoint: 'categories',
          payload: newCategory,
          localId,
        });

        // Trigger background sync
        useSyncStore.getState().runSync().then(() => {
          // If synced, refresh list
          get().fetchAll();
        });
      },

      update: async (id, dto) => {
        // Optimistic update
        set((s) => {
          const updated = s.categories.map((c) => {
            if (c.id === id) {
              return { ...c, ...dto, updated_at: new Date().toISOString(), _unsynced: true };
            }
            return c;
          });
          const selected = s.selectedCategory?.id === id 
            ? { ...s.selectedCategory, ...dto, updated_at: new Date().toISOString(), _unsynced: true }
            : s.selectedCategory;
          return { categories: updated, selectedCategory: selected };
        });

        const currentItem = get().categories.find((c) => c.id === id);
        if (currentItem) {
          await useSyncStore.getState().enqueueOperation({
            operation: 'update',
            endpoint: 'categories',
            payload: currentItem,
          });
        }

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      remove: async (id) => {
        // Optimistic delete
        set((s) => ({
          categories: s.categories.filter((c) => c.id !== id),
          selectedCategory: s.selectedCategory?.id === id ? null : s.selectedCategory,
        }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'delete',
          endpoint: 'categories',
          payload: { id },
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },
    }),
    {
      name: 'sm_categories_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        categories: state.categories,
      }),
    }
  )
);
