import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  Supplier,
  SupplierDto,
  getSuppliers,
  getSupplierById,
} from '../api/suppliers-api';
import { useSyncStore } from '../../../store/sync-store';

interface SuppliersState {
  suppliers: Supplier[];
  selectedSupplier: Supplier | null;
  loading: boolean;
  error: string | null;
  fetchAll: () => Promise<void>;
  fetchById: (id: number) => Promise<void>;
  create: (dto: SupplierDto) => Promise<void>;
  update: (id: number, dto: Partial<SupplierDto>) => Promise<void>;
  remove: (id: number) => Promise<void>;
}

export const useSuppliersStore = create<SuppliersState>()(
  persist(
    (set, get) => ({
      suppliers: [],
      selectedSupplier: null,
      loading: false,
      error: null,

      fetchAll: async () => {
        set({ loading: true, error: null });
        try {
          const remoteSuppliers = await getSuppliers();
          set({ suppliers: remoteSuppliers });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          set({ error: err instanceof Error ? err.message : 'Error' });
          // If we fail to fetch, we fall back to the cached persisted suppliers.
          useSyncStore.getState().checkConnection();
        } finally {
          set({ loading: false });
        }
      },

      fetchById: async (id) => {
        set({ loading: true, error: null });
        try {
          const supplier = await getSupplierById(id);
          set({ selectedSupplier: supplier });
          useSyncStore.getState().setOnline(true);
        } catch (err) {
          // Offline fallback: find in cached suppliers
          const cached = get().suppliers.find((s) => s.id === id);
          if (cached) {
            set({ selectedSupplier: cached });
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
        const newSupplier: Supplier = {
          id: localId,
          name: dto.name,
          contact_name: dto.contact_name ?? null,
          email: dto.email ?? null,
          phone: dto.phone ?? null,
          address: dto.address ?? null,
          org_id: 0,
          location_id: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          _unsynced: true,
        } as any;

        set((s) => ({ suppliers: [newSupplier, ...s.suppliers] }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'create',
          endpoint: 'suppliers',
          payload: newSupplier,
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
          const updated = s.suppliers.map((sup) => {
            if (sup.id === id) {
              return { ...sup, ...dto, updated_at: new Date().toISOString(), _unsynced: true };
            }
            return sup;
          });
          const selected = s.selectedSupplier?.id === id 
            ? { ...s.selectedSupplier, ...dto, updated_at: new Date().toISOString(), _unsynced: true }
            : s.selectedSupplier;
          return { suppliers: updated, selectedSupplier: selected };
        });

        const currentItem = get().suppliers.find((sup) => sup.id === id);
        if (currentItem) {
          await useSyncStore.getState().enqueueOperation({
            operation: 'update',
            endpoint: 'suppliers',
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
          suppliers: s.suppliers.filter((sup) => sup.id !== id),
          selectedSupplier: s.selectedSupplier?.id === id ? null : s.selectedSupplier,
        }));

        await useSyncStore.getState().enqueueOperation({
          operation: 'delete',
          endpoint: 'suppliers',
          payload: { id },
        });

        useSyncStore.getState().runSync().then(() => {
          get().fetchAll();
        });
      },
    }),
    {
      name: 'sm_suppliers_store',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        suppliers: state.suppliers,
      }),
    }
  )
);
