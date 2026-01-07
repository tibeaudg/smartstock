/**
 * Enhanced Structured Data Utilities for SEO
 * Provides comprehensive schema.org markup for better search engine understanding
 */

export interface ImageData {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  caption?: string;
}

export interface HowToStep {
  name: string;
  text: string;
  image?: string;
  url?: string;
}

export interface ListItem {
  name: string;
  description?: string;
  url?: string;
  image?: string;
}

/**
 * Generate comprehensive Organization schema
 */
export function generateOrganizationSchema(baseUrl: string = 'https://www.stockflowsystems.com') {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "StockFlow",
    "url": baseUrl,
    "logo": {
      "@type": "ImageObject",
      "url": `${baseUrl}/logo.png`,
      "width": 512,
      "height": 512
    },
    "description": "Smart inventory management software for growing businesses. Cloud-based inventory management platform designed for SMEs.",
    "foundingDate": "2023",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BE",
      "addressLocality": "Belgium"
    },
    "contactPoint": [
      {
        "@type": "ContactPoint",
        "contactType": "customer service",
        "email": "info@stockflow.be",
        "availableLanguage": ["English", "Dutch", "French"]
      },
      {
        "@type": "ContactPoint",
        "contactType": "sales",
        "email": "sales@stockflowsystems.com",
        "availableLanguage": ["English", "Dutch"]
      }
    ],
    "sameAs": [
      "https://twitter.com/stockflow",
      "https://www.linkedin.com/company/stockflow",
      "https://www.facebook.com/profile.php?id=61578067034898",
      "https://www.instagram.com/stockflowbe"
    ],
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    }
  };
}

/**
 * Generate WebSite schema with SearchAction
 */
export function generateWebSiteSchema(baseUrl: string = 'https://www.stockflowsystems.com', language: string = 'en') {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "StockFlow - Smart Inventory Management",
    "url": baseUrl,
    "description": "Professional inventory management software for small and medium businesses. Real-time tracking, barcode scanning, and automated stock control.",
    "inLanguage": language === 'nl' ? 'nl-BE' : 'en-US',
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
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
}

/**
 * Generate ImageObject schema for better image SEO
 */
export function generateImageObjectSchema(image: ImageData, baseUrl: string = 'https://www.stockflowsystems.com') {
  const fullUrl = image.url.startsWith('http') ? image.url : `${baseUrl}${image.url}`;
  
  return {
    "@context": "https://schema.org",
    "@type": "ImageObject",
    "contentUrl": fullUrl,
    "url": fullUrl,
    ...(image.width && { "width": image.width }),
    ...(image.height && { "height": image.height }),
    ...(image.alt && { "caption": image.alt }),
    ...(image.caption && { "caption": image.caption })
  };
}

/**
 * Generate ItemList schema for list-based content (tips, features, etc.)
 */
export function generateItemListSchema(
  items: ListItem[],
  name: string,
  description: string,
  baseUrl: string = 'https://www.stockflowsystems.com',
  pageUrl?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": name,
    "description": description,
    "numberOfItems": items.length,
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      ...(item.description && { "description": item.description }),
      ...(item.url && { "url": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}` }),
      ...(item.image && { "image": item.image.startsWith('http') ? item.image : `${baseUrl}${item.image}` })
    })),
    ...(pageUrl && {
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`
      }
    })
  };
}

/**
 * Generate HowTo schema for tutorial/guide pages
 */
export function generateHowToSchema(
  steps: HowToStep[],
  name: string,
  description: string,
  image?: string,
  baseUrl: string = 'https://www.stockflowsystems.com',
  pageUrl?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "HowTo",
    "name": name,
    "description": description,
    ...(image && {
      "image": image.startsWith('http') ? image : `${baseUrl}${image}`
    }),
    "step": steps.map((step, index) => ({
      "@type": "HowToStep",
      "position": index + 1,
      "name": step.name,
      "text": step.text,
      ...(step.image && {
        "image": step.image.startsWith('http') ? step.image : `${baseUrl}${step.image}`
      }),
      ...(step.url && {
        "url": step.url.startsWith('http') ? step.url : `${baseUrl}${step.url}`
      })
    })),
    ...(pageUrl && {
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`
      }
    })
  };
}

/**
 * Generate enhanced Article schema with more metadata
 */
export function generateEnhancedArticleSchema(
  headline: string,
  description: string,
  image: string,
  author: string = 'StockFlow',
  datePublished: string,
  dateModified: string,
  baseUrl: string = 'https://www.stockflowsystems.com',
  pageUrl?: string,
  keywords?: string[]
) {
  const fullPageUrl = pageUrl 
    ? (pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`)
    : baseUrl;
  const fullImageUrl = image.startsWith('http') ? image : `${baseUrl}${image}`;

  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": headline,
    "description": description,
    "image": {
      "@type": "ImageObject",
      "url": fullImageUrl,
      "width": 1200,
      "height": 630
    },
    "author": {
      "@type": "Organization",
      "name": author,
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`,
        "width": 512,
        "height": 512
      }
    },
    "datePublished": datePublished,
    "dateModified": dateModified,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": fullPageUrl
    },
    ...(keywords && { "keywords": keywords.join(', ') })
  };
}

/**
 * Generate Service schema for service pages
 */
export function generateServiceSchema(
  serviceType: string,
  name: string,
  description: string,
  areaServed: string = 'Worldwide',
  baseUrl: string = 'https://www.stockflowsystems.com',
  pageUrl?: string
) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": serviceType,
    "name": name,
    "description": description,
    "provider": {
      "@type": "Organization",
      "name": "StockFlow",
      "url": baseUrl
    },
    "areaServed": {
      "@type": "Country",
      "name": areaServed
    },
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "EUR",
      "description": "Free tier available for small businesses"
    },
    ...(pageUrl && {
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`
      }
    })
  };
}

