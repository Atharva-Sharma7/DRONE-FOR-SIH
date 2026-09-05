import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { TRANSLATION_RESOURCES } from './translations';

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: TRANSLATION_RESOURCES,
    fallbackLng: 'en',
    supportedLngs: ['en', 'hi', 'mr', 'te', 'ta', 'gu', 'pa'],
    debug: false,
    interpolation: {
      escapeValue: false, 
    },
    react: {
      useSuspense: false,
    }
  });

export default i18n;
