'use client';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useMapStore } from '@/store/useMapStore';
import { Layers, Zap } from 'lucide-react';

const LAYERS = [
  { key: 'boundary'   as const, labelKey: 'map.fieldBoundaries', color: '#10b981' },
  { key: 'disease'    as const, labelKey: 'map.diseaseZones',     color: '#dc2626' },
  { key: 'ndvi'       as const, labelKey: 'map.ndviHeatmap',      color: '#84cc16' },
  { key: 'terrain'    as const, labelKey: 'map.elevationContours',color: '#f59e0b' },
  { key: 'flightPath' as const, labelKey: 'map.flightPath',       color: '#60a5fa' },
  { key: 'telemetry'  as const, labelKey: 'map.liveTelemetry',    color: '#a78bfa' },
];

export function LayerControl() {
  const { t } = useTranslation();
  const { activeLayers, toggleLayer } = useMapStore();

  return (
    <div className="absolute top-4 right-4 bg-slate-900/95 backdrop-blur-sm rounded-xl p-3 shadow-xl border border-slate-700 w-52">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-4 h-4 text-slate-300" />
        <span className="text-sm font-semibold text-white">{t('map.layers')}</span>
      </div>
      <div className="space-y-2">
        {LAYERS.map(({ key, labelKey, color }) => (
          <label key={key} className="flex items-center gap-3 cursor-pointer group">
            <div className="relative">
              <input
                type="checkbox"
                checked={activeLayers[key]}
                onChange={() => toggleLayer(key)}
                className="sr-only"
              />
              <div
                className={`w-9 h-5 rounded-full transition-colors duration-200 ${
                  activeLayers[key] ? 'bg-blue-600' : 'bg-slate-600'
                }`}
              >
                <div
                  className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${
                    activeLayers[key] ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: color }} />
              <span className="text-xs text-slate-300 group-hover:text-white transition-colors">{t(labelKey)}</span>
            </div>
            {key === 'telemetry' && activeLayers[key] && (
              <Zap className="w-3 h-3 text-violet-400 animate-pulse ml-auto" />
            )}
          </label>
        ))}
      </div>
    </div>
  );
}
