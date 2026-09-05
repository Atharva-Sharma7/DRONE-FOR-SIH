'use client';
import React, { useEffect, useState } from 'react';
import { Marker } from 'react-map-gl/maplibre';
import { FlightMode } from './PinBoundarySelector';

interface DroneMarkerProps {
  customPath?: number[][];
  flightMode?: FlightMode;
}

const DEFAULT_PATH = [
  [79.0440,21.1380],[79.0440,21.1540],[79.0475,21.1540],[79.0475,21.1380],
  [79.0510,21.1380],[79.0510,21.1540],[79.0545,21.1540],[79.0545,21.1380],
  [79.0580,21.1380],[79.0580,21.1540],[79.0620,21.1540],[79.0620,21.1380],
];

export function DroneMarker({ customPath, flightMode = 'scan' }: DroneMarkerProps) {
  const activePath = (customPath && customPath.length >= 2) ? customPath : DEFAULT_PATH;

  const [pos, setPos] = useState({
    lat: activePath[0][1],
    lng: activePath[0][0],
    heading: 0,
    altitudeM: 80,
    speedMs: 8.5,
    battery: 98,
  });

  useEffect(() => {
    // Dynamic cycle timing based on mode
    const cycleMs = flightMode === 'patrol' ? 20000 : flightMode === 'inspect' ? 40000 : 35000;
    
    const tick = () => {
      const now = Date.now();
      const t = (now % cycleMs) / cycleMs;
      const total = activePath.length - 1;
      const idxF = t * total;
      const idx = Math.min(Math.floor(idxF), total - 1);
      const frac = idxF - idx;
      const p1 = activePath[idx];
      const p2 = activePath[Math.min(idx + 1, total)];

      const lng = p1[0] + (p2[0] - p1[0]) * frac;
      const lat = p1[1] + (p2[1] - p1[1]) * frac;
      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];
      const heading = (Math.atan2(dx, dy) * 180 / Math.PI + 360) % 360;

      const alt = flightMode === 'inspect' ? 45 : flightMode === 'patrol' ? 110 : 80;
      const speed = flightMode === 'patrol' ? 14.5 : flightMode === 'inspect' ? 5.2 : 8.5;

      setPos({
        lat,
        lng,
        heading,
        altitudeM: Math.round(alt + 5 * Math.sin(t * 4 * Math.PI)),
        speedMs: parseFloat(speed.toFixed(1)),
        battery: Math.max(15, Math.round(100 - t * 50)),
      });
    };

    tick();
    const id = setInterval(tick, 150);
    return () => clearInterval(id);
  }, [activePath, flightMode]);

  return (
    <Marker longitude={pos.lng} latitude={pos.lat} anchor="center">
      <div className="relative group" style={{ width: 64, height: 64 }}>

        {/* Downward Laser Scanner Light Cone Overlay */}
        <div 
          className={`absolute inset-0 rounded-full transition-all duration-300 pointer-events-none ${
            flightMode === 'inspect'
              ? 'bg-amber-500/25 border-2 border-amber-400 animate-ping'
              : flightMode === 'patrol'
              ? 'bg-emerald-500/20 border-2 border-emerald-400 radar-ping'
              : 'bg-blue-500/20 border-2 border-blue-400 radar-ping'
          }`}
          style={{ width: 80, height: 80, top: -8, left: -8 }}
        />

        {/* ── DRONE SVG with dynamic rotor animations & heading ── */}
        <div style={{ transform: `rotate(${pos.heading}deg)`, width: 64, height: 64, transition: 'transform 0.15s linear' }}>
          <svg viewBox="0 0 48 48" width="64" height="64" xmlns="http://www.w3.org/2000/svg">
            {/* Downward scanner optic */}
            <circle cx="24" cy="24" r="14" fill={flightMode === 'inspect' ? '#f59e0b' : '#3b82f6'} opacity="0.15" />
            
            {/* Arms */}
            <line x1="24" y1="24" x2="8"  y2="8"  stroke="#5C5748" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="24" x2="40" y2="8"  stroke="#5C5748" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="24" x2="8"  y2="40" stroke="#5C5748" strokeWidth="2.5" strokeLinecap="round" />
            <line x1="24" y1="24" x2="40" y2="40" stroke="#5C5748" strokeWidth="2.5" strokeLinecap="round" />

            {/* Rotor Pair 1 (CW) */}
            <g className="rotor-cw" style={{ transformOrigin: '8px 8px' }}>
              <ellipse cx="8" cy="8" rx="7" ry="2.5" fill="#E8C84A" opacity="0.9" />
            </g>
            <g className="rotor-cw" style={{ transformOrigin: '40px 40px' }}>
              <ellipse cx="40" cy="40" rx="7" ry="2.5" fill="#E8C84A" opacity="0.9" />
            </g>

            {/* Rotor Pair 2 (CCW) */}
            <g className="rotor-ccw" style={{ transformOrigin: '40px 8px' }}>
              <ellipse cx="40" cy="8" rx="7" ry="2.5" fill="#4A7C42" opacity="0.9" />
            </g>
            <g className="rotor-ccw" style={{ transformOrigin: '8px 40px' }}>
              <ellipse cx="8" cy="40" rx="7" ry="2.5" fill="#4A7C42" opacity="0.9" />
            </g>

            {/* Body Chassis */}
            <rect x="18" y="18" width="12" height="12" rx="3" fill="#17160F" stroke="#E8C84A" strokeWidth="1.5" />

            {/* Nose Direction Indicator */}
            <polygon points="24,12 21,18 27,18" fill={flightMode === 'inspect' ? '#f59e0b' : '#E8C84A'} />
          </svg>
        </div>

        {/* Hover Status HUD Tooltip */}
        <div
          className="absolute -top-20 left-1/2 -translate-x-1/2 hidden group-hover:block pointer-events-none z-50"
          style={{ minWidth: 140 }}
        >
          <div
            className="px-3 py-2 rounded-xl text-left shadow-2xl backdrop-blur-md"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-[var(--border)] pb-1 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase text-[var(--accent)]">
                🚁 {flightMode} Mode
              </span>
              <span className="text-[10px] font-mono text-[var(--green)]">● LIVE</span>
            </div>
            <div className="text-[10px] font-mono space-y-0.5 text-[var(--text-primary)]">
              <div>Alt: <span className="text-[var(--accent)] font-bold">{pos.altitudeM}m AGL</span></div>
              <div>Speed: <span className="text-[var(--text-secondary)]">{pos.speedMs} m/s</span></div>
              <div>Batt: <span className="text-emerald-400 font-bold">🔋 {pos.battery}%</span></div>
            </div>
          </div>
        </div>
      </div>
    </Marker>
  );
}
