// Generate comprehensive structured data for international SEO
// Note: This function should be called within a React component context where useTranslation is available
// For non-React contexts, use generateWMSStructuredData or other functions instead
export const generateInternationalStructuredData = (baseUrl: string, currentLang: string = 'en', t: (key: string) => string) => {
  
  const organizationData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "url": baseUrl,
    "logo": `${baseUrl}/logo.png`,
    "description": t('homepage.subtitle'),
    "foundingDate": "2023",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BE",
      "addressLocality": "Belgium"
    },
    "contactPoint": {
      "@type": "ContactPoint",
      "contactType": "customer service",
      "email": "info@stockflow.be"
    },
    "sameAs": [
      "https://twitter.com/stockflow",
      "https://linkedin.com/company/stockflow"
    ]
  };

  const softwareApplicationData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `StockFlow - ${t('homepage.title')}`,
    "description": t('homepage.subtitle'),
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "description": t('homepage.cta.description'),
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "32",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    "image": `${baseUrl}/warehouse-management-${currentLang}.png`,
    "screenshot": `${baseUrl}/screenshot-${currentLang}.png`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/${currentLang === 'en' ? '' : currentLang}`
    },
    "inLanguage": currentLang,
    "availableLanguage": ["en", "hu", "sv", "th", "si", "ro"],
    "featureList": [
      t('homepage.features.realTime.title'),
      t('homepage.features.barcode.title'),
      t('homepage.features.analytics.title'),
      t('homepage.features.mobile.title')
    ]
  };

  const websiteData = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StockFlow",
    "url": baseUrl,
    "description": t('homepage.subtitle'),
    "inLanguage": currentLang,
    "availableLanguage": ["en", "hu", "sv", "th", "si", "ro"],
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow"
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": {
        "@type": "EntryPoint",
        "urlTemplate": `${baseUrl}/search?q={search_term_string}`
      },
      "query-input": "required name=search_term_string"
    }
  };

  const breadcrumbData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": t('navigation.home'),
        "item": `${baseUrl}/${currentLang === 'en' ? '' : currentLang}`
      }
    ]
  };

  const faqData = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": "What is StockFlow?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('homepage.subtitle')
        }
      },
      {
        "@type": "Question",
        "name": "Is StockFlow free?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": "Yes, StockFlow is completely free for small and medium businesses with no hidden costs or limitations."
        }
      },
      {
        "@type": "Question",
        "name": "What features does StockFlow offer?",
        "acceptedAnswer": {
          "@type": "Answer",
          "text": `StockFlow offers ${t('homepage.features.realTime.title')}, ${t('homepage.features.barcode.title')}, ${t('homepage.features.analytics.title')}, and ${t('homepage.features.mobile.title')}.`
        }
      }
    ]
  };

  return [
    organizationData,
    softwareApplicationData,
    websiteData,
    breadcrumbData,
    faqData
  ];
};

// Generate country-specific structured data
export const generateCountrySpecificStructuredData = (country: string, language: string, baseUrl: string) => {
  const countryData = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `StockFlow - Warehouse Management System for ${country}`,
    "description": `Professional warehouse management system designed for businesses in ${country}`,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": getCurrencyForCountry(country),
      "description": `Free warehouse management for ${country} businesses`,
      "availability": "https://schema.org/InStock"
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
        "addressCountry": country
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

  return countryData;
};

// Get currency for country
function getCurrencyForCountry(country: string): string {
  const currencyMap: Record<string, string> = {
    'Hungary': 'HUF',
    'Sweden': 'SEK',
    'Thailand': 'THB',
    'Sri Lanka': 'LKR',
    'Romania': 'RON',
    'United States': 'USD',
    'Belgium': 'EUR'
  };
  
  return currencyMap[country] || 'EUR';
}

// Generate WMS-specific structured data
export const generateWMSStructuredData = (baseUrl: string, language: string = 'en') => {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "StockFlow WMS - Warehouse Management System",
    "description": "Professional warehouse management system with barcode scanning, real-time tracking, and inventory automation",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "Free WMS software for small and medium businesses"
    },
    "featureList": [
      "Barcode Scanning",
      "Real-time Inventory Tracking",
      "Automated Stock Management",
      "Mobile Access",
      "Analytics and Reporting",
      "Multi-user Support",
      "Integration Capabilities"
    ],
    "screenshot": `${baseUrl}/wms-screenshot-${language}.png`,
    "image": `${baseUrl}/wms-feature-${language}.png`,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${baseUrl}/warehouse-management-system`
    },
    "inLanguage": language,
    "keywords": [
      "WMS",
      "Warehouse Management System",
      "Inventory Management",
      "Stock Control",
      "Barcode Scanning",
      "Warehouse Automation",
      "Supply Chain Management",
      "Logistics Software"
    ]
  };
};
