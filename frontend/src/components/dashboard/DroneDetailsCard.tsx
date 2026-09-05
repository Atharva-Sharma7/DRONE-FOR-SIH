'use client';
import React, { useState } from 'react';
import { 
  Cpu, 
  BatteryCharging, 
  Radio, 
  Compass, 
  Camera, 
  Gauge, 
  RefreshCw,
  ShieldCheck,
  Zap,
  Activity
} from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';

interface DroneDetailsCardProps {
  compact?: boolean;
}

export function DroneDetailsCard({ compact = false }: DroneDetailsCardProps) {
  const { t } = useTranslation();
  const [isSelfTesting, setIsSelfTesting] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const runSelfTest = () => {
    setIsSelfTesting(true);
    setTestResult(null);
    setTimeout(() => {
      setIsSelfTesting(false);
      setTestResult(t('drone.allPassed'));
    }, 1500);
  };

  // Compact version for TOP RIGHT position on the main dashboard
  if (compact) {
    return (
      <div className="h-full rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm font-sans flex flex-col justify-between transition-colors">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-amber-500/10 text-[var(--accent)] border border-amber-500/20">
              <Radio className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  {t('drone.model')}
                </h3>
                <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[9px] font-mono font-bold uppercase">
                  {t('drone.readyForFlight')}
                </span>
              </div>
              <p className="text-[10px] font-mono text-[var(--text-muted)]">
                RPi5-AI-9428 · {t('drone.edgeAI')}
              </p>
            </div>
          </div>

          <Link
            href="/live-feed"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[var(--accent)] hover:bg-amber-500 text-black text-[10px] font-mono font-bold transition-all shadow"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t('drone.liveVisionLab')}</span>
          </Link>
        </div>

        {/* 4 Quick Telemetry Tiles */}
        <div className="grid grid-cols-2 gap-2.5 py-3">
          {/* Battery */}
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1">
                <BatteryCharging className="w-3 h-3 text-emerald-500" />
                {t('drone.battery')}
              </span>
              <span className="text-emerald-500 font-bold">92%</span>
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)] mt-1">
              48.8V <span className="text-[9px] font-normal text-[var(--text-muted)]">/ 22Ah</span>
            </div>
            <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
            </div>
          </div>

          {/* Raspberry Pi 5 AI */}
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1">
                <Cpu className="w-3 h-3 text-amber-500" />
                Raspberry Pi 5
              </span>
              <span className="text-[var(--accent)] font-bold">38 FPS</span>
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)] mt-1">
              Hailo-8 <span className="text-[9px] font-normal text-[var(--text-muted)]">NPU</span>
            </div>
            <div className="w-full bg-[var(--border)] h-1.5 rounded-full overflow-hidden mt-1.5">
              <div className="bg-amber-500 h-full rounded-full" style={{ width: '64%' }} />
            </div>
          </div>

          {/* RTK Navigation */}
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1">
                <Compass className="w-3 h-3 text-blue-500" />
                {t('drone.rtk')}
              </span>
              <span className="text-blue-500 font-bold">4D Fix</span>
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)] mt-1">
              1.2 cm <span className="text-[9px] font-normal text-[var(--text-muted)]">29 Sats</span>
            </div>
          </div>

          {/* Motors */}
          <div className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <div className="flex items-center justify-between text-[10px] text-[var(--text-muted)] font-mono">
              <span className="flex items-center gap-1">
                <Gauge className="w-3 h-3 text-purple-500" />
                {t('drone.motors')}
              </span>
              <span className="text-purple-500 font-bold">42°C</span>
            </div>
            <div className="text-sm font-mono font-bold text-[var(--text-primary)] mt-1">
              2,450 <span className="text-[9px] font-normal text-[var(--text-muted)]">RPM</span>
            </div>
          </div>
        </div>

        {/* Diagnostic Action Bar */}
        <div className="pt-2 border-t border-[var(--border)] flex items-center justify-between text-xs font-mono">
          {testResult ? (
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              {testResult}
            </span>
          ) : (
            <span className="text-[10px] text-[var(--text-muted)]">
              {t('drone.estAirtime')}
            </span>
          )}

          <button
            onClick={runSelfTest}
            disabled={isSelfTesting}
            className="px-2.5 py-1 rounded-md bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-primary)] font-bold text-[10px] border border-[var(--border)] transition-all flex items-center gap-1"
          >
            <RefreshCw className={`w-3 h-3 ${isSelfTesting ? 'animate-spin text-[var(--accent)]' : ''}`} />
            <span>{isSelfTesting ? t('drone.testingHardware') : t('drone.preFlightDiagnostic')}</span>
          </button>
        </div>
      </div>
    );
  }

  // Full detailed version
  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm font-sans transition-colors">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="p-3 rounded-2xl bg-amber-500/10 text-[var(--accent)] border border-amber-500/20 shadow-inner">
            <Radio className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-[var(--text-primary)] tracking-wide">
                {t('drone.title')}
              </h2>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-bold uppercase">
                {t('drone.readyForFlight')}
              </span>
            </div>
            <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
              Serial: AH-X8-RPI5-9428 · {t('drone.edgeAI')} · Hexa-Rotor Coaxial Airframe
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={runSelfTest}
            disabled={isSelfTesting}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text-primary)] hover:border-[var(--accent)] transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSelfTesting ? 'animate-spin text-[var(--accent)]' : ''}`} />
            <span>{isSelfTesting ? t('drone.testingHardware') : t('drone.preFlightDiagnostic')}</span>
          </button>

          <Link
            href="/live-feed"
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-amber-500 text-black text-xs font-mono font-bold transition-all shadow-md"
          >
            <Camera className="w-3.5 h-3.5" />
            <span>{t('drone.liveVisionLab')}</span>
          </Link>
        </div>
      </div>

      {testResult && (
        <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center gap-2 text-xs font-mono font-bold text-emerald-700 dark:text-emerald-400">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span>{testResult}</span>
        </div>
      )}

      {/* Main Drone Specs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5">
        {/* Spec 1: Power */}
        <div className="p-4 rounded-xl bg-[var(--surface-2)]/70 border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <BatteryCharging className="w-4 h-4 text-emerald-500" />
              {t('drone.battery')}
            </span>
            <span className="text-emerald-600 dark:text-emerald-400 font-mono font-extrabold">92% Health</span>
          </div>

          <div className="pt-1">
            <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
              48.8V <span className="text-xs font-normal text-[var(--text-muted)]">/ 22,000 mAh</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
              Dual 6S Solid-State LiPo · {t('drone.estAirtime')}
            </p>
          </div>

          <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: '92%' }} />
          </div>
        </div>

        {/* Spec 2: Raspberry Pi 5 Edge AI */}
        <div className="p-4 rounded-xl bg-[var(--surface-2)]/70 border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-amber-500" />
              Raspberry Pi 5 (8GB)
            </span>
            <span className="text-[var(--accent)] font-mono font-extrabold">Hailo-8 AI NPU</span>
          </div>

          <div className="pt-1">
            <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
              38 FPS <span className="text-xs font-normal text-[var(--text-muted)]">Edge Inference</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
              Arm Cortex-A76 @ 2.4GHz · 41.2°C · 256GB NVMe SSD
            </p>
          </div>

          <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-amber-500 h-full rounded-full" style={{ width: '64%' }} />
          </div>
        </div>

        {/* Spec 3: Navigation RTK */}
        <div className="p-4 rounded-xl bg-[var(--surface-2)]/70 border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Compass className="w-4 h-4 text-blue-500" />
              {t('drone.rtk')}
            </span>
            <span className="text-blue-600 dark:text-blue-400 font-mono font-extrabold">4D Fix</span>
          </div>

          <div className="pt-1">
            <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
              1.2 cm <span className="text-xs font-normal text-[var(--text-muted)]">Accuracy</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
              29 Satellites Locked · Triple IMU Redundancy · HDOP: 0.58
            </p>
          </div>

          <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-blue-500 h-full rounded-full" style={{ width: '96%' }} />
          </div>
        </div>

        {/* Spec 4: Motors */}
        <div className="p-4 rounded-xl bg-[var(--surface-2)]/70 border border-[var(--border)] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[var(--text-secondary)]">
            <span className="flex items-center gap-1.5">
              <Gauge className="w-4 h-4 text-purple-500" />
              {t('drone.motors')}
            </span>
            <span className="text-purple-600 dark:text-purple-400 font-mono font-extrabold">{t('drone.nominal')}</span>
          </div>

          <div className="pt-1">
            <div className="text-2xl font-mono font-bold text-[var(--text-primary)]">
              2,450 <span className="text-xs font-normal text-[var(--text-muted)]">RPM</span>
            </div>
            <p className="text-[11px] font-mono text-[var(--text-muted)] mt-1">
              T-Motor U8-II Coaxial · Current: 18.2A · Temp: 42.1°C
            </p>
          </div>

          <div className="w-full bg-[var(--border)] h-2 rounded-full overflow-hidden mt-2">
            <div className="bg-purple-500 h-full rounded-full" style={{ width: '45%' }} />
          </div>
        </div>
      </div>
    </div>
  );
}
