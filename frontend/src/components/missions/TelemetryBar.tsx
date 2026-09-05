'use client';
import React, { useEffect, useState } from 'react';
import { DroneTelemetry } from '@/types';
import { getLiveTelemetry } from '@/lib/api/telemetry';

interface TelemetryBarProps {
  droneId: string;
}

export function TelemetryBar({ droneId }: TelemetryBarProps) {
  const [telemetry, setTelemetry] = useState<DroneTelemetry | null>(null);

  useEffect(() => {
    async function fetchTelem() {
      try {
        const data = await getLiveTelemetry(droneId);
        setTelemetry(data);
      } catch (e) {
        console.error('Failed to fetch telemetry:', e);
      }
    }
    fetchTelem();
    const interval = setInterval(fetchTelem, 5000);
    return () => clearInterval(interval);
  }, [droneId]);

  if (!telemetry) return null;

  return (
    <div className="bg-card border border-border rounded-lg p-3 flex flex-wrap items-center justify-between gap-4 text-xs shadow-sm">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span className="font-semibold text-text-primary">Raspberry Pi 5 Edge Stream</span>
      </div>
      <div className="flex items-center gap-4 text-text-secondary font-mono">
        <div>
          <span className="text-[10px] uppercase block text-text-secondary font-sans">RTK Fix</span>
          <span className="font-semibold text-emerald-600 dark:text-emerald-400">{telemetry.rtk_fix_status}</span>
        </div>
        <div>
          <span className="text-[10px] uppercase block text-text-secondary font-sans">Altitude</span>
          <span className="font-semibold text-text-primary">{telemetry.altitude_m}m</span>
        </div>
        <div>
          <span className="text-[10px] uppercase block text-text-secondary font-sans">Speed</span>
          <span className="font-semibold text-text-primary">{telemetry.velocity_m_s} m/s</span>
        </div>
        <div>
          <span className="text-[10px] uppercase block text-text-secondary font-sans">Battery</span>
          <span className="font-semibold text-text-primary">{telemetry.battery_percentage}%</span>
        </div>
        <div>
          <span className="text-[10px] uppercase block text-text-secondary font-sans">RPi 5 Temp</span>
          <span className="font-semibold text-amber-600 dark:text-amber-400">{telemetry.rpi_temp_celsius ?? telemetry.jetson_temp_celsius}°C</span>
        </div>
      </div>
    </div>
  );
}
