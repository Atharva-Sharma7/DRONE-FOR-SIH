'use client';
import React from 'react';
import { 
  useAppStore, 
  SUPPORTED_LANGUAGES, 
  AppTheme, 
  AppFontFamily, 
  AppFontSize, 
  AppLanguage 
} from '@/store/useAppStore';
import { useTranslation } from '@/hooks/useTranslation';
import { 
  Sun, 
  Moon, 
  Monitor, 
  Type, 
  Maximize, 
  Globe, 
  Map, 
  Check, 
} from 'lucide-react';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { 
    theme, 
    setTheme, 
    fontFamily, 
    setFontFamily, 
    fontSize, 
    setFontSize, 
    language, 
    setLanguage 
  } = useAppStore();

  const handleLangSelect = (code: AppLanguage) => {
    setLanguage(code);
    i18n.changeLanguage(code);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 font-sans">
      {/* Page Title with Translations */}
      <div>
        <h1 className="text-2xl font-bold text-[var(--text-primary)] tracking-wide">
          {t('settings.title')}
        </h1>
        <p className="text-xs font-mono text-[var(--text-muted)] mt-1">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* SECTION 1: Theme & Display Mode */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-2 rounded-xl bg-amber-500/10 text-[var(--accent)]">
            <Sun className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {t('settings.themeTitle')}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {t('settings.themeDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'light' as AppTheme, title: t('settings.lightMode'), desc: t('settings.lightDesc'), icon: Sun },
            { id: 'dark' as AppTheme, title: t('settings.darkMode'), desc: t('settings.darkDesc'), icon: Moon },
            { id: 'system' as AppTheme, title: t('settings.systemMode'), desc: t('settings.systemDesc'), icon: Monitor },
          ].map((item) => {
            const isSelected = theme === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setTheme(item.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--surface-2)] shadow-md ring-1 ring-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <Icon className={`w-5 h-5 ${isSelected ? 'text-[var(--accent)]' : 'text-[var(--text-muted)]'}`} />
                  {isSelected && <Check className="w-4 h-4 text-[var(--accent)]" />}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{item.title}</h3>
                  <p className="text-[11px] font-mono text-[var(--text-muted)] mt-0.5">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 2: Font Style Selection */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-2 rounded-xl bg-blue-500/10 text-blue-500">
            <Type className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {t('settings.fontStyle')}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {t('settings.fontDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-1">
          {[
            { id: 'space-grotesk' as AppFontFamily, name: 'Space Grotesk', sample: 'Precision Agriculture', desc: 'Technical Modern Sans' },
            { id: 'inter' as AppFontFamily, name: 'Inter UI', sample: 'Precision Agriculture', desc: 'High-Legibility Neutral' },
            { id: 'outfit' as AppFontFamily, name: 'Outfit Geometric', sample: 'Precision Agriculture', desc: 'Clean Modern Curved' },
            { id: 'ibm-plex' as AppFontFamily, name: 'IBM Plex Mono', sample: '21.0250°N 79.0350°E', desc: 'Instrument Monospace' },
          ].map((item) => {
            const isSelected = fontFamily === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFontFamily(item.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--surface-2)] shadow-md ring-1 ring-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{item.name}</span>
                  {isSelected && <Check className="w-4 h-4 text-[var(--accent)]" />}
                </div>
                <div>
                  <div className="text-sm font-bold text-[var(--text-primary)] truncate">{item.sample}</div>
                  <p className="text-[10px] font-mono text-[var(--text-muted)] mt-1">{item.desc}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 3: Font Size Selection */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-2 rounded-xl bg-purple-500/10 text-purple-500">
            <Maximize className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {t('settings.fontSize')}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {t('settings.fontSizeDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
          {[
            { id: 'compact' as AppFontSize, title: t('settings.compactSize'), desc: 'High Information Density' },
            { id: 'standard' as AppFontSize, title: t('settings.standardSize'), desc: 'Balanced For Desktop & Tablets' },
            { id: 'large' as AppFontSize, title: t('settings.largeSize'), desc: 'Optimized For Outdoor Sunlight' },
          ].map((item) => {
            const isSelected = fontSize === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setFontSize(item.id)}
                className={`p-4 rounded-xl border text-left flex flex-col justify-between gap-3 transition-all ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--surface-2)] shadow-md ring-1 ring-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]/60'
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className="text-xs font-bold text-[var(--text-primary)]">{item.title}</span>
                  {isSelected && <Check className="w-4 h-4 text-[var(--accent)]" />}
                </div>
                <p className="text-[11px] font-mono text-[var(--text-muted)]">{item.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 4: Full Names of Regional Languages */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
            <Globe className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {t('settings.languagesTitle')}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              {t('settings.languagesDesc')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
          {SUPPORTED_LANGUAGES.map((item) => {
            const isSelected = (language || i18n.language) === item.code;
            return (
              <button
                key={item.code}
                onClick={() => handleLangSelect(item.code)}
                className={`p-4 rounded-xl border text-left flex items-center justify-between transition-all ${
                  isSelected
                    ? 'border-[var(--accent)] bg-[var(--surface-2)] shadow-md ring-1 ring-[var(--accent)]'
                    : 'border-[var(--border)] bg-[var(--surface)] hover:bg-[var(--surface-2)]/60'
                }`}
              >
                <div>
                  <h3 className="text-sm font-bold text-[var(--text-primary)]">{item.nativeName}</h3>
                  <span className="text-[10px] font-mono text-[var(--text-muted)] uppercase tracking-wider">{item.name}</span>
                </div>
                {isSelected && <Check className="w-4 h-4 text-[var(--accent)] shrink-0" />}
              </button>
            );
          })}
        </div>
      </div>

      {/* SECTION 5: Map Satellite Basemap Defaults */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-3 pb-3 border-b border-[var(--border)]">
          <div className="p-2 rounded-xl bg-amber-500/10 text-[var(--accent)]">
            <Map className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold text-[var(--text-primary)]">
              {t('settings.basemapTitle')}
            </h2>
            <p className="text-xs font-mono text-[var(--text-muted)]">
              21.0250°N, 79.0350°E · Waranga Farmland Sector, Hingna, Nagpur
            </p>
          </div>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface-2)] border border-[var(--border)] flex items-center justify-between text-xs font-mono">
          <div>
            <div className="font-bold text-[var(--text-primary)]">{t('settings.basemapProvider')}</div>
            <div className="text-[11px] text-[var(--text-muted)] mt-0.5">True Satellite Imagery Showing Agricultural Plots (Free, No API Key Required)</div>
          </div>
          <span className="px-2 py-1 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-bold">
            {t('settings.activeSatellite')}
          </span>
        </div>
      </div>
    </div>
  );
}
