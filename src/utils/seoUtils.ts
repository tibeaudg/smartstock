// International SEO utilities and keyword mappings

export interface CountrySEO {
  country: string;
  language: string;
  currency: string;
  keywords: string[];
  wmsKeywords: string[];
  localTerms: string[];
  geoPosition: {
    lat: number;
    lng: number;
  };
  timezone: string;
}

export const countrySEOMap: Record<string, CountrySEO> = {
  // Hungary
  hu: {
    country: 'Hungary',
    language: 'hu',
    currency: 'HUF',
    keywords: [
      'raktárkezelés',
      'készletkezelés',
      'raktárkezelő szoftver',
      'készletkezelő program',
      'raktárkezelő rendszer',
      'készletkezelő rendszer',
      'raktárkezelő alkalmazás',
      'készletkezelő alkalmazás',
      'raktárkezelő platform',
      'készletkezelő platform'
    ],
    wmsKeywords: [
      'WMS szoftver',
      'raktárkezelő rendszer',
      'raktárkezelő szoftver',
      'raktárkezelő platform',
      'raktárkezelő alkalmazás',
      'raktárkezelő megoldás',
      'raktárkezelő eszköz',
      'raktárkezelő szolgáltatás',
      'raktárkezelő rendszer szoftver',
      'raktárkezelő rendszer platform'
    ],
    localTerms: [
      'magyar raktárkezelés',
      'magyar készletkezelés',
      'magyar raktárkezelő szoftver',
      'magyar készletkezelő program',
      'magyar raktárkezelő rendszer',
      'magyar készletkezelő rendszer',
      'magyar raktárkezelő alkalmazás',
      'magyar készletkezelő alkalmazás',
      'magyar raktárkezelő platform',
      'magyar készletkezelő platform'
    ],
    geoPosition: { lat: 47.1625, lng: 19.5033 },
    timezone: 'Europe/Budapest'
  },

  // Sweden
  sv: {
    country: 'Sweden',
    language: 'sv',
    currency: 'SEK',
    keywords: [
      'lagerhantering',
      'lagerhanteringssystem',
      'lagerhanteringsprogram',
      'lagerhanteringsplattform',
      'lagerhanteringsapp',
      'lagerhanteringslösning',
      'lagerhanteringsverktyg',
      'lagerhanteringsservice',
      'lagerhanteringssystem programvara',
      'lagerhanteringssystem plattform'
    ],
    wmsKeywords: [
      'WMS programvara',
      'lagerhanteringssystem',
      'lagerhanteringsprogram',
      'lagerhanteringsplattform',
      'lagerhanteringsapp',
      'lagerhanteringslösning',
      'lagerhanteringsverktyg',
      'lagerhanteringsservice',
      'lagerhanteringssystem programvara',
      'lagerhanteringssystem plattform'
    ],
    localTerms: [
      'svensk lagerhantering',
      'svensk lagerhanteringssystem',
      'svensk lagerhanteringsprogram',
      'svensk lagerhanteringsplattform',
      'svensk lagerhanteringsapp',
      'svensk lagerhanteringslösning',
      'svensk lagerhanteringsverktyg',
      'svensk lagerhanteringsservice',
      'svensk lagerhanteringssystem programvara',
      'svensk lagerhanteringssystem plattform'
    ],
    geoPosition: { lat: 59.3293, lng: 18.0686 },
    timezone: 'Europe/Stockholm'
  },

  // Thailand
  th: {
    country: 'Thailand',
    language: 'th',
    currency: 'THB',
    keywords: [
      'ระบบจัดการคลังสินค้า',
      'ระบบจัดการสต็อก',
      'ซอฟต์แวร์จัดการคลังสินค้า',
      'โปรแกรมจัดการสต็อก',
      'แพลตฟอร์มจัดการคลังสินค้า',
      'แอปจัดการสต็อก',
      'โซลูชันจัดการคลังสินค้า',
      'เครื่องมือจัดการสต็อก',
      'บริการจัดการคลังสินค้า',
      'ระบบจัดการคลังสินค้าซอฟต์แวร์'
    ],
    wmsKeywords: [
      'ซอฟต์แวร์ WMS',
      'ระบบจัดการคลังสินค้า',
      'ซอฟต์แวร์จัดการคลังสินค้า',
      'แพลตฟอร์มจัดการคลังสินค้า',
      'แอปจัดการคลังสินค้า',
      'โซลูชันจัดการคลังสินค้า',
      'เครื่องมือจัดการคลังสินค้า',
      'บริการจัดการคลังสินค้า',
      'ระบบจัดการคลังสินค้าซอฟต์แวร์',
      'แพลตฟอร์มจัดการคลังสินค้า'
    ],
    localTerms: [
      'ไทยระบบจัดการคลังสินค้า',
      'ไทยระบบจัดการสต็อก',
      'ไทยซอฟต์แวร์จัดการคลังสินค้า',
      'ไทยโปรแกรมจัดการสต็อก',
      'ไทยแพลตฟอร์มจัดการคลังสินค้า',
      'ไทยแอปจัดการสต็อก',
      'ไทยโซลูชันจัดการคลังสินค้า',
      'ไทยเครื่องมือจัดการสต็อก',
      'ไทยบริการจัดการคลังสินค้า',
      'ไทยระบบจัดการคลังสินค้าซอฟต์แวร์'
    ],
    geoPosition: { lat: 13.7563, lng: 100.5018 },
    timezone: 'Asia/Bangkok'
  },

  // Sri Lanka (Sinhala)
  si: {
    country: 'Sri Lanka',
    language: 'si',
    currency: 'LKR',
    keywords: [
      'ගබඩා කළමනාකරණය',
      'ඉඩම් කළමනාකරණය',
      'ගබඩා කළමනාකරණ මෘදුකාංග',
      'ඉඩම් කළමනාකරණ වැඩසටහන',
      'ගබඩා කළමනාකරණ වේදිකාව',
      'ඉඩම් කළමනාකරණ යෙදුම',
      'ගබඩා කළමනාකරණ විසඳුම',
      'ඉඩම් කළමනාකරණ මෙවලම්',
      'ගබඩා කළමනාකරණ සේවාව',
      'ගබඩා කළමනාකරණ පද්ධති මෘදුකාංග'
    ],
    wmsKeywords: [
      'WMS මෘදුකාංග',
      'ගබඩා කළමනාකරණ පද්ධතිය',
      'ගබඩා කළමනාකරණ මෘදුකාංග',
      'ගබඩා කළමනාකරණ වේදිකාව',
      'ගබඩා කළමනාකරණ යෙදුම',
      'ගබඩා කළමනාකරණ විසඳුම',
      'ගබඩා කළමනාකරණ මෙවලම්',
      'ගබඩා කළමනාකරණ සේවාව',
      'ගබඩා කළමනාකරණ පද්ධති මෘදුකාංග',
      'ගබඩා කළමනාකරණ පද්ධති වේදිකාව'
    ],
    localTerms: [
      'ශ්‍රී ලාංකික ගබඩා කළමනාකරණය',
      'ශ්‍රී ලාංකික ඉඩම් කළමනාකරණය',
      'ශ්‍රී ලාංකික ගබඩා කළමනාකරණ මෘදුකාංග',
      'ශ්‍රී ලාංකික ඉඩම් කළමනාකරණ වැඩසටහන',
      'ශ්‍රී ලාංකික ගබඩා කළමනාකරණ වේදිකාව',
      'ශ්‍රී ලාංකික ඉඩම් කළමනාකරණ යෙදුම',
      'ශ්‍රී ලාංකික ගබඩා කළමනාකරණ විසඳුම',
      'ශ්‍රී ලාංකික ඉඩම් කළමනාකරණ මෙවලම්',
      'ශ්‍රී ලාංකික ගබඩා කළමනාකරණ සේවාව',
      'ශ්‍රී ලාංකික ගබඩා කළමනාකරණ පද්ධති මෘදුකාංග'
    ],
    geoPosition: { lat: 6.9271, lng: 79.8612 },
    timezone: 'Asia/Colombo'
  },

  // Romania
  ro: {
    country: 'Romania',
    language: 'ro',
    currency: 'RON',
    keywords: [
      'gestionarea depozitului',
      'gestionarea stocurilor',
      'software gestionare depozit',
      'program gestionare stocuri',
      'platforma gestionare depozit',
      'aplicatie gestionare stocuri',
      'solutie gestionare depozit',
      'instrumente gestionare stocuri',
      'serviciu gestionare depozit',
      'sistem gestionare depozit software'
    ],
    wmsKeywords: [
      'software WMS',
      'sistem gestionare depozit',
      'software gestionare depozit',
      'platforma gestionare depozit',
      'aplicatie gestionare depozit',
      'solutie gestionare depozit',
      'instrumente gestionare depozit',
      'serviciu gestionare depozit',
      'sistem gestionare depozit software',
      'platforma gestionare depozit'
    ],
    localTerms: [
      'romanesc gestionare depozit',
      'romanesc gestionare stocuri',
      'romanesc software gestionare depozit',
      'romanesc program gestionare stocuri',
      'romanesc platforma gestionare depozit',
      'romanesc aplicatie gestionare stocuri',
      'romanesc solutie gestionare depozit',
      'romanesc instrumente gestionare stocuri',
      'romanesc serviciu gestionare depozit',
      'romanesc sistem gestionare depozit software'
    ],
    geoPosition: { lat: 44.4268, lng: 26.1025 },
    timezone: 'Europe/Bucharest'
  },

  // English (default)
  en: {
    country: 'United States',
    language: 'en',
    currency: 'USD',
    keywords: [
      'warehouse management',
      'inventory management',
      'stock management',
      'warehouse software',
      'inventory software',
      'stock software',
      'warehouse system',
      'inventory system',
      'stock system',
      'warehouse platform'
    ],
    wmsKeywords: [
      'WMS software',
      'warehouse management system',
      'warehouse management software',
      'warehouse management platform',
      'warehouse management application',
      'warehouse management solution',
      'warehouse management tools',
      'warehouse management service',
      'warehouse management system software',
      'warehouse management system platform'
    ],
    localTerms: [
      'US warehouse management',
      'US inventory management',
      'US stock management',
      'US warehouse software',
      'US inventory software',
      'US stock software',
      'US warehouse system',
      'US inventory system',
      'US stock system',
      'US warehouse platform'
    ],
    geoPosition: { lat: 39.8283, lng: -98.5795 },
    timezone: 'America/New_York'
  }
};

