import { apiGet } from './client';
import { Prediction, PaginatedResponse } from '@/types';
import { cacheData } from '../db/indexeddb';

export async function getPredictions(params?: Record<string, any>): Promise<PaginatedResponse<Prediction>> {
  const url = '/predictions' + (params ? '?' + new URLSearchParams(params).toString() : '');
  const data = await apiGet<PaginatedResponse<Prediction>>(url);
  cacheData(url, data);
  return data;
}
