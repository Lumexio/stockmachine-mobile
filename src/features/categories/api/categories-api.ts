import { apiClient } from '@api/axios-client';

export interface Category {
  id: number;
  name: string;
  description: string | null;
  org_id: number;
  location_id: number;
  created_at: string;
  updated_at: string;
  _unsynced?: boolean;
}

export interface CategoryDto {
  name: string;
  description?: string;
}

export async function getCategories(): Promise<Category[]> {
  const res = await apiClient.get<{ data: Category[] }>('/categories');
  return res.data.data;
}

export async function getCategoryById(id: number): Promise<Category> {
  const res = await apiClient.get<{ data: Category }>(`/categories/${id}`);
  return res.data.data;
}

export async function createCategory(dto: CategoryDto): Promise<Category> {
  const res = await apiClient.post<{ data: Category }>('/categories', dto);
  return res.data.data;
}

export async function updateCategory(
  id: number,
  dto: Partial<CategoryDto>,
): Promise<Category> {
  const res = await apiClient.put<{ data: Category }>(`/categories/${id}`, dto);
  return res.data.data;
}

export async function deleteCategory(id: number): Promise<void> {
  await apiClient.delete(`/categories/${id}`);
}
