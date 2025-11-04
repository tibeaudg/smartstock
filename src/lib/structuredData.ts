// Utility functions for generating structured data schemas

export interface BreadcrumbItem {
  name: string;
  url: string;
  position: number;
}

export interface OrganizationData {
  name: string;
  url: string;
  logo?: string;
  description?: string;
  foundingDate?: string;
  address?: {
    country: string;
    region: string;
  };
  contactPoints?: Array<{
    type: string;
    email: string;
    phone?: string;
    languages?: string[];
  }>;
  socialMedia?: string[];
  services?: string[];
}

export interface SoftwareApplicationData {
  name: string;
  description: string;
  category: string;
  operatingSystem: string;
  price: string;
  currency: string;
  rating?: {
    value: string;
    count: string;
  };
  features?: string[];
  image?: string;
  url: string;
}

export interface ServiceData {
  name: string;
  description: string;
  provider: string;
  areaServed: string;
  serviceType: string;
  price: string;
  currency: string;
}

// Generate Organization Schema
export function generateOrganizationSchema(data: OrganizationData) {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": data.name,
    "alternateName": data.name.toLowerCase(),
    "url": data.url,
    "logo": data.logo ? {
      "@type": "ImageObject",
      "url": data.logo,
      "width": 200,
      "height": 60
    } : undefined,
    "description": data.description,
    "foundingDate": data.foundingDate,
    "address": data.address ? {
      "@type": "PostalAddress",
      "addressCountry": data.address.country,
      "addressRegion": data.address.region
    } : undefined,
    "contactPoint": data.contactPoints?.map(point => ({
      "@type": "ContactPoint",
      "telephone": point.phone,
      "contactType": point.type,
      "email": point.email,
      "availableLanguage": point.languages
    })),
    "sameAs": data.socialMedia,
    "knowsAbout": data.services,
    "makesOffer": {
      "@type": "Offer",
      "itemOffered": {
        "@type": "SoftwareApplication",
        "name": `${data.name} Inventory Management`,
        "description": data.description || "Cloud-based Inventory Management Platform for small and medium businesses"
      },
      "price": "0",
      "priceCurrency": "EUR"
    }
  };
}

// Generate BreadcrumbList Schema
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": breadcrumbs.map(item => ({
      "@type": "ListItem",
      "position": item.position,
      "name": item.name,
      "item": item.url
    }))
  };
}

