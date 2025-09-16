import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files (only complete translations)
import en from './locales/en.json';
import nl from './locales/nl.json';
import { detectUserLanguage } from '../utils/languageDetection';

const resources = {
  en: { translation: en },
  nl: { translation: nl },
};

// Initialize i18n with minimal configuration for reliability
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default to English
    fallbackLng: 'en',
    debug: true, // Enable debug to see what's happening
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  })
  .then(() => {
    console.log('i18n initialized successfully');
    console.log('Current language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    console.log('Resources loaded:', Object.keys(resources));
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;
