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

// Initialize i18n with a simple, reliable configuration
i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default to English
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    interpolation: {
      escapeValue: false, // React already does escaping
    },

    // Ensure proper loading of resources
    load: 'languageOnly',
    
    // Add fallback for missing translations
    fallbackLng: {
      'en': ['en'],
      'nl': ['nl', 'en'],
      'default': ['en']
    },
    
    // Add error handling for language changes
    missingKeyHandler: (lng, ns, key) => {
      console.warn(`Missing translation key: ${key} for language: ${lng}`);
    },
  });

// Initialize language detection after i18n is ready
i18n.on('initialized', () => {
  detectUserLanguage()
    .then((detectedLanguage) => {
      if (detectedLanguage && detectedLanguage !== i18n.language) {
        i18n.changeLanguage(detectedLanguage);
      }
    })
    .catch((error) => {
      console.error('Error detecting or changing language:', error);
      // Fallback to English if detection fails
      i18n.changeLanguage('en');
    });
});

export default i18n;
