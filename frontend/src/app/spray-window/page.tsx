'use client';
import React from 'react';
import { SprayWindowWidget } from '@/components/dashboard/SprayWindowWidget';
import { useAppStore } from '@/store/useAppStore';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function SprayWindowPage() {
  const { language } = useAppStore();
  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  return (
    <div className="space-y-6 font-sans max-w-5xl mx-auto p-4 sm:p-6">
      <div className="flex items-center justify-between pb-4 border-b border-[var(--border)]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-mono text-[var(--accent)] hover:underline mb-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>{isMarathi ? 'डॅशबोर्डवर परत जा' : isHindi ? 'डैशबोर्ड पर वापस जाएं' : 'Back to Dashboard'}</span>
          </Link>
          <h1 className="text-2xl font-black text-[var(--text-primary)] flex items-center gap-2.5">
            <span>🌦️</span>
            <span>{isMarathi ? '४८-तास ड्रोन फवारणी अनुकूलता वेळ' : isHindi ? '४८-घंटे ड्रोन छिड़काव अनुकूल समय' : '48-Hour Precision Spray Weather Window'}</span>
          </h1>
          <p className="text-xs text-[var(--text-secondary)] mt-1">
            {isMarathi 
              ? 'हवेचा वेग, पाऊस व आर्द्रतेनुसार सुरक्षित ड्रोन उड्डाण व औषध फवारणीच्या सर्वोत्तम वेळा.' 
              : 'Microclimate weather tracking for safe drone flight and chemical droplet drift prevention.'}
          </p>
        </div>
      </div>

      {/* Main Spray Window Widget */}
      <SprayWindowWidget />
    </div>
  );
}
