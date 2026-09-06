'use client';
import React, { useState } from 'react';
import { 
  Sliders, 
  Sun, 
  Layers, 
  MapPin, 
  Plus, 
  Trash2, 
  X, 
  Check, 
  Compass, 
  Droplet, 
  Zap, 
  Building, 
  Bug, 
  HelpCircle,
  Eye
} from 'lucide-react';
import { useMapStore, CustomFarmMarker } from '@/store/useMapStore';
import { useAppStore } from '@/store/useAppStore';

const MARKER_ICONS: Record<string, any> = {
  borewell: Droplet,
  pond: Droplet,
  solarpump: Zap,
  shed: Building,
  trap: Bug,
  polyhouse: Building,
  other: MapPin,
};

export function MapCustomizationPanel() {
  const { language } = useAppStore();
  const { 
    customizationPanelOpen, 
    setCustomizationPanelOpen,
    pitch,
    setPitch,
    highSunlightMode,
    toggleHighSunlightMode,
    parcelOutlineColor,
    setParcelOutlineColor,
    parcelFillOpacity,
    setParcelFillOpacity,
    customMarkers,
    addCustomMarker,
    removeCustomMarker,
  } = useMapStore();

  const [isAddMarkerOpen, setIsAddMarkerOpen] = useState(false);
  const [newMarkerType, setNewMarkerType] = useState<CustomFarmMarker['type']>('borewell');
  const [newMarkerLabel, setNewMarkerLabel] = useState('');
  const [newMarkerNotes, setNewMarkerNotes] = useState('');
  const [newMarkerLat, setNewMarkerLat] = useState('21.0270');
  const [newMarkerLng, setNewMarkerLng] = useState('79.0350');

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  if (!customizationPanelOpen) return null;

  const handleCreateMarker = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMarkerLabel.trim()) return;

    const marker: CustomFarmMarker = {
      id: `custom-poi-${Date.now()}`,
      type: newMarkerType,
      label: newMarkerLabel.trim(),
      notes: newMarkerNotes.trim() || undefined,
      lat: parseFloat(newMarkerLat) || 21.0250,
      lng: parseFloat(newMarkerLng) || 79.0350,
      createdAt: new Date().toISOString().split('T')[0],
    };

    addCustomMarker(marker);
    setNewMarkerLabel('');
    setNewMarkerNotes('');
    setIsAddMarkerOpen(false);
  };

  const COLOR_OPTIONS = [
    { name: 'Neon Blue', color: '#3B82F6' },
    { name: 'Kisan Gold', color: '#F59E0B' },
    { name: 'Emerald', color: '#10B981' },
    { name: 'Crimson', color: '#EF4444' },
    { name: 'Purple', color: '#8B5CF6' },
  ];

  return (
    <div className="absolute top-16 left-4 z-40 w-80 sm:w-96 max-h-[85vh] overflow-y-auto rounded-3xl bg-[var(--surface)]/95 backdrop-blur-md border-2 border-emerald-500/50 shadow-2xl p-5 space-y-5 font-sans animate-fade-in text-[var(--text-primary)]">
      
      {/* Header Strip */}
      <div className="flex items-center justify-between border-b border-[var(--border)] pb-3">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Sliders className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-[var(--text-primary)]">
              {isMarathi ? 'नकाशा व मालमत्ता कस्टमायझेशन' : isHindi ? 'मानचित्र व फार्म संपत्ति कस्टमाइजेशन' : 'Map & Asset Customizer'}
            </h3>
            <p className="text-[10px] font-mono text-[var(--text-muted)]">
              {isMarathi ? '३D अँगल, उन्हातील दृश्यमानता व शेती खुणा' : '3D Pitch, Sunlight View & Custom Farm Assets'}
            </p>
          </div>
        </div>

        <button
          onClick={() => setCustomizationPanelOpen(false)}
          className="p-1.5 rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* ── SECTION 1: 3D VIEW & SUNLIGHT VISIBILITY ── */}
      <div className="space-y-2.5">
        <span className="text-[10px] font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
          {isMarathi ? '३D कॅमेरा अँगल व दृश्यमानता' : isHindi ? '३D कैमरा एंगल व विजिबिलिटी' : '3D Pitch & Field Visibility'}
        </span>

        {/* 3D Pitch Angle Selectors */}
        <div className="grid grid-cols-3 gap-2 text-xs font-mono">
          <button
            onClick={() => setPitch(0)}
            className={`py-2 px-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
              pitch === 0 
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            2D Flat (0°)
          </button>
          <button
            onClick={() => setPitch(30)}
            className={`py-2 px-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
              pitch === 30 
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            AgroGIS (30°)
          </button>
          <button
            onClick={() => setPitch(60)}
            className={`py-2 px-2.5 rounded-xl border font-bold transition-all cursor-pointer ${
              pitch === 60 
                ? 'bg-emerald-600 text-white border-emerald-500 shadow-sm' 
                : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:bg-[var(--border)]'
            }`}
          >
            Drone 3D (60°)
          </button>
        </div>

        {/* High Sunlight Contrast Toggle */}
        <button
          onClick={toggleHighSunlightMode}
          className={`w-full p-3 rounded-2xl border flex items-center justify-between transition-all cursor-pointer ${
            highSunlightMode 
              ? 'bg-amber-500/20 border-amber-500 text-amber-900 dark:text-amber-200' 
              : 'bg-[var(--surface-2)] border-[var(--border)] text-[var(--text-secondary)] hover:border-[var(--text-muted)]'
          }`}
        >
          <div className="flex items-center gap-2.5 text-xs font-bold">
            <Sun className={`w-4 h-4 ${highSunlightMode ? 'text-amber-500 animate-spin' : 'text-slate-400'}`} style={{ animationDuration: '8s' }} />
            <span>{isMarathi ? '☀️ उन्हातील हाय-कॉन्ट्रास्ट मोड' : isHindi ? '☀️ धूप में हाई-कंट्रास्ट मोड' : '☀️ High-Contrast Sunlight Mode'}</span>
          </div>
          <span className={`text-[10px] font-mono font-extrabold px-2 py-0.5 rounded-md ${
            highSunlightMode ? 'bg-amber-500 text-black' : 'bg-[var(--border)] text-[var(--text-muted)]'
          }`}>
            {highSunlightMode ? 'ON' : 'OFF'}
          </span>
        </button>
      </div>

      {/* ── SECTION 2: CADASTRAL PARCEL STYLING ── */}
      <div className="space-y-3 border-t border-[var(--border)] pt-3.5">
        <span className="text-[10px] font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
          {isMarathi ? '७/१२ गट सीमा रंग व पारदर्शकता' : isHindi ? '७/१२ गट सीमा रंग व पारदर्शिता' : 'Parcel Color & Fill Opacity'}
        </span>

        {/* Color Palette */}
        <div className="flex items-center gap-2">
          {COLOR_OPTIONS.map((c) => (
            <button
              key={c.color}
              onClick={() => setParcelOutlineColor(c.color)}
              className={`w-7 h-7 rounded-full border-2 transition-all flex items-center justify-center cursor-pointer ${
                parcelOutlineColor === c.color ? 'border-white scale-110 shadow-lg' : 'border-transparent opacity-70 hover:opacity-100'
              }`}
              style={{ backgroundColor: c.color }}
              title={c.name}
            >
              {parcelOutlineColor === c.color && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
            </button>
          ))}
        </div>

        {/* Opacity Slider */}
        <div className="space-y-1">
          <div className="flex justify-between text-[11px] font-mono text-[var(--text-muted)]">
            <span>Fill Opacity:</span>
            <span className="font-bold text-[var(--text-primary)]">{Math.round(parcelFillOpacity * 100)}%</span>
          </div>
          <input
            type="range"
            min="0"
            max="0.45"
            step="0.05"
            value={parcelFillOpacity}
            onChange={(e) => setParcelFillOpacity(parseFloat(e.target.value))}
            className="w-full accent-emerald-500 cursor-pointer"
          />
        </div>
      </div>

      {/* ── SECTION 3: CUSTOM FARM ASSET POI MARKERS ── */}
      <div className="space-y-3 border-t border-[var(--border)] pt-3.5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-mono font-extrabold uppercase text-[var(--text-muted)] tracking-wider">
            {isMarathi ? 'आपली शेती मालमत्ता (Markers)' : isHindi ? 'फार्म संपत्तियां (Markers)' : 'Custom Farm Asset Markers'}
          </span>

          <button
            onClick={() => setIsAddMarkerOpen(!isAddMarkerOpen)}
            className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-[10px] font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
          >
            <Plus className="w-3 h-3" />
            <span>{isMarathi ? 'नवीन जोडा' : isHindi ? 'नया जोड़ें' : 'Add Marker'}</span>
          </button>
        </div>

        {/* New Marker Form */}
        {isAddMarkerOpen && (
          <form onSubmit={handleCreateMarker} className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-2.5 text-xs font-mono animate-fade-in">
            <div className="font-bold text-emerald-700 dark:text-emerald-300 text-[11px]">
              {isMarathi ? 'नवीन शेती खूण जोडा' : 'Add Custom Farm Point of Interest'}
            </div>

            <div>
              <label className="block text-[10px] text-[var(--text-muted)] mb-1">Asset Type</label>
              <select
                value={newMarkerType}
                onChange={(e) => setNewMarkerType(e.target.value as any)}
                className="w-full p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
              >
                <option value="borewell">Borewell / विहीर / नलकूप</option>
                <option value="pond">Farm Pond / शेततळे (Reservoir)</option>
                <option value="solarpump">Solar Pump / सौर कृषी पंप</option>
                <option value="trap">Pheromone / Light Trap (कीटक सापळा)</option>
                <option value="shed">Fertilizer & Spray Shed (औषध शेड)</option>
                <option value="polyhouse">Polyhouse / Greenhouse</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] text-[var(--text-muted)] mb-1">Marker Name</label>
              <input
                type="text"
                required
                placeholder="e.g. Borewell #2 (५ HP)"
                value={newMarkerLabel}
                onChange={(e) => setNewMarkerLabel(e.target.value)}
                className="w-full p-2 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">Latitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newMarkerLat}
                  onChange={(e) => setNewMarkerLat(e.target.value)}
                  className="w-full p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-[11px]"
                />
              </div>
              <div>
                <label className="block text-[10px] text-[var(--text-muted)] mb-0.5">Longitude</label>
                <input
                  type="number"
                  step="0.0001"
                  value={newMarkerLng}
                  onChange={(e) => setNewMarkerLng(e.target.value)}
                  className="w-full p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-[11px]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[10px] text-[var(--text-muted)] mb-1">Notes (Optional)</label>
              <input
                type="text"
                placeholder="Depth, pump HP, or trap notes"
                value={newMarkerNotes}
                onChange={(e) => setNewMarkerNotes(e.target.value)}
                className="w-full p-1.5 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-[var(--text-primary)] text-[11px]"
              />
            </div>

            <div className="flex justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={() => setIsAddMarkerOpen(false)}
                className="px-3 py-1.5 rounded-lg bg-[var(--surface)] text-[var(--text-muted)] border border-[var(--border)] cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold cursor-pointer shadow"
              >
                Save Marker
              </button>
            </div>
          </form>
        )}

        {/* Existing Custom Markers List */}
        <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
          {customMarkers.length === 0 ? (
            <p className="text-[11px] font-mono text-[var(--text-muted)] text-center py-2">
              No custom markers added yet.
            </p>
          ) : (
            customMarkers.map((marker) => {
              const IconComp = MARKER_ICONS[marker.type] || MapPin;
              return (
                <div
                  key={marker.id}
                  className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between gap-2 text-xs font-mono"
                >
                  <div className="flex items-center gap-2 overflow-hidden">
                    <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 shrink-0">
                      <IconComp className="w-3.5 h-3.5" />
                    </div>
                    <div className="truncate">
                      <span className="font-bold text-[var(--text-primary)] block truncate">
                        {marker.label}
                      </span>
                      {marker.notes && (
                        <span className="text-[9px] text-[var(--text-muted)] block truncate">
                          {marker.notes}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    onClick={() => removeCustomMarker(marker.id)}
                    className="p-1 text-[var(--text-muted)] hover:text-rose-500 transition-colors shrink-0 cursor-pointer"
                    title="Delete Marker"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })
          )}
        </div>
      </div>

    </div>
  );
}
