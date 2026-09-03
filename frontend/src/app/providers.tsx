'use client';
import React, { useEffect, useState } from 'react';
import { I18nextProvider } from 'react-i18next';
import i18n from '@/lib/i18n';
import { useAppStore } from '@/store/useAppStore';
import { useOfflineDetect } from '@/hooks/useOfflineDetect';

export function Providers({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const theme = useAppStore(state => state.theme);

  useOfflineDetect();

  useEffect(() => {
    setMounted(true);

    // Apply theme class on mount and whenever theme changes
    const isDark =
      theme === 'dark' ||
      (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  return (
    <I18nextProvider i18n={i18n}>
      <React.Suspense
        fallback={
          <div className="h-screen w-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-600" />
          </div>
        }
      >
        {/*
          Render children even before mount (avoids SSR/hydration mismatch).
          The style:visibility hidden prevents flash of un-themed content.
        */}
        <div style={mounted ? undefined : { visibility: 'hidden' }}>
          {children}
        </div>
      </React.Suspense>
    </I18nextProvider>
  );
}

