import { apiClient } from '@api/axios-client';

export interface Shelf {
  id: number;
  name: string;
  org_id: number;
  location_id: number;
  created_at: string;
  updated_at: string;
  _unsynced?: boolean;
}

export interface ShelfDto {
  name: string;
}

export async function getShelves(): Promise<Shelf[]> {
  const res = await apiClient.get<{ data: Shelf[] }>('/shelves');
  return res.data.data;
}

export async function getShelfById(id: number): Promise<Shelf> {
  const res = await apiClient.get<{ data: Shelf }>(`/shelves/${id}`);
  return res.data.data;
}

export async function createShelf(dto: ShelfDto): Promise<Shelf> {
  const res = await apiClient.post<{ data: Shelf }>('/shelves', dto);
  return res.data.data;
}

export async function updateShelf(
  id: number,
  dto: Partial<ShelfDto>,
): Promise<Shelf> {
  const res = await apiClient.put<{ data: Shelf }>(`/shelves/${id}`, dto);
  return res.data.data;
}

export async function deleteShelf(id: number): Promise<void> {
  await apiClient.delete(`/shelves/${id}`);
}
