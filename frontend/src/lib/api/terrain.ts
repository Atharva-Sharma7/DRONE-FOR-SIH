import { apiGet } from './client';
import { TerrainMetric } from '@/types';
import { cacheData } from '../db/indexeddb';

export async function getTerrainData(fieldId: string): Promise<TerrainMetric[]> {
  const url = `/terrain/fields/${fieldId}`;
  const data = await apiGet<TerrainMetric[]>(url);
  cacheData(url, data);
  return data;
}
