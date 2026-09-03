import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi' | 'mr';
  isOffline: boolean;
  unreadAlertCount: number;
  setUser: (user: User | null) => void;
  setTheme: (theme: 'light' | 'dark' | 'system') => void;
  setLanguage: (lang: 'en' | 'hi' | 'mr') => void;
  setOffline: (isOffline: boolean) => void;
  setUnreadAlertCount: (count: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      theme: 'system',
      language: 'en',
      isOffline: false,
      unreadAlertCount: 0,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setOffline: (isOffline) => set({ isOffline }),
      setUnreadAlertCount: (count) => set({ unreadAlertCount: count }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ theme: state.theme, language: state.language }),
    }
  )
);
