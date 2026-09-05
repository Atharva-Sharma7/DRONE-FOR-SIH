'use client';
import React from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { TrendingDown, ArrowDownRight, Droplets, MapPin, ExternalLink, Compass } from 'lucide-react';
import Link from 'next/link';

interface LevelingError {
  id: string;
  title: string;
  description: string;
  type: 'water_pooling' | 'slope_gradient' | 'high_elevation';
  severity: 'high' | 'medium' | 'low';
  lat: number;
  lng: number;
  elevationDeltaM: number;
}

const LEVELING_ERRORS: LevelingError[] = [
  {
    id: 'err-1',
    title: 'High Water Pooling Risk (Depression)',
    description: '1.2m elevation depression causing rain accumulation near North Plot boundary.',
    type: 'water_pooling',
    severity: 'high',
    lat: 21.1482,
    lng: 79.0515,
    elevationDeltaM: -1.2,
  },
  {
    id: 'err-2',
    title: 'Moderate Slope Gradient Concern',
    description: '3.2° steep slope in East field section causing soil erosion risk during heavy monsoon runoff.',
    type: 'slope_gradient',
    severity: 'medium',
    lat: 21.1475,
    lng: 79.0572,
    elevationDeltaM: 0.8,
  },
  {
    id: 'err-3',
    title: 'Uneven Surface Elevation Mound',
    description: '0.6m soil accumulation hump requiring laser land leveling before seed sowing.',
    type: 'high_elevation',
    severity: 'low',
    lat: 21.1405,
    lng: 79.0558,
    elevationDeltaM: 0.6,
  },
];

export function TerrainInsightPanel() {
  const { t } = useTranslation();

  const openGoogleMaps = (lat: number, lng: number) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}&t=k`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="w-full h-full bg-[var(--surface)] border-l border-[var(--border)] flex flex-col p-6 overflow-y-auto font-sans">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[var(--text-primary)]">{t('lidar.terrainInsights')}</h2>
        <span className="text-[11px] font-mono text-[var(--accent)] bg-[var(--surface-2)] px-2 py-0.5 rounded">
          DEM Analysis
        </span>
      </div>

      <div className="mb-4">
        <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3">
          Leveling Errors & Coordinates ({LEVELING_ERRORS.length})
        </h3>
        
        <div className="space-y-3">
          {LEVELING_ERRORS.map((err) => (
            <div 
              key={err.id}
              className={`p-4 bg-[var(--background)] border rounded-xl flex flex-col gap-2.5 transition-all ${
                err.severity === 'high' 
                  ? 'border-red-900/50 bg-red-950/10' 
                  : err.severity === 'medium'
                  ? 'border-amber-900/50 bg-amber-950/10'
                  : 'border-[var(--border)]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {err.type === 'water_pooling' ? (
                    <Droplets className="w-4 h-4 text-red-500 shrink-0" />
                  ) : err.type === 'slope_gradient' ? (
                    <TrendingDown className="w-4 h-4 text-amber-500 shrink-0" />
                  ) : (
                    <Compass className="w-4 h-4 text-blue-400 shrink-0" />
                  )}
                  <h4 className="text-xs font-bold text-[var(--text-primary)]">{err.title}</h4>
                </div>
                <span className={`text-[10px] font-mono px-1.5 py-0.5 rounded font-bold uppercase ${
                  err.severity === 'high' ? 'bg-red-500/20 text-red-400' : 'bg-amber-500/20 text-amber-400'
                }`}>
                  {err.severity}
                </span>
              </div>

              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {err.description}
              </p>

              {/* Exact Pin Coordinates */}
              <div className="flex items-center justify-between pt-2 border-t border-[var(--border)] text-[11px] font-mono text-[var(--text-muted)]">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[var(--accent)]" />
                  <span>{err.lat.toFixed(4)}°N, {err.lng.toFixed(4)}°E</span>
                </div>
                <span className="text-[var(--text-secondary)]">Δh: {err.elevationDeltaM > 0 ? `+${err.elevationDeltaM}` : err.elevationDeltaM}m</span>
              </div>

              {/* Navigation Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-1">
                <button
                  onClick={() => openGoogleMaps(err.lat, err.lng)}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-blue-600/10 hover:bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded-lg text-xs font-mono transition-colors"
                >
                  <span>Google Maps</span>
                  <ExternalLink className="w-3 h-3" />
                </button>

                <Link
                  href={`/map?lat=${err.lat}&lng=${err.lng}`}
                  className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)] rounded-lg text-xs font-mono transition-colors border border-[var(--border)]"
                >
                  <span>Satellite Map</span>
                  <MapPin className="w-3 h-3 text-[var(--green)]" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <h3 className="text-xs font-mono uppercase tracking-wider text-[var(--text-muted)] mb-3 mt-4">
        Terrain Relief Metrics
      </h3>
      
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">{t('lidar.minElevation')}</span>
          <span className="font-mono text-base font-bold text-[var(--text-primary)]">243.2m</span>
        </div>
        <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)]">
          <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">{t('lidar.maxElevation')}</span>
          <span className="font-mono text-base font-bold text-[var(--text-primary)]">248.5m</span>
        </div>
        <div className="p-3 bg-[var(--background)] rounded-xl border border-[var(--border)] col-span-2">
          <span className="text-[11px] font-mono text-[var(--text-muted)] block mb-1">{t('lidar.drainageDirection')}</span>
          <div className="flex items-center gap-2 mt-1">
            <ArrowDownRight className="w-4 h-4 text-blue-400" />
            <span className="font-mono text-sm font-semibold text-[var(--text-primary)]">South-East (3.4% slope)</span>
          </div>
        </div>
      </div>
    </div>
  );
}
