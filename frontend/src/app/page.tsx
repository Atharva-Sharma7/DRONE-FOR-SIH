'use client';
import React from 'react';
import { HealthScoreCard } from '@/components/dashboard/HealthScoreCard';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { WaterRiskWidget } from '@/components/dashboard/WaterRiskWidget';
import { QuickActionCards } from '@/components/dashboard/QuickActionCards';
import { MissionSummaryCard } from '@/components/dashboard/MissionSummaryCard';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardPage() {
  const { t } = useTranslation();
  
  const hour = new Date().getHours();
  const timeStr = hour < 12 ? 'morning' : hour < 18 ? 'afternoon' : 'evening';

  return (
    <div className="space-y-6 pb-8">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-text-primary">
          {t('dashboard.greeting').replace('{{time}}', timeStr)}
        </h1>
      </div>

      <QuickActionCards />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <HealthScoreCard />
        </div>
        <div className="lg:col-span-1">
          <AlertFeed />
        </div>
        <div className="lg:col-span-1">
          <WaterRiskWidget />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="lg:col-span-2">
          <MissionSummaryCard />
        </div>
      </div>
    </div>
  );
}
