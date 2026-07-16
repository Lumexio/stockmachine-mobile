import { apiClient } from '@api/axios-client';

export interface Rack {
  id: number;
  name: string;
  shelve_id: number | null;
  shelve_name?: string;
  org_id: number;
  location_id: number;
  created_at: string;
  updated_at: string;
}

export interface RackDto {
  name: string;
  shelve_id?: number;
}

export async function getRacks(): Promise<Rack[]> {
  const res = await apiClient.get<{ data: Rack[] }>('/racks');
  return res.data.data;
}

export async function getRackById(id: number): Promise<Rack> {
  const res = await apiClient.get<{ data: Rack }>(`/racks/${id}`);
  return res.data.data;
}

export async function createRack(dto: RackDto): Promise<Rack> {
  const res = await apiClient.post<{ data: Rack }>('/racks', dto);
  return res.data.data;
}

export async function updateRack(
  id: number,
  dto: Partial<RackDto>,
): Promise<Rack> {
  const res = await apiClient.put<{ data: Rack }>(`/racks/${id}`, dto);
  return res.data.data;
}

export async function deleteRack(id: number): Promise<void> {
  await apiClient.delete(`/racks/${id}`);
}
