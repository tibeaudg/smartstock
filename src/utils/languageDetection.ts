// Country to language mapping
const countryLanguageMap: Record<string, string> = {
  // Hungary
  'HU': 'hu',
  // Sweden
  'SE': 'sv',
  // Thailand
  'TH': 'th',
  // Sri Lanka
  'LK': 'si',
  // Romania
  'RO': 'ro',
  // Default to English for other countries
};

// Browser language to our supported languages mapping
const browserLanguageMap: Record<string, string> = {
  'hu': 'hu',
  'hu-HU': 'hu',
  'sv': 'sv',
  'sv-SE': 'sv',
  'th': 'th',
  'th-TH': 'th',
  'si': 'si',
  'si-LK': 'si',
  'ro': 'ro',
  'ro-RO': 'ro',
  'de': 'de',
  'de-DE': 'de',
  'de-AT': 'de',
  'de-CH': 'de',
  'fr': 'fr',
  'fr-FR': 'fr',
  'fr-BE': 'fr',
  'fr-CH': 'fr',
  'es': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  'it': 'it',
  'it-IT': 'it',
  'it-CH': 'it',
  'pl': 'pl',
  'pl-PL': 'pl',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
};

export const detectUserLanguage = (): string => {
  // First, check if user has a saved language preference
  const savedLanguage = localStorage.getItem('preferred-language');
  if (savedLanguage && ['en', 'hu', 'sv', 'th', 'si', 'ro', 'de', 'fr', 'es', 'it', 'pl'].includes(savedLanguage)) {
    return savedLanguage;
  }

  // Try to detect from geolocation (if available)
  try {
    // This would require a geolocation API call in a real implementation
    // For now, we'll use browser language detection
  } catch (error) {
    console.log('Geolocation detection not available');
  }

  // Fall back to browser language detection
  const browserLanguage = navigator.language || navigator.languages?.[0] || 'en';
  
  // Check if browser language is directly supported
  if (browserLanguageMap[browserLanguage]) {
    return browserLanguageMap[browserLanguage];
  }

  // Check if any of the user's preferred languages are supported
  if (navigator.languages) {
    for (const lang of navigator.languages) {
      if (browserLanguageMap[lang]) {
        return browserLanguageMap[lang];
      }
    }
  }

  // Default to English
  return 'en';
};

export const saveLanguagePreference = (language: string): void => {
  localStorage.setItem('preferred-language', language);
};

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'de', name: 'German', nativeName: 'Deutsch' },
  { code: 'fr', name: 'French', nativeName: 'Français' },
  { code: 'es', name: 'Spanish', nativeName: 'Español' },
  { code: 'it', name: 'Italian', nativeName: 'Italiano' },
  { code: 'pl', name: 'Polish', nativeName: 'Polski' },
  { code: 'hu', name: 'Hungarian', nativeName: 'Magyar' },
  { code: 'sv', name: 'Swedish', nativeName: 'Svenska' },
  { code: 'th', name: 'Thai', nativeName: 'ไทย' },
  { code: 'si', name: 'Sinhala', nativeName: 'සිංහල' },
  { code: 'ro', name: 'Romanian', nativeName: 'Română' },
];
