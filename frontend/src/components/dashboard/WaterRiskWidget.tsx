import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { useTranslation } from '@/hooks/useTranslation';
import { Droplets } from 'lucide-react';
import { cn } from '@/lib/utils';

export function WaterRiskWidget() {
  const { t } = useTranslation();
  
  const riskLevel = 'high'; // mock
  const affectedArea = 2.4;
  
  const colors = {
    low: 'text-blue-500 bg-blue-100 dark:bg-blue-900/30',
    medium: 'text-yellow-500 bg-yellow-100 dark:bg-yellow-900/30',
    high: 'text-orange-500 bg-orange-100 dark:bg-orange-900/30'
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Droplets className="w-5 h-5 text-blue-500" />
          {t('dashboard.waterRisk')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center pt-2">
        <div className={cn("w-24 h-24 rounded-full flex items-center justify-center mb-4", colors[riskLevel])}>
          <span className="text-xl font-bold uppercase">{t(`lidar.${riskLevel}Risk`)}</span>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-text-primary">{affectedArea} <span className="text-sm font-normal text-text-secondary">{t('common.hectares')}</span></p>
          <p className="text-sm text-text-secondary mt-1">North Plot has high pooling risk due to elevation depression.</p>
        </div>
      </CardContent>
    </Card>
  );
}
