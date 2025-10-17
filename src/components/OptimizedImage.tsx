import React, { useState, useEffect, useRef } from 'react';

interface OptimizedImageProps {
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  priority?: boolean;
  sizes?: string;
  objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  onLoad?: () => void;
  onError?: () => void;
}

export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  width,
  height,
  className = '',
  priority = false,
  sizes = '100vw',
  objectFit = 'cover',
  onLoad,
  onError,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  // Generate WebP and AVIF sources if available
  const getOptimizedSources = (originalSrc: string) => {
    const pathWithoutExt = originalSrc.replace(/\.[^/.]+$/, '');
    const ext = originalSrc.split('.').pop();
    
    return {
      avif: `${pathWithoutExt}.avif`,
      webp: `${pathWithoutExt}.webp`,
      original: originalSrc,
      ext,
    };
  };

  const sources = getOptimizedSources(src);

  useEffect(() => {
    // Intersection Observer for lazy loading
    if (!priority && imgRef.current) {
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              const img = entry.target as HTMLImageElement;
              if (img.dataset.src) {
                img.src = img.dataset.src;
                img.removeAttribute('data-src');
              }
              observer.unobserve(img);
            }
          });
        },
        {
          rootMargin: '50px 0px',
          threshold: 0.01,
        }
      );

      if (imgRef.current) {
        observer.observe(imgRef.current);
      }

      return () => {
        if (imgRef.current) {
          observer.unobserve(imgRef.current);
        }
      };
    }
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
    onLoad?.();
  };

  const handleError = () => {
    setHasError(true);
    onError?.();
  };

  return (
    <picture>
      {/* AVIF format (best compression) */}
      <source
        type="image/avif"
        srcSet={priority ? sources.avif : undefined}
        data-srcset={!priority ? sources.avif : undefined}
        sizes={sizes}
      />
      
      {/* WebP format (good compression, wide support) */}
      <source
        type="image/webp"
        srcSet={priority ? sources.webp : undefined}
        data-srcset={!priority ? sources.webp : undefined}
        sizes={sizes}
      />
      
      {/* Original format (fallback) */}
      <img
        ref={imgRef}
        src={priority ? sources.original : undefined}
        data-src={!priority ? sources.original : undefined}
        alt={alt}
        width={width}
        height={height}
        className={`${className} ${isLoaded ? 'loaded' : 'loading'} ${
          hasError ? 'error' : ''
        }`}
        style={{
          objectFit,
          transition: 'opacity 0.3s ease-in-out',
          opacity: isLoaded ? 1 : 0,
        }}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        onLoad={handleLoad}
        onError={handleError}
        fetchPriority={priority ? 'high' : 'low'}
      />
    </picture>
  );
};

export default OptimizedImage;
