'use client';
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Layers, 
  Flame, 
  Activity, 
  Cpu, 
  Radio
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function LiveCameraGrid() {
  const { t } = useTranslation();
  const [fps, setFps] = useState(38);
  const [rpiLoad, setRpiLoad] = useState(64);
  const [hyperspecWave, setHyperspecWave] = useState(680);
  const [ndviScore, setNdviScore] = useState(0.742);

  // Simulated live telemetry fluctuation
  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.round(36 + Math.random() * 4));
      setRpiLoad(Math.round(62 + Math.random() * 6));
      setNdviScore(parseFloat((0.735 + Math.random() * 0.015).toFixed(3)));
      setHyperspecWave(Math.round(675 + Math.random() * 15));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6 font-sans">
      {/* HUD Telemetry Banner */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
            <Radio className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-[var(--text-primary)]">
              {t('liveFeed.title')}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {t('liveFeed.subtitle')}
            </p>
          </div>
        </div>

        {/* Live Gauges */}
        <div className="flex items-center gap-4 text-xs font-mono">
          <div className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)]">FPS: </span>
            <span className="font-bold text-emerald-600 dark:text-emerald-400">{fps} FPS</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)]">Raspberry Pi 5: </span>
            <span className="font-bold text-amber-600 dark:text-amber-400">{rpiLoad}% NPU</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
            <span className="text-[var(--text-muted)]">{t('liveFeed.latency')}: </span>
            <span className="font-bold text-[var(--text-primary)]">11.8ms</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            <span>4 CAMERAS LIVE</span>
          </div>
        </div>
      </div>

      {/* 4-Camera Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        {/* CAMERA 1: 4K RGB Optical Feed with Plant AI Bounding Boxes */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
            <div className="flex items-center gap-2">
              <Camera className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                {t('liveFeed.cam1')}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold shrink-0">
              SONY 48MP RGB
            </span>
          </div>

          <div className="relative h-72 bg-emerald-950/80 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-900 via-green-950 to-emerald-950 opacity-90" />
            <div 
              className="absolute inset-0 opacity-25"
              style={{
                backgroundImage: 'radial-gradient(#86efac 1.5px, transparent 1.5px)',
                backgroundSize: '24px 24px'
              }}
            />

            {/* AI Bounding Box 1: Charcoal Rot Detection (Red) */}
            <div className="absolute top-12 left-16 w-36 h-28 border-2 border-red-500 bg-red-500/15 rounded-md flex flex-col justify-between p-1.5 shadow-lg animate-pulse">
              <span className="text-[9px] font-mono font-extrabold bg-red-600 text-white px-1 py-0.5 rounded shadow self-start">
                Charcoal Rot: 94.2%
              </span>
              <span className="text-[8px] font-mono text-red-200 bg-red-950/80 px-1 rounded self-end">
                Foliar Desiccation
              </span>
            </div>

            {/* AI Bounding Box 2: Target Spot (Orange) */}
            <div className="absolute bottom-10 right-20 w-40 h-28 border-2 border-amber-500 bg-amber-500/15 rounded-md flex flex-col justify-between p-1.5 shadow-lg">
              <span className="text-[9px] font-mono font-extrabold bg-amber-600 text-white px-1 py-0.5 rounded shadow self-start">
                Target Spot: 88.5%
              </span>
              <span className="text-[8px] font-mono text-amber-200 bg-amber-950/80 px-1 rounded self-end">
                Concentric Lesion
              </span>
            </div>

            {/* AI Bounding Box 3: Healthy Cotton Foliage (Green) */}
            <div className="absolute top-16 right-12 w-32 h-24 border border-emerald-400 bg-emerald-400/10 rounded-md flex flex-col justify-between p-1">
              <span className="text-[9px] font-mono font-bold bg-emerald-600 text-white px-1 py-0.5 rounded shadow self-start">
                Healthy Cotton: 98.7%
              </span>
            </div>

            <div className="relative z-10 w-16 h-16 border border-white/30 rounded-full flex items-center justify-center">
              <div className="w-1.5 h-1.5 bg-red-500 rounded-full animate-ping" />
            </div>

            <div className="absolute bottom-2 left-3 text-[10px] font-mono text-white/80 bg-black/60 px-2.5 py-1 rounded backdrop-blur-sm flex items-center gap-3">
              <span>FOV: 84°</span>
              <span>Gimbal: -65° Pitch</span>
              <span>Shutter: 1/1200s</span>
            </div>
          </div>
        </div>

        {/* CAMERA 2: Multispectral / NDVI Live Canopy Feed */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
            <div className="flex items-center gap-2">
              <Layers className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                {t('liveFeed.cam2')}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
              MICASENSE REDEDGE-P
            </span>
          </div>

          <div className="relative h-72 bg-indigo-950 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-tr from-rose-700 via-emerald-600 to-lime-500 opacity-80" />
            
            <div className="absolute w-44 h-44 rounded-full bg-emerald-400/40 blur-xl top-10 left-12" />
            <div className="absolute w-32 h-32 rounded-full bg-red-500/50 blur-lg bottom-12 right-20" />

            <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md p-2.5 rounded-xl border border-white/20 text-white font-mono text-xs space-y-1">
              <div className="text-[10px] text-emerald-300 font-bold uppercase">Canopy Vigor Index</div>
              <div className="text-xl font-extrabold text-white">{ndviScore} <span className="text-[11px] text-emerald-400">NDVI</span></div>
              <div className="text-[10px] text-slate-300">NDRE: 0.384 · Chlorophyll: 42.1 µg/cm²</div>
            </div>

            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white font-mono text-[10px] flex items-center gap-2">
              <span>Low (0.2)</span>
              <div className="w-20 h-2 rounded bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500" />
              <span>High (0.9)</span>
            </div>
          </div>
        </div>

        {/* CAMERA 3: Thermal Infrared (TIR) Canopy Temperature Feed */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
            <div className="flex items-center gap-2">
              <Flame className="w-4 h-4 text-rose-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                {t('liveFeed.cam3')}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold shrink-0">
              640x512 TIR THERMAL
            </span>
          </div>

          <div className="relative h-72 bg-slate-950 overflow-hidden flex items-center justify-center">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-950 via-purple-900 to-amber-600 opacity-90" />
            <div className="absolute w-40 h-40 rounded-full bg-amber-500/60 blur-2xl top-8 right-16" />
            <div className="absolute w-36 h-36 rounded-full bg-indigo-600/70 blur-xl bottom-6 left-12" />

            <div className="absolute top-16 right-24 text-center">
              <div className="w-6 h-6 border-2 border-red-400 rounded-full mx-auto flex items-center justify-center animate-ping" />
              <span className="text-[10px] font-mono bg-red-600 text-white px-1.5 py-0.5 rounded font-bold shadow">
                36.8°C (Transpiration Stress)
              </span>
            </div>

            <div className="absolute bottom-16 left-20 text-center">
              <span className="text-[10px] font-mono bg-blue-600 text-white px-1.5 py-0.5 rounded font-bold shadow">
                27.4°C (Optimal Evaporative Cooling)
              </span>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/20 text-white font-mono text-[10px] flex items-center gap-2">
              <span>24°C</span>
              <div className="w-24 h-2 rounded bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500" />
              <span>40°C</span>
            </div>
          </div>
        </div>

        {/* CAMERA 4: Hyperspectral Spectrometer Sensor Reflectance Cube */}
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
          <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                {t('liveFeed.cam4')}
              </span>
            </div>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold shrink-0">
              CORNING MICRO-HYPERSPEC
            </span>
          </div>

          <div className="relative h-72 bg-slate-950 p-4 flex flex-col justify-between font-mono">
            <div className="flex items-center justify-between text-xs text-purple-300 border-b border-purple-900/50 pb-2">
              <span>Plant Reflectance Signature (400nm - 1000nm)</span>
              <span className="font-bold text-white bg-purple-900/60 px-2 py-0.5 rounded">
                Active Band: {hyperspecWave}nm (Red-Edge)
              </span>
            </div>

            <div className="relative flex-1 flex items-center justify-center my-2">
              <svg className="w-full h-36" viewBox="0 0 400 120" preserveAspectRatio="none">
                <line x1="0" y1="30" x2="400" y2="30" stroke="#334155" strokeDasharray="3 3" />
                <line x1="0" y1="60" x2="400" y2="60" stroke="#334155" strokeDasharray="3 3" />
                <line x1="0" y1="90" x2="400" y2="90" stroke="#334155" strokeDasharray="3 3" />

                <path
                  d="M 10 95 Q 60 90, 100 80 T 180 90 T 230 35 T 320 20 T 390 25"
                  fill="none"
                  stroke="#22c55e"
                  strokeWidth="2.5"
                />

                <path
                  d="M 10 90 Q 60 85, 100 75 T 180 78 T 230 55 T 320 50 T 390 55"
                  fill="none"
                  stroke="#ef4444"
                  strokeWidth="2"
                  strokeDasharray="4 3"
                />

                <line x1="230" y1="0" x2="230" y2="120" stroke="#FBBF24" strokeWidth="1.5" />
              </svg>
            </div>

            <div className="grid grid-cols-3 gap-2 text-[10px] text-slate-300 border-t border-purple-900/50 pt-2">
              <div>
                <span className="text-slate-400 block">Chlorophyll-a Dip:</span>
                <span className="font-bold text-emerald-400">672nm (Optimal)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Red-Edge Inflection:</span>
                <span className="font-bold text-amber-400">718nm (Stress Shift)</span>
              </div>
              <div>
                <span className="text-slate-400 block">Water Index WBI:</span>
                <span className="font-bold text-blue-400">0.96 (Adequate)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Edge AI Models Loaded Onboard Raspberry Pi 5 */}
      <div className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-[var(--accent)]" />
            <h3 className="text-sm font-bold text-[var(--text-primary)]">
              {t('liveFeed.activeAI')}
            </h3>
          </div>
          <span className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400">
            Raspberry Pi 5 + Hailo-8 NPU Operational
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs font-mono">
          <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>YOLOv8-AgriCrop</span>
              <span className="text-emerald-500">v2.4</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Real-Time Disease & Pest Bounding Boxes</p>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Accuracy: 95.8% mAP · 38 FPS</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>CanopySeg-UNet</span>
              <span className="text-emerald-500">v1.9</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Pixel-Level Foliage & Biomass Masking</p>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Accuracy: 92.4% IoU · 25 FPS</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>Hyperspec-CNN</span>
              <span className="text-emerald-500">v3.1</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Cellular Level Fungal Signature Classifier</p>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Accuracy: 97.1% F1 · 15ms Latency</div>
          </div>

          <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] space-y-1">
            <div className="flex items-center justify-between font-bold text-[var(--text-primary)]">
              <span>WeedDetect-EdgeNet</span>
              <span className="text-emerald-500">v2.0</span>
            </div>
            <p className="text-[11px] text-[var(--text-muted)]">Selective Herbicide Micro-Targeting</p>
            <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">Accuracy: 94.6% · Zero-Drift Spray</div>
          </div>
        </div>
      </div>
    </div>
  );
}
