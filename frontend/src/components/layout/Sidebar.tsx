'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Map, Microscope, BarChart3,
  Layers3, Navigation, Settings, Radio
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';

const NAV = [
  { href: '/',          icon: LayoutDashboard, key: 'nav.dashboard' },
  { href: '/map',       icon: Map,             key: 'nav.farmMap' },
  { href: '/diseases',  icon: Microscope,      key: 'nav.diseaseDetections' },
  { href: '/analytics', icon: BarChart3,       key: 'nav.analytics' },
  { href: '/lidar',     icon: Layers3,         key: 'nav.lidarViewer' },
  { href: '/missions',  icon: Navigation,      key: 'nav.missions' },
];

export function Sidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  return (
    <aside
      className="fixed left-0 top-0 bottom-0 z-30 flex flex-col"
      style={{ width: 56, backgroundColor: 'var(--surface)', borderRight: '1px solid var(--border)' }}
    >
      {/* Drone icon wordmark */}
      <div className="h-14 flex items-center justify-center border-b border-[var(--border)] flex-shrink-0">
        <DroneIconMark />
      </div>

      {/* Nav items */}
      <nav className="flex flex-col gap-1 p-1.5 flex-1 pt-3">
        {NAV.map(({ href, icon: Icon, key }) => {
          const active = href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              title={t(key)}
              className={`
                relative flex items-center justify-center w-9 h-9 rounded-lg mx-auto
                transition-colors duration-150 group
                ${ active
                  ? 'bg-[var(--surface-2)] text-[var(--text-primary)]'
                  : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-2)]'
                }
              `}
            >
              {active && (
                <span
                  className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-r"
                  style={{ background: 'var(--accent)', left: -6 }}
                />
              )}
              <Icon className="w-4 h-4" strokeWidth={active ? 2 : 1.5} />
            </Link>
          );
        })}
      </nav>

      {/* Bottom: live telemetry indicator */}
      <div className="p-1.5 pb-4 flex flex-col gap-1">
        <Link
          href="/settings"
          title={t('nav.settings')}
          className="flex items-center justify-center w-9 h-9 rounded-lg mx-auto text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--surface-2)] transition-colors"
        >
          <Settings className="w-4 h-4" strokeWidth={1.5} />
        </Link>
        <div
          title="Drone telemetry active"
          className="flex items-center justify-center w-9 h-9 mx-auto"
        >
          <Radio className="w-3.5 h-3.5" style={{ color: 'var(--green)' }} strokeWidth={1.5} />
        </div>
      </div>
    </aside>
  );
}

/* Small drone SVG for sidebar wordmark */
function DroneIconMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Body */}
      <rect x="9" y="9" width="6" height="6" rx="1.5" fill="#E8C84A" />
      {/* Arms */}
      <line x1="12" y1="12" x2="4"  y2="4"  stroke="#5C5748" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="20" y2="4"  stroke="#5C5748" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="4"  y2="20" stroke="#5C5748" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="12" y1="12" x2="20" y2="20" stroke="#5C5748" strokeWidth="1.5" strokeLinecap="round" />
      {/* Rotor hubs */}
      <circle cx="4"  cy="4"  r="2.5" fill="#2E2D22" stroke="#3A3928" strokeWidth="1" />
      <circle cx="20" cy="4"  r="2.5" fill="#2E2D22" stroke="#3A3928" strokeWidth="1" />
      <circle cx="4"  cy="20" r="2.5" fill="#2E2D22" stroke="#3A3928" strokeWidth="1" />
      <circle cx="20" cy="20" r="2.5" fill="#2E2D22" stroke="#3A3928" strokeWidth="1" />
    </svg>
  );
}
