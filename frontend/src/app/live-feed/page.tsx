'use client';
import React from 'react';
import { LiveCameraGrid } from '@/components/drone/LiveCameraGrid';
import { ShieldCheck } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

import { useAppStore } from '@/store/useAppStore';

export default function LiveFeedPage() {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  return (
    <div className="space-y-6 pb-12 font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-black text-[var(--text-primary)] tracking-wide">
              {isMarathi 
                ? 'ड्रोन थेट ४-कॅमेरा व्हिजन लॅब' 
                : isHindi 
                ? 'ड्रोन लाइव ४-कैमरा विजन लैब' 
                : 'Synchronized 4-Cam Live Drone Vision'}
            </h1>
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-xs font-mono font-bold uppercase flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              {isMarathi ? 'थेट प्रवाह' : isHindi ? 'लाइव स्ट्रीम' : 'Live Sync'}
            </span>
          </div>
          <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
            {isMarathi 
              ? 'सर्व ४ सेन्सर एकाच पिकावर रोखून रिअल-टाइम रोग व आरोग्य विश्लेषण' 
              : isHindi 
              ? 'सभी ४ सेंसर एक ही फसल पर केंद्रित होकर रियल-टाइम रोग व स्वास्थ्य विश्लेषण' 
              : 'All 4 sensors concurrently locked onto the same crop parcel with RTK centimeter precision'}
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono bg-[var(--surface)] border border-[var(--border)] px-3.5 py-2 rounded-xl shadow-sm">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          <span className="text-[var(--text-primary)] font-bold">
            {isMarathi ? 'स्वायत्त सर्वेक्षण सक्रिय' : isHindi ? 'स्वायत्त सर्वेक्षण सक्रिय' : 'Autonomous Survey Active'}
          </span>
        </div>
      </div>

      <LiveCameraGrid />
    </div>
  );
}
