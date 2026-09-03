'use client';
import React, { useContext } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, Map as MapIcon, Bug, TrendingUp, Layers3, Plane, Settings, X, WifiOff
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShellContext } from './AppShell';
import { cn } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { useSyncQueue } from '@/hooks/useSyncQueue';

export function Sidebar() {
  const { t } = useTranslation();
  const pathname = usePathname();
  const { isMobileSidebarOpen, setIsMobileSidebarOpen } = useContext(AppShellContext);
  const isOffline = useAppStore(state => state.isOffline);
  const { totalPending } = useSyncQueue();

  const navItems = [
    { href: '/', icon: LayoutDashboard, labelKey: 'nav.dashboard' },
    { href: '/map', icon: MapIcon, labelKey: 'nav.farmMap' },
    { href: '/diseases', icon: Bug, labelKey: 'nav.diseaseDetections' },
    { href: '/analytics', icon: TrendingUp, labelKey: 'nav.analytics' },
    { href: '/lidar', icon: Layers3, labelKey: 'nav.lidarViewer' },
    { href: '/missions', icon: Plane, labelKey: 'nav.missions' },
  ];

  return (
    <>
      {/* Mobile overlay */}
      {isMobileSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}
      
      {/* Sidebar */}
      <div className={cn(
        "fixed md:static inset-y-0 left-0 z-50 w-64 bg-surface border-r border-border transform transition-transform duration-200 ease-in-out flex flex-col",
        isMobileSidebarOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}>
        <div className="flex items-center justify-between h-16 px-6 border-b border-border">
          <Link href="/" className="flex items-center gap-2" onClick={() => setIsMobileSidebarOpen(false)}>
            <span className="text-2xl">🌾</span>
            <span className="font-bold text-xl text-brand-primary">AgriDrone</span>
          </Link>
          <button 
            className="md:hidden text-text-secondary hover:text-text-primary"
            onClick={() => setIsMobileSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 py-6 overflow-y-auto px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href || (item.href !== '/' && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsMobileSidebarOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded-md font-medium transition-colors",
                  isActive 
                    ? "bg-brand-primary/10 text-brand-primary" 
                    : "text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-text-primary"
                )}
              >
                <item.icon className="w-5 h-5" />
                <span>{t(item.labelKey)}</span>
                
                {/* Sync badge on missions tab */}
                {item.href === '/missions' && totalPending > 0 && (
                  <span className="ml-auto bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 text-xs py-0.5 px-2 rounded-full">
                    {totalPending}
                  </span>
                )}
              </Link>
            );
          })}
        </div>

        <div className="p-4 border-t border-border mt-auto">
          {isOffline && (
            <div className="flex items-center gap-2 text-sm text-red-500 mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded-md">
              <WifiOff className="w-4 h-4" />
              <span>{t('common.offline')}</span>
            </div>
          )}
          <Link
            href="/settings"
            onClick={() => setIsMobileSidebarOpen(false)}
            className="flex items-center gap-3 px-3 py-2 text-text-secondary hover:text-text-primary transition-colors"
          >
            <Settings className="w-5 h-5" />
            <span className="font-medium">{t('nav.settings')}</span>
          </Link>
        </div>
      </div>
    </>
  );
}
