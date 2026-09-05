'use client';
import React from 'react';
import { Popup } from 'react-map-gl/maplibre';
import { useTranslation } from '@/hooks/useTranslation';
import { getDiseaseDisplayName, getSeverityColor } from '@/lib/utils';
import { Badge } from '@/components/ui/Badge';

interface DiseasePopupProps {
  info: {
    lngLat: { lng: number; lat: number };
    properties: any;
  };
  onClose: () => void;
}

export function DiseasePopup({ info, onClose }: DiseasePopupProps) {
  const { t } = useTranslation();
  const { properties } = info;

  return (
    <Popup
      longitude={info.lngLat.lng}
      latitude={info.lngLat.lat}
      anchor="bottom"
      onClose={onClose}
      closeOnClick={false}
      className="z-50"
      maxWidth="300px"
    >
      <div className="p-1 min-w-[200px]">
        <h3 className="font-bold text-gray-900 mb-1">{getDiseaseDisplayName(properties.disease_class, t)}</h3>
        <div className="flex items-center gap-2 mb-2">
          <Badge variant="severity" value={properties.severity}>
            {t(`disease.${properties.severity}`)}
          </Badge>
          <span className="text-xs text-gray-500">{properties.confidence}% {t('disease.confidence')}</span>
        </div>
        <p className="text-sm text-gray-700">
          <strong>{t('disease.affectedArea')}:</strong> {properties.area} {t('common.hectares')}
        </p>
      </div>
    </Popup>
  );
}
