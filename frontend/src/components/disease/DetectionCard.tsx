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
            <div className="bg-[var(--surface-2)] rounded-xl p-2.5 border border-[var(--border)]">
              <span className="block text-[var(--text-muted)] text-xs mb-1 font-semibold">{t('disease.affectedArea')}</span>
              <span className="font-bold text-[var(--text-primary)] font-mono">{formatHectares(prediction.affected_area_ha)}</span>
            </div>
            <div className="bg-[var(--surface-2)] rounded-xl p-2.5 border border-[var(--border)] flex flex-col justify-center">
              <span className="block text-[var(--text-muted)] text-xs mb-1 font-semibold">{t('disease.location')}</span>
              <span className="font-mono text-xs text-[var(--text-primary)] font-semibold flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[var(--accent)]" />
                {prediction.geom.geometry.type === 'Polygon' ? 'Polygon' : 'Point'}
              </span>
            </div>
          </div>

          <div className="bg-[var(--surface-2)]/80 border border-[var(--border)] rounded-xl p-3.5 text-xs flex gap-2.5 items-start">
            <Info className="w-4 h-4 text-[var(--accent)] mt-0.5 shrink-0" />
            <div>
              <span className="font-bold text-[var(--text-primary)] block mb-1 font-mono uppercase tracking-wider text-[10px]">
                {t('disease.recommendedAction')}
              </span>
              <span className="text-[var(--text-secondary)] font-medium leading-relaxed">{prediction.recommended_action}</span>
            </div>
          </div>

          <button 
            onClick={handleViewOnMap}
            className="w-full py-2 bg-[var(--surface-2)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--text-primary)] rounded-xl text-xs font-mono font-bold transition-all shadow-sm"
          >
            {t('common.viewOnMap')}
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
