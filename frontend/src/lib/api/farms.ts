import { apiGet } from './client';
import { Farm, Field } from '@/types';
import { cacheData } from '../db/indexeddb';

export async function getFarms(): Promise<Farm[]> {
  const data = await apiGet<Farm[]>('/farms');
  cacheData('/farms', data);
  return data;
}

export async function getFarm(id: string): Promise<Farm> {
  return apiGet<Farm>(`/farms/${id}`);
}

export async function getFieldsForFarm(farmId: string): Promise<Field[]> {
  const data = await apiGet<Field[]>(`/farms/${farmId}/fields`);
  cacheData(`/farms/${farmId}/fields`, data);
  return data;
}

export async function getFieldLayers(fieldId: string): Promise<any> {
  return apiGet(`/fields/${fieldId}/layers`);
}
