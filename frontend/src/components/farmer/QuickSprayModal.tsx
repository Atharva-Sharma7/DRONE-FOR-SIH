'use client';
import React, { useState, useEffect } from 'react';
import { Plane, Droplets, CheckCircle2, ShieldCheck, X, Volume2, BatteryCharging, Radio, Navigation2 } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useAppStore } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

interface QuickSprayModalProps {
  isOpen: boolean;
  onClose: () => void;
  targetField?: string;
  targetDisease?: string;
  recommendedMedicine?: string;
}

export function QuickSprayModal({
  isOpen,
  onClose,
  targetField = 'Soybean East Field · Sector B-3',
  targetDisease = 'Charcoal Rot',
  recommendedMedicine = 'Trichoderma viride bio-fungicide (1.4L spray mix)'
}: QuickSprayModalProps) {
  const { t } = useTranslation();
  const { language } = useAppStore();
  const [step, setStep] = useState<'ready' | 'launching' | 'dispatched'>('ready');
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    if (!isOpen) {
      setStep('ready');
      setCountdown(3);
      stopSpeaking();
    } else {
      // Audio narration for farmers
      const narrationText = language === 'mr'
        ? `लक्ष द्या शेतकरी बांधवांनो. ${targetDisease} नियंत्रणासाठी ड्रोन फवारणी तयार आहे. औषध: ${recommendedMedicine}. फवारणी सुरू करण्यासाठी खालील हिरवे बटण दाबा.`
        : language === 'hi'
        ? `किसान भाई ध्यान दें। ${targetDisease} नियंत्रण के लिए ड्रोन छिड़काव तैयार है। दवा: ${recommendedMedicine}। छिड़काव शुरू करने के लिए नीचे हरा बटन दबाएं।`
        : `Attention farmer. Automated drone spray ready for ${targetDisease}. Bio-agent: ${recommendedMedicine}. Tap green button to launch flight.`;
      
      speakText(narrationText, language);
    }
  }, [isOpen, targetDisease, recommendedMedicine, language]);

  if (!isOpen) return null;

  const handleLaunch = () => {
    setStep('launching');
    let timer = 3;
    const interval = setInterval(() => {
      timer -= 1;
      setCountdown(timer);
      if (timer <= 0) {
        clearInterval(interval);
        setStep('dispatched');
        const successSpeech = language === 'mr'
          ? 'ड्रोन उड्डाण सुरू झाले आहे. शेतात अचूक फवारणी होत आहे.'
          : language === 'hi'
          ? 'ड्रोन ने उड़ान भर ली है। खेत में सटीक छिड़काव शुरू हो चुका है।'
          : 'Drone launched successfully. Precision spraying in progress.';
        speakText(successSpeech, language);
      }
    }, 900);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-[var(--surface)] border-2 border-[var(--accent)] rounded-3xl p-6 shadow-2xl font-sans transition-colors">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[var(--surface-2)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header with Big Friendly Farmer Symbols */}
        <div className="flex items-center gap-3.5 pb-4 border-b border-[var(--border)]">
          <div className="p-3.5 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
            <Droplets className="w-7 h-7 animate-bounce" />
          </div>
          <div>
            <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 text-[10px] font-mono font-extrabold uppercase">
              1-Tap Autonomous Sprayer
            </span>
            <h2 className="text-xl font-bold text-[var(--text-primary)] mt-0.5">
              {language === 'mr' ? 'त्वरित ड्रोन फवारणी मदत' : language === 'hi' ? 'त्वरित ड्रोन छिड़काव मिशन' : 'Instant Drone Sprayer'}
            </h2>
          </div>
        </div>

        {/* Step: Ready to Launch */}
        {step === 'ready' && (
          <div className="space-y-4 pt-5">
            {/* Visual Action Banner for illiterate farmer */}
            <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
              <Volume2 className="w-5 h-5 text-[var(--accent)] shrink-0 mt-0.5 animate-pulse" />
              <div>
                <p className="text-sm font-bold text-[var(--text-primary)]">
                  {language === 'mr' ? 'पिकावरील रोग निवारण' : language === 'hi' ? 'फसल रोग नियंत्रण' : 'Target Crop Intervention'}
                </p>
                <p className="text-xs text-[var(--text-secondary)] mt-1 leading-relaxed">
                  {targetField} • <span className="font-bold text-red-600 dark:text-red-400">{targetDisease}</span>
                </p>
              </div>
            </div>

            {/* Drone Payload Details */}
            <div className="grid grid-cols-3 gap-2.5 text-center">
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <Droplets className="w-4 h-4 text-blue-500 mx-auto mb-1" />
                <div className="text-[10px] text-[var(--text-muted)] font-mono font-semibold">Payload</div>
                <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">1.4 Liters</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <BatteryCharging className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
                <div className="text-[10px] text-[var(--text-muted)] font-mono font-semibold">Battery</div>
                <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">12% Required</div>
              </div>
              <div className="p-3 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
                <Radio className="w-4 h-4 text-purple-500 mx-auto mb-1" />
                <div className="text-[10px] text-[var(--text-muted)] font-mono font-semibold">RTK Lock</div>
                <div className="text-xs font-bold text-[var(--text-primary)] mt-0.5">1.2 cm 4D</div>
              </div>
            </div>

            {/* Medicine Box with Big Readable Type */}
            <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)]">
              <span className="text-[10px] font-mono uppercase font-bold text-[var(--text-muted)] block mb-1">
                {language === 'mr' ? 'शिफारस केलेले औषध' : language === 'hi' ? 'अनुशंसित जैव-दवा' : 'Prescribed Bio-Fungicide'}:
              </span>
              <p className="text-sm font-bold text-[var(--text-primary)]">
                {recommendedMedicine}
              </p>
            </div>

            {/* BIG GREEN BUTTON FOR FARMER */}
            <button
              onClick={handleLaunch}
              className="w-full py-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-3 transition-all transform active:scale-95"
            >
              <Plane className="w-6 h-6" />
              <span>
                {language === 'mr' ? '🚀 फवारणी सुरू करा (फ्लाय ड्रोन)' : language === 'hi' ? '🚀 छिड़काव शुरू करें (फ्लाई ड्रोन)' : '🚀 Launch Drone Spray Now'}
              </span>
            </button>
          </div>
        )}

        {/* Step: Launching Countdown */}
        {step === 'launching' && (
          <div className="py-12 text-center space-y-4">
            <div className="w-20 h-20 rounded-full border-4 border-amber-500 border-t-transparent animate-spin mx-auto flex items-center justify-center text-3xl font-bold font-mono text-[var(--accent)]">
              {countdown}
            </div>
            <h3 className="text-lg font-bold text-[var(--text-primary)]">
              {language === 'mr' ? 'ड्रोन मोटर्स सुरू होत आहेत...' : language === 'hi' ? 'ड्रोन मोटर्स शुरू हो रही हैं...' : 'Spinning 8x Brushless Motors...'}
            </h3>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              Calibrating ultrasonic flow rate nozzles at 21.0250°N, 79.0350°E
            </p>
          </div>
        )}

        {/* Step: Dispatched Success */}
        {step === 'dispatched' && (
          <div className="py-8 text-center space-y-5">
            <div className="w-16 h-16 rounded-full bg-emerald-500/20 border-2 border-emerald-500 text-emerald-600 dark:text-emerald-400 mx-auto flex items-center justify-center animate-bounce">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-emerald-600 dark:text-emerald-400">
                {language === 'mr' ? 'फवारणी यशस्वीरित्या सुरू झाली!' : language === 'hi' ? 'छिड़काव सफलतापूर्वक शुरू हुआ!' : 'Spray Flight Successfully Active!'}
              </h3>
              <p className="text-xs text-[var(--text-secondary)] mt-1.5 leading-relaxed max-w-sm mx-auto">
                {language === 'mr' 
                  ? 'ड्रोन शेतात पोहोचले असून प्रभावित 1.4 हेक्टर भागावर औषध फवारणी सुरू आहे.'
                  : language === 'hi'
                  ? 'ड्रोन खेत में पहुंच चुका है और प्रभावित 1.4 हेक्टेयर क्षेत्र में दवा का छिड़काव जारी है।'
                  : 'Drone has reached Sector B-3 and is executing precision bio-fungicide dispersal.'}
              </p>
            </div>

            <button
              onClick={onClose}
              className="px-6 py-2.5 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] text-xs font-mono font-bold text-[var(--text-primary)] hover:border-[var(--accent)] transition-all"
            >
              {language === 'mr' ? 'पूर्ण झाले (बंद करा)' : language === 'hi' ? 'पूर्ण हुआ (बंद करें)' : 'Mission Tracked (Close)'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
