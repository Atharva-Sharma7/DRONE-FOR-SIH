'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Map,
  Video,
  Microscope,
  BarChart3,
  Layers3,
  Navigation,
  Settings,
  Radio,
  Store,
  FlaskConical,
  Award,
  ShieldAlert,
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const NAV = [
    { href: '/',             icon: LayoutDashboard, title: t('nav.dashboard') },
    { href: '/map',          icon: Map,             title: t('nav.farmMap') },
    { href: '/mandi',        icon: Store,           title: t('nav.mandi') || 'Mandi Bhav' },
    { href: '/crop-doctor',  icon: FlaskConical,    title: t('nav.cropDoctor') || 'Crop Doctor' },
    { href: '/kisan-rakshak', icon: ShieldAlert,    title: t('nav.kisanRakshak') || 'Kisan Rakshak' },
    { href: '/yojna',        icon: Award,           title: t('nav.yojna') || 'Yojna & Claims' },
    { href: '/live-feed',    icon: Video,           title: t('nav.liveFeed') },
    { href: '/diseases',     icon: Microscope,      title: t('nav.diseaseDetections') },
    { href: '/analytics',    icon: BarChart3,       title: t('nav.analytics') },
    { href: '/lidar',        icon: Layers3,         title: t('nav.lidarViewer') },
    { href: '/missions',     icon: Navigation,      title: t('nav.missions') },
  ];

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 flex flex-col transition-colors"
      style={{ width: 58, backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Drone Icon Wordmark */}
      <div className="h-14 flex items-center justify-center border-b border-[var(--border)] flex-shrink-0">
        <DroneIconMark />
      </div>

      {/* Nav Items */}
      <nav className="flex flex-col gap-1.5 p-1.5 flex-1 pt-3">
        {NAV.map(({ href, icon: Icon, title }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={title}
              className={`
                relative flex items-center justify-center w-10 h-10 rounded-xl mx-auto
                transition-all duration-150 group
                ${ active
                  ? 'bg-[var(--surface-2)] text-[var(--accent)] shadow-sm border border-[var(--border)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
                }
              `}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 rounded-r-md"
                  style={{ background: 'var(--accent)', left: -6 }}
                />
              )}
              <Icon className="w-5 h-5" strokeWidth={active ? 2.2 : 1.8} />

              {/* Floating Tooltip with Dynamic Translations */}
              <span className="absolute left-14 px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl font-sans">
                {title}
              </span>
            </Link>
          );
        })}
      </nav>

      {/* Bottom: Settings & Live Telemetry Ping */}
      <div className="p-1.5 pb-4 flex flex-col gap-1.5 border-t border-[var(--border)]">
        <Link
          href="/settings"
          title={t('nav.settings')}
          className={`
            relative flex items-center justify-center w-10 h-10 rounded-xl mx-auto group
            transition-colors
            ${ pathname.startsWith('/settings')
              ? 'bg-[var(--surface-2)] text-[var(--accent)] border border-[var(--border)]'
              : 'text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--surface-2)]'
            }
          `}
        >
          <Settings className="w-5 h-5" strokeWidth={1.8} />
          <span className="absolute left-14 px-2.5 py-1 rounded-md bg-[var(--surface-2)] border border-[var(--border)] text-[var(--text-primary)] text-xs font-semibold whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50 shadow-xl">
            {t('nav.settings')}
          </span>
        </Link>
        <div
          title="RTK Radio Online"
          className="flex items-center justify-center w-10 h-10 mx-auto cursor-pointer"
        >
          <Radio className="w-4 h-4 text-emerald-500 animate-pulse" strokeWidth={2} />
        </div>
      </div>
    </aside>
  );
}

function DroneIconMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#FBBF24" />
      <line x1="12" y1="12" x2="4"  y2="4"  stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="20" y2="4"  stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="4"  y2="20" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <line x1="12" y1="12" x2="20" y2="20" stroke="#64748B" strokeWidth="2" strokeLinecap="round" />
      <circle cx="4"  cy="4"  r="2.5" fill="#22C55E" />
      <circle cx="20" cy="4"  r="2.5" fill="#FBBF24" />
      <circle cx="4"  cy="20" r="2.5" fill="#FBBF24" />
      <circle cx="20" cy="20" r="2.5" fill="#22C55E" />
    </svg>
  );
}
