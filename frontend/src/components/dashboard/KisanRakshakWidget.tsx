'use client';
import React from 'react';
import Link from 'next/link';
import { 
  ShieldAlert, 
  Moon, 
  HeartPulse, 
  Sprout, 
  Droplets, 
  ArrowRight, 
  Zap, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';

export function KisanRakshakWidget() {
  const { t } = useTranslation();
  const { language } = useAppStore();

  const isMarathi = language === 'mr';
  const isHindi = language === 'hi';

  return (
    <div className="rounded-3xl border-2 border-rose-500/30 bg-gradient-to-br from-rose-500/5 via-[var(--surface)] to-[var(--surface)] p-6 shadow-md transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-[var(--border)]">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30">
            <ShieldAlert className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {isMarathi ? 'किसान रक्षक: दुर्लक्षित समस्या निवारण' : isHindi ? 'किसान रक्षक: जमीनी समस्याओं का समाधान' : 'Kisan Rakshak: Grassroots Solutions Suite'}
              </h3>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-600 dark:text-rose-400 font-bold uppercase">
                GIPE & Survey Backed
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {isMarathi 
                ? 'रानडुक्कर उपद्रव · फवारणी विषबाधा · बोगस बियाणे · रात्रीचे सिंचन' 
                : isHindi 
                ? 'जंगली जानवर आतंक · कीटनाशक विषबाधा · नकली बीज · रात्रि सिंचाई' 
                : 'Wild Boar Deterrent · 0% Spray Poisoning · Bogus Seed Audit · Aquifer GIS'}
            </p>
          </div>
        </div>

        <Link
          href="/kisan-rakshak"
          className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-mono font-bold shadow-md shadow-rose-600/30 transition-all self-start sm:self-auto active:scale-95"
        >
          <span>{isMarathi ? 'रक्षक केंद्र उघडा' : isHindi ? 'रक्षक केंद्र खोलें' : 'Launch Kisan Rakshak'}</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* 4 Grassroots Solvers Quick Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 mt-4">
        
        {/* Solver 1: Wildlife Night Deterrent */}
        <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Moon className="w-4 h-4 text-purple-500" />
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {isMarathi ? 'रानडुक्कर रडार' : isHindi ? 'जंगली जानवर रडार' : 'Night Wildlife Patrol'}
              </span>
            </div>
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            {isMarathi 
              ? 'थर्मल ड्रोन गस्त · ३ रानडुक्कर उत्तर सीमेवरून पिटाळले' 
              : isHindi 
              ? 'थर्मल ड्रोन गश्त · ३ जंगली सूअर सीमा से भगाए गए' 
              : 'FLIR Thermal Patrol · 3 Wild Boars repelled from Gat 142/A'}
          </p>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            ₹40,000 Cr Crop Protection
          </span>
        </div>

        {/* Solver 2: Zero Contact Poisoning Shield */}
        <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <HeartPulse className="w-4 h-4 text-emerald-500" />
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {isMarathi ? 'विषबाधा कवच' : isHindi ? 'विषबाधा सुरक्षा' : 'Zero-Contact Shield'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-600 bg-emerald-500/20 px-1.5 py-0.5 rounded">
              0% Contact
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            {isMarathi 
              ? 'स्वायत्त ड्रोन फवारणी · मानवी श्वसन विषबाधेपासून १००% मुक्ती' 
              : isHindi 
              ? 'ड्रोन छिड़काव · रसायनों के सांस में जाने से १००% मुक्ति' 
              : 'Zero human foot contact · Eliminates Yavatmal inhalation crisis'}
          </p>
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
            100% Inhalation Free
          </span>
        </div>

        {/* Solver 3: Bogus Seed Audit */}
        <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Sprout className="w-4 h-4 text-amber-500" />
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {isMarathi ? 'बोगस बियाणे तपासणी' : isHindi ? 'नकली बीज जांच' : 'Seed Emergence Audit'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-amber-600 bg-amber-500/20 px-1.5 py-0.5 rounded">
              Day 8
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            {isMarathi 
              ? 'उगवण क्षमता मोजणी · दुबार पेरणी खर्च टाळणारा कायदेशीर पंचनामा' 
              : isHindi 
              ? 'अंकुरण दर माप · पुनः बुवाई रोकने हेतु कानूनी पंचनामा' 
              : 'Seedling density scan · Pre-empts ruinous ₹25,000 re-sowing'}
          </p>
          <span className="text-[10px] font-mono text-amber-600 dark:text-amber-400 font-bold">
            1-Click Legal Panchnama
          </span>
        </div>

        {/* Solver 4: Hydro-Thermal Borewell GIS */}
        <div className="p-3.5 rounded-2xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-xs font-bold text-[var(--text-primary)]">
                {isMarathi ? 'अचूक बोअरवेल ठिकाण' : isHindi ? 'सटीक बोरवेल बिंदु' : 'Borewell Aquifer GIS'}
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-blue-600 bg-blue-500/20 px-1.5 py-0.5 rounded">
              86.4% Prob
            </span>
          </div>
          <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
            {isMarathi 
              ? 'थर्मल व उतार मॅपिंग · कोरड्या बोअरवेलचे ₹२ लाख नुकसान थांबवा' 
              : isHindi 
              ? 'थर्मल मैपिंग · सूखे बोरवेल का ₹२ लाख नुकसान बचाएं' 
              : 'Thermal subterranean cooling · Saves ₹2L dry-hole debt'}
          </p>
          <span className="text-[10px] font-mono text-blue-600 dark:text-blue-400 font-bold">
            Basalt Fracture Mapped
          </span>
        </div>

      </div>
    </div>
  );
}
