'use client';
import React, { useEffect, useState } from 'react';
import { AlertFeed } from '@/components/dashboard/AlertFeed';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { SoilSensorWidget } from '@/components/dashboard/SoilSensorWidget';
import { MissionSummaryCard } from '@/components/dashboard/MissionSummaryCard';
import { QuickActionCards } from '@/components/dashboard/QuickActionCards';

const METRICS = [
  { label: 'crop cover', value: '87.4', unit: '%',  status: 'active'  },
  { label: 'avg ndvi',   value: '0.731', unit: '',   status: 'active'  },
  { label: 'water risk', value: 'med',  unit: '',   status: 'warning' },
  { label: 'temp',       value: '31.2', unit: '°c',  status: 'active'  },
  { label: 'alerts',     value: '3',    unit: 'open', status: 'alert'  },
  { label: 'last flight',value: '6h',  unit: 'ago', status: 'offline' },
];

export default function DashboardPage() {
  const [score, setScore] = useState(0);
  const TARGET = 74;

  // Single purposeful animation: score count-up on mount
  useEffect(() => {
    let current = 0;
    const step = () => {
      current += 2;
      if (current >= TARGET) { setScore(TARGET); return; }
      setScore(current);
      requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 200);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="pb-12" style={{ fontFamily: 'Space Grotesk, sans-serif' }}>

      {/* ── THE HERO MOMENT: Farm Health Score ────────────────── */}
      <div
        className="px-8 pt-10 pb-8"
        style={{ borderBottom: '1px solid var(--border)' }}
      >
        <p
          className="text-[11px] mb-3 tracking-wide"
          style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}
        >
          farm health score · kharif 2024
        </p>
        <div className="flex items-end gap-6">
          <span className="health-score-hero score-reveal">
            {score}
          </span>
          <div className="mb-4">
            <p className="text-lg font-medium" style={{ color: 'var(--text-secondary)' }}>/ 100</p>
            <p className="text-xs mt-1" style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}>
              {score >= 75 ? 'good standing' : score >= 55 ? 'monitor closely' : 'intervention needed'}
            </p>
          </div>
        </div>

        {/* Metric instrument row */}
        <div
          className="grid mt-6 gap-0"
          style={{ gridTemplateColumns: 'repeat(6, 1fr)' }}
        >
          {METRICS.map(m => (
            <div
              key={m.label}
              className="pr-5 border-t border-[var(--border)] pt-3"
            >
              <p className="instrument-label">{m.label}</p>
              <p className="mt-1" style={{ fontFamily: 'IBM Plex Mono, monospace', fontSize: 18, fontWeight: 500, color: 'var(--text-primary)', fontVariantNumeric: 'tabular-nums' }}>
                {m.value}
                {m.unit && <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 2 }}>{m.unit}</span>}
              </p>
              <div className="flex items-center gap-1 mt-1">
                <span className={`status-dot ${m.status}`} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick actions ──────────────────────────────────────── */}
      <div className="px-8 pt-6">
        <QuickActionCards />
      </div>

      {/* ── Data rows ─────────────────────────────────────────── */}
      <div className="px-8 pt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget />
        <SoilSensorWidget />
      </div>

      <div className="px-8 pt-6 grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AlertFeed />
        <MissionSummaryCard />
      </div>
    </div>
  );
}
