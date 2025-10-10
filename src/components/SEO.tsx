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
}

const defaultTitle = 'StockFlow - Smart Inventory Management';
const defaultDescription = 'Manage your inventory easily, quickly and smartly with StockFlow. Free inventory management software for growing businesses.';
const defaultImage = '/Inventory-Management.png';
const defaultUrl = 'https://www.stockflow.be';

export const SEO: React.FC<SEOProps> = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = 'warehouse management system, WMS, inventory management, stock control, warehouse software, inventory tracking, warehouse automation, stock management software, warehouse operations, inventory control system',
  image = defaultImage,
  url = defaultUrl,
  structuredData,
  hreflang = [],
  alternateLanguages = [],
  locale = 'en',
  noindex = false,
  nofollow = false,
}) => {
  // Detect browser language for SEO
  const getBrowserLanguage = () => {
    if (typeof window === 'undefined') return 'en';
    const browserLang = navigator.language || (navigator as any).userLanguage;
    const primaryLang = browserLang.split('-')[0];
    return primaryLang === 'nl' ? 'nl' : 'en';
  };
  
  const currentLang = getBrowserLanguage();
  const actualLocale = locale === 'en' ? currentLang : locale;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="language" content={actualLocale} />
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
      <meta property="og:image:alt" content="StockFlow - Free Inventory Management Software for SMEs" />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={actualLocale} />
      <meta property="og:site_name" content="StockFlow" />
      <meta property="og:updated_time" content={new Date().toISOString()} />
      
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
      <meta name="twitter:image:alt" content="StockFlow - Free Inventory Management Software for SMEs" />
      <meta name="twitter:site" content="@stockflowapp" />
      <meta name="twitter:creator" content="@stockflowapp" />
      <meta name="twitter:domain" content="stockflow.be" />
      
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
      <meta property="article:tag" content="inventory management, stock control, warehouse management" />
      
      {/* Canonical */}
      <link rel="canonical" href={url} />
      
      {/* Hreflang for international SEO */}
      {hreflang.map((hreflangItem) => (
        <link key={hreflangItem.lang} rel="alternate" hrefLang={hreflangItem.lang} href={hreflangItem.url} />
      ))}
      
      {/* Alternate languages */}
      {alternateLanguages.map((altLang) => (
        <link key={altLang.lang} rel="alternate" hrefLang={altLang.lang} href={altLang.url} />
      ))}
      
      {/* Robots */}
      {noindex && <meta name="robots" content="noindex" />}
      {nofollow && <meta name="robots" content="nofollow" />}
      
      {/* Additional SEO meta tags */}
      <meta name="author" content="StockFlow" />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1" />
      <meta name="googlebot" content="index, follow" />
      <meta name="bingbot" content="index, follow" />
      
      {/* Mobile optimization */}
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="default" />
      
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
