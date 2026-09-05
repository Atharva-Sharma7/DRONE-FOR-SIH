'use client';
import React, { useEffect, useState, useCallback } from 'react';

interface SoilReading {
  vwc_pct: number;
  ph: number;
  ec_ds_m: number;
  temp_c: number;
  nitrogen_ppm: number;
  phosphorus_ppm: number;
  potassium_ppm: number;
}

function Gauge({ value, min, max, label, unit, color }: {
  value: number; min: number; max: number; label: string; unit: string; color: string;
}) {
  const pct = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));
  return (
    <div className="flex flex-col items-center gap-1.5 pt-3">
      <div className="relative w-14 h-14">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle cx="18" cy="18" r="14" fill="none" stroke="var(--border)" strokeWidth="2.5" />
          <circle
            cx="18" cy="18" r="14" fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeDasharray={`${pct * 0.879} 87.9`}
            strokeLinecap="butt"
          />
        </svg>
        <span className="absolute inset-0 flex items-center justify-center text-xs font-mono font-medium text-[var(--text-primary)]">
          {value.toFixed(1)}
        </span>
      </div>
      <div className="text-center">
        <span className="text-[10px] font-mono text-[var(--text-secondary)] lowercase">{label}</span>
        {unit && <><br /><span className="text-[9px] font-mono text-[var(--text-muted)]">{unit}</span></>}
      </div>
    </div>
  );
}

export function SoilSensorWidget() {
  const [readings, setReadings] = useState<SoilReading>({
    vwc_pct: 32.0, ph: 7.8, ec_ds_m: 0.42, temp_c: 28.5,
    nitrogen_ppm: 18.0, phosphorus_ppm: 12.5, potassium_ppm: 210.0,
  });
  const [lastUpdate, setLastUpdate] = useState<string>('');

  const addNoise = useCallback((base: number, pct = 0.03) => {
    return parseFloat((base + (Math.random() - 0.5) * 2 * base * pct).toFixed(2));
  }, []);

  useEffect(() => {
    const update = () => {
      setReadings(r => ({
        vwc_pct:         addNoise(32.0),
        ph:              addNoise(7.8, 0.01),
        ec_ds_m:         addNoise(0.42),
        temp_c:          addNoise(28.5, 0.02),
        nitrogen_ppm:    addNoise(18.0),
        phosphorus_ppm:  addNoise(12.5),
        potassium_ppm:   addNoise(210.0),
      }));
      setLastUpdate(new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    };
    update();
    const interval = setInterval(update, 3000);
    return () => clearInterval(interval);
  }, [addNoise]);

  return (
    <div className="border border-[var(--border)] bg-[var(--surface)] rounded-sm flex flex-col h-full">
      <div className="px-4 py-3 border-b border-[var(--border)] flex items-center justify-between">
        <span className="text-xs font-mono text-[var(--text-muted)] lowercase tracking-wide">
          soil sensors · cotton north
        </span>
        <div className="flex items-center gap-1.5">
          <span className="status-dot active" />
          <span className="text-[10px] font-mono text-[var(--green)]">live {lastUpdate.toLowerCase()}</span>
        </div>
      </div>

      <div className="p-5 flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-4 gap-2">
          <Gauge value={readings.vwc_pct} min={0} max={60} label="moisture" unit="% vwc" color="var(--overcast)" />
          <Gauge value={readings.ph} min={4} max={10} label="soil ph" unit="" color="var(--green)" />
          <Gauge value={readings.ec_ds_m} min={0} max={2} label="ec" unit="ds/m" color="var(--accent)" />
          <Gauge value={readings.temp_c} min={15} max={45} label="temp" unit="°c" color="var(--rust)" />
        </div>

        <div className="grid grid-cols-3 gap-0 border-t border-l border-[var(--border)]">
          {[
            { label: 'nitrogen', value: readings.nitrogen_ppm, unit: 'ppm', ok: readings.nitrogen_ppm > 15 },
            { label: 'phosphorus', value: readings.phosphorus_ppm, unit: 'ppm', ok: readings.phosphorus_ppm > 10 },
            { label: 'potassium', value: readings.potassium_ppm, unit: 'ppm', ok: readings.potassium_ppm > 180 },
          ].map(({ label, value, unit, ok }) => (
            <div key={label} className="p-3 border-b border-r border-[var(--border)] flex flex-col gap-1">
              <span className="text-[10px] font-mono text-[var(--text-muted)] lowercase">{label}</span>
              <span className="text-base font-mono text-[var(--text-primary)] tabular-nums">{value.toFixed(1)} <span className="text-[10px] text-[var(--text-secondary)]">{unit}</span></span>
              <div className="flex items-center gap-1 mt-1">
                <span className={`status-dot ${ok ? 'active' : 'alert'}`} />
                <span className="text-[9px] font-mono text-[var(--text-secondary)]">{ok ? 'good' : 'low'}</span>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 mt-auto pt-2">
          <div className="flex items-center gap-1.5 px-2 py-1 bg-[var(--surface-2)] rounded-sm border border-[var(--border)]">
            <span className="status-dot active" />
            <span className="text-[10px] font-mono text-[var(--text-primary)]">node 01</span>
          </div>
          <span className="text-[10px] font-mono text-[var(--text-muted)]">batt 87% · 10cm depth</span>
        </div>
      </div>
    </div>
  );
}
