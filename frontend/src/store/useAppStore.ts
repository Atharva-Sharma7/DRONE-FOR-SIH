import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User } from '@/types';

export type AppTheme = 'light' | 'dark' | 'system';
export type AppFontFamily = 'space-grotesk' | 'inter' | 'outfit' | 'ibm-plex';
export type AppFontSize = 'compact' | 'standard' | 'large';
export type AppLanguage = 'en' | 'hi' | 'mr' | 'te' | 'ta' | 'gu' | 'pa';

export interface LanguageOption {
  code: AppLanguage;
  name: string;
  nativeName: string;
}

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी (Hindi)' },
  { code: 'mr', name: 'Marathi', nativeName: 'मराठी (Marathi)' },
  { code: 'te', name: 'Telugu', nativeName: 'తెలుగు (Telugu)' },
  { code: 'ta', name: 'Tamil', nativeName: 'தமிழ் (Tamil)' },
  { code: 'gu', name: 'Gujarati', nativeName: 'ગુજરાતી (Gujarati)' },
  { code: 'pa', name: 'Punjabi', nativeName: 'ਪੰਜਾਬੀ (Punjabi)' },
];

interface AppState {
  user: User | null;
  isAuthenticated: boolean;
  theme: AppTheme;
  language: AppLanguage;
  fontFamily: AppFontFamily;
  fontSize: AppFontSize;
  isOffline: boolean;
  unreadAlertCount: number;
  isSpeaking: boolean;
  setUser: (user: User | null) => void;
  setTheme: (theme: AppTheme) => void;
  setLanguage: (lang: AppLanguage) => void;
  setFontFamily: (font: AppFontFamily) => void;
  setFontSize: (size: AppFontSize) => void;
  setIsSpeaking: (speaking: boolean) => void;
  setOffline: (isOffline: boolean) => void;
  setUnreadAlertCount: (count: number) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      user: null,
      isAuthenticated: false,
      theme: 'dark',
      language: 'en',
      fontFamily: 'space-grotesk',
      fontSize: 'standard',
      isOffline: false,
      unreadAlertCount: 3,
      isSpeaking: false,
      setUser: (user) => set({ user, isAuthenticated: !!user }),
      setTheme: (theme) => set({ theme }),
      setLanguage: (language) => set({ language }),
      setFontFamily: (fontFamily) => set({ fontFamily }),
      setFontSize: (fontSize) => set({ fontSize }),
      setIsSpeaking: (isSpeaking) => set({ isSpeaking }),
      setOffline: (isOffline) => set({ isOffline }),
      setUnreadAlertCount: (count) => set({ unreadAlertCount: count }),
    }),
    {
      name: 'app-storage',
      partialize: (state) => ({ 
        theme: state.theme, 
        language: state.language,
        fontFamily: state.fontFamily,
        fontSize: state.fontSize,
      }),
    }
  )
);
