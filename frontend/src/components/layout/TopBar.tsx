'use client';
import React, { useContext } from 'react';
import { Menu, Globe, Sun, Moon } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShellContext } from './AppShell';
import { useAppStore, SUPPORTED_LANGUAGES, AppLanguage } from '@/store/useAppStore';

export function TopBar() {
  const { t, i18n } = useTranslation();
  const { setIsMobileSidebarOpen } = useContext(AppShellContext);
  const { isOffline, theme, setTheme, language, setLanguage } = useAppStore();

  const toggleTheme = () => {
    const nextTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newLang = e.target.value as AppLanguage;
    setLanguage(newLang);
    i18n.changeLanguage(newLang);
  };

  return (
    <header
      className="h-14 flex items-center justify-between px-5 flex-shrink-0 z-30 transition-colors"
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

      {/* Right: Theme Toggle + Language Dropdown + Status */}
      <div className="flex items-center gap-3 sm:gap-4">
        {/* Offline / Online Synced Indicator */}
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-[var(--surface-2)] border border-[var(--border)]">
          <span
            className="w-2 h-2 rounded-full flex-shrink-0 animate-pulse"
            style={{ background: isOffline ? 'var(--rust)' : 'var(--green)' }}
          />
          <span
            className="text-[11px] font-mono font-semibold hidden sm:inline text-[var(--text-primary)] uppercase"
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
