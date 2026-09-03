'use client';
import React, { useState, createContext } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './Sidebar';
import { TopBar } from './TopBar';

interface AppShellContextType {
  isMobileSidebarOpen: boolean;
  setIsMobileSidebarOpen: (isOpen: boolean) => void;
}

export const AppShellContext = createContext<AppShellContextType>({
  isMobileSidebarOpen: false,
  setIsMobileSidebarOpen: () => {},
});

/** Pages that should NOT render the sidebar/topbar shell */
const AUTH_ROUTES = ['/login'];

export function AppShell({ children }: { children: React.ReactNode }) {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const pathname = usePathname();

  const isAuthRoute = AUTH_ROUTES.some(r => pathname?.startsWith(r));

  if (isAuthRoute) {
    return <>{children}</>;
  }

  return (
    <AppShellContext.Provider value={{ isMobileSidebarOpen, setIsMobileSidebarOpen }}>
      <div className="flex h-screen bg-[var(--background)] text-[var(--text-primary)] overflow-hidden">
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <TopBar />
          <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
            <div className="mx-auto max-w-7xl h-full">
              {children}
            </div>
          </main>
        </div>
      </div>
    </AppShellContext.Provider>
  );
}

