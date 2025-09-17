import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import nl from './locales/nl.json';
import hu from './locales/hu.json';
import ro from './locales/ro.json';
import sv from './locales/sv.json';
import { detectUserLanguage } from '../utils/languageDetection';

const resources = {
  en: { translation: en },
  nl: { translation: nl },
  hu: { translation: hu },
  ro: { translation: ro },
  sv: { translation: sv },
};

// Initialize i18n with FORCED English configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // FORCE English - no detection
    fallbackLng: 'en',
    debug: true, // Enable debug to see what's happening
    
    // DISABLE all language detection
    detection: false,
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },
  })
  .then(() => {
    console.log('i18n initialized successfully');
    console.log('Current language:', i18n.language);
    console.log('Available languages:', i18n.languages);
    console.log('Resources loaded:', Object.keys(resources));
    
    // FORCE ENGLISH - Clear all language preferences
    console.log('FORCING ENGLISH - Clearing all language preferences');
    localStorage.removeItem('preferred-language');
    localStorage.removeItem('i18nextLng');
    i18n.changeLanguage('en');
  })
  .catch((error) => {
    console.error('i18n initialization failed:', error);
  });

export default i18n;
