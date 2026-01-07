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

export interface ReviewData {
  author: {
    name: string;
    type?: string;
  };
  rating: number | string;
  reviewBody: string;
  datePublished?: string;
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
  image?: string | string[];
  screenshot?: string;
  url: string;
  baseUrl?: string;
  offers?: Array<{
    price: string;
    priceCurrency: string;
    description?: string;
    availability?: string;
    validFrom?: string;
  }>;
  reviews?: ReviewData[];
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
        "name": "Pricing - Completely Free Forever",
        "description": "StockFlow is completely free forever - all features included, no credit card required",
        "url": `${baseUrl}/pricing`
      }
    ]
  };
}

// Generate SoftwareApplication Schema
export function generateSoftwareApplicationSchema(data: SoftwareApplicationData) {
  const baseUrl = data.baseUrl || "https://www.stockflowsystems.com";
  
  // Normalize image to array format
  const images = data.image 
    ? (Array.isArray(data.image) ? data.image : [data.image])
    : ["https://www.stockflowsystems.com/Inventory-Management.png"];
  
  // Ensure all image URLs are absolute
  const normalizedImages = images.map(img => 
    img.startsWith('http') ? img : `${baseUrl}${img.startsWith('/') ? '' : '/'}${img}`
  );
  
  // Default screenshot if not provided
  const screenshot = data.screenshot 
    ? (data.screenshot.startsWith('http') ? data.screenshot : `${baseUrl}${data.screenshot.startsWith('/') ? '' : '/'}${data.screenshot}`)
    : `${baseUrl}/optimized/desktop.png`;
  
  // Handle offers - support both single offer and array of offers
  let offers;
  if (data.offers && Array.isArray(data.offers) && data.offers.length > 0) {
    // Multiple offers
    offers = data.offers.map(offer => ({
      "@type": "Offer",
      "price": offer.price,
      "priceCurrency": offer.priceCurrency,
      "description": offer.description || data.description,
      "availability": offer.availability || "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "validFrom": offer.validFrom || "2024-01-01",
      "seller": {
        "@type": "Organization",
        "name": "StockFlow"
      }
    }));
  } else {
    // Single offer (backward compatible)
    offers = {
      "@type": "Offer",
      "price": data.price,
      "priceCurrency": data.currency,
      "description": data.description,
      "availability": "https://schema.org/InStock",
      "priceValidUntil": "2025-12-31",
      "validFrom": "2024-01-01",
      "seller": {
        "@type": "Organization",
        "name": "StockFlow"
      }
    };
  }
  
  // Calculate aggregate rating from reviews if provided, otherwise use provided rating or defaults
  let aggregateRating;
  if (data.reviews && data.reviews.length > 0) {
    // Calculate average rating from reviews
    const totalRating = data.reviews.reduce((sum, review) => {
      const rating = typeof review.rating === 'string' ? parseFloat(review.rating) : review.rating;
      return sum + rating;
    }, 0);
    const averageRating = (totalRating / data.reviews.length).toFixed(1);
    aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": averageRating,
      "ratingCount": data.reviews.length.toString(),
      "bestRating": "5",
      "worstRating": "1"
    };
  } else if (data.rating) {
    aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": data.rating.value,
      "ratingCount": data.rating.count,
      "bestRating": "5",
      "worstRating": "1"
    };
  } else {
    aggregateRating = {
      "@type": "AggregateRating",
      "ratingValue": "4.8",
      "ratingCount": "150",
      "bestRating": "5",
      "worstRating": "1"
    };
  }
  
  // Build the schema
  const schema: any = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": data.name,
    "description": data.description,
    "applicationCategory": data.category,
    "applicationSubCategory": "SaaS",
    "operatingSystem": data.operatingSystem,
    "softwareVersion": "2.0",
    "releaseNotes": "Latest version with enhanced features",
    "offers": offers,
    "aggregateRating": aggregateRating,
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
    "image": normalizedImages.length === 1 ? normalizedImages[0] : normalizedImages,
    "screenshot": screenshot,
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": data.url.startsWith('http') ? data.url : `${baseUrl}${data.url.startsWith('/') ? '' : '/'}${data.url}`
    },
    "softwareHelp": {
      "@type": "WebPage",
      "url": `${baseUrl}/contact`
    },
    "installUrl": `${baseUrl}/auth`,
    "downloadUrl": `${baseUrl}/auth`,
    "permissions": "Web Browser"
  };
  
  // Add featureList if provided
  if (data.features && data.features.length > 0) {
    schema.featureList = data.features;
  }
  
  // Add review property if reviews are provided (reviews will be separate schemas, but we link them)
  // Note: Individual Review schemas should be generated separately and included in the page
  // The review property here is for linking, but we'll handle that in the combined generator
  
  return schema;
}