// Generate WebSite Schema with sitelinks
export function generateWebSiteSchema(organizationName: string, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": organizationName,
    "url": baseUrl,
    "description": "Smart inventory management for growing businesses",
    "publisher": {
      "@type": "Organization",
      "name": organizationName
    },
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${baseUrl}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string"
    },
    "hasPart": [
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/auth`,
        "name": "Login & Registreer - Gratis Voorraadbeheer",
        "description": "Log in of registreer voor gratis voorraadbeheer met StockFlow",
        "url": `${baseUrl}/auth`
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/contact`,
        "name": "Contact - Support & Vragen",
        "description": "Neem contact op met ons team voor vragen en support",
        "url": `${baseUrl}/contact`
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/features`,
        "name": "Features - Krachtige Voorraadbeheer Tools",
        "description": "Ontdek alle krachtige features van StockFlow inventory management",
        "url": `${baseUrl}/features`
      },
      {
        "@type": "WebPage",
        "@id": `${baseUrl}/pricing`,
        "name": "Prijzen - Gratis & Premium Tarieven",
        "description": "Transparante prijzen voor voorraadbeheer software",
        "url": `${baseUrl}/pricing`
      }
    ]
  };
}

// Generate SoftwareApplication Schema
export function generateSoftwareApplicationSchema(data: SoftwareApplicationData) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": data.name,
    "description": data.description,
    "applicationCategory": data.category,
    "applicationSubCategory": "SaaS",
    "operatingSystem": data.operatingSystem,
    "softwareVersion": "2.0",
    "releaseNotes": "Latest version with enhanced features",
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": data.currency,
      "description": data.description,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "seller": {
        "@type": "Organization",
        "name": "StockFlow"
      }
    },
    "aggregateRating": data.rating ? {
      "@type": "AggregateRating",
      "ratingValue": data.rating.value,
      "ratingCount": data.rating.count,
      "bestRating": "5",
      "worstRating": "1"
    } : {
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
        "url": "https://www.stockflow.be/logo.png"
      }
    },
    "image": data.image,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url
    },
    "featureList": data.features,
    "softwareHelp": {
      "@type": "WebPage",
      "url": "https://www.stockflow.be/contact"
    },
    "installUrl": "https://www.stockflow.be/auth",
    "downloadUrl": "https://www.stockflow.be/auth",
    "permissions": "Web Browser"
  };
}

// Generate Service Schema
export function generateServiceSchema(data: ServiceData) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    "name": data.name,
    "description": data.description,
    "provider": {
      "@type": "Organization",
      "name": data.provider
    },
    "areaServed": {
      "@type": "Country",
      "name": data.areaServed
    },
    "serviceType": data.serviceType,
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": data.currency,
      "description": data.description
    }
  };
}

// Generate FAQ Schema
export function generateFAQSchema(faqData: Array<{question: string; answer: string}>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer,
        "author": {
          "@type": "Organization",
          "name": "StockFlow"
        }
      }
    }))
  };
}

// Generate LocalBusiness Schema for Belgian market
export function generateLocalBusinessSchema(organizationName: string, baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": organizationName,
    "url": baseUrl,
    "description": "Smart inventory management software for Belgian businesses",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "BE",
      "addressRegion": "Belgium"
    },
    "areaServed": {
      "@type": "Country",
      "name": "Belgium"
    },
    "serviceArea": {
      "@type": "Country",
      "name": "Belgium"
    },
    "hasOfferCatalog": {
      "@type": "OfferCatalog",
      "name": "Inventory Management Services",
      "itemListElement": [
        {
          "@type": "Offer",
          "itemOffered": {
            "@type": "Service",
            "name": "Free Inventory Management",
            "description": "Cloud-based Inventory Management Platform for small businesses"
          }
        }
      ]
    }
  };
}

// Safe JSON stringify that handles circular references and undefined values
function safeStringify(obj: any): string {
  const seen = new WeakSet();
  return JSON.stringify(obj, (key, value) => {
    if (typeof value === 'object' && value !== null) {
      if (seen.has(value)) {
        return '[Circular]';
      }
      seen.add(value);
    }
    if (value === undefined) {
      return null;
    }
    return value;
  });
}

// Generate comprehensive structured data for SEO pages
export function generateComprehensiveStructuredData(
  pageType: 'contact' | 'software' | 'service' | 'article',
  pageData: {
    title: string;
    url: string;
    description: string;
    breadcrumbs: BreadcrumbItem[];
    faqData?: Array<{question: string; answer: string}>;
    softwareData?: SoftwareApplicationData;
    serviceData?: ServiceData;
  }
) {
  const baseOrganizationData: OrganizationData = {
    name: "StockFlow",
    url: "https://www.stockflow.be",
    logo: "https://www.stockflow.be/logo.png",
    description: "Smart inventory management software for growing businesses. Free stock management solution for SMEs.",
    foundingDate: "2024",
    address: {
      country: "BE",
      region: "Belgium"
    },
    contactPoints: [
      {
        type: "customer service",
        email: "support@stockflow.be",
        phone: "+32-XXX-XXX-XXX",
        languages: ["English", "Dutch", "French", "German", "Spanish"]
      },
      {
        type: "sales",
        email: "sales@stockflow.be",
        languages: ["English", "Dutch"]
      }
    ],
    socialMedia: [
      "https://www.facebook.com/profile.php?id=61578067034898",
      "https://twitter.com/stockflow",
      "https://www.linkedin.com/stockflow",
      "https://www.instagram.com/stockflowbe"
    ],
    services: [
      "Inventory Management",
      "Stock Control",
      "Warehouse Management",
      "Business Software",
      "SMB Solutions"
    ]
  };

  const schemas = [
    generateOrganizationSchema(baseOrganizationData),
    generateBreadcrumbSchema(pageData.breadcrumbs),
    generateWebSiteSchema("StockFlow", "https://www.stockflow.be"),
    generateLocalBusinessSchema("StockFlow", "https://www.stockflow.be")
  ];

  // Add page-specific schemas
  if (pageData.faqData) {
    schemas.push(generateFAQSchema(pageData.faqData) as any);
  }

  if (pageData.softwareData) {
    schemas.push(generateSoftwareApplicationSchema(pageData.softwareData) as any);
  }

  if (pageData.serviceData) {
    schemas.push(generateServiceSchema(pageData.serviceData) as any);
  }

  // Add page-specific schema based on type
  if (pageType === 'contact') {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "ContactPage",
      "name": pageData.title,
      "description": pageData.description,
      "url": pageData.url,
      "mainEntity": {
        "@type": "Organization",
        "name": "StockFlow",
        "url": "https://www.stockflow.be"
      }
    } as any);
  }

  // Filter out any undefined or null schemas
  const validSchemas = schemas.filter(schema => schema && typeof schema === 'object');
  
  return validSchemas;
}

// Generate VideoObject Schema for video content
export function generateVideoObjectSchema(config: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl: string;
  embedUrl?: string;
  duration?: string;
  uploadDate?: string;
  publisher?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": config.name,
    "description": config.description,
    "thumbnailUrl": config.thumbnailUrl,
    "contentUrl": config.contentUrl,
    "embedUrl": config.embedUrl || config.contentUrl,
    ...(config.duration && { "duration": config.duration }),
    ...(config.uploadDate && { "uploadDate": config.uploadDate }),
    "publisher": {
      "@type": "Organization",
      "name": config.publisher || "StockFlow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      }
    }
  };
}

// Generate Product Schema for product pages
export function generateProductSchema(config: {
  name: string;
  description: string;
  image?: string;
  sku?: string;
  brand?: string;
  offers?: {
    price: string;
    priceCurrency: string;
    availability?: string;
    url?: string;
  };
  aggregateRating?: {
    ratingValue: string;
    ratingCount: string;
  };
  baseUrl?: string;
}) {
  const baseUrl = config.baseUrl || "https://www.stockflow.be";
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": config.name,
    "description": config.description,
    ...(config.image && {
      "image": config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`
    }),
    ...(config.sku && { "sku": config.sku }),
    "brand": {
      "@type": "Brand",
      "name": config.brand || "StockFlow"
    },
    ...(config.offers && {
      "offers": {
        "@type": "Offer",
        "price": config.offers.price,
        "priceCurrency": config.offers.priceCurrency,
        "availability": config.offers.availability || "https://schema.org/InStock",
        ...(config.offers.url && { "url": config.offers.url })
      }
    }),
    ...(config.aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": config.aggregateRating.ratingValue,
        "ratingCount": config.aggregateRating.ratingCount,
        "bestRating": "5",
        "worstRating": "1"
      }
    })
  };
}

