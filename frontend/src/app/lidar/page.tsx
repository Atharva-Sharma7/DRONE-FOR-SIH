'use client';
import React from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
import { TerrainInsightPanel } from '@/components/lidar/TerrainInsightPanel';
import { Spinner } from '@/components/ui/Spinner';

const PotreeViewer = dynamic(() => import('@/components/lidar/PotreeViewer').then(mod => mod.PotreeViewer), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-slate-900 rounded-l-xl">
      <Spinner size="lg" />
    </div>
  )
});

export default function LidarPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-text-primary">{t('lidar.title')}</h1>
      </div>
      
      <div className="flex-1 flex flex-col md:flex-row border border-border rounded-xl shadow-sm overflow-hidden bg-surface">
        <div className="flex-[2] h-[50vh] md:h-auto min-h-0 relative">
          <PotreeViewer />
        </div>
        <div className="flex-1 md:max-w-md h-auto min-h-0 border-t md:border-t-0 md:border-l border-border">
          <TerrainInsightPanel />
        </div>
      </div>
    </div>
  );
}
