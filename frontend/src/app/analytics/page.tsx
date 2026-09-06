'use client';
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { NDVITrendChart } from '@/components/analytics/NDVITrendChart';
import { HealthZoneBreakdown } from '@/components/analytics/HealthZoneBreakdown';
import { CropProgressReviewTab } from '@/components/farmer/CropProgressReviewTab';
import { StatCard } from '@/components/ui/StatCard';
import { TrendingUp, Leaf, CalendarClock } from 'lucide-react';
import * as Tabs from '@radix-ui/react-tabs';

/** Field identifiers for tab navigation */
const FIELDS = [
  { key: 'all', labelKey: 'analytics.allFields' },
  { key: 'cotton', labelKey: 'analytics.cottonNorth' },
  { key: 'soybean', labelKey: 'analytics.soybeanEast' },
  { key: 'mixed', labelKey: 'analytics.mixedSouth' },
];

export default function AnalyticsPage() {
  const { t } = useTranslation();
  const [activeField, setActiveField] = useState('all');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-[var(--text-primary)]">{t('analytics.title')}</h1>

        <Tabs.Root value={activeField} onValueChange={setActiveField} className="w-full sm:w-auto overflow-x-auto">
          <Tabs.List className="flex bg-[var(--surface)] border border-[var(--border)] rounded-lg p-1 min-w-max">
            {FIELDS.map(f => (
              <Tabs.Trigger
                key={f.key}
                value={f.key}
                className="px-4 py-1.5 text-sm font-medium rounded-md text-[var(--text-secondary)] data-[state=active]:bg-[var(--background)] data-[state=active]:text-brand-500 data-[state=active]:shadow-sm transition-all"
              >
                {t(f.labelKey)}
              </Tabs.Trigger>
            ))}
          </Tabs.List>
        </Tabs.Root>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title={t('analytics.avgNdvi')}
          value="0.68"
          trend={2.4}
          icon={TrendingUp}
        />
        <StatCard 
          title={t('analytics.avgNdre')}
          value="0.54"
          trend={-1.2}
          icon={Leaf}
        />
        <StatCard 
          title={t('analytics.daysSinceScan')}
          value="2"
          unit="days"
          icon={CalendarClock}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <NDVITrendChart />
        </div>
        <div className="lg:col-span-1">
          <HealthZoneBreakdown />
        </div>
      </div>

      {/* ── Comprehensive Multi-Crop Growth & Health Progress Review (All Sown Crops) ── */}
      <div className="pt-6 border-t border-[var(--border)]">
        <CropProgressReviewTab />
      </div>
    </div>
  );
}
