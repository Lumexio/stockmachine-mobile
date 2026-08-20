import { apiClient } from '@api/axios-client';

export interface Supplier {
  id: number;
  name: string;
  contact_name: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  org_id: number;
  location_id: number;
  created_at: string;
  updated_at: string;
}

export interface SupplierDto {
  name: string;
  contact_name?: string | null;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
}

export async function getSuppliers(): Promise<Supplier[]> {
  const response = await apiClient.get<{ data: Supplier[] }>('/suppliers');
  return response.data?.data || [];
}

export async function getSupplierById(id: number): Promise<Supplier> {
  const response = await apiClient.get<{ data: Supplier }>(`/suppliers/${id}`);
  return response.data?.data;
}

export async function createSupplier(dto: SupplierDto): Promise<Supplier> {
  const response = await apiClient.post<{ data: Supplier }>('/suppliers', dto);
  return response.data?.data;
}

export async function updateSupplier(id: number, dto: Partial<SupplierDto>): Promise<Supplier> {
  const response = await apiClient.put<{ data: Supplier }>(`/suppliers/${id}`, dto);
  return response.data?.data;
}

export async function deleteSupplier(id: number): Promise<void> {
  await apiClient.delete(`/suppliers/${id}`);
}
