import { apiClient } from '@api/axios-client';

export interface DashboardSummary {
  total_products: number;
  total_stock: number;
  low_stock_count: number;
  movements_today: number;
}

export interface MovementData {
  date: string;
  entries: number;
  withdrawals: number;
}

export interface TopProduct {
  id: number;
  name: string;
  quantity: number;
  movements: number;
}

export async function getDashboardSummary(): Promise<DashboardSummary> {
  const res = await apiClient.get<{ data: DashboardSummary }>(
    '/dashboard/summary',
  );
  return res.data.data;
}

export async function getDashboardMovements(): Promise<MovementData[]> {
  const res = await apiClient.get<{ data: MovementData[] }>(
    '/dashboard/movements',
  );
  return res.data.data;
}

export async function getDashboardTopProducts(): Promise<TopProduct[]> {
  const res = await apiClient.get<{ data: TopProduct[] }>(
    '/dashboard/top-products',
  );
  return res.data.data;
}
