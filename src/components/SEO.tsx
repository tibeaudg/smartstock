import { Helmet } from 'react-helmet-async';
import React from 'react';
import { createTrustedHTML } from '@/utils/trustedTypes';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  structuredData?: object;
  hreflang?: Array<{ lang: string; url: string }>;
  alternateLanguages?: Array<{ lang: string; url: string }>;
  locale?: string;
  noindex?: boolean;
  nofollow?: boolean;
  publishedTime?: string;
  modifiedTime?: string;
  category?: string;
  productPrice?: string;
  productCurrency?: string;
  appUrl?: string;
}

const defaultTitle = 'StockFlow - Smart Inventory Management';
const defaultDescription = 'Manage your inventory easily, quickly and smartly with StockFlow. Cloud-based Inventory Management Platform for growing businesses.';
const defaultImage = '/Inventory-Management.png';
const defaultUrl = 'https://www.stockflowsystems.com';

// Normalize canonical URL (remove trailing slashes, query parameters, fragments)
const normalizeCanonicalUrl = (url: string): string => {
  try {
    const urlObj = new URL(url);
    // Remove trailing slashes from pathname (except for root)
    let pathname = urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/+$/, '');
    // Construct normalized URL without query params or hash
    return `${urlObj.protocol}//${urlObj.host}${pathname}`;
  } catch {
    // If URL parsing fails, try simple string normalization
    // Remove trailing slashes (except for root)
    let normalized = url === 'https://www.stockflowsystems.com/' || url === 'https://www.stockflowsystems.com' 
      ? 'https://www.stockflowsystems.com' 
      : url.replace(/\/+$/, '');
    // Remove query parameters and fragments
    normalized = normalized.split('?')[0].split('#')[0];
    return normalized;
  }
};

