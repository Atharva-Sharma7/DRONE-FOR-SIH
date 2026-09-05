'use client';
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useAppStore } from '@/store/useAppStore';
import { useOfflineDetect } from '@/hooks/useOfflineDetect';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore(state => state.theme);
  const fontFamily = useAppStore(state => state.fontFamily);
  const fontSize = useAppStore(state => state.fontSize);
  const language = useAppStore(state => state.language);

  useOfflineDetect();

  useEffect(() => {
    setMounted(true);

    // Apply theme class
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
      document.documentElement.classList.remove('light');
    } else {
      document.documentElement.classList.remove('dark');
      document.documentElement.classList.add('light');
    }

    // Apply font size class
    document.documentElement.classList.remove('font-size-compact', 'font-size-standard', 'font-size-large');
    document.documentElement.classList.add(`font-size-${fontSize || 'standard'}`);

    // Apply font family class
    document.documentElement.classList.remove(
      'font-family-space-grotesk',
      'font-family-inter',
      'font-family-outfit',
      'font-family-ibm-plex'
    );
    document.documentElement.classList.add(`font-family-${fontFamily || 'space-grotesk'}`);

    // Synchronize language if needed
    if (language && i18n.language !== language) {
      i18n.changeLanguage(language);
    }
  }, [theme, fontFamily, fontSize, language]);

  return (
    <I18nextProvider i18n={i18n}>
      <React.Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center bg-[var(--bg)] text-[var(--text-primary)]">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-amber-500" />
          </div>
        }
      >
        <div style={mounted ? undefined : { visibility: 'hidden' }} className={`font-family-${fontFamily || 'space-grotesk'} font-size-${fontSize || 'standard'}`}>
          {children}
        </div>
      </React.Suspense>
    </I18nextProvider>
  );
}
