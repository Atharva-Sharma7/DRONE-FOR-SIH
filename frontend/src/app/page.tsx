'use client';
import React, { useEffect, useState } from 'react';
import { InformationHub } from '@/components/dashboard/InformationHub';
import { DroneDetailsCard } from '@/components/dashboard/DroneDetailsCard';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { SoilSensorWidget } from '@/components/dashboard/SoilSensorWidget';
import { MissionSummaryCard } from '@/components/dashboard/MissionSummaryCard';
import { QuickActionCards } from '@/components/dashboard/QuickActionCards';
import { Sparkles, Navigation2 } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [score, setScore] = useState(0);
  const TARGET = 78;

  useEffect(() => {
    let current = 0;
    const step = () => {
      current += 2;
      if (current >= TARGET) { setScore(TARGET); return; }
      setScore(current);
      requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 120);
    return () => clearTimeout(timer);
  }, []);

  const METRICS = [
    { label: t('dashboard.cropCover'),     value: '87.4', unit: '%',    status: 'active'  },
    { label: t('dashboard.avgNdvi'),       value: '0.731', unit: '',     status: 'active'  },
    { label: t('dashboard.waterRisk'),     value: t('dashboard.moderate'), unit: '',  status: 'warning' },
    { label: t('dashboard.canopyTemp'),    value: '31.2', unit: '°C',   status: 'active'  },
    { label: t('dashboard.criticalAlerts'), value: '2', unit: 'Urgent', status: 'alert'  },
    { label: t('dashboard.lastSurvey'),    value: '38', unit: 'Min',    status: 'active' },
  ];

  return (
    <div className="space-y-7 pb-16 font-sans">
      {/* ── TOP SECTION: Farm Command Station (Left) + DRONE INFO (TOP RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center (7 Cols): Farm Health & Command Station */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider text-[var(--accent)] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Kharif Precision Agriculture · 2024-2026
                </span>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-1 tracking-tight">
                  {t('dashboard.title')}
                </h1>
                <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                  {t('dashboard.sector')} · 21.0250°N, 79.0350°E
                </p>
              </div>

              <Link
                href="/map"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-amber-500 text-black text-xs font-mono font-bold transition-all shadow self-start sm:self-auto"
              >
                <Navigation2 className="w-4 h-4" />
                <span>{t('dashboard.launchMap')}</span>
              </Link>
            </div>

            {/* Health Score Count-Up & Crop Standing */}
            <div className="flex items-end gap-5 pt-5 pb-3">
              <span className="health-score-hero score-reveal">
                {score}
              </span>
              <div className="mb-2">
                <p className="text-xl font-bold text-[var(--text-secondary)]">/ 100</p>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {score >= 75 ? t('dashboard.cropStanding') : t('dashboard.inspectionNeeded')}
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              {t('dashboard.summaryText')}
            </p>
          </div>

          {/* Metric Instrument Row with Full Translations */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-[var(--border)]">
            {METRICS.map(m => (
              <div
                key={m.label}
                className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]"
              >
                <p className="text-[10px] font-semibold text-[var(--text-secondary)] capitalize leading-tight truncate">
                  {m.label}
                </p>
                <p className="mt-1 font-mono text-base font-bold text-[var(--text-primary)]">
                  {m.value}
                  {m.unit && <span className="text-[10px] text-[var(--text-muted)] ml-1 font-normal">{m.unit}</span>}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`status-dot ${m.status}`} />
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">
                    {m.status === 'alert' ? 'Warning' : 'Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP RIGHT (5 Cols): DRONE TELEMETRY & HARDWARE CARD */}
        <div className="lg:col-span-5">
          <DroneDetailsCard compact={true} />
        </div>
      </div>

      {/* ── INFORMATION HUB (Critical Alerts in Red + Categorized Tabs) ── */}
      <InformationHub />

      {/* ── FULL DRONE FLEET & MULTIMODAL SENSOR SPECIFICATIONS ── */}
      <DroneDetailsCard compact={false} />

      {/* ── Quick Actions Grid ── */}
      <QuickActionCards />

      {/* ── Data Rows: Weather & Soil Sensors ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget />
        <SoilSensorWidget />
      </div>

      {/* ── Mission Summary ── */}
      <MissionSummaryCard />
    </div>
  );
}