// Generate hreflang URLs for international SEO
export const generateHreflangUrls = (baseUrl: string, path: string = '') => {
  const languages = ['en', 'hu', 'sv', 'th', 'si', 'ro'];
  return languages.map(lang => ({
    lang: lang === 'en' ? 'en' : lang,
    url: `${baseUrl}/${lang}${path}`
  }));
};

// Generate country-specific keywords
export const getCountryKeywords = (language: string): string[] => {
  const countrySEO = countrySEOMap[language];
  if (!countrySEO) return countrySEOMap.en.keywords;
  
  return [
    ...countrySEO.keywords,
    ...countrySEO.wmsKeywords,
    ...countrySEO.localTerms
  ];
};

// Generate WMS-specific keywords for a country
export const getWMSKeywords = (language: string): string[] => {
  const countrySEO = countrySEOMap[language];
  if (!countrySEO) return countrySEOMap.en.wmsKeywords;
  
  return countrySEO.wmsKeywords;
};

// Generate structured data for international SEO
export const generateInternationalStructuredData = (language: string, baseUrl: string) => {
  const countrySEO = countrySEOMap[language];
  if (!countrySEO) return null;

  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `StockFlow - ${countrySEO.country} Warehouse Management`,
    "description": `Professional warehouse management system for ${countrySEO.country}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": countrySEO.currency,
      "description": `Free warehouse management for ${countrySEO.country} businesses`
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "32"
    },
    "author": {
      "@type": "Organization",
      "name": "StockFlow",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": countrySEO.country
      }
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "image": `${baseUrl}/warehouse-management-${language}.png`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${language}`
    },
    "inLanguage": language,
    "availableLanguage": ["en", "hu", "sv", "th", "si", "ro"]
  };
};
