import { apiClient } from '@api/axios-client';

export interface Product {
  id: number;
  name: string;
  description: string | null;
  quantity: number;
  category_id: number | null;
  shelve_id: number | null;
  rack_id: number | null;
  status_id: number | null;
  supplier_id: number | null;
  cost_price: number;
  selling_price: number;
  min_stock: number;
  foto_product: string | null;
  org_id: number;
  location_id: number;
  created_at: string;
  updated_at: string;
  _unsynced?: boolean;
}

export interface CreateProductDto {
  name: string;
  description?: string;
  quantity: number;
  category_id?: number;
  shelve_id?: number;
  rack_id?: number;
  status_id?: number;
  supplier_id?: number;
  cost_price?: number;
  selling_price?: number;
  min_stock?: number;
}

export interface StockActionDto {
  quantity: number;
  notes?: string;
}

export async function getProducts(): Promise<Product[]> {
  const res = await apiClient.get<{ data: Product[] }>('/products');
  return res.data.data;
}

export async function getProductById(id: number): Promise<Product> {
  const res = await apiClient.get<{ data: Product }>(`/products/${id}`);
  return res.data.data;
}

export async function createProduct(dto: CreateProductDto): Promise<Product> {
  const res = await apiClient.post<{ data: Product }>('/products', dto);
  return res.data.data;
}

export async function updateProduct(
  id: number,
  dto: Partial<CreateProductDto>,
): Promise<Product> {
  const res = await apiClient.put<{ data: Product }>(`/products/${id}`, dto);
  return res.data.data;
}

export async function deleteProduct(id: number): Promise<void> {
  await apiClient.delete(`/products/${id}`);
}

export async function stockEntry(
  id: number,
  dto: StockActionDto,
): Promise<Product> {
  const res = await apiClient.post<{ data: Product }>(
    `/products/${id}/entry`,
    dto,
  );
  return res.data.data;
}

export async function stockWithdrawal(
  id: number,
  dto: StockActionDto,
): Promise<Product> {
  const res = await apiClient.post<{ data: Product }>(
    `/products/${id}/withdrawal`,
    dto,
  );
  return res.data.data;
}
