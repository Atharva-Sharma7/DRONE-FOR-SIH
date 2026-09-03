'use client';
import React from 'react';
import { useSyncQueue } from '@/hooks/useSyncQueue';

export function SyncProgressBar({ missionId }: { missionId: string }) {
  const { queueItems } = useSyncQueue();
  
  // Find queue item related to this mission (mock implementation)
  const item = queueItems.find(i => i.payload?.missionId === missionId);
  const progress = item ? (item.chunkOffset / 100) * 100 : 45; // Default mock progress

  return (
    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5 mb-1 overflow-hidden">
      <div 
        className="bg-blue-500 h-1.5 rounded-full transition-all duration-300" 
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}
