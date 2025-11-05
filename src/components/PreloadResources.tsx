import { Helmet } from 'react-helmet-async';
import React from 'react';

interface PreloadResourcesProps {
  criticalImages?: string[];
  criticalFonts?: string[];
  criticalCSS?: string[];
  prefetchRoutes?: string[];
}

export const PreloadResources: React.FC<PreloadResourcesProps> = ({
  criticalImages = [],
  criticalFonts = [],
  criticalCSS = [],
  prefetchRoutes = []
}) => {
  return (
    <Helmet>
      {/* Preload critical images - only preload if they're not already in index.html */}
      {/* Note: logo.png and newmobile.png are already preloaded in index.html */}
      {criticalImages
        .filter(img => !['/logo.png', '/newmobile.png'].includes(img))
        .map((image, index) => (
          <link
            key={`image-${index}`}
            rel="preload"
            as="image"
            href={image}
          />
        ))}
      
      {/* Preload critical fonts - only if they exist and are used */}
      {/* Note: Google Fonts CSS files should use preconnect instead of preload */}
      {criticalFonts
        .filter(font => font.endsWith('.woff2') || font.endsWith('.woff'))
        .map((font, index) => (
          <link
            key={`font-${index}`}
            rel="preload"
            href={font}
            as="font"
            type="font/woff2"
            crossOrigin="anonymous"
          />
        ))}
      
      {/* Preload critical CSS - only if it exists as a static file */}
      {criticalCSS.map((css, index) => (
        <link
          key={`css-${index}`}
          rel="preload"
          href={css}
          as="style"
        />
      ))}
      
      {/* Resource hints are managed in index.html to avoid duplicates */}
      
      {/* Prefetch common routes for faster navigation */}
      <link rel="prefetch" href="/pricing" />
      <link rel="prefetch" href="/features" />
      <link rel="prefetch" href="/voorraadbeheer-tips" />
      <link rel="prefetch" href="/voorraadbeheer-software-vergelijken" />
      {prefetchRoutes.map((route, index) => (
        <link key={`route-${index}`} rel="prefetch" href={route} />
      ))}
    </Helmet>
  );
};

export default PreloadResources; 
