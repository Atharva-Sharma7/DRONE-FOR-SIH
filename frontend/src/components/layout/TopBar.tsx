'use client';
import React, { useContext } from 'react';
import { Menu, Bell, Sun, Moon, Globe } from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { AppShellContext } from './AppShell';
import { useAppStore } from '@/store/useAppStore';

export function TopBar() {
  const { t, i18n } = useTranslation();
  const { setIsMobileSidebarOpen } = useContext(AppShellContext);
  const { theme, setTheme, unreadAlertCount } = useAppStore();

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const changeLanguage = (e: React.ChangeEvent<HTMLSelectElement>) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="h-16 border-b border-border bg-surface flex items-center justify-between px-4 md:px-6 z-10 shrink-0">
      <div className="flex items-center gap-4">
        <button 
          className="md:hidden text-text-secondary hover:text-text-primary"
          onClick={() => setIsMobileSidebarOpen(true)}
        >
          <Menu className="w-6 h-6" />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-sm font-semibold text-text-primary">Patil Sheti</h2>
          <p className="text-xs text-text-secondary">Waranga, Maharashtra</p>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {/* Language Switcher */}
        <div className="flex items-center gap-1 text-sm bg-gray-100 dark:bg-gray-800 rounded-md px-2 py-1 border border-border">
          <Globe className="w-4 h-4 text-text-secondary" />
          <select 
            value={i18n.language} 
            onChange={changeLanguage}
            className="bg-transparent text-text-primary outline-none border-none cursor-pointer appearance-none pr-4"
          >
            <option value="en">EN</option>
            <option value="hi">हिं</option>
            <option value="mr">मर</option>
          </select>
        </div>

        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="p-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors"
        >
          {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Alerts */}
        <button className="p-2 text-text-secondary hover:bg-gray-100 dark:hover:bg-gray-800 rounded-full transition-colors relative">
          <Bell className="w-5 h-5" />
          {unreadAlertCount > 0 && (
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border border-surface"></span>
          )}
        </button>
        
        {/* Profile Avatar */}
        <div className="w-8 h-8 bg-brand-primary text-white rounded-full flex items-center justify-center font-semibold text-sm ml-2 cursor-pointer">
          P
        </div>
      </div>
    </header>
  );
}
