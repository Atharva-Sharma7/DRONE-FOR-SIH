'use client';
import React from 'react';
import { LiveCameraGrid } from '@/components/drone/LiveCameraGrid';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export default function LiveFeedPage() {
  const { t } = useTranslation();

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-wide">
              {t('liveFeed.title')}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {t('liveFeed.liveStream')}
            </span>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            {t('liveFeed.subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[var(--surface)] border border-[var(--border)] px-3 py-1.5 rounded-xl shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[var(--text-primary)] font-bold">{t('liveFeed.autonomousSurvey')}</span>
        </div>
      </div>

      <LiveCameraGrid />
    </div>
  );
}
