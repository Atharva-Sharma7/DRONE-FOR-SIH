'use client';
import React, { useEffect, useState } from 'react';
import { InformationHub } from '@/components/dashboard/InformationHub';
import { DroneDetailsCard } from '@/components/dashboard/DroneDetailsCard';
import { WeatherWidget } from '@/components/dashboard/WeatherWidget';
import { SoilSensorWidget } from '@/components/dashboard/SoilSensorWidget';
import { MissionSummaryCard } from '@/components/dashboard/MissionSummaryCard';
import { QuickActionCards } from '@/components/dashboard/QuickActionCards';
import { MandiTickerWidget } from '@/components/dashboard/MandiTickerWidget';
import { SprayWindowWidget } from '@/components/dashboard/SprayWindowWidget';
import { KisanRakshakWidget } from '@/components/dashboard/KisanRakshakWidget';
import { FieldSowingOverview } from '@/components/farmer/FieldSowingOverview';
import { JudgeEvaluationDeck } from '@/components/judge/JudgeEvaluationDeck';
import { QuickSprayModal } from '@/components/farmer/QuickSprayModal';
import { DashboardTutorialModal } from '@/components/dashboard/DashboardTutorialModal';
import { Sparkles, Navigation2, Volume2, VolumeX, AlertTriangle, ShieldCheck, Plane, Sprout, HelpCircle, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

export default function DashboardPage() {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [isFarmerSprayModalOpen, setIsFarmerSprayModalOpen] = useState(false);
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);
  const [score, setScore] = useState(0);
  const TARGET = 78;

  useEffect(() => {
    let current = 0;
    const step = () => {
      current += 2;
      if (current >= TARGET) { setScore(TARGET); return; }
      setScore(current);
      requestAnimationFrame(step);
    };
    const timer = setTimeout(() => requestAnimationFrame(step), 120);
    return () => clearTimeout(timer);
  }, []);

  const METRICS = [
    { label: t('dashboard.cropCover'),     value: '87.4', unit: '%',    status: 'active'  },
    { label: t('dashboard.avgNdvi'),       value: '0.731', unit: '',     status: 'active'  },
    { label: t('dashboard.waterRisk'),     value: t('dashboard.moderate'), unit: '',  status: 'warning' },
    { label: t('dashboard.canopyTemp'),    value: '31.2', unit: '°C',   status: 'active'  },
    { label: t('dashboard.criticalAlerts'), value: '2', unit: 'Urgent', status: 'alert'  },
    { label: t('dashboard.lastSurvey'),    value: '38', unit: 'Min',    status: 'active' },
  ];

  return (
    <div className="space-y-7 pb-16 font-sans">
      {/* ── Farm Voice Advisory & 1-Tap Quick Action Strip ── */}
      <div className="rounded-3xl border-2 border-emerald-500/40 bg-emerald-500/10 p-5 shadow-lg flex flex-col md:flex-row items-center justify-between gap-4 animate-fade-in transition-all">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="p-3 rounded-2xl bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border border-emerald-500/40 shrink-0">
            <Sprout className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-md bg-emerald-600 text-white text-[10px] font-mono font-extrabold uppercase">
                {language === 'mr' ? 'शेतकरी मदत केंद्र' : language === 'hi' ? 'किसान सहायता केंद्र' : 'Farmer Action Center'}
              </span>
              <span className="text-xs font-mono text-emerald-700 dark:text-emerald-300 font-bold">
                {language === 'mr' ? 'बोलका सहाय्यक उपलब्ध' : language === 'hi' ? 'बोलने वाला सहायक सक्रिय' : 'Voice Assistant Active'}
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-[var(--text-primary)] mt-1">
              {language === 'mr' 
                ? 'नमस्कार शेतकरी दादा! पीक आरोग्य ७८% आहे, १ रोग आढळला.' 
                : language === 'hi'
                ? 'नमस्ते किसान भाई! फसल स्वास्थ्य ७८% है, १ रोग मिला है।'
                : 'Hello Farmer! Crop health is 78%, 1 infection detected.'}
            </h2>
          </div>
        </div>

          <div className="flex items-center gap-3 w-full md:w-auto justify-end flex-wrap">
            {/* Audio Read-Aloud Speaker Button */}
            <button
              onClick={() => {
                if (isSpeaking) {
                  stopSpeaking();
                  setIsSpeaking(false);
                } else {
                  setIsSpeaking(true);
                  const farmerSummaryMap: Record<string, string> = {
                    mr: 'शेतात पिकाचे आरोग्य ७८ टक्के आहे. सोयाबीन पूर्व भागात कोळशी रोगाचा प्रादुर्भाव झाला आहे. तात्काळ १-टॅप फवारणी बटण दाबून ड्रोन पाठवा.',
                    hi: 'खेत में फसल का स्वास्थ्य ७८ प्रतिशत है। सोयाबीन पूर्व क्षेत्र में चारकोल रॉट रोग पाया गया है। कृपया तत्काल १-टैप छिड़काव बटन दबाकर ड्रोन भेजें।',
                    te: 'పంట ఆరోగ్యం 78 శాతం. సోయాబీన్ తూర్పు పొలంలో చార్‌కోల్ రాట్ తెగులు ఉంది. డ్రోన్ పిచికారీ చేయడానికి వెంటనే బటన్ నొక్కండి.',
                    ta: 'பயிர் ஆரோக்கியம் 78%. சோயாபீன் கிழக்கில் கரி அழுகல் நோய் உள்ளது. உடனடியாக ட்ரோன் மூலம் மருந்து தெளிக்கவும்.',
                    gu: 'પાકનું સ્વાસ્થ્ય 78% છે. સોયાબીન પૂર્વ ખેતરમાં ચારકોલ રોટ રોગ જોવા મળ્યો છે. તાત્કાલિક ડ્રોન સ્પ્રે બટન દબાવો.',
                    pa: 'ਫਸਲ ਦੀ ਸਿਹਤ 78% ਹੈ। ਸੋਇਆਬੀਨ ਪੂਰਬੀ ਖੇਤ ਵਿੱਚ ਚਾਰਕੋਲ ਰੌਟ ਰੋਗ ਹੈ। ਤੁਰੰਤ ਡਰੋਨ ਸਪਰੇਅ ਬਟਨ ਦਬਾਓ।',
                    en: 'Crop health is 78 percent. Charcoal rot detected in Soybean East field. Tap instant spray button to launch bio-agent drone.',
                  };
                  const farmerSummary = farmerSummaryMap[language] || farmerSummaryMap.en;
                  speakText(farmerSummary, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
                }
              }}
              className={`flex items-center gap-2 px-4 py-3 rounded-2xl font-bold text-xs transition-all shadow-md active:scale-95 ${
                isSpeaking
                  ? 'bg-red-500 text-white animate-pulse'
                  : 'bg-[var(--accent)] text-black hover:bg-amber-500'
              }`}
            >
              {isSpeaking ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5 animate-bounce" />}
              <span className="font-mono text-xs">
                {isSpeaking
                  ? (language === 'mr' ? 'थांबवा' : language === 'hi' ? 'बंद करें' : 'Stop')
                  : (language === 'mr' ? '🔊 शेतीची माहिती ऐका' : language === 'hi' ? '🔊 खेत की बात सुनें' : '🔊 Listen Farm Report')}
              </span>
            </button>

            {/* Crop Progress Charts Quick Link Button */}
            <Link
              href="/progress"
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:opacity-95 text-white font-bold text-xs shadow-md shadow-emerald-700/30 transition-all active:scale-95"
            >
              <TrendingUp className="w-5 h-5 animate-pulse" />
              <span>
                {language === 'mr' ? '📈 पीक वाढ व प्रगती आलेख' : language === 'hi' ? '📈 फसल प्रगति चार्ट' : '📈 Crop Progress Charts'}
              </span>
            </Link>

            {/* Instant Drone Sprayer Button */}
            <button
              onClick={() => setIsFarmerSprayModalOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md shadow-emerald-600/30 transition-all active:scale-95"
            >
              <Plane className="w-5 h-5" />
              <span>
                {language === 'mr' ? '🚀 त्वरित ड्रोन फवारणी' : language === 'hi' ? '🚀 तुरंत ड्रोन छिड़काव' : '🚀 1-Tap Drone Spray'}
              </span>
            </button>

            {/* Interactive Dashboard Tutorial Walkthrough Button */}
            <button
              onClick={() => setIsTutorialOpen(true)}
              className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs shadow-md shadow-indigo-600/30 transition-all active:scale-95"
            >
              <HelpCircle className="w-5 h-5 animate-pulse" />
              <span>
                {language === 'mr' ? '📖 डॅशबोर्ड मार्गदर्शिका' : language === 'hi' ? '📖 डैशबोर्ड गाइड' : '📖 Dashboard Guide'}
              </span>
            </button>
          </div>
        </div>

      {/* ── TOP SECTION: Farm Command Station (Left) + DRONE INFO (TOP RIGHT) ── */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left / Center (7 Cols): Farm Health & Command Station */}
        <div className="lg:col-span-7 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm flex flex-col justify-between transition-colors">
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-[var(--border)]">
              <div>
                <span className="text-xs font-mono font-bold tracking-wider text-[var(--accent)] uppercase flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  Kharif Precision Agriculture · 2024-2026
                </span>
                <h1 className="text-2xl font-bold text-[var(--text-primary)] mt-1 tracking-tight">
                  {t('dashboard.title')}
                </h1>
                <p className="text-xs font-mono text-[var(--text-muted)] mt-0.5">
                  {t('dashboard.sector')} · 21.0250°N, 79.0350°E
                </p>
              </div>

              <Link
                href="/map"
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-amber-500 text-black text-xs font-mono font-bold transition-all shadow self-start sm:self-auto"
              >
                <Navigation2 className="w-4 h-4" />
                <span>{t('dashboard.launchMap')}</span>
              </Link>
            </div>

            {/* Health Score Count-Up & Crop Standing */}
            <div className="flex items-end gap-5 pt-5 pb-3">
              <span className="health-score-hero score-reveal">
                {score}
              </span>
              <div className="mb-2">
                <p className="text-xl font-bold text-[var(--text-secondary)]">/ 100</p>
                <p className="text-xs font-mono font-bold text-emerald-600 dark:text-emerald-400 mt-0.5">
                  {score >= 75 ? t('dashboard.cropStanding') : t('dashboard.inspectionNeeded')}
                </p>
              </div>
            </div>

            <p className="text-xs text-[var(--text-secondary)] leading-relaxed font-medium">
              {t('dashboard.summaryText')}
            </p>
          </div>

          {/* Metric Instrument Row with Full Translations */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-5 pt-4 border-t border-[var(--border)]">
            {METRICS.map(m => (
              <div
                key={m.label}
                className="p-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]"
              >
                <p className="text-[10px] font-semibold text-[var(--text-secondary)] capitalize leading-tight truncate">
                  {m.label}
                </p>
                <p className="mt-1 font-mono text-base font-bold text-[var(--text-primary)]">
                  {m.value}
                  {m.unit && <span className="text-[10px] text-[var(--text-muted)] ml-1 font-normal">{m.unit}</span>}
                </p>
                <div className="flex items-center gap-1.5 mt-1">
                  <span className={`status-dot ${m.status}`} />
                  <span className="text-[9px] font-mono text-[var(--text-muted)] uppercase">
                    {m.status === 'alert' ? 'Warning' : 'Normal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP RIGHT (5 Cols): DRONE TELEMETRY & HARDWARE CARD */}
        <div className="lg:col-span-5">
          <DroneDetailsCard compact={true} />
        </div>
      </div>

      {/* ── INTERACTIVE FIELD SOWING OVERVIEW & 6-AI MODEL AUDIT ── */}
      <FieldSowingOverview />

      {/* ── INFORMATION HUB (Critical Alerts in Red + Categorized Tabs) ── */}
      <InformationHub />

      {/* ── FULL DRONE FLEET & MULTIMODAL SENSOR SPECIFICATIONS ── */}
      <DroneDetailsCard compact={false} />

      {/* ── Quick Actions Grid ── */}
      <QuickActionCards />

      {/* ── Kisan Rakshak: Wildlife, Poisoning & Bogus Seed Solutions ── */}
      <KisanRakshakWidget />

      {/* ── Grassroots Farmer Super-Tools: Live Mandi Bhav & 48-Hr Spray Window ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <MandiTickerWidget />
        <SprayWindowWidget />
      </div>

      {/* ── Data Rows: Weather & Soil Sensors ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <WeatherWidget />
        <SoilSensorWidget />
      </div>

      {/* ── Mission Summary ── */}
      <MissionSummaryCard />

      {/* ── Edge AI & Technical Architecture Evaluation Deck ── */}
      <JudgeEvaluationDeck />

      {/* ── Farmer 1-Tap Spray Dispatch Modal ── */}
      <QuickSprayModal
        isOpen={isFarmerSprayModalOpen}
        onClose={() => setIsFarmerSprayModalOpen(false)}
        targetField="Soybean East Field · Sector B-3"
        targetDisease="Severe Charcoal Rot"
        recommendedMedicine="Trichoderma viride bio-fungicide (1.4L spray mix)"
      />

      {/* ── Interactive Dashboard Onboarding Tutorial Modal ── */}
      <DashboardTutorialModal
        isOpen={isTutorialOpen}
        onClose={() => setIsTutorialOpen(false)}
      />
    </div>
  );
}
