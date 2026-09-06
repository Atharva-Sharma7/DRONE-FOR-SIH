'use client';
import React, { useState } from 'react';
import { useTranslation } from '@/hooks/useTranslation';
import { useMapStore, BasemapType } from '@/store/useMapStore';
import { useAppStore } from '@/store/useAppStore';
import { 
  Layers, 
  Zap, 
  Ruler, 
  History, 
  FileText, 
  Video, 
  ChevronDown, 
  ChevronUp, 
  Compass, 
  SlidersHorizontal 
} from 'lucide-react';

const BASEMAP_OPTIONS: { id: BasemapType; label: string; icon: string }[] = [
  { id: 'satellite', label: 'Satellite', icon: '🛰️' },
  { id: 'bhuvan',    label: 'ISRO Bhuvan', icon: '🇮🇳' },
  { id: 'osm',       label: 'Cadastral', icon: '🗺️' },
  { id: 'topo',      label: 'Topography', icon: '🏔️' },
  { id: 'thermal',   label: 'Thermal IR', icon: '🌡️' },
];

export function LayerControl() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const { 
    activeLayers, 
    toggleLayer, 
    basemap, 
    setBasemap, 
    compareMode, 
    setCompareMode,
    measureMode,
    setMeasureMode,
    setCustomizationPanelOpen,
  } = useMapStore();
  
  const [isCollapsed, setIsCollapsed] = useState(false);

  return (
    <div className="absolute top-4 right-4 z-20 bg-[var(--surface)]/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border border-[var(--border)] w-64 font-sans transition-all max-h-[calc(100vh-10rem)] overflow-y-auto custom-scrollbar">
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[var(--accent)]" />
          <span className="text-xs font-bold font-mono uppercase tracking-wider text-[var(--text-primary)]">
            {language === 'mr' ? 'अॅग्रो-जीआयएस नियंत्रक' : language === 'hi' ? 'कृषि-जीआईएस नियंत्रक' : 'AgroGIS Station'}
          </span>
        </div>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-1 rounded-lg hover:bg-[var(--surface-2)] text-[var(--text-muted)]"
          aria-label="Toggle Panel"
        >
          {isCollapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
        </button>
      </div>

      {!isCollapsed && (
        <div className="space-y-4">
          {/* 1. Basemap Selector */}
          <div>
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] block mb-1.5">
              {language === 'mr' ? 'नकाशा प्रकार (बेस मॅप)' : language === 'hi' ? 'नक्शा प्रकार (बेस मैप)' : 'Base Map View'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {BASEMAP_OPTIONS.map((opt) => (
                <button
                  key={opt.id}
                  onClick={() => setBasemap(opt.id)}
                  className={`py-1.5 px-2 rounded-xl text-xs font-mono font-semibold flex items-center gap-1.5 transition-all ${
                    basemap === opt.id
                      ? 'bg-[var(--accent)] text-black font-bold shadow-md shadow-amber-500/20'
                      : 'bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border)]'
                  }`}
                >
                  <span>{opt.icon}</span>
                  <span className="truncate">{opt.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Interactive Analysis Tools */}
          <div className="pt-2 border-t border-[var(--border)]">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] block mb-1.5">
              {language === 'mr' ? 'अॅनालिटिक्स टूल्स' : language === 'hi' ? 'विश्लेषण उपकरण' : 'Interactive Tools'}
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              <button
                onClick={() => {
                  setMeasureMode(!measureMode);
                  if (compareMode) setCompareMode(false);
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                  measureMode
                    ? 'bg-amber-500 text-black border-amber-600 shadow-md'
                    : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'मोजणी साधन' : language === 'hi' ? 'माप उपकरण' : 'Measure'}</span>
              </button>

              <button
                onClick={() => {
                  setCompareMode(!compareMode);
                  if (measureMode) setMeasureMode(false);
                }}
                className={`py-1.5 px-2 rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                  compareMode
                    ? 'bg-amber-500 text-black border-amber-600 shadow-md'
                    : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:border-[var(--accent)]'
                }`}
              >
                <History className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? 'तुलना स्लाइडर' : language === 'hi' ? 'तुलना स्लाइडर' : 'Compare'}</span>
              </button>
            </div>
          </div>

          {/* 3. Layer Toggles */}
          <div className="pt-2 border-t border-[var(--border)]">
            <span className="text-[10px] font-mono font-bold uppercase text-[var(--text-muted)] block mb-2">
              {language === 'mr' ? 'शेती माहिती स्तर' : language === 'hi' ? 'कृषि सूचना परतें' : 'Agricultural Layers'}
            </span>

            <div className="space-y-2 text-xs font-medium">
              {/* 7/12 Gat Cadastral Parcels */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  {language === 'mr' ? '७/१२ गट सीमा' : language === 'hi' ? '७/१२ खसरा सीमा' : '7/12 Gat Parcels'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.cadastral}
                  onChange={() => toggleLayer('cadastral')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* NDVI Plant Health Heatmap */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                  {language === 'mr' ? 'एनडीव्हीआय आरोग्य स्तर' : language === 'hi' ? 'एनडीवीआई फसल स्वास्थ्य' : 'NDVI Canopy Heatmap'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.ndvi}
                  onChange={() => toggleLayer('ndvi')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Disease Hotspots */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-600" />
                  {language === 'mr' ? 'रोग प्रादुर्भाव क्षेत्र' : language === 'hi' ? 'रोग प्रभावित क्षेत्र' : 'Disease Hotspots'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.disease}
                  onChange={() => toggleLayer('disease')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Terrain Elevation Contours */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                  {language === 'mr' ? 'उंची कंटूर रेषा' : language === 'hi' ? 'ऊंचाई समोच्च रेखाएं' : 'Elevation Contours'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.terrain}
                  onChange={() => toggleLayer('terrain')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Flight Path */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400" />
                  {language === 'mr' ? 'ड्रोन उड्डाण मार्ग' : language === 'hi' ? 'ड्रोन उड़ान पथ' : 'Drone Flight Grid'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.flightPath}
                  onChange={() => toggleLayer('flightPath')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Drone Camera Footprint (Gimbal FOV) */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-violet-400" />
                  {language === 'mr' ? 'कॅमेरा फूटप्रिंट (FOV)' : language === 'hi' ? 'कैमरा फुटप्रिंट (FOV)' : 'Camera FOV Footprint'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.cameraFov}
                  onChange={() => toggleLayer('cameraFov')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Live Telemetry Ping */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                  {language === 'mr' ? 'थेट ड्रोन ट्रॅकिंग' : 'Live RTK Tracking'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.telemetry}
                  onChange={() => toggleLayer('telemetry')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>

              {/* Custom Farm Infrastructure Markers (POIs) */}
              <label className="flex items-center justify-between cursor-pointer group py-0.5">
                <span className="flex items-center gap-2 text-[var(--text-primary)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                  {language === 'mr' ? 'शेत पायाभूत चिन्हे (POIs)' : language === 'hi' ? 'खेत संरचना मार्कर (POIs)' : 'Custom Farm POIs'}
                </span>
                <input
                  type="checkbox"
                  checked={activeLayers.customPois}
                  onChange={() => toggleLayer('customPois')}
                  className="rounded accent-amber-500 w-4 h-4 cursor-pointer"
                />
              </label>
            </div>

            {/* Customization Button */}
            <div className="pt-3 border-t border-[var(--border)]">
              <button
                onClick={() => setCustomizationPanelOpen(true)}
                className="w-full py-2 px-3 rounded-xl text-xs font-bold font-mono bg-gradient-to-r from-emerald-600 to-teal-600 text-white flex items-center justify-center gap-2 hover:opacity-90 shadow-md shadow-emerald-700/20 transition-all active:scale-95"
              >
                <SlidersHorizontal className="w-3.5 h-3.5" />
                <span>{language === 'mr' ? '⚙️ नकाशा सानुकूलित करा' : language === 'hi' ? '⚙️ नक्शा कस्टमाइज़ करें' : '⚙️ Customize Map Views'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
