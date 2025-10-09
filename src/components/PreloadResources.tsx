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
      {/* Preload critical images with modern formats */}
      {criticalImages.map((image, index) => {
        const avifPath = image.replace(/\.(jpg|jpeg|png|webp)$/i, '.avif');
        const webpPath = image.replace(/\.(jpg|jpeg|png)$/i, '.webp');
        
        return (
          <React.Fragment key={`image-${index}`}>
            <link
              rel="preload"
              as="image"
              href={avifPath}
              type="image/avif"
              imageSrcset={`${avifPath} 1x`}
            />
            <link
              rel="preload"
              as="image"
              href={webpPath}
              type="image/webp"
              imageSrcset={`${webpPath} 1x`}
            />
          </React.Fragment>
        );
      })}
      
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
      
      {/* Resource hints are managed in index.html to avoid duplicates */}
      
      {/* Prefetch common routes for faster navigation */}
      <link rel="prefetch" href="/pricing" />
      <link rel="prefetch" href="/features" />
      <link rel="prefetch" href="/voorraadbeheer-tips" />
      <link rel="prefetch" href="/voorraadbeheer-software-vergelijken" />
      {prefetchRoutes.map((route, index) => (
        <link key={`route-${index}`} rel="prefetch" href={route} />
      ))}
      
      {/* Prerender for authenticated dashboard (low priority) */}
      <link rel="prerender" href="/dashboard" />
    </Helmet>
  );
};

export default PreloadResources; 