// Generate Course Schema for educational content
export function generateCourseSchema(config: {
  name: string;
  description: string;
  provider?: string;
  courseCode?: string;
  educationalCredentialAwarded?: string;
  timeRequired?: string;
  image?: string;
  baseUrl?: string;
  courseUrl?: string;
}) {
  const baseUrl = config.baseUrl || "https://www.stockflow.be";
  return {
    "@context": "https://schema.org",
    "@type": "Course",
    "name": config.name,
    "description": config.description,
    "provider": {
      "@type": "Organization",
      "name": config.provider || "StockFlow",
      "url": baseUrl
    },
    ...(config.courseCode && { "courseCode": config.courseCode }),
    ...(config.educationalCredentialAwarded && {
      "educationalCredentialAwarded": config.educationalCredentialAwarded
    }),
    ...(config.timeRequired && { "timeRequired": config.timeRequired }),
    ...(config.image && {
      "image": config.image.startsWith('http') ? config.image : `${baseUrl}${config.image}`
    }),
    ...(config.courseUrl && {
      "url": config.courseUrl.startsWith('http') ? config.courseUrl : `${baseUrl}${config.courseUrl}`
    })
  };
}

// Generate Review Schema for product/service reviews
export function generateReviewSchema(config: {
  itemReviewed: {
    "@type": string;
    name: string;
  };
  reviewRating: {
    ratingValue: string;
    bestRating?: string;
    worstRating?: string;
  };
  author: {
    name: string;
    type?: string;
  };
  reviewBody?: string;
  datePublished?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": config.itemReviewed,
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": config.reviewRating.ratingValue,
      "bestRating": config.reviewRating.bestRating || "5",
      "worstRating": config.reviewRating.worstRating || "1"
    },
    "author": {
      "@type": config.author.type || "Person",
      "name": config.author.name
    },
    ...(config.reviewBody && { "reviewBody": config.reviewBody }),
    ...(config.datePublished && { "datePublished": config.datePublished })
  };
}
