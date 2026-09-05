'use client';
import React, { useState, useEffect } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { DetectionCard } from '@/components/disease/DetectionCard';
import { DiseaseFilters } from '@/components/disease/DiseaseFilters';
import { Spinner } from '@/components/ui/Spinner';
import { EmptyState } from '@/components/ui/EmptyState';
import { Bug } from 'lucide-react';
import { getPredictions } from '@/lib/api/predictions';
import { Prediction } from '@/types';

export default function DiseasesPage() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [predictions, setPredictions] = useState<Prediction[]>([]);

  useEffect(() => {
    // Mock data for demo
    const mockData: Prediction[] = [
      {
        id: 'p-1', mission_id: 'm-1', disease_class: 'target_spot', confidence: 0.92, severity: 'high', affected_area_ha: 1.2,
        recommended_action: 'Apply recommended fungicide within 48 hours.', created_at: new Date().toISOString(),
        geom: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [] } } as any
      },
      {
        id: 'p-2', mission_id: 'm-1', disease_class: 'charcoal_rot', confidence: 0.85, severity: 'medium', affected_area_ha: 0.8,
        recommended_action: 'Monitor soil moisture and avoid water stress.', created_at: new Date().toISOString(),
        geom: { type: 'Feature', properties: {}, geometry: { type: 'Polygon', coordinates: [] } } as any
      }
    ];
    
    setTimeout(() => {
      setPredictions(mockData);
      setLoading(false);
    }, 800);
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('disease.title')}</h1>
        <span className="bg-[var(--accent)]/15 text-[var(--accent)] px-3 py-1 rounded-full text-xs font-mono font-bold">
          {predictions.length} {t('disease.detections')}
        </span>
      </div>

      <DiseaseFilters />

      {loading ? (
        <div className="py-20">
          <Spinner size="lg" />
        </div>
      ) : predictions.length === 0 ? (
        <EmptyState 
          icon={Bug}
          titleKey="disease.noDetections"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {predictions.map(pred => (
            <DetectionCard key={pred.id} prediction={pred} />
          ))}
        </div>
      )}
    </div>
  );
}
