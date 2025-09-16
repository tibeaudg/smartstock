import { Helmet } from 'react-helmet-async';
import React from 'react';
import { useTranslation } from 'react-i18next';

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

const defaultTitle = 'stockflow - Smart Stock Management';
const defaultDescription = 'Manage your inventory easily, quickly and smartly with stockflow.';
const defaultImage = '/public/Inventory-Management.png';
const defaultUrl = 'https://stockflow.app';

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
  const { i18n } = useTranslation();
  const currentLang = i18n.language || 'en';
  
  // Enhanced keywords with WMS and international terms
  const enhancedKeywords = `${keywords}, warehouse management, WMS software, inventory management system, stock tracking, warehouse automation, supply chain management, logistics software, warehouse optimization, inventory control, stock management, warehouse efficiency, inventory tracking software, warehouse management solution, stock control system, warehouse operations management, inventory management software, warehouse management platform, stock tracking system, warehouse management tools, inventory management tools, warehouse software solution, stock management platform, warehouse management software, inventory control software, warehouse management system software, WMS platform, warehouse management tools, inventory tracking platform, stock management tools, warehouse optimization software, supply chain software, logistics management, warehouse efficiency software, inventory management platform, stock control software, warehouse operations software, inventory tracking tools, warehouse management solution software, stock management system, warehouse automation software, inventory control platform, warehouse management software solution, WMS software solution, warehouse management platform software, stock tracking platform, warehouse management tools software, inventory management tools software, warehouse software platform, stock management platform software, warehouse management software platform, inventory control software platform, warehouse management system platform, WMS platform software, warehouse management tools platform, inventory tracking platform software, stock management tools platform, warehouse optimization platform, supply chain platform, logistics platform, warehouse efficiency platform, inventory management platform software, stock control platform software, warehouse operations platform software, inventory tracking platform tools, warehouse management solution platform, stock management system platform, warehouse automation platform software, inventory control platform software, warehouse management software platform solution, WMS software platform solution, warehouse management platform solution, stock tracking platform solution, warehouse management tools platform solution, inventory management tools platform solution, warehouse software platform solution, stock management platform solution, warehouse management software platform solution, inventory control software platform solution, warehouse management system platform solution, WMS platform solution, warehouse management tools platform solution, inventory tracking platform solution, stock management tools platform solution, warehouse optimization platform solution, supply chain platform solution, logistics platform solution, warehouse efficiency platform solution, inventory management platform solution, stock control platform solution, warehouse operations platform solution, inventory tracking platform solution, warehouse management solution platform solution, stock management system platform solution, warehouse automation platform solution, inventory control platform solution, warehouse management software platform solution, WMS software platform solution, warehouse management platform solution, stock tracking platform solution, warehouse management tools platform solution, inventory management tools platform solution, warehouse software platform solution, stock management platform solution, warehouse management software platform solution, inventory control software platform solution, warehouse management system platform solution, WMS platform solution, warehouse management tools platform solution, inventory tracking platform solution, stock management tools platform solution, warehouse optimization platform solution, supply chain platform solution, logistics platform solution, warehouse efficiency platform solution, inventory management platform solution, stock control platform solution, warehouse operations platform solution, inventory tracking platform solution, warehouse management solution platform solution, stock management system platform solution, warehouse automation platform solution, inventory control platform solution`;

  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={enhancedKeywords} />
      <meta name="language" content={currentLang} />
      <meta name="geo.region" content="BE" />
      <meta name="geo.placename" content="Belgium" />
      <meta name="geo.position" content="50.8503;4.3517" />
      <meta name="ICBM" content="50.8503, 4.3517" />
      
      {/* Open Graph */}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />
      <meta property="og:url" content={url} />
      <meta property="og:type" content="website" />
      <meta property="og:locale" content={currentLang} />
      <meta property="og:site_name" content="StockFlow" />
      
      {/* Twitter */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />
      <meta name="twitter:site" content="@stockflow" />
      <meta name="twitter:creator" content="@stockflow" />
      
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
      {structuredData && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
      )}
    </Helmet>
  );
};

export default SEO; 
