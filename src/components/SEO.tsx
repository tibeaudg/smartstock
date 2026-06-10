import { Helmet } from 'react-helmet-async';
import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  canonical?: string;
  structuredData?: object | object[];
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

const defaultTitle = 'StockFlow - Free Inventory Management Software';
const defaultDescription = 'StockFlow is free inventory management software for small businesses. Track stock, barcode scanning, BOMs, and orders with no hidden costs.';
const defaultImage = '/Inventory-Management.png';
const defaultUrl = 'https://www.stockflowsystems.com';
const CANONICAL_HOST = 'www.stockflowsystems.com';
const LEGACY_BLOG_PREFIX = /^\/blog\/(.+)$/i;

const isDev = typeof import.meta !== 'undefined' ? import.meta.env?.DEV : process.env.NODE_ENV === 'development';

const sanitizeLegacyPath = (pathname: string): string => {
  if (!pathname) return '/';
  const match = pathname.match(LEGACY_BLOG_PREFIX);
  return match ? `/${match[1]}` : pathname;
};

const resolveAbsoluteUrl = (url: string): string => {
  if (!url) return defaultUrl;
  if (/^https?:\/\//i.test(url)) return url;
  const path = url.startsWith('/') ? url : `/${url}`;
  return `${defaultUrl}${path}`;
};

// Normalize canonical URL (remove trailing slashes, query parameters, fragments)
const normalizeCanonicalUrl = (url: string): string => {
  const absoluteUrl = resolveAbsoluteUrl(url);
  try {
    const urlObj = new URL(absoluteUrl);
    const protocol = urlObj.protocol === 'http:' ? 'https:' : urlObj.protocol;
    // Remove trailing slashes from pathname (except for root)
    let pathname = urlObj.pathname === '/' ? '/' : urlObj.pathname.replace(/\/+$/, '');
    pathname = sanitizeLegacyPath(pathname);
    const host = urlObj.host === 'stockflowsystems.com' ? CANONICAL_HOST : urlObj.host;
    // Construct normalized URL without query params or hash
    return `${protocol}//${host}${pathname}`;
  } catch {
    // If URL parsing fails, try simple string normalization
    // Remove trailing slashes (except for root)
    let normalized = absoluteUrl === 'https://www.stockflowsystems.com/' || absoluteUrl === 'https://www.stockflowsystems.com'
      ? 'https://www.stockflowsystems.com'
      : absoluteUrl.replace(/\/+$/, '');
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
  canonical,
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
  const currentModifiedTime = modifiedTime;
  const imageUrl = image?.startsWith('http')
    ? image
    : `${defaultUrl}${image?.startsWith('/') ? '' : '/'}${image}`;
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
      ? 'noindex, follow'
      : nofollow
        ? 'nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1';

  // Canonical URL handling:
  // - Support `canonical` as an alias for `url` (older call sites use it)
  // - If neither is set (or url is left at the default), fall back to the current browser URL
  const canonicalCandidate = canonical ?? url;
  const runtimeUrl =
    (canonicalCandidate === defaultUrl || !canonicalCandidate) && typeof window !== 'undefined'
      ? window.location.href
      : canonicalCandidate;

  // Normalize canonical URL to ensure consistency (no trailing slashes, no query params)
  const normalizedUrl = normalizeCanonicalUrl(runtimeUrl);
  const normalizedCurrentPath =
    typeof window !== 'undefined'
      ? sanitizeLegacyPath(window.location.pathname === '/' ? '/' : window.location.pathname.replace(/\/+$/, ''))
      : null;

  // SEO Validation: Warn if title or description exceed recommended lengths
  if (isDev) {
    if (title.length > 60) {
      console.warn(`[SEO] Title exceeds 60 characters (${title.length}): "${title.substring(0, 70)}..."`);
    }
    if (description.length > 160) {
      console.warn(`[SEO] Description exceeds 160 characters (${description.length}): "${description.substring(0, 170)}..."`);
    }
    if (normalizedCurrentPath) {
      const canonicalPath = new URL(normalizedUrl).pathname;
      if (canonicalPath !== normalizedCurrentPath) {
        console.warn(`[SEO] Canonical mismatch: canonical "${canonicalPath}" vs current "${normalizedCurrentPath}"`);
      }
    }
    if (noindex && normalizedUrl === defaultUrl) {
      console.warn('[SEO] noindex used with default canonical; ensure URL is page-specific.');
    }
  }

  // Let Google handle display truncation — pre-truncating with "..." harms CTR
  const optimizedTitle = title;
  const optimizedDescription = description.length > 160 ? description.substring(0, 157) + '...' : description;
  const plainTitle = optimizedTitle.replace(/\s*\|\s*StockFlow\s*$/i, '').trim();
  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": [
      {
        "@type": "ListItem",
        "position": 1,
        "name": "Home",
        "item": "https://www.stockflowsystems.com"
      },
      ...(normalizedUrl !== "https://www.stockflowsystems.com"
        ? [{
            "@type": "ListItem",
            "position": 2,
            "name": plainTitle || "Page",
            "item": normalizedUrl
          }]
        : [])
    ]
  };

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
      <meta property="og:title" content={optimizedTitle} />
      <meta property="og:description" content={optimizedDescription} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content="StockFlow - Cloud-based Inventory Management Platform for SMEs" />
      <meta property="og:url" content={normalizedUrl} />
      <meta property="og:type" content={publishedTime ? 'article' : 'website'} />
      <meta property="og:locale" content={defaultOgLocale} />
      <meta property="og:site_name" content="StockFlow" />
      {currentModifiedTime && <meta property="og:updated_time" content={currentModifiedTime} />}
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
      <meta name="twitter:title" content={optimizedTitle} />
      <meta name="twitter:description" content={optimizedDescription} />
      <meta name="twitter:image" content={imageUrl} />
      <meta name="twitter:image:alt" content="StockFlow - Cloud-based Inventory Management Platform for SMEs" />
      <meta name="twitter:site" content="@stockflowapp" />
      <meta name="twitter:creator" content="@stockflowapp" />
      <meta name="twitter:domain" content="stockflowsystems.com" />
      
      {/* LinkedIn specific */}
      <meta property="linkedin:owner" content="stockflow" />
      
      {/* Additional social media meta tags */}
      <meta name="pinterest-rich-pin" content="true" />
      {publishedTime && (
        <>
          <meta property="article:author" content="StockFlow" />
          <meta property="article:publisher" content="https://www.facebook.com/stockflowapp" />
        </>
      )}
      {/* Canonical - normalized to remove trailing slashes and query parameters */}
      <link rel="canonical" href={normalizedUrl} />
      
      {/* Hreflang for international SEO */}
      {(() => {
        const allAlternates = [...hreflang, ...alternateLanguages];
        const hasSelfHreflang = allAlternates.some((a) => a.lang === defaultHrefLang);
        const enAlternate = allAlternates.find((a) => a.lang === 'en-US');
        const xDefaultUrl =
          allAlternates.find((a) => a.lang === 'x-default')?.url ??
          enAlternate?.url ??
          normalizedUrl;

        return (
          <>
            {!hasSelfHreflang && (
              <link rel="alternate" hrefLang={defaultHrefLang} href={normalizedUrl} />
            )}
            {hreflang.map((hreflangItem) => {
              const normalizedAlt = normalizeCanonicalUrl(hreflangItem.url);
              return (
                <link key={hreflangItem.lang} rel="alternate" hrefLang={hreflangItem.lang} href={normalizedAlt} />
              );
            })}
            {alternateLanguages.map((altLang) => {
              const normalizedAlt = normalizeCanonicalUrl(altLang.url);
              return (
                <link key={altLang.lang} rel="alternate" hrefLang={altLang.lang} href={normalizedAlt} />
              );
            })}
            {allAlternates.length > 0 &&
              !allAlternates.some((a) => a.lang === 'x-default') && (
              <link rel="alternate" hrefLang="x-default" href={normalizeCanonicalUrl(xDefaultUrl)} />
            )}
          </>
        );
      })()}
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="StockFlow" />
      
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
          <meta property="og:image:secure_url" content={imageUrl} />
          <meta name="twitter:image:src" content={imageUrl} />
        </>
      )}
      
      {/* Content Security & Validation */}
      <meta httpEquiv="x-dns-prefetch-control" content="on" />
      
      
      {/* Structured Data */}
      {structuredData && (() => {
        try {
          const isPassthrough =
            !Array.isArray(structuredData) &&
            typeof structuredData === 'object' &&
            ('@graph' in structuredData ||
              (structuredData as { '@type'?: string })['@type'] === 'WebPage');
          const finalData = isPassthrough
            ? structuredData
            : (() => {
                const dataArray = Array.isArray(structuredData) ? structuredData : [structuredData];
                const hasBreadcrumb = dataArray.some((item: any) => item?.['@type'] === 'BreadcrumbList');
                return hasBreadcrumb ? dataArray : [...dataArray, breadcrumbSchema];
              })();
          const jsonString = JSON.stringify(finalData, null, 0);
          return (
            <script type="application/ld+json">{jsonString}</script>
          );
        } catch (error) {
          console.warn('[SEO] Failed to stringify structured data:', error);
          return null;
        }
      })()}

      {/* Default Breadcrumb Structured Data when no custom schema exists */}
      {!structuredData && (() => {
        try {
          const jsonString = JSON.stringify([breadcrumbSchema], null, 0);
          return (
            <script type="application/ld+json">{jsonString}</script>
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
