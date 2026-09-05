'use client';
import React, { useState } from 'react';
import { MapPin, Check, RefreshCw, MousePointerClick, Activity, Compass } from 'lucide-react';

export interface PinCoord {
  id: number;
  label: string;
  lat: number;
  lng: number;
}

export type FlightMode = 'scan' | 'inspect' | 'patrol';

interface PinBoundarySelectorProps {
  pins: PinCoord[];
  onPinsChange: (newPins: PinCoord[]) => void;
  onApplyBoundary: () => void;
  onReset: () => void;
  isPickMode: boolean;
  onTogglePickMode: () => void;
  flightMode: FlightMode;
  onFlightModeChange: (mode: FlightMode) => void;
  calculatedAreaHa: number;
}

const PRESETS = [
  {
    name: 'IIIT Nagpur Campus',
    pins: [
      { id: 1, label: 'NW Pin', lat: 21.1485, lng: 79.0490 },
      { id: 2, label: 'NE Pin', lat: 21.1485, lng: 79.0570 },
      { id: 3, label: 'SE Pin', lat: 21.1420, lng: 79.0570 },
      { id: 4, label: 'SW Pin', lat: 21.1420, lng: 79.0490 },
    ],
  },
  {
    name: 'Cotton North Field',
    pins: [
      { id: 1, label: 'NW Pin', lat: 21.1540, lng: 79.0440 },
      { id: 2, label: 'NE Pin', lat: 21.1540, lng: 79.0620 },
      { id: 3, label: 'SE Pin', lat: 21.1460, lng: 79.0620 },
      { id: 4, label: 'SW Pin', lat: 21.1460, lng: 79.0440 },
    ],
  },
  {
    name: 'Soybean East Field',
    pins: [
      { id: 1, label: 'NW Pin', lat: 21.1460, lng: 79.0540 },
      { id: 2, label: 'NE Pin', lat: 21.1460, lng: 79.0620 },
      { id: 3, label: 'SE Pin', lat: 21.1380, lng: 79.0620 },
      { id: 4, label: 'SW Pin', lat: 21.1380, lng: 79.0540 },
    ],
  },
];

