'use client';
import React from 'react';
import { History, ArrowRight, ShieldCheck, AlertTriangle, X } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

interface TimeMachineCompareControlProps {
  progress: number; // 0 to 100
  onProgressChange: (val: number) => void;
  onClose: () => void;
}

export function TimeMachineCompareControl({
  progress,
  onProgressChange,
  onClose,
}: TimeMachineCompareControlProps) {
  const { t } = useTranslation();
  const { language } = useAppStore();

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 w-11/12 max-w-xl bg-[var(--surface)]/95 backdrop-blur-md rounded-3xl p-5 shadow-2xl border-2 border-[var(--accent)] font-sans animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2">
          <div className="p-2 rounded-xl bg-amber-500/15 text-[var(--accent)] border border-amber-500/30">
            <History className="w-5 h-5 animate-spin" style={{ animationDuration: '8s' }} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--text-primary)]">
              {language === 'mr' ? 'फवारणी तुलना: पूर्वी विरुद्ध नंतर' : language === 'hi' ? 'छिड़काव तुलना: पहले बनाम बाद' : 'Time-Machine: Pre vs Post Bio-Spray'}
            </h4>
            <p className="text-[11px] font-mono text-[var(--text-muted)]">
              {language === 'mr' ? 'ड्रोन फवारणीनंतर रोगाच्या उपचाराची प्रगती तपासा' : language === 'hi' ? 'ड्रोन छिड़काव के बाद फसल सुधार की स्थिति देखें' : 'Slide to track disease recovery post drone bio-fungicide dispersal'}
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full bg-[var(--surface-2)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Comparison Slider */}
      <div className="pt-4 pb-2 space-y-2">
        <div className="flex justify-between text-xs font-mono font-bold">
          <span className="text-red-600 dark:text-red-400 flex items-center gap-1">
            <AlertTriangle className="w-3.5 h-3.5" />
            {language === 'mr' ? 'दिवस ०: फवारणीपूर्वी (रोगट)' : language === 'hi' ? 'दिन ०: छिड़काव से पहले' : 'Day 0: Pre-Spray (Infected)'}
          </span>
          <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            {language === 'mr' ? 'दिवस ७: फवारणीनंतर (निरोगी)' : language === 'hi' ? 'दिन ७: छिड़काव के बाद' : 'Day 7: Post-Spray (Recovered)'}
          </span>
        </div>

        <input
          type="range"
          min="0"
          max="100"
          value={progress}
          onChange={(e) => onProgressChange(Number(e.target.value))}
          className="w-full h-2.5 bg-gradient-to-r from-red-600 via-amber-500 to-emerald-500 rounded-lg appearance-none cursor-pointer accent-amber-400 shadow-inner"
        />

        <div className="flex justify-between items-center text-[11px] font-mono text-[var(--text-secondary)] pt-1">
          <div className="p-2 rounded-xl bg-red-500/10 border border-red-500/30 text-left">
            <span className="font-bold text-red-700 dark:text-red-400 block">NDVI: 0.38 (Severe)</span>
            <span className="text-[10px] text-[var(--text-muted)]">Charcoal Rot 1.4 ha</span>
          </div>

          <div className="text-center font-bold px-3 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)] text-[var(--accent)]">
            {progress <= 25
              ? (language === 'mr' ? 'फवारणीपूर्वी स्थिती' : language === 'hi' ? 'छिड़काव पूर्व स्थिति' : 'Day 0 Pre-Spray')
              : progress >= 75
              ? (language === 'mr' ? '९२% रोग बरा झाला' : language === 'hi' ? '९२% रोग समाप्त' : '92% Fungal Suppression')
              : (language === 'mr' ? 'उपचार सुरू आहे' : language === 'hi' ? 'सुधार जारी है' : 'Recovery In Progress')}
          </div>

          <div className="p-2 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-right">
            <span className="font-bold text-emerald-700 dark:text-emerald-400 block">NDVI: 0.76 (Healthy)</span>
            <span className="text-[10px] text-[var(--text-muted)]">Canopy Restored</span>
          </div>
        </div>
      </div>
    </div>
  );
}
