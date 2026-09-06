'use client';
import React from 'react';
import { Ruler, Trash2, Check, Info } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

export interface MeasurePoint {
  lat: number;
  lng: number;
}

interface MapMeasureControlProps {
  points: MeasurePoint[];
  onClear: () => void;
  onClose: () => void;
}

export function MapMeasureControl({ points, onClear, onClose }: MapMeasureControlProps) {
  const { t } = useTranslation();
  const { language } = useAppStore();

  // Calculate perimeter in meters
  const perimeterMeters = React.useMemo(() => {
    if (points.length < 2) return 0;
    const latFactor = 111320;
    const lngFactor = (40075000 * Math.cos((21.0250 * Math.PI) / 180)) / 360;

    let total = 0;
    for (let i = 0; i < points.length; i++) {
      if (i === points.length - 1 && points.length < 3) break;
      const nextIdx = (i + 1) % points.length;
      const dx = (points[nextIdx].lng - points[i].lng) * lngFactor;
      const dy = (points[nextIdx].lat - points[i].lat) * latFactor;
      total += Math.sqrt(dx * dx + dy * dy);
    }
    return Math.round(total);
  }, [points]);

  // Calculate polygon area in Acres, Gunthas, Hectares
  const { acres, gunthas, ha, bighas } = React.useMemo(() => {
    if (points.length < 3) return { acres: 0, gunthas: 0, ha: 0, bighas: 0 };
    const latFactor = 111320;
    const lngFactor = (40075000 * Math.cos((21.0250 * Math.PI) / 180)) / 360;

    let areaM2 = 0;
    for (let i = 0; i < points.length; i++) {
      const j = (i + 1) % points.length;
      const x1 = points[i].lng * lngFactor;
      const y1 = points[i].lat * latFactor;
      const x2 = points[j].lng * lngFactor;
      const y2 = points[j].lat * latFactor;
      areaM2 += x1 * y2 - x2 * y1;
    }
    const sqM = Math.abs(areaM2) / 2;
    const calculatedHa = sqM / 10000;
    const calculatedAcres = calculatedHa * 2.47105;
    const calculatedGunthas = calculatedAcres * 40;
    const calculatedBighas = calculatedAcres * 1.61;

    return {
      acres: parseFloat(calculatedAcres.toFixed(2)),
      gunthas: Math.round(calculatedGunthas),
      ha: parseFloat(calculatedHa.toFixed(2)),
      bighas: parseFloat(calculatedBighas.toFixed(2)),
    };
  }, [points]);

  return (
    <div className="absolute top-4 left-16 z-30 bg-[var(--surface)]/95 backdrop-blur-md rounded-2xl p-4 shadow-2xl border-2 border-[var(--accent)] max-w-sm animate-fade-in font-sans">
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-[var(--border)]">
        <div className="flex items-center gap-2 text-[var(--accent)] font-bold text-xs font-mono uppercase">
          <Ruler className="w-4 h-4" />
          <span>{language === 'mr' ? 'जमीन मोजणी साधन' : language === 'hi' ? 'खेत मापन यंत्र' : 'Land Measurement Tool'}</span>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
        >
          <Check className="w-4 h-4 text-emerald-500" />
        </button>
      </div>

      <p className="text-[11px] text-[var(--text-secondary)] mb-3 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-[var(--accent)] shrink-0" />
        <span>
          {points.length === 0
            ? (language === 'mr' ? 'नकाशावर बिंदू निवडण्यासाठी क्लिक करा' : language === 'hi' ? 'नक्शे पर बिंदु चुनने के लिए क्लिक करें' : 'Click on map to place boundary points')
            : points.length < 3
            ? (language === 'mr' ? 'क्षेत्रफळ काढण्यासाठी किमान ३ बिंदू जोडा' : language === 'hi' ? 'क्षेत्रफल निकालने हेतु कम से कम ३ बिंदु चुनें' : 'Add at least 3 points to form a polygon')
            : (language === 'mr' ? 'जमिनीचे एकूण क्षेत्रफळ खालीलप्रमाणे:' : language === 'hi' ? 'खेत का कुल क्षेत्रफल:' : 'Calculated Farmland Area:')}
        </span>
      </p>

      {/* Real-time Calculation Card */}
      {points.length >= 3 ? (
        <div className="grid grid-cols-2 gap-2 bg-[var(--surface-2)] p-2.5 rounded-xl border border-[var(--border)] text-center mb-3">
          <div className="p-2 rounded-lg bg-[var(--surface)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">{language === 'mr' ? 'एकर' : language === 'hi' ? 'एकड़' : 'Acres'}</span>
            <span className="text-base font-bold font-mono text-emerald-600 dark:text-emerald-400">{acres}</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--surface)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">{language === 'mr' ? 'गुंठे' : language === 'hi' ? 'गुंठा' : 'Gunthas'}</span>
            <span className="text-base font-bold font-mono text-[var(--accent)]">{gunthas} G</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--surface)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">{language === 'mr' ? 'हेक्टर' : language === 'hi' ? 'हेक्टेयर' : 'Hectares'}</span>
            <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{ha} ha</span>
          </div>
          <div className="p-2 rounded-lg bg-[var(--surface)]">
            <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase block">{language === 'mr' ? 'परिघ / कुंपण' : language === 'hi' ? 'घेरा / परिमाप' : 'Perimeter'}</span>
            <span className="text-sm font-bold font-mono text-[var(--text-primary)]">{perimeterMeters} m</span>
          </div>
        </div>
      ) : (
        <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs text-center font-mono text-[var(--text-muted)] mb-3">
          {points.length} {language === 'mr' ? 'बिंदू निवडले' : language === 'hi' ? 'बिंदु चुने गए' : 'points selected'} · {perimeterMeters} m
        </div>
      )}

      {/* Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onClear}
          disabled={points.length === 0}
          className="flex-1 py-1.5 px-3 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-600 dark:text-red-400 text-xs font-mono font-bold flex items-center justify-center gap-1.5 transition-all disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? 'साफ करा' : language === 'hi' ? 'साफ करें' : 'Clear'}</span>
        </button>
        <button
          onClick={onClose}
          className="flex-1 py-1.5 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-mono font-bold flex items-center justify-center gap-1.5 shadow-md shadow-emerald-600/30 transition-all"
        >
          <Check className="w-3.5 h-3.5" />
          <span>{language === 'mr' ? 'पूर्ण झाले' : language === 'hi' ? 'संपन्न' : 'Done'}</span>
        </button>
      </div>
    </div>
  );
}
