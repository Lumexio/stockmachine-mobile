import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Product,
  CreateProductDto,
  StockActionDto,
  getProducts,
  getProductById,
} from '../api/products-api';
import { useSyncStore } from '../../../store/sync-store';

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

export const useProductsStore = create<ProductsState>()(
  persist(
    (set, get) => ({
      products: [],
      selectedProduct: null,
      loading: false,
      error: null,

      fetchAll: async () => {
        set({ loading: true, error: null });
        try {
          const remoteProducts = await getProducts();
          set({ products: remoteProducts });
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
          const product = await getProductById(id);
          set({ selectedProduct: product });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          const cached = get().products.find((p) => p.id === id);
          if (cached) {
            set({ selectedProduct: cached });
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
        const newProduct: Product = {
          id: localId,
          name: dto.name,
          quantity: dto.quantity,
          category_id: dto.category_id ?? null,
          shelve_id: dto.shelve_id ?? null,
          rack_id: dto.rack_id ?? null,
          status_id: dto.status_id ?? null,
          supplier_id: dto.supplier_id ?? null,
          cost_price: dto.cost_price ?? 0,
          selling_price: dto.selling_price ?? 0,
          min_stock: dto.min_stock ?? 0,
          foto_product: null,
          org_id: 0,
          location_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _unsynced: true,
        };

        set((s) => ({ products: [newProduct, ...s.products] }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'create',
          endpoint: 'products',
          payload: newProduct,
          localId,
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      update: async (id, dto) => {
        set((s) => {
          const updated = s.products.map((p) => {
            if (p.id === id) {
              return { ...p, ...dto, updated_at: new Date().toISOString(), _unsynced: true };
            }
            return p;
          });
          const selected = s.selectedProduct?.id === id
            ? { ...s.selectedProduct, ...dto, updated_at: new Date().toISOString(), _unsynced: true }
            : s.selectedProduct;
          return { products: updated, selectedProduct: selected };
        });

        const currentItem = get().products.find((p) => p.id === id);
        if (currentItem) {
          await useSyncStore.getState().enqueueOperation({
            operation: 'update',
            endpoint: 'products',
            payload: currentItem,
          });
        }

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      remove: async (id) => {
        set((s) => ({
          products: s.products.filter((p) => p.id !== id),
          selectedProduct: s.selectedProduct?.id === id ? null : s.selectedProduct,
        }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'delete',
          endpoint: 'products',
          payload: { id },
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      entry: async (id, dto) => {
        set((s) => {
          const updated = s.products.map((p) => {
            if (p.id === id) {
              const newQty = (p.quantity || 0) + dto.quantity;
              return { ...p, quantity: newQty, updated_at: new Date().toISOString(), _unsynced: true };
            }
            return p;
          });
          const selected = s.selectedProduct?.id === id
            ? { ...s.selectedProduct, quantity: (s.selectedProduct.quantity || 0) + dto.quantity, updated_at: new Date().toISOString(), _unsynced: true }
            : s.selectedProduct;
          return { products: updated, selectedProduct: selected };
        });

        await useSyncStore.getState().enqueueOperation({
          operation: 'entry',
          endpoint: 'products',
          payload: { id, quantity: dto.quantity, notes: dto.notes },
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },

      withdrawal: async (id, dto) => {
        set((s) => {
          const updated = s.products.map((p) => {
            if (p.id === id) {
              const newQty = Math.max(0, (p.quantity || 0) - dto.quantity);
              return { ...p, quantity: newQty, updated_at: new Date().toISOString(), _unsynced: true };
            }
            return p;
          });
          const selected = s.selectedProduct?.id === id
            ? { ...s.selectedProduct, quantity: Math.max(0, (s.selectedProduct.quantity || 0) - dto.quantity), updated_at: new Date().toISOString(), _unsynced: true }
            : s.selectedProduct;
          return { products: updated, selectedProduct: selected };
        });

        await useSyncStore.getState().enqueueOperation({
          operation: 'withdrawal',
          endpoint: 'products',
          payload: { id, quantity: dto.quantity, notes: dto.notes },
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },
    }),
    {
      name: 'sm_products_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        products: state.products,
      }),
    }
  )
);
