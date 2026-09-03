'use client';
import React from 'react';
import { Card } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { useMapStore } from '@/store/useMapStore';
import * as Switch from '@radix-ui/react-switch';
import { Layers } from 'lucide-react';

export function LayerControl() {
  const { t } = useTranslation();
  const { activeLayers, toggleLayer } = useMapStore();

  const layers = [
    { id: 'rgb', labelKey: 'map.rgbImagery' },
    { id: 'ndvi', labelKey: 'map.ndviHeatmap' },
    { id: 'disease', labelKey: 'map.diseaseZones' },
    { id: 'elevation', labelKey: 'map.elevationContours' },
    { id: 'flightPath', labelKey: 'map.flightPath' },
  ];

  return (
    <Card className="absolute top-4 right-4 w-64 shadow-lg z-10">
      <div className="p-3 border-b border-border flex items-center gap-2">
        <Layers className="w-4 h-4 text-brand-primary" />
        <h3 className="font-semibold text-sm">{t('map.layers')}</h3>
      </div>
      <div className="p-2 flex flex-col gap-1">
        {layers.map(layer => (
          <div key={layer.id} className="flex items-center justify-between p-2 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-md">
            <span className="text-sm text-text-primary">{t(layer.labelKey)}</span>
            <Switch.Root
              className="w-9 h-5 bg-gray-200 dark:bg-gray-700 rounded-full relative data-[state=checked]:bg-brand-primary outline-none cursor-pointer"
              checked={activeLayers[layer.id as keyof typeof activeLayers]}
              onCheckedChange={() => toggleLayer(layer.id as keyof typeof activeLayers)}
            >
              <Switch.Thumb className="block w-4 h-4 bg-white rounded-full transition-transform duration-100 translate-x-0.5 will-change-transform data-[state=checked]:translate-x-[18px]" />
            </Switch.Root>
          </div>
        ))}
      </div>
    </Card>
  );
}