export function PinBoundarySelector({ 
  pins, 
  onPinsChange, 
  onApplyBoundary, 
  onReset,
  isPickMode,
  onTogglePickMode,
  flightMode,
  onFlightModeChange,
  calculatedAreaHa
}: PinBoundarySelectorProps) {
  const [isOpen, setIsOpen] = useState(true);

  const updatePin = (index: number, field: 'lat' | 'lng', val: string) => {
    let num = parseFloat(val);
    if (isNaN(num)) num = 0;

    const updated = [...pins];

    if (field === 'lat' && Math.abs(num) > 89.9) {
      num = num > 0 ? 89.9 : -89.9;
    }
    if (field === 'lng' && Math.abs(num) > 179.9) {
      num = num > 0 ? 179.9 : -179.9;
    }

    updated[index] = {
      ...updated[index],
      [field]: num,
    };
    onPinsChange(updated);
  };

  const applyPreset = (presetPins: PinCoord[]) => {
    onPinsChange(presetPins);
  };

  return (
    <div className="absolute top-4 left-14 z-20 w-80 bg-[var(--surface)]/95 backdrop-blur-md border border-[var(--border)] rounded-xl shadow-2xl overflow-hidden font-sans text-xs">
      <div 
        className="flex items-center justify-between p-3 border-b border-[var(--border)] cursor-pointer select-none bg-[var(--surface-2)]/50"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="flex items-center gap-2">
          <MapPin className="w-4 h-4 text-[var(--accent)]" />
          <span className="font-bold text-[var(--text-primary)]">4-Pin Location & Flight Bounds</span>
        </div>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {isOpen ? '▲ Collapse' : '▼ Expand'}
        </span>
      </div>

      {isOpen && (
        <div className="p-3 space-y-3">
          {/* Live Area Calculation Badge */}
          <div className="flex items-center justify-between bg-[var(--background)] p-2 rounded-lg border border-[var(--border)] font-mono">
            <span className="text-[10px] text-[var(--text-muted)]">Calculated Area:</span>
            <div className="flex items-baseline gap-1.5">
              <span className="text-sm font-bold text-[var(--accent)]">{calculatedAreaHa.toFixed(2)} ha</span>
              <span className="text-[10px] text-[var(--text-secondary)]">({(calculatedAreaHa * 2.471).toFixed(2)} acres)</span>
            </div>
          </div>

          {/* Drone Flight Mode Selection */}
          <div>
            <span className="text-[10px] font-mono text-[var(--text-muted)] block mb-1">Drone Flight Mode & Path Pattern:</span>
            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => onFlightModeChange('scan')}
                className={`py-1 px-1.5 text-[10px] font-mono rounded border flex items-center justify-center gap-1 transition-colors ${
                  flightMode === 'scan'
                    ? 'bg-blue-600/20 text-blue-400 border-blue-500 font-bold'
                    : 'bg-[var(--background)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <Activity className="w-3 h-3" />
                <span>Grid Scan</span>
              </button>

              <button
                onClick={() => onFlightModeChange('inspect')}
                className={`py-1 px-1.5 text-[10px] font-mono rounded border flex items-center justify-center gap-1 transition-colors ${
                  flightMode === 'inspect'
                    ? 'bg-amber-600/20 text-amber-400 border-amber-500 font-bold'
                    : 'bg-[var(--background)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <Compass className="w-3 h-3" />
                <span>Hotspot</span>
              </button>

              <button
                onClick={() => onFlightModeChange('patrol')}
                className={`py-1 px-1.5 text-[10px] font-mono rounded border flex items-center justify-center gap-1 transition-colors ${
                  flightMode === 'patrol'
                    ? 'bg-emerald-600/20 text-emerald-400 border-emerald-500 font-bold'
                    : 'bg-[var(--background)] text-[var(--text-secondary)] border-[var(--border)] hover:bg-[var(--surface-2)]'
                }`}
              >
                <MapPin className="w-3 h-3" />
                <span>Perimeter</span>
              </button>
            </div>
          </div>

          {/* Map Pick Mode Toggle */}
          <button
            onClick={onTogglePickMode}
            className={`w-full flex items-center justify-center gap-2 py-1.5 px-3 rounded-lg border text-xs font-mono transition-colors ${
              isPickMode 
                ? 'bg-amber-500 text-black font-bold border-amber-400 animate-pulse' 
                : 'bg-[var(--background)] hover:bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)]'
            }`}
          >
            <MousePointerClick className="w-4 h-4" />
            <span>{isPickMode ? '🎯 Click Map to Place Pins (Active)' : '📍 Enable Map Click Pin Mode'}</span>
          </button>

          {/* Presets */}
          <div className="flex flex-wrap gap-1.5 pt-0.5">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                onClick={() => applyPreset(p.pins)}
                className="px-2 py-1 bg-[var(--background)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)] rounded font-mono text-[10px] transition-colors"
              >
                {p.name}
              </button>
            ))}
          </div>

          {/* 4 Pin Coordinate Inputs */}
          <div className="space-y-1.5">
            {pins.map((pin, idx) => (
              <div key={pin.id} className="grid grid-cols-12 gap-1.5 items-center bg-[var(--background)] p-1.5 rounded-lg border border-[var(--border)]">
                <span className="col-span-3 font-mono font-bold text-[10px] text-[var(--accent)] flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-[var(--accent)]/20 text-[var(--accent)] flex items-center justify-center text-[9px]">
                    {pin.id}
                  </span>
                  {pin.label}
                </span>

                <div className="col-span-4 flex flex-col">
                  <span className="text-[8px] font-mono text-[var(--text-muted)]">Lat</span>
                  <input
                    type="number"
                    step="0.0001"
                    min="-89.9"
                    max="89.9"
                    value={pin.lat}
                    onChange={(e) => updatePin(idx, 'lat', e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-1 py-0.5 text-[10px] font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>

                <div className="col-span-5 flex flex-col">
                  <span className="text-[8px] font-mono text-[var(--text-muted)]">Lng</span>
                  <input
                    type="number"
                    step="0.0001"
                    min="-179.9"
                    max="179.9"
                    value={pin.lng}
                    onChange={(e) => updatePin(idx, 'lng', e.target.value)}
                    className="w-full bg-[var(--surface)] border border-[var(--border)] rounded px-1 py-0.5 text-[10px] font-mono text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent)]"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-1">
            <button
              onClick={onApplyBoundary}
              className="flex-1 flex items-center justify-center gap-1.5 bg-[var(--accent)] hover:bg-yellow-500 text-black font-bold py-2 rounded-lg transition-colors font-mono"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Apply & Scan Boundary</span>
            </button>

            <button
              onClick={onReset}
              title="Reset to default Waranga boundary"
              className="px-3 bg-[var(--background)] hover:bg-[var(--surface-2)] text-[var(--text-secondary)] border border-[var(--border)] rounded-lg transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
