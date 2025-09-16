// Country to language mapping
const countryLanguageMap: Record<string, string> = {
  // Belgium (Dutch/Flemish)
  'BE': 'nl',
  // Netherlands
  'NL': 'nl',
  // Default to English for other countries
};

// Browser language to our supported languages mapping
const browserLanguageMap: Record<string, string> = {
  'nl': 'nl',
  'nl-BE': 'nl',
  'nl-NL': 'nl',
  'en': 'en',
  'en-US': 'en',
  'en-GB': 'en',
};

export const detectUserLanguage = async (): Promise<string> => {
  // First, check if user has a saved language preference
  try {
    const savedLanguage = localStorage.getItem('preferred-language');
    if (savedLanguage && ['en', 'nl'].includes(savedLanguage)) {
      return savedLanguage;
    }
  } catch (error) {
    console.warn('Could not access localStorage for language preference:', error);
  }

  // Try to detect from geolocation (if available)
  try {
    // Use a free geolocation API to detect country
    const response = await fetch('https://ipapi.co/json/');
    if (response.ok) {
      const data = await response.json();
      const countryCode = data.country_code;
      if (countryCode && countryLanguageMap[countryCode]) {
        return countryLanguageMap[countryCode];
      }
    }
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
  try {
    localStorage.setItem('preferred-language', language);
  } catch (error) {
    console.warn('Could not save language preference to localStorage:', error);
  }
};

export const getSupportedLanguages = () => [
  { code: 'en', name: 'English', nativeName: 'English' },
  { code: 'nl', name: 'Dutch', nativeName: 'Nederlands' },
];
