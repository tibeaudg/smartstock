import { Helmet } from 'react-helmet-async';
import React from 'react';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  structuredData?: object; // Nieuw: extra structured data als JSON object
}

const defaultTitle = 'stockflow - Slim Voorraadbeheer';
const defaultDescription = 'Beheer je voorraad eenvoudig, snel en slim met stockflow.';
const defaultImage = '/public/Inventory-Management.png';
const defaultUrl = 'https://stockflow.app';

export const SEO: React.FC<SEOProps> = ({
  title = defaultTitle,
  description = defaultDescription,
  keywords = 'voorraadbeheer, stock, inventaris, MKB, magazijn, stockflow',
  image = defaultImage,
  url = defaultUrl,
  structuredData,
}) => (
  <Helmet>
    <title>{title}</title>
    <meta name="description" content={description} />
    <meta name="keywords" content={keywords} />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={image} />
    <meta property="og:url" content={url} />
    <meta property="og:type" content="website" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={image} />
    <link rel="canonical" href={url} />
    {structuredData && (
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }} />
    )}
  </Helmet>
);

export default SEO; 