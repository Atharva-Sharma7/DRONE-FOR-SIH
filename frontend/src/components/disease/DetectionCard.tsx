import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { useTranslation } from '@/hooks/useTranslation';
import { MapPin, Info } from 'lucide-react';
import { getDiseaseDisplayName, formatHectares } from '@/lib/utils';
import { Prediction } from '@/types';
import { useMapStore } from '@/store/useMapStore';
import { useRouter } from 'next/navigation';

export function DetectionCard({ prediction }: { prediction: Prediction }) {
  const { t } = useTranslation();
  const router = useRouter();
  const setSelectedPredictionId = useMapStore(state => state.setSelectedPredictionId);

  const handleViewOnMap = () => {
    setSelectedPredictionId(prediction.id);
    router.push('/map');
  };

  return (
    <Card className="hover:border-brand-primary/50 transition-colors">
      <CardContent className="p-5">
        <div className="flex justify-between items-start mb-4">
          <h3 className="font-semibold text-lg text-text-primary">
            {getDiseaseDisplayName(prediction.disease_class, t)}
          </h3>
          <Badge variant="severity" value={prediction.severity}>
            {t(`disease.${prediction.severity}`)}
          </Badge>
        </div>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-text-secondary">{t('disease.confidence')}</span>
              <span className="font-medium text-text-primary">{Math.round(prediction.confidence * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-brand-accent h-2 rounded-full" 
                style={{ width: `${Math.round(prediction.confidence * 100)}%` }}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="bg-background rounded-md p-2 border border-border">
              <span className="block text-text-secondary text-xs mb-1">{t('disease.affectedArea')}</span>
              <span className="font-medium text-text-primary">{formatHectares(prediction.affected_area_ha)}</span>
            </div>
            <div className="bg-background rounded-md p-2 border border-border flex flex-col justify-center">
              <span className="block text-text-secondary text-xs mb-1">{t('disease.location')}</span>
              <span className="font-mono text-xs text-text-primary flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {prediction.geom.geometry.type === 'Polygon' ? 'Polygon' : 'Point'}
              </span>
            </div>
          </div>

          <div className="bg-brand-primary/5 border border-brand-primary/20 rounded-md p-3 text-sm flex gap-2 items-start">
            <Info className="w-4 h-4 text-brand-primary mt-0.5 shrink-0" />
            <div>
              <span className="font-medium text-brand-primary block mb-1">{t('disease.recommendedAction')}</span>
              <span className="text-text-secondary">{prediction.recommended_action}</span>
            </div>
          </div>

          <button 
            onClick={handleViewOnMap}
            className="w-full py-2 bg-background border border-border hover:bg-gray-50 dark:hover:bg-gray-800 text-text-primary rounded-md text-sm font-medium transition-colors"
          >
            {t('common.viewOnMap')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