// Generate comprehensive structured data for product pages
export interface ProductPageStructuredDataOptions {
  softwareData: SoftwareApplicationData;
  faqData?: Array<{question: string; answer: string}>;
  breadcrumbs?: BreadcrumbItem[];
  includeBreadcrumbs?: boolean;
  baseUrl?: string;
}

export function generateProductPageStructuredData(options: ProductPageStructuredDataOptions) {
  const { softwareData, faqData, breadcrumbs, includeBreadcrumbs = false, baseUrl = "https://www.stockflowsystems.com" } = options;
  
  const schemas: any[] = [];
  
  // Add SoftwareApplication schema
  const softwareSchema = generateSoftwareApplicationSchema({
    ...softwareData,
    baseUrl
  });
  schemas.push(softwareSchema);
  
  // Add FAQ schema if provided
  if (faqData && faqData.length > 0) {
    schemas.push(generateFAQSchema(faqData));
  }
  
  // Add BreadcrumbList if requested and breadcrumbs are provided
  if (includeBreadcrumbs && breadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }
  
  return schemas;
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
    url: "https://www.stockflowsystems.com",
    logo: "https://www.stockflowsystems.com/logo.png",
    description: "Smart inventory management software for growing businesses. Free stock management solution for SMEs.",
    foundingDate: "2024",
    address: {
      country: "BE",
      region: "Belgium"
    },
    contactPoints: [
      {
        type: "customer service",
        email: "info@stockflow.be",
        phone: "+32-XXX-XXX-XXX",
        languages: ["English", "Dutch", "French", "German", "Spanish"]
      },
      {
        type: "sales",
        email: "sales@stockflowsystems.com",
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
    generateWebSiteSchema("StockFlow", "https://www.stockflowsystems.com"),
    generateLocalBusinessSchema("StockFlow", "https://www.stockflowsystems.com")
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
        "url": "https://www.stockflowsystems.com"
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
        "url": "https://www.stockflowsystems.com/logo.png"
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
  const baseUrl = config.baseUrl || "https://www.stockflowsystems.com";
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
  const baseUrl = config.baseUrl || "https://www.stockflowsystems.com";
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

// Generate Review Schema specifically for SoftwareApplication
export function generateReviewSchemaForSoftware(
  review: ReviewData,
  softwareName: string,
  softwareUrl?: string
) {
  const ratingValue = typeof review.rating === 'string' ? review.rating : review.rating.toString();
  
  return {
    "@context": "https://schema.org",
    "@type": "Review",
    "itemReviewed": {
      "@type": "SoftwareApplication",
      "name": softwareName,
      ...(softwareUrl && { "url": softwareUrl })
    },
    "reviewRating": {
      "@type": "Rating",
      "ratingValue": ratingValue,
      "bestRating": "5",
      "worstRating": "1"
    },
    "author": {
      "@type": review.author.type || "Person",
      "name": review.author.name
    },
    "reviewBody": review.reviewBody,
    ...(review.datePublished && { "datePublished": review.datePublished })
  };
}

// Generate SoftwareApplication with linked Review schemas
export function generateSoftwareApplicationWithReviews(
  softwareData: SoftwareApplicationData,
  reviews?: ReviewData[]
): any[] {
  const schemas: any[] = [];
  
  // Generate SoftwareApplication schema with calculated aggregateRating from reviews
  const softwareSchema = generateSoftwareApplicationSchema({
    ...softwareData,
    reviews: reviews || softwareData.reviews
  });
  
  schemas.push(softwareSchema);
  
  // Generate individual Review schemas if reviews are provided
  if (reviews && reviews.length > 0) {
    const baseUrl = softwareData.baseUrl || "https://www.stockflowsystems.com";
    const softwareUrl = softwareData.url.startsWith('http') 
      ? softwareData.url 
      : `${baseUrl}${softwareData.url.startsWith('/') ? '' : '/'}${softwareData.url}`;
    
    reviews.forEach(review => {
      const reviewSchema = generateReviewSchemaForSoftware(
        review,
        softwareData.name,
        softwareUrl
      );
      schemas.push(reviewSchema);
    });
  }
  
  return schemas;
}

// Generate comprehensive structured data for SEO pages
export interface SeoPageStructuredDataOptions {
  title: string;
  description: string;
  url: string;
  baseUrl?: string;
  breadcrumbs?: BreadcrumbItem[];
  faqData?: Array<{question: string; answer: string}>;
  softwareData?: SoftwareApplicationData;
  reviews?: ReviewData[];
  includeOrganization?: boolean;
  includeWebSite?: boolean;
  includeBreadcrumbs?: boolean;
  pageType?: 'article' | 'software' | 'service' | 'product';
  datePublished?: string;
  dateModified?: string;
}

export function generateSeoPageStructuredData(options: SeoPageStructuredDataOptions): any[] {
  const {
    title,
    description,
    url,
    baseUrl = "https://www.stockflowsystems.com",
    breadcrumbs = [],
    faqData,
    softwareData,
    reviews,
    includeOrganization = true,
    includeWebSite = false,
    includeBreadcrumbs = true,
    pageType = 'article',
    datePublished,
    dateModified
  } = options;

  const schemas: any[] = [];
  const fullUrl = url.startsWith('http') ? url : `${baseUrl}${url.startsWith('/') ? '' : '/'}${url}`;

  // Add Organization schema if requested
  if (includeOrganization) {
    const orgData: OrganizationData = {
      name: "StockFlow",
      url: baseUrl,
      logo: `${baseUrl}/logo.png`,
      description: "Smart inventory management software for growing businesses. Free stock management solution for SMEs.",
      foundingDate: "2024",
      address: {
        country: "BE",
        region: "Belgium"
      },
      contactPoints: [
        {
          type: "customer service",
          email: "info@stockflow.be",
          languages: ["English", "Dutch", "French", "German", "Spanish"]
        },
        {
          type: "sales",
          email: "sales@stockflowsystems.com",
          languages: ["English", "Dutch"]
        }
      ],
      socialMedia: [
        "https://www.facebook.com/profile.php?id=61578067034898",
        "https://twitter.com/stockflow",
        "https://www.linkedin.com/company/stockflow",
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
    schemas.push(generateOrganizationSchema(orgData));
  }

  // Add WebSite schema if requested
  if (includeWebSite) {
    schemas.push(generateWebSiteSchema("StockFlow", baseUrl));
  }

  // Add BreadcrumbList if requested and breadcrumbs are provided
  if (includeBreadcrumbs && breadcrumbs.length > 0) {
    schemas.push(generateBreadcrumbSchema(breadcrumbs));
  }

  // Add SoftwareApplication with Reviews if software data is provided
  if (softwareData) {
    const softwareSchemas = generateSoftwareApplicationWithReviews(
      {
        ...softwareData,
        baseUrl,
        url: fullUrl
      },
      reviews
    );
    schemas.push(...softwareSchemas);
  } else if (reviews && reviews.length > 0 && pageType === 'software') {
    // If only reviews provided without softwareData, create basic SoftwareApplication
    const basicSoftwareData: SoftwareApplicationData = {
      name: "StockFlow",
      description: description,
      category: "BusinessApplication",
      operatingSystem: "Web Browser",
      price: "0",
      currency: "EUR",
      url: fullUrl,
      baseUrl,
      reviews
    };
    const softwareSchemas = generateSoftwareApplicationWithReviews(basicSoftwareData, reviews);
    schemas.push(...softwareSchemas);
  }

  // Add FAQ schema if provided
  if (faqData && faqData.length > 0) {
    schemas.push(generateFAQSchema(faqData));
  }

  // Add Article schema for article pages
  if (pageType === 'article' && datePublished) {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Article",
      "headline": title,
      "description": description,
      "datePublished": datePublished,
      "dateModified": dateModified || datePublished,
      "mainEntityOfPage": {
        "@type": "WebPage",
        "@id": fullUrl
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
      }
    });
  }

  // Filter out any undefined or null schemas
  return schemas.filter(schema => schema && typeof schema === 'object');
}