/**
 * Generate SoftwareApplication schema with enhanced features
 */
export function generateEnhancedSoftwareSchema(
  name: string,
  description: string,
  applicationCategory: string = 'BusinessApplication',
  operatingSystem: string = 'Web Browser',
  offers: {
    price: string;
    priceCurrency: string;
    description: string;
  },
  baseUrl: string = 'https://www.stockflowsystems.com',
  pageUrl?: string,
  screenshot?: string,
  featureList?: string[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": name,
    "description": description,
    "applicationCategory": applicationCategory,
    "operatingSystem": operatingSystem,
    "offers": {
      "@type": "Offer",
      "price": offers.price,
      "priceCurrency": offers.priceCurrency,
      "description": offers.description,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "500",
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": "Organization",
      "name": "StockFlow",
      "url": baseUrl
    },
    "publisher": {
      "@type": "Organization",
      "name": "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": `${baseUrl}/logo.png`
      }
    },
    ...(screenshot && {
      "screenshot": screenshot.startsWith('http') ? screenshot : `${baseUrl}${screenshot}`
    }),
    ...(featureList && { "featureList": featureList }),
    ...(pageUrl && {
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`
      }
    })
  };
}

/**
 * Generate comprehensive page schema collection
 * Use this for pages that need multiple schema types
 */
export function generateComprehensivePageSchema(options: {
  baseUrl?: string;
  pageUrl: string;
  pageType: 'article' | 'service' | 'software' | 'howto' | 'list';
  title: string;
  description: string;
  image?: string;
  datePublished?: string;
  dateModified?: string;
  language?: string;
  includeOrganization?: boolean;
  includeWebSite?: boolean;
  includeBreadcrumbs?: boolean;
  breadcrumbItems?: Array<{ name: string; url: string }>;
  customSchemas?: object[];
}) {
  const {
    baseUrl = 'https://www.stockflowsystems.com',
    pageUrl,
    pageType,
    title,
    description,
    image,
    datePublished,
    dateModified,
    language = 'en',
    includeOrganization = true,
    includeWebSite = false,
    includeBreadcrumbs = false,
    breadcrumbItems = [],
    customSchemas = []
  } = options;

  const fullPageUrl = pageUrl.startsWith('http') ? pageUrl : `${baseUrl}${pageUrl}`;
  const schemas: object[] = [];

  // Always include Organization if requested
  if (includeOrganization) {
    schemas.push(generateOrganizationSchema(baseUrl));
  }

  // Include WebSite schema if requested
  if (includeWebSite) {
    schemas.push(generateWebSiteSchema(baseUrl, language));
  }

  // Include breadcrumbs if requested
  if (includeBreadcrumbs && breadcrumbItems.length > 0) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems.map((item, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "name": item.name,
        "item": item.url.startsWith('http') ? item.url : `${baseUrl}${item.url}`
      }))
    });
  }

  // Add page-specific schema based on type
  switch (pageType) {
    case 'article':
      if (datePublished && dateModified) {
        schemas.push(generateEnhancedArticleSchema(
          title,
          description,
          image || `${baseUrl}/Inventory-Management.png`,
          'StockFlow',
          datePublished,
          dateModified,
          baseUrl,
          fullPageUrl
        ));
      }
      break;
    case 'service':
      schemas.push(generateServiceSchema(
        title,
        title,
        description,
        'Worldwide',
        baseUrl,
        fullPageUrl
      ));
      break;
    case 'software':
      schemas.push(generateEnhancedSoftwareSchema(
        title,
        description,
        'BusinessApplication',
        'Web Browser',
        { price: '0', priceCurrency: 'EUR', description: 'Free tier available' },
        baseUrl,
        fullPageUrl,
        image
      ));
      break;
  }

  // Add any custom schemas
  schemas.push(...customSchemas);

  return schemas;
}

