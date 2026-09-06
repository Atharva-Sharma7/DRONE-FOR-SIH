'use client';
import React from 'react';
import { CropProgressReviewTab } from '@/components/farmer/CropProgressReviewTab';
import { useAppStore } from '@/store/useAppStore';
import { TrendingUp, Sprout, ArrowLeft, BarChart2 } from 'lucide-react';
import Link from 'next/link';

export default function CropProgressPage() {
  const { language } = useAppStore();
  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  return (
    <div className="space-y-6 font-sans max-w-7xl mx-auto p-4 sm:p-6">
      {/* Top Breadcrumb & Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[var(--border)]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isMarathi ? 'डॅशबोर्डवर परत जा' : isHindi ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-emerald-500/15 text-emerald-500 border border-emerald-500/30">
              <BarChart2 className="w-6 h-6" />
            </span>
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-[var(--text-primary)]">
                {isMarathi ? '📈 पीक वाढ व प्रगती आलेख (Crop Progress Review)' : isHindi ? '📈 फसल वृद्धि व प्रगति ग्राफ (Crop Progress)' : '📈 Multi-Crop Growth & Health Progress Review'}
              </h1>
              <p className="text-xs text-[var(--text-secondary)] mt-0.5">
                {isMarathi
                  ? 'शेतकऱ्यांच्या सर्व पिकांचे (कपाशी, सोयाबीन, तूर, हरभरा, कांदा) एनडीव्हीआय, पानांचा विस्तार व पाण्याचा ताण आलेख.'
                  : isHindi
                  ? 'सभी बोई गई फसलों (कपास, सोयाबीन, तुअर, चना, प्याज) के एनडीवीआई व वृद्धि चार्ट।'
                  : 'Detailed growth trajectories, NDVI chlorophyll progression, canopy coverage, and moisture stress.'}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/analytics"
            className="px-4 py-2 rounded-xl bg-[var(--surface-2)] hover:bg-[var(--border)] text-xs font-mono font-bold text-[var(--text-primary)] border border-[var(--border)] flex items-center gap-1.5 transition-all"
          >
            <TrendingUp className="w-3.5 h-3.5 text-amber-500" />
            <span>{isMarathi ? 'अॅनालिटिक्स डॅशबोर्ड' : 'Analytics View'}</span>
          </Link>
        </div>
      </div>

      {/* Main Full-Featured Crop Progress Review Component */}
      <CropProgressReviewTab />
    </div>
  );
}
