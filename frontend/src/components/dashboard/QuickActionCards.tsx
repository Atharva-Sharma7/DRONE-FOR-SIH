'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { Bug, RefreshCw, Plane, Droplets } from 'lucide-react';
import { useSyncQueue } from '@/hooks/useSyncQueue';
import { QuickSprayModal } from '@/components/farmer/QuickSprayModal';

export function QuickActionCards() {
  const { t } = useTranslation();
  const { totalPending } = useSyncQueue();
  const [isSprayOpen, setIsSprayOpen] = useState(false);

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-sans">
        {/* Inspection Required */}
        <Link href="/diseases" className="flex flex-col items-center justify-center p-4 bg-red-500/10 border border-red-500/30 rounded-2xl hover:border-red-500 transition-all shadow-sm group">
          <Bug className="w-6 h-6 text-red-600 dark:text-red-400 mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-red-700 dark:text-red-400 text-center text-xs">
            2 {t('dashboard.inspectionRequired', { defaultValue: 'Areas Require Inspection' })}
          </span>
        </Link>
        
        {/* Sync Queue */}
        <div className="flex flex-col items-center justify-center p-4 bg-blue-500/10 border border-blue-500/30 rounded-2xl shadow-sm">
          <RefreshCw className="w-6 h-6 text-blue-600 dark:text-blue-400 mb-2" />
          <span className="font-bold text-blue-700 dark:text-blue-400 text-center text-xs">
            {totalPending} {t('dashboard.syncQueue', { defaultValue: 'Sync Queue' })}
          </span>
        </div>

        {/* 1-Tap Drone Sprayer Action Card */}
        <button
          onClick={() => setIsSprayOpen(true)}
          className="flex flex-col items-center justify-center p-4 bg-emerald-500/10 border-2 border-emerald-500/50 rounded-2xl hover:bg-emerald-500/20 transition-all shadow-sm group text-center"
        >
          <Droplets className="w-6 h-6 text-emerald-600 dark:text-emerald-400 mb-2 animate-bounce group-hover:scale-110 transition-transform" />
          <span className="font-bold text-emerald-700 dark:text-emerald-400 text-xs">
            1-Tap Drone Sprayer
          </span>
        </button>

        {/* Schedule Mission */}
        <Link href="/missions" className="flex flex-col items-center justify-center p-4 bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl hover:border-[var(--accent)] transition-all shadow-sm group">
          <Plane className="w-6 h-6 text-[var(--accent)] mb-2 group-hover:scale-110 transition-transform" />
          <span className="font-bold text-[var(--text-primary)] text-center text-xs">
            {t('dashboard.scheduleMission', { defaultValue: 'Schedule Mission' })}
          </span>
        </Link>
      </div>

      <QuickSprayModal
        isOpen={isSprayOpen}
        onClose={() => setIsSprayOpen(false)}
        targetField="Soybean East Field · Sector B-3"
        targetDisease="Severe Charcoal Rot"
        recommendedMedicine="Trichoderma viride bio-fungicide (1.4L spray mix)"
      />
    </>
  );
}
