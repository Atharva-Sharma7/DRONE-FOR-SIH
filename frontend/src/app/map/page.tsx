'use client';
import React, { Suspense } from 'react';
import dynamic from 'next/dynamic';
import { useTranslation } from '@/hooks/useTranslation';
import { LayerControl } from '@/components/map/LayerControl';
import { Spinner } from '@/components/ui/Spinner';

// Dynamically import map to avoid SSR issues with maplibre
const MapComponent = dynamic(() => import('@/components/map/FarmMap'), { 
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-gray-900 rounded-xl">
      <Spinner size="lg" />
    </div>
  )
});

export default function MapPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)]">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <h1 className="text-2xl font-bold text-text-primary">{t('map.title')}</h1>
      </div>
      <div className="relative flex-1 rounded-xl overflow-hidden border border-border shadow-sm">
        <Suspense fallback={<div className="w-full h-full flex items-center justify-center"><Spinner size="lg" /></div>}>
          <MapComponent />
        </Suspense>
        <LayerControl />
      </div>
    </div>
  );
}
