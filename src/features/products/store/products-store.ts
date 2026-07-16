import { create } from 'zustand';
import {
  Product,
  CreateProductDto,
  StockActionDto,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  stockEntry,
  stockWithdrawal,
} from '../api/products-api';

interface ProductsState {
  products: Product[];
  selectedProduct: Product | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (dto: CreateProductDto) => Promise<void>;
  update: (id: number, dto: Partial<CreateProductDto>) => Promise<void>;
  remove: (id: number) => Promise<void>;
  entry: (id: number, dto: StockActionDto) => Promise<void>;
  withdrawal: (id: number, dto: StockActionDto) => Promise<void>;
}

export const useProductsStore = create<ProductsState>((set) => ({
  products: [],
  selectedProduct: null,
  loading: false,
  error: null,

  fetchAll: async () => {
    set({ loading: true, error: null });
    try {
      const products = await getProducts();
      set({ products });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  fetchById: async (id) => {
    set({ loading: true, error: null });
    try {
      const product = await getProductById(id);
      set({ selectedProduct: product });
    } catch (err) {
      set({ error: err instanceof Error ? err.message : 'Error' });
    } finally {
      set({ loading: false });
    }
  },

  create: async (dto) => {
    const product = await createProduct(dto);
    set((s) => ({ products: [product, ...s.products] }));
  },

  update: async (id, dto) => {
    const product = await updateProduct(id, dto);
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? product : p)),
      selectedProduct:
        s.selectedProduct?.id === id ? product : s.selectedProduct,
    }));
  },

  remove: async (id) => {
    await deleteProduct(id);
    set((s) => ({
      products: s.products.filter((p) => p.id !== id),
      selectedProduct: s.selectedProduct?.id === id ? null : s.selectedProduct,
    }));
  },

  entry: async (id, dto) => {
    const product = await stockEntry(id, dto);
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? product : p)),
      selectedProduct:
        s.selectedProduct?.id === id ? product : s.selectedProduct,
    }));
  },

  withdrawal: async (id, dto) => {
    const product = await stockWithdrawal(id, dto);
    set((s) => ({
      products: s.products.map((p) => (p.id === id ? product : p)),
      selectedProduct:
        s.selectedProduct?.id === id ? product : s.selectedProduct,
    }));
  },
}));
