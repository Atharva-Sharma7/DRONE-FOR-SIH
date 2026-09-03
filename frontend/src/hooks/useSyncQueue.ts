import { useState, useEffect } from 'react';
import { db } from '../lib/db/indexeddb';
import { SyncQueueItem } from '@/types';

export function useSyncQueue() {
  const [queueItems, setQueueItems] = useState<SyncQueueItem[]>([]);
  const [processingItem, setProcessingItem] = useState<number | null>(null);

  const fetchQueue = async () => {
    const items = await db.syncQueue.toArray();
    setQueueItems(items);
  };

  useEffect(() => {
    fetchQueue();
    const interval = setInterval(fetchQueue, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerSync = async () => {
    const pendingItems = queueItems.filter(item => item.status === 'pending');
    for (const item of pendingItems) {
      if (!item.id) continue;
      setProcessingItem(item.id);
      
      // Simulate chunked upload
      let offset = 0;
      const totalSize = 100;
      
      while (offset < totalSize) {
        await new Promise(resolve => setTimeout(resolve, 500));
        offset += 20;
        await db.syncQueue.update(item.id, { chunkOffset: offset, status: 'syncing' });
        fetchQueue();
      }
      
      await db.syncQueue.update(item.id, { status: 'completed' });
      fetchQueue();
    }
    setProcessingItem(null);
  };

  return {
    queueItems,
    totalPending: queueItems.filter(item => item.status === 'pending' || item.status === 'syncing').length,
    processingItem,
    triggerSync
  };
}
