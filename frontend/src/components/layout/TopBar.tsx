'use client';
import React, { useContext } from 'react';
import { Menu, RefreshCw, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShellContext } from './AppShell';
import { useAppStore } from '@/store/useAppStore';

export function TopBar() {
  const { i18n } = useTranslation();
  const { setIsMobileSidebarOpen } = useContext(AppShellContext);
  const { isOffline } = useAppStore();

  return (
    <header
      className="h-14 flex items-center justify-between px-5 flex-shrink-0"
      style={{ borderBottom: '1px solid var(--border)', backgroundColor: 'var(--surface)' }}
    >
      {/* Left: mobile menu + farm identity */}
      <div className="flex items-center gap-4">
        <button
          className="md:hidden text-[var(--text-muted)]"
          onClick={() => setIsMobileSidebarOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <div>
          <p className="text-sm font-semibold leading-none text-[var(--text-primary)]">Patil Sheti</p>
          <p
            className="text-[11px] leading-none mt-0.5 font-mono"
            style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            21.1458°N 79.0530°E · Waranga, Nagpur
          </p>
        </div>
      </div>

      {/* Right: status + lang */}
      <div className="flex items-center gap-4">
        {/* Sync / offline status */}
        <div className="flex items-center gap-1.5">
          <span
            className="w-1.5 h-1.5 rounded-full flex-shrink-0"
            style={{ background: isOffline ? 'var(--rust)' : 'var(--green)' }}
          />
          <span
            className="text-[11px] hidden sm:inline"
            style={{ color: 'var(--text-muted)', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            {isOffline ? 'offline' : 'synced'}
          </span>
        </div>

        {/* Language */}
        <div className="flex items-center gap-1">
          <Globe className="w-3.5 h-3.5" style={{ color: 'var(--text-muted)' }} />
          <select
            value={i18n.language}
            onChange={e => i18n.changeLanguage(e.target.value)}
            className="bg-transparent text-[11px] outline-none border-none cursor-pointer appearance-none pr-3"
            style={{ color: 'var(--text-secondary)', fontFamily: 'IBM Plex Mono, monospace' }}
          >
            <option value="en">en</option>
            <option value="hi">हिं</option>
            <option value="mr">मर</option>
          </select>
        </div>
      </div>
    </header>
  );
}