export const SEO: React.FC<SEOProps> = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = 'stockflow, stock flow, stockflow app, stockflow software, warehouse management system, WMS, inventory management, stock control, warehouse software, inventory tracking, warehouse automation, stock management software, warehouse operations, inventory control system, inventory tracking programs, softwares for inventory management, inventory and stock management software, manage inventory, inventory planning software',
  image = defaultImage,
  url = defaultUrl,
  structuredData,
  hreflang = [],
  alternateLanguages = [],
  locale = 'en',
  noindex = false,
  nofollow = false,
  publishedTime,
  modifiedTime,
  category,
  productPrice,
  productCurrency = 'EUR',
  appUrl,
}) => {
  const resolvedLocale = locale || 'en';
  const currentModifiedTime = modifiedTime || new Date().toISOString();
  const localeToHrefLang = (value: string) => {
    if (!value) {
      return 'en-US';
    }
    switch (value.toLowerCase()) {
      case 'nl':
      case 'nl-be':
        return 'nl-BE';
      case 'en':
      case 'en-us':
        return 'en-US';
      default:
        return value.includes('-') ? value : `${value}-${value.toUpperCase()}`;
    }
  };
  const localeToOgLocale = (value: string) => {
    if (!value) {
      return 'en_US';
    }
    switch (value.toLowerCase()) {
      case 'nl':
      case 'nl-be':
        return 'nl_BE';
      case 'en':
      case 'en-us':
        return 'en_US';
      default:
        return value.replace('-', '_');
    }
  };
  const defaultHrefLang = localeToHrefLang(resolvedLocale);
  const defaultOgLocale = localeToOgLocale(resolvedLocale);
  const robotsContent = noindex && nofollow
    ? 'noindex, nofollow'
    : noindex
      ? 'noindex'
      : nofollow
        ? 'nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  // Normalize canonical URL to ensure consistency (no trailing slashes, no query params)
  const normalizedUrl = normalizeCanonicalUrl(url);

  // SEO Validation: Warn if title or description exceed recommended lengths
  if (process.env.NODE_ENV === 'development') {
    if (title.length > 60) {
      console.warn(`[SEO] Title exceeds 60 characters (${title.length}): "${title.substring(0, 70)}..."`);
    }
    if (description.length > 160) {
      console.warn(`[SEO] Description exceeds 160 characters (${description.length}): "${description.substring(0, 170)}..."`);
    }
  }

  // Truncate title and description to enforce limits (prevent SEO issues)
  const optimizedTitle = title.length > 60 ? title.substring(0, 57) + '...' : title;
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;

  return (
    <Helmet>
      <title>{optimizedTitle}</title>
      <meta name="description" content={optimizedDescription} />
      <meta name="keywords" content={keywords} />
      <meta name="language" content={resolvedLocale} />
      <meta name="geo.region" content="BE" />
      <meta name="geo.placename" content="Belgium" />
      <meta name="geo.position" content="50.8503;4.3517" />
      <meta name="ICBM" content="50.8503, 4.3517" />
      
      {/* Enhanced Open Graph for better social sharing */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="StockFlow - Cloud-based Inventory Management Platform for SMEs" />
      <meta property="og:url" content={normalizedUrl} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={defaultOgLocale} />
      <meta property="og:site_name" content="StockFlow" />
      <meta property="og:updated_time" content={currentModifiedTime} />
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {category && <meta property="article:section" content={category} />}
      {category && <meta property="article:tag" content={category} />}
      
      {/* Product pricing meta tags - removed since platform is free */}
      
      {/* App linking meta tags */}
      {appUrl && (
        <>
          <meta property="al:web:url" content={appUrl} />
          <meta property="al:ios:url" content={appUrl} />
          <meta property="al:android:url" content={appUrl} />
        </>
      )}
      
      {/* Category meta tag */}
      {category && <meta name="category" content={category} />}
      
      {/* Business-specific Open Graph */}
      <meta property="business:contact_data:street_address" content="Belgium" />
      <meta property="business:contact_data:locality" content="Belgium" />
      <meta property="business:contact_data:region" content="Belgium" />
      <meta property="business:contact_data:postal_code" content="1000" />
      <meta property="business:contact_data:country_name" content="Belgium" />
      
      {/* Enhanced Twitter Cards */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:image:alt" content="StockFlow - Cloud-based Inventory Management Platform for SMEs" />
      <meta name="twitter:site" content="@stockflowapp" />
      <meta name="twitter:creator" content="@stockflowapp" />
      <meta name="twitter:domain" content="stockflowsystems.com" />
      
      {/* LinkedIn specific */}
      <meta property="linkedin:owner" content="stockflow" />
      
      {/* Facebook specific */}
      <meta property="fb:app_id" content="123456789" />
      <meta property="fb:admins" content="stockflow" />
      
      {/* Additional social media meta tags */}
      <meta name="pinterest-rich-pin" content="true" />
      <meta property="article:author" content="StockFlow" />
      <meta property="article:publisher" content="https://www.facebook.com/stockflowapp" />
      <meta property="article:section" content="Business Software" />
      <meta property="article:tag" content="stockflow, stock flow, inventory management, stock control, warehouse management" />
      
      {/* Canonical - normalized to remove trailing slashes and query parameters */}
      <link rel="canonical" href={normalizedUrl} />
      
      {/* Self-referencing hreflang */}
      <link rel="alternate" hrefLang={defaultHrefLang} href={normalizedUrl} />
      
      {/* Hreflang for international SEO */}
      {hreflang.map((hreflangItem) => (
        <link key={hreflangItem.lang} rel="alternate" hrefLang={hreflangItem.lang} href={normalizeCanonicalUrl(hreflangItem.url)} />
      ))}
      
      {/* Alternate languages */}
      {alternateLanguages.map((altLang) => (
        <link key={altLang.lang} rel="alternate" hrefLang={altLang.lang} href={normalizeCanonicalUrl(altLang.url)} />
      ))}
      
      {/* X-default for international targeting */}
      {alternateLanguages.length > 0 && (
        <link rel="alternate" hrefLang="x-default" href={normalizedUrl} />
      )}
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="StockFlow" />
      <meta name="revisit-after" content="7 days" />
      
      {/* Robots - Enhanced with proper handling */}
      <meta name="robots" content={robotsContent} />
      <meta name="googlebot" content={robotsContent} />
      <meta name="bingbot" content={robotsContent} />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      <meta name="theme-color" content="#2563eb" />
      
      {/* Performance & Resource Hints */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      <link rel="dns-prefetch" href="https://www.google-analytics.com" />
      
      {/* Enhanced Image SEO */}
      {image && (
        <>
          <meta property="og:image:secure_url" content={image.startsWith('http') ? image : `${defaultUrl}${image}`} />
          <meta name="twitter:image:src" content={image.startsWith('http') ? image : `${defaultUrl}${image}`} />
        </>
      )}
      
      {/* Content Security & Validation */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      
      {/* Structured Data */}
      {structuredData && (() => {
        try {
          const jsonString = JSON.stringify(structuredData, null, 0);
          return (
            <script 
              type="application/ld+json" 
              dangerouslySetInnerHTML={{ 
                __html: createTrustedHTML(jsonString) 
              }} 
            />
          );
        } catch (error) {
          console.warn('[SEO] Failed to stringify structured data:', error);
          return null;
        }
      })()}
    </Helmet>
  );
};

export default SEO; 
