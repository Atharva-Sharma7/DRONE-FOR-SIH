'use client';
import React, { useState, useEffect } from 'react';
import { 
  Camera, 
  Layers, 
  Flame, 
  Activity, 
  Cpu, 
  Radio,
  Maximize2,
  Minimize2,
  ZoomIn,
  Download,
  Crosshair,
  Compass,
  BatteryCharging,
  Gauge,
  Lock,
  Sparkles,
  MapPin,
  CheckCircle2,
  Microscope,
  Plane
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { CropProfile, DEFAULT_CROPS, CropAIAnalysisModal } from '@/components/farmer/CropAIAnalysisModal';
import { QuickSprayModal } from '@/components/farmer/QuickSprayModal';

// Synchronized Sensor Profile per Crop
interface SyncedSensorProfile {
  cropKey: string;
  name: string;
  nameMr: string;
  gat: string;
  gatMr: string;
  gpsCoords: string;
  opticalImage: string;
  yoloBoxes: { label: string; conf: string; color: 'rose' | 'amber' | 'emerald'; top: string; left: string }[];
  ndviScore: number;
  ndreScore: number;
  chlorophyllUgc: number;
  thermalHotspot: string;
  thermalCoolSpot: string;
  hyperspectralPeak: number;
  scientificName: string;
  reflectancePoints: string; // SVG path data
}

const SYNCED_PROFILES: Record<string, SyncedSensorProfile> = {
  cotton: {
    cropKey: 'cotton',
    name: 'Bt Cotton (कपाशी)',
    nameMr: 'बीटी कपाशी',
    gat: 'Gat 142/A',
    gatMr: 'गट १४२/अ',
    gpsCoords: '20.5535°N, 76.5682°E',
    opticalImage: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?auto=format&fit=crop&w=1200&q=80',
    yoloBoxes: [
      { label: 'Pink Bollworm Pinhole: 94.2%', conf: '94.2%', color: 'rose', top: '15%', left: '18%' },
      { label: 'Target Spot Lesion: 89.6%', conf: '89.6%', color: 'amber', top: '55%', left: '60%' },
      { label: 'Healthy Boll Cluster: 97.8%', conf: '97.8%', color: 'emerald', top: '25%', left: '55%' },
    ],
    ndviScore: 0.824,
    ndreScore: 0.412,
    chlorophyllUgc: 44.8,
    thermalHotspot: '34.2°C (Stomatal Stress)',
    thermalCoolSpot: '27.1°C (Transpiration Cool)',
    hyperspectralPeak: 720,
    scientificName: 'Gossypium hirsutum (Cotton)',
    reflectancePoints: 'M 10 110 Q 50 100 100 95 Q 150 90 200 105 Q 220 110 240 50 Q 280 20 340 18 Q 370 20 390 25',
  },
  soybean: {
    cropKey: 'soybean',
    name: 'Soybean (सोयाबीन)',
    nameMr: 'सोयाबीन',
    gat: 'Gat 143',
    gatMr: 'गट १४३',
    gpsCoords: '20.5512°N, 76.5714°E',
    opticalImage: 'https://images.unsplash.com/photo-1592982537447-7440770cbfc9?auto=format&fit=crop&w=1200&q=80',
    yoloBoxes: [
      { label: 'Charcoal Rot Canker: 95.8%', conf: '95.8%', color: 'rose', top: '20%', left: '25%' },
      { label: 'Yellow Mosaic Chlorosis: 91.4%', conf: '91.4%', color: 'amber', top: '60%', left: '20%' },
      { label: 'Healthy Pod Fill: 96.5%', conf: '96.5%', color: 'emerald', top: '40%', left: '65%' },
    ],
    ndviScore: 0.682,
    ndreScore: 0.328,
    chlorophyllUgc: 36.2,
    thermalHotspot: '36.8°C (Drought Spike)',
    thermalCoolSpot: '26.9°C (Normal)',
    hyperspectralPeak: 710,
    scientificName: 'Glycine max (Soybean)',
    reflectancePoints: 'M 10 112 Q 50 105 100 100 Q 150 98 200 112 Q 220 115 240 65 Q 280 32 340 28 Q 370 30 390 35',
  },
  tur: {
    cropKey: 'tur',
    name: 'Pigeon Pea / Tur Dal (तूर)',
    nameMr: 'तूर (अरहर)',
    gat: 'Gat 144',
    gatMr: 'गट १४४',
    gpsCoords: '20.5548°N, 76.5650°E',
    opticalImage: 'https://images.unsplash.com/photo-1500651230702-0e2d8a49d4ad?auto=format&fit=crop&w=1200&q=80',
    yoloBoxes: [
      { label: 'Helicoverpa Egg Cluster: 88.4%', conf: '88.4%', color: 'amber', top: '28%', left: '35%' },
      { label: 'Healthy Branching: 98.2%', conf: '98.2%', color: 'emerald', top: '45%', left: '55%' },
    ],
    ndviScore: 0.861,
    ndreScore: 0.445,
    chlorophyllUgc: 48.6,
    thermalHotspot: '31.5°C (Canopy Edge)',
    thermalCoolSpot: '25.8°C (Intercrop Shade)',
    hyperspectralPeak: 735,
    scientificName: 'Cajanus cajan (Pigeon Pea)',
    reflectancePoints: 'M 10 114 Q 50 102 100 92 Q 150 88 200 102 Q 220 108 240 45 Q 280 18 340 15 Q 370 17 390 22',
  },
  chana: {
    cropKey: 'chana',
    name: 'Gram / Chickpea (हरभरा)',
    nameMr: 'हरभरा (चना)',
    gat: 'Gat 145/B',
    gatMr: 'गट १४५/ब',
    gpsCoords: '20.5492°N, 76.5635°E',
    opticalImage: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&w=1200&q=80',
    yoloBoxes: [
      { label: 'Emergence Stand 31/m²: 97.2%', conf: '97.2%', color: 'emerald', top: '35%', left: '40%' },
      { label: 'Cutworm Margin: 85.1%', conf: '85.1%', color: 'amber', top: '65%', left: '20%' },
    ],
    ndviScore: 0.742,
    ndreScore: 0.380,
    chlorophyllUgc: 39.5,
    thermalHotspot: '30.8°C (Dry Furrow)',
    thermalCoolSpot: '24.9°C (Moist Silt Bed)',
    hyperspectralPeak: 715,
    scientificName: 'Cicer arietinum (Chickpea)',
    reflectancePoints: 'M 10 115 Q 50 108 100 102 Q 150 96 200 108 Q 220 112 240 58 Q 280 26 340 22 Q 370 24 390 28',
  },
  onion: {
    cropKey: 'onion',
    name: 'Onion (कांदा / प्याज)',
    nameMr: 'कांदा (प्याज)',
    gat: 'Gat 146',
    gatMr: 'गट १४६',
    gpsCoords: '20.5562°N, 76.5698°E',
    opticalImage: 'https://images.unsplash.com/photo-1508873696983-2df5293cb325?auto=format&fit=crop&w=1200&q=80',
    yoloBoxes: [
      { label: 'Purple Blotch Tip Burn: 93.4%', conf: '93.4%', color: 'rose', top: '18%', left: '45%' },
      { label: 'Thrips Feeding Streaks: 90.1%', conf: '90.1%', color: 'amber', top: '48%', left: '22%' },
      { label: 'Bulb Swell Active: 96.8%', conf: '96.8%', color: 'emerald', top: '62%', left: '58%' },
    ],
    ndviScore: 0.768,
    ndreScore: 0.395,
    chlorophyllUgc: 41.2,
    thermalHotspot: '33.5°C (Sun Exposure)',
    thermalCoolSpot: '26.4°C (Drip Line Transpiration)',
    hyperspectralPeak: 725,
    scientificName: 'Allium cepa (Onion)',
    reflectancePoints: 'M 10 113 Q 50 104 100 98 Q 150 94 200 106 Q 220 110 240 52 Q 280 22 340 19 Q 370 21 390 26',
  },
};

export function LiveCameraGrid() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  const [activeCropKey, setActiveCropKey] = useState<string>('cotton');
  const [activeFocusCam, setActiveFocusCam] = useState<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState<1 | 2 | 4>(1);
  const [snapshotTaken, setSnapshotTaken] = useState(false);
  const [isAIModalOpen, setIsAIModalOpen] = useState(false);
  const [isSprayModalOpen, setIsSprayModalOpen] = useState(false);

  // Simulated telemetry oscillation
  const [fps, setFps] = useState(38);
  const [rpiLoad, setRpiLoad] = useState(64);
  const [specWavelength, setSpecWavelength] = useState(720);

  useEffect(() => {
    const interval = setInterval(() => {
      setFps(Math.round(36 + Math.random() * 4));
      setRpiLoad(Math.round(62 + Math.random() * 6));
      setSpecWavelength((prev) => Math.round(prev + (Math.random() * 4 - 2)));
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  const currentCrop = SYNCED_PROFILES[activeCropKey] || SYNCED_PROFILES.cotton;
  const currentCropProfile = DEFAULT_CROPS[activeCropKey] || DEFAULT_CROPS.cotton;

  const handleTakeSnapshot = () => {
    setSnapshotTaken(true);
    setTimeout(() => setSnapshotTaken(false), 2200);
  };

  return (
    <div className="space-y-5 font-sans">
      
      {/* ── SYNCHRONIZED CROP & WAYPOINT SELECTOR STRIP ── */}
      <div className="p-4 sm:p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-sm space-y-3.5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
              <Lock className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white font-mono text-[10px] font-extrabold uppercase">
                  4-Sensor Synchronous Lock
                </span>
                <span className="text-xs font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  {isMarathi ? 'सर्व ४ कॅमेरे एकाच पिकावर रोखले आहेत' : isHindi ? 'सभी ४ कैमरे एक ही फसल पर केंद्रित हैं' : 'All 4 Cameras Analyzing Same Crop'}
                </span>
              </div>
              <h3 className="text-sm sm:text-base font-black text-[var(--text-primary)] mt-0.5">
                {isMarathi ? currentCrop.nameMr : currentCrop.name} · {isMarathi ? currentCrop.gatMr : currentCrop.gat}
              </h3>
            </div>
          </div>

          {/* Quick Deep AI Audit Button */}
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsAIModalOpen(true)}
              className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-bold flex items-center gap-2 shadow-md shadow-emerald-600/30 transition-all active:scale-95 cursor-pointer"
            >
              <Microscope className="w-4 h-4" />
              <span>{isMarathi ? '६ AI मॉडेल विश्लेषण' : isHindi ? '६ AI मॉडल विश्लेषण' : 'Run 6-AI Model Audit'}</span>
            </button>
          </div>
        </div>

        {/* Crop Selection Buttons (Switching updates ALL 4 Cams synchronously) */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] shrink-0 mr-1">
            {isMarathi ? 'पीक निवडा:' : 'Select Crop:'}
          </span>
          {Object.values(SYNCED_PROFILES).map((item) => (
            <button
              key={item.cropKey}
              onClick={() => setActiveCropKey(item.cropKey)}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 cursor-pointer border ${
                activeCropKey === item.cropKey
                  ? 'bg-emerald-600 text-white border-emerald-500 shadow-md scale-102'
                  : 'bg-[var(--surface-2)] hover:bg-[var(--border)] text-[var(--text-secondary)] border-[var(--border)]'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>{isMarathi ? item.gatMr : item.gat}: {isMarathi ? item.nameMr : item.name.split(' (')[0]}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── TELEMETRY & CONTROLS STRIP ── */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-sm">
        <div className="flex items-center gap-2 text-xs font-mono text-[var(--text-muted)]">
          <Radio className="w-4 h-4 text-emerald-500 animate-ping" />
          <span className="font-bold text-[var(--text-primary)]">GPS: {currentCrop.gpsCoords}</span>
          <span className="hidden sm:inline">· ALT: 24.8m AGL · RTK FIX ±1.2cm</span>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono flex-wrap">
          <div className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center gap-1">
            <Gauge className="w-3 h-3 text-emerald-500" />
            <span className="text-[var(--text-muted)]">FPS:</span>
            <span className="font-bold text-emerald-600">{fps}</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center gap-1">
            <Cpu className="w-3 h-3 text-amber-500" />
            <span className="text-[var(--text-muted)]">RPi5 NPU:</span>
            <span className="font-bold text-amber-600">{rpiLoad}%</span>
          </div>

          <div className="px-2.5 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] flex items-center gap-1">
            <BatteryCharging className="w-3 h-3 text-blue-500" />
            <span className="font-bold text-blue-600">84%</span>
          </div>

          {/* Zoom Toggle */}
          <button
            onClick={() => setZoomLevel((prev) => (prev === 1 ? 2 : prev === 2 ? 4 : 1))}
            className="px-3 py-1 rounded-lg bg-[var(--surface-2)] hover:bg-[var(--border)] border border-[var(--border)] font-bold text-[var(--text-primary)] cursor-pointer"
          >
            {zoomLevel}X Zoom
          </button>

          {/* Snapshot Button */}
          <button
            onClick={handleTakeSnapshot}
            className="px-3 py-1 rounded-lg bg-[var(--accent)] hover:bg-amber-500 text-black font-bold flex items-center gap-1 shadow cursor-pointer"
          >
            <Camera className="w-3 h-3" />
            <span>{snapshotTaken ? 'Saved!' : 'Snapshot'}</span>
          </button>

          <div className="px-2.5 py-1 rounded-lg bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold">
            {activeFocusCam !== null ? `CAM ${activeFocusCam} FOCUS` : '4-CAM SYNC'}
          </div>
        </div>
      </div>

      {/* Snapshot Toast */}
      {snapshotTaken && (
        <div className="p-3 rounded-xl bg-emerald-600 text-white font-mono text-xs text-center font-bold shadow-lg animate-fade-in flex items-center justify-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>📸 Synchronized 4-Sensor Frame Recorded for {currentCrop.name} ({currentCrop.gat})</span>
        </div>
      )}

      {/* ── 4-CAMERA SYNCHRONIZED GRID ── */}
      <div className={`grid gap-5 ${activeFocusCam !== null ? 'grid-cols-1' : 'grid-cols-1 lg:grid-cols-2'}`}>
        
        {/* CAMERA 1: 4K RGB Optical Feed with Synced YOLOv8 Detections */}
        {(activeFocusCam === null || activeFocusCam === 1) && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
              <div className="flex items-center gap-2">
                <Camera className="w-4 h-4 text-blue-500" />
                <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                  {isMarathi 
                    ? `कॅम १: ४K ऑप्टिकल आरजीबी · ${currentCrop.nameMr} (${currentCrop.gatMr})` 
                    : `Cam 1: 4K RGB Optical · ${currentCrop.name.split(' (')[0]} (${currentCrop.gat})`}
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-600 dark:text-blue-400 font-bold shrink-0">
                  SONY 48MP RGB
                </span>
                <button
                  onClick={() => setActiveFocusCam(activeFocusCam === 1 ? null : 1)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] cursor-pointer"
                >
                  {activeFocusCam === 1 ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className={`relative overflow-hidden flex items-center justify-center bg-black transition-all ${activeFocusCam === 1 ? 'h-[480px]' : 'h-72'}`}>
              <img 
                src={currentCrop.opticalImage} 
                alt={`${currentCrop.name} Optical Feed`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-500"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute inset-0 bg-emerald-950/20" />

              {/* Crosshairs */}
              <div className="relative z-10 w-20 h-20 border border-white/40 rounded-full flex items-center justify-center pointer-events-none">
                <Crosshair className="w-8 h-8 text-white/70" />
              </div>

              {/* Crop-Specific YOLOv8 Bounding Boxes */}
              {currentCrop.yoloBoxes.map((box, idx) => (
                <div 
                  key={idx}
                  className={`absolute z-10 p-1.5 rounded-md border-2 shadow-lg animate-pulse flex flex-col justify-between ${
                    box.color === 'rose'
                      ? 'border-rose-500 bg-rose-500/20'
                      : box.color === 'amber'
                      ? 'border-amber-500 bg-amber-500/20'
                      : 'border-emerald-500 bg-emerald-500/20'
                  }`}
                  style={{ top: box.top, left: box.left }}
                >
                  <span className={`text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded shadow text-white ${
                    box.color === 'rose' ? 'bg-rose-600' : box.color === 'amber' ? 'bg-amber-600' : 'bg-emerald-600'
                  }`}>
                    {box.label}
                  </span>
                </div>
              ))}

              {/* HUD Strip */}
              <div className="absolute bottom-2 left-3 right-3 text-[10px] font-mono text-white/90 bg-black/80 px-3 py-1.5 rounded-xl backdrop-blur-sm flex items-center justify-between z-10">
                <span>TARGET: {currentCrop.scientificName}</span>
                <span className="text-emerald-400 font-bold">YOLOv8 DETECT LOCK</span>
              </div>
            </div>
          </div>
        )}

        {/* CAMERA 2: 5-Band Multispectral NDVI Heatmap (Synced to Same Crop) */}
        {(activeFocusCam === null || activeFocusCam === 2) && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
              <div className="flex items-center gap-2">
                <Layers className="w-4 h-4 text-emerald-500" />
                <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                  {isMarathi 
                    ? `कॅम २: मल्टिस्पेक्ट्रल ५-बँड NDVI · ${currentCrop.nameMr}` 
                    : `Cam 2: Multispectral 5-Band NDVI · ${currentCrop.name.split(' (')[0]}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold shrink-0">
                  REDEDGE 5-BAND
                </span>
                <button
                  onClick={() => setActiveFocusCam(activeFocusCam === 2 ? null : 2)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] cursor-pointer"
                >
                  {activeFocusCam === 2 ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className={`relative overflow-hidden flex items-center justify-center bg-black transition-all ${activeFocusCam === 2 ? 'h-[480px]' : 'h-72'}`}>
              <img 
                src={currentCrop.opticalImage} 
                alt={`${currentCrop.name} Multispectral Feed`}
                className="absolute inset-0 w-full h-full object-cover mix-blend-luminosity filter contrast-150"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-rose-600/70 via-amber-400/50 to-emerald-500/75 mix-blend-color" />

              {/* Crop-Specific NDVI Gauge */}
              <div className="absolute top-3 left-3 bg-black/85 backdrop-blur-md p-3 rounded-2xl border border-white/20 text-white font-mono text-xs space-y-1 z-10">
                <div className="text-[10px] text-emerald-400 font-extrabold uppercase">
                  {currentCrop.name.split(' (')[0]} Vigor Score
                </div>
                <div className="text-2xl font-black text-white">{currentCrop.ndviScore} <span className="text-xs text-emerald-400">NDVI</span></div>
                <div className="text-[10px] text-slate-300">NDRE: {currentCrop.ndreScore} · Chl: {currentCrop.chlorophyllUgc} µg/cm²</div>
              </div>

              {/* Color Bar Scale */}
              <div className="absolute bottom-3 right-3 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white font-mono text-[10px] flex items-center gap-2 z-10">
                <span>Stress (0.2)</span>
                <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-red-600 via-amber-400 to-emerald-500" />
                <span>Healthy (0.9)</span>
              </div>
            </div>
          </div>
        )}

        {/* CAMERA 3: Radiometric Thermal IR (FLIR) (Synced to Same Crop) */}
        {(activeFocusCam === null || activeFocusCam === 3) && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
              <div className="flex items-center gap-2">
                <Flame className="w-4 h-4 text-rose-500" />
                <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                  {isMarathi 
                    ? `कॅम ३: थर्मल इन्फ्रारेड · ${currentCrop.nameMr}` 
                    : `Cam 3: Radiometric Thermal IR · ${currentCrop.name.split(' (')[0]}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-rose-500/20 text-rose-600 dark:text-rose-400 font-bold shrink-0">
                  FLIR 640 RADIOMETRIC
                </span>
                <button
                  onClick={() => setActiveFocusCam(activeFocusCam === 3 ? null : 3)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] cursor-pointer"
                >
                  {activeFocusCam === 3 ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className={`relative overflow-hidden flex items-center justify-center bg-black transition-all ${activeFocusCam === 3 ? 'h-[480px]' : 'h-72'}`}>
              <img 
                src={currentCrop.opticalImage} 
                alt={`${currentCrop.name} Thermal Feed`}
                className="absolute inset-0 w-full h-full object-cover filter invert contrast-150"
                style={{ transform: `scale(${zoomLevel})` }}
              />
              <div className="absolute inset-0 bg-gradient-to-br from-indigo-950/80 via-purple-900/75 to-amber-500/80 mix-blend-color" />

              {/* Thermal Hotspot / Coolspot Overlays */}
              <div className="absolute top-12 right-16 text-center z-10">
                <div className="w-7 h-7 border-2 border-rose-500 rounded-full mx-auto flex items-center justify-center animate-ping" />
                <span className="text-[10px] font-mono bg-rose-600 text-white px-2 py-0.5 rounded-md font-extrabold shadow block mt-1">
                  {currentCrop.thermalHotspot}
                </span>
              </div>

              <div className="absolute bottom-12 left-12 text-center z-10">
                <span className="text-[10px] font-mono bg-blue-600 text-white px-2 py-0.5 rounded-md font-extrabold shadow">
                  {currentCrop.thermalCoolSpot}
                </span>
              </div>

              <div className="absolute bottom-3 left-3 bg-black/85 backdrop-blur-md px-3.5 py-2 rounded-xl border border-white/20 text-white font-mono text-[10px] flex items-center gap-2 z-10">
                <span>Cool 22°C</span>
                <div className="w-24 h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-purple-600 to-amber-500" />
                <span>Stress 40°C</span>
              </div>
            </div>
          </div>
        )}

        {/* CAMERA 4: 120-Band Micro-Hyperspectral Reflectance (Calibrated to Same Crop) */}
        {(activeFocusCam === null || activeFocusCam === 4) && (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden shadow-sm flex flex-col">
            <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border)] bg-[var(--surface-2)]/60">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold text-[var(--text-primary)] truncate">
                  {isMarathi 
                    ? `कॅम ४: हायपरस्पेक्ट्रल स्पेक्ट्रम · ${currentCrop.nameMr}` 
                    : `Cam 4: Micro-Hyperspectral Spectrum · ${currentCrop.name.split(' (')[0]}`}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-purple-500/20 text-purple-600 dark:text-purple-400 font-bold shrink-0">
                  120-BAND NANO-SPEC
                </span>
                <button
                  onClick={() => setActiveFocusCam(activeFocusCam === 4 ? null : 4)}
                  className="p-1 rounded hover:bg-black/10 dark:hover:bg-white/10 text-[var(--text-muted)] cursor-pointer"
                >
                  {activeFocusCam === 4 ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            <div className={`relative bg-slate-950 p-4 flex flex-col justify-between font-mono ${activeFocusCam === 4 ? 'h-[480px]' : 'h-72'}`}>
              <div className="flex items-center justify-between text-xs text-purple-300 border-b border-purple-900/50 pb-2">
                <span>{currentCrop.scientificName} Reflectance Signature</span>
                <span className="font-bold text-white bg-purple-900/60 px-2 py-0.5 rounded">
                  Red-Edge: {currentCrop.hyperspectralPeak}nm
                </span>
              </div>

              <div className="relative flex-1 flex items-center justify-center my-2">
                <svg className="w-full h-full max-h-48" viewBox="0 0 400 120" preserveAspectRatio="none">
                  <defs>
                    <linearGradient id={`spec-gradient-${currentCrop.cropKey}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="30%" stopColor="#22c55e" />
                      <stop offset="60%" stopColor="#eab308" />
                      <stop offset="75%" stopColor="#ef4444" />
                      <stop offset="100%" stopColor="#a855f7" />
                    </linearGradient>
                  </defs>
                  
                  {/* Grid Lines */}
                  <line x1="0" y1="30" x2="400" y2="30" stroke="#334155" strokeDasharray="2 2" strokeWidth="0.5" />
                  <line x1="0" y1="60" x2="400" y2="60" stroke="#334155" strokeDasharray="2 2" strokeWidth="0.5" />
                  <line x1="0" y1="90" x2="400" y2="90" stroke="#334155" strokeDasharray="2 2" strokeWidth="0.5" />
                  <line x1="240" y1="0" x2="240" y2="120" stroke="#a855f7" strokeDasharray="3 3" strokeWidth="1" />

                  {/* Crop Reflectance Curve */}
                  <path
                    d={currentCrop.reflectancePoints}
                    fill="none"
                    stroke={`url(#spec-gradient-${currentCrop.cropKey})`}
                    strokeWidth="3"
                  />
                </svg>
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400 border-t border-purple-900/50 pt-2">
                <span>Blue 450nm</span>
                <span>Green 550nm</span>
                <span className="text-purple-300 font-bold">Chl-a Dip (680nm)</span>
                <span className="text-amber-300 font-bold">NIR Plateau (850nm)</span>
              </div>
            </div>
          </div>
        )}

      </div>

      {/* ── CROP MULTI-AI ENSEMBLE MODAL ── */}
      {currentCropProfile && (
        <CropAIAnalysisModal
          crop={currentCropProfile}
          isOpen={isAIModalOpen}
          onClose={() => setIsAIModalOpen(false)}
          onLaunchSpray={() => {
            setIsAIModalOpen(false);
            setIsSprayModalOpen(true);
          }}
        />
      )}

      {/* ── QUICK SPRAY MODAL ── */}
      {isSprayModalOpen && (
        <QuickSprayModal
          isOpen={isSprayModalOpen}
          onClose={() => setIsSprayModalOpen(false)}
        />
      )}
    </div>
  );
}
