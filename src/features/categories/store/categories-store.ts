import { create } from 'zustand';
import {
  Category,
  CategoryDto,
  getCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../api/categories-api';

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

export const useCategoriesStore = create<CategoriesState>((set) => ({
  categories: [],
  selectedCategory: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const categories = await getCategories();
      set({ categories });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const category = await getCategoryById(id);
      set({ selectedCategory: category });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  create: async (dto) => {
    const category = await createCategory(dto);
    set((s) => ({ categories: [category, ...s.categories] }));
  },

  update: async (id, dto) => {
    const category = await updateCategory(id, dto);
    set((s) => ({
      categories: s.categories.map((c) => (c.id === id ? category : c)),
      selectedCategory:
        s.selectedCategory?.id === id ? category : s.selectedCategory,
    }));
  },

  remove: async (id) => {
    await deleteCategory(id);
    set((s) => ({
      categories: s.categories.filter((c) => c.id !== id),
      selectedCategory:
        s.selectedCategory?.id === id ? null : s.selectedCategory,
    }));
  },
}));
