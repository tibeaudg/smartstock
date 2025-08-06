import { Helmet } from 'react-helmet-async';
import React from 'react';

interface PreloadResourcesProps {
  criticalImages?: string[];
  criticalFonts?: string[];
  criticalCSS?: string[];
}

export const PreloadResources: React.FC<PreloadResourcesProps> = ({
  criticalImages = [],
  criticalFonts = [],
  criticalCSS = []
}) => {
  return (
    <Helmet>
      {/* Preload critical images */}
      {criticalImages.map((image, index) => (
        <link
          key={`image-${index}`}
          rel="preload"
          as="image"
          href={image}
          type="image/webp"
        />
      ))}
      
      {/* Preload critical fonts */}
      {criticalFonts.map((font, index) => (
        <link
          key={`font-${index}`}
          rel="preload"
          href={font}
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      ))}
      
      {/* Preload critical CSS */}
      {criticalCSS.map((css, index) => (
        <link
          key={`css-${index}`}
          rel="preload"
          href={css}
          as="style"
        />
      ))}
      
      {/* DNS prefetch for external domains */}
      <link rel="dns-prefetch" href="//fonts.googleapis.com" />
      <link rel="dns-prefetch" href="//fonts.gstatic.com" />
      <link rel="dns-prefetch" href="//www.google-analytics.com" />
      
      {/* Preconnect to external domains */}
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      
      {/* Resource hints for performance */}
      <link rel="prefetch" href="/voorraadbeheer-tips" />
      <link rel="prefetch" href="/magazijnbeheer-tips" />
      <link rel="prefetch" href="/voorraadbeheer-software-vergelijken" />
    </Helmet>
  );
};

export default PreloadResources; 