import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translation files
import en from './locales/en.json';
import hu from './locales/hu.json';
import sv from './locales/sv.json';
import th from './locales/th.json';
import si from './locales/si.json';
import ro from './locales/ro.json';
import de from './locales/de.json';
import fr from './locales/fr.json';
import es from './locales/es.json';
import it from './locales/it.json';
import pl from './locales/pl.json';
import { detectUserLanguage } from '../utils/languageDetection';

const resources = {
  en: { translation: en },
  hu: { translation: hu },
  sv: { translation: sv },
  th: { translation: th },
  si: { translation: si },
  ro: { translation: ro },
  de: { translation: de },
  fr: { translation: fr },
  es: { translation: es },
  it: { translation: it },
  pl: { translation: pl },
};

// Detect the user's preferred language
const detectedLanguage = detectUserLanguage();

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: detectedLanguage,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },

    interpolation: {
      escapeValue: false, // React already does escaping
    },
  });

export default i18n;
