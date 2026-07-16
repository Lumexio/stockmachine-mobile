import { apiClient } from '@api/axios-client';

export type EntityType = 'product' | 'category' | 'rack' | 'shelf';
export type OperationType =
  | 'entry'
  | 'withdrawal'
  | 'create'
  | 'update'
  | 'delete';

export interface HistoryRecord {
  id: number;
  entity_type: EntityType;
  entity_id: number;
  operation: OperationType;
  quantity_before: number | null;
  quantity_after: number | null;
  user_id: number;
  org_id: number;
  location_id: number;
  notes: string | null;
  created_at: string;
}

export interface HistoryFilters {
  entity_type?: EntityType;
  operation?: OperationType;
  page?: number;
  limit?: number;
}

export interface HistoryPage {
  items: HistoryRecord[];
  total: number;
  page: number;
  limit: number;
}

export async function getHistory(
  filters: HistoryFilters = {},
): Promise<HistoryPage> {
  const res = await apiClient.get<{ data: HistoryPage }>('/history', {
    params: {
      ...(filters.entity_type && { entity_type: filters.entity_type }),
      ...(filters.operation && { operation: filters.operation }),
      ...(filters.page !== undefined && { page: filters.page }),
      ...(filters.limit !== undefined && { limit: filters.limit }),
    },
  });
  return res.data.data;
}
