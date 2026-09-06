'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, ArrowRight, Store, DollarSign, RefreshCw, Volume2, VolumeX } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

export function MandiTickerWidget() {
  const { t } = useTranslation();
  const { language, isSpeaking, setIsSpeaking } = useAppStore();
  const [selectedCrop, setSelectedCrop] = useState<'cotton' | 'soybean' | 'tur' | 'chana'>('cotton');

  const CROPS = [
    {
      id: 'cotton' as const,
      name: language === 'mr' ? 'कापूस (Cotton)' : language === 'hi' ? 'कपास (Cotton)' : 'Cotton (Bt-II)',
      msp: 7122,
      rates: [
        { mandi: language === 'mr' ? 'कळमणा (नागपूर)' : language === 'hi' ? 'कलमना (नागपुर)' : 'Kalamna (Nagpur)', rate: 7480, trend: '+₹180', change: 'up' },
        { mandi: language === 'mr' ? 'हिंगणा' : language === 'hi' ? 'हिंगना' : 'Hingna', rate: 7350, trend: '+₹50', change: 'up' },
        { mandi: language === 'mr' ? 'काटोल' : language === 'hi' ? 'काटोल' : 'Katol', rate: 7280, trend: '-₹40', change: 'down' },
      ],
      bestMandi: language === 'mr' ? 'कळमणा APMC' : language === 'hi' ? 'कलमना APMC' : 'Kalamna APMC',
      advice: language === 'mr'
        ? 'कळमणा बाजारात सर्वोत्तम भाव ₹७,४८०/क्विंटल आहे. स्थानिक व्यापाऱ्यापेक्षा ₹५८० जास्त मिळत आहे.'
        : language === 'hi'
        ? 'कलमना मंडी में सबसे अच्छा भाव ₹७,४८०/क्विंटल है। स्थानीय व्यापारी से ₹५८० अधिक मिल रहा है।'
        : 'Best rate at Kalamna APMC ₹7,480/q. You gain +₹580/q compared to local village middlemen.'
    },
    {
      id: 'soybean' as const,
      name: language === 'mr' ? 'सोयाबीन (JS-335)' : language === 'hi' ? 'सोयाबीन (JS-335)' : 'Soybean (Yellow)',
      msp: 4892,
      rates: [
        { mandi: language === 'mr' ? 'हिंगणा' : language === 'hi' ? 'हिंगना' : 'Hingna', rate: 4720, trend: '+₹60', change: 'up' },
        { mandi: language === 'mr' ? 'कळमणा (नागपूर)' : language === 'hi' ? 'कलमना (नागपुर)' : 'Kalamna (Nagpur)', rate: 4680, trend: '-₹20', change: 'down' },
        { mandi: language === 'mr' ? 'वर्धा' : language === 'hi' ? 'वर्धा' : 'Wardha', rate: 4650, trend: '+₹10', change: 'up' },
      ],
      bestMandi: language === 'mr' ? 'हिंगणा उपबाजार' : language === 'hi' ? 'हिंगना उपमंडी' : 'Hingna Sub-Mandi',
      advice: language === 'mr'
        ? 'हिंगणा बाजारात ₹४,७२० भाव चालू आहे. वाहतूक खर्च कमी असल्याने हिंगणा बाजारात विका.'
        : language === 'hi'
        ? 'हिंगना मंडी में ₹४,७२० भाव है। कम परिवहन लागत के कारण हिंगना में बेचना फायदेमंद है।'
        : 'Hingna APMC offers ₹4,720/q. Lower freight cost gives highest net in-hand realization.'
    },
    {
      id: 'tur' as const,
      name: language === 'mr' ? 'तूर / अरहर' : language === 'hi' ? 'तुअर / अरहर' : 'Pigeon Pea (Tur)',
      msp: 7550,
      rates: [
        { mandi: language === 'mr' ? 'कळमणा (नागपूर)' : language === 'hi' ? 'कलमना (नागपुर)' : 'Kalamna (Nagpur)', rate: 10450, trend: '+₹300', change: 'up' },
        { mandi: language === 'mr' ? 'अमरावती' : language === 'hi' ? 'अमरावती' : 'Amravati', rate: 10200, trend: '+₹150', change: 'up' },
      ],
      bestMandi: language === 'mr' ? 'नागपूर कळमणा' : language === 'hi' ? 'नागपुर कलमना' : 'Nagpur Kalamna',
      advice: language === 'mr'
        ? 'तुरीचे भाव MSP पेक्षा खूप जास्त (₹१०,४५०) आहेत! त्वरित विक्री करणे फायद्याचे ठरेल.'
        : language === 'hi'
        ? 'तुअर के भाव MSP से काफी अधिक (₹१०,४५०) हैं! तुरंत बेचना बेहद लाभदायक होगा।'
        : 'Tur prices are surging way above MSP at ₹10,450/q! High profit window.'
    },
    {
      id: 'chana' as const,
      name: language === 'mr' ? 'हरभरा / चना' : language === 'hi' ? 'चना (Gram)' : 'Bengal Gram (Chana)',
      msp: 5440,
      rates: [
        { mandi: language === 'mr' ? 'हिंगणा' : language === 'hi' ? 'हिंगना' : 'Hingna', rate: 5850, trend: '+₹40', change: 'up' },
        { mandi: language === 'mr' ? 'काटोल' : language === 'hi' ? 'काटोल' : 'Katol', rate: 5810, trend: '+₹20', change: 'up' },
      ],
      bestMandi: language === 'mr' ? 'हिंगणा APMC' : language === 'hi' ? 'हिंगना APMC' : 'Hingna APMC',
      advice: language === 'mr'
        ? 'हरभरा भाव स्थिर आणि समाधानकारक आहेत (₹५,८५०). प्रतवारी तपासून विक्री करा.'
        : language === 'hi'
        ? 'चना भाव स्थिर और अच्छे हैं (₹५,८५०)। ग्रेडिंग करवाकर बेचें।'
        : 'Chana prices are steady at ₹5,850/q with robust buyer demand.'
    },
  ];

  const current = CROPS.find(c => c.id === selectedCrop) || CROPS[0];

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-5 shadow-sm transition-all">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-base font-bold text-[var(--text-primary)]">
                {language === 'mr' ? 'थेट कृषी बाजार भाव (APMC Mandi Bhav)' : language === 'hi' ? 'लाइव मंडी भाव और स्मार्ट मुनाफा' : 'Live APMC Mandi Bhav & Profit Radar'}
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                Live
              </span>
            </div>
            <p className="text-xs text-[var(--text-muted)] font-mono">
              {language === 'mr' ? 'हिंगणा, नागपूर कळमणा व अमरावती मंडई' : language === 'hi' ? 'हिंगना, नागपुर कलमना व अमरावती' : 'Hingna, Kalamna (Nagpur), Amravati APMCs'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          {/* Audio Speaker */}
          <button
            onClick={() => {
              if (isSpeaking) {
                stopSpeaking();
                setIsSpeaking(false);
              } else {
                setIsSpeaking(true);
                const text = `${current.name}. ${current.advice}`;
                speakText(text, language, () => setIsSpeaking(true), () => setIsSpeaking(false));
              }
            }}
            title="Read aloud Mandi rates"
            className={`p-2 rounded-xl border transition-all ${
              isSpeaking
                ? 'bg-red-500 text-white border-red-600 animate-pulse'
                : 'bg-[var(--surface-2)] text-[var(--text-primary)] border-[var(--border)] hover:bg-[var(--surface)]'
            }`}
          >
            {isSpeaking ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          <Link
            href="/mandi"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-[var(--accent)] hover:bg-amber-500 text-black text-xs font-bold transition-all shadow-sm"
          >
            <span>{language === 'mr' ? 'नफा कॅल्क्युलेटर' : language === 'hi' ? 'मुनाफा कैलकुलेटर' : 'Profit Radar'}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* Crop Selector Chips */}
      <div className="flex items-center gap-2 py-3 overflow-x-auto no-scrollbar">
        {CROPS.map(c => {
          const isSel = c.id === selectedCrop;
          return (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all whitespace-nowrap border ${
                isSel
                  ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm'
                  : 'bg-[var(--surface-2)] text-[var(--text-secondary)] border-[var(--border)] hover:text-[var(--text-primary)]'
              }`}
            >
              {c.name}
            </button>
          );
        })}
      </div>

      {/* Mandi Rates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1 pb-3">
        {current.rates.map((r, idx) => (
          <div
            key={idx}
            className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex flex-col justify-between"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-[var(--text-secondary)]">{r.mandi}</span>
              <span className={`text-[10px] font-mono font-bold ${r.change === 'up' ? 'text-emerald-500' : 'text-red-500'}`}>
                {r.trend}
              </span>
            </div>
            <div className="mt-1.5 flex items-baseline justify-between">
              <span className="text-lg font-mono font-black text-[var(--text-primary)]">
                ₹{r.rate.toLocaleString('en-IN')}
              </span>
              <span className="text-[10px] text-[var(--text-muted)] font-mono">/ क्विंटल (q)</span>
            </div>
          </div>
        ))}
      </div>

      {/* Smart Selling Tip Banner */}
      <div className="mt-1 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-start gap-2.5">
        <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-400 mt-0.5 shrink-0" />
        <div className="flex-1">
          <p className="text-xs font-semibold text-emerald-800 dark:text-emerald-200 leading-snug">
            {current.advice}
          </p>
        </div>
      </div>
    </div>
  );
}
