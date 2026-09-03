import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { AlertTriangle, TrendingDown, ArrowDownRight, Droplets } from 'lucide-react';

export function TerrainInsightPanel() {
  const { t } = useTranslation();

  return (
    <div className="w-full h-full bg-surface border-l border-border flex flex-col p-6 overflow-y-auto">
      <h2 className="text-lg font-bold text-text-primary mb-6">{t('lidar.terrainInsights')}</h2>

      <div className="space-y-4 mb-8">
        <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/50 rounded-lg flex gap-3">
          <Droplets className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-red-800 dark:text-red-400">{t('lidar.highRisk')}</h4>
            <p className="text-xs text-red-700 dark:text-red-300 mt-1">High water pooling risk in North Plot due to 1.2m elevation depression.</p>
          </div>
        </div>

        <div className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-900/50 rounded-lg flex gap-3">
          <TrendingDown className="w-5 h-5 text-yellow-600 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-yellow-800 dark:text-yellow-400">Moderate Slope</h4>
            <p className="text-xs text-yellow-700 dark:text-yellow-300 mt-1">3.2° slope gradient detected in East section.</p>
          </div>
        </div>
      </div>

      <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Metrics</h3>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="p-3 bg-background rounded-lg border border-border">
          <span className="text-xs text-text-secondary block mb-1">{t('lidar.minElevation')}</span>
          <span className="font-mono text-lg font-medium text-text-primary">243.2m</span>
        </div>
        <div className="p-3 bg-background rounded-lg border border-border">
          <span className="text-xs text-text-secondary block mb-1">{t('lidar.maxElevation')}</span>
          <span className="font-mono text-lg font-medium text-text-primary">248.5m</span>
        </div>
        <div className="p-3 bg-background rounded-lg border border-border col-span-2">
          <span className="text-xs text-text-secondary block mb-1">{t('lidar.drainageDirection')}</span>
          <div className="flex items-center gap-2 mt-1">
            <ArrowDownRight className="w-5 h-5 text-blue-500" />
            <span className="font-medium text-text-primary">South-East</span>
          </div>
        </div>
      </div>
    </div>
  );
}
