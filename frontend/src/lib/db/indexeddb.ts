import Dexie, { Table } from 'dexie';
import { Farm, Field, Prediction, Alert, Mission, SyncQueueItem } from '@/types';

export class DroneDB extends Dexie {
  farms!: Table<Farm, string>;
  fields!: Table<Field, string>;
  predictions!: Table<Prediction, string>;
  alerts!: Table<Alert, string>;
  missions!: Table<Mission, string>;
  syncQueue!: Table<SyncQueueItem, number>;
  apiCache!: Table<{ url: string; data: any; timestamp: number }, string>;

  constructor() {
    super('AgriDroneDB');
    this.version(1).stores({
      farms: 'id',
      fields: 'id, farm_id',
      predictions: 'id, mission_id',
      alerts: 'id',
      missions: 'id',
      syncQueue: '++id, status',
      apiCache: 'url'
    });
  }
}

export const db = new DroneDB();

export async function cacheData(url: string, data: any) {
  try {
    await db.apiCache.put({ url, data, timestamp: Date.now() });
  } catch (e) {
    console.error('Failed to cache data', e);
  }
}

export async function getCachedData(url: string) {
  try {
    const cached = await db.apiCache.get(url);
    if (cached) return cached.data;
  } catch (e) {
    console.error('Failed to get cached data', e);
  }
  return null;
}

export async function addToSyncQueue(item: Omit<SyncQueueItem, 'id'>) {
  return db.syncQueue.add(item as SyncQueueItem);
}

export async function getQueueItems() {
  return db.syncQueue.toArray();
}
