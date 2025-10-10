import { useEffect } from 'react';

/**
 * Custom hook to safely add JSON-LD structured data to the document head
 * This prevents React from trying to manage script tags in the component tree
 * which can cause "Failed to execute 'removeChild' on 'Node'" errors
 */
export function useStructuredData(structuredDataArray: object[]) {
  useEffect(() => {
    // Create script elements and add them to the head
    const scriptElements: HTMLScriptElement[] = [];

    structuredDataArray.forEach((data) => {
      const script = document.createElement('script');
      script.type = 'application/ld+json';
      script.textContent = JSON.stringify(data);
      document.head.appendChild(script);
      scriptElements.push(script);
    });

    // Cleanup function to remove scripts when component unmounts
    return () => {
      scriptElements.forEach((script) => {
        if (script.parentNode) {
          script.parentNode.removeChild(script);
        }
      });
    };
  }, [structuredDataArray]);
}

/**
 * Helper function to create FAQ structured data from FAQ array
 */
export function createFAQStructuredData(faqData: Array<{ question: string; answer: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqData.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };
}

/**
 * Helper function to create Article structured data
 */
export function createArticleStructuredData(config: {
  headline: string;
  description: string;
  url: string;
  datePublished?: string;
  dateModified?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": config.headline,
    "description": config.description,
    "author": {
      "@type": "Organization",
      "name": "stockflow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "stockflow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      }
    },
    "datePublished": config.datePublished || "2024-01-01",
    "dateModified": config.dateModified || new Date().toISOString().split('T')[0],
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": config.url
    }
  };
}

/**
 * Helper function to create SoftwareApplication structured data
 */
export function createSoftwareStructuredData(config: {
  name: string;
  description: string;
  url: string;
  price?: string;
  ratingValue?: string;
  ratingCount?: string;
  image?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": config.name,
    "description": config.description,
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": config.price || "0",
      "priceCurrency": "EUR"
    },
    ...(config.ratingValue && config.ratingCount ? {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": config.ratingValue,
        "ratingCount": config.ratingCount
      }
    } : {}),
    "author": {
      "@type": "Organization",
      "name": "stockflow"
    },
    "publisher": {
      "@type": "Organization",
      "name": "stockflow",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.stockflow.be/logo.png"
      }
    },
    ...(config.image ? { "image": config.image } : {}),
    "url": config.url
  };
}

/**
 * Helper function to create BreadcrumbList structured data
 */
export function createBreadcrumbStructuredData(items: Array<{ name: string; url: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };
}

