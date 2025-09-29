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
        "description": data.description || "Free inventory management software for small and medium businesses"
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

// Generate WebSite Schema
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
    }
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
    "operatingSystem": data.operatingSystem,
    "offers": {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": data.currency,
      "description": data.description,
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": data.rating ? {
      "@type": "AggregateRating",
      "ratingValue": data.rating.value,
      "ratingCount": data.rating.count,
      "bestRating": "5",
      "worstRating": "1"
    } : undefined,
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
    "featureList": data.features
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
            "description": "Free inventory management software for small businesses"
          }
        }
      ]
    }
  };
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
      "SME Solutions"
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
    schemas.push(generateFAQSchema(pageData.faqData));
  }

  if (pageData.softwareData) {
    schemas.push(generateSoftwareApplicationSchema(pageData.softwareData));
  }

  if (pageData.serviceData) {
    schemas.push(generateServiceSchema(pageData.serviceData));
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
    });
  }

  return schemas;
}
