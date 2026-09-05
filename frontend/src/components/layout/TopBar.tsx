'use client';
import React, { useContext } from 'react';
import { Menu, Globe, Sun, Moon, Volume2, VolumeX, Sparkles, Sprout, Microscope } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShellContext } from './AppShell';
import { useAppStore, SUPPORTED_LANGUAGES, AppLanguage } from '@/store/useAppStore';
import { speakText, stopSpeaking } from '@/lib/speech';

export function TopBar() {
  const { t, i18n } = useTranslation();
  const { setIsMobileSidebarOpen } = useContext(AppShellContext);
  const { 
    isOffline, 
    theme, 
    setTheme, 
    language, 
    setLanguage, 
    appMode, 
    setAppMode, 
    isSpeaking, 
    setIsSpeaking 
  } = useAppStore();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const toggleAppMode = () => {
    const nextMode = appMode === 'farmer' ? 'judge' : 'farmer';
    setAppMode(nextMode);
  };

  const handleVoiceAdvisory = () => {
    if (isSpeaking) {
      stopSpeaking();
      setIsSpeaking(false);
    } else {
      setIsSpeaking(true);
      const advisory = language === 'mr'
        ? 'वारंगा शेतकरी स्वागत आहे. शेतात एकूण पिकाचे आरोग्य ७८ टक्के आहे. सोयाबीन पूर्व भागात कोळशी रोगाचा प्रादुर्भाव आढळला आहे. तात्काळ जैविक फवारणी सुरू करा.'
        : language === 'hi'
        ? 'वारंगा किसान आपका स्वागत है। खेत में फसल का स्वास्थ्य ७८ प्रतिशत है। सोयाबीन पूर्व क्षेत्र में चारकोल रॉट का प्रकोप पाया गया है। कृपया तुरंत जैविक छिड़काव करें।'
        : 'Welcome to Waranga Agri Platform. Overall crop health is 78 percent. Severe charcoal rot detected in Soybean East field. Immediate bio-fungicide spot spray is recommended.';

      speakText(
        advisory,
        language,
        () => setIsSpeaking(true),
        () => setIsSpeaking(false)
      );
    }
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as AppLanguage;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-4 sm:px-5 flex-shrink-0 z-30 transition-colors"
      style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
    >
      {/* Left: mobile menu + farm identity in Title Case */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-[var(--text-primary)] hover:text-[var(--accent)] p-1 rounded-md"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <p className="text-sm font-bold leading-none text-[var(--text-primary)] tracking-wide">
            Patil Sheti Agro Platform
          </p>
          <p
            className="text-[11px] leading-none mt-1 font-mono font-medium"
            style={{ color: 'var(--text-muted)' }}
          >
            21.0250°N, 79.0350°E · Waranga Farmland Sector, Hingna, Nagpur
          </p>
        </div>
      </div>

      {/* Right: Mode Switch + Voice Advisory + Theme Toggle + Language Dropdown + Status */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Farmer vs Judge Dual Mode Switcher */}
        <button
          onClick={toggleAppMode}
          title={appMode === 'farmer' ? 'Switch To SIH Technical Judge Mode' : 'Switch To Farmer Simple Mode'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            appMode === 'farmer'
              ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/25'
              : 'bg-amber-500/15 border-amber-500/40 text-amber-700 dark:text-amber-300 hover:bg-amber-500/25'
          }`}
        >
          {appMode === 'farmer' ? (
            <>
              <Sprout className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span className="font-mono hidden sm:inline">{t('topbar.farmerMode', { defaultValue: '🌾 Farmer Mode' })}</span>
              <span className="font-mono sm:hidden">🌾</span>
            </>
          ) : (
            <>
              <Microscope className="w-4 h-4 text-amber-500" />
              <span className="font-mono hidden sm:inline">{t('topbar.judgeMode', { defaultValue: '🔬 Judge Mode' })}</span>
              <span className="font-mono sm:hidden">🔬</span>
            </>
          )}
        </button>

        {/* Global Voice Advisory Button (for illiterate farmers) */}
        <button
          onClick={handleVoiceAdvisory}
          title={isSpeaking ? 'Stop Voice Narration' : 'Listen To Farm Advisory In Regional Language'}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition-all shadow-sm ${
            isSpeaking
              ? 'bg-red-500 text-white border-red-600 animate-pulse shadow-red-500/30'
              : 'bg-[var(--accent)] text-black border-[var(--accent)] hover:bg-amber-500'
          }`}
        >
          {isSpeaking ? (
            <>
              <VolumeX className="w-4 h-4" />
              <span className="font-mono hidden sm:inline">{t('topbar.stopSpeaking', { defaultValue: 'Stop' })}</span>
            </>
          ) : (
            <>
              <Volume2 className="w-4 h-4" />
              <span className="font-mono hidden sm:inline">{t('topbar.listenAdvisory', { defaultValue: '🔊 Listen' })}</span>
            </>
          )}
        </button>

        {/* Offline / Online Synced Indicator */}
        <div className="hidden lg:flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: isOffline ? 'var(--rust)' : 'var(--green)' }}
          />
          <span
            className="text-[11px] font-mono font-semibold text-[var(--text-primary)] uppercase"
          >
            {isOffline ? t('common.offline') : t('common.online')}
          </span>
        </div>

        {/* Theme Toggle Button (Light / Dark) */}
        <button
          onClick={toggleTheme}
          title={theme === 'dark' ? 'Switch To Light Mode' : 'Switch To Dark Mode'}
          className="p-2 rounded-lg bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] hover:border-[var(--accent)] transition-all flex items-center gap-1.5 text-xs font-mono"
        >
          {theme === 'dark' ? (
            <>
              <Sun className="w-4 h-4 text-amber-400" />
              <span className="hidden md:inline font-semibold">Light</span>
            </>
          ) : (
            <>
              <Moon className="w-4 h-4 text-indigo-600" />
              <span className="hidden md:inline font-semibold">Dark</span>
            </>
          )}
        </button>

        {/* Language Selection with Full Language Names */}
        <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[var(--surface-2)] border border-[var(--border)]">
          <Globe className="w-3.5 h-3.5 text-[var(--accent)]" />
          <select
            value={language || i18n.language}
            onChange={handleLanguageChange}
            className="bg-transparent text-xs font-medium outline-none border-none cursor-pointer text-[var(--text-primary)] font-sans pr-1"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option 
                key={lang.code} 
                value={lang.code} 
                className="bg-[var(--surface)] text-[var(--text-primary)]"
              >
                {lang.nativeName}
              </option>
            ))}
          </select>
        </div>
      </div>
    </header>
  );
}
