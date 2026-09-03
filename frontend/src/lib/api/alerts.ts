import { apiGet, apiPost } from './client';
import { Alert, PaginatedResponse } from '@/types';
import { cacheData } from '../db/indexeddb';

export async function getAlerts(params?: Record<string, any>): Promise<PaginatedResponse<Alert>> {
  const url = '/alerts' + (params ? '?' + new URLSearchParams(params).toString() : '');
  const data = await apiGet<PaginatedResponse<Alert>>(url);
  cacheData(url, data);
  return data;
}

export async function markAlertRead(id: string): Promise<Alert> {
  return apiPost<Alert>(`/alerts/${id}/read`);
}

export async function getAlertSummary(): Promise<any> {
  return apiGet('/alerts/summary');
}
