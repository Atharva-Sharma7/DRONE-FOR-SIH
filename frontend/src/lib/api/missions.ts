import { apiGet, apiPost } from './client';
import { Mission, PaginatedResponse } from '@/types';
import { cacheData } from '../db/indexeddb';

export async function getMissions(params?: Record<string, any>): Promise<PaginatedResponse<Mission>> {
  const url = '/missions' + (params ? '?' + new URLSearchParams(params).toString() : '');
  const data = await apiGet<PaginatedResponse<Mission>>(url);
  cacheData(url, data);
  return data;
}

export async function getMission(id: string): Promise<Mission> {
  return apiGet<Mission>(`/missions/${id}`);
}

export async function createMission(data: Partial<Mission>): Promise<Mission> {
  return apiPost<Mission>('/missions', data);
}
